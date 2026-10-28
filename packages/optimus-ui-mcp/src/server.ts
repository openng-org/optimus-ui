import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { Catalog, primarySelector, type ResolvedComponent } from './catalog';
import type { Declaration, Manifest, Section, TypeDefinition } from './manifest';

const INSTRUCTIONS = `Optimus UI (@openng/optimus-ui) is a community-maintained, MIT-licensed continuation of PrimeNG for Angular.
Its API is close to PrimeNG v21 but not identical: look components up here instead of relying on memory of PrimeNG.

- search: find the component, input, type or guide for a task ("date range", "pTooltip position", "MenuItem").
- get_component: import statements, selectors, inputs (allowed values, defaults, two-way bindings), outputs, templates and the list of examples.
- get_example: the full code of one docs example; copy its imports and structure.
- get_type: shapes such as MenuItem, TreeNode, SelectItem, DynamicDialogConfig.
- get_guide: installation, configuration, theming, Tailwind, pass-through, accessibility, PrimeNG migration.`;

const READ_ONLY = { readOnlyHint: true, openWorldHint: false } as const;

export function createServer(manifest: Manifest): McpServer {
    const catalog = new Catalog(manifest);
    const server = new McpServer({ name: 'optimus-ui', version: manifest.version }, { instructions: INSTRUCTIONS });

    server.registerTool(
        'list_components',
        {
            title: 'List Optimus UI components',
            description: 'Every documented Optimus UI component and directive, with its selectors and a one-line summary.',
            annotations: READ_ONLY
        },
        async () =>
            text(
                catalog
                    .listComponents()
                    .map((c) => `- ${c.name}: ${c.title}${c.selectors.length ? ` (${c.selectors.join(', ')})` : ''} — ${c.description}`)
                    .join('\n')
            )
    );

    server.registerTool(
        'search',
        {
            title: 'Search Optimus UI',
            description: 'Search components, selectors, inputs, outputs, types, examples and guides. Each hit says which tool call returns the details.',
            inputSchema: {
                query: z.string().min(1).describe('Words to look for, e.g. "multiple selection table", "tooltipPosition", "dark mode"'),
                limit: z.number().int().min(1).max(50).optional().describe('Maximum number of hits (default 10)')
            },
            annotations: READ_ONLY
        },
        async ({ query, limit }) => {
            const hits = catalog.search(query, limit ?? 10);
            if (hits.length === 0) return text(`No matches for "${query}". Try fewer or different words, or list_components.`);
            return text(hits.map((h) => `- [${h.kind}] ${h.title}${h.summary ? ` — ${h.summary}` : ''}\n  → ${h.next}`).join('\n'));
        }
    );

    server.registerTool(
        'get_component',
        {
            title: 'Get an Optimus UI component',
            description:
                'The API of a component page: import statements, and for each component or directive its selector, inputs (type or allowed values, default, two-way binding), outputs, templates and methods, plus the examples available through get_example. Accepts the docs name (select), selector (p-select, pTooltip) or class name (ButtonDirective).',
            inputSchema: {
                name: z.string().min(1).describe('Docs name, selector or class name, e.g. "datepicker", "p-table", "pTooltip"'),
                include: z
                    .array(z.enum(['passThrough', 'cssClasses']))
                    .optional()
                    .describe('Extra sections: pass-through keys, CSS classes')
            },
            annotations: READ_ONLY
        },
        async ({ name, include }) => {
            const resolved = catalog.resolveComponent(name);
            if (!resolved) return notFound(`No component matches "${name}". Did you mean: ${catalog.suggest(name).join(', ')}?`);
            return text(formatComponent(resolved, new Set(include ?? []), catalog));
        }
    );

    server.registerTool(
        'get_example',
        {
            title: 'Get an Optimus UI example',
            description: 'The code of one documentation example (a complete standalone Angular component). Without a section, lists the examples of the component.',
            inputSchema: {
                component: z.string().min(1).describe('Docs name, selector or class name'),
                section: z.string().optional().describe('Example id or label from get_component, e.g. "basic", "template", "reactiveforms"')
            },
            annotations: READ_ONLY
        },
        async ({ component, section }) => {
            const resolved = catalog.resolveComponent(component);
            if (!resolved) return notFound(`No component matches "${component}". Did you mean: ${catalog.suggest(component).join(', ')}?`);
            const { page } = resolved;
            if (!section) return text(`Examples for ${page.title}:\n${formatSectionList(page.sections)}`);
            const found = catalog.getSection(page, section);
            if (!found) return notFound(`${page.title} has no "${section}" example. Available:\n${formatSectionList(page.sections)}`);
            return text(formatSection(found, `${page.title}: ${found.label}`));
        }
    );

    server.registerTool(
        'get_type',
        {
            title: 'Get an Optimus UI type',
            description: 'An exported interface, type alias or class: its properties or members, and where to import it from. For example MenuItem, TreeNode, SelectItem, ToastMessageOptions, DynamicDialogConfig, ButtonSeverity.',
            inputSchema: { name: z.string().min(1).describe('Type name, e.g. "MenuItem"') },
            annotations: READ_ONLY
        },
        async ({ name }) => {
            const type = catalog.getType(name);
            if (!type) {
                const hits = catalog.search(name, 5).filter((h) => h.kind === 'type');
                return notFound(`No type named "${name}".${hits.length ? ` Similar: ${hits.map((h) => h.title).join(', ')}` : ''}`);
            }
            return text(formatType(type));
        }
    );

    server.registerTool(
        'get_guide',
        {
            title: 'Get an Optimus UI guide',
            description: `A documentation guide, whole or one section. Guides: ${manifest.guides.map((g) => g.name).join(', ')}.`,
            inputSchema: {
                name: z.string().min(1).describe('Guide name, e.g. "installation", "styled", "tailwind"'),
                section: z.string().optional().describe('Section id or label; omit for the whole guide')
            },
            annotations: READ_ONLY
        },
        async ({ name, section }) => {
            const guide = catalog.getGuide(name);
            if (!guide)
                return notFound(
                    `No guide named "${name}". Guides: ${catalog
                        .listGuides()
                        .map((g) => g.name)
                        .join(', ')}.`
                );
            if (section) {
                const found = catalog.getSection(guide, section);
                if (!found) return notFound(`${guide.title} has no "${section}" section. Sections:\n${formatSectionList(guide.sections)}`);
                return text(formatSection(found, `${guide.title}: ${found.label}`));
            }
            return text([`# ${guide.title}`, guide.description, `Source: ${guide.url}`, '', ...(guide.sections ?? []).map((s) => formatSection(s, s.label, '##'))].join('\n'));
        }
    );

    return server;
}

