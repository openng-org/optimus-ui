import { CommonModule } from '@angular/common';
import { afterEveryRender, booleanAttribute, ChangeDetectionStrategy, Component, computed, contentChild, contentChildren, inject, input, model, NgModule, output, TemplateRef, ViewEncapsulation } from '@angular/core';
import { isAttributeEquals } from '@openng/optimus-ui-utils';
import { PrimeTemplate, SharedModule, TreeNode } from '@openng/optimus-ui/api';
import { BaseComponent, PARENT_INSTANCE } from '@openng/optimus-ui/basecomponent';
import { Bind, BindModule } from '@openng/optimus-ui/bind';
import { ChevronDownIcon, ChevronUpIcon } from '@openng/optimus-ui/icons';
import { OrganizationChartNodeCollapseEvent, OrganizationChartNodeExpandEvent, OrganizationChartNodeSelectEvent, OrganizationChartNodeUnSelectEvent, OrganizationChartPassThrough } from '@openng/optimus-ui/types/organizationchart';
import { OrganizationChartStyle } from './style/organizationchartstyle';

@Component({
    selector: '[pOrganizationChartNode]',
    standalone: true,
    imports: [CommonModule, ChevronDownIcon, ChevronUpIcon, SharedModule, BindModule],
    template: `
        @if (node(); as node) {
            <tbody [pBind]="ptm('body')">
                <tr [pBind]="ptm('row')">
                    <td [attr.colspan]="colspan()" [pBind]="ptm('cell')">
                        <div [class]="cn(cx('node'), node.styleClass)" (click)="onNodeClick($event, node)" [pBind]="getPTOptions('node')">
                            @if (!chart.getTemplateForNode(node)) {
                                <div>{{ node.label }}</div>
                            }
                            @if (chart.getTemplateForNode(node)) {
                                <div>
                                    <ng-container *ngTemplateOutlet="chart.getTemplateForNode(node); context: { $implicit: node }"></ng-container>
                                </div>
                            }
                            @if (collapsible()) {
                                @if (!leaf()) {
                                    <a tabindex="0" [class]="cx('nodeToggleButton')" (click)="toggleNode($event, node)" (keydown.enter)="toggleNode($event, node)" (keydown.space)="toggleNode($event, node)" [pBind]="getPTOptions('nodeToggleButton')">
                                        @if (!chart.$togglerIconTemplate()) {
                                            @if (node.expanded) {
                                                <svg data-p-icon="chevron-down" [class]="cx('nodeToggleButtonIcon')" [pBind]="getPTOptions('nodeToggleButtonIcon')" />
                                            }
                                            @if (!node.expanded) {
                                                <svg data-p-icon="chevron-up" [class]="cx('nodeToggleButtonIcon')" [pBind]="getPTOptions('nodeToggleButtonIcon')" />
                                            }
                                        }
                                        @if (chart.$togglerIconTemplate()) {
                                            <span [class]="cx('nodeToggleButtonIcon')" [pBind]="getPTOptions('nodeToggleButtonIcon')">
                                                <ng-template *ngTemplateOutlet="chart.$togglerIconTemplate(); context: { $implicit: node.expanded }"></ng-template>
                                            </span>
                                        }
                                    </a>
                                }
                            }
                        </div>
                    </td>
                </tr>
                <tr [ngStyle]="getChildStyle(node)" [class]="cx('connectors')" [pBind]="ptm('connectors')">
                    <td [pBind]="ptm('lineCell')" [attr.colspan]="colspan()">
                        <div [pBind]="ptm('connectorDown')" [class]="cx('connectorDown')"></div>
                    </td>
                </tr>
                <tr [ngStyle]="getChildStyle(node)" [class]="cx('connectors')" [pBind]="ptm('connectors')">
                    @if (node.children && node.children.length === 1) {
                        <td [pBind]="ptm('lineCell')" [attr.colspan]="colspan()">
                            <div [pBind]="ptm('connectorDown')" [class]="cx('connectorDown')"></div>
                        </td>
                    }
                    @if (node.children && node.children.length > 1) {
                        @for (child of node.children; track child; let first = $first; let last = $last; let index = $index) {
                            <td [class]="cx('connectorLeft', { first })" [pBind]="getNodeOptions(!(index === 0), 'connectorLeft')">&nbsp;</td>
                            <td [class]="cx('connectorRight', { last })" [pBind]="getNodeOptions(!(index === node.children.length - 1), 'connectorRight')">&nbsp;</td>
                        }
                    }
                </tr>
                <tr [ngStyle]="getChildStyle(node)" [class]="cx('nodeChildren')" [pBind]="ptm('nodeChildren')">
                    @for (child of node.children; track child) {
                        <td colspan="2" [pBind]="ptm('nodeCell')">
                            <table [class]="cx('table')" pOrganizationChartNode [unstyled]="unstyled()" [pt]="pt()" [node]="child" [collapsible]="node.children && node.children.length > 0 && collapsible()"></table>
                        </td>
                    }
                </tr>
            </tbody>
        }
    `,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Eager,
    providers: [OrganizationChartStyle, { provide: PARENT_INSTANCE, useExisting: OrganizationChartNode }]
})
export class OrganizationChartNode extends BaseComponent {
    chart = inject(OrganizationChart);

