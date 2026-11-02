import type { ComponentPage, Declaration, EntryPoint, GuidePage, Manifest, Section, TypeDefinition } from './manifest';

export interface ResolvedComponent {
    page: ComponentPage;
    entryPoints: EntryPoint[];
    declarations: (Declaration & { import: string })[];
    /** The declaration the query named, when it was a selector or class name rather than a page name. */
    focus?: Declaration;
}

export interface SearchHit {
    kind: 'component' | 'directive' | 'input' | 'output' | 'type' | 'example' | 'guide';
    title: string;
    summary: string;
    /** The tool call that returns the full details. */
    next: string;
    score: number;
}

interface SearchDocument extends Omit<SearchHit, 'score'> {
    label: string;
    text: string;
    weight: number;
}

/**
 * Lookups and search over the manifest. Everything the MCP tools return goes through here, so it is the part the tests cover.
 */
export class Catalog {
    readonly manifest: Manifest;
    private readonly entries: Map<string, EntryPoint>;
    private readonly pagesByKey = new Map<string, ComponentPage>();
    private readonly declarationsByKey = new Map<string, { declaration: Declaration; entry: EntryPoint }>();
    /** Exact selector spellings: `p-button` and `pButton` normalize to the same key but are different declarations. */
    private readonly declarationsBySelector = new Map<string, { declaration: Declaration; entry: EntryPoint }>();
    private readonly typesByName = new Map<string, TypeDefinition & { import: string }>();
    private readonly pageByEntry = new Map<string, ComponentPage>();
    private documents?: SearchDocument[];

    constructor(manifest: Manifest) {
        this.manifest = manifest;
        this.entries = new Map(manifest.entryPoints.map((entry) => [entry.name, entry]));

        for (const page of manifest.components) {
            this.pagesByKey.set(key(page.name), page);
            this.pagesByKey.set(key(page.title), page);
            for (const entry of page.entryPoints ?? []) if (!this.pageByEntry.has(entry)) this.pageByEntry.set(entry, page);
        }

        for (const entry of manifest.entryPoints) {
            for (const declaration of entry.declarations ?? []) {
                for (const name of selectorNames(declaration.selector)) {
                    if (!this.declarationsBySelector.has(name)) this.declarationsBySelector.set(name, { declaration, entry });
                }
                for (const k of [key(declaration.className), ...selectorKeys(declaration.selector)]) {
                    if (!this.declarationsByKey.has(k)) this.declarationsByKey.set(k, { declaration, entry });
                }
            }
            for (const type of [...(entry.classes ?? []), ...(entry.types ?? [])]) {
                if (!this.typesByName.has(type.name)) this.typesByName.set(type.name, { ...type, import: entry.import });
            }
        }
    }

    listComponents() {
        return this.manifest.components.map((page) => ({
            name: page.name,
            title: page.title,
            description: page.description,
            selectors: this.resolveEntries(page).flatMap((entry) => (entry.declarations ?? []).map((d) => primarySelector(d.selector)))
        }));
    }

    listGuides() {
        return this.manifest.guides.map(({ name, title, description }) => ({ name, title, description }));
    }

    /**
     * Find a component page by its docs name (`select`), title (`Toggle Switch`), selector (`p-select`, `pTooltip`, `[pButton]`)
     * or class name (`ButtonDirective`).
     */
    resolveComponent(query: string): ResolvedComponent | undefined {
        const k = key(query);
        let page = this.pagesByKey.get(k);
        let focus: Declaration | undefined;

        if (!page) {
            const exact = query.trim().replace(/^[[<]|[\]>]$/g, '');
            const match = this.declarationsBySelector.get(exact) ?? this.declarationsByKey.get(k) ?? this.declarationsByKey.get(key(`p-${query}`));
            if (match) {
                focus = match.declaration;
                page = this.pageByEntry.get(match.entry.name);
                if (!page) {
                    // Declarations without a docs page (internal icons and helpers) still have an API worth returning
                    return {
                        page: { name: match.entry.name, title: match.declaration.className, description: match.declaration.description ?? '', url: this.manifest.site, markdown: '' },
                        entryPoints: [match.entry],
                        declarations: [{ ...match.declaration, import: match.entry.import }],
                        focus
                    };
                }
            }
        }
        if (!page) return undefined;

        const entryPoints = this.resolveEntries(page);
        const listed = page.api ?? [];
        const rank = (name: string) => (listed.includes(name) ? listed.indexOf(name) : listed.length);
        const declarations = entryPoints.flatMap((entry) => (entry.declarations ?? []).map((d) => ({ ...d, import: entry.import }))).sort((a, b) => rank(a.className) - rank(b.className));

        return { page, entryPoints, declarations, focus };
    }

