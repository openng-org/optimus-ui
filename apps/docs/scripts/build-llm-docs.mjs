import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateAgentSkill } from './build-llm-skill.mjs';
import { MANIFEST_PATH } from './build-manifest.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.resolve(__dirname, '../public/llms');

/**
 * Render the LLM documentation from `public/llms/manifest.json` (built by build-manifest.mjs):
 *
 * - llms.txt: index of guides and components
 * - llms-full.txt: everything in one file
 * - components/*.md and pages/*.md: one file per docs page
 * - components.json: the docs and API per page, in the shape earlier releases published
 * - optimus-ui-skill.zip and the skills discovery index (build-llm-skill.mjs)
 */
function main() {
    console.log('🚀 Building Optimus UI LLM Documentation from the manifest...\n');

    if (!fs.existsSync(MANIFEST_PATH)) {
        throw new Error(`${MANIFEST_PATH} is missing. Run \`npm run build:manifest\` first.`);
    }
    const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
    const index = indexManifest(manifest);

    // Start from empty folders so pages removed from the docs don't linger
    for (const dir of ['components', 'pages']) {
        fs.rmSync(path.join(OUTPUT_DIR, dir), { recursive: true, force: true });
        fs.mkdirSync(path.join(OUTPUT_DIR, dir), { recursive: true });
    }

    const componentMarkdown = new Map(manifest.components.map((page) => [page.name, renderComponent(page, index)]));
    const guideMarkdown = new Map(manifest.guides.map((guide) => [guide.name, renderGuide(guide)]));

    for (const [name, markdown] of componentMarkdown) fs.writeFileSync(path.join(OUTPUT_DIR, 'components', `${name}.md`), markdown, 'utf-8');
    console.log(`✓ Generated ${componentMarkdown.size} component markdown files`);

    for (const [name, markdown] of guideMarkdown) fs.writeFileSync(path.join(OUTPUT_DIR, 'pages', `${name}.md`), markdown, 'utf-8');
    console.log(`✓ Generated ${guideMarkdown.size} guide markdown files`);

    fs.writeFileSync(path.join(OUTPUT_DIR, 'llms.txt'), renderLlmsTxt(manifest), 'utf-8');
    console.log('✓ Generated llms.txt');

    const full = ['# Optimus UI Documentation\n', `Generated from Optimus UI v${manifest.version}.\n`, '---\n', '# Guides\n', ...guideMarkdown.values(), '---\n', '# Components\n', ...[...componentMarkdown.values()].map((md) => md + '\n---\n')];
    fs.writeFileSync(path.join(OUTPUT_DIR, 'llms-full.txt'), full.join('\n'), 'utf-8');
    console.log('✓ Generated llms-full.txt');

    fs.writeFileSync(path.join(OUTPUT_DIR, 'components.json'), JSON.stringify(renderComponentsJson(manifest, index), null, 2), 'utf-8');
    console.log('✓ Generated components.json');

    generateAgentSkill({ outputDir: OUTPUT_DIR, wellKnownDir: path.resolve(__dirname, '../public/.well-known'), manifest });

    console.log('\n✅ LLM documentation generation complete!');
}

export function indexManifest(manifest) {
    const entries = new Map(manifest.entryPoints.map((entry) => [entry.name, entry]));
    const typesByName = new Map();
    for (const entry of manifest.entryPoints) for (const t of [...(entry.classes ?? []), ...(entry.types ?? [])]) if (!typesByName.has(t.name)) typesByName.set(t.name, t);
    return { entries, typesByName };
}

/**
 * The declarations a page documents: the ones its `[apiDocs]` names first, then the rest of its entry points.
 */
function pageApi(page, index) {
    const entries = (page.entryPoints ?? []).map((name) => index.entries.get(name)).filter(Boolean);
    const listed = page.api ?? [];
    const rank = (name) => (listed.includes(name) ? listed.indexOf(name) : listed.length);
    const declarations = entries.flatMap((entry) => (entry.declarations ?? []).map((d) => ({ ...d, entry })));
    declarations.sort((a, b) => rank(a.className) - rank(b.className));
    const extras = listed.map((name) => index.typesByName.get(name)).filter(Boolean);
    return { entries, declarations, extras };
}