    _componentStyle = inject(OrganizationChartStyle);

    readonly node = input<TreeNode<any>>();

    readonly collapsible = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    /** Whether the node has no children (a `leaf: false` node is never a leaf). */
    readonly leaf = computed<boolean | undefined>(() => {
        const node = this.node();
        if (node) {
            return node.leaf == false ? false : !(node.children && node.children.length);
        }
        return undefined;
    });

    /** Colspan of the node cell, derived from the number of children. */
    readonly colspan = computed(() => {
        const node = this.node();
        if (node) {
            return node.children && node.children.length ? node.children.length * 2 : null;
        }
        return undefined;
    });

    getChildStyle(node: TreeNode<any>) {
        return {
            visibility: !this.leaf() && node.expanded ? 'inherit' : 'hidden'
        };
    }

    getPTOptions(key: string) {
        return this.ptm(key, {
            context: {
                expanded: this.node()?.expanded,
                selectable: this.node()?.selectable !== false && this.chart.selectionMode(),
                selected: this.isSelected(),
                toggleable: this.collapsible() && !this.leaf(),
                active: this.isSelected()
            }
        });
    }

    getNodeOptions(lineTop: boolean, key: string) {
        return this.ptm(key, {
            context: {
                lineTop
            }
        });
    }

    onNodeClick(event: Event, node: TreeNode) {
        this.chart.onNodeClick(event, node);
    }

    toggleNode(event: Event, node: TreeNode) {
        node.expanded = !node.expanded;
        if (node.expanded) this.chart.onNodeExpand.emit({ originalEvent: event, node: <TreeNode>this.node() });
        else this.chart.onNodeCollapse.emit({ originalEvent: event, node: <TreeNode>this.node() });

        event.preventDefault();
    }

    isSelected() {
        return this.chart.isSelected(this.node() as TreeNode);
    }
}
/**
 * OrganizationChart visualizes hierarchical organization data.
 * @group Components
 */
@Component({
    selector: 'p-organizationChart, p-organization-chart, p-organizationchart',
    standalone: true,
    imports: [CommonModule, OrganizationChartNode, SharedModule, BindModule],
    template: `
        @if (root(); as root) {
            <table [class]="cx('table')" [collapsible]="collapsible()" pOrganizationChartNode [pt]="pt()" [unstyled]="unstyled()" [node]="root" [pBind]="ptm('table')"></table>
        }
    `,
    changeDetection: ChangeDetectionStrategy.Eager,
    providers: [OrganizationChartStyle, { provide: PARENT_INSTANCE, useExisting: OrganizationChart }],
    host: {
        '[class]': "cx('root')"
    },
    hostDirectives: [Bind]
})
export class OrganizationChart extends BaseComponent<OrganizationChartPassThrough> {
    _componentStyle = inject(OrganizationChartStyle);

    bindDirectiveInstance = inject(Bind, { self: true });

    /**
     * An array of nested TreeNodes.
     * @group Props
     */
    readonly value = input<TreeNode[]>();

    /**
     * Defines the selection mode.
     * @group Props
     */
    readonly selectionMode = input<'single' | 'multiple' | null>();

    /**
     * Whether the nodes can be expanded or toggled.
     * @group Props
     */
    readonly collapsible = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    /**
     * Whether the space allocated by a node is preserved when hidden.
     * @deprecated since v20.0.0.
     * @group Props
     */
    readonly preserveSpace = input<boolean, unknown>(true, { transform: booleanAttribute });

    /**
     * A single treenode instance or an array to refer to the selections. Supports two-way binding
     * via `[(selection)]`; the model emits `selectionChange` on every change.
     * @group Props
     */
    readonly selection = model<any>();

    /**
     * Callback to invoke when a node is selected.
     * @param {OrganizationChartNodeSelectEvent} event - custom node select event.
     * @group Emits
     */
    readonly onNodeSelect = output<OrganizationChartNodeSelectEvent>();

