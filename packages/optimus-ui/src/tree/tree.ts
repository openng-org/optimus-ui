import { CommonModule } from '@angular/common';
import {
    afterEveryRender,
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    ElementRef,
    forwardRef,
    inject,
    input,
    linkedSignal,
    model,
    NgModule,
    numberAttribute,
    signal,
    TemplateRef,
    untracked,
    ViewEncapsulation,
    contentChild,
    viewChild,
    contentChildren,
    output
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { find, findSingle, focus, getOuterHeight, getOuterWidth, removeAccents, resolveFieldData } from '@openng/optimus-ui-utils';
import { BlockableUI, PrimeTemplate, ScrollerOptions, SharedModule, TranslationKeys, TreeDragDropService, TreeNode } from '@openng/optimus-ui/api';
import { AutoFocusModule } from '@openng/optimus-ui/autofocus';
import { BaseComponent, PARENT_INSTANCE } from '@openng/optimus-ui/basecomponent';
import { Bind, BindModule } from '@openng/optimus-ui/bind';
import { Checkbox } from '@openng/optimus-ui/checkbox';
import { IconField } from '@openng/optimus-ui/iconfield';
import { ChevronDownIcon, ChevronRightIcon, SearchIcon, SpinnerIcon } from '@openng/optimus-ui/icons';
import { InputIcon } from '@openng/optimus-ui/inputicon';
import { InputText } from '@openng/optimus-ui/inputtext';
import { Ripple } from '@openng/optimus-ui/ripple';
import { Scroller } from '@openng/optimus-ui/scroller';
import { Nullable } from '@openng/optimus-ui/ts-helpers';
import {
    TreeCheckboxIconTemplateContext,
    TreeFilterEvent,
    TreeFilterTemplateContext,
    TreeLazyLoadEvent,
    TreeLoaderTemplateContext,
    TreeNodeCollapseEvent,
    TreeNodeContextMenuSelectEvent,
    TreeNodeDoubleClickEvent,
    TreeNodeDropEvent,
    TreeNodeExpandEvent,
    TreeNodeSelectEvent,
    TreeNodeUnSelectEvent,
    TreePassThrough,
    TreeScrollEvent,
    TreeScrollIndexChangeEvent,
    TreeTogglerIconTemplateContext
} from '@openng/optimus-ui/types/tree';
import { Subscription } from 'rxjs';
import { TreeStyle } from './style/treestyle';

@Component({
    selector: 'p-treeNode',
    standalone: true,
    imports: [CommonModule, Ripple, Checkbox, FormsModule, ChevronRightIcon, ChevronDownIcon, SpinnerIcon, SharedModule, BindModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        @if (node(); as node) {
            <li
                [class]="cn(cx('node'), node.styleClass)"
                [ngStyle]="{ height: itemSize() + 'px' }"
                [style]="node.style"
                [attr.aria-label]="node.label"
                [attr.aria-checked]="checked"
                [attr.aria-setsize]="node.children ? node.children.length : 0"
                [attr.aria-selected]="selected"
                [attr.aria-expanded]="node.expanded"
                [attr.aria-posinset]="index() + 1"
                [attr.aria-level]="level() + 1"
                [attr.tabindex]="index() === 0 ? 0 : -1"
                [attr.data-id]="node.key"
                role="treeitem"
                (keydown)="onKeyDown($event)"
                [pBind]="getPTOptions('node')"
            >
                @if (isPrevDropPointActive()) {
                    <div [class]="cx('dropPoint')" [attr.aria-hidden]="true" [pBind]="getPTOptions('dropPoint')"></div>
                }
                <div
                    [class]="cx('nodeContent')"
                    [style.paddingLeft]="level() * indentation() + 'rem'"
                    (click)="onNodeClick($event)"
                    (contextmenu)="onNodeRightClick($event)"
                    (dblclick)="onNodeDblClick($event)"
                    (touchend)="onNodeTouchEnd()"
                    (drop)="onNodeDrop($event)"
                    (dragstart)="onNodeDragStart($event)"
                    (dragover)="onNodeDragOver($event)"
                    (dragleave)="onNodeDragLeave($event)"
                    (dragend)="onNodeDragEnd($event)"
                    [draggable]="tree.draggableNodes()"
                    [pBind]="getPTOptions('nodeContent')"
                >
                    <button type="button" [class]="cx('nodeToggleButton')" (click)="toggle($event)" pRipple tabindex="-1" [pBind]="getPTOptions('nodeToggleButton')">
                        @if (!tree.$togglerIconTemplate()) {
                            @if (!node.loading) {
                                @if (!node.expanded) {
                                    <svg data-p-icon="chevron-right" [class]="cx('nodeToggleIcon')" [pBind]="getPTOptions('nodeToggleIcon')" />
                                }
                                @if (node.expanded) {
                                    <svg data-p-icon="chevron-down" [class]="cx('nodeToggleIcon')" [pBind]="getPTOptions('nodeToggleIcon')" />
                                }
                            }
                            @if (loadingMode() === 'icon' && node.loading) {
                                <svg data-p-icon="spinner" [class]="cx('nodeToggleIcon')" spin [pBind]="getPTOptions('nodeToggleIcon')" />
                            }
                        }
                        @if (tree.$togglerIconTemplate()) {
                            <span [class]="cx('nodeToggleIcon')" [pBind]="getPTOptions('nodeToggleIcon')">
                                <ng-template *ngTemplateOutlet="tree.$togglerIconTemplate(); context: { $implicit: node.expanded, loading: node.loading }"></ng-template>
                            </span>
                        }
                    </button>

                    @if (tree.selectionMode() == 'checkbox') {
                        <p-checkbox
                            [ngModel]="isSelected()"
                            [ngModelOptions]="{ standalone: true }"
                            [class]="cx('nodeCheckbox')"
                            [binary]="true"
                            [indeterminate]="node.partialSelected"
                            [disabled]="node.selectable === false"
                            [variant]="tree?.config.inputStyle() === 'filled' || tree?.config.inputVariant() === 'filled' ? 'filled' : 'outlined'"
                            [attr.data-p-partialchecked]="node.partialSelected"
                            [tabindex]="-1"
                            (click)="$event.preventDefault()"
                            [pt]="getPTOptions('pcNodeCheckbox')"
                            [unstyled]="unstyled()"
                        >
                            @if (tree.$checkboxIconTemplate()) {
                                <ng-template #icon>
                                    <ng-template
                                        *ngTemplateOutlet="
                                            tree.$checkboxIconTemplate();
                                            context: {
                                                $implicit: isSelected(),
                                                partialSelected: node.partialSelected,
                                                class: cx('nodeCheckbox')
                                            }
                                        "
                                    ></ng-template>
                                </ng-template>
                            }
                        </p-checkbox>
                    }

                    @if (node.icon || node.expandedIcon || node.collapsedIcon) {
                        <span [class]="getIcon()" [pBind]="getPTOptions('nodeIcon')"></span>
                    }
                    <span [class]="cx('nodeLabel')" [pBind]="getPTOptions('nodeLabel')">
                        @if (!tree.getTemplateForNode(node)) {
                            <span>{{ node.label }}</span>
                        }
                        @if (tree.getTemplateForNode(node)) {
                            <span>
                                <ng-container *ngTemplateOutlet="tree.getTemplateForNode(node); context: { $implicit: node }"></ng-container>
                            </span>
                        }
                    </span>
                </div>
                @if (isNextDropPointActive()) {
                    <div [class]="cx('dropPoint', { next: true })" [attr.aria-hidden]="true" [pBind]="getPTOptions('dropPoint')"></div>
                }
                @if (!tree.virtualScroll() && node.children && node.expanded) {
                    <ul [class]="cx('nodeChildren')" role="group" [pBind]="ptm('nodeChildren')">
                        @for (childNode of node.children; track tree.trackBy().bind(this)(index, childNode); let index = $index) {
                            <p-treeNode [node]="childNode" [parentNode]="node" [index]="index" [itemSize]="itemSize()" [level]="level() + 1" [loadingMode]="loadingMode()" [pt]="pt" [unstyled]="unstyled()"></p-treeNode>
                        }
                    </ul>
                }
            </li>
        }
    `,
    encapsulation: ViewEncapsulation.None,
    providers: [TreeStyle, { provide: PARENT_INSTANCE, useExisting: UITreeNode }]
})
export class UITreeNode extends BaseComponent<TreePassThrough> {
    tree: Tree = inject(forwardRef(() => Tree));

    _componentStyle = inject(TreeStyle);

    readonly node = input<TreeNode<any>>();

    readonly parentNode = input<TreeNode<any>>();

    readonly index = input<number | undefined, unknown>(undefined, { transform: numberAttribute });

    readonly level = input<number | undefined, unknown>(undefined, { transform: numberAttribute });

    readonly indentation = input<number | undefined, unknown>(undefined, { transform: numberAttribute });

    readonly itemSize = input<number | undefined, unknown>(undefined, { transform: numberAttribute });

    readonly loadingMode = input<string>();

    static ICON_CLASS: string = 'p-tree-node-icon ';

    timeout: any;

    isPrevDropPointHovered = signal<boolean>(false);

    isNextDropPointHovered = signal<boolean>(false);

    isNodeDropHovered = signal<boolean>(false);

    isPrevDropPointActive = computed(() => this.isPrevDropPointHovered() && this.isDroppable());

    isNextDropPointActive = computed(() => this.isNextDropPointHovered() && this.isDroppable());

    isNodeDropActive = computed(() => this.isNodeDropHovered() && this.isNodeDroppable());

    dropPosition = computed(() => (this.isPrevDropPointActive() ? -1 : this.isNextDropPointActive() ? 1 : 0));

    /**
     * Computed signal that reactively tracks selection state.
     */
    private _selected = computed(() => {
        // Reading selection() makes this computed reactive to selection changes
        this.tree.selection();
        return this.tree.isSelected(<TreeNode>this.node());
    });

    /**
     * Computed signal that reactively tracks context menu selection state.
     */
    private _contextMenuSelected = computed(() => {
        const selection = this.tree.contextMenuSelection();
        const node = this.node();
        if (!selection || !node) {
            return false;
        }
        return selection === node || (selection.key && selection.key === node.key);
    });

    get selected() {
        return this.tree.selectionMode() === 'single' || this.tree.selectionMode() === 'multiple' ? this._selected() : undefined;
    }

    get checked() {
        return this.tree.selectionMode() === 'checkbox' ? this._selected() : undefined;
    }

    get selectable() {
        return this.node()?.selectable === false ? false : this.tree?.selectionMode() != null;
    }

    get subNodes(): TreeNode[] | undefined {
        const node = this.node();
        return node?.parent ? node.parent.children : this.tree.$value();
    }

    onInit() {
        (<TreeNode>this.node()).parent = this.parentNode();
        const nativeElement = this.tree.el.nativeElement;
        const pDialogWrapper = nativeElement.closest('p-dialog');
        if (this.parentNode() && !pDialogWrapper) {
            this.setAllNodesTabIndexes();
            this.tree.syncNodeOption(<TreeNode>this.node(), <TreeNode<any>[]>this.tree.$value(), 'parent', this.tree.getNodeWithKey(<string>this.parentNode()?.key, <TreeNode<any>[]>this.tree.$value()));
        }
    }

    getPTOptions(key: string) {
        return this.ptm(key, {
            context: {
                node: this.node(),
                index: this.index(),
                expanded: this.node()?.expanded,
                selected: this.selected,
                checked: this.checked,
                partialChecked: this.node()?.partialSelected,
                leaf: this.isLeaf()
            }
        });
    }

    getIcon() {
        let icon: string | undefined;
        const node = <TreeNode>this.node();

        if (node.icon) icon = node.icon as string;
        else icon = node.expanded && node.children && node.children?.length ? node.expandedIcon : node.collapsedIcon;

        return UITreeNode.ICON_CLASS + ' ' + icon + ' p-tree-node-icon';
    }

    isLeaf() {
        return this.tree.isNodeLeaf(<TreeNode>this.node());
    }

    isSelected() {
        return this._selected();
    }

    isContextMenuSelected() {
        return this._contextMenuSelected();
    }

    isSameNode(event) {
        return event.currentTarget && (event.currentTarget.isSameNode(event.target) || event.currentTarget.isSameNode(event.target.closest('[role="treeitem"]')));
    }

    isDraggable() {
        return this.tree.draggableNodes();
    }

    isDroppable() {
        return this.tree.droppableNodes() && this.tree.allowDrop(<TreeNode>this.tree.dragNode(), <TreeNode>this.node(), this.tree.dragNodeScope());
    }

    isNodeDroppable() {
        return (<TreeNode>this.node())?.droppable !== false && this.isDroppable();
    }

    isNodeDraggable() {
        return (<TreeNode>this.node())?.draggable !== false && this.isDraggable();
    }

    toggle(event: Event) {
        if ((<TreeNode>this.node()).expanded) this.collapse(event);
        else this.expand(event);

        event.stopPropagation();
    }

    expand(event: Event) {
        (<TreeNode>this.node()).expanded = true;
        if (this.tree.virtualScroll()) {
            this.tree.updateSerializedValue();
            this.focusVirtualNode();
        }
        this.tree.onNodeExpand.emit({ originalEvent: event, node: <TreeNode>this.node() });
    }

    collapse(event: Event) {
        (<TreeNode>this.node()).expanded = false;
        if (this.tree.virtualScroll()) {
            this.tree.updateSerializedValue();
        }
        this.tree.onNodeCollapse.emit({ originalEvent: event, node: <TreeNode>this.node() });
        this.focusVirtualNode();
    }

    onNodeClick(event: MouseEvent) {
        this.tree.onNodeClick(event, <TreeNode>this.node());
    }

    onNodeTouchEnd() {
        this.tree.onNodeTouchEnd();
    }

    onNodeRightClick(event: MouseEvent) {
        this.tree.onNodeRightClick(event, <TreeNode>this.node());
    }

    onNodeDblClick(event: MouseEvent) {
        this.tree.onNodeDblClick(event, <TreeNode>this.node());
    }

    insertNodeOnDrop() {
        const dragNode = this.tree.dragNode();
        const dragNodeIndex = this.tree.dragNodeIndex();
        const dragNodeSubNodes = this.tree.dragNodeSubNodes();
        const node = this.node();

        if (!node || dragNodeIndex == null || !dragNode || !dragNodeSubNodes) {
            return;
        }

        const position = this.dropPosition();
        const subNodes = this.subNodes || [];
        const index = this.index() || 0;
        const dropIndex = dragNodeSubNodes === subNodes ? (dragNodeIndex > index ? index : index - 1) : index;

        dragNodeSubNodes.splice(dragNodeIndex, 1);

        if (position < 0) {
            // insert before a Node
            subNodes.splice(dropIndex, 0, dragNode);
        } else if (position > 0) {
            // insert after a Node
            subNodes.splice(dropIndex + 1, 0, dragNode);
        } else {
            // insert as child of a Node
            node.children = node.children || [];
            node.children.push(dragNode);
        }

        this.tree.dragDropService?.stopDrag({
            node: dragNode,
            subNodes,
            index: dragNodeIndex
        });
    }

    onNodeDrop(event: any) {
        event.preventDefault();
        event.stopPropagation();

        if (this.isDroppable()) {
            const dragNode = this.tree.dragNode();
            const position = this.dropPosition();
            const isValidDrop = position !== 0 || (position === 0 && this.isNodeDroppable());

            if (isValidDrop) {
                if (this.tree.validateDrop()) {
                    this.tree.onNodeDrop.emit({
                        originalEvent: event,
                        dragNode: dragNode,
                        dropNode: this.node(),
                        index: this.index(),
                        accept: () => {
                            this.insertNodeOnDrop();
                        }
                    });
                } else {
                    this.insertNodeOnDrop();
                    this.tree.onNodeDrop.emit({
                        originalEvent: event,
                        dragNode: dragNode,
                        dropNode: this.node(),
                        index: this.index()
                    });
                }
            }
        }

        this.isPrevDropPointHovered.set(false);
        this.isNextDropPointHovered.set(false);
        this.isNodeDropHovered.set(false);
    }

    onNodeDragStart(event: any) {
        if (this.isNodeDraggable()) {
            event.dataTransfer.effectAllowed = 'all';
            event.dataTransfer?.setData('text', 'data');

            const target = event.currentTarget as HTMLElement;
            const dragEl = target.cloneNode(true) as HTMLElement;
            const toggler = <HTMLElement>dragEl.querySelector('[data-pc-section="nodetogglebutton"]');
            const checkbox = <HTMLElement>dragEl.querySelector('[data-pc-name="pcnodecheckbox"]');

            target.setAttribute('data-p-dragging', 'true');
            dragEl.style.width = getOuterWidth(target) + 'px';
            dragEl.style.height = getOuterHeight(target) + 'px';
            dragEl.setAttribute('data-pc-section', 'drag-image');
            toggler.style.visibility = 'hidden';
            checkbox?.remove();
            document.body.appendChild(dragEl);

            event.dataTransfer?.setDragImage(dragEl, 0, 0);

            setTimeout(() => document.body.removeChild(dragEl), 0);

            this.tree.dragDropService?.startDrag({
                tree: this,
                node: this.node(),
                subNodes: this.subNodes,
                index: this.index(),
                scope: this.tree.draggableScope()
            });
        } else {
            event.preventDefault();
        }
    }

    onNodeDragOver(event: any) {
        if (this.isDroppable()) {
            event.dataTransfer.dropEffect = 'copy';

            const nodeElement = event.currentTarget as HTMLElement;
            const rect = nodeElement.getBoundingClientRect();
            const y = event.clientY - parseInt(rect.top as any);

            this.isPrevDropPointHovered.set(false);
            this.isNextDropPointHovered.set(false);
            this.isNodeDropHovered.set(false);

            if (y < rect.height * 0.25) {
                this.isPrevDropPointHovered.set(true);
            } else if (y > rect.height * 0.75) {
                this.isNextDropPointHovered.set(true);
            } else if (this.isNodeDroppable()) {
                this.isNodeDropHovered.set(true);
            }
        } else {
            event.dataTransfer.dropEffect = 'none';
        }

        if (this.tree.droppableNodes()) {
            event.preventDefault();
            event.stopPropagation();
        }
    }

    onNodeDragLeave() {
        this.isPrevDropPointHovered.set(false);
        this.isNextDropPointHovered.set(false);
        this.isNodeDropHovered.set(false);
    }

    onNodeDragEnd(event: any) {
        event.currentTarget?.removeAttribute('data-p-dragging');

        this.tree.dragDropService?.stopDrag({
            node: this.node(),
            subNodes: this.subNodes,
            index: this.index()
        });
    }

    onKeyDown(event: KeyboardEvent) {
        if (!this.isSameNode(event) || (this.tree.contextMenu() && this.tree.contextMenu().containerViewChild?.nativeElement.style.display === 'block')) {
            return;
        }

        switch (event.code) {
            //down arrow
            case 'ArrowDown':
                this.onArrowDown(event);
                break;

            //up arrow
            case 'ArrowUp':
                this.onArrowUp(event);
                break;

            //right arrow
            case 'ArrowRight':
                this.onArrowRight(event);
                break;

            //left arrow
            case 'ArrowLeft':
                this.onArrowLeft(event);
                break;

            //enter
            case 'Enter':
            case 'Space':
            case 'NumpadEnter':
                this.onEnter(event);
                break;
            //tab
            case 'Tab':
                this.setAllNodesTabIndexes();
                break;

            default:
                //no op
                break;
        }
    }

    onArrowUp(event: KeyboardEvent) {
        const nodeElement = (<HTMLDivElement>event.target).getAttribute('data-pc-section') === 'nodetogglebutton' ? (<HTMLDivElement>event.target).closest('[role="treeitem"]') : (<HTMLDivElement>event.target).parentElement;

        if (nodeElement?.previousElementSibling) {
            this.focusRowChange(nodeElement, nodeElement.previousElementSibling, this.findLastVisibleDescendant(nodeElement.previousElementSibling));
        } else {
            let parentNodeElement = this.getParentNodeElement(nodeElement!);

            if (parentNodeElement) {
                this.focusRowChange(nodeElement, parentNodeElement);
            }
        }

        event.preventDefault();
    }

    onArrowDown(event: KeyboardEvent) {
        const nodeElement = (<HTMLDivElement>event.target).getAttribute('data-pc-section') === 'nodetogglebutton' ? (<HTMLDivElement>event.target).closest('[role="treeitem"]') : <HTMLDivElement>event.target;
        const listElement = nodeElement?.children[1];

        if (listElement && listElement.children.length > 0) {
            this.focusRowChange(nodeElement, listElement.children[0]);
        } else {
            if (nodeElement?.parentElement?.nextElementSibling) {
                this.focusRowChange(nodeElement, nodeElement.parentElement.nextElementSibling);
            } else {
                let nextSiblingAncestor = this.findNextSiblingOfAncestor(nodeElement?.parentElement!);

                if (nextSiblingAncestor) {
                    this.focusRowChange(nodeElement, nextSiblingAncestor);
                }
            }
        }
        event.preventDefault();
    }

    onArrowRight(event: KeyboardEvent) {
        if (!this.node()?.expanded && !this.tree.isNodeLeaf(<TreeNode>this.node())) {
            this.expand(event);
            (<HTMLDivElement>event.currentTarget).tabIndex = -1;

            setTimeout(() => {
                this.onArrowDown(event);
            }, 1);
        }
        event.preventDefault();
    }

    onArrowLeft(event: KeyboardEvent) {
        const nodeElement = (<HTMLDivElement>event.target).getAttribute('data-pc-section') === 'nodetogglebutton' ? (<HTMLDivElement>event.target).closest('[role="treeitem"]') : <HTMLDivElement>event.target;

        if (this.level() === 0 && !this.node()?.expanded) {
            return false;
        }

        if (this.node()?.expanded) {
            this.collapse(event);
            return;
        }

        let parentNodeElement = this.getParentNodeElement(nodeElement?.parentElement!);

        if (parentNodeElement) {
            this.focusRowChange(event.currentTarget, parentNodeElement);
        }

        event.preventDefault();
    }

    onEnter(event: KeyboardEvent) {
        this.tree.onNodeClick(event, <TreeNode>this.node());
        this.setTabIndexForSelectionMode(event, this.tree.nodeTouched());
        event.preventDefault();
    }

    setAllNodesTabIndexes() {
        const nodes = <any>find(this.tree.el.nativeElement, '[data-pc-section="node"]');

        const hasSelectedNode = [...nodes].some((node) => node.getAttribute('aria-selected') === 'true' || node.getAttribute('aria-checked') === 'true');

        [...nodes].forEach((node) => {
            node.tabIndex = -1;
        });

        if (hasSelectedNode) {
            const selectedNodes = [...nodes].filter((node) => node.getAttribute('aria-selected') === 'true' || node.getAttribute('aria-checked') === 'true');

            selectedNodes[0].tabIndex = 0;

            return;
        }

        if (nodes.length) {
            ([...nodes][0] as any).tabIndex = 0;
        }
    }

    setTabIndexForSelectionMode(event, nodeTouched) {
        if (this.tree.selectionMode() !== null) {
            const elements = [...find(this.tree.el.nativeElement, '[role="treeitem"]')];

            event.currentTarget.tabIndex = nodeTouched === false ? -1 : 0;

            if (elements.every((element: any) => element.tabIndex === -1)) {
                (elements[0] as any).tabIndex = 0;
            }
        }
    }

    findNextSiblingOfAncestor(nodeElement: any): any {
        let parentNodeElement = this.getParentNodeElement(nodeElement);

        if (parentNodeElement) {
            if (parentNodeElement.nextElementSibling) return parentNodeElement.nextElementSibling;
            else return this.findNextSiblingOfAncestor(parentNodeElement);
        } else {
            return null;
        }
    }

    findLastVisibleDescendant(nodeElement: any): any {
        const listElement = <HTMLElement>Array.from(nodeElement.children).find((el: any) => el.getAttribute('data-pc-section') === 'node');
        const childrenListElement = listElement?.children[1];
        if (childrenListElement && childrenListElement.children.length > 0) {
            const lastChildElement = childrenListElement.children[childrenListElement.children.length - 1];

            return this.findLastVisibleDescendant(lastChildElement);
        } else {
            return nodeElement;
        }
    }

    getParentNodeElement(nodeElement: HTMLElement | Element) {
        const parentNodeElement = nodeElement.parentElement?.parentElement?.parentElement;

        return parentNodeElement?.tagName === 'P-TREENODE' ? parentNodeElement : null;
    }

    focusNode(element: any) {
        (element.children[0] as HTMLElement).focus();
    }

    focusRowChange(firstFocusableRow, currentFocusedRow, lastVisibleDescendant?) {
        firstFocusableRow.tabIndex = '-1';
        currentFocusedRow.children[0].tabIndex = '0';

        this.focusNode(lastVisibleDescendant || currentFocusedRow);
    }

    focusVirtualNode() {
        this.timeout = setTimeout(() => {
            let node = <any>findSingle(this.tree?.contentViewChild()?.nativeElement, `[data-id="${<TreeNode>this.node()?.key ?? <TreeNode>this.node()?.data}"]`);
            focus(node);
        }, 1);
    }
}
/**
 * Tree is used to display hierarchical data.
 * @group Components
 */
@Component({
    selector: 'p-tree',
    standalone: true,
    imports: [CommonModule, Scroller, SharedModule, SearchIcon, SpinnerIcon, InputText, FormsModule, IconField, InputIcon, UITreeNode, AutoFocusModule, Bind],
    template: `
        @if (loading() && loadingMode() === 'mask') {
            <div [class]="cx('mask')" [pBind]="ptm('mask')" animate.enter="p-overlay-mask-enter-active" animate.leave="p-overlay-mask-leave-active">
                @if (loadingIcon()) {
                    <i [class]="cn(cx('loadingIcon'), 'pi-spin' + loadingIcon())" [pBind]="ptm('loadingIcon')"></i>
                }
                @if (!loadingIcon()) {
                    @if (!$loadingIconTemplate()) {
                        <svg data-p-icon="spinner" spin [class]="cx('loadingIcon')" [pBind]="ptm('loadingIcon')" />
                    }
                    @if ($loadingIconTemplate()) {
                        <span [class]="cx('loadingIcon')" [pBind]="ptm('loadingIcon')">
                            <ng-template *ngTemplateOutlet="$loadingIconTemplate()"></ng-template>
                        </span>
                    }
                }
            </div>
        }
        <ng-container *ngTemplateOutlet="$headerTemplate()"></ng-container>
        @if ($filterTemplate()) {
            <ng-container *ngTemplateOutlet="$filterTemplate(); context: { $implicit: $filterOptions() }"></ng-container>
        } @else {
            @if (filter()) {
                <p-iconfield [class]="cx('pcFilterContainer')" [pt]="ptm('pcFilterContainer')" [unstyled]="unstyled()">
                    <input
                        #filter
                        [pAutoFocus]="filterInputAutoFocus()"
                        pInputText
                        type="search"
                        autocomplete="off"
                        [class]="cx('pcFilterInput')"
                        [attr.placeholder]="filterPlaceholder()"
                        (keydown.enter)="$event.preventDefault()"
                        (input)="_filter($event.target?.value)"
                        [pt]="ptm('pcFilterInput')"
                        [unstyled]="unstyled()"
                    />
                    <p-inputicon [pt]="ptm('pcFilterIconContainer')" [unstyled]="unstyled()">
                        @if (!$filterIconTemplate()) {
                            <svg data-p-icon="search" [class]="cx('filterIcon')" [pBind]="ptm('filterIcon')" />
                        }
                        @if ($filterIconTemplate()) {
                            <span [class]="cx('filterIcon')" [pBind]="ptm('filterIcon')">
                                <ng-template *ngTemplateOutlet="$filterIconTemplate()"></ng-template>
                            </span>
                        }
                    </p-inputicon>
                </p-iconfield>
            }
        }

        @if (getRootNode()?.length) {
            @if (virtualScroll()) {
                <p-scroller
                    #scroller
                    [items]="serializedValue()"
                    [tabindex]="-1"
                    [styleClass]="cx('wrapper')"
                    [style]="{ height: scrollHeight() !== 'flex' ? scrollHeight() : undefined }"
                    [scrollHeight]="scrollHeight() !== 'flex' ? undefined : '100%'"
                    [itemSize]="virtualScrollItemSize()"
                    [lazy]="lazy()"
                    (onScroll)="onScroll.emit($event)"
                    (onScrollIndexChange)="onScrollIndexChange.emit($event)"
                    (onLazyLoad)="onLazyLoad.emit($event)"
                    [options]="virtualScrollOptions()"
                    [pt]="ptm('virtualScroller')"
                    hostName="tree"
                    [attr.data-p]="wrapperDataP()"
                >
                    <ng-template #content let-items let-scrollerOptions="options">
                        @if (items) {
                            <ul
                                #content
                                [class]="cx('rootChildren')"
                                [ngClass]="scrollerOptions.contentStyleClass"
                                [style]="scrollerOptions.contentStyle"
                                role="tree"
                                [attr.aria-label]="ariaLabel()"
                                [attr.aria-labelledby]="ariaLabelledBy()"
                                [pBind]="ptm('rootChildren')"
                            >
                                @for (rowNode of items; track trackBy()(index, rowNode); let index = $index) {
                                    <p-treeNode
                                        #treeNode
                                        [level]="rowNode.level"
                                        [node]="rowNode.node"
                                        [parentNode]="rowNode.parent"
                                        [index]="getIndex(scrollerOptions, index)"
                                        [itemSize]="scrollerOptions.itemSize"
                                        [indentation]="indentation()"
                                        [loadingMode]="loadingMode()"
                                        [pt]="pt"
                                        [unstyled]="unstyled()"
                                    ></p-treeNode>
                                }
                            </ul>
                        }
                    </ng-template>
                    @if ($loaderTemplate()) {
                        <ng-template #loader let-scrollerOptions="options">
                            <ng-container *ngTemplateOutlet="$loaderTemplate(); context: { options: scrollerOptions }"></ng-container>
                        </ng-template>
                    }
                </p-scroller>
            }
            @if (!virtualScroll()) {
                <div #wrapper [class]="cx('wrapper')" [style.max-height]="scrollHeight()" [pBind]="ptm('wrapper')" [attr.data-p]="wrapperDataP()">
                    @if (getRootNode()) {
                        <ul #content [class]="cx('rootChildren')" role="tree" [attr.aria-label]="ariaLabel()" [attr.aria-labelledby]="ariaLabelledBy()" [pBind]="ptm('rootChildren')">
                            @for (node of getRootNode(); track trackBy().bind(this)(index, node); let index = $index) {
                                <p-treeNode [node]="node" [index]="index" [level]="0" [loadingMode]="loadingMode()" [pt]="pt" [unstyled]="unstyled()"></p-treeNode>
                            }
                        </ul>
                    }
                </div>
            }
        }

        @if (!loading() && (getRootNode() == null || getRootNode().length === 0)) {
            <div [class]="cx('emptyMessage')" [pBind]="ptm('emptyMessage')">
                @if (!$emptyTemplate()) {
                    {{ emptyMessageLabel() }}
                } @else {
                    <ng-container *ngTemplateOutlet="$emptyTemplate()"></ng-container>
                }
            </div>
        }
        <ng-container *ngTemplateOutlet="$footerTemplate()"></ng-container>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [TreeStyle, { provide: PARENT_INSTANCE, useExisting: Tree }],
    host: {
        '[class]': "cx('root')",
        '[attr.data-p]': 'containerDataP()',
        '(drop)': 'onDrop($event)',
        '(dragover)': 'onDragOver($event)',
        '(dragenter)': 'onDragEnter()',
        '(dragleave)': 'onDragLeave($event)'
    },
    hostDirectives: [Bind]
})
export class Tree extends BaseComponent<TreePassThrough> implements BlockableUI {
    dragDropService = inject(TreeDragDropService, { optional: true });

    bindDirectiveInstance = inject(Bind, { self: true });

    _componentStyle = inject(TreeStyle);

    /**
     * An array of treenodes.
     * @group Props
     */
    readonly value = input<TreeNode<any> | TreeNode<any>[] | any[] | any>();

    /**
     * Defines the selection mode.
     * @group Props
     */
    readonly selectionMode = input<'single' | 'multiple' | 'checkbox' | null | undefined>();

    /**
     * Loading mode display.
     * @group Props
     */
    readonly loadingMode = input<'mask' | 'icon'>('mask');

    /**
     * A single treenode instance or an array to refer to the selections.
     * @group Props
     */
    selection = model<TreeNode<any> | TreeNode<any>[] | null | undefined>(null);

    /**
     * Context menu instance.
     * @group Props
     */
    readonly contextMenu = input<any>();

    /**
     * Defines the behavior of context menu selection, in "separate" mode context menu updates contextMenuSelection property whereas in joint mode selection property is used instead so that when row selection is enabled, both row selection and context menu selection use the same property.
     * @group Props
     */
    readonly contextMenuSelectionMode = input<'separate' | 'joint'>('joint');

    /**
     * Selected node with a context menu.
     * @group Props
     */
    contextMenuSelection = model<TreeNode<any> | null>(null);

    /**
     * Scope of the draggable nodes to match a droppableScope.
     * @group Props
     */
    readonly draggableScope = input<any>();

    /**
     * Scope of the droppable nodes to match a draggableScope.
     * @group Props
     */
    readonly droppableScope = input<any>();

    /**
     * Whether the nodes are draggable.
     * @group Props
     */
    readonly draggableNodes = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    /**
     * Whether the nodes are droppable.
     * @group Props
     */
    readonly droppableNodes = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    /**
     * Defines how multiple items can be selected, when true metaKey needs to be pressed to select or unselect an item and when set to false selection of each item can be toggled individually. On touch enabled devices, metaKeySelection is turned off automatically.
     * @group Props
     */
    readonly metaKeySelection = input<boolean, unknown>(false, { transform: booleanAttribute });

    /**
     * Whether checkbox selections propagate to ancestor nodes.
     * @group Props
     */
    readonly propagateSelectionUp = input<boolean, unknown>(true, { transform: booleanAttribute });

    /**
     * Whether checkbox selections propagate to descendant nodes.
     * @group Props
     */
    readonly propagateSelectionDown = input<boolean, unknown>(true, { transform: booleanAttribute });

    /**
     * Displays a loader to indicate data load is in progress.
     * @group Props
     */
    readonly loading = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    /**
     * The icon to show while indicating data load is in progress.
     * @group Props
     */
    readonly loadingIcon = input<string>();

    /**
     * Text to display when there is no data.
     * @group Props
     */
    readonly emptyMessage = input<string>('');

    /**
     * Used to define a string that labels the tree.
     * @group Props
     */
    readonly ariaLabel = input<string>();

    /**
     * Establishes relationships between the component and label(s) where its value should be one or more element IDs.
     * @group Props
     */
    readonly ariaLabelledBy = input<string>();

    /**
     * When enabled, drop can be accepted or rejected based on condition defined at onNodeDrop.
     * @group Props
     */
    readonly validateDrop = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    /**
     * When specified, displays an input field to filter the items.
     * @group Props
     */
    readonly filter = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    /**
     * Determines whether the filter input should be automatically focused when the component is rendered.
     * @group Props
     */
    readonly filterInputAutoFocus = input<boolean, unknown>(false, { transform: booleanAttribute });

    /**
     * When filtering is enabled, filterBy decides which field or fields (comma separated) to search against.
     * @group Props
     */
    readonly filterBy = input<string>('label');

    /**
     * Mode for filtering valid values are "lenient" and "strict". Default is lenient.
     * @group Props
     */
    readonly filterMode = input<string>('lenient');

    /**
     * Mode for filtering valid values are "lenient" and "strict". Default is lenient.
     * @group Props
     */
    readonly filterOptions = input<any>();

    /**
     * Placeholder text to show when filter input is empty.
     * @group Props
     */
    readonly filterPlaceholder = input<string>();

    /**
     * Values after the tree nodes are filtered.
     * @group Props
     */
    readonly filteredNodes = input<TreeNode<any>[] | undefined | null>();

    /**
     * Locale to use in filtering. The default locale is the host environment's current locale.
     * @group Props
     */
    readonly filterLocale = input<string>();

    /**
     * Height of the scrollable viewport.
     * @group Props
     */
    readonly scrollHeight = input<string>();

    /**
     * Defines if data is loaded and interacted with in lazy manner.
     * @group Props
     */
    readonly lazy = input<boolean, unknown>(false, { transform: booleanAttribute });

    /**
     * Whether the data should be loaded on demand during scroll.
     * @group Props
     */
    readonly virtualScroll = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    /**
     * Height of an item in the list for VirtualScrolling.
     * @group Props
     */
    readonly virtualScrollItemSize = input<number | undefined, unknown>(undefined, { transform: numberAttribute });

    /**
     * Whether to use the scroller feature. The properties of scroller component can be used like an object in it.
     * @group Props
     */
    readonly virtualScrollOptions = input<ScrollerOptions>();

    /**
     * Indentation factor for spacing of the nested node when virtual scrolling is enabled.
     * @group Props
     */
    readonly indentation = input<number, unknown>(1.5, { transform: numberAttribute });

    /**
     * Custom templates of the component.
     * @group Props
     */
    readonly _templateMap = input<any>();

    /**
     * Function to optimize the node list rendering, default algorithm checks for object identity.
     * @group Props
     */
    readonly trackBy = input<Function>((index: number, item: any) => item);

    /**
     * Highlights the node on select.
     * @group Props
     */
    readonly highlightOnSelect = input<boolean, unknown>(false, { transform: booleanAttribute });

    /**
     * Callback to invoke when a node is selected.
     * @param {TreeNodeSelectEvent} event - Node select event.
     * @group Emits
     */
    readonly onNodeSelect = output<TreeNodeSelectEvent>();

    /**
     * Callback to invoke when a node is unselected.
     * @param {TreeNodeUnSelectEvent} event - Node unselect event.
     * @group Emits
     */
    readonly onNodeUnselect = output<TreeNodeUnSelectEvent>();

    /**
     * Callback to invoke when a node is expanded.
     * @param {TreeNodeExpandEvent} event - Node expand event.
     * @group Emits
     */
    readonly onNodeExpand = output<TreeNodeExpandEvent>();

    /**
     * Callback to invoke when a node is collapsed.
     * @param {TreeNodeCollapseEvent} event - Node collapse event.
     * @group Emits
     */
    readonly onNodeCollapse = output<TreeNodeCollapseEvent>();

    /**
     * Callback to invoke when a node is selected with right click.
     * @param {onNodeContextMenuSelect} event - Node context menu select event.
     * @group Emits
     */
    readonly onNodeContextMenuSelect = output<TreeNodeContextMenuSelectEvent>();

    /**
     * Callback to invoke when a node is double clicked.
     * @param {TreeNodeDoubleClickEvent} event - Node double click event.
     * @group Emits
     */
    readonly onNodeDoubleClick = output<TreeNodeDoubleClickEvent>();

    /**
     * Callback to invoke when a node is dropped.
     * @param {TreeNodeDropEvent} event - Node drop event.
     * @group Emits
     */
    readonly onNodeDrop = output<TreeNodeDropEvent>();

    /**
     * Callback to invoke in lazy mode to load new data.
     * @param {TreeLazyLoadEvent} event - Custom lazy load event.
     * @group Emits
     */
    readonly onLazyLoad = output<TreeLazyLoadEvent>();

    /**
     * Callback to invoke in virtual scroll mode when scroll position changes.
     * @param {TreeScrollEvent} event - Custom scroll event.
     * @group Emits
     */
    readonly onScroll = output<TreeScrollEvent>();

    /**
     * Callback to invoke in virtual scroll mode when scroll position and item's range in view changes.
     * @param {TreeScrollIndexChangeEvent} event - Scroll index change event.
     * @group Emits
     */
    readonly onScrollIndexChange = output<TreeScrollIndexChangeEvent>();

    /**
     * Callback to invoke when data is filtered.
     * @param {TreeFilterEvent} event - Custom filter event.
     * @group Emits
     */
    readonly onFilter = output<TreeFilterEvent>();

    readonly filterViewChild = viewChild<Nullable<ElementRef>>('filter');

    readonly scroller = viewChild<Nullable<Scroller>>('scroller');

    readonly wrapperViewChild = viewChild<Nullable<ElementRef>>('wrapper');

    readonly contentViewChild = viewChild<Nullable<ElementRef>>('content');

    /**
     * Custom filter template.
     * @param {TreeFilterTemplateContext} context - filter context.
     * @see {@link TreeFilterTemplateContext}
     * @group Templates
     */
    readonly filterTemplate = contentChild<TemplateRef<TreeFilterTemplateContext>>('filter', { descendants: false });

    /**
     * Custom header template.
     * @group Templates
     */
    readonly headerTemplate = contentChild<TemplateRef<void>>('header', { descendants: false });

    /**
     * Custom footer template.
     * @group Templates
     */
    readonly footerTemplate = contentChild<TemplateRef<void>>('footer', { descendants: false });

    /**
     * Custom loader template.
     * @param {TreeLoaderTemplateContext} context - loader context.
     * @see {@link TreeLoaderTemplateContext}
     * @group Templates
     */
    readonly loaderTemplate = contentChild<TemplateRef<TreeLoaderTemplateContext>>('loader', { descendants: false });

    /**
     * Custom empty message template.
     * @group Templates
     */
    readonly emptyTemplate = contentChild<TemplateRef<void>>('empty', { descendants: false });

    /**
     * Custom toggler icon template.
     * @param {TreeTogglerIconTemplateContext} context - toggler icon context.
     * @see {@link TreeTogglerIconTemplateContext}
     * @group Templates
     */
    readonly togglerIconTemplate = contentChild<TemplateRef<TreeTogglerIconTemplateContext>>('togglericon', { descendants: false });

    /**
     * Custom checkbox icon template.
     * @param {TreeCheckboxIconTemplateContext} context - checkbox icon context.
     * @see {@link TreeCheckboxIconTemplateContext}
     * @group Templates
     */
    readonly checkboxIconTemplate = contentChild<TemplateRef<TreeCheckboxIconTemplateContext>>('checkboxicon', { descendants: false });

    /**
     * Custom loading icon template.
     * @group Templates
     */
    readonly loadingIconTemplate = contentChild<TemplateRef<void>>('loadingicon', { descendants: false });

    /**
     * Custom filter icon template.
     * @group Templates
     */
    readonly filterIconTemplate = contentChild<TemplateRef<void>>('filtericon', { descendants: false });

    private readonly templates = contentChildren(PrimeTemplate);

    componentName = 'Tree';

    readonly $value = linkedSignal<TreeNode<any> | TreeNode<any>[] | any[] | any>(() => this.value());

    readonly $filterOptions = linkedSignal(() => this.filterOptions());

    readonly $filteredNodes = linkedSignal(() => this.filteredNodes());

    readonly $headerTemplate = computed(
        () =>
            this.headerTemplate() ??
            this.templates()
                .filter((item) => item.getType() === 'header')
                .at(-1)?.template
    );

    readonly $emptyTemplate = computed(
        () =>
            this.emptyTemplate() ??
            this.templates()
                .filter((item) => item.getType() === 'empty')
                .at(-1)?.template
    );

    readonly $footerTemplate = computed(
        () =>
            this.footerTemplate() ??
            this.templates()
                .filter((item) => item.getType() === 'footer')
                .at(-1)?.template
    );

    readonly $loaderTemplate = computed(
        () =>
            this.loaderTemplate() ??
            this.templates()
                .filter((item) => item.getType() === 'loader')
                .at(-1)?.template
    );

    readonly $togglerIconTemplate = computed(
        () =>
            this.togglerIconTemplate() ??
            this.templates()
                .filter((item) => item.getType() === 'togglericon')
                .at(-1)?.template
    );

    readonly $checkboxIconTemplate = computed(
        () =>
            this.checkboxIconTemplate() ??
            this.templates()
                .filter((item) => item.getType() === 'checkboxicon')
                .at(-1)?.template
    );

    readonly $loadingIconTemplate = computed(
        () =>
            this.loadingIconTemplate() ??
            this.templates()
                .filter((item) => item.getType() === 'loadingicon')
                .at(-1)?.template
    );

    readonly $filterIconTemplate = computed(
        () =>
            this.filterIconTemplate() ??
            this.templates()
                .filter((item) => item.getType() === 'filtericon')
                .at(-1)?.template
    );

    readonly $filterTemplate = computed(
        () =>
            this.filterTemplate() ??
            this.templates()
                .filter((item) => item.getType() === 'filter')
                .at(-1)?.template
    );

    /**
     * Map of custom node templates keyed by node type. Merges the `_templateMap` input with
     * `pTemplate` templates whose type is not one of the known template slots, preserving the
     * legacy behavior where the presence of any `pTemplate` replaced the input map entirely.
     */
    readonly $templateMap = computed<any>(() => {
        const templates = this.templates();
        if (!templates.length) {
            return this._templateMap();
        }

        const knownTypes = ['header', 'empty', 'footer', 'loader', 'togglericon', 'checkboxicon', 'loadingicon', 'filtericon', 'filter'];
        const templateMap = {};
        templates.forEach((item) => {
            if (!knownTypes.includes(item.getType())) {
                templateMap[<any>item.name()] = item.template;
            }
        });

        return templateMap;
    });

    readonly serializedValue = signal<Nullable<TreeNode<any>[]>>(null);

    readonly nodeTouched = signal<boolean | undefined | null>(undefined);

    readonly dragNode = signal<TreeNode<any> | undefined | null>(undefined);

    readonly dragNodeSubNodes = signal<TreeNode<any>[] | undefined | null>(undefined);

    readonly dragNodeIndex = signal<number | undefined | null>(undefined);

    readonly dragNodeScope = signal<any>(undefined);

    readonly dragHover = signal<boolean | undefined | null>(undefined);

    public dragStartSubscription: Subscription | undefined | null;

    public dragStopSubscription: Subscription | undefined | null;

    /**
     * Reacts to `value` changes, replacing the legacy `ngOnChanges` hook. Runs on the first
     * value binding as well, matching the original behavior. Internal writes to `$value`
     * (drag and drop) intentionally do not re-trigger it, as they did not trigger `ngOnChanges`.
     */
    private readonly valueEffect = effect(() => {
        this.value();
        untracked(() => {
            this.updateSerializedValue();
            if (this.hasFilterActive()) {
                this._filter(this.filterViewChild()?.nativeElement?.value);
            }
        });
    });

    readonly emptyMessageLabel = computed<string>(() => this.emptyMessage() || this.config.getTranslation(TranslationKeys.EMPTY_MESSAGE));

    readonly containerDataP = computed(() =>
        this.cn({
            loading: this.loading(),
            scrollable: this.scrollHeight() === 'flex'
        })
    );

    readonly wrapperDataP = computed(() =>
        this.cn({
            scrollable: this.scrollHeight() === 'flex'
        })
    );

    constructor() {
        super();
        afterEveryRender(() => {
            this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
        });
    }

    onInit() {
        if (this.filterBy()) {
            this.$filterOptions.set({
                filter: (value) => this._filter(value),
                reset: () => this.resetFilter()
            });
        }
        if (this.droppableNodes()) {
            this.dragStartSubscription = this.dragDropService?.dragStart$.subscribe((event) => {
                this.dragNode.set(event.node);
                this.dragNodeSubNodes.set(event.subNodes);
                this.dragNodeIndex.set(event.index);
                this.dragNodeScope.set(event.scope);
            });

            this.dragStopSubscription = this.dragDropService?.dragStop$.subscribe(() => {
                this.dragNode.set(null);
                this.dragNodeSubNodes.set(null);
                this.dragNodeIndex.set(null);
                this.dragNodeScope.set(null);
                this.dragHover.set(false);
            });
        }
    }

    onDestroy() {
        if (this.dragStartSubscription) {
            this.dragStartSubscription.unsubscribe();
        }

        if (this.dragStopSubscription) {
            this.dragStopSubscription.unsubscribe();
        }
    }

    updateSerializedValue() {
        const serializedValue: TreeNode<any>[] = [];
        this.serializeNodes(null, this.getRootNode(), 0, true, serializedValue);
        this.serializedValue.set(serializedValue);
    }

    serializeNodes(parent: TreeNode<any> | null, nodes: TreeNode<any>[] | any, level: number, visible: boolean, target: TreeNode<any>[]) {
        if (nodes && nodes.length) {
            for (let node of nodes) {
                node.parent = parent;
                const rowNode = {
                    node: node,
                    parent: parent,
                    level: level,
                    visible: visible && (parent ? parent.expanded : true)
                };
                target.push(<TreeNode>rowNode);

                if (rowNode.visible && node.expanded) {
                    this.serializeNodes(node, node.children, level + 1, rowNode.visible, target);
                }
            }
        }
    }

    onNodeClick(event: Event, node: TreeNode) {
        let eventTarget = <Element>event.target;
        const section = eventTarget?.getAttribute?.('data-pc-section');
        if (section === 'nodetogglebutton' || section === 'nodetoggleicon') {
            return;
        }

        if (this.selectionMode()) {
            if (node.selectable === false) {
                node.style = '--p-focus-ring-color: none;';
                return;
            } else {
                if (!node.style?.includes('--p-focus-ring-color')) {
                    node.style = node.style ? `${node.style}--p-focus-ring-color: var(--primary-color)` : '--p-focus-ring-color: var(--primary-color)';
                }
            }

            if (this.hasFilteredNodes()) {
                node = this.getNodeWithKey(<string>node.key, <TreeNode<any>[]>this.$filteredNodes()) as TreeNode;
                if (!node) {
                    return;
                }
            }

            let index = this.findIndexInSelection(node);
            let selected = index >= 0;
            const currentSelection = this.selection();

            if (this.isCheckboxSelectionMode()) {
                if (selected) {
                    if (this.propagateSelectionDown()) this.propagateDown(node, false);
                    else this.selection.set((currentSelection as TreeNode[]).filter((_val: TreeNode, i: number) => i != index));

                    if (this.propagateSelectionUp() && node.parent) {
                        this.propagateUp(node.parent, false);
                    }

                    this.onNodeUnselect.emit({ originalEvent: event, node: node });
                } else {
                    if (this.propagateSelectionDown()) this.propagateDown(node, true);
                    else this.selection.set([...((currentSelection as TreeNode[]) || []), node]);

                    if (this.propagateSelectionUp() && node.parent) {
                        this.propagateUp(node.parent, true);
                    }

                    this.onNodeSelect.emit({ originalEvent: event, node: node });
                }
            } else {
                let metaSelection = this.nodeTouched() ? false : this.metaKeySelection();

                if (metaSelection) {
                    let metaKey = (<KeyboardEvent>event).metaKey || (<KeyboardEvent>event).ctrlKey;

                    if (selected && metaKey) {
                        if (this.isSingleSelectionMode()) {
                            this.selection.set(null);
                        } else {
                            this.selection.set((currentSelection as TreeNode[]).filter((_val: TreeNode, i: number) => i != index));
                        }

                        this.onNodeUnselect.emit({ originalEvent: event, node: node });
                    } else {
                        if (this.isSingleSelectionMode()) {
                            this.selection.set(node);
                        } else if (this.isMultipleSelectionMode()) {
                            const base = !metaKey ? [] : (currentSelection as TreeNode[]) || [];
                            this.selection.set([...base, node]);
                        }

                        this.onNodeSelect.emit({ originalEvent: event, node: node });
                    }
                } else {
                    if (this.isSingleSelectionMode()) {
                        if (selected) {
                            this.selection.set(null);
                            this.onNodeUnselect.emit({ originalEvent: event, node: node });
                        } else {
                            this.selection.set(node);
                            setTimeout(() => {
                                this.onNodeSelect.emit({ originalEvent: event, node: node });
                            });
                        }
                    } else {
                        if (selected) {
                            this.selection.set((currentSelection as TreeNode[]).filter((_val: TreeNode, i: number) => i != index));
                            this.onNodeUnselect.emit({ originalEvent: event, node: node });
                        } else {
                            this.selection.set([...((currentSelection as TreeNode[]) || []), node]);
                            setTimeout(() => {
                                this.onNodeSelect.emit({ originalEvent: event, node: node });
                            });
                        }
                    }
                }
            }
        }

        this.nodeTouched.set(false);
    }

    onNodeTouchEnd() {
        this.nodeTouched.set(true);
    }

    onNodeRightClick(event: MouseEvent, node: TreeNode<any>) {
        if (this.contextMenu()) {
            let eventTarget = <Element>event.target;
            const section = eventTarget.getAttribute('data-pc-section');

            if (section === 'nodetogglebutton' || section === 'nodetoggleicon') {
                return;
            }

            let index = this.findIndexInSelection(node);
            let isNodeSelected = index >= 0;

            const onContextMenuCallback = () => {
                this.contextMenu().show(event);
                this.contextMenu().hideCallback = () => {
                    this.contextMenuSelection.set(null);
                };

                this.onNodeContextMenuSelect.emit({ originalEvent: event, node: node });
            };

            if (this.contextMenuSelectionMode() === 'separate') {
                // In 'separate' mode: Update contextMenuSelection with clicked node, don't modify selection
                this.contextMenuSelection.set(node);
                onContextMenuCallback();
            } else if (this.contextMenuSelectionMode() === 'joint') {
                // In 'joint' mode: Update only selection, don't touch contextMenuSelection
                if (!isNodeSelected) {
                    if (this.isSingleSelectionMode()) {
                        this.selection.set(node);
                    } else {
                        this.selection.set([node]);
                    }
                }
                // If already selected, keep current selection as is

                onContextMenuCallback();
            }
        }
    }

    onNodeDblClick(event: MouseEvent, node: TreeNode<any>) {
        this.onNodeDoubleClick.emit({ originalEvent: event, node: node });
    }

    findIndexInSelection(node: TreeNode) {
        let index: number = -1;
        const currentSelection = this.selection();
        if (this.selectionMode() && currentSelection) {
            if (this.isSingleSelectionMode()) {
                const sel = currentSelection as TreeNode;
                let areNodesEqual = (sel.key && sel.key === node.key) || sel == node;
                index = areNodesEqual ? 0 : -1;
            } else {
                const selArray = currentSelection as TreeNode[];
                for (let i = 0; i < selArray.length; i++) {
                    let selectedNode = selArray[i];
                    let areNodesEqual = (selectedNode.key && selectedNode.key === node.key) || selectedNode == node;
                    if (areNodesEqual) {
                        index = i;
                        break;
                    }
                }
            }
        }

        return index;
    }

    syncNodeOption(node: TreeNode, parentNodes: TreeNode<any>[], option: any, value?: any) {
        // to synchronize the node option between the filtered nodes and the original nodes(this.value)
        const _node = this.hasFilteredNodes() ? this.getNodeWithKey(<string>node.key, parentNodes) : null;
        if (_node) {
            (<any>_node)[option] = value || (<any>node)[option];
        }
    }

    hasFilteredNodes() {
        const filteredNodes = this.$filteredNodes();
        return this.filter() && filteredNodes && filteredNodes.length;
    }

    hasFilterActive() {
        return this.filter() && this.filterViewChild()?.nativeElement?.value.length > 0;
    }

    getNodeWithKey(key: string, nodes: TreeNode<any>[]): TreeNode<any> | undefined {
        for (let node of nodes) {
            if (node.key === key) {
                return node;
            }

            if (node.children) {
                let matchedNode = this.getNodeWithKey(key, node.children);
                if (matchedNode) {
                    return matchedNode;
                }
            }
        }
    }

    propagateUp(node: TreeNode, select: boolean) {
        if (node.children && node.children.length) {
            let selectedCount: number = 0;
            let childPartialSelected: boolean = false;
            for (let child of node.children) {
                if (this.isSelected(child)) {
                    selectedCount++;
                } else if (child.partialSelected) {
                    childPartialSelected = true;
                }
            }

            const currentSelection = (this.selection() as TreeNode[]) || [];
            if (select && selectedCount == node.children.length) {
                this.selection.set([...currentSelection, node]);
                node.partialSelected = false;
            } else {
                if (!select) {
                    let index = this.findIndexInSelection(node);
                    if (index >= 0) {
                        this.selection.set(currentSelection.filter((_val: TreeNode, i: number) => i != index));
                    }
                }

                if (childPartialSelected || (selectedCount > 0 && selectedCount != node.children.length)) node.partialSelected = true;
                else node.partialSelected = false;
            }

            this.syncNodeOption(node, <TreeNode<any>[]>this.$filteredNodes(), 'partialSelected');
        }

        let parent = node.parent;
        if (parent) {
            this.propagateUp(parent, select);
        }
    }

    propagateDown(node: TreeNode, select: boolean) {
        let index = this.findIndexInSelection(node);
        const currentSelection = (this.selection() as TreeNode[]) || [];

        if (select && index == -1) {
            this.selection.set([...currentSelection, node]);
        } else if (!select && index > -1) {
            this.selection.set(currentSelection.filter((_val: TreeNode, i: number) => i != index));
        }

        node.partialSelected = false;

        this.syncNodeOption(node, <TreeNode<any>[]>this.$filteredNodes(), 'partialSelected');

        if (node.children && node.children.length) {
            for (let child of node.children) {
                this.propagateDown(child, select);
            }
        }
    }

    isSelected(node: TreeNode) {
        return this.findIndexInSelection(node) != -1;
    }

    isSingleSelectionMode() {
        return this.selectionMode() && this.selectionMode() == 'single';
    }

    isMultipleSelectionMode() {
        return this.selectionMode() && this.selectionMode() == 'multiple';
    }

    isCheckboxSelectionMode() {
        return this.selectionMode() && this.selectionMode() == 'checkbox';
    }

    isNodeLeaf(node: TreeNode): boolean {
        return node.leaf == false ? false : !(node.children && node.children.length);
    }

    getRootNode() {
        const filteredNodes = this.$filteredNodes();
        return filteredNodes ? filteredNodes : this.$value();
    }

    getTemplateForNode(node: TreeNode): TemplateRef<any> | null {
        const templateMap = this.$templateMap();
        if (templateMap) return node.type ? templateMap[node.type] : templateMap['default'];
        else return null;
    }

    onDragOver(event: DragEvent) {
        if (this.droppableNodes() && this.allowDrop(<TreeNode>this.dragNode(), null, this.dragNodeScope())) {
            (<any>event).dataTransfer.dropEffect = 'copy';
            event.preventDefault();
        }
    }

    onDrop(event: DragEvent) {
        if (this.droppableNodes()) {
            event.preventDefault();
            let dragNode = this.dragNode() as TreeNode;

            if (this.isSameTreeScope(this.dragNodeScope())) {
                return;
            }

            if (this.allowDrop(dragNode, null, this.dragNodeScope())) {
                let dragNodeIndex = <number>this.dragNodeIndex();
                if (!this.$value()) {
                    this.$value.set([]);
                }

                if (this.validateDrop()) {
                    this.onNodeDrop.emit({
                        originalEvent: event,
                        dragNode: dragNode,
                        dropNode: null,
                        index: dragNodeIndex,
                        accept: () => {
                            this.processTreeDrop(dragNode, dragNodeIndex);
                        }
                    });
                } else {
                    this.onNodeDrop.emit({
                        originalEvent: event,
                        dragNode: dragNode,
                        dropNode: null,
                        index: dragNodeIndex
                    });

                    this.processTreeDrop(dragNode, dragNodeIndex);
                }
            }
        }
    }

    processTreeDrop(dragNode: TreeNode, dragNodeIndex: number) {
        (<TreeNode<any>[]>this.dragNodeSubNodes()).splice(dragNodeIndex, 1);
        (this.$value() as TreeNode<any>[]).push(dragNode);
        this.dragDropService?.stopDrag({
            node: dragNode
        });
    }

    onDragEnter() {
        if (this.droppableNodes() && this.allowDrop(<TreeNode>this.dragNode(), null, this.dragNodeScope())) {
            this.dragHover.set(true);
        }
    }

    onDragLeave(event: DragEvent) {
        if (this.droppableNodes()) {
            let rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
            if (event.x > parseInt(rect.left as any) + rect.width || event.x < parseInt(rect.left as any) || event.y > parseInt(rect.top as any) + rect.height || event.y < parseInt(rect.top as any)) {
                this.dragHover.set(false);
            }
        }
    }

    allowDrop(dragNode: TreeNode, dropNode: TreeNode<any> | null, dragNodeScope: any): boolean {
        if (!dragNode) {
            //prevent random html elements to be dragged
            return false;
        } else if (this.isValidDragScope(dragNodeScope)) {
            let allow: boolean = true;
            if (dropNode) {
                if (dragNode === dropNode) {
                    allow = false;
                } else {
                    let parent = dropNode.parent;
                    while (parent != null) {
                        if (parent === dragNode) {
                            allow = false;
                            break;
                        }
                        parent = parent.parent;
                    }
                }
            }

            return allow;
        } else {
            return false;
        }
    }

    hasCommonScope(dragScope: any, dropScope: any): boolean {
        if (typeof dropScope === 'string') {
            if (typeof dragScope === 'string') return dropScope === dragScope;
            else if (Array.isArray(dragScope)) return (<Array<any>>dragScope).indexOf(dropScope) != -1;
        } else if (Array.isArray(dropScope)) {
            if (typeof dragScope === 'string') {
                return (<Array<any>>dropScope).indexOf(dragScope) != -1;
            } else if (Array.isArray(dragScope)) {
                for (let s of dropScope) {
                    for (let ds of dragScope) {
                        if (s === ds) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    isSameTreeScope(dragScope: any): boolean {
        return this.hasCommonScope(dragScope, this.draggableScope());
    }

    isValidDragScope(dragScope: any): boolean {
        let dropScope = this.droppableScope();

        if (dropScope) {
            return this.hasCommonScope(dragScope, dropScope);
        } else {
            return true;
        }
    }

    public _filter(value: string) {
        let filterValue = value;
        if (filterValue === '') {
            this.$filteredNodes.set(null);
        } else {
            const filteredNodes: TreeNode<any>[] = [];
            const searchFields: string[] = this.filterBy().split(',');
            const filterText = removeAccents(filterValue).toLocaleLowerCase(this.filterLocale());
            const isStrictMode = this.filterMode() === 'strict';
            for (let node of <TreeNode<any>[]>this.$value()) {
                let copyNode = { ...node };
                let paramsWithoutNode = { searchFields, filterText, isStrictMode };
                if (
                    (isStrictMode && (this.findFilteredNodes(copyNode, paramsWithoutNode) || this.isFilterMatched(copyNode, paramsWithoutNode))) ||
                    (!isStrictMode && (this.isFilterMatched(copyNode, paramsWithoutNode) || this.findFilteredNodes(copyNode, paramsWithoutNode)))
                ) {
                    filteredNodes.push(copyNode);
                }
            }
            this.$filteredNodes.set(filteredNodes);
        }

        this.updateSerializedValue();
        this.onFilter.emit({
            filter: filterValue,
            filteredValue: this.$filteredNodes()
        });
    }

    /**
     * Resets filter.
     * @group Method
     */
    public resetFilter() {
        this.$filteredNodes.set(null);

        const filterViewChild = this.filterViewChild();
        if (filterViewChild && filterViewChild.nativeElement) {
            filterViewChild.nativeElement.value = '';
        }
    }

    /**
     * Scrolls to virtual index.
     * @param {number} number - Index to be scrolled.
     * @group Method
     */
    public scrollToVirtualIndex(index: number) {
        this.virtualScroll() && this.scroller()?.scrollToIndex(index);
    }

    /**
     * Scrolls to virtual index.
     * @param {ScrollToOptions} options - Scroll options.
     * @group Method
     */
    public scrollTo(options: any) {
        const wrapperViewChild = this.wrapperViewChild();
        if (this.virtualScroll()) {
            this.scroller()?.scrollTo(options);
        } else if (wrapperViewChild && wrapperViewChild.nativeElement) {
            if (wrapperViewChild.nativeElement.scrollTo) {
                wrapperViewChild.nativeElement.scrollTo(options);
            } else {
                wrapperViewChild.nativeElement.scrollLeft = options.left;
                wrapperViewChild.nativeElement.scrollTop = options.top;
            }
        }
    }

    findFilteredNodes(node: TreeNode, paramsWithoutNode: any) {
        if (node) {
            let matched = false;
            if (node.children) {
                let childNodes = [...node.children];
                node.children = [];
                for (let childNode of childNodes) {
                    let copyChildNode = { ...childNode };
                    if (this.isFilterMatched(copyChildNode, paramsWithoutNode)) {
                        matched = true;
                        node.children.push(copyChildNode);
                    }
                }
            }

            if (matched) {
                node.expanded = true;
                return true;
            }
        }
    }

    isFilterMatched(node: TreeNode, params: any) {
        let { searchFields, filterText, isStrictMode } = params;
        let matched = false;
        for (let field of searchFields) {
            let fieldValue = removeAccents(String(resolveFieldData(node, field))).toLocaleLowerCase(this.filterLocale());
            if (fieldValue.indexOf(filterText) > -1) {
                matched = true;
            }
        }

        if (!matched || (isStrictMode && !this.isNodeLeaf(node))) {
            matched = this.findFilteredNodes(node, { searchFields, filterText, isStrictMode }) || matched;
        }

        return matched;
    }

    getIndex(options: any, index: number) {
        const getItemOptions = options['getItemOptions'];
        return getItemOptions ? getItemOptions(index).index : index;
    }

    getBlockableElement(): HTMLElement {
        return this.el.nativeElement.children[0];
    }
}
@NgModule({
    imports: [Tree, SharedModule],
    exports: [Tree, SharedModule]
})
export class TreeModule {}