export function renderComponent(page, index) {
    const { entries, declarations, extras } = pageApi(page, index);
    const out = [`# ${page.title}`, '', page.description, ''];

    const imports = renderImports(entries, declarations, page.related);
    if (imports) out.push('## Import', '', '```typescript', imports, '```', '');

    for (const section of page.sections ?? []) {
        if (section.id === 'import') continue;
        out.push(...renderSection(section, '##'));
    }

    if (declarations.length > 0 || extras.length > 0) {
        out.push('## API', '');
        for (const declaration of declarations) out.push(...renderDeclaration(declaration));
        for (const extra of extras) out.push(...renderType(extra));
    }

    const ptDeclarations = declarations.filter((d) => d.passThrough?.length);
    if (ptDeclarations.length > 0) {
        out.push('## Pass Through Options', '');
        for (const d of ptDeclarations) {
            if (ptDeclarations.length > 1) out.push(`### ${d.className}`, '');
            out.push(
                ...table(
                    ['Name', 'Type', 'Description'],
                    d.passThrough.map((pt) => [code(pt.name), code(pt.type), pt.description])
                )
            );
        }
    }

    const cssClasses = entries.flatMap((entry) => entry.cssClasses ?? []);
    const tokens = page.tokens ?? [];
    if (cssClasses.length > 0 || tokens.length > 0) {
        out.push('## Theming', '');
        if (cssClasses.length > 0)
            out.push(
                '### CSS Classes',
                '',
                ...table(
                    ['Class', 'Description'],
                    cssClasses.map((c) => [code(c.class), c.description])
                )
            );
        if (tokens.length > 0) {
            out.push('### Design Tokens', '');
            out.push(
                ...table(
                    ['Token', 'CSS Variable', 'Description'],
                    tokens.map((t) => [code(t.name), code(t.variable), t.description])
                )
            );
        }
    }

    return out.join('\n');
}

function renderImports(entries, declarations, related = []) {
    const lines = [];
    for (const entry of entries) {
        const standalone = declarations.filter((d) => d.entry === entry && d.standalone !== false).map((d) => d.className);
        const symbols = [...(entry.modules ?? []), ...standalone, ...(entry.services ?? [])];
        if (symbols.length > 0) lines.push(`import { ${symbols.join(', ')} } from '${entry.import}';`);
    }
    // Services and types the page uses from other entry points, typically @openng/optimus-ui/api
    const byImport = Map.groupBy(related, (r) => r.import);
    for (const [from, items] of byImport) lines.push(`import { ${items.map((r) => r.name).join(', ')} } from '${from}';`);
    return lines.join('\n');
}

function renderDeclaration(d) {
    const host = d.selector
        .split(',')[0]
        .trim()
        .replace(/^\[|\]$/g, '');
    const out = [`### ${d.className}`, ''];
    const facts = [`Selector: ${code(d.selector)}`, `${capitalize(d.kind)}${d.standalone !== false ? ', standalone' : ''}`];
    if (d.exportAs) facts.push(`exportAs: ${code(d.exportAs.join(', '))}`);
    if (d.forms) facts.push('works with `ngModel`, `formControl` and `formControlName`');
    out.push(facts.join(' · '), '');
    if (d.description) out.push(d.description, '');
    if (d.deprecated) out.push(`**Deprecated:** ${d.deprecated === true ? '' : d.deprecated}`.trim(), '');

    if (d.inputs?.length) {
        out.push('#### Inputs', '');
        out.push(
            ...table(
                ['Name', 'Type', 'Default', 'Description'],
                d.inputs.map((input) => {
                    const notes = [];
                    if (input.required) notes.push('**Required.**');
                    if (input.twoWay) notes.push(`Two-way: \`[(${input.name})]\`.`);
                    if (input.deprecated) notes.push(`**Deprecated**${input.deprecated === true ? '.' : `: ${input.deprecated.replace(/\.?$/, '.')}`}`);
                    const type = input.values ? input.values.map((v) => JSON.stringify(v)).join(' | ') : input.type;
                    return [code(input.name), code(type), input.default ? code(input.default) : '-', [input.description, ...notes].filter(Boolean).join(' ')];
                })
            )
        );
    }

    if (d.outputs?.length) {
        out.push('#### Outputs', '');
        out.push(
            ...table(
                ['Name', 'Payload', 'Description'],
                d.outputs.map((o) => [code(o.name), code(o.payload), [o.description, o.deprecated ? '**Deprecated.**' : ''].filter(Boolean).join(' ')])
            )
        );
    }

    if (d.templates?.length) {
        out.push('#### Templates', '', `Define with \`<ng-template #name let-context>\` inside the \`${host}\` element.`, '');
        out.push(
            ...table(
                ['Name', 'Context', 'Description'],
                d.templates.map((t) => [code(t.name), t.context ? code(t.context) : '-', t.description])
            )
        );
    }

    if (d.methods?.length) {
        out.push('#### Methods', '');
        out.push(
            ...table(
                ['Name', 'Parameters', 'Returns', 'Description'],
                d.methods.map((m) => [code(m.name), (m.parameters ?? []).map((p) => code(`${p.name}: ${p.type}`)).join(', ') || '-', code(m.returnType ?? 'void'), m.description])
            )
        );
    }

    return out;
}

