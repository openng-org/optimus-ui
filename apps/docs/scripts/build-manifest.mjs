import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { collectApi, PACKAGE_NAME } from './manifest/api.mjs';
import { collectTokens, DEFAULT_PRESET, PRESETS } from './manifest/tokens.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SITE_URL = 'https://optimus.openng.org';
const SCHEMA_VERSION = 1;
const LIB_DIR = path.resolve(__dirname, '../../../packages/optimus-ui');
const API_DOC_PATH = path.resolve(__dirname, '../doc/apidoc/index.json');
export const MANIFEST_PATH = path.resolve(__dirname, '../public/llms/manifest.json');

// Entry points whose component tokens live under a different key in the presets
const TOKEN_COMPONENT_MAP = {
    table: 'datatable',
    scroller: 'virtualscroller'
};

/**
 * Build `public/llms/manifest.json`, a machine-readable description of Optimus UI:
 *
 * - `entryPoints`: every entry point of @openng/optimus-ui with its components, directives, NgModules, services and exported types (manifest/api.mjs)
 * - `theme`: every design token with its value in each preset (manifest/tokens.mjs)
 */
export function buildManifest() {
    const apiDocs = JSON.parse(fs.readFileSync(API_DOC_PATH, 'utf-8'));
    const tokens = collectTokens();
    const tokenComponents = new Set(tokens.filter((t) => t.component).map((t) => t.component));

    return {
        schemaVersion: SCHEMA_VERSION,
        package: PACKAGE_NAME,
        version: JSON.parse(fs.readFileSync(path.join(LIB_DIR, 'package.json'), 'utf-8')).version,
        site: SITE_URL,
        entryPoints: collectApi({ libDir: LIB_DIR, apiDocs }).map((entry) => {
            const tokenComponent = TOKEN_COMPONENT_MAP[entry.name] ?? entry.name;
            return tokenComponents.has(tokenComponent) ? { ...entry, tokenComponent } : entry;
        }),
        theme: {
            presets: Object.keys(PRESETS),
            defaultPreset: DEFAULT_PRESET,
            tokens
        }
    };
}

function main() {
    console.log('🧭 Building the Optimus UI manifest...\n');
    const manifest = buildManifest();

    fs.mkdirSync(path.dirname(MANIFEST_PATH), { recursive: true });
    fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf-8');

    const declarations = manifest.entryPoints.reduce((sum, e) => sum + (e.declarations?.length ?? 0), 0);
    console.log(`✓ Generated ${path.relative(process.cwd(), MANIFEST_PATH)}`);
    console.log(`   ${manifest.entryPoints.length} entry points, ${declarations} components/directives`);
    console.log(`   ${manifest.theme.tokens.length} design tokens across ${manifest.theme.presets.length} presets`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    main();
}
