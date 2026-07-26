import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { translateHtml, translateTypeScript } from '../utils/primeflex';
import { hasPrimeflex, SKIP_DIRS } from '../utils/package-json';
import { Schema } from './schema';

// Files whose *class references* we still scan for after translating, so the leftover report can
// point the user at the PrimeFlex dependency / CSS import / config entries that need manual removal.
const REPORT_EXTENSIONS = ['.ts', '.mts', '.js', '.mjs', '.html', '.scss', '.css', '.sass', '.less', '.json', '.md'];
const LOCKFILE_NAMES = new Set(['package-lock.json', 'npm-shrinkwrap.json', 'yarn.lock', 'pnpm-lock.yaml', 'bun.lockb', 'bun.lock']);

/**
 * Translates PrimeFlex utility classes to their Tailwind CSS equivalents across the workspace's
 * Angular templates. Ported from the PrimeCLT `pf2tw` command: it applies the same PrimeFlex ->
 * Tailwind class dictionary, but only in class-bearing locations (HTML `class`/`ngClass` attributes,
 * `[class]`/`[ngClass]` bindings, and inline component templates) rather than every quoted string,
 * so unrelated code and data are never rewritten.
 *
 * This schematic deliberately does NOT change dependencies or scaffold Tailwind: it leaves
 * `primeflex` in package.json and does not install/configure `tailwindcss`. Those steps are
 * environment-specific; the schematic instead ends with a summary of the manual follow-up needed.
 */
export function migrateFromPrimeflex(options: Schema): Rule {
    return (tree: Tree, context: SchematicContext) => {
        const scope = normalizeScope(options.path);
        let htmlChanged = 0;
        let tsChanged = 0;

        tree.visit((path) => {
            if (SKIP_DIRS.test(path) || !inScope(path, scope)) {
                return;
            }
            if (path.endsWith('.html')) {
                const original = tree.read(path)!.toString();
                const { text, changed } = translateHtml(original);
                if (changed) {
                    tree.overwrite(path, text);
                    htmlChanged++;
                    context.logger.info(`${path}: translated PrimeFlex classes in template`);
                }
            } else if (path.endsWith('.ts') || path.endsWith('.mts')) {
                const original = tree.read(path)!.toString();
                const { text, changed } = translateTypeScript(path, original);
                if (changed) {
                    tree.overwrite(path, text);
                    tsChanged++;
                    context.logger.info(`${path}: translated PrimeFlex classes in inline template`);
                }
            }
        });

        const total = htmlChanged + tsChanged;
        if (total === 0) {
            context.logger.info('No PrimeFlex classes were found to translate.');
        } else {
            context.logger.info(`Translated PrimeFlex classes to Tailwind in ${total} file(s) (${htmlChanged} template(s), ${tsChanged} inline template(s)).`);
        }

        reportFollowUp(tree, context);
        return tree;
    };
}

function normalizeScope(path: string | undefined): string | null {
    if (!path) {
        return null;
    }
    const trimmed = path.replace(/^\/+/, '').replace(/\/+$/, '');
    return trimmed.length > 0 ? `/${trimmed}` : null;
}

function inScope(path: string, scope: string | null): boolean {
    if (scope === null) {
        return true;
    }
    return path === scope || path.startsWith(`${scope}/`);
}

function isLockfile(path: string): boolean {
    const basename = path.slice(path.lastIndexOf('/') + 1);
    return LOCKFILE_NAMES.has(basename);
}

/**
 * PrimeFlex ships more than utility classes (a reset, its own CSS, theme tokens) that this
 * class-level translation cannot remove. Warn the user about the remaining manual steps and point at
 * every file that still references `primeflex` so the cleanup is easy to finish.
 */
function reportFollowUp(tree: Tree, context: SchematicContext): void {
    const references: string[] = [];
    tree.visit((path, entry) => {
        if (SKIP_DIRS.test(path) || !entry || isLockfile(path) || !REPORT_EXTENSIONS.some((ext) => path.endsWith(ext))) {
            return;
        }
        entry.content
            .toString()
            .split('\n')
            .forEach((line, index) => {
                if (/primeflex/i.test(line)) {
                    references.push(`${path}:${index + 1}  ${line.trim()}`);
                }
            });
    });

    if (references.length === 0) {
        return;
    }

    context.logger.warn(
        'PrimeFlex classes were translated, but PrimeFlex itself is still present. To finish the migration:\n' +
            '  1. Make sure Tailwind CSS is installed and configured in this workspace.\n' +
            '  2. Remove the `primeflex` dependency and any PrimeFlex CSS imports (e.g. "primeflex/primeflex.css").\n' +
            '  3. Review the class translations, especially dynamic `[ngClass]` expressions.\n' +
            'The following references to primeflex remain and need manual review:'
    );
    for (const reference of references) {
        context.logger.warn(`  ${reference}`);
    }
}

// Re-exported so callers/tests can reuse the same detection the migrate-from-primeng warning uses.
export { hasPrimeflex };
