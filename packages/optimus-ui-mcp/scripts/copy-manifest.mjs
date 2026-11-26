import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const source = path.resolve(__dirname, '../../../apps/docs/public/llms/manifest.json');
const target = path.resolve(__dirname, '../data/manifest.json');

// The server ships the manifest of the release it is published with, built by the docs (`pnpm --filter docs build:manifest`)
if (!fs.existsSync(source)) {
    console.error(`✗ ${path.relative(process.cwd(), source)} is missing. Build it first with \`pnpm run build:docs:content\` (or \`pnpm --filter docs build:manifest\`).`);
    process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(source, 'utf-8'));
const version = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../package.json'), 'utf-8')).version;
if (manifest.version !== version) {
    console.warn(`⚠ The manifest describes Optimus UI ${manifest.version}, this package is ${version}.`);
}

fs.mkdirSync(path.dirname(target), { recursive: true });
// Minified: the server only reads it, and it halves the package size
fs.writeFileSync(target, JSON.stringify(manifest));
console.log(`✓ Copied the Optimus UI ${manifest.version} manifest to ${path.relative(process.cwd(), target)}`);
