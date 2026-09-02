import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { SKIP_DIRS } from '../../utils/package-json';
import { removeDeadInputs, removeDeadInputsInTypeScript } from '../../utils/removed-inputs';

/**
 * A set of inputs removed together in this version. Each group names the component selectors the
 * inputs lived on — the same input name may still exist on other components, so removal is always
 * selector-scoped.
 */
interface RemovedInputGroup {
    /** Human-readable label used in the summary log line. */
    label: string;
    /** The component's element selectors, e.g. ['p-cascadeSelect', 'p-cascadeselect']. */
    selectors: readonly string[];
    /** Input property names in this group. */
    names: readonly string[];
}

const REMOVED_INPUT_GROUPS: readonly RemovedInputGroup[] = [
    {
        label: 'CascadeSelect inputLabel',
        selectors: ['p-cascadeSelect', 'p-cascadeselect', 'p-cascade-select'],
        // `inputLabel` was declared but never read anywhere in the component — the binding had no
        // effect. Use `ariaLabel`/`inputId` + a <label> for accessible labeling.
        names: ['inputLabel']
    },
    {
        label: 'Tree togglerAriaLabel',
        selectors: ['p-tree'],
        // `togglerAriaLabel` was declared but never applied to any element — the binding had no
        // effect on the rendered output.
        names: ['togglerAriaLabel']
    },
    {
        label: 'TreeNode rowNode/root/firstChild/lastChild',
        selectors: ['p-treeNode', 'p-treenode', 'p-tree-node'],
        // These inputs were declared on the internal `p-treeNode` component but never read — the
        // bindings had no effect.
        names: ['rowNode', 'root', 'firstChild', 'lastChild']
    },
    {
        label: 'AutoComplete autoZIndex/baseZIndex/showTransitionOptions/hideTransitionOptions',
        selectors: ['p-autoComplete', 'p-autocomplete', 'p-auto-complete'],
        // Layering is managed by the overlay (`overlayOptions`), and the transition options were
        // superseded by `motionOptions` — none of these inputs were read anywhere.
        names: ['autoZIndex', 'baseZIndex', 'showTransitionOptions', 'hideTransitionOptions']
    },
    {
        label: 'SelectItem visible/itemSize',
        selectors: ['p-selectItem', 'p-selectitem', 'p-select-item'],
        // These inputs were declared on the internal `p-selectItem` component but never read —
        // item height comes from `scrollerOptions`.
        names: ['visible', 'itemSize']
    },
    {
        label: 'DatePicker showTransitionOptions/hideTransitionOptions',
        selectors: ['p-datePicker', 'p-datepicker', 'p-date-picker'],
        // Superseded by `motionOptions` — neither input was read anywhere.
        names: ['showTransitionOptions', 'hideTransitionOptions']
    },
    {
        label: 'TreeTableSortIcon ariaLabelDesc/ariaLabelAsc',
        selectors: ['p-treeTableSortIcon', 'p-treetable-sort-icon', 'p-tree-table-sort-icon'],
        // These inputs were declared on the internal sort icon component but never read — the
        // bindings had no effect on the rendered output.
        names: ['ariaLabelDesc', 'ariaLabelAsc']
    }
];

/**
 * Removes template bindings for inputs deleted in 3.0.0 that had already stopped doing anything:
 *
 * - CascadeSelect.inputLabel: declared but never read — the binding never had an effect.
 * - Tree.togglerAriaLabel: declared but never applied to any element.
 * - UITreeNode (`p-treeNode`) rowNode/root/firstChild/lastChild: declared but never read.
 * - AutoComplete autoZIndex/baseZIndex/showTransitionOptions/hideTransitionOptions: never read.
 * - SelectItem (`p-selectItem`) visible/itemSize: declared but never read.
 * - TreeTableSortIcon (`p-treeTableSortIcon`) ariaLabelDesc/ariaLabelAsc: declared but never read.
 * - DatePicker showTransitionOptions/hideTransitionOptions: superseded by `motionOptions`, never read.
 *
 * Both `[name]="expr"` bindings and `name="value"` static attributes are removed, only on the
 * component's own selectors. Programmatic access on component instances is not rewritten.
 */
export default function (): Rule {
    return (tree: Tree, context: SchematicContext) => {
        let filesChanged = 0;
        let bindingsRemoved = 0;

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
                let removedInFile = 0;
                for (const group of REMOVED_INPUT_GROUPS) {
                    const result = removeDeadInputs(text, group.selectors, group.names);
                    text = result.text;
                    removedInFile += result.removed;
                }
                if (removedInFile > 0) {
                    tree.overwrite(path, text);
                    filesChanged++;
                    bindingsRemoved += removedInFile;
                    context.logger.info(`${path}: removed ${removedInFile} dead input binding(s)`);
                }
            } else if (path.endsWith('.ts') || path.endsWith('.mts')) {
                const original = tree.read(path)?.toString();
                if (original === undefined) {
                    return;
                }
                let text = original;
                let removedInFile = 0;
                for (const group of REMOVED_INPUT_GROUPS) {
                    const result = removeDeadInputsInTypeScript(path, text, group.selectors, group.names);
                    text = result.text;
                    removedInFile += result.removed;
                }
                if (removedInFile > 0) {
                    tree.overwrite(path, text);
                    filesChanged++;
                    bindingsRemoved += removedInFile;
                    context.logger.info(`${path}: removed ${removedInFile} dead input binding(s) from inline template`);
                }
            }
        });

        if (bindingsRemoved > 0) {
            context.logger.info(`Removed ${bindingsRemoved} dead input binding(s) across ${filesChanged} file(s) for: ${REMOVED_INPUT_GROUPS.map((g) => g.label).join(', ')}.`);
        } else {
            context.logger.info('No bindings for the removed inputs were found to remove.');
        }

        return tree;
    };
}
