import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { SKIP_DIRS } from '../../utils/package-json';
import { renameInput, renameInputInTypeScript, RenameInputSpec } from '../../utils/rename-input';

/**
 * Inputs renamed (their deprecated aliases removed) in 3.0.0 as part of the signal migration.
 * Extend this table as components are migrated.
 */
const RENAMED_INPUTS: readonly RenameInputSpec[] = [
    // OverlayBadge: the deprecated `size` input (a no-op alias that only logged a warning) was
    // removed — `badgeSize` is the input actually forwarded to the badge.
    { selectors: ['p-overlayBadge', 'p-overlay-badge', 'p-overlaybadge'], from: 'size', to: 'badgeSize' },
    // TreeSelect: the deprecated container styling inputs were removed — the standard `class` and
    // `style` attributes land on the same host element.
    { selectors: ['p-treeSelect', 'p-treeselect', 'p-tree-select'], from: 'containerStyleClass', to: 'class' },
    { selectors: ['p-treeSelect', 'p-treeselect', 'p-tree-select'], from: 'containerStyle', to: 'style' },
    // AutoComplete: the deprecated `minLength` alias was removed — `minQueryLength` is the input
    // that has been read since v20.
    { selectors: ['p-autoComplete', 'p-autocomplete', 'p-auto-complete'], from: 'minLength', to: 'minQueryLength' }
];

/**
 * Rewrites usages of inputs that were renamed in 3.0.0:
 *
 * - `from="x"`   → `to="x"`
 * - `[from]="e"` → `[to]="e"`
 *
 * A tag carrying both the old and the new input keeps the old attribute and is reported for
 * manual review — the new input's value is assumed to be the one the author wants to keep.
 */
export default function (): Rule {
    return (tree: Tree, context: SchematicContext) => {
        let filesChanged = 0;
        let renamed = 0;
        const conflicts: string[] = [];

        tree.visit((path) => {
            if (SKIP_DIRS.test(path)) {
                return;
            }
            if (path.endsWith('.html')) {
                const original = tree.read(path)?.toString();
                if (original === undefined) {
                    return;
                }
                let text = original;
                let changed = false;
                for (const spec of RENAMED_INPUTS) {
                    const result = renameInput(text, spec);
                    if (result.changed) {
                        text = result.text;
                        changed = true;
                        renamed += result.renamed;
                        context.logger.info(`${path}: renamed ${result.renamed} ${spec.from} usage(s) to ${spec.to}`);
                    }
                    for (const _ of result.conflicts) {
                        conflicts.push(`${path} (${spec.from} → ${spec.to})`);
                    }
                }
                if (changed) {
                    tree.overwrite(path, text);
                    filesChanged++;
                }
            } else if (path.endsWith('.ts') || path.endsWith('.mts')) {
                const original = tree.read(path)?.toString();
                if (original === undefined) {
                    return;
                }
                let text = original;
                let changed = false;
                for (const spec of RENAMED_INPUTS) {
                    const result = renameInputInTypeScript(path, text, spec);
                    if (result.changed) {
                        text = result.text;
                        changed = true;
                        renamed += result.renamed;
                        context.logger.info(`${path}: renamed ${result.renamed} ${spec.from} usage(s) to ${spec.to} in inline template`);
                    }
                    for (const _ of result.conflicts) {
                        conflicts.push(`${path} (${spec.from} → ${spec.to})`);
                    }
                }
                if (changed) {
                    tree.overwrite(path, text);
                    filesChanged++;
                }
            }
        });

        if (renamed > 0) {
            context.logger.info(`Renamed ${renamed} input usage(s) across ${filesChanged} file(s).`);
        } else {
            context.logger.info('No renamed-input usages found.');
        }

        if (conflicts.length > 0) {
            context.logger.warn(`Found ${conflicts.length} element(s) carrying both the old and the new input — remove the old one manually:`);
            for (const entry of conflicts) {
                context.logger.warn(`  ${entry}`);
            }
        }

        return tree;
    };
}