    /** Close matches for a name that did not resolve, to suggest in the error. */
    suggest(query: string, limit = 5): string[] {
        const k = key(query);
        const names = [...new Set(this.manifest.components.map((p) => p.name))];
        return names
            .map((name) => ({ name, distance: name.includes(k) || k.includes(name) ? 0 : levenshtein(k, name) }))
            .sort((a, b) => a.distance - b.distance)
            .slice(0, limit)
            .map((s) => s.name);
    }

    getType(name: string): (TypeDefinition & { import: string }) | undefined {
        if (this.typesByName.has(name)) return this.typesByName.get(name);
        const k = key(name);
        return [...this.typesByName.values()].find((t) => key(t.name) === k);
    }

    getGuide(name: string): GuidePage | undefined {
        const k = key(name);
        return this.manifest.guides.find((g) => key(g.name) === k || key(g.title) === k);
    }

    getSection(page: { sections?: Section[] }, sectionId: string): Section | undefined {
        const k = key(sectionId);
        return page.sections?.find((s) => key(s.id) === k || key(s.label) === k);
    }

    search(query: string, limit = 10): SearchHit[] {
        const terms = tokenize(query);
        if (terms.length === 0) return [];
        const documents = (this.documents ??= this.buildDocuments());

        const hits: SearchHit[] = [];
        for (const doc of documents) {
            const label = doc.label.toLowerCase();
            const text = doc.text.toLowerCase();
            let score = 0;
            let matched = 0;
            for (const term of terms) {
                if (label === term) score += 10;
                else if (label.split(/[\s.,/()[\]-]+/).includes(term)) score += 5;
                else if (label.includes(term)) score += 3;
                else if (text.includes(term)) score += 1;
                else continue;
                matched++;
            }
            if (matched === 0) continue;
            // Prefer documents that match every term
            score = (score * doc.weight * matched) / terms.length;
            hits.push({ kind: doc.kind, title: doc.title, summary: doc.summary, next: doc.next, score });
        }

        return hits.sort((a, b) => b.score - a.score).slice(0, limit);
    }

    private resolveEntries(page: ComponentPage): EntryPoint[] {
        return (page.entryPoints ?? []).map((name) => this.entries.get(name)).filter((e): e is EntryPoint => !!e);
    }

