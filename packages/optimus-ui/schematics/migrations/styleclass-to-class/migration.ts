import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { SKIP_DIRS } from '../../utils/package-json';
import { migrateStyleClass, migrateStyleClassInTypeScript } from '../../utils/styleclass';

/**
 * Selectors of the components whose deprecated `styleClass` input was removed in 3.0.0 as part of
 * their signal migration. Extend this list as each component is migrated — the rewrite is the same
 * for all of them: `styleClass` becomes the plain `class` attribute, which the component host has
 * always merged.
 */
const MIGRATED_SELECTORS: readonly string[] = [
    'p-tag',
    // AvatarGroup
    'p-avatargroup',
    'p-avatarGroup',
    'p-avatar-group',
    // InputGroup
    'p-inputgroup',
    'p-inputGroup',
    'p-input-group',
    // InputGroupAddon
    'p-inputgroup-addon',
    'p-inputGroupAddon',
    // InputIcon
    'p-inputicon',
    'p-inputIcon',
    // IconField
    'p-iconfield',
    'p-iconField',
    'p-icon-field',
    // ProgressSpinner
    'p-progressSpinner',
    'p-progress-spinner',
    'p-progressspinner',
    // Divider
    'p-divider',
    // Skeleton
    'p-skeleton',
    // Avatar
    'p-avatar',
    // Toolbar
    'p-toolbar',
    // Timeline
    'p-timeline',
    // Terminal
    'p-terminal',
    // BlockUI
    'p-blockUI',
    'p-blockui',
    'p-block-ui',
    // Card
    'p-card',
    // Inplace
    'p-inplace',
    // Chip (the chipProps.styleClass property still works)
    'p-chip',
    // ToggleSwitch
    'p-toggleswitch',
    'p-toggleSwitch',
    'p-toggle-switch',
    // RadioButton
    'p-radioButton',
    'p-radiobutton',
    'p-radio-button',
    // ToggleButton
    'p-toggleButton',
    'p-togglebutton',
    'p-toggle-button',
    // Badge
    'p-badge',
    // Checkbox
    'p-checkbox',
    'p-checkBox',
    'p-check-box',
    // Panel
    'p-panel',
    // OrganizationChart
    'p-organizationChart',
    'p-organization-chart',
    'p-organizationchart',
    // Knob
    'p-knob',
    // SplitButton
    'p-splitbutton',
    'p-splitButton',
    'p-split-button',
    // Dock
    'p-dock',
    // Editor
    'p-editor',
    // ScrollPanel
    'p-scroll-panel',
    'p-scrollPanel',
    'p-scrollpanel',
    // DataView
    'p-dataView',
    'p-dataview',
    'p-data-view',
    // Splitter
    'p-splitter',
    // Accordion
    'p-accordion',
    // Image
    'p-image',
    // Toast
    'p-toast',
    // Slider
    'p-slider',
    // Paginator
    'p-paginator',
    // ColorPicker
    'p-colorPicker',
    'p-colorpicker',
    'p-color-picker',
    // Password
    'p-password',
    // Carousel
    'p-carousel',
    // PanelMenu
    'p-panelMenu',
    'p-panelmenu',
    'p-panel-menu',
    // Menubar
    'p-menubar',
    // MegaMenu
    'p-megaMenu',
    'p-megamenu',
    'p-mega-menu',
    // InputNumber
    'p-inputNumber',
    'p-inputnumber',
    'p-input-number',
    // CascadeSelect
    'p-cascadeSelect',
    'p-cascadeselect',
    'p-cascade-select',
    // Listbox
    'p-listbox',
    'p-listBox',
    'p-list-box',
    // OrderList
    'p-orderList',
    'p-orderlist',
    'p-order-list',
    // Tree
    'p-tree',
    // AutoComplete
    'p-autoComplete',
    'p-autocomplete',
    'p-auto-complete',
    // Select
    'p-select',
    // MultiSelect
    'p-multiSelect',
    'p-multiselect',
    'p-multi-select',
    // DatePicker
    'p-datePicker',
    'p-datepicker',
    'p-date-picker',
    // TreeTable
    'p-treeTable',
    'p-treetable',
    'p-tree-table',
    // Table
    'p-table'
];

/**
 * Rewrites usages of the removed `styleClass` input to the standard `class` attribute on the
 * components migrated in 3.0.0:
 *
 * - `styleClass="x"`   → `class="x"` (merged into an existing static `class` attribute if any)
 * - `[styleClass]="e"` → `[class]="e"`
 *
 * A tag carrying both `[styleClass]` and `[class]` is reported for manual review instead of being
 * rewritten (two `[class]` bindings would compete). Programmatic access to `.styleClass` on
 * component instances is not rewritten — `styleClass` still exists on the components that are not
 * yet migrated, so a blind rename would produce false positives.
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
                const result = migrateStyleClass(original, MIGRATED_SELECTORS);
                if (result.changed) {
                    tree.overwrite(path, result.text);
                    filesChanged++;
                    renamed += result.renamed;
                    context.logger.info(`${path}: rewrote ${result.renamed} styleClass usage(s) to class`);
                }
                for (const _ of result.conflicts) {
                    conflicts.push(path);
                }
            } else if (path.endsWith('.ts') || path.endsWith('.mts')) {
                const original = tree.read(path)?.toString();
                if (original === undefined) {
                    return;
                }
                const result = migrateStyleClassInTypeScript(path, original, MIGRATED_SELECTORS);
                if (result.changed) {
                    tree.overwrite(path, result.text);
                    filesChanged++;
                    renamed += result.renamed;
                    context.logger.info(`${path}: rewrote ${result.renamed} styleClass usage(s) to class in inline template`);
                }
                for (const _ of result.conflicts) {
                    conflicts.push(path);
                }
            }
        });

        if (renamed > 0) {
            context.logger.info(`Rewrote ${renamed} styleClass usage(s) to class across ${filesChanged} file(s) for: ${MIGRATED_SELECTORS.join(', ')}.`);
        } else {
            context.logger.info(`No styleClass usages found on: ${MIGRATED_SELECTORS.join(', ')}.`);
        }

        if (conflicts.length > 0) {
            context.logger.warn(`Found ${conflicts.length} element(s) carrying both [styleClass] and [class] — merge them into the single [class] binding manually:`);
            for (const path of conflicts) {
                context.logger.warn(`  ${path}`);
            }
        }

        return tree;
    };
}
