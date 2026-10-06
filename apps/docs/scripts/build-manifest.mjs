import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { collectApi, PACKAGE_NAME } from './manifest/api.mjs';
import { collectDocs } from './manifest/docs.mjs';
import ComponentTokens from '@openng/optimus-ui-themes/tokens';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SITE_URL = 'https://optimus.openng.org';
const SCHEMA_VERSION = 1;
const LIB_DIR = path.resolve(__dirname, '../../../packages/optimus-ui');
const API_DOC_PATH = path.resolve(__dirname, '../doc/apidoc/index.json');
export const MANIFEST_PATH = path.resolve(__dirname, '../public/llms/manifest.json');

// Names used in a docs page's `[apiDocs]` that differ from the exported names
const API_NAME_ALIASES = {
    Chart: ['UIChart'],
    DragDrop: ['Draggable', 'Droppable'],
    ToastMessage: ['ToastMessageOptions']
};

// Entry points whose design tokens are documented under a different key
const TOKEN_COMPONENT_MAP = {
    table: 'datatable',
    scroller: 'virtualscroller'
};

/**
 * Build `public/llms/manifest.json`, the single source the LLM docs, the Agent Skill and the MCP server are generated from:
 *
 * - `entryPoints`: the API, read from the compiled typings (manifest/api.mjs)
 * - `components` and `guides`: the prose and code examples of the documentation pages (manifest/docs.mjs),
 *   with the design tokens each component page documents
 */
export function buildManifest() {
    const apiDocs = JSON.parse(fs.readFileSync(API_DOC_PATH, 'utf-8'));
    const entryPoints = collectApi({ libDir: LIB_DIR, apiDocs });
    const docs = collectDocs({ docsDir: path.resolve(__dirname, '../doc'), pagesDir: path.resolve(__dirname, '../pages'), demosPath: path.resolve(__dirname, '../public/demos.json') });
    const tokenComponents = new Set(Object.keys(ComponentTokens));

    // Where each public name lives, so a docs page's `[apiDocs]` list can point at entry points
    const owners = new Map();
    const own = (name, entry, kind) => !owners.has(name) && owners.set(name, { entry: entry.name, import: entry.import, kind });
    for (const entry of entryPoints) {
        for (const d of entry.declarations ?? []) own(d.className, entry, d.kind);
        for (const name of entry.modules ?? []) own(name, entry, 'module');
        for (const name of entry.services ?? []) own(name, entry, 'service');
        for (const c of entry.classes ?? []) own(c.name, entry, 'class');
        for (const t of entry.types ?? []) own(t.name, entry, t.kind);
    }

    const components = docs.components.map((page) => {
        // A page documents the entry points of its components; services and types it mentions are related,
        // so the shared `api` entry point is not pulled in whole for a single MenuItem or ConfirmationService
        const linked = new Set();
        const related = [];
        const api = (page.apiComponents ?? []).flatMap((name) => API_NAME_ALIASES[name] ?? [name.replace(/-/g, '')]);
        for (const apiName of api) {
            const owner = owners.get(apiName);
            if (!owner) console.warn(`   Warning: ${page.name} documents ${apiName}, which no entry point exports`);
            else if (['component', 'directive', 'module'].includes(owner.kind)) linked.add(owner.entry);
            else related.push({ name: apiName, kind: owner.kind, import: owner.import });
        }
        if (linked.size === 0 && entryPoints.some((e) => e.name === page.name)) linked.add(page.name);
        // Related names from an entry point the page already documents are covered by it
        const relatedOutside = related.filter((r) => ![...linked].some((entry) => r.import.endsWith(`/${entry}`)));

        const tokenComponent = [page.themeDocs?.toLowerCase(), ...[...linked].map((e) => TOKEN_COMPONENT_MAP[e] ?? e), page.name].find((key) => key && tokenComponents.has(key));

        return compact({
            name: page.name,
            title: page.title.replace(/^Angular\s+/, '').replace(/\s+(Component|Directive)$/, ''),
            description: page.description,
            url: `${SITE_URL}/${page.route}`,
            markdown: `${SITE_URL}/llms/components/${page.name}.md`,
            entryPoints: [...linked],
            api,
            related: relatedOutside,
            sections: page.sections.map(toSection),
            tokens: ComponentTokens[tokenComponent]?.tokens?.map((t) => compact({ name: t.token, variable: t.variable, description: t.description || undefined }))
        });
    });

    const pageByEntry = new Map();
    for (const page of components) for (const entry of page.entryPoints ?? []) if (!pageByEntry.has(entry)) pageByEntry.set(entry, page.name);

    const guides = docs.guides.map((page) =>
        compact({
            name: page.route.split('/').pop(),
            title: page.title,
            description: page.description,
            url: `${SITE_URL}/${page.route}`,
            markdown: `${SITE_URL}/llms/pages/${page.route.split('/').pop()}.md`,
            sections: page.sections.map(toSection)
        })
    );

    return {
        schemaVersion: SCHEMA_VERSION,
        package: PACKAGE_NAME,
        version: JSON.parse(fs.readFileSync(path.join(LIB_DIR, 'package.json'), 'utf-8')).version,
        site: SITE_URL,
        components,
        guides,
        entryPoints: entryPoints.map((entry) => compact({ ...entry, docs: pageByEntry.get(entry.name) }))
    };
}

function toSection(section) {
    const examples = section.examples ? compact({ typescript: section.examples.typescript, data: section.examples.data, scss: section.examples.scss, command: section.examples.command }) : undefined;
    return compact({ id: section.id, label: section.label, description: section.description || undefined, examples: examples && Object.keys(examples).length ? examples : undefined });
}

/** Drop undefined values and empty arrays so the manifest only carries what is known. */
function compact(obj) {
    return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined && !(Array.isArray(v) && v.length === 0)));
}

function main() {
    console.log('🧭 Building the Optimus UI manifest...\n');
    const manifest = buildManifest();

    fs.mkdirSync(path.dirname(MANIFEST_PATH), { recursive: true });
    fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf-8');

    const declarations = manifest.entryPoints.reduce((sum, e) => sum + (e.declarations?.length ?? 0), 0);
    console.log(`✓ Generated ${path.relative(process.cwd(), MANIFEST_PATH)}`);
    console.log(`   ${manifest.components.length} component pages, ${manifest.guides.length} guides`);
    console.log(`   ${manifest.entryPoints.length} entry points, ${declarations} components/directives`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    main();
}
