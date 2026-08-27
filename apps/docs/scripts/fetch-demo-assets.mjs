/**
 * One-time (re-runnable) fetch of the demo assets that the documentation still
 * loads from primefaces.org, into apps/docs/public/demo/.
 *
 * Why: every avatar, product shot, galleria image, dock icon and flag sprite in
 * these demos is served from a CDN owned by another project. If it is
 * reorganised, rate-limited or referrer-checked, the documentation and every
 * exported StackBlitz break at once, with no fix available on our side.
 *
 * Usage:
 *   node scripts/fetch-demo-assets.mjs          # download anything missing
 *   node scripts/fetch-demo-assets.mjs --force  # re-download everything
 *   node scripts/fetch-demo-assets.mjs --list   # print the URL map, download nothing
 *
 * Path mapping: the CDN prefix and the redundant `demo/` segment are dropped, so
 *   .../cdn/primeng/images/demo/product/shoes.jpg  -> public/demo/product/shoes.jpg
 *   .../cdn/primeng/images/galleria/galleria1.jpg  -> public/demo/galleria/galleria1.jpg
 *   .../cdn/primevue/images/landing/apps/x.png     -> public/demo/landing/apps/x.png
 * which also collapses the primeng/primevue copies of identical assets onto one file.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.join(ROOT, 'public/demo');

const SCAN_DIRS = ['doc', 'pages', 'components', 'service', 'assets', 'public'];
const SCAN_EXTENSIONS = new Set(['.ts', '.html', '.json', '.scss']);
const SKIP_DIRS = new Set(['node_modules', 'dist', '.angular', 'demo']);

const ASSET_URL = /https?:\/\/(?:www\.)?primefaces\.org\/cdn\/(?:primeng|primevue)\/images\/([A-Za-z0-9._\/-]+\.(?:png|jpg|jpeg|svg|gif|webp))/g;

/**
 * Many demos build their image URL at runtime — `baseUrl + item.image` — so the
 * literal-URL scan below cannot see the filenames. These come from the demo data
 * services instead, keyed by the directory the templates prefix them with.
 */
const CONCATENATED_ASSETS = [
    { service: 'productservice.ts', prefix: 'demo/product/' },
    { service: 'customerservice.ts', prefix: 'demo/avatar/' }
];

/** Sequential assets that no single file lists in full. */
const EXTRA_ASSETS = [...Array.from({ length: 12 }, (_, i) => `demo/nature/nature${i + 1}.jpg`), ...Array.from({ length: 15 }, (_, i) => `galleria/galleria${i + 1}.jpg`), ...Array.from({ length: 15 }, (_, i) => `galleria/galleria${i + 1}s.jpg`)];

function collectConcatenated() {
    const found = new Set();

    for (const { service, prefix } of CONCATENATED_ASSETS) {
        const file = path.join(ROOT, 'service', service);
        if (!fs.existsSync(file)) continue;

        const content = fs.readFileSync(file, 'utf-8');
        for (const match of content.matchAll(/image:\s*'([A-Za-z0-9._-]+\.(?:png|jpg|jpeg|svg))'/g)) {
            found.add(`${prefix}${match[1]}`);
        }
    }

    return found;
}

function toLocalPath(cdnPath) {
    return cdnPath.replace(/^demo\//, '');
}

function collectFromSources() {
    const found = new Set();

    const walk = (dir) => {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            if (entry.isDirectory()) {
                if (SKIP_DIRS.has(entry.name)) continue;
                walk(path.join(dir, entry.name));
            } else if (SCAN_EXTENSIONS.has(path.extname(entry.name))) {
                const content = fs.readFileSync(path.join(dir, entry.name), 'utf-8');
                for (const match of content.matchAll(ASSET_URL)) found.add(match[1]);
            }
        }
    };

    for (const dir of SCAN_DIRS) {
        const full = path.join(ROOT, dir);
        if (fs.existsSync(full)) walk(full);
    }

    return found;
}

async function download(cdnPath, localPath, force) {
    const destination = path.join(OUTPUT_DIR, localPath);

    if (!force && fs.existsSync(destination) && fs.statSync(destination).size > 0) {
        return 'skipped';
    }

    // primeng first, primevue as the fallback — a handful of assets only exist under one.
    for (const project of ['primeng', 'primevue']) {
        const url = `https://primefaces.org/cdn/${project}/images/${cdnPath}`;
        const response = await fetch(url);
        if (!response.ok) continue;

        const buffer = Buffer.from(await response.arrayBuffer());
        if (buffer.length === 0) continue;

        fs.mkdirSync(path.dirname(destination), { recursive: true });
        fs.writeFileSync(destination, buffer);
        return 'downloaded';
    }

    return 'failed';
}

const force = process.argv.includes('--force');
const listOnly = process.argv.includes('--list');

const assets = new Set([...collectFromSources(), ...collectConcatenated(), ...EXTRA_ASSETS]);
const mapping = [...assets].map((cdnPath) => ({ cdnPath, localPath: toLocalPath(cdnPath) })).sort((a, b) => a.localPath.localeCompare(b.localPath));

if (listOnly) {
    for (const { cdnPath, localPath } of mapping) console.log(`${cdnPath}  ->  public/demo/${localPath}`);
    console.log(`\n${mapping.length} assets`);
    process.exit(0);
}

const counts = { downloaded: 0, skipped: 0, failed: 0 };
const failures = [];

for (const { cdnPath, localPath } of mapping) {
    const result = await download(cdnPath, localPath, force);
    counts[result]++;
    if (result === 'failed') failures.push(cdnPath);
}

console.log(`✓ ${counts.downloaded} downloaded, ${counts.skipped} already present, ${counts.failed} failed`);

if (failures.length) {
    console.error('\nCould not fetch:');
    for (const failure of failures) console.error(`  ${failure}`);
    process.exit(1);
}