function formatComponent({ page, entryPoints, declarations, focus }: ResolvedComponent, include: Set<string>, catalog: Catalog): string {
    const out = [`# ${page.title}`, page.description, page.markdown ? `Docs: ${page.url}` : ''].filter(Boolean);

    const imports = entryPoints
        .map((entry) => {
            const standalone = declarations.filter((d) => d.import === entry.import && d.standalone !== false).map((d) => d.className);
            const symbols = [...(entry.modules ?? []), ...standalone, ...(entry.services ?? [])];
            return symbols.length ? `import { ${symbols.join(', ')} } from '${entry.import}';` : '';
        })
        .filter(Boolean);
    const related = new Map<string, string[]>();
    for (const r of page.related ?? []) related.set(r.import, [...(related.get(r.import) ?? []), r.name]);
    for (const [from, names] of related) imports.push(`import { ${names.join(', ')} } from '${from}';`);
    if (imports.length) out.push('', '## Import', '```typescript', ...imports, '```');

    const shown = focus ? [declarations.find((d) => d.className === focus.className) ?? { ...focus, import: entryPoints[0]?.import ?? '' }] : declarations;
    out.push('', '## API');
    for (const d of shown) out.push('', ...formatDeclaration(d, include));
    if (focus && declarations.length > 1) {
        out.push(
            '',
            `Other declarations on this page: ${declarations
                .filter((d) => d.className !== focus.className)
                .map((d) => `${d.className} (${primarySelector(d.selector)})`)
                .join(', ')}. Call get_component with the page name "${page.name}" for all of them.`
        );
    }

    for (const name of page.api ?? []) {
        const type = catalog.getType(name);
        if (type) out.push('', `Related type ${type.name}: get_type({ "name": "${type.name}" })`);
    }

    if (include.has('cssClasses')) {
        const classes = entryPoints.flatMap((e) => e.cssClasses ?? []);
        if (classes.length) out.push('', '## CSS classes', ...classes.map((c) => `- .${c.class}${c.description ? ` — ${c.description}` : ''}`));
    }

    if (page.sections?.length) out.push('', '## Examples (get_example)', formatSectionList(page.sections));
    return out.join('\n');
}

