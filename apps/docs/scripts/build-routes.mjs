/**
 * Generates router/routes.txt — the prerender manifest consumed by the
 * Angular builder — from router/app.routes.ts and the lazy child route files.
 *
 * Maintaining the list by hand let it drift in both directions: stale entries
 * prerendered the 404 page and got indexed, and newer pages were never
 * prerendered at all. Run this whenever routes change.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const APP_ROUTES = path.join(ROOT, 'router/app.routes.ts');
const OUTPUT = path.join(ROOT, 'router/routes.txt');

/** Routes that exist but must not be prerendered. */
const EXCLUDE = new Set(['notfound']);

/** Pull `path: 'x'` entries out of a routes file, ignoring redirects. */
function readChildPaths(routesFile) {
    if (!fs.existsSync(routesFile)) return [];
    const source = fs.readFileSync(routesFile, 'utf-8');
    const paths = [];

    // Split on route object boundaries so a redirectTo can be tied to its path.
    for (const block of source.split(/\{\s*path:/).slice(1)) {
        const match = block.match(/^\s*'([^']*)'/);
        if (!match) continue;
        if (/redirectTo/.test(block.split('}')[0])) continue;
        paths.push(match[1]);
    }

    return paths;
}

function collect() {
    const source = fs.readFileSync(APP_ROUTES, 'utf-8');
    const routes = new Set(['/']);

    const lazy = /path:\s*'([^']+)'\s*,\s*loadChildren:\s*\(\)\s*=>\s*import\('@\/pages\/([^']+)\/routes'\)/g;

    let match;
    while ((match = lazy.exec(source)) !== null) {
        const [, routePath, pagesDir] = match;
        if (EXCLUDE.has(routePath)) continue;

        const children = readChildPaths(path.join(ROOT, 'pages', pagesDir, 'routes.ts'));
        if (children.length === 0) continue;

        for (const child of children) {
            routes.add(child ? `/${routePath}/${child}` : `/${routePath}`);
        }
    }

    return [...routes];
}

const routes = collect();
const [root, ...rest] = routes;
rest.sort();

fs.writeFileSync(OUTPUT, [root, ...rest].join('\n') + '\n', 'utf-8');
console.log(`✓ Generated ${path.relative(ROOT, OUTPUT)} with ${routes.length} routes`);
