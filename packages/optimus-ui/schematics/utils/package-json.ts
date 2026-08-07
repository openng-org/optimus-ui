import { Tree } from '@angular-devkit/schematics';
import { MODULE_MAP, VERSIONS } from './mappings';

export const SKIP_DIRS = /(^|\/)(node_modules|dist|\.angular|\.git|out-tsc)\//;

export interface SwapResult {
    changed: boolean;
    added: string[];
    removed: string[];
}

export function swapDependencies(pkg: Record<string, any>): SwapResult {
    const result: SwapResult = { changed: false, added: [], removed: [] };
    for (const section of ['dependencies', 'devDependencies'] as const) {
        const deps = pkg[section];
        if (!deps) {
            continue;
        }
        for (const [from, to] of MODULE_MAP) {
            if (!(from in deps)) {
                continue;
            }
            delete deps[from];
            deps[to] = VERSIONS[to];
            result.changed = true;
            result.removed.push(from);
            result.added.push(to);
        }
    }
    return result;
}

export function getPrimengMajor(pkg: Record<string, any>): number | null {
    const range = pkg.dependencies?.['primeng'] ?? pkg.devDependencies?.['primeng'];
    if (typeof range !== 'string') {
        return null;
    }
    const match = range.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : null;
}

/**
 * Scans every package.json in the workspace tree (skipping node_modules/dist/.angular/.git/out-tsc)
 * and returns the highest primeng major found across all of them, or null if primeng is nowhere.
 */
export function findPrimengMajor(tree: Tree): number | null {
    let max: number | null = null;
    visitWorkspacePackageJsons(tree, (pkg) => {
        const major = getPrimengMajor(pkg);
        if (major !== null && (max === null || major > max)) {
            max = major;
        }
    });
    return max;
}

/**
 * Scans every package.json in the workspace tree (skipping node_modules/dist/.angular/.git/out-tsc)
 * and returns true if `primeng` is a key in `dependencies` or `devDependencies` of any of them,
 * regardless of whether its version spec is parseable (e.g. `"latest"`, a tag, a git URL, …).
 */
export function hasPrimeng(tree: Tree): boolean {
    let found = false;
    visitWorkspacePackageJsons(tree, (pkg) => {
        if (found) {
            return;
        }
        if ('primeng' in (pkg.dependencies ?? {}) || 'primeng' in (pkg.devDependencies ?? {})) {
            found = true;
        }
    });
    return found;
}

/**
 * Scans every package.json in the workspace tree (skipping node_modules/dist/.angular/.git/out-tsc)
 * and returns true if `primeflex` is a key in `dependencies` or `devDependencies` of any of them.
 * Used to nudge users toward the `migrate-from-primeflex` schematic.
 */
export function hasPrimeflex(tree: Tree): boolean {
    let found = false;
    visitWorkspacePackageJsons(tree, (pkg) => {
        if (found) {
            return;
        }
        if ('primeflex' in (pkg.dependencies ?? {}) || 'primeflex' in (pkg.devDependencies ?? {})) {
            found = true;
        }
    });
    return found;
}

/**
 * Walks every package.json in the workspace tree (skipping node_modules/dist/.angular/.git/out-tsc),
 * invoking `visitor` with each successfully-parsed package.json contents.
 */
function visitWorkspacePackageJsons(tree: Tree, visitor: (pkg: Record<string, any>) => void): void {
    tree.visit((path) => {
        if (SKIP_DIRS.test(path) || !path.endsWith('/package.json')) {
            return;
        }
        const buffer = tree.read(path);
        if (!buffer) {
            return;
        }
        let pkg: Record<string, any>;
        try {
            pkg = JSON.parse(buffer.toString());
        } catch {
            return;
        }
        visitor(pkg);
    });
}