    private buildDocuments(): SearchDocument[] {
        const docs: SearchDocument[] = [];
        const componentCall = (name: string) => `get_component({ "name": "${name}" })`;

        for (const page of this.manifest.components) {
            const selectors = this.resolveEntries(page).flatMap((e) => (e.declarations ?? []).map((d) => d.selector));
            docs.push({ kind: 'component', title: page.title, summary: page.description, next: componentCall(page.name), label: `${page.title} ${page.name} ${selectors.join(' ')}`, text: page.description, weight: 3 });
            for (const section of page.sections ?? []) {
                if (!section.examples?.typescript) continue;
                docs.push({
                    kind: 'example',
                    title: `${page.title}: ${section.label}`,
                    summary: truncate(section.description ?? '', 160),
                    next: `get_example({ "component": "${page.name}", "section": "${section.id}" })`,
                    label: `${page.title} ${section.label}`,
                    text: section.description ?? '',
                    weight: 1.2
                });
            }
        }

        for (const entry of this.manifest.entryPoints) {
            const page = this.pageByEntry.get(entry.name);
            const next = componentCall(page?.name ?? entry.name);
            for (const d of entry.declarations ?? []) {
                docs.push({ kind: d.kind, title: `${d.className} (${primarySelector(d.selector)})`, summary: d.description ?? '', next, label: `${d.className} ${d.selector}`, text: d.description ?? '', weight: 2 });
                for (const input of d.inputs ?? []) {
                    const type = input.values ? input.values.map((v) => JSON.stringify(v)).join(' | ') : input.type;
                    docs.push({
                        kind: 'input',
                        title: `${primarySelector(d.selector)} [${input.name}]`,
                        summary: `${type ?? ''}${input.description ? ` — ${input.description}` : ''}`,
                        next,
                        label: `${input.name} ${d.className}`,
                        text: input.description ?? '',
                        weight: 1
                    });
                }
                for (const output of d.outputs ?? []) {
                    docs.push({
                        kind: 'output',
                        title: `${primarySelector(d.selector)} (${output.name})`,
                        summary: `${output.payload ?? ''}${output.description ? ` — ${output.description}` : ''}`,
                        next,
                        label: `${output.name} ${d.className}`,
                        text: output.description ?? '',
                        weight: 1
                    });
                }
            }
            for (const type of [...(entry.classes ?? []), ...(entry.types ?? [])]) {
                const members = (type.properties ?? type.members ?? []).map((m) => m.name).join(' ');
                docs.push({ kind: 'type', title: `${type.name} (${type.kind})`, summary: type.description ?? '', next: `get_type({ "name": "${type.name}" })`, label: type.name, text: `${type.description ?? ''} ${members}`, weight: 1.5 });
            }
        }

        for (const guide of this.manifest.guides) {
            docs.push({ kind: 'guide', title: guide.title, summary: guide.description, next: `get_guide({ "name": "${guide.name}" })`, label: `${guide.title} ${guide.name}`, text: guide.description, weight: 2.5 });
            for (const section of guide.sections ?? []) {
                docs.push({
                    kind: 'guide',
                    title: `${guide.title}: ${section.label}`,
                    summary: truncate(section.description ?? '', 160),
                    next: `get_guide({ "name": "${guide.name}", "section": "${section.id}" })`,
                    label: section.label,
                    text: section.description ?? '',
                    weight: 1
                });
            }
        }

        return docs;
    }
}

/** Lowercase alphanumerics only, so `p-select`, `pSelect`, `[pSelect]` and `Select` compare equal where they should. */
export function key(value: string): string {
    return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

const NATIVE_ELEMENTS = new Set(['input', 'textarea', 'button', 'a', 'div', 'span', 'img', 'ng-template', 'ng-container']);

/** Element and attribute names in a selector, as written: `button[pButton], p-button` -> pButton, p-button. */
function selectorNames(selector: string): string[] {
    return (selector.match(/[a-zA-Z][\w-]*/g) ?? []).filter((n) => !NATIVE_ELEMENTS.has(n));
}

function selectorKeys(selector: string): string[] {
    return selectorNames(selector).map(key);
}

export function primarySelector(selector: string): string {
    return selector.split(',')[0].trim();
}

function tokenize(query: string): string[] {
    return query
        .toLowerCase()
        .split(/[\s,]+/)
        .map((t) => t.replace(/^[[(<]+|[\])>]+$/g, ''))
        .filter(Boolean);
}

function truncate(text: string, length: number): string {
    return text.length > length ? `${text.slice(0, length - 1)}…` : text;
}

function levenshtein(a: string, b: string): number {
    const row = Array.from({ length: b.length + 1 }, (_, i) => i);
    for (let i = 1; i <= a.length; i++) {
        let previous = row[0];
        row[0] = i;
        for (let j = 1; j <= b.length; j++) {
            const current = row[j];
            row[j] = Math.min(row[j] + 1, row[j - 1] + 1, previous + (a[i - 1] === b[j - 1] ? 0 : 1));
            previous = current;
        }
    }
    return row[b.length];
}