function renderType(t) {
    const out = [`### ${t.name}`, ''];
    if (t.description) out.push(t.description, '');
    if (t.kind === 'type') {
        out.push('```typescript', `type ${t.name} = ${t.definition ?? (t.values ?? []).map((v) => JSON.stringify(v)).join(' | ')};`, '```', '');
    } else {
        const members = t.properties ?? t.members ?? [];
        out.push(
            ...table(
                ['Name', 'Type', 'Description'],
                members.map((m) => [code(m.name + (m.optional ? '?' : '')), code(m.type), m.description])
            )
        );
    }
    return out;
}

function renderSection(section, heading) {
    const out = [`${heading} ${section.label}`, ''];
    if (section.description) out.push(section.description, '');
    const examples = section.examples ?? {};
    if (examples.typescript) out.push('```typescript', examples.typescript, '```', '');
    if (examples.data) out.push('**Sample Data:**', '', '```json', examples.data, '```', '');
    if (examples.scss) out.push('```scss', examples.scss, '```', '');
    if (examples.command) out.push('```bash', examples.command, '```', '');
    return out;
}

function renderGuide(guide) {
    return [`# ${guide.title}`, '', guide.description, '', ...(guide.sections ?? []).flatMap((section) => renderSection(section, '##'))].join('\n');
}

function renderLlmsTxt(manifest) {
    const lines = ['# Optimus UI', '', '> A community-maintained, MIT licensed suite of 80+ accessible Angular UI components.', ''];
    lines.push(`Machine-readable API: ${manifest.site}/llms/manifest.json`, '');
    lines.push('## Guides', '', ...manifest.guides.map((g) => `- [${g.title}](${g.url}): ${g.description}`), '');
    const components = [...manifest.components].sort((a, b) => a.title.localeCompare(b.title));
    lines.push('## Components', '', ...components.map((c) => `- [${c.title}](${c.url}): ${c.description}`), '');
    return lines.join('\n');
}

/**
 * components.json keeps the shape earlier releases published at /llms/components.json, now derived from the manifest.
 */
function renderComponentsJson(manifest, index) {
    const toSection = (s) => ({ id: s.id, label: s.label, description: s.description ?? '', examples: s.examples ?? null });
    return {
        version: '1.0.0',
        components: manifest.components.map((page) => {
            const { declarations } = pageApi(page, index);
            const main = declarations[0];
            const tokens = page.tokens;
            return {
                name: page.name,
                title: page.title,
                description: page.description,
                sections: (page.sections ?? []).map(toSection),
                api: {
                    props: main?.inputs?.map((i) => ({ name: i.name, type: i.type ?? '', default: i.default ?? '-', description: i.description ?? '', deprecated: typeof i.deprecated === 'string' ? i.deprecated : '' })) ?? null,
                    templates: main?.templates?.map((t) => ({ name: t.name, type: t.context ? `TemplateRef<${t.context}>` : 'TemplateRef<void>', description: t.description ?? '' })) ?? null,
                    emits: main?.outputs?.map((o) => ({ name: o.name, parameters: [{ name: 'event', type: o.payload ?? 'any' }], description: o.description ?? '' })) ?? null,
                    methods: main?.methods?.map((m) => ({ name: m.name, parameters: m.parameters ?? [], returnType: m.returnType ?? 'void', description: m.description ?? '' })) ?? null,
                    pt: main?.passThrough?.map((pt) => ({ name: pt.name, type: pt.type ?? '', description: pt.description ?? '' })) ?? null,
                    styles: main?.entry.cssClasses?.map((c) => ({ class: c.class, description: c.description ?? '' })) ?? null,
                    tokens: tokens?.map((t) => ({ token: t.name, variable: t.variable, description: t.description ?? '' })) ?? null
                }
            };
        }),
        pages: manifest.guides.map((guide) => ({ name: guide.name, path: new URL(guide.url).pathname.slice(1), title: guide.title, description: guide.description, sections: (guide.sections ?? []).map(toSection) }))
    };
}

function table(headers, rows) {
    const cell = (value) =>
        value === undefined || value === null || value === ''
            ? '-'
            : String(value)
                  .replace(/\|/g, '\\|')
                  .replace(/\s*\n\s*/g, ' ');
    return [`| ${headers.join(' | ')} |`, `|${headers.map(() => '---').join('|')}|`, ...rows.map((row) => `| ${row.map(cell).join(' | ')} |`), ''];
}

function code(value) {
    if (value === undefined || value === null || value === '') return '-';
    const text = String(value).replace(/\s*\n\s*/g, ' ');
    return text.includes('`') ? `\`\` ${text} \`\`` : `\`${text}\``;
}

function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    main();
}