    /**
     * Callback to invoke when a node is unselected.
     * @param {OrganizationChartNodeUnSelectEvent} event - custom node unselect event.
     * @group Emits
     */
    readonly onNodeUnselect = output<OrganizationChartNodeUnSelectEvent>();

    /**
     * Callback to invoke when a node is expanded.
     * @param {OrganizationChartNodeExpandEvent} event - custom node expand event.
     * @group Emits
     */
    readonly onNodeExpand = output<OrganizationChartNodeExpandEvent>();

    /**
     * Callback to invoke when a node is collapsed.
     * @param {OrganizationChartNodeCollapseEvent} event - custom node collapse event.
     * @group Emits
     */
    readonly onNodeCollapse = output<OrganizationChartNodeCollapseEvent>();

    readonly togglerIconTemplate = contentChild<TemplateRef<any>>('togglericon', { descendants: false });

    readonly templates = contentChildren(PrimeTemplate);

    componentName = 'OrganizationChart';

    /** Effective toggler icon template: the \`#togglericon\` content child, or a legacy \`pTemplate="togglericon"\`. */
    readonly $togglerIconTemplate = computed(() => this.togglerIconTemplate() ?? this.templates().find((item) => item.getType() === 'togglericon')?.template);

    /**
     * Map of node type → template, built from the projected \`pTemplate\` directives (the
     * \`togglericon\` template is excluded — it has its own slot). \`undefined\` when no templates
     * are projected at all, mirroring the legacy \`templateMap\` behavior.
     */
    readonly $templateMap = computed<Record<string, TemplateRef<any>> | undefined>(() => {
        const templates = this.templates();
        if (!templates.length) {
            return undefined;
        }
        const map: Record<string, TemplateRef<any>> = {};
        for (const item of templates) {
            if (item.getType() !== 'togglericon') {
                map[item.getType()] = item.template;
            }
        }
        return map;
    });

    /** The root node to render: the first entry of \`value\`. */
    readonly root = computed<TreeNode<any> | null>(() => {
        const value = this.value();
        return value && value.length ? value[0] : null;
    });

    constructor() {
        super();
        // Re-apply the host/root pass-through sections after each render (replaces the former
        // ngAfterViewChecked hook). Bind.setAttrs writes into a signal behind an equality check,
        // so unchanged PT resolutions are no-ops.
        afterEveryRender(() => {
            this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
        });
    }

    getTemplateForNode(node: TreeNode): TemplateRef<any> | null {
        const templateMap = this.$templateMap();
        if (templateMap) return node.type ? templateMap[node.type] : templateMap['default'];
        else return null;
    }

    onNodeClick(event: Event, node: TreeNode) {
        let eventTarget = <Element>event.target;

        if (isAttributeEquals(eventTarget, 'data-pc-section', 'nodetogglebutton') || isAttributeEquals(eventTarget, 'data-pc-section', 'nodetogglebuttonicon')) {
            return;
        } else if (this.selectionMode()) {
            if (node.selectable === false) {
                return;
            }

            let index = this.findIndexInSelection(node);
            let selected = index >= 0;

            if (this.selectionMode() === 'single') {
                if (selected) {
                    this.selection.set(null);
                    this.onNodeUnselect.emit({ originalEvent: event, node: node });
                } else {
                    this.selection.set(node);
                    this.onNodeSelect.emit({ originalEvent: event, node: node });
                }
            } else if (this.selectionMode() === 'multiple') {
                if (selected) {
                    this.selection.update((selection: any[]) => selection.filter((val: any, i: number) => i != index));
                    this.onNodeUnselect.emit({ originalEvent: event, node: node });
                } else {
                    this.selection.update((selection: any) => [...(selection || []), node]);
                    this.onNodeSelect.emit({ originalEvent: event, node: node });
                }
            }
        }
    }

    findIndexInSelection(node: TreeNode) {
        let index: number = -1;
        const selection = this.selection();

        if (this.selectionMode() && selection) {
            if (this.selectionMode() === 'single') {
                index = selection == node ? 0 : -1;
            } else if (this.selectionMode() === 'multiple') {
                for (let i = 0; i < selection.length; i++) {
                    if (selection[i] == node) {
                        index = i;
                        break;
                    }
                }
            }
        }

        return index;
    }

    isSelected(node: TreeNode) {
        return this.findIndexInSelection(node) != -1;
    }
}

@NgModule({
    imports: [OrganizationChart, OrganizationChartNode, SharedModule],
    exports: [OrganizationChart, OrganizationChartNode, SharedModule]
})
export class OrganizationChartModule {}