function formatDeclaration(d: Declaration & { import: string }, include: Set<string>): string[] {
    const facts = [d.kind, d.standalone !== false ? 'standalone' : 'not standalone'];
    if (d.exportAs) facts.push(`exportAs ${d.exportAs.join(', ')}`);
    if (d.forms) facts.push('works with ngModel, formControl and formControlName');
    if (d.contentProjection?.length) facts.push(`projects content (${d.contentProjection.join(', ')})`);
    const out = [`### ${d.className} — ${d.selector}`, `${facts.join(', ')}. Import from ${d.import}.`];
    if (d.description) out.push(d.description);
    if (d.deprecated) out.push(`Deprecated${d.deprecated === true ? '' : `: ${d.deprecated}`}`);

    if (d.inputs?.length) {
        out.push('', 'Inputs:');
        for (const input of d.inputs) {
            const type = input.values ? input.values.map((v) => JSON.stringify(v)).join(' | ') : (input.type ?? 'unknown');
            const flags = [
                input.required && 'required',
                input.twoWay && `two-way [(${input.name})]`,
                input.transform === 'booleanAttribute' && 'boolean attribute',
                input.default && `default ${input.default}`,
                input.deprecated && 'deprecated'
            ].filter(Boolean);
            out.push(`- ${input.name}: ${type}${flags.length ? ` (${flags.join(', ')})` : ''}${input.description ? ` — ${oneLine(input.description)}` : ''}`);
        }
    }
    if (d.outputs?.length) {
        out.push('', 'Outputs:');
        for (const output of d.outputs) out.push(`- (${output.name}): ${output.payload ?? 'unknown'}${output.deprecated ? ' (deprecated)' : ''}${output.description ? ` — ${oneLine(output.description)}` : ''}`);
    }
    if (d.templates?.length) {
        out.push('', `Templates (<ng-template #name let-context> inside ${primarySelector(d.selector)}):`);
        for (const t of d.templates) out.push(`- #${t.name}${t.context ? `: ${t.context}` : ''}${t.description ? ` — ${oneLine(t.description)}` : ''}`);
    }
    if (d.methods?.length) {
        out.push('', 'Methods:');
        for (const m of d.methods) out.push(`- ${m.name}(${(m.parameters ?? []).map((p) => `${p.name}: ${p.type ?? 'any'}`).join(', ')}): ${m.returnType ?? 'void'}${m.description ? ` — ${oneLine(m.description)}` : ''}`);
    }
    if (include.has('passThrough') && d.passThrough?.length) {
        out.push('', 'Pass-through keys ([pt]):');
        for (const pt of d.passThrough) out.push(`- ${pt.name}${pt.description ? ` — ${oneLine(pt.description)}` : ''}`);
    }
    return out;
}

function formatType(type: TypeDefinition & { import: string }): string {
    const out = [`# ${type.name} (${type.kind})`, `import { ${type.name} } from '${type.import}';`];
    if (type.description) out.push('', type.description);
    if (type.kind === 'type') {
        out.push('', '```typescript', `type ${type.name} = ${type.definition ?? (type.values ?? []).map((v) => JSON.stringify(v)).join(' | ')};`, '```');
    }
    for (const p of type.properties ?? []) out.push(`- ${p.name}${p.optional ? '?' : ''}: ${p.type ?? 'unknown'}${p.deprecated ? ' (deprecated)' : ''}${p.description ? ` — ${oneLine(p.description)}` : ''}`);
    for (const m of type.members ?? []) out.push(`- ${m.name}${m.kind === 'method' ? '()' : ''}: ${m.type ?? 'unknown'}${m.description ? ` — ${oneLine(m.description)}` : ''}`);
    return out.join('\n');
}

function formatSectionList(sections: Section[] | undefined): string {
    if (!sections?.length) return '(none)';
    return sections.map((s) => `- ${s.id}: ${s.label}${s.description ? ` — ${truncate(oneLine(s.description), 120)}` : ''}`).join('\n');
}

function formatSection(section: Section, title: string, heading = '#'): string {
    const out = [`${heading} ${title}`];
    if (section.description) out.push(section.description);
    const ex = section.examples ?? {};
    if (ex.typescript) out.push('```typescript', ex.typescript, '```');
    if (ex.data) out.push('Sample data:', '```json', ex.data, '```');
    if (ex.scss) out.push('```scss', ex.scss, '```');
    if (ex.command) out.push('```bash', ex.command, '```');
    return out.join('\n');
}

function oneLine(value: string): string {
    return value.replace(/\s+/g, ' ').trim();
}

function truncate(value: string, length: number): string {
    return value.length > length ? `${value.slice(0, length - 1)}…` : value;
}

function text(value: string) {
    return { content: [{ type: 'text' as const, text: value }] };
}

function notFound(message: string) {
    return { content: [{ type: 'text' as const, text: message }], isError: true };
}
