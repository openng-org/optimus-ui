/**
 * Fetches the "latest" (stable) dist-tag for @openng/optimus-ui from the npm
 * registry and writes it to assets/data/stable-version.json.
 *
 * The footer must not read the monorepo's root package.json version directly —
 * that value tracks the in-progress release (often an -rc.x pre-release) and is
 * not necessarily what's actually published as stable.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUTPUT = path.join(ROOT, 'assets/data/stable-version.json');

const PACKAGE_NAME = '@openng/optimus-ui';
const FALLBACK_VERSION = JSON.parse(fs.readFileSync(path.join(ROOT, '../../package.json'), 'utf-8')).version.split('-')[0];

async function fetchStableVersion() {
    const response = await fetch(`https://registry.npmjs.org/${encodeURIComponent(PACKAGE_NAME)}`);
    if (!response.ok) throw new Error(`npm registry responded with ${response.status}`);

    const data = await response.json();
    const version = data['dist-tags']?.latest;
    if (!version) throw new Error('no "latest" dist-tag found in registry response');

    return version;
}

let version;

try {
    version = await fetchStableVersion();
} catch (error) {
    console.warn(`⚠ Could not fetch stable version from npm, falling back to ${FALLBACK_VERSION}: ${error.message}`);
    version = FALLBACK_VERSION;
}

fs.writeFileSync(OUTPUT, JSON.stringify({ version }, null, 4) + '\n', 'utf-8');
console.log(`✓ Generated ${path.relative(ROOT, OUTPUT)} with version ${version}`);
