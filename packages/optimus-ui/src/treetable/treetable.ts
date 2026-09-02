import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
    afterEveryRender,
    afterNextRender,
    booleanAttribute,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    computed,
    Directive,
    effect,
    ElementRef,
    HostListener,
    inject,
    Injectable,
    input,
    linkedSignal,
    NgModule,
    NgZone,
    numberAttribute,
    signal,
    TemplateRef,
    untracked,
    ViewEncapsulation,
    viewChild,
    contentChild,
    contentChildren,
    output
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
    addClass,
    addStyle,
    calculateScrollbarHeight,
    calculateScrollbarWidth,
    clearSelection,
    equals,
    find,
    findSingle,
    focus,
    getAttribute,
    getHiddenElementOuterHeight,
    getHiddenElementOuterWidth,
    getIndex,
    getOffset,
    invokeElementMethod,
    isClickable,
    isEmpty,
    isNotEmpty,
    removeClass,
    reorderArray,
    resolveFieldData
} from '@openng/optimus-ui-utils';
import { BlockableUI, FilterMetadata, FilterService, PrimeTemplate, ScrollerOptions, SharedModule, SortMeta, TreeNode, TreeTableNode } from '@openng/optimus-ui/api';
import { BadgeModule } from '@openng/optimus-ui/badge';
import { BaseComponent, PARENT_INSTANCE } from '@openng/optimus-ui/basecomponent';
import { Bind, BindModule } from '@openng/optimus-ui/bind';
import { Checkbox } from '@openng/optimus-ui/checkbox';
import { DomHandler } from '@openng/optimus-ui/dom';
import { ArrowDownIcon, ArrowUpIcon, CheckIcon, ChevronDownIcon, ChevronRightIcon, SortAltIcon, SortAmountDownIcon, SortAmountUpAltIcon, SpinnerIcon } from '@openng/optimus-ui/icons';
import { PaginatorModule } from '@openng/optimus-ui/paginator';
import { Ripple } from '@openng/optimus-ui/ripple';
import { Scroller } from '@openng/optimus-ui/scroller';
import { Nullable, VoidListener } from '@openng/optimus-ui/ts-helpers';
import {
    TreeTableBodyTemplateContext,
    TreeTableCheckboxIconTemplateContext,
    TreeTableColResizeEvent,
    TreeTableColumnReorderEvent,
    TreeTableColumnsTemplateContext,
    TreeTableContextMenuSelectEvent,
    TreeTableEditEvent,
    TreeTableEmptyMessageTemplateContext,
    TreeTableFilterEvent,
    TreeTableFilterOptions,
    TreeTableHeaderCheckboxIconTemplateContext,
    TreeTableHeaderCheckboxToggleEvent,
    TreeTableLazyLoadEvent,
    TreeTableNodeCollapseEvent,
    TreeTableNodeExpandEvent,
    TreeTableNodeUnSelectEvent,
    TreeTablePaginatorState,
    TreeTablePassThrough,
    TreeTableSortEvent,
    TreeTableSortIconTemplateContext,
    TreeTableTogglerIconTemplateContext
} from '@openng/optimus-ui/types/treetable';
import { Subject, Subscription } from 'rxjs';
import { TreeTableStyle } from './style/treetablestyle';

@Injectable()
export class TreeTableService {
    private sortSource = new Subject<SortMeta | SortMeta[] | null>();
    private selectionSource = new Subject();
    private contextMenuSource = new Subject<any>();
    private uiUpdateSource = new Subject<any>();
    private totalRecordsSource = new Subject<any>();

    sortSource$ = this.sortSource.asObservable();
    selectionSource$ = this.selectionSource.asObservable();
    contextMenuSource$ = this.contextMenuSource.asObservable();
    uiUpdateSource$ = this.uiUpdateSource.asObservable();
    totalRecordsSource$ = this.totalRecordsSource.asObservable();

    onSort(sortMeta: SortMeta | SortMeta[] | null) {
        this.sortSource.next(sortMeta);
    }

    onSelectionChange() {
        this.selectionSource.next(null);
    }

    onContextMenu(node: any) {
        this.contextMenuSource.next(node);
    }

    onUIUpdate(value: any) {
        this.uiUpdateSource.next(value);
    }

    onTotalRecordsChange(value: number) {
        this.totalRecordsSource.next(value);
    }
}

/**
 * TreeTable is used to display hierarchical data in tabular format.
 * @group Components
 */
@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'p-treeTable, p-treetable, p-tree-table',
    standalone: false,
    template: `
        @if (loading() && showLoader()) {
            <div [pBind]="ptm('mask')" [class]="cx('mask')" animate.enter="p-overlay-mask-enter-active" animate.leave="p-overlay-mask-leave-active">
                @if (loadingIcon()) {
                    <i [class]="cn(cx('loadingIcon'), 'pi-spin' + loadingIcon())"></i>
                }
                @if (!loadingIcon()) {
                    @if (!$loadingIconTemplate()) {
                        <svg data-p-icon="spinner" [spin]="true" [class]="cx('loadingIcon')" />
                    }
                    @if ($loadingIconTemplate()) {
                        <span [class]="cx('loadingIcon')">
                            <ng-template *ngTemplateOutlet="$loadingIconTemplate()"></ng-template>
                        </span>
                    }
                }
            </div>
        }
        @if ($captionTemplate()) {
            <div [pBind]="ptm('header')" [class]="cx('header')">
                <ng-container *ngTemplateOutlet="$captionTemplate()"></ng-container>
            </div>
        }
        @if (paginator() && (paginatorPosition() === 'top' || paginatorPosition() == 'both')) {
            <p-paginator
                [pt]="ptm('pcPaginator')"
                [rows]="$rows()"
                [first]="$first()"
                [totalRecords]="_totalRecords()"
                [pageLinkSize]="pageLinks()"
                [class]="cx('pcPaginator')"
                [alwaysShow]="alwaysShowPaginator()"
                (onPageChange)="onPageChange($event)"
                [rowsPerPageOptions]="rowsPerPageOptions()"
                [templateLeft]="$paginatorLeftTemplate()"
                [templateRight]="$paginatorRightTemplate()"
                [appendTo]="paginatorDropdownAppendTo()"
                [currentPageReportTemplate]="currentPageReportTemplate()"
                [showFirstLastIcon]="showFirstLastIcon()"
                [dropdownItemTemplate]="$paginatorDropdownItemTemplate()"
                [showCurrentPageReport]="showCurrentPageReport()"
                [showJumpToPageDropdown]="showJumpToPageDropdown()"
                [showPageLinks]="showPageLinks()"
                [locale]="paginatorLocale()"
                [unstyled]="unstyled()"
            >
                @if ($paginatorFirstPageLinkIconTemplate()) {
                    <ng-template pTemplate="firstpagelinkicon">
                        <ng-container *ngTemplateOutlet="$paginatorFirstPageLinkIconTemplate()"></ng-container>
                    </ng-template>
                }
                @if ($paginatorPreviousPageLinkIconTemplate()) {
                    <ng-template pTemplate="previouspagelinkicon">
                        <ng-container *ngTemplateOutlet="$paginatorPreviousPageLinkIconTemplate()"></ng-container>
                    </ng-template>
                }
                @if ($paginatorLastPageLinkIconTemplate()) {
                    <ng-template pTemplate="lastpagelinkicon">
                        <ng-container *ngTemplateOutlet="$paginatorLastPageLinkIconTemplate()"></ng-container>
                    </ng-template>
                }
                @if ($paginatorNextPageLinkIconTemplate()) {
                    <ng-template pTemplate="nextpagelinkicon">
                        <ng-container *ngTemplateOutlet="$paginatorNextPageLinkIconTemplate()"></ng-container>
                    </ng-template>
                }
            </p-paginator>
        }

        @if (!scrollable()) {
            <div [pBind]="ptm('wrapper')" [class]="cx('wrapper')">
                <table role="treegrid" [pBind]="ptm('table')" #table [ngClass]="tableStyleClass()" [ngStyle]="tableStyle()">
                    <ng-container *ngTemplateOutlet="$colGroupTemplate(); context: { $implicit: columns() }"></ng-container>
                    <thead role="rowgroup" [class]="cx('thead')" [pBind]="ptm('thead')">
                        <ng-container *ngTemplateOutlet="$headerTemplate(); context: { $implicit: columns() }"></ng-container>
                    </thead>
                    <tbody [class]="cx('tbody')" [pBind]="ptm('tbody')" role="rowgroup" [unstyled]="unstyled()" [pTreeTableBody]="columns()" [pTreeTableBodyTemplate]="$bodyTemplate()"></tbody>
                    <tfoot [class]="cx('tfoot')" [pBind]="ptm('tfoot')" role="rowgroup">
                        <ng-container *ngTemplateOutlet="$footerTemplate(); context: { $implicit: columns() }"></ng-container>
                    </tfoot>
                </table>
            </div>
        }

        @if (scrollable()) {
            <div [pBind]="ptm('scrollableWrapper')" [class]="cx('scrollableWrapper')">
                @if (frozenColumns() || $frozenBodyTemplate()) {
                    <div
                        [ngClass]="[cx('scrollableView'), cx('frozenView')]"
                        #scrollableFrozenView
                        [ttScrollableView]="frozenColumns()"
                        [unstyled]="unstyled()"
                        [frozen]="true"
                        [ngStyle]="{ width: frozenWidth() }"
                        [scrollHeight]="scrollHeight()"
                        [pBind]="ptm('scrollableView')"
                    ></div>
                }
                <div
                    [class]="cx('scrollableView')"
                    [pBind]="ptm('scrollableView')"
                    #scrollableView
                    [ttScrollableView]="columns()"
                    [unstyled]="unstyled()"
                    [frozen]="false"
                    [scrollHeight]="scrollHeight()"
                    [ngStyle]="{ left: frozenWidth(), width: 'calc(100% - ' + frozenWidth() + ')' }"
                ></div>
            </div>
        }

        @if (paginator() && (paginatorPosition() === 'bottom' || paginatorPosition() == 'both')) {
            <p-paginator
                [pt]="ptm('pcPaginator')"
                [rows]="$rows()"
                [first]="$first()"
                [totalRecords]="_totalRecords()"
                [pageLinkSize]="pageLinks()"
                [class]="cx('pcPaginator')"
                [alwaysShow]="alwaysShowPaginator()"
                (onPageChange)="onPageChange($event)"
                [rowsPerPageOptions]="rowsPerPageOptions()"
                [templateLeft]="$paginatorLeftTemplate()"
                [templateRight]="$paginatorRightTemplate()"
                [appendTo]="paginatorDropdownAppendTo()"
                [currentPageReportTemplate]="currentPageReportTemplate()"
                [showFirstLastIcon]="showFirstLastIcon()"
                [dropdownItemTemplate]="$paginatorDropdownItemTemplate()"
                [showCurrentPageReport]="showCurrentPageReport()"
                [showJumpToPageDropdown]="showJumpToPageDropdown()"
                [showPageLinks]="showPageLinks()"
                [locale]="paginatorLocale()"
                [unstyled]="unstyled()"
            >
                @if ($paginatorFirstPageLinkIconTemplate()) {
                    <ng-template pTemplate="firstpagelinkicon">
                        <ng-container *ngTemplateOutlet="$paginatorFirstPageLinkIconTemplate()"></ng-container>
                    </ng-template>
                }
                @if ($paginatorPreviousPageLinkIconTemplate()) {
                    <ng-template pTemplate="previouspagelinkicon">
                        <ng-container *ngTemplateOutlet="$paginatorPreviousPageLinkIconTemplate()"></ng-container>
                    </ng-template>
                }
                @if ($paginatorLastPageLinkIconTemplate()) {
                    <ng-template pTemplate="lastpagelinkicon">
                        <ng-container *ngTemplateOutlet="$paginatorLastPageLinkIconTemplate()"></ng-container>
                    </ng-template>
                }
                @if ($paginatorNextPageLinkIconTemplate()) {
                    <ng-template pTemplate="nextpagelinkicon">
                        <ng-container *ngTemplateOutlet="$paginatorNextPageLinkIconTemplate()"></ng-container>
                    </ng-template>
                }
            </p-paginator>
        }
        @if ($summaryTemplate()) {
            <div [pBind]="ptm('footer')" [class]="cx('footer')">
                <ng-container *ngTemplateOutlet="$summaryTemplate()"></ng-container>
            </div>
        }

        @if (resizableColumns()) {
            <div [pBind]="ptm('columnResizerHelper')" #resizeHelper [class]="cx('columnResizerHelper')" [style.display]="'none'"></div>
        }
        @if (reorderableColumns()) {
            <span [pBind]="ptm('reorderIndicatorUp')" #reorderIndicatorUp [class]="cx('reorderIndicatorUp')" [style.display]="'none'">
                @if (!$reorderIndicatorUpIconTemplate()) {
                    <svg data-p-icon="arrow-down" />
                }
                <ng-template *ngTemplateOutlet="$reorderIndicatorUpIconTemplate()"></ng-template>
            </span>
        }
        @if (reorderableColumns()) {
            <span [pBind]="ptm('reorderIndicatorDown')" #reorderIndicatorDown [class]="cx('reorderIndicatorDown')" [style.display]="'none'">
                @if (!$reorderIndicatorDownIconTemplate()) {
                    <svg data-p-icon="arrow-up" />
                }
                <ng-template *ngTemplateOutlet="$reorderIndicatorDownIconTemplate()"></ng-template>
            </span>
        }
    `,
    providers: [TreeTableService, TreeTableStyle, { provide: PARENT_INSTANCE, useExisting: TreeTable }],
    encapsulation: ViewEncapsulation.None,
    host: {
        '[class]': "cx('root')",
        '[attr.data-p]': 'dataP',
        '[attr.data-scrollselectors]': "'.p-treetable-scrollable-body'"
    },
    hostDirectives: [Bind]
})
export class TreeTable extends BaseComponent<TreeTablePassThrough> implements BlockableUI {
    _componentStyle = inject(TreeTableStyle);

    bindDirectiveInstance = inject(Bind, { self: true });

    filterService = inject(FilterService);

    tableService = inject(TreeTableService);

    zone = inject(NgZone);

    /**
     * An array of objects to represent dynamic columns.
     * @group Props
     */
    readonly columns = input<any[]>();

    /**
     * Inline style of the table.
     * @group Props
     */
    readonly tableStyle = input<{ [klass: string]: any } | null>();

    /**
     * Style class of the table.
     * @group Props
     */
    readonly tableStyleClass = input<string>();

    /**
     * Whether the cell widths scale according to their content or not.
     * @group Props
     */
    readonly autoLayout = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    /**
     * Defines if data is loaded and interacted with in lazy manner.
     * @group Props
     */
    readonly lazy = input<boolean, unknown>(false, { transform: booleanAttribute });

    /**
     * Whether to call lazy loading on initialization.
     * @group Props
     */
    readonly lazyLoadOnInit = input<boolean, unknown>(true, { transform: booleanAttribute });

    /**
     * When specified as true, enables the pagination.
     * @group Props
     */
    readonly paginator = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    /**
     * Number of rows to display per page.
     * @group Props
     */
    readonly rows = input<number | undefined, unknown>(undefined, { transform: numberAttribute });

    /**
     * Index of the first row to be displayed.
     * @group Props
     */
    readonly first = input<number, unknown>(0, { transform: numberAttribute });

    /**
     * Number of page links to display in paginator.
     * @group Props
     */
    readonly pageLinks = input<number, unknown>(5, { transform: numberAttribute });

    /**
     * Array of integer/object values to display inside rows per page dropdown of paginator
     * @group Props
     */
    readonly rowsPerPageOptions = input<any[]>();

    /**
     * Whether to show it even there is only one page.
     * @group Props
     */
    readonly alwaysShowPaginator = input<boolean, unknown>(true, { transform: booleanAttribute });

    /**
     * Position of the paginator.
     * @group Props
     */
    readonly paginatorPosition = input<'top' | 'bottom' | 'both'>('bottom');

    /**
     * Custom style class for paginator
     * @group Props
     */
    readonly paginatorStyleClass = input<string>();

    /**
     * Target element to attach the paginator dropdown overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name).
     * @group Props
     */
    readonly paginatorDropdownAppendTo = input<HTMLElement | ElementRef | TemplateRef<any> | string | null | undefined | any>();

    /**
     * Template of the current page report element. Available placeholders are {currentPage},{totalPages},{rows},{first},{last} and {totalRecords}
     * @group Props
     */
    readonly currentPageReportTemplate = input<string>('{currentPage} of {totalPages}');

    /**
     * Whether to display current page report.
     * @group Props
     */
    readonly showCurrentPageReport = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    /**
     * Whether to display a dropdown to navigate to any page.
     * @group Props
     */
    readonly showJumpToPageDropdown = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    /**
     * When enabled, icons are displayed on paginator to go first and last page.
     * @group Props
     */
    readonly showFirstLastIcon = input<boolean, unknown>(true, { transform: booleanAttribute });

    /**
     * Whether to show page links.
     * @group Props
     */
    readonly showPageLinks = input<boolean, unknown>(true, { transform: booleanAttribute });

    /**
     * Sort order to use when an unsorted column gets sorted by user interaction.
     * @group Props
     */
    readonly defaultSortOrder = input<number, unknown>(1, { transform: numberAttribute });

    /**
     * Defines whether sorting works on single column or on multiple columns.
     * @group Props
     */
    readonly sortMode = input<'single' | 'multiple'>('single');

    /**
     * When true, resets paginator to first page after sorting.
     * @group Props
     */
    readonly resetPageOnSort = input<boolean, unknown>(true, { transform: booleanAttribute });

    /**
     * Whether to use the default sorting or a custom one using sortFunction.
     * @group Props
     */
    readonly customSort = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    /**
     * Specifies the selection mode, valid values are "single" and "multiple".
     * @group Props
     */
    readonly selectionMode = input<string>();

    /**
     * Selected row with a context menu.
     * @group Props
     */
    readonly contextMenuSelection = input<any>();

    /**
     * Mode of the contet menu selection.
     * @group Props
     */
    readonly contextMenuSelectionMode = input<string>('separate');

    /**
     * A property to uniquely identify a record in data.
     * @group Props
     */
    readonly dataKey = input<string>();

    /**
     * Defines whether metaKey is should be considered for the selection. On touch enabled devices, metaKeySelection is turned off automatically.
     * @group Props
     */
    readonly metaKeySelection = input<boolean | undefined, unknown>(false, { transform: booleanAttribute });

    /**
     * Algorithm to define if a row is selected, valid values are "equals" that compares by reference and "deepEquals" that compares all fields.
     * @group Props
     */
    readonly compareSelectionBy = input<string>('deepEquals');

    /**
     * Adds hover effect to rows without the need for selectionMode.
     * @group Props
     */
    readonly rowHover = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

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
     * Whether to show the loading mask when loading property is true.
     * @group Props
     */
    readonly showLoader = input<boolean, unknown>(true, { transform: booleanAttribute });

    /**
     * When specified, enables horizontal and/or vertical scrolling.
     * @group Props
     */
    readonly scrollable = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    /**
     * Height of the scroll viewport in fixed pixels or the "flex" keyword for a dynamic size.
     * @group Props
     */
    readonly scrollHeight = input<string>();

    /**
     * Whether the data should be loaded on demand during scroll.
     * @group Props
     */
    readonly virtualScroll = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    /**
     * Height of a row to use in calculations of virtual scrolling.
     * @group Props
     */
    readonly virtualScrollItemSize = input<number | undefined, unknown>(undefined, { transform: numberAttribute });

    /**
     * Whether to use the scroller feature. The properties of scroller component can be used like an object in it.
     * @group Props
     */
    readonly virtualScrollOptions = input<ScrollerOptions>();

    /**
     * The delay (in milliseconds) before triggering the virtual scroll. This determines the time gap between the user's scroll action and the actual rendering of the next set of items in the virtual scroll.
     * @group Props
     */
    readonly virtualScrollDelay = input<number, unknown>(150, { transform: numberAttribute });

    /**
     * Width of the frozen columns container.
     * @group Props
     */
    readonly frozenWidth = input<string>();

    /**
     * An array of objects to represent dynamic columns that are frozen.
     * @group Props
     */
    readonly frozenColumns = input<{ [klass: string]: any } | null>();

    /**
     * When enabled, columns can be resized using drag and drop.
     * @group Props
     */
    readonly resizableColumns = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    /**
     * Defines whether the overall table width should change on column resize, valid values are "fit" and "expand".
     * @group Props
     */
    readonly columnResizeMode = input<string>('fit');

    /**
     * When enabled, columns can be reordered using drag and drop.
     * @group Props
     */
    readonly reorderableColumns = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    /**
     * Local ng-template varilable of a ContextMenu.
     * @group Props
     */
    readonly contextMenu = input<any>();

    /**
     * Function to optimize the dom operations by delegating to ngForTrackBy, default algorithm checks for object identity.
     * @group Props
     */
    readonly rowTrackBy = input<Function>((index: number, item: any) => item);

    /**
     * An array of FilterMetadata objects to provide external filters.
     * @group Props
     */
    readonly filters = input<{ [s: string]: FilterMetadata | undefined }>({});

    /**
     * An array of fields as string to use in global filtering.
     * @group Props
     */
    readonly globalFilterFields = input<string[]>();

    /**
     * Delay in milliseconds before filtering the data.
     * @group Props
     */
    readonly filterDelay = input<number, unknown>(300, { transform: numberAttribute });

    /**
     * Mode for filtering valid values are "lenient" and "strict". Default is lenient.
     * @group Props
     */
    readonly filterMode = input<string>('lenient');

    /**
     * Locale to use in filtering. The default locale is the host environment's current locale.
     * @group Props
     */
    readonly filterLocale = input<string>();

    /**
     * Locale to be used in paginator formatting.
     * @group Props
     */
    readonly paginatorLocale = input<string>();

    /**
     * Number of total records, defaults to length of value when not defined.
     * @group Props
     */
    readonly totalRecords = input<number>(0);

    /**
     * Name of the field to sort data by default.
     * @group Props
     */
    readonly sortField = input<string | undefined | null>();

    /**
     * Order to sort when default sorting is enabled.
     * @defaultValue 1
     * @group Props
     */
    readonly sortOrder = input<number>(1);

    /**
     * An array of SortMeta objects to sort the data by default in multiple sort mode.
     * @defaultValue null
     * @group Props
     */
    readonly multiSortMeta = input<SortMeta[] | undefined | null>();

    /**
     * Selected row in single mode or an array of values in multiple mode.
     * @defaultValue null
     * @group Props
     */
    readonly selection = input<any>();

    /**
     * An array of objects to display.
     * @defaultValue null
     * @group Props
     */
    readonly value = input<TreeNode<any>[] | undefined>([]);

    /**
     * Indicates the height of rows to be scrolled.
     * @defaultValue 28
     * @group Props
     * @deprecated use virtualScrollItemSize property instead.
     */
    readonly virtualRowHeight = input<number | undefined>();

    /**
     * A map of keys to control the selection state.
     * @group Props
     */
    readonly selectionKeys = input<any>();

    /**
     * Whether to show grid lines between cells.
     * @defaultValue false
     * @group Props
     */
    readonly showGridlines = input<boolean, unknown>(false, { transform: booleanAttribute });

    /**
     * Callback to invoke on selected node change.
     * @param {TreeTableNode} object - Node instance.
     * @group Emits
     */
    readonly selectionChange = output<TreeTableNode<any> | TreeTableNode<any>[] | null>();

    /**
     * Callback to invoke on context menu selection change.
     * @param {TreeTableNode} object - Node instance.
     * @group Emits
     */
    readonly contextMenuSelectionChange = output<TreeTableNode | null>();

    /**
     * Callback to invoke when data is filtered.
     * @param {TreeTableFilterEvent} event - Custom filter event.
     * @group Emits
     */
    readonly onFilter = output<TreeTableFilterEvent>();

    /**
     * Callback to invoke when a node is expanded.
     * @param {TreeTableNodeExpandEvent} event - Node expand event.
     * @group Emits
     */
    readonly onNodeExpand = output<TreeTableNodeExpandEvent>();

    /**
     * Callback to invoke when a node is collapsed.
     * @param {TreeTableNodeCollapseEvent} event - Node collapse event.
     * @group Emits
     */
    readonly onNodeCollapse = output<TreeTableNodeCollapseEvent>();

    /**
     * Callback to invoke when pagination occurs.
     * @param {TreeTablePaginatorState} object - Paginator state.
     * @group Emits
     */
    readonly onPage = output<TreeTablePaginatorState>();

    /**
     * Callback to invoke when a column gets sorted.
     * @param {Object} Object - Sort data.
     * @group Emits
     */
    readonly onSort = output<any>();

    /**
     * Callback to invoke when paging, sorting or filtering happens in lazy mode.
     * @param {TreeTableLazyLoadEvent} event - Custom lazy load event.
     * @group Emits
     */
    readonly onLazyLoad = output<TreeTableLazyLoadEvent>();

    /**
     * An event emitter to invoke on custom sorting, refer to sorting section for details.
     * @param {TreeTableSortEvent} event - Custom sort event.
     * @group Emits
     */
    readonly sortFunction = output<TreeTableSortEvent>();

    /**
     * Callback to invoke when a column is resized.
     * @param {TreeTableColResizeEvent} event - Custom column resize event.
     * @group Emits
     */
    readonly onColResize = output<TreeTableColResizeEvent>();

    /**
     * Callback to invoke when a column is reordered.
     * @param {TreeTableColumnReorderEvent} event - Custom column reorder.
     * @group Emits
     */
    readonly onColReorder = output<TreeTableColumnReorderEvent>();

    /**
     * Callback to invoke when a node is selected.
     * @param {TreeTableNode} object - Node instance.
     * @group Emits
     */
    readonly onNodeSelect = output<TreeTableNode>();

    /**
     * Callback to invoke when a node is unselected.
     * @param {TreeTableNodeUnSelectEvent} event - Custom node unselect event.
     * @group Emits
     */
    readonly onNodeUnselect = output<TreeTableNodeUnSelectEvent>();

    /**
     * Callback to invoke when a node is selected with right click.
     * @param {TreeTableContextMenuSelectEvent} event - Custom context menu select event.
     * @group Emits
     */
    readonly onContextMenuSelect = output<TreeTableContextMenuSelectEvent>();

    /**
     * Callback to invoke when state of header checkbox changes.
     * @param {TreeTableHeaderCheckboxToggleEvent} event - Custom checkbox toggle event.
     * @group Emits
     */
    readonly onHeaderCheckboxToggle = output<TreeTableHeaderCheckboxToggleEvent>();

    /**
     * Callback to invoke when a cell switches to edit mode.
     * @param {TreeTableEditEvent} event - Custom edit event.
     * @group Emits
     */
    readonly onEditInit = output<TreeTableEditEvent>();

    /**
     * Callback to invoke when cell edit is completed.
     * @param {TreeTableEditEvent} event - Custom edit event.
     * @group Emits
     */
    readonly onEditComplete = output<TreeTableEditEvent>();

    /**
     * Callback to invoke when cell edit is cancelled with escape key.
     * @param {TreeTableEditEvent} event - Custom edit event.
     * @group Emits
     */
    readonly onEditCancel = output<TreeTableEditEvent>();

    /**
     * Callback to invoke when selectionKeys are changed.
     * @param {Object} object - updated value of the selectionKeys.
     * @group Emits
     */
    readonly selectionKeysChange = output<any>();

    readonly resizeHelperViewChild = viewChild<Nullable<ElementRef>>('resizeHelper');

    readonly reorderIndicatorUpViewChild = viewChild<Nullable<ElementRef>>('reorderIndicatorUp');

    readonly reorderIndicatorDownViewChild = viewChild<Nullable<ElementRef>>('reorderIndicatorDown');

    readonly tableViewChild = viewChild<Nullable<ElementRef>>('table');

    readonly scrollableViewChild = viewChild<Nullable<TTScrollableView>>('scrollableView');

    readonly scrollableFrozenViewChild = viewChild<Nullable<TTScrollableView>>('scrollableFrozenView');

    readonly _colGroupTemplate = contentChild<Nullable<TemplateRef<TreeTableColumnsTemplateContext>>>('colgroup', { descendants: false });

    readonly _captionTemplate = contentChild<Nullable<TemplateRef<void>>>('caption', { descendants: false });

    readonly _headerTemplate = contentChild<Nullable<TemplateRef<TreeTableColumnsTemplateContext>>>('header', { descendants: false });

    readonly _bodyTemplate = contentChild<Nullable<TemplateRef<TreeTableBodyTemplateContext>>>('body', { descendants: false });

    readonly _footerTemplate = contentChild<Nullable<TemplateRef<TreeTableColumnsTemplateContext>>>('footer', { descendants: false });

    readonly _summaryTemplate = contentChild<Nullable<TemplateRef<void>>>('summary', { descendants: false });

    readonly _emptyMessageTemplate = contentChild<Nullable<TemplateRef<TreeTableEmptyMessageTemplateContext>>>('emptymessage', { descendants: false });

    readonly _paginatorLeftTemplate = contentChild<Nullable<TemplateRef<void>>>('paginatorleft', { descendants: false });

    readonly _paginatorRightTemplate = contentChild<Nullable<TemplateRef<void>>>('paginatorright', { descendants: false });

    readonly _paginatorDropdownItemTemplate = contentChild<Nullable<TemplateRef<void>>>('paginatordropdownitem', { descendants: false });

    readonly _frozenHeaderTemplate = contentChild<Nullable<TemplateRef<TreeTableColumnsTemplateContext>>>('frozenheader', { descendants: false });

    readonly _frozenBodyTemplate = contentChild<Nullable<TemplateRef<void>>>('frozenbody', { descendants: false });

    readonly _frozenFooterTemplate = contentChild<Nullable<TemplateRef<TreeTableColumnsTemplateContext>>>('frozenfooter', { descendants: false });

    readonly _frozenColGroupTemplate = contentChild<Nullable<TemplateRef<TreeTableColumnsTemplateContext>>>('frozencolgroup', { descendants: false });

    readonly _loadingIconTemplate = contentChild<Nullable<TemplateRef<void>>>('loadingicon', { descendants: false });

    readonly _reorderIndicatorUpIconTemplate = contentChild<Nullable<TemplateRef<void>>>('reorderindicatorupicon', { descendants: false });

    readonly _reorderIndicatorDownIconTemplate = contentChild<Nullable<TemplateRef<void>>>('reorderindicatordownicon', { descendants: false });

    readonly _sortIconTemplate = contentChild<Nullable<TemplateRef<TreeTableSortIconTemplateContext>>>('sorticon', { descendants: false });

    readonly _checkboxIconTemplate = contentChild<Nullable<TemplateRef<TreeTableCheckboxIconTemplateContext>>>('checkboxicon', { descendants: false });

    readonly _headerCheckboxIconTemplate = contentChild<Nullable<TemplateRef<TreeTableHeaderCheckboxIconTemplateContext>>>('headercheckboxicon', { descendants: false });

    readonly _togglerIconTemplate = contentChild<Nullable<TemplateRef<TreeTableTogglerIconTemplateContext>>>('togglericon', { descendants: false });

    readonly _paginatorFirstPageLinkIconTemplate = contentChild<Nullable<TemplateRef<void>>>('paginatorfirstpagelinkicon', { descendants: false });

    readonly _paginatorLastPageLinkIconTemplate = contentChild<Nullable<TemplateRef<void>>>('paginatorlastpagelinkicon', { descendants: false });

    readonly _paginatorPreviousPageLinkIconTemplate = contentChild<Nullable<TemplateRef<void>>>('paginatorpreviouspagelinkicon', { descendants: false });

    readonly _paginatorNextPageLinkIconTemplate = contentChild<Nullable<TemplateRef<void>>>('paginatornextpagelinkicon', { descendants: false });

    readonly _loaderTemplate = contentChild<Nullable<TemplateRef<void>>>('loader', { descendants: false });

    readonly templates = contentChildren(PrimeTemplate);

    componentName = 'TreeTable';

    readonly $rows = linkedSignal(() => this.rows());

    readonly $first = linkedSignal(() => this.first());

    readonly $contextMenuSelection = linkedSignal(() => this.contextMenuSelection());

    readonly $filters = linkedSignal(() => this.filters());

    readonly _value = linkedSignal(() => this.value());

    readonly _virtualRowHeight = linkedSignal(() => this.virtualRowHeight() ?? 28);

    readonly _selectionKeys = linkedSignal(() => this.selectionKeys());

    readonly serializedValue = signal<any[] | undefined | null>(undefined);

    readonly _totalRecords = linkedSignal(() => this.totalRecords());

    readonly _multiSortMeta = linkedSignal(() => this.multiSortMeta());

    readonly _sortField = linkedSignal(() => this.sortField());

    readonly _sortOrder = linkedSignal(() => this.sortOrder());

    readonly filteredNodes = signal<Nullable<any[]>>(undefined);

    /**
     * Notifies the table service whenever the `totalRecords` input changes, replacing the legacy
     * `totalRecords` setter side effect. Internal writes go through `setTotalRecords()` instead.
     */
    private readonly totalRecordsEffect = effect(() => {
        this.totalRecords();

        untracked(() => this.tableService.onTotalRecordsChange(this._totalRecords()));
    });

    /**
     * Logs the deprecation warning whenever the `virtualRowHeight` input is bound, replacing the
     * legacy setter side effect. Skipped while the input is undefined so an unbound input stays silent.
     */
    private readonly virtualRowHeightEffect = effect(() => {
        const virtualRowHeight = this.virtualRowHeight();

        if (virtualRowHeight !== undefined) {
            untracked(() => console.log('The virtualRowHeight property is deprecated, use virtualScrollItemSize property instead.'));
        }
    });

    /**
     * Re-emits `selectionKeysChange` whenever the `selectionKeys` input changes, replacing the
     * legacy setter side effect. Skipped while the input is undefined so an unbound input never emits.
     */
    private readonly selectionKeysEffect = effect(() => {
        const selectionKeys = this.selectionKeys();

        if (selectionKeys !== undefined) {
            untracked(() => this.selectionKeysChange.emit(selectionKeys));
        }
    });

    /**
     * Reacts to `value` input changes, replacing the legacy `onChanges` `value` branch (sorting or
     * filtering the new value and refreshing the serialized rows). Non-skipping: the legacy branch
     * also ran on the initial binding.
     */
    private readonly valueEffect = effect(() => {
        this.value();

        untracked(() => {
            if (!this.lazy()) {
                this.setTotalRecords(this._value() ? this._value()!.length : 0);

                if (this.sortMode() == 'single' && this._sortField()) this.sortSingle();
                else if (this.sortMode() == 'multiple' && this._multiSortMeta()) this.sortMultiple();
                else if (this.hasFilter())
                    //sort already filters
                    this._filter();
            }

            this.updateSerializedValue();
            this.tableService.onUIUpdate(this._value());
        });
    });

    /**
     * Reacts to `sortField` input changes, replacing the legacy `onChanges` `sortField` branch.
     */
    private readonly sortFieldEffect = effect(() => {
        this.sortField();

        untracked(() => {
            //avoid triggering lazy load prior to lazy initialization at onInit
            if (!this.lazy() || this.initialized) {
                if (this.sortMode() === 'single') {
                    this.sortSingle();
                }
            }
        });
    });

    /**
     * Reacts to `sortOrder` input changes, replacing the legacy `onChanges` `sortOrder` branch.
     */
    private readonly sortOrderEffect = effect(() => {
        this.sortOrder();

        untracked(() => {
            //avoid triggering lazy load prior to lazy initialization at onInit
            if (!this.lazy() || this.initialized) {
                if (this.sortMode() === 'single') {
                    this.sortSingle();
                }
            }
        });
    });

    /**
     * Reacts to `multiSortMeta` input changes, replacing the legacy `onChanges` `multiSortMeta` branch.
     */
    private readonly multiSortMetaEffect = effect(() => {
        this.multiSortMeta();

        untracked(() => {
            if (this.sortMode() === 'multiple') {
                this.sortMultiple();
            }
        });
    });

    /**
     * Reacts to `selection` input changes, replacing the legacy `onChanges` `selection` branch.
     */
    private readonly selectionEffect = effect(() => {
        this.selection();

        untracked(() => {
            if (!this.preventSelectionSetterPropagation) {
                this.updateselectedKeys();
                this.tableService.onSelectionChange();
            }
            this.preventSelectionSetterPropagation = false;
        });
    });

    filterTimeout: any;

    readonly $colGroupTemplate = computed(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'colgroup')
                .at(-1)?.template ?? this._colGroupTemplate()
    );

    readonly $captionTemplate = computed(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'caption')
                .at(-1)?.template ?? this._captionTemplate()
    );

    readonly $headerTemplate = computed(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'header')
                .at(-1)?.template ?? this._headerTemplate()
    );

    readonly $bodyTemplate = computed(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'body')
                .at(-1)?.template ?? this._bodyTemplate()
    );

    readonly $footerTemplate = computed(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'footer')
                .at(-1)?.template ?? this._footerTemplate()
    );

    readonly $summaryTemplate = computed(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'summary')
                .at(-1)?.template ?? this._summaryTemplate()
    );

    readonly $emptyMessageTemplate = computed(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'emptymessage')
                .at(-1)?.template ?? this._emptyMessageTemplate()
    );

    readonly $paginatorLeftTemplate = computed(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'paginatorleft')
                .at(-1)?.template ?? this._paginatorLeftTemplate()
    );

    readonly $paginatorRightTemplate = computed(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'paginatorright')
                .at(-1)?.template ?? this._paginatorRightTemplate()
    );

    readonly $paginatorDropdownItemTemplate = computed(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'paginatordropdownitem')
                .at(-1)?.template ?? this._paginatorDropdownItemTemplate()
    );

    readonly $frozenHeaderTemplate = computed(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'frozenheader')
                .at(-1)?.template ?? this._frozenHeaderTemplate()
    );

    readonly $frozenBodyTemplate = computed(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'frozenbody')
                .at(-1)?.template ?? this._frozenBodyTemplate()
    );

    readonly $frozenFooterTemplate = computed(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'frozenfooter')
                .at(-1)?.template ?? this._frozenFooterTemplate()
    );

    readonly $frozenColGroupTemplate = computed(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'frozencolgroup')
                .at(-1)?.template ?? this._frozenColGroupTemplate()
    );

    readonly $loadingIconTemplate = computed(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'loadingicon')
                .at(-1)?.template ?? this._loadingIconTemplate()
    );

    readonly $reorderIndicatorUpIconTemplate = computed(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'reorderindicatorupicon')
                .at(-1)?.template ?? this._reorderIndicatorUpIconTemplate()
    );

    readonly $reorderIndicatorDownIconTemplate = computed(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'reorderindicatordownicon')
                .at(-1)?.template ?? this._reorderIndicatorDownIconTemplate()
    );

    readonly $sortIconTemplate = computed(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'sorticon')
                .at(-1)?.template ?? this._sortIconTemplate()
    );

    readonly $checkboxIconTemplate = computed(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'checkboxicon')
                .at(-1)?.template ?? this._checkboxIconTemplate()
    );

    readonly $headerCheckboxIconTemplate = computed(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'headercheckboxicon')
                .at(-1)?.template ?? this._headerCheckboxIconTemplate()
    );

    readonly $togglerIconTemplate = computed(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'togglericon')
                .at(-1)?.template ?? this._togglerIconTemplate()
    );

    readonly $paginatorFirstPageLinkIconTemplate = computed(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'paginatorfirstpagelinkicon')
                .at(-1)?.template ?? this._paginatorFirstPageLinkIconTemplate()
    );

    readonly $paginatorLastPageLinkIconTemplate = computed(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'paginatorlastpagelinkicon')
                .at(-1)?.template ?? this._paginatorLastPageLinkIconTemplate()
    );

    readonly $paginatorPreviousPageLinkIconTemplate = computed(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'paginatorpreviouspagelinkicon')
                .at(-1)?.template ?? this._paginatorPreviousPageLinkIconTemplate()
    );

    readonly $paginatorNextPageLinkIconTemplate = computed(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'paginatornextpagelinkicon')
                .at(-1)?.template ?? this._paginatorNextPageLinkIconTemplate()
    );

    readonly $loaderTemplate = computed(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'loader')
                .at(-1)?.template ?? this._loaderTemplate()
    );

    lastResizerHelperX: Nullable<number>;

    reorderIconWidth: Nullable<number>;

    reorderIconHeight: Nullable<number>;

    draggedColumn: Nullable<any[]>;

    dropPosition: Nullable<number>;

    preventSelectionSetterPropagation: Nullable<boolean>;

    readonly _selection = linkedSignal(() => this.selection());

    selectedKeys: any = {};

    rowTouched: Nullable<boolean>;

    editingCell: Nullable<Element>;

    editingCellData: any | undefined | null;

    editingCellField: any | undefined | null;

    editingCellClick: Nullable<boolean>;

    documentEditListener: VoidListener;

    initialized: Nullable<boolean>;

    toggleRowIndex: Nullable<number>;

    get dataP() {
        return this.cn({
            scrollable: this.scrollable(),
            'flex-scrollable': this.scrollable() && this.scrollHeight() === 'flex',
            loading: this.loading(),
            empty: this.isEmpty()
        });
    }

    constructor() {
        super();
        afterEveryRender(() => {
            this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
        });
    }

    onInit() {
        if (this.lazy() && this.lazyLoadOnInit() && !this.virtualScroll()) {
            this.onLazyLoad.emit(this.createLazyLoadMetadata());
        }
        this.initialized = true;
    }

    onDestroy() {
        this.unbindDocumentEditListener();
        this.editingCell = null;
        this.editingCellField = null;
        this.editingCellData = null;
        this.initialized = null;
    }

    /**
     * Updates `_totalRecords` and notifies the table service, replacing the legacy `totalRecords`
     * setter that internal writes relied on.
     */
    setTotalRecords(val: number) {
        this._totalRecords.set(val);
        this.tableService.onTotalRecordsChange(val);
    }

    updateSerializedValue() {
        if (this.paginator()) {
            this.serializePageNodes();
        } else {
            const serializedValue: TreeTableNode[] = [];

            this.serializeNodes(null, this.filteredNodes() || this._value(), 0, true, serializedValue);
            this.serializedValue.set(serializedValue);
        }
    }

    serializeNodes(parent: Nullable<TreeTableNode>, nodes: Nullable<TreeNode[]>, level: Nullable<number>, visible: Nullable<boolean>, target: TreeTableNode[]) {
        if (nodes && nodes.length) {
            for (let node of nodes) {
                node.parent = <TreeTableNode>parent;
                const rowNode = {
                    node: node,
                    parent: parent,
                    level: level,
                    visible: visible && (parent ? parent.expanded : true)
                };
                target.push(<TreeTableNode>rowNode);

                if (rowNode.visible && node.expanded) {
                    this.serializeNodes(node, node.children, <number>level + 1, rowNode.visible, target);
                }
            }
        }
    }

    serializePageNodes() {
        let data = this.filteredNodes() || this._value();
        const serializedValue: TreeTableNode[] = [];

        if (data && data.length) {
            const first = this.lazy() ? 0 : this.$first();

            for (let i = first; i < first + <number>this.$rows(); i++) {
                let node = data[i];
                if (node) {
                    serializedValue.push({
                        node: node,
                        parent: <any>null,
                        level: 0,
                        visible: true
                    });

                    this.serializeNodes(node, node.children, 1, true, serializedValue);
                }
            }
        }

        this.serializedValue.set(serializedValue);
    }

    updateselectedKeys() {
        if (this.dataKey() && this._selection) {
            this.selectedKeys = {};
            if (Array.isArray(this._selection)) {
                for (let node of this._selection) {
                    this.selectedKeys[String(resolveFieldData(node.data, this.dataKey()))] = 1;
                }
            } else {
                this.selectedKeys[String(resolveFieldData((<any>this._selection).data, this.dataKey()))] = 1;
            }
        }
    }

    onPageChange(event: TreeTablePaginatorState) {
        this.$first.set(<number>event.first);
        this.$rows.set(<number>event.rows);

        if (this.lazy()) this.onLazyLoad.emit(this.createLazyLoadMetadata());
        else this.serializePageNodes();

        this.onPage.emit({
            first: this.$first(),
            rows: this.$rows()
        });

        this.tableService.onUIUpdate(this._value());

        if (this.scrollable()) {
            this.resetScrollTop();
        }
    }

    sort(event: TreeTableSortEvent) {
        let originalEvent = event.originalEvent;

        if (this.sortMode() === 'single') {
            this._sortOrder.set(this._sortField() === event.field ? this._sortOrder() * -1 : this.defaultSortOrder());
            this._sortField.set(event.field);
            this.sortSingle();

            if (this.resetPageOnSort() && this.scrollable()) {
                this.resetScrollTop();
            }
        }
        if (this.sortMode() === 'multiple') {
            let metaKey = (<KeyboardEvent>originalEvent).metaKey || (<KeyboardEvent>originalEvent).ctrlKey;
            let sortMeta = this.getSortMeta(<string>event.field);

            if (sortMeta) {
                if (!metaKey) {
                    this._multiSortMeta.set([{ field: <string>event.field, order: sortMeta.order * -1 }]);

                    if (this.resetPageOnSort() && this.scrollable()) {
                        this.resetScrollTop();
                    }
                } else {
                    sortMeta.order = sortMeta.order * -1;
                }
            } else {
                if (!metaKey || !this._multiSortMeta()) {
                    this._multiSortMeta.set([]);

                    if (this.resetPageOnSort() && this.scrollable()) {
                        this.resetScrollTop();
                    }
                }
                (<SortMeta[]>this._multiSortMeta()).push({ field: <string>event.field, order: this.defaultSortOrder() });
            }

            this.sortMultiple();
        }
    }

    sortSingle() {
        if (this._sortField() && this._sortOrder()) {
            if (this.lazy()) {
                this.onLazyLoad.emit(this.createLazyLoadMetadata());
            } else if (this._value()) {
                this.sortNodes(this._value()!);

                if (this.hasFilter()) {
                    this._filter();
                }
            }

            let sortMeta: SortMeta = {
                field: <string>this._sortField(),
                order: this._sortOrder()
            };

            this.onSort.emit(sortMeta);
            this.tableService.onSort(sortMeta);
            this.updateSerializedValue();
        }
    }

    sortNodes(nodes: TreeNode[]) {
        if (!nodes || nodes.length === 0) {
            return;
        }

        if (this.customSort()) {
            this.sortFunction.emit({
                data: nodes,
                mode: this.sortMode(),
                field: <string>this._sortField(),
                order: this._sortOrder()
            });
        } else {
            nodes.sort((node1, node2) => {
                let value1 = resolveFieldData(node1.data, this._sortField());
                let value2 = resolveFieldData(node2.data, this._sortField());
                let result: number = 0;

                if (value1 == null && value2 != null) result = -1;
                else if (value1 != null && value2 == null) result = 1;
                else if (value1 == null && value2 == null) result = 0;
                else if (typeof value1 === 'string' && typeof value2 === 'string') result = value1.localeCompare(value2, undefined, { numeric: true });
                else result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;

                return this._sortOrder() * result;
            });
        }

        for (let node of nodes) {
            this.sortNodes(node.children as TreeNode[]);
        }
    }

    sortMultiple() {
        if (this._multiSortMeta()) {
            if (this.lazy()) {
                this.onLazyLoad.emit(this.createLazyLoadMetadata());
            } else if (this._value()) {
                this.sortMultipleNodes(this._value()!);

                if (this.hasFilter()) {
                    this._filter();
                }
            }

            this.onSort.emit({
                multisortmeta: this._multiSortMeta()
            });
            this.updateSerializedValue();
            this.tableService.onSort(this._multiSortMeta() ?? null);
        }
    }

    sortMultipleNodes(nodes: TreeNode[]) {
        if (!nodes || nodes.length === 0) {
            return;
        }

        if (this.customSort()) {
            this.sortFunction.emit({
                data: this._value(),
                mode: this.sortMode(),
                multiSortMeta: this._multiSortMeta()
            });
        } else {
            nodes.sort((node1, node2) => {
                return this.multisortField(node1, node2, <SortMeta[]>this._multiSortMeta(), 0);
            });
        }

        for (let node of nodes) {
            this.sortMultipleNodes(node.children as TreeNode[]);
        }
    }

    multisortField(node1: TreeTableNode, node2: TreeTableNode, multiSortMeta: SortMeta[], index: number): number {
        if (isEmpty(this._multiSortMeta()) || isEmpty(multiSortMeta[index])) {
            return 0;
        }

        let value1 = resolveFieldData(node1.data, multiSortMeta[index].field);
        let value2 = resolveFieldData(node2.data, multiSortMeta[index].field);
        let result: number = 0;

        if (value1 == null && value2 != null) result = -1;
        else if (value1 != null && value2 == null) result = 1;
        else if (value1 == null && value2 == null) result = 0;
        if (typeof value1 == 'string' || value1 instanceof String) {
            if (value1.localeCompare && value1 != value2) {
                return multiSortMeta[index].order * value1.localeCompare(value2, undefined, { numeric: true });
            }
        } else {
            result = value1 < value2 ? -1 : 1;
        }

        if (value1 == value2) {
            return multiSortMeta.length - 1 > index ? this.multisortField(node1, node2, multiSortMeta, index + 1) : 0;
        }

        return multiSortMeta[index].order * result;
    }

    getSortMeta(field: string) {
        const multiSortMeta = this._multiSortMeta();

        if (multiSortMeta && multiSortMeta.length) {
            for (let i = 0; i < multiSortMeta.length; i++) {
                if (multiSortMeta[i].field === field) {
                    return multiSortMeta[i];
                }
            }
        }

        return null;
    }

    isSorted(field: string) {
        if (this.sortMode() === 'single') {
            return this._sortField() && this._sortField() === field;
        } else if (this.sortMode() === 'multiple') {
            let sorted = false;
            const multiSortMeta = this._multiSortMeta();

            if (multiSortMeta) {
                for (let i = 0; i < multiSortMeta.length; i++) {
                    if (multiSortMeta[i].field == field) {
                        sorted = true;
                        break;
                    }
                }
            }
            return sorted;
        }
    }

    createLazyLoadMetadata(): any {
        return {
            first: this.$first(),
            rows: this.$rows(),
            sortField: this._sortField(),
            sortOrder: this._sortOrder(),
            filters: this.$filters(),
            globalFilter: this.$filters() && this.$filters()['global'] ? this.$filters()['global']!.value : null,
            multiSortMeta: this._multiSortMeta(),
            forceUpdate: () => this.cd.detectChanges()
        };
    }

    onLazyItemLoad(event: TreeTableLazyLoadEvent) {
        this.onLazyLoad.emit({
            ...this.createLazyLoadMetadata(),
            ...event,
            rows: event.last - event.first
        });
    }

    /**
     * Resets scroll to top.
     * @group Method
     */
    public resetScrollTop() {
        if (this.virtualScroll()) this.scrollToVirtualIndex(0);
        else this.scrollTo({ top: 0 });
    }

    /**
     * Scrolls to given index when using virtual scroll.
     * @param {number} index - index of the element.
     * @group Method
     */
    public scrollToVirtualIndex(index: number) {
        this.scrollableViewChild()?.scrollToVirtualIndex(index);
        this.scrollableFrozenViewChild()?.scrollToVirtualIndex(index);
    }

    /**
     * Scrolls to given index.
     * @param {ScrollToOptions} options - Scroll options.
     * @group Method
     */
    public scrollTo(options: ScrollToOptions) {
        this.scrollableViewChild()?.scrollTo(options);
        this.scrollableFrozenViewChild()?.scrollTo(options);
    }

    isEmpty() {
        let data = this.filteredNodes() || this._value();
        return data == null || data.length == 0;
    }

    getBlockableElement(): HTMLElement {
        return this.el.nativeElement.children[0];
    }

    onColumnResizeBegin(event: MouseEvent) {
        let containerLeft = <any>getOffset(this.el?.nativeElement).left;
        this.lastResizerHelperX = event.pageX - containerLeft + this.el?.nativeElement.scrollLeft;
        event.preventDefault();
    }

    onColumnResize(event: MouseEvent) {
        let containerLeft = <any>getOffset(this.el?.nativeElement).left;
        this.el?.nativeElement.setAttribute('data-p-unselectable-text', 'true');
        !this.$unstyled() && addStyle(this.el.nativeElement, { 'user-select': 'none' });
        (<ElementRef>this.resizeHelperViewChild()).nativeElement.style.height = this.el?.nativeElement.offsetHeight + 'px';
        (<ElementRef>this.resizeHelperViewChild()).nativeElement.style.top = 0 + 'px';
        (<ElementRef>this.resizeHelperViewChild()).nativeElement.style.left = event.pageX - containerLeft + this.el?.nativeElement.scrollLeft + 'px';

        (<ElementRef>this.resizeHelperViewChild()).nativeElement.style.display = 'block';
    }

    onColumnResizeEnd(event: MouseEvent, column: any) {
        let delta = (<ElementRef>this.resizeHelperViewChild()).nativeElement.offsetLeft - <number>this.lastResizerHelperX;
        let columnWidth = column.offsetWidth;
        let newColumnWidth = columnWidth + delta;
        let minWidth = column.style.minWidth || 15;

        if (columnWidth + delta > parseInt(minWidth)) {
            if (this.columnResizeMode() === 'fit') {
                let nextColumn = column.nextElementSibling;
                while (!nextColumn.offsetParent) {
                    nextColumn = nextColumn.nextElementSibling;
                }

                if (nextColumn) {
                    let nextColumnWidth = nextColumn.offsetWidth - delta;
                    let nextColumnMinWidth = nextColumn.style.minWidth || 15;

                    if (newColumnWidth > 15 && nextColumnWidth > parseInt(nextColumnMinWidth)) {
                        if (this.scrollable()) {
                            let scrollableView = this.findParentScrollableView(column);
                            let scrollableBodyTable = <any>findSingle(scrollableView, '[data-pc-section="scrollablebody"] table') || findSingle(scrollableView, '[data-pc-name="virtualscroller"] table');
                            let scrollableHeaderTable = <any>findSingle(scrollableView, '[data-pc-section="scrollableheadertable"]');
                            let scrollableFooterTable = <any>findSingle(scrollableView, '[data-pc-section="scrollablefootertable"]');
                            let resizeColumnIndex = getIndex(column);

                            this.resizeColGroup(scrollableHeaderTable, resizeColumnIndex, newColumnWidth, nextColumnWidth);
                            this.resizeColGroup(scrollableBodyTable, resizeColumnIndex, newColumnWidth, nextColumnWidth);
                            this.resizeColGroup(scrollableFooterTable, resizeColumnIndex, newColumnWidth, nextColumnWidth);
                        } else {
                            column.style.width = newColumnWidth + 'px';
                            if (nextColumn) {
                                nextColumn.style.width = nextColumnWidth + 'px';
                            }
                        }
                    }
                }
            } else if (this.columnResizeMode() === 'expand') {
                if (this.scrollable()) {
                    let scrollableView = this.findParentScrollableView(column);
                    let scrollableBody = <any>findSingle(scrollableView, '[data-pc-section="scrollablebody"]') || findSingle(scrollableView, '[data-pc-name="virtualscroller"]');
                    let scrollableHeader = <any>findSingle(scrollableView, '[data-pc-section="scrollableheader"]');
                    let scrollableFooter = <any>findSingle(scrollableView, '[data-pc-section="scrollablefooter"]');
                    let scrollableBodyTable = <any>findSingle(scrollableView, '[data-pc-section="scrollablebody"] table') || findSingle(scrollableView, '[data-pc-name="virtualscroller"] table');
                    let scrollableHeaderTable = <any>findSingle(scrollableView, '[data-pc-section="scrollableheadertable"]');
                    let scrollableFooterTable = <any>findSingle(scrollableView, '[data-pc-section="scrollablefootertable"]');
                    scrollableBodyTable.style.width = scrollableBodyTable.offsetWidth + delta + 'px';
                    scrollableHeaderTable.style.width = scrollableHeaderTable.offsetWidth + delta + 'px';
                    if (scrollableFooterTable) {
                        scrollableFooterTable.style.width = scrollableFooterTable.offsetWidth + delta + 'px';
                    }
                    let resizeColumnIndex = getIndex(column);

                    const scrollableBodyTableWidth = column ? scrollableBodyTable.offsetWidth + delta : newColumnWidth;
                    const scrollableHeaderTableWidth = column ? scrollableHeaderTable.offsetWidth + delta : newColumnWidth;
                    const isContainerInViewport = this.el?.nativeElement.offsetWidth >= scrollableBodyTableWidth;

                    let setWidth = (container: HTMLElement, table: HTMLElement, width: number, isContainerInViewport: boolean) => {
                        if (container && table) {
                            container.style.width = isContainerInViewport ? width + calculateScrollbarWidth(scrollableBody) + 'px' : 'auto';
                            table.style.width = width + 'px';
                        }
                    };

                    setWidth(scrollableBody, scrollableBodyTable, scrollableBodyTableWidth, isContainerInViewport);
                    setWidth(scrollableHeader, scrollableHeaderTable, scrollableHeaderTableWidth, isContainerInViewport);
                    setWidth(scrollableFooter, scrollableFooterTable, scrollableHeaderTableWidth, isContainerInViewport);

                    this.resizeColGroup(scrollableHeaderTable, resizeColumnIndex, newColumnWidth, null);
                    this.resizeColGroup(scrollableBodyTable, resizeColumnIndex, newColumnWidth, null);
                    this.resizeColGroup(scrollableFooterTable, resizeColumnIndex, newColumnWidth, null);
                } else {
                    const tableViewChild = this.tableViewChild();
                    (<ElementRef>this.tableViewChild()).nativeElement.style.width = tableViewChild?.nativeElement.offsetWidth + delta + 'px';
                    column.style.width = newColumnWidth + 'px';
                    let containerWidth = tableViewChild?.nativeElement.style.width;
                    (<ElementRef>this.el).nativeElement.style.width = containerWidth + 'px';
                }
            }

            this.onColResize.emit({
                element: column,
                delta: delta
            });
        }

        (this.resizeHelperViewChild() as ElementRef).nativeElement.style.display = 'none';

        this.el.nativeElement.removeAttribute('data-p-unselectable-text');
        !this.$unstyled() && (this.el.nativeElement.style['user-select'] = '');
    }

    findParentScrollableView(column: any) {
        if (column) {
            let parent = column.parentElement;
            while (parent && !findSingle(parent, '[data-pc-section="scrollableview"]')) {
                parent = parent.parentElement;
            }

            return parent;
        } else {
            return null;
        }
    }

    resizeColGroup(table: Nullable<HTMLElement>, resizeColumnIndex: Nullable<number>, newColumnWidth: Nullable<number>, nextColumnWidth: Nullable<number>) {
        if (table) {
            let colGroup = table.children[0].nodeName === 'COLGROUP' ? table.children[0] : null;

            if (colGroup) {
                let col = colGroup.children[<number>resizeColumnIndex];
                let nextCol = col.nextElementSibling;
                (<HTMLElement>col).style.width = newColumnWidth + 'px';

                if (nextCol && nextColumnWidth) {
                    (<HTMLElement>nextCol).style.width = nextColumnWidth + 'px';
                }
            } else {
                throw 'Scrollable tables require a colgroup to support resizable columns';
            }
        }
    }

    onColumnDragStart(event: DragEvent, columnElement: any) {
        this.reorderIconWidth = getHiddenElementOuterWidth(this.reorderIndicatorUpViewChild()?.nativeElement);
        this.reorderIconHeight = getHiddenElementOuterHeight(this.reorderIndicatorDownViewChild()?.nativeElement);
        this.draggedColumn = columnElement;
        (<any>event).dataTransfer.setData('text', 'b'); // For firefox
    }

    onColumnDragEnter(event: DragEvent, dropHeader: any) {
        if (this.reorderableColumns() && this.draggedColumn && dropHeader) {
            event.preventDefault();
            let containerOffset = <any>getOffset(this.el?.nativeElement);
            let dropHeaderOffset = <any>getOffset(dropHeader);

            if (this.draggedColumn != dropHeader) {
                let targetLeft = dropHeaderOffset.left - containerOffset.left;
                let targetTop = containerOffset.top - dropHeaderOffset.top;
                let columnCenter = dropHeaderOffset.left + dropHeader.offsetWidth / 2;

                (<ElementRef>this.reorderIndicatorUpViewChild()).nativeElement.style.top = dropHeaderOffset.top - containerOffset.top - (<number>this.reorderIconHeight - 1) + 'px';
                (<ElementRef>this.reorderIndicatorDownViewChild()).nativeElement.style.top = dropHeaderOffset.top - containerOffset.top + dropHeader.offsetHeight + 'px';

                if (event.pageX > columnCenter) {
                    (<ElementRef>this.reorderIndicatorUpViewChild()).nativeElement.style.left = targetLeft + dropHeader.offsetWidth - Math.ceil(<number>this.reorderIconWidth / 2) + 'px';
                    (<ElementRef>this.reorderIndicatorDownViewChild()).nativeElement.style.left = targetLeft + dropHeader.offsetWidth - Math.ceil(<number>this.reorderIconWidth / 2) + 'px';
                    this.dropPosition = 1;
                } else {
                    (<ElementRef>this.reorderIndicatorUpViewChild()).nativeElement.style.left = targetLeft - Math.ceil(<number>this.reorderIconWidth / 2) + 'px';
                    (<ElementRef>this.reorderIndicatorDownViewChild()).nativeElement.style.left = targetLeft - Math.ceil(<number>this.reorderIconWidth / 2) + 'px';
                    this.dropPosition = -1;
                }

                (<ElementRef>this.reorderIndicatorUpViewChild()).nativeElement.style.display = 'block';
                (<ElementRef>this.reorderIndicatorDownViewChild()).nativeElement.style.display = 'block';
            } else {
                (<any>event).dataTransfer.dropEffect = 'none';
            }
        }
    }

    onColumnDragLeave(event: DragEvent) {
        if (this.reorderableColumns() && this.draggedColumn) {
            event.preventDefault();
            (<ElementRef>this.reorderIndicatorUpViewChild()).nativeElement.style.display = 'none';
            (<ElementRef>this.reorderIndicatorDownViewChild()).nativeElement.style.display = 'none';
        }
    }

    onColumnDrop(event: DragEvent, dropColumn: any) {
        event.preventDefault();
        if (this.draggedColumn) {
            let dragIndex = DomHandler.indexWithinGroup(this.draggedColumn, 'ttreorderablecolumn');
            let dropIndex = DomHandler.indexWithinGroup(dropColumn, 'ttreorderablecolumn');
            let allowDrop = dragIndex != dropIndex;
            if (allowDrop && ((dropIndex - dragIndex == 1 && this.dropPosition === -1) || (dragIndex - dropIndex == 1 && this.dropPosition === 1))) {
                allowDrop = false;
            }

            if (allowDrop && dropIndex < dragIndex && this.dropPosition === 1) {
                dropIndex = dropIndex + 1;
            }

            if (allowDrop && dropIndex > dragIndex && this.dropPosition === -1) {
                dropIndex = dropIndex - 1;
            }

            if (allowDrop) {
                reorderArray(<any[]>this.columns(), dragIndex, dropIndex);

                this.onColReorder.emit({
                    dragIndex: dragIndex,
                    dropIndex: dropIndex,
                    columns: this.columns()
                });
            }

            (<ElementRef>this.reorderIndicatorUpViewChild()).nativeElement.style.display = 'none';
            (<ElementRef>this.reorderIndicatorDownViewChild()).nativeElement.style.display = 'none';
            (this.draggedColumn as any).draggable = false;
            this.draggedColumn = null;
            this.dropPosition = null;
        }
    }

    handleRowClick(event: any) {
        let targetNode = (<HTMLElement>event.originalEvent.target).nodeName;
        if (targetNode == 'INPUT' || targetNode == 'BUTTON' || targetNode == 'A' || isClickable(event.originalEvent.target)) {
            return;
        }

        if (this.selectionMode()) {
            this.preventSelectionSetterPropagation = true;
            let rowNode = event.rowNode;
            let selected = this.isSelected((<any>rowNode).node);
            let metaSelection = this.rowTouched ? false : this.metaKeySelection();
            let dataKeyValue = this.dataKey() ? String(resolveFieldData((<TreeTableNode>rowNode.node).data, this.dataKey())) : null;

            if (metaSelection) {
                let keyboardEvent = <KeyboardEvent>event.originalEvent;
                let metaKey = keyboardEvent.metaKey || keyboardEvent.ctrlKey;

                if (selected && metaKey) {
                    if (this.isSingleSelectionMode()) {
                        this._selection.set(null);
                        this.selectedKeys = {};
                        this.selectionChange.emit(null);
                    } else {
                        let selectionIndex = this.findIndexInSelection(rowNode.node);
                        this._selection.set(this._selection().filter((val: TreeTableNode, i: number) => i != selectionIndex));
                        this.selectionChange.emit(this._selection());
                        if (dataKeyValue) {
                            delete this.selectedKeys[dataKeyValue];
                        }
                    }

                    this.onNodeUnselect.emit({
                        originalEvent: event.originalEvent,
                        node: <TreeTableNode>rowNode.node,
                        type: 'row'
                    });
                } else {
                    if (this.isSingleSelectionMode()) {
                        this._selection.set(rowNode.node);
                        this.selectionChange.emit(rowNode.node);
                        if (dataKeyValue) {
                            this.selectedKeys = {};
                            this.selectedKeys[dataKeyValue] = 1;
                        }
                    } else if (this.isMultipleSelectionMode()) {
                        if (metaKey) {
                            this._selection.set(this._selection() || []);
                        } else {
                            this._selection.set([]);
                            this.selectedKeys = {};
                        }

                        this._selection.set([...this._selection(), rowNode.node]);
                        this.selectionChange.emit(this._selection());
                        if (dataKeyValue) {
                            this.selectedKeys[dataKeyValue] = 1;
                        }
                    }

                    this.onNodeSelect.emit({
                        originalEvent: event.originalEvent,
                        node: rowNode.node,
                        type: 'row',
                        index: (<any>event).rowIndex
                    });
                }
            } else {
                if (this.selectionMode() === 'single') {
                    if (selected) {
                        this._selection.set(null);
                        this.selectedKeys = {};
                        this.selectionChange.emit(this._selection());
                        this.onNodeUnselect.emit({
                            originalEvent: event.originalEvent,
                            node: <TreeTableNode>rowNode.node,
                            type: 'row'
                        });
                    } else {
                        this._selection.set(rowNode.node);
                        this.selectionChange.emit(this._selection());
                        this.onNodeSelect.emit({
                            originalEvent: event.originalEvent,
                            node: rowNode.node,
                            type: 'row',
                            index: event.rowIndex
                        });
                        if (dataKeyValue) {
                            this.selectedKeys = {};
                            this.selectedKeys[dataKeyValue] = 1;
                        }
                    }
                } else if (this.selectionMode() === 'multiple') {
                    if (selected) {
                        let selectionIndex = this.findIndexInSelection(rowNode.node);
                        this._selection.set(this._selection().filter((val: TreeTableNode, i: number) => i != selectionIndex));
                        this.selectionChange.emit(this._selection());
                        this.onNodeUnselect.emit({
                            originalEvent: event.originalEvent,
                            node: rowNode.node,
                            type: 'row'
                        });
                        if (dataKeyValue) {
                            delete this.selectedKeys[dataKeyValue];
                        }
                    } else {
                        this._selection.set(this._selection() ? [...this._selection(), rowNode.node] : [rowNode.node]);
                        this.selectionChange.emit(this._selection());
                        this.onNodeSelect.emit({
                            originalEvent: event.originalEvent,
                            node: rowNode.node,
                            type: 'row',
                            index: event.rowIndex
                        });
                        if (dataKeyValue) {
                            this.selectedKeys[dataKeyValue] = 1;
                        }
                    }
                }
            }

            this.tableService.onSelectionChange();
        }

        this.rowTouched = false;
    }

    handleRowTouchEnd(event: Event) {
        this.rowTouched = true;
    }

    handleRowRightClick(event: any) {
        if (this.contextMenu()) {
            const node = event.rowNode.node;

            const showContextMenu = () => {
                this.contextMenu().show(event.originalEvent);
                this.contextMenu().hideCallback = () => {
                    this.$contextMenuSelection.set(null);
                    this.contextMenuSelectionChange.emit(null);
                    this.tableService.onContextMenu(null);
                };
            };

            if (this.contextMenuSelectionMode() === 'separate') {
                this.$contextMenuSelection.set(node);
                this.contextMenuSelectionChange.emit(node);
                this.tableService.onContextMenu(node);
                showContextMenu();
                this.onContextMenuSelect.emit({ originalEvent: event.originalEvent, node: node });
            } else if (this.contextMenuSelectionMode() === 'joint') {
                this.preventSelectionSetterPropagation = true;
                let selected = this.isSelected(node);
                let dataKeyValue = this.dataKey() ? String(resolveFieldData(node.data, this.dataKey())) : null;

                if (!selected) {
                    if (this.isSingleSelectionMode()) {
                        this._selection.set(node);
                        this.selectionChange.emit(node);
                    } else if (this.isMultipleSelectionMode()) {
                        this._selection.set([node]);
                        this.selectionChange.emit(this._selection());
                    }

                    if (dataKeyValue) {
                        this.selectedKeys[dataKeyValue] = 1;
                    }
                }

                this.$contextMenuSelection.set(node);
                this.contextMenuSelectionChange.emit(node);
                this.tableService.onContextMenu(node);

                showContextMenu();
                this.onContextMenuSelect.emit({ originalEvent: event.originalEvent, node: node });
            }
        }
    }

    toggleNodeWithCheckbox(event: any) {
        // legacy selection support, will be removed in v18
        this._selection.set(this._selection() || []);
        this.preventSelectionSetterPropagation = true;
        let node = event.rowNode.node;
        let selected = this.isSelected(node);

        if (selected) {
            this.propagateSelectionDown(node, false);
            if (event.rowNode.parent) {
                this.propagateSelectionUp(node.parent, false);
            }
            this.selectionChange.emit(this._selection());
            this.onNodeUnselect.emit({ originalEvent: event, node: node });
        } else {
            this.propagateSelectionDown(node, true);
            if (event.rowNode.parent) {
                this.propagateSelectionUp(node.parent, true);
            }
            this.selectionChange.emit(this._selection());
            this.onNodeSelect.emit({ originalEvent: event, node: node });
        }

        this.tableService.onSelectionChange();
    }

    toggleNodesWithCheckbox(event: Event, check: boolean) {
        // legacy selection support, will be removed in v18
        let data = this.filteredNodes() || this._value();
        this._selection.set(check && data ? data.slice() : []);

        this.toggleAll(check);

        if (!check) {
            this._selection.set([]);
            this.selectedKeys = {};
        }

        this.preventSelectionSetterPropagation = true;
        this.selectionChange.emit(this._selection());
        this.tableService.onSelectionChange();

        this.onHeaderCheckboxToggle.emit({ originalEvent: event, checked: check });
    }

    toggleAll(checked: boolean) {
        let data = this.filteredNodes() || this._value();

        if (!this._selectionKeys()) {
            if (data && data.length) {
                for (let node of data) {
                    this.propagateSelectionDown(node, checked);
                }
            }
        } else {
            // legacy selection support, will be removed in v18
            if (data && data.length) {
                for (let node of data) {
                    this.propagateDown(node, checked);
                }
                this.selectionKeysChange.emit(this._selectionKeys());
            }
        }
    }

    propagateSelectionUp(node: TreeTableNode, select: boolean) {
        // legacy selection support, will be removed in v18
        if (node.children && node.children.length) {
            let selectedChildCount: number = 0;
            let childPartialSelected: boolean = false;
            let dataKeyValue = this.dataKey() ? String(resolveFieldData(node.data, this.dataKey())) : null;

            for (let child of node.children) {
                if (this.isSelected(child)) selectedChildCount++;
                else if (child.partialSelected) childPartialSelected = true;
            }

            if (select && selectedChildCount == node.children.length) {
                this._selection.set([...(this._selection() || []), node]);
                node.partialSelected = false;
                if (dataKeyValue) {
                    this.selectedKeys[dataKeyValue] = 1;
                }
            } else {
                if (!select) {
                    let index = this.findIndexInSelection(node);
                    if (index >= 0) {
                        this._selection.set(this._selection().filter((val: any, i: number) => i != index));

                        if (dataKeyValue) {
                            delete this.selectedKeys[dataKeyValue];
                        }
                    }
                }

                if (childPartialSelected || (selectedChildCount > 0 && selectedChildCount != node.children.length)) node.partialSelected = true;
                else node.partialSelected = false;
            }
        }

        let parent = node.parent;
        node.checked = select;
        if (parent) {
            this.propagateSelectionUp(parent, select);
        }
    }

    propagateSelectionDown(node: TreeTableNode, select: boolean) {
        // legacy selection support, will be removed in v18
        let index = this.findIndexInSelection(node);
        let dataKeyValue = this.dataKey() ? String(resolveFieldData(node.data, this.dataKey())) : null;

        if (select && index == -1) {
            this._selection.set([...(this._selection() || []), node]);
            if (dataKeyValue) {
                this.selectedKeys[dataKeyValue] = 1;
            }
        } else if (!select && index > -1) {
            this._selection.set(this._selection().filter((val: any, i: number) => i != index));
            if (dataKeyValue) {
                delete this.selectedKeys[dataKeyValue];
            }
        }

        node.partialSelected = false;
        node.checked = select;

        if (node.children && node.children.length) {
            for (let child of node.children) {
                this.propagateSelectionDown(child, select);
            }
        }
    }

    isSelected(node: TreeTableNode) {
        // legacy selection support, will be removed in v18
        if (node && this._selection()) {
            if (this.dataKey()) {
                if (node.hasOwnProperty('checked')) {
                    return node['checked'];
                } else {
                    return this.selectedKeys[resolveFieldData(node.data, this.dataKey())] !== undefined;
                }
            } else {
                if (Array.isArray(this._selection())) return this.findIndexInSelection(node) > -1;
                else return this.equals(node, this._selection());
            }
        }

        return false;
    }

    isNodeSelected(node) {
        return this.selectionMode() && this._selectionKeys() ? this._selectionKeys()[this.nodeKey(node)]?.checked === true : false;
    }

    isNodePartialSelected(node) {
        return this.selectionMode() && this._selectionKeys() ? this._selectionKeys()[this.nodeKey(node)]?.partialChecked === true : false;
    }

    nodeKey(node) {
        return resolveFieldData(node, this.dataKey()) || resolveFieldData(node?.data, this.dataKey());
    }

    toggleCheckbox(event) {
        let { rowNode, check, originalEvent } = event;
        let node = rowNode.node;
        if (this._selectionKeys()) {
            this.propagateDown(node, check);
            if (node.parent) {
                this.propagateUp(node.parent, check);
            }

            this.selectionKeysChange.emit(this._selectionKeys());
        } else {
            this.toggleNodeWithCheckbox({ originalEvent, rowNode });
        }

        this.tableService.onSelectionChange();
    }

    propagateDown(node, check) {
        if (check) {
            this._selectionKeys()[this.nodeKey(node)] = { checked: true, partialChecked: false };
        } else {
            delete this._selectionKeys()[this.nodeKey(node)];
        }

        if (node.children && node.children.length) {
            for (let child of node.children) {
                this.propagateDown(child, check);
            }
        }
    }

    propagateUp(node, check) {
        let checkedChildCount = 0;
        let childPartialSelected = false;

        for (let child of node.children) {
            if (this._selectionKeys()[this.nodeKey(child)] && this._selectionKeys()[this.nodeKey(child)].checked) checkedChildCount++;
            else if (this._selectionKeys()[this.nodeKey(child)] && this._selectionKeys()[this.nodeKey(child)].partialChecked) childPartialSelected = true;
        }

        if (check && checkedChildCount === node.children.length) {
            this._selectionKeys()[this.nodeKey(node)] = { checked: true, partialChecked: false };
        } else {
            if (!check) {
                delete this._selectionKeys()[this.nodeKey(node)];
            }

            if (childPartialSelected || (checkedChildCount > 0 && checkedChildCount !== node.children.length)) this._selectionKeys()[this.nodeKey(node)] = { checked: false, partialChecked: true };
            else this._selectionKeys()[this.nodeKey(node)] = { checked: false, partialChecked: false };
        }

        let parent = node.parent;
        if (parent) {
            this.propagateUp(parent, check);
        }
    }

    findIndexInSelection(node: any) {
        let index: number = -1;
        if (this._selection() && this._selection().length) {
            for (let i = 0; i < this._selection().length; i++) {
                if (this.equals(node, this._selection()[i])) {
                    index = i;
                    break;
                }
            }
        }

        return index;
    }

    isSingleSelectionMode() {
        return this.selectionMode() === 'single';
    }

    isMultipleSelectionMode() {
        return this.selectionMode() === 'multiple';
    }

    equals(node1: TreeTableNode, node2: TreeTableNode) {
        return this.compareSelectionBy() === 'equals' ? equals(node1, node2) : equals(node1.data, node2.data, this.dataKey());
    }

    filter(value: string | string[], field: string, matchMode: string) {
        if (this.filterTimeout) {
            clearTimeout(this.filterTimeout);
        }

        if (!this.isFilterBlank(value)) {
            this.$filters()[field] = { value: value, matchMode: matchMode };
        } else if (this.$filters()[field]) {
            delete this.$filters()[field];
        }

        this.filterTimeout = setTimeout(() => {
            this._filter();
            this.filterTimeout = null;
        }, this.filterDelay());
    }

    filterGlobal(value: string, matchMode: string) {
        this.filter(value, 'global', matchMode);
    }

    isFilterBlank(filter: any): boolean {
        if (filter !== null && filter !== undefined) {
            if ((typeof filter === 'string' && filter.trim().length == 0) || (Array.isArray(filter) && filter.length == 0)) return true;
            else return false;
        }
        return true;
    }

    _filter() {
        if (this.lazy()) {
            this.onLazyLoad.emit(this.createLazyLoadMetadata());
        } else {
            if (!this._value()) {
                return;
            }

            if (!this.hasFilter()) {
                this.filteredNodes.set(null);
                if (this.paginator()) {
                    this.setTotalRecords(this._value() ? this._value()!.length : 0);
                }
            } else {
                let globalFilterFieldsArray;
                if (this.$filters()['global']) {
                    if (!this.columns() && !this.globalFilterFields()) throw new Error('Global filtering requires dynamic columns or globalFilterFields to be defined.');
                    else globalFilterFieldsArray = this.globalFilterFields() || this.columns();
                }

                let filteredNodes: any[] | null = [];
                const isStrictMode = this.filterMode() === 'strict';
                let isValueChanged = false;

                for (let node of this._value()!) {
                    let copyNode = { ...node };
                    let localMatch = true;
                    let globalMatch = false;
                    let paramsWithoutNode;

                    for (let prop in this.$filters()) {
                        if (this.$filters().hasOwnProperty(prop) && prop !== 'global') {
                            let filterMeta = <FilterMetadata>this.$filters()[prop];
                            let filterField = prop;
                            let filterValue = filterMeta.value;
                            let filterMatchMode = filterMeta.matchMode || 'startsWith';
                            let filterConstraint = (<any>this.filterService).filters[filterMatchMode];
                            paramsWithoutNode = { filterField, filterValue, filterConstraint, isStrictMode };
                            if (
                                (isStrictMode && !(this.findFilteredNodes(copyNode, paramsWithoutNode) || this.isFilterMatched(copyNode, paramsWithoutNode))) ||
                                (!isStrictMode && !(this.isFilterMatched(copyNode, paramsWithoutNode) || this.findFilteredNodes(copyNode, paramsWithoutNode)))
                            ) {
                                localMatch = false;
                            }

                            if (!localMatch) {
                                break;
                            }
                        }
                    }

                    if (this.$filters()['global'] && !globalMatch && globalFilterFieldsArray) {
                        let copyNodeForGlobal = { ...copyNode };
                        let filterField = undefined;
                        let filterValue = this.$filters()['global']!.value;
                        let filterConstraint = (<any>this.filterService).filters[(<any>this.$filters())['global'].matchMode];
                        paramsWithoutNode = {
                            filterField,
                            filterValue,
                            filterConstraint,
                            isStrictMode,
                            globalFilterFieldsArray
                        };

                        if (
                            (isStrictMode && (this.findFilteredNodes(copyNodeForGlobal, paramsWithoutNode) || this.isFilterMatched(copyNodeForGlobal, paramsWithoutNode))) ||
                            (!isStrictMode && (this.isFilterMatched(copyNodeForGlobal, paramsWithoutNode) || this.findFilteredNodes(copyNodeForGlobal, paramsWithoutNode)))
                        ) {
                            globalMatch = true;
                            copyNode = copyNodeForGlobal;
                        }
                    }

                    let matches = localMatch;
                    if (this.$filters()['global']) {
                        matches = localMatch && globalMatch;
                    }

                    if (matches) {
                        filteredNodes!.push(copyNode);
                    }

                    isValueChanged = isValueChanged || !localMatch || globalMatch || (localMatch && filteredNodes!.length > 0) || (!globalMatch && filteredNodes!.length === 0);
                }

                if (!isValueChanged) {
                    filteredNodes = null;
                }

                this.filteredNodes.set(filteredNodes);

                if (this.paginator()) {
                    this.setTotalRecords(filteredNodes ? filteredNodes.length : this._value() ? this._value()!.length : 0);
                }
            }
            this.cd.markForCheck();
        }

        this.$first.set(0);

        const filteredValue = this.filteredNodes() || this._value();

        this.onFilter.emit({
            filters: this.$filters(),
            filteredValue: filteredValue
        });

        this.tableService.onUIUpdate(filteredValue);
        this.updateSerializedValue();

        if (this.scrollable()) {
            this.resetScrollTop();
        }
    }

    findFilteredNodes(node: TreeTableNode, paramsWithoutNode: any) {
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
                return true;
            }
        }
    }

    isFilterMatched(node: TreeTableNode, filterOptions: TreeTableFilterOptions) {
        let { filterField, filterValue, filterConstraint, isStrictMode, globalFilterFieldsArray } = <any>filterOptions;
        let matched = false;
        const isMatched = (field: string) => filterConstraint(resolveFieldData(node.data, field), filterValue, <string>this.filterLocale());

        matched = globalFilterFieldsArray?.length ? globalFilterFieldsArray.some((globalFilterField) => isMatched(globalFilterField.field || globalFilterField)) : isMatched(filterField);

        if (!matched || (isStrictMode && !this.isNodeLeaf(node))) {
            matched =
                this.findFilteredNodes(node, {
                    filterField,
                    filterValue,
                    filterConstraint,
                    isStrictMode,
                    globalFilterFieldsArray
                }) || matched;
        }

        return matched;
    }

    isNodeLeaf(node: TreeTableNode) {
        return node.leaf === false ? false : !(node.children && node.children.length);
    }

    hasFilter() {
        let empty = true;
        for (let prop in this.$filters()) {
            if (this.$filters().hasOwnProperty(prop)) {
                empty = false;
                break;
            }
        }

        return !empty;
    }

    /**
     * Clears the sort and paginator state.
     * @group Method
     */
    public reset() {
        this._sortField.set(null);
        this._sortOrder.set(1);
        this._multiSortMeta.set(null);
        this.tableService.onSort(null);

        this.filteredNodes.set(null);
        this.$filters.set({});

        this.$first.set(0);

        if (this.lazy()) {
            this.onLazyLoad.emit(this.createLazyLoadMetadata());
        } else {
            this.setTotalRecords(this._value() ? this._value()!.length : 0);
        }
    }

    updateEditingCell(cell: any, data: any, field: string) {
        this.editingCell = cell;
        this.editingCellData = data;
        this.editingCellField = field;
        this.bindDocumentEditListener();
    }

    isEditingCellValid() {
        return this.editingCell && find(this.editingCell, '.ng-invalid.ng-dirty').length === 0;
    }

    bindDocumentEditListener() {
        if (!this.documentEditListener) {
            this.documentEditListener = this.renderer.listen(this.document, 'click', (event) => {
                if (this.editingCell && !this.editingCellClick && this.isEditingCellValid()) {
                    !this.$unstyled() && removeClass(this.editingCell, 'p-cell-editing');
                    this.editingCell = null;
                    this.onEditComplete.emit({ field: this.editingCellField, data: this.editingCellData });
                    this.editingCellField = null;
                    this.editingCellData = null;
                    this.unbindDocumentEditListener();
                }

                this.editingCellClick = false;
            });
        }
    }

    unbindDocumentEditListener() {
        if (this.documentEditListener) {
            this.documentEditListener();
            this.documentEditListener = null;
        }
    }
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: '[pTreeTableBody]',
    standalone: false,
    template: `
        @for (serializedNode of serializedNodes() || tt.serializedValue(); track tt.rowTrackBy()(rowIndex, serializedNode); let rowIndex = $index) {
            @if (serializedNode.visible) {
                <ng-container
                    *ngTemplateOutlet="
                        template();
                        context: {
                            $implicit: serializedNode,
                            node: serializedNode.node,
                            rowData: serializedNode.node.data,
                            columns: columns()
                        }
                    "
                ></ng-container>
            }
        }
        @if (tt.isEmpty()) {
            <ng-container *ngTemplateOutlet="tt.$emptyMessageTemplate(); context: { $implicit: columns(), frozen: frozen() }"></ng-container>
        }
    `,
    encapsulation: ViewEncapsulation.None,
    host: {
        '[attr.data-p]': 'dataP'
    }
})
export class TTBody extends BaseComponent {
    tt = inject(TreeTable);

    treeTableService = inject(TreeTableService);

    readonly columns = input<any[] | undefined>(undefined, { alias: 'pTreeTableBody' });

    readonly template = input<Nullable<TemplateRef<any>>>(undefined, { alias: 'pTreeTableBodyTemplate' });

    readonly frozen = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    readonly serializedNodes = input<any>();

    readonly scrollerOptions = input<any>();

    subscription: Subscription;

    get dataP() {
        return this.cn({
            hoverable: this.tt.rowHover() || this.tt.selectionMode(),
            frozen: this.frozen()
        });
    }

    constructor() {
        super();
        this.subscription = this.tt.tableService.uiUpdateSource$.subscribe(() => {
            if (this.tt.virtualScroll()) {
                this.cd.detectChanges();
            }
        });
    }

    onDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    getScrollerOption(option: any, options?: any) {
        if (this.tt.virtualScroll()) {
            options = options || this.scrollerOptions();
            return options ? options[option] : null;
        }

        return null;
    }

    getRowIndex(rowIndex: number) {
        const getItemOptions = this.getScrollerOption('getItemOptions');
        return getItemOptions ? getItemOptions(rowIndex).index : rowIndex;
    }
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: '[ttScrollableView]',
    standalone: false,
    template: `
        <div #scrollHeader [class]="cx('scrollableHeader')" [pBind]="ptm('scrollableHeader')">
            <div #scrollHeaderBox [class]="cx('scrollableHeaderBox')" [pBind]="ptm('scrollableHeaderBox')">
                <table [class]="cn(cx('scrollableHeaderTable'), tt.tableStyleClass())" [pBind]="ptm('scrollableHeaderTable')" [ngStyle]="tt.tableStyle()">
                    <ng-container *ngTemplateOutlet="frozen() ? tt.$frozenColGroupTemplate() || tt.$colGroupTemplate() : tt.$colGroupTemplate(); context: { $implicit: columns() }"></ng-container>
                    <thead role="rowgroup" [class]="cx('thead')" [pBind]="ptm('thead')">
                        <ng-container *ngTemplateOutlet="frozen() ? tt.$frozenHeaderTemplate() || tt.$headerTemplate() : tt.$headerTemplate(); context: { $implicit: columns() }"></ng-container>
                    </thead>
                </table>
            </div>
        </div>

        @if (tt.virtualScroll()) {
            <p-scroller
                #scroller
                [items]="tt.serializedValue()"
                [styleClass]="cx('scrollableBody')"
                [style]="{ height: tt.scrollHeight() !== 'flex' ? tt.scrollHeight() : undefined }"
                [scrollHeight]="scrollHeight() !== 'flex' ? undefined : '100%'"
                [itemSize]="tt.virtualScrollItemSize() || tt._virtualRowHeight()"
                [lazy]="tt.lazy()"
                (onLazyLoad)="tt.onLazyItemLoad($event)"
                [options]="tt.virtualScrollOptions()"
                [pt]="ptm('virtualScroller')"
            >
                <ng-template #content let-items let-scrollerOptions="options">
                    <ng-container *ngTemplateOutlet="buildInItems; context: { $implicit: items, options: scrollerOptions }"></ng-container>
                </ng-template>
                @if (tt.$loaderTemplate()) {
                    <ng-template #loader let-scrollerOptions="options">
                        <ng-container *ngTemplateOutlet="tt.$loaderTemplate(); context: { options: scrollerOptions }"></ng-container>
                    </ng-template>
                }
            </p-scroller>
        }
        @if (!tt.virtualScroll()) {
            <div
                #scrollBody
                [class]="cx('scrollableBody')"
                [pBind]="ptm('scrollableBody')"
                [ngStyle]="{
                    'max-height': tt.scrollHeight() !== 'flex' ? scrollHeight() : undefined,
                    'overflow-y': !frozen() && tt.scrollHeight() ? 'scroll' : undefined
                }"
            >
                <ng-container *ngTemplateOutlet="buildInItems; context: { $implicit: serializedValue, options: {} }"></ng-container>
            </div>
        }

        <ng-template #buildInItems let-items let-scrollerOptions="options">
            <table role="treegrid" #scrollTable [pBind]="ptm('table')" [class]="tt.tableStyleClass()" [ngClass]="scrollerOptions.contentStyleClass" [ngStyle]="tt.tableStyle()" [style]="scrollerOptions.contentStyle">
                <ng-container *ngTemplateOutlet="frozen() ? tt.$frozenColGroupTemplate() || tt.$colGroupTemplate() : tt.$colGroupTemplate(); context: { $implicit: columns() }"></ng-container>
                <tbody
                    [pBind]="ptm('tbody')"
                    role="rowgroup"
                    [class]="cx('tbody')"
                    [pBind]="ptm('tbody')"
                    [pTreeTableBody]="columns()"
                    [unstyled]="unstyled()"
                    [pTreeTableBodyTemplate]="frozen() ? tt.$frozenBodyTemplate() || tt.$bodyTemplate() : tt.$bodyTemplate()"
                    [serializedNodes]="items"
                    [frozen]="frozen()"
                ></tbody>
            </table>
            @if (frozen()) {
                <div #scrollableAligner [style.background-color]="'transparent'"></div>
            }
        </ng-template>

        @if (tt.$footerTemplate()) {
            <div #scrollFooter [class]="cx('scrollableFooter')" [pBind]="ptm('scrollableFooter')">
                <div #scrollFooterBox [class]="cx('scrollableFooterBox')" [pBind]="ptm('scrollableFooterBox')">
                    <table [class]="cx('scrollableFooterTable')" [ngClass]="tt.tableStyleClass()" [ngStyle]="tt.tableStyle()" [pBind]="ptm('scrollableFooterTable')">
                        <ng-container *ngTemplateOutlet="frozen() ? tt.$frozenColGroupTemplate() || tt.$colGroupTemplate() : tt.$colGroupTemplate(); context: { $implicit: columns() }"></ng-container>
                        <tfoot role="rowgroup" [class]="cx('tfoot')" [pBind]="ptm('tfoot')">
                            <ng-container *ngTemplateOutlet="frozen() ? tt.$frozenFooterTemplate() || tt.$footerTemplate() : tt.$footerTemplate(); context: { $implicit: columns() }"></ng-container>
                        </tfoot>
                    </table>
                </div>
            </div>
        }
    `,
    encapsulation: ViewEncapsulation.None,
    providers: [TreeTableStyle]
})
export class TTScrollableView extends BaseComponent {
    tt = inject(TreeTable);

    zone = inject(NgZone);

    _componentStyle = inject(TreeTableStyle);

    readonly columns = input<any[] | undefined>(undefined, { alias: 'ttScrollableView' });

    readonly frozen = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    readonly scrollHeight = input<string | undefined | null>();

    readonly scrollHeaderViewChild = viewChild.required<ElementRef>('scrollHeader');

    readonly scrollHeaderBoxViewChild = viewChild.required<ElementRef>('scrollHeaderBox');

    readonly scrollBodyViewChild = viewChild<Nullable<ElementRef>>('scrollBody');

    readonly scrollFooterViewChild = viewChild<Nullable<ElementRef>>('scrollFooter');

    readonly scrollFooterBoxViewChild = viewChild<Nullable<ElementRef>>('scrollFooterBox');

    readonly scrollableAlignerViewChild = viewChild<Nullable<ElementRef>>('scrollableAligner');

    readonly scroller = viewChild<Nullable<Scroller>>('scroller');

    hostName = 'TreeTable';

    headerScrollListener: VoidListener;

    bodyScrollListener: VoidListener;

    footerScrollListener: VoidListener;

    frozenSiblingBody: Nullable<Element>;

    totalRecordsSubscription: Nullable<Subscription>;

    preventBodyScrollPropagation: boolean | undefined;

    /**
     * Warns about removed percentage scroll heights whenever the `scrollHeight` input changes,
     * replacing the legacy setter side effect.
     */
    private readonly scrollHeightEffect = effect(() => {
        const scrollHeight = this.scrollHeight();

        if (scrollHeight != null && (scrollHeight.includes('%') || scrollHeight.includes('calc'))) {
            untracked(() => console.log('Percentage scroll height calculation is removed in favor of the more performant CSS based flex mode, use scrollHeight="flex" instead.'));
        }
    });

    constructor() {
        super();

        afterNextRender(() => {
            if (isPlatformBrowser(this.platformId)) {
                if (!this.frozen()) {
                    if (this.tt.frozenColumns() || this.tt.$frozenBodyTemplate()) {
                        addClass(this.el.nativeElement, 'p-treetable-unfrozen-view');
                    }

                    let frozenView = this.el.nativeElement.previousElementSibling;
                    if (frozenView) {
                        if (this.tt.virtualScroll()) this.frozenSiblingBody = findSingle(frozenView, '[data-pc-name="virtualscroller"]');
                        else this.frozenSiblingBody = findSingle(frozenView, '[data-pc-section="scrollablebody"]');
                    }

                    if (this.scrollHeight()) {
                        let scrollBarWidth = calculateScrollbarWidth();
                        this.scrollHeaderBoxViewChild().nativeElement.style.paddingRight = scrollBarWidth + 'px';

                        const scrollFooterBoxViewChild = this.scrollFooterBoxViewChild();
                        if (scrollFooterBoxViewChild && scrollFooterBoxViewChild.nativeElement) {
                            scrollFooterBoxViewChild.nativeElement.style.paddingRight = scrollBarWidth + 'px';
                        }
                    }
                } else {
                    const scrollableAlignerViewChild = this.scrollableAlignerViewChild();
                    if (scrollableAlignerViewChild && scrollableAlignerViewChild.nativeElement) {
                        scrollableAlignerViewChild.nativeElement.style.height = calculateScrollbarHeight() + 'px';
                    }
                }

                this.bindEvents();
            }
        });
    }

    onDestroy() {
        this.unbindEvents();

        this.frozenSiblingBody = null;
    }

    bindEvents() {
        if (isPlatformBrowser(this.platformId)) {
            this.zone.runOutsideAngular(() => {
                this.headerScrollListener = this.renderer.listen(this.scrollHeaderBoxViewChild().nativeElement, 'scroll', this.onHeaderScroll.bind(this));

                const scrollFooterViewChild = this.scrollFooterViewChild();
                if (scrollFooterViewChild && scrollFooterViewChild.nativeElement) {
                    this.footerScrollListener = this.renderer.listen(scrollFooterViewChild.nativeElement, 'scroll', this.onFooterScroll.bind(this));
                }

                if (!this.frozen()) {
                    if (this.tt.virtualScroll()) {
                        this.bodyScrollListener = this.renderer.listen((this.scroller()?.getElementRef() as ElementRef).nativeElement, 'scroll', this.onBodyScroll.bind(this));
                    } else {
                        this.bodyScrollListener = this.renderer.listen(this.scrollBodyViewChild()?.nativeElement, 'scroll', this.onBodyScroll.bind(this));
                    }
                }
            });
        }
    }

    unbindEvents() {
        if (isPlatformBrowser(this.platformId)) {
            if (this.headerScrollListener) {
                this.headerScrollListener();
                this.headerScrollListener = null;
            }

            const scrollFooterViewChild = this.scrollFooterViewChild();
            if (scrollFooterViewChild && scrollFooterViewChild.nativeElement) {
                if (this.footerScrollListener) {
                    this.footerScrollListener();
                    this.footerScrollListener = null;
                }
            }

            const scrollBodyViewChild = this.scrollBodyViewChild();
            if (scrollBodyViewChild && scrollBodyViewChild.nativeElement) {
                if (this.bodyScrollListener) {
                    this.bodyScrollListener();
                    this.bodyScrollListener = null;
                }
            }

            const scroller = this.scroller();
            if (scroller && scroller.getElementRef()) {
                if (this.bodyScrollListener) {
                    this.bodyScrollListener();
                    this.bodyScrollListener = null;
                }
            }
        }
    }

    onHeaderScroll() {
        const scrollLeft = this.scrollHeaderViewChild().nativeElement.scrollLeft;

        (this.scrollBodyViewChild() as ElementRef).nativeElement.scrollLeft = scrollLeft;

        const scrollFooterViewChild = this.scrollFooterViewChild();
        if (scrollFooterViewChild && scrollFooterViewChild.nativeElement) {
            scrollFooterViewChild.nativeElement.scrollLeft = scrollLeft;
        }

        this.preventBodyScrollPropagation = true;
    }

    onFooterScroll() {
        const scrollLeft = this.scrollFooterViewChild()?.nativeElement.scrollLeft;
        (this.scrollBodyViewChild() as ElementRef).nativeElement.scrollLeft = scrollLeft;

        this.scrollHeaderViewChild().nativeElement.scrollLeft = scrollLeft;

        this.preventBodyScrollPropagation = true;
    }

    onBodyScroll(event: any) {
        if (this.preventBodyScrollPropagation) {
            this.preventBodyScrollPropagation = false;
            return;
        }

        (this.scrollHeaderBoxViewChild() as ElementRef).nativeElement.style.marginLeft = -1 * event.target.scrollLeft + 'px';

        const scrollFooterViewChild = this.scrollFooterViewChild();
        if (scrollFooterViewChild && scrollFooterViewChild.nativeElement) {
            (this.scrollFooterBoxViewChild() as ElementRef).nativeElement.style.marginLeft = -1 * event.target.scrollLeft + 'px';
        }

        if (this.frozenSiblingBody) {
            this.frozenSiblingBody.scrollTop = event.target.scrollTop;
        }
    }

    scrollToVirtualIndex(index: number): void {
        const scroller = this.scroller();
        if (scroller) {
            scroller.scrollToIndex(index);
        }
    }

    scrollTo(options: ScrollToOptions): void {
        const scroller = this.scroller();
        if (scroller) {
            scroller.scrollTo(options);
        } else {
            const scrollBodyViewChild = this.scrollBodyViewChild();
            if (scrollBodyViewChild?.nativeElement.scrollTo) {
                scrollBodyViewChild.nativeElement.scrollTo(options);
            } else {
                (scrollBodyViewChild as ElementRef).nativeElement.scrollLeft = options.left;
                (scrollBodyViewChild as ElementRef).nativeElement.scrollTop = options.top;
            }
        }
    }
}

@Directive({
    selector: '[ttSortableColumn]',
    standalone: false,
    host: {
        '[class]': 'cx("sortableColumn")',
        '[tabindex]': 'isEnabled() ? "0" : null',
        role: 'columnheader',
        '[attr.aria-sort]': 'ariaSorted'
    },
    providers: [TreeTableStyle],
    hostDirectives: [Bind]
})
export class TTSortableColumn extends BaseComponent {
    tt = inject(TreeTable);

    bindDirectiveInstance = inject(Bind, { self: true });

    _componentStyle = inject(TreeTableStyle);

    readonly field = input<string | undefined>(undefined, { alias: 'ttSortableColumn' });

    readonly ttSortableColumnDisabled = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    hostName = 'TreeTable ';

    readonly sorted = signal<boolean | undefined>(undefined);

    subscription: Subscription | undefined;

    get ariaSorted() {
        if (this.sorted() && this.tt._sortOrder() < 0) return 'descending';
        else if (this.sorted() && this.tt._sortOrder() > 0) return 'ascending';
        else return 'none';
    }

    constructor() {
        super();

        afterEveryRender(() => {
            this.bindDirectiveInstance.setAttrs(this.ptm('sortableColumn', { context: { sorted: this.sorted() } }));
        });

        if (this.isEnabled()) {
            this.subscription = this.tt.tableService.sortSource$.subscribe((sortMeta) => {
                this.updateSortState();
            });
        }
    }

    onInit() {
        if (this.isEnabled()) {
            this.updateSortState();
        }
    }

    onDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    updateSortState() {
        this.sorted.set(this.tt.isSorted(<string>this.field()) as boolean);
    }

    @HostListener('click', ['$event'])
    onClick(event: MouseEvent) {
        if (this.isEnabled()) {
            this.updateSortState();
            this.tt.sort({
                originalEvent: event,
                field: this.field()
            });

            clearSelection();
        }
    }

    @HostListener('keydown.enter', ['$event'])
    onEnterKey(event: MouseEvent) {
        this.onClick(event);
    }

    isEnabled() {
        return this.ttSortableColumnDisabled() !== true;
    }
}

@Component({
    selector: 'p-treeTableSortIcon, p-treetable-sort-icon, p-tree-table-sort-icon',
    standalone: false,
    template: `
        @if (!tt.$sortIconTemplate()) {
            @if (sortOrder() === 0) {
                <svg data-p-icon="sort-alt" [class]="cx('sortableColumnIcon')" [pBind]="ptm('sortableColumnIcon')" />
            }
            @if (sortOrder() === 1) {
                <svg data-p-icon="sort-amount-up-alt" [class]="cx('sortableColumnIcon')" [pBind]="ptm('sortableColumnIcon')" />
            }
            @if (sortOrder() === -1) {
                <svg data-p-icon="sort-amount-down" [class]="cx('sortableColumnIcon')" [pBind]="ptm('sortableColumnIcon')" />
            }
        }
        @if (tt.$sortIconTemplate()) {
            <span [class]="cx('sortableColumnIcon')" [pBind]="ptm('sortableColumnIcon')">
                <ng-template *ngTemplateOutlet="tt.$sortIconTemplate(); context: { $implicit: sortOrder() }"></ng-template>
            </span>
        }
        @if (isMultiSorted()) {
            <p-badge [class]="cx('sortableColumnBadge')" [value]="getBadgeValue()" size="small" [pt]="ptm('pcSortableColumnBadge')" [unstyled]="unstyled()"></p-badge>
        }
    `,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [TreeTableStyle]
})
export class TTSortIcon extends BaseComponent {
    tt = inject(TreeTable);

    cd = inject(ChangeDetectorRef);

    _componentStyle = inject(TreeTableStyle);

    readonly field = input<string | undefined>();

    hostName = 'TreeTable';

    subscription: Subscription | undefined;

    readonly sortOrder = signal<number | undefined>(undefined);

    constructor() {
        super();
        this.subscription = this.tt.tableService.sortSource$.subscribe((sortMeta) => {
            this.updateSortState();
            this.cd.markForCheck();
        });
    }

    onInit() {
        this.updateSortState();
    }

    onDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    onClick(event: Event) {
        event.preventDefault();
    }

    getMultiSortMetaIndex() {
        let multiSortMeta = this.tt._multiSortMeta();
        let index = -1;

        if (multiSortMeta && this.tt.sortMode() === 'multiple' && multiSortMeta.length > 1) {
            for (let i = 0; i < multiSortMeta.length; i++) {
                let meta = multiSortMeta[i];
                if (meta.field === this.field() || meta.field === this.field()) {
                    index = i;
                    break;
                }
            }
        }

        return index;
    }

    updateSortState() {
        if (this.tt.sortMode() === 'single') {
            this.sortOrder.set(this.tt.isSorted(<string>this.field()) ? this.tt._sortOrder() : 0);
        } else if (this.tt.sortMode() === 'multiple') {
            let sortMeta = this.tt.getSortMeta(<string>this.field());
            this.sortOrder.set(sortMeta ? sortMeta.order : 0);
        }
    }

    getBadgeValue() {
        return this.getMultiSortMetaIndex() + 1;
    }

    isMultiSorted() {
        return this.tt.sortMode() === 'multiple' && this.getMultiSortMetaIndex() > -1;
    }
}

@Directive({
    selector: '[ttResizableColumn]',
    standalone: false
})
export class TTResizableColumn extends BaseComponent {
    tt = inject(TreeTable);

    zone = inject(NgZone);

    readonly ttResizableColumnDisabled = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    hostName = 'TreeTable';

    resizer: HTMLSpanElement | undefined;

    resizerMouseDownListener: VoidListener;

    documentMouseMoveListener: VoidListener;

    documentMouseUpListener: VoidListener;

    constructor() {
        super();

        afterNextRender(() => {
            if (isPlatformBrowser(this.platformId)) {
                if (this.isEnabled()) {
                    addClass(this.el.nativeElement, 'p-resizable-column');
                    this.resizer = this.renderer.createElement('span');
                    !this.$unstyled() && this.renderer.addClass(this.resizer, 'p-column-resizer');
                    (this.resizer as HTMLElement).setAttribute('data-pc-section', 'columnresizer');
                    this.renderer.appendChild(this.el.nativeElement, this.resizer);

                    this.zone.runOutsideAngular(() => {
                        this.resizerMouseDownListener = this.renderer.listen(this.resizer, 'mousedown', this.onMouseDown.bind(this));
                    });
                }
            }
        });
    }

    onDestroy() {
        if (this.resizerMouseDownListener) {
            this.resizerMouseDownListener();
            this.resizerMouseDownListener = null;
        }

        this.unbindDocumentEvents();
    }

    bindDocumentEvents() {
        this.zone.runOutsideAngular(() => {
            this.documentMouseMoveListener = this.renderer.listen(this.document, 'mousemove', this.onDocumentMouseMove.bind(this));
            this.documentMouseUpListener = this.renderer.listen(this.document, 'mouseup', this.onDocumentMouseUp.bind(this));
        });
    }

    unbindDocumentEvents() {
        if (this.documentMouseMoveListener) {
            this.documentMouseMoveListener();
            this.documentMouseMoveListener = null;
        }

        if (this.documentMouseUpListener) {
            this.documentMouseUpListener();
            this.documentMouseUpListener = null;
        }
    }

    onMouseDown(event: MouseEvent) {
        this.tt.onColumnResizeBegin(event);
        this.bindDocumentEvents();
    }

    onDocumentMouseMove(event: MouseEvent) {
        this.tt.onColumnResize(event);
    }

    onDocumentMouseUp(event: MouseEvent) {
        this.tt.onColumnResizeEnd(event, this.el.nativeElement);
        this.unbindDocumentEvents();
    }

    isEnabled() {
        return this.ttResizableColumnDisabled() !== true;
    }
}

@Directive({
    selector: '[ttReorderableColumn]',
    standalone: false
})
export class TTReorderableColumn extends BaseComponent {
    tt = inject(TreeTable);

    zone = inject(NgZone);

    readonly ttReorderableColumnDisabled = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    hostName = 'TreeTable';

    dragStartListener: VoidListener;

    dragOverListener: VoidListener;

    dragEnterListener: VoidListener;

    dragLeaveListener: VoidListener;

    mouseDownListener: VoidListener;

    constructor() {
        super();

        afterNextRender(() => {
            if (this.isEnabled()) {
                this.bindEvents();
            }
        });
    }

    onDestroy() {
        this.unbindEvents();
    }

    bindEvents() {
        if (isPlatformBrowser(this.platformId)) {
            this.zone.runOutsideAngular(() => {
                this.mouseDownListener = this.renderer.listen(this.el.nativeElement, 'mousedown', this.onMouseDown.bind(this));
                this.dragStartListener = this.renderer.listen(this.el.nativeElement, 'dragstart', this.onDragStart.bind(this));
                this.dragOverListener = this.renderer.listen(this.el.nativeElement, 'dragover', this.onDragEnter.bind(this));
                this.dragEnterListener = this.renderer.listen(this.el.nativeElement, 'dragenter', this.onDragEnter.bind(this));
                this.dragLeaveListener = this.renderer.listen(this.el.nativeElement, 'dragleave', this.onDragLeave.bind(this));
            });
        }
    }

    unbindEvents() {
        if (isPlatformBrowser(this.platformId)) {
            if (this.mouseDownListener) {
                this.mouseDownListener();
                this.mouseDownListener = null;
            }

            if (this.dragOverListener) {
                this.dragOverListener();
                this.dragOverListener = null;
            }

            if (this.dragEnterListener) {
                this.dragEnterListener();
                this.dragEnterListener = null;
            }

            if (this.dragLeaveListener) {
                this.dragLeaveListener();
                this.dragLeaveListener = null;
            }
        }
    }

    onMouseDown(event: any) {
        if (event.target.nodeName === 'INPUT' || event.target.nodeName === 'TEXTAREA' || findSingle(event.target, '[data-pc-section="columnresizer"]')) this.el.nativeElement.draggable = false;
        else this.el.nativeElement.draggable = true;
    }

    onDragStart(event: DragEvent) {
        this.tt.onColumnDragStart(event, this.el.nativeElement);
    }

    onDragOver(event: DragEvent) {
        event.preventDefault();
    }

    onDragEnter(event: DragEvent) {
        this.tt.onColumnDragEnter(event, this.el.nativeElement);
    }

    onDragLeave(event: DragEvent) {
        this.tt.onColumnDragLeave(event);
    }

    @HostListener('drop', ['$event'])
    onDrop(event: DragEvent) {
        if (this.isEnabled()) {
            this.tt.onColumnDrop(event, this.el.nativeElement);
        }
    }

    isEnabled() {
        return this.ttReorderableColumnDisabled() !== true;
    }
}

@Directive({
    selector: '[ttSelectableRow]',
    standalone: false,
    host: {
        '[class]': 'cx("row")',
        '[attr.aria-selected]': 'selected()'
    },
    providers: [TreeTableStyle]
})
export class TTSelectableRow extends BaseComponent {
    tt = inject(TreeTable);

    tableService = inject(TreeTableService);

    _componentStyle = inject(TreeTableStyle);

    readonly rowNode = input<any>(undefined, { alias: 'ttSelectableRow' });

    readonly ttSelectableRowDisabled = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    readonly selected = signal<boolean | undefined>(undefined);

    subscription: Subscription | undefined;

    constructor() {
        super();
        if (this.isEnabled()) {
            this.subscription = this.tt.tableService.selectionSource$.subscribe(() => {
                this.selected.set(this.tt.isSelected(this.rowNode().node));
            });
        }
    }

    onInit() {
        if (this.isEnabled()) {
            this.selected.set(this.tt.isSelected(this.rowNode().node));
        }
    }

    onDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    @HostListener('click', ['$event'])
    onClick(event: Event) {
        if (this.isEnabled()) {
            this.tt.handleRowClick({
                originalEvent: event,
                rowNode: this.rowNode()
            });
        }
    }

    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        switch (event.code) {
            case 'Enter':
            case 'Space':
                this.onEnterKey(event);
                break;

            default:
                break;
        }
    }

    @HostListener('touchend', ['$event'])
    onTouchEnd(event: Event) {
        if (this.isEnabled()) {
            this.tt.handleRowTouchEnd(event);
        }
    }

    onEnterKey(event) {
        if (this.tt.selectionMode() === 'checkbox') {
            this.tt.toggleNodeWithCheckbox({
                originalEvent: event,
                rowNode: this.rowNode()
            });
        } else {
            this.onClick(event);
        }
        event.preventDefault();
    }

    isEnabled() {
        return this.ttSelectableRowDisabled() !== true;
    }
}

@Directive({
    selector: '[ttSelectableRowDblClick]',
    standalone: false,
    host: {
        '[class]': 'cx("row")'
    },
    providers: [TreeTableStyle]
})
export class TTSelectableRowDblClick extends BaseComponent {
    tt = inject(TreeTable);

    tableService = inject(TreeTableService);

    _componentStyle = inject(TreeTableStyle);

    readonly rowNode = input<any>(undefined, { alias: 'ttSelectableRowDblClick' });

    readonly ttSelectableRowDisabled = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    readonly selected = signal<boolean | undefined>(undefined);

    subscription: Subscription | undefined;

    constructor() {
        super();
        if (this.isEnabled()) {
            this.subscription = this.tt.tableService.selectionSource$.subscribe(() => {
                this.selected.set(this.tt.isSelected(this.rowNode().node));
            });
        }
    }

    onInit() {
        if (this.isEnabled()) {
            this.selected.set(this.tt.isSelected(this.rowNode().node));
        }
    }

    onDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    @HostListener('dblclick', ['$event'])
    onClick(event: Event) {
        if (this.isEnabled()) {
            this.tt.handleRowClick({
                originalEvent: event,
                rowNode: this.rowNode()
            });
        }
    }

    isEnabled() {
        return this.ttSelectableRowDisabled() !== true;
    }
}

@Directive({
    selector: '[ttContextMenuRow]',
    standalone: false,
    host: {
        '[class]': 'cx("contextMenuRow")',
        '[tabindex]': 'isEnabled() ? 0 : undefined'
    },
    providers: [TreeTableStyle]
})
export class TTContextMenuRow extends BaseComponent {
    tt = inject(TreeTable);

    tableService = inject(TreeTableService);

    _componentStyle = inject(TreeTableStyle);

    readonly rowNode = input<any | undefined>(undefined, { alias: 'ttContextMenuRow' });

    readonly ttContextMenuRowDisabled = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    readonly selected = signal<boolean | undefined>(undefined);

    subscription: Subscription | undefined;

    constructor() {
        super();
        if (this.isEnabled()) {
            this.subscription = this.tt.tableService.contextMenuSource$.subscribe((node) => {
                this.selected.set(node ? this.tt.equals(this.rowNode().node, node) : false);
            });
        }
    }

    onDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    @HostListener('contextmenu', ['$event'])
    onContextMenu(event: Event) {
        if (this.isEnabled()) {
            this.tt.handleRowRightClick({
                originalEvent: event,
                rowNode: this.rowNode()
            });

            this.el.nativeElement.focus();

            event.preventDefault();
        }
    }

    isEnabled() {
        return this.ttContextMenuRowDisabled() !== true;
    }
}

@Component({
    selector: 'p-treeTableCheckbox, p-treetable-checkbox, p-tree-table-checkbox',
    standalone: false,
    template: `
        <p-checkbox
            [ngModel]="checked()"
            [ngModelOptions]="{ standalone: true }"
            [pt]="ptm('pcRowCheckbox')"
            (onChange)="onClick($event)"
            [binary]="true"
            [disabled]="disabled()"
            [indeterminate]="partialChecked()"
            [class]="cx('pcNodeCheckbox')"
            [tabIndex]="-1"
            [unstyled]="unstyled()"
        >
            @if (tt.$checkboxIconTemplate()) {
                <ng-template pTemplate="icon">
                    <ng-template *ngTemplateOutlet="tt.$checkboxIconTemplate(); context: { $implicit: checked(), partialSelected: partialChecked() }"></ng-template>
                </ng-template>
            }
        </p-checkbox>
    `,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [TreeTableStyle]
})
export class TTCheckbox extends BaseComponent {
    tt = inject(TreeTable);

    tableService = inject(TreeTableService);

    cd = inject(ChangeDetectorRef);

    _componentStyle = inject(TreeTableStyle);

    readonly disabled = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    readonly rowNode = input<any>(undefined, { alias: 'value' });

    hostName = 'TreeTable';

    readonly checked = signal<boolean | undefined>(undefined);

    readonly partialChecked = signal<boolean | undefined>(undefined);

    subscription: Subscription | undefined;

    constructor() {
        super();
        this.subscription = this.tt.tableService.selectionSource$.subscribe(() => {
            if (this.tt._selectionKeys()) {
                this.checked.set(this.tt.isNodeSelected(this.rowNode().node));
                this.partialChecked.set(this.tt.isNodePartialSelected(this.rowNode().node));
            } else {
                this.checked.set(this.tt.isSelected(this.rowNode().node));
                this.partialChecked.set(this.rowNode().node.partialSelected);
            }
            this.cd.markForCheck();
        });
    }

    onInit() {
        if (this.tt._selectionKeys()) {
            this.checked.set(this.tt.isNodeSelected(this.rowNode().node));
            this.partialChecked.set(this.tt.isNodePartialSelected(this.rowNode().node));
        } else {
            // for backward compatibility
            this.checked.set(this.tt.isSelected(this.rowNode().node));
            this.partialChecked.set(this.rowNode().node.partialSelected);
        }
    }

    onDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    onClick(event: Event) {
        if (!this.disabled()) {
            if (this.tt._selectionKeys()) {
                const _check = !this.checked();
                this.tt.toggleCheckbox({
                    originalEvent: event,
                    check: _check,
                    rowNode: this.rowNode()
                });
            } else {
                this.tt.toggleNodeWithCheckbox({
                    originalEvent: event,
                    rowNode: this.rowNode()
                });
            }
        }
        clearSelection();
    }
}

@Component({
    selector: 'p-treeTableHeaderCheckbox',
    standalone: false,
    template: `
        <p-checkbox [ngModel]="checked()" [ngModelOptions]="{ standalone: true }" [pt]="ptm('pcHeaderCheckbox')" (onChange)="onClick($event)" [binary]="true" [disabled]="!tt._value() || tt._value()!.length === 0" [unstyled]="unstyled()">
            @if (tt.$headerCheckboxIconTemplate()) {
                <ng-template pTemplate="icon">
                    <ng-template *ngTemplateOutlet="tt.$headerCheckboxIconTemplate(); context: { $implicit: checked() }"></ng-template>
                </ng-template>
            }
        </p-checkbox>
    `,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TTHeaderCheckbox extends BaseComponent {
    tt = inject(TreeTable);

    tableService = inject(TreeTableService);

    readonly checked = signal<boolean | undefined>(undefined);

    selectionChangeSubscription: Subscription;

    valueChangeSubscription: Subscription;

    constructor() {
        super();
        this.valueChangeSubscription = this.tt.tableService.uiUpdateSource$.subscribe(() => {
            this.checked.set(this.updateCheckedState());
        });

        this.selectionChangeSubscription = this.tt.tableService.selectionSource$.subscribe(() => {
            this.checked.set(this.updateCheckedState());
        });
    }

    onInit() {
        this.checked.set(this.updateCheckedState());
    }

    onDestroy() {
        if (this.selectionChangeSubscription) {
            this.selectionChangeSubscription.unsubscribe();
        }

        if (this.valueChangeSubscription) {
            this.valueChangeSubscription.unsubscribe();
        }
    }

    onClick(event: Event) {
        if ((this.tt?._value() || this.tt?.filteredNodes()) && ((this.tt?._value() && this.tt._value()!.length > 0) || (this.tt?.filteredNodes() && this.tt.filteredNodes()!.length > 0))) {
            this.tt?.toggleNodesWithCheckbox(event, !this.checked());
        }

        clearSelection();
    }

    updateCheckedState() {
        this.cd.markForCheck();
        let checked!: boolean;
        const data = this.tt.filteredNodes() || this.tt._value();

        if (data) {
            if (this.tt._selectionKeys()) {
                for (let node of data) {
                    if (this.tt.isNodeSelected(node)) {
                        checked = true;
                    } else {
                        checked = false;
                        break;
                    }
                }
            }
            if (!this.tt._selectionKeys()) {
                // legacy selection support, will be removed in v18
                for (let node of data) {
                    if (this.tt.isSelected(node)) {
                        checked = true;
                    } else {
                        checked = false;
                        break;
                    }
                }
            }
        } else {
            checked = false;
        }

        return checked;
    }
}

@Directive({
    selector: '[ttEditableColumn]',
    standalone: false
})
export class TTEditableColumn extends BaseComponent {
    tt = inject(TreeTable);
    zone = inject(NgZone);

    readonly data = input<any>(undefined, { alias: 'ttEditableColumn' });

    readonly field = input<any>(undefined, { alias: 'ttEditableColumnField' });

    readonly ttEditableColumnDisabled = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    constructor() {
        super();

        afterNextRender(() => {
            if (this.isEnabled()) {
                !this.$unstyled() && addClass(this.el.nativeElement, 'p-editable-column');
                this.el?.nativeElement.setAttribute('data-p-editable-column', 'true');
            }
        });
    }

    @HostListener('click', ['$event'])
    onClick(event: MouseEvent) {
        if (this.isEnabled()) {
            this.tt.editingCellClick = true;

            if (this.tt.editingCell) {
                if (this.tt.editingCell !== this.el.nativeElement) {
                    if (!this.tt.isEditingCellValid()) {
                        return;
                    }

                    if (this.tt.editingCell) !this.$unstyled() && removeClass(this.tt.editingCell, 'p-cell-editing');
                    this.openCell();
                }
            } else {
                this.openCell();
            }
        }
    }

    openCell() {
        this.tt.updateEditingCell(this.el.nativeElement, this.data(), this.field());
        !this.$unstyled() && addClass(this.el.nativeElement, 'p-cell-editing');
        this.el?.nativeElement.setAttribute('data-p-cell-editing', 'true');
        this.tt.onEditInit.emit({ field: this.field(), data: this.data() });
        this.tt.editingCellClick = true;
        this.zone.runOutsideAngular(() => {
            setTimeout(() => {
                let focusable = <any>findSingle(this.el.nativeElement, 'input, textarea');
                if (focusable) {
                    focusable.focus();
                }
            }, 50);
        });
    }

    closeEditingCell() {
        if (this.tt.editingCell) !this.$unstyled() && removeClass(this.tt.editingCell, 'p-checkbox-icon');
        this.tt.editingCell = null;
        this.tt.unbindDocumentEditListener();
    }

    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        if (this.isEnabled()) {
            //enter
            if (event.keyCode == 13 && !event.shiftKey) {
                if (this.tt.isEditingCellValid()) {
                    if (this.tt.editingCell) {
                        !this.$unstyled() && removeClass(this.tt.editingCell, 'p-cell-editing');
                        this.el?.nativeElement.setAttribute('data-p-cell-editing', 'false');
                    }
                    this.closeEditingCell();
                    this.tt.onEditComplete.emit({ field: this.field(), data: this.data() });
                }

                event.preventDefault();
            }

            //escape
            else if (event.keyCode == 27) {
                if (this.tt.isEditingCellValid()) {
                    if (this.tt.editingCell) {
                        !this.$unstyled() && removeClass(this.tt.editingCell, 'p-cell-editing');
                        this.el?.nativeElement.setAttribute('data-p-cell-editing', 'false');
                    }
                    this.closeEditingCell();
                    this.tt.onEditCancel.emit({ field: this.field(), data: this.data() });
                }

                event.preventDefault();
            }

            //tab
            else if (event.keyCode == 9) {
                this.tt.onEditComplete.emit({ field: this.field(), data: this.data() });

                if (event.shiftKey) this.moveToPreviousCell(event);
                else this.moveToNextCell(event);
            }
        }
    }

    findCell(element: any) {
        if (element) {
            let cell = element;
            while (cell && !findSingle(cell, '[data-p-cell-editing="true"]')) {
                cell = cell.parentElement;
            }

            return cell;
        } else {
            return null;
        }
    }

    moveToPreviousCell(event: KeyboardEvent) {
        let currentCell = this.findCell(event.target);
        let row = currentCell.parentElement;
        let targetCell = this.findPreviousEditableColumn(currentCell);

        if (targetCell) {
            // @ts-ignore
            invokeElementMethod(targetCell as HTMLElement, 'click', undefined);
            event.preventDefault();
        }
    }

    moveToNextCell(event: KeyboardEvent) {
        let currentCell = this.findCell(event.target);
        let row = currentCell.parentElement;
        let targetCell = this.findNextEditableColumn(currentCell);

        if (targetCell) {
            // @ts-ignore
            invokeElementMethod(targetCell, 'click', undefined);
            event.preventDefault();
        }
    }

    findPreviousEditableColumn(cell: any): Element | null {
        let prevCell = cell.previousElementSibling;

        if (!prevCell) {
            let previousRow = cell.parentElement ? cell.parentElement.previousElementSibling : null;
            if (previousRow) {
                prevCell = previousRow.lastElementChild;
            }
        }

        if (prevCell) {
            if (findSingle(prevCell, '[data-p-editable-column="true"]')) return prevCell;
            else return this.findPreviousEditableColumn(prevCell);
        } else {
            return null;
        }
    }

    findNextEditableColumn(cell: Element): Element | null {
        let nextCell = cell.nextElementSibling;

        if (!nextCell) {
            let nextRow = cell.parentElement ? cell.parentElement.nextElementSibling : null;
            if (nextRow) {
                nextCell = nextRow.firstElementChild;
            }
        }

        if (nextCell) {
            if (findSingle(nextCell, '[data-p-editable-column="true"]')) return nextCell;
            else return this.findNextEditableColumn(nextCell);
        } else {
            return null;
        }
    }

    isEnabled() {
        return this.ttEditableColumnDisabled() !== true;
    }
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'p-treeTableCellEditor, p-treetablecelleditor, p-treetable-cell-editor',
    standalone: false,
    template: `
        @if (tt.editingCell === editableColumn.el.nativeElement) {
            <ng-container *ngTemplateOutlet="$inputTemplate()"></ng-container>
        }
        @if (!tt.editingCell || tt.editingCell !== editableColumn.el.nativeElement) {
            <ng-container *ngTemplateOutlet="$outputTemplate()"></ng-container>
        }
    `,
    encapsulation: ViewEncapsulation.None,
    hostDirectives: [Bind]
})
export class TreeTableCellEditor extends BaseComponent {
    tt = inject(TreeTable);

    editableColumn = inject(TTEditableColumn);

    bindDirectiveInstance = inject(Bind, { self: true });

    readonly templates = contentChildren(PrimeTemplate);

    hostName = 'TreeTable';

    readonly $inputTemplate = computed(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'input')
                .at(-1)?.template
    );

    readonly $outputTemplate = computed(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'output')
                .at(-1)?.template
    );

    constructor() {
        super();

        afterEveryRender(() => {
            this.bindDirectiveInstance.setAttrs(this.ptm('cellEditor'));
        });
    }
}

@Directive({
    selector: '[ttRow]',
    standalone: false,
    host: {
        '[class]': `'p-element ' + styleClass`,
        '[tabindex]': "'0'",
        '[attr.aria-expanded]': 'expanded',
        '[attr.aria-level]': 'level',
        role: 'row'
    },
    providers: [TreeTableStyle],
    hostDirectives: [Bind]
})
export class TTRow extends BaseComponent {
    tt = inject(TreeTable);

    el = inject(ElementRef);

    zone = inject(NgZone);

    bindDirectiveInstance = inject(Bind, { self: true });

    treeTable = inject(TreeTable);

    _componentStyle = inject(TreeTableStyle);

    readonly rowNode = input<any>(undefined, { alias: 'ttRow' });

    hostName = 'TreeTable';

    get level() {
        return this.rowNode()?.['level'] + 1;
    }

    get styleClass() {
        return this.rowNode()?.node['styleClass'] || '';
    }

    get expanded() {
        return this.rowNode()?.node['expanded'];
    }

    constructor() {
        super();

        afterEveryRender(() => {
            this.bindDirectiveInstance.setAttrs(this.ptm('row', this.ptmOptions()));
        });
    }

    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        switch (event.code) {
            case 'ArrowDown':
                this.onArrowDownKey(event);
                break;

            case 'ArrowUp':
                this.onArrowUpKey(event);
                break;

            case 'ArrowRight':
                this.onArrowRightKey(event);
                break;

            case 'ArrowLeft':
                this.onArrowLeftKey(event);
                break;

            case 'Tab':
                this.onTabKey(event);
                break;

            case 'Home':
                this.onHomeKey(event);
                break;

            case 'End':
                this.onEndKey(event);
                break;

            default:
                break;
        }
    }

    onArrowDownKey(event: KeyboardEvent) {
        let nextRow = this.el?.nativeElement?.nextElementSibling;
        if (nextRow) {
            this.focusRowChange(<HTMLElement>event.currentTarget, nextRow);
        }

        event.preventDefault();
    }

    onArrowUpKey(event: KeyboardEvent) {
        let prevRow = this.el?.nativeElement?.previousElementSibling;
        if (prevRow) {
            this.focusRowChange(<HTMLElement>event.currentTarget, prevRow);
        }

        event.preventDefault();
    }

    onArrowRightKey(event: KeyboardEvent) {
        const currentTarget = <HTMLElement>event.currentTarget;
        const isHiddenIcon = (findSingle(currentTarget, 'button') as any).style.visibility === 'hidden';

        if (!isHiddenIcon && !this.expanded && this.rowNode().node['children']) {
            this.expand(event);

            currentTarget.tabIndex = -1;
        }
        event.preventDefault();
    }

    onArrowLeftKey(event: KeyboardEvent) {
        const container = this.tt.el?.nativeElement;
        const expandedRows = find(container, '[aria-expanded="true"]');
        const lastExpandedRow = expandedRows[expandedRows.length - 1];

        if (this.expanded) {
            this.collapse(event);
        }
        if (lastExpandedRow) {
            this.tt.toggleRowIndex = getIndex(lastExpandedRow as any);
        }
        this.restoreFocus();
        event.preventDefault();
    }

    onHomeKey(event: KeyboardEvent) {
        const firstElement = <any>findSingle(this.tt.el?.nativeElement, `tr[aria-level="${this.level}"]`);
        firstElement && focus(firstElement);
        event.preventDefault();
    }

    onEndKey(event: KeyboardEvent) {
        const nodes = <any>find(this.tt.el?.nativeElement, `tr[aria-level="${this.level}"]`);
        const lastElement = nodes[nodes.length - 1];
        focus(lastElement);
        event.preventDefault();
    }

    onTabKey(event: KeyboardEvent) {
        const rows = this.el.nativeElement ? [...find(this.el.nativeElement.parentNode, 'tr')] : undefined;

        if (rows && isNotEmpty(rows)) {
            const hasSelectedRow = rows.some((row) => getAttribute(row, 'data-p-highlight') || row.getAttribute('aria-selected') === 'true');
            rows.forEach((row: any) => {
                row.tabIndex = -1;
            });

            if (hasSelectedRow) {
                const selectedNodes = rows.filter((node) => getAttribute(node, 'data-p-highlight') || node.getAttribute('aria-selected') === 'true');
                (selectedNodes[0] as any).tabIndex = 0;

                return;
            }

            (rows[0] as any).tabIndex = 0;
        }
    }

    expand(event: Event) {
        this.tt.toggleRowIndex = getIndex(this.el.nativeElement);
        this.rowNode().node['expanded'] = true;

        this.tt.updateSerializedValue();
        this.tt.tableService.onUIUpdate(this.tt._value());
        this.rowNode().node['children'] ? this.restoreFocus(this.tt.toggleRowIndex + 1) : this.restoreFocus();

        this.tt.onNodeExpand.emit({
            originalEvent: event,
            node: this.rowNode().node
        });
    }

    collapse(event: Event) {
        this.rowNode().node['expanded'] = false;

        this.tt.updateSerializedValue();
        this.tt.tableService.onUIUpdate(this.tt._value());

        this.tt.onNodeCollapse.emit({ originalEvent: event, node: this.rowNode().node });
    }

    focusRowChange(firstFocusableRow, currentFocusedRow, lastVisibleDescendant?) {
        firstFocusableRow.tabIndex = '-1';
        currentFocusedRow.tabIndex = '0';

        focus(currentFocusedRow);
    }

    restoreFocus(index?) {
        this.zone.runOutsideAngular(() => {
            setTimeout(() => {
                const container = this.tt.el?.nativeElement;
                const tbody = findSingle(container, '[data-pc-section="tbody"]');
                const row = tbody?.children?.[<number>index || this.tt.toggleRowIndex || 0];
                const rows = [...find(container, 'tr')];

                rows &&
                    rows.forEach((r: any) => {
                        if (row && !row.isSameNode(r)) {
                            r.tabIndex = -1;
                        }
                    });

                if (row) {
                    (row as HTMLElement).tabIndex = 0;
                    (row as HTMLElement).focus();
                }
            }, 25);
        });
    }

    ptmOptions() {
        return {
            context: {
                selectable: this.treeTable?.rowHover() || this.treeTable.selectionMode() === 'row',
                selected: this.treeTable.isSelected((<any>this.rowNode())?.node),
                scrollable: this.treeTable?.scrollable(),
                rowNode: this.rowNode()
            }
        };
    }
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'p-treeTableToggler, p-treetabletoggler, p-treetable-toggler',
    standalone: false,
    template: `
        <button
            type="button"
            [class]="cx('toggler')"
            [pBind]="ptm('rowToggleButton')"
            (click)="onClick($event)"
            tabindex="-1"
            pRipple
            [style.visibility]="rowNode().node.leaf === false || (rowNode().node.children && rowNode().node.children.length) ? 'visible' : 'hidden'"
            [style.marginInlineStart]="rowNode().level * 16 + 'px'"
            [attr.data-pc-group-section]="'rowactionbutton'"
            [attr.aria-label]="toggleButtonAriaLabel"
        >
            @if (!tt.$togglerIconTemplate()) {
                @if (rowNode().node.expanded) {
                    <svg data-p-icon="chevron-down" [pBind]="ptm('nodetoggleicon')" [attr.aria-hidden]="true" />
                }
                @if (!rowNode().node.expanded) {
                    <svg data-p-icon="chevron-right" [pBind]="ptm('nodetoggleicon')" [attr.aria-hidden]="true" />
                }
            }
            <ng-template *ngTemplateOutlet="tt.$togglerIconTemplate(); context: { $implicit: rowNode().node.expanded }"></ng-template>
        </button>
    `,
    encapsulation: ViewEncapsulation.None,
    providers: [TreeTableStyle],
    hostDirectives: [Bind]
})
export class TreeTableToggler extends BaseComponent {
    tt = inject(TreeTable);

    bindDirectiveInstance = inject(Bind, { self: true });

    _componentStyle = inject(TreeTableStyle);

    readonly rowNode = input<any>();

    hostName = 'TreeTable';

    get toggleButtonAriaLabel() {
        return this.config.translation ? (this.rowNode().expanded ? this.config.translation?.aria?.collapseRow : this.config.translation?.aria?.expandRow) : undefined;
    }

    constructor() {
        super();

        afterEveryRender(() => {
            this.bindDirectiveInstance.setAttrs(this.ptm('toggler'));
        });
    }

    onClick(event: Event) {
        this.rowNode().node.expanded = !this.rowNode().node.expanded;

        if (this.rowNode().node.expanded) {
            this.tt.onNodeExpand.emit({
                originalEvent: event,
                node: this.rowNode().node
            });
        } else {
            this.tt.onNodeCollapse.emit({
                originalEvent: event,
                node: this.rowNode().node
            });
        }

        this.tt.updateSerializedValue();
        this.tt.tableService.onUIUpdate(this.tt._value());

        event.preventDefault();
    }
}

@NgModule({
    imports: [
        CommonModule,
        PaginatorModule,
        Ripple,
        Scroller,
        SpinnerIcon,
        ArrowDownIcon,
        ArrowUpIcon,
        SortAltIcon,
        SortAmountUpAltIcon,
        SortAmountDownIcon,
        BadgeModule,
        CheckIcon,
        ChevronDownIcon,
        ChevronRightIcon,
        Checkbox,
        SharedModule,
        FormsModule,
        BindModule
    ],
    exports: [
        TreeTable,
        SharedModule,
        TreeTableToggler,
        TTSortableColumn,
        TTSortIcon,
        TTResizableColumn,
        TTRow,
        TTReorderableColumn,
        TTSelectableRow,
        TTSelectableRowDblClick,
        TTContextMenuRow,
        TTCheckbox,
        TTHeaderCheckbox,
        TTEditableColumn,
        TreeTableCellEditor,
        Scroller
    ],
    declarations: [
        TreeTable,
        TreeTableToggler,
        TTScrollableView,
        TTBody,
        TTSortableColumn,
        TTSortIcon,
        TTResizableColumn,
        TTRow,
        TTReorderableColumn,
        TTSelectableRow,
        TTSelectableRowDblClick,
        TTContextMenuRow,
        TTCheckbox,
        TTHeaderCheckbox,
        TTEditableColumn,
        TreeTableCellEditor
    ]
})
export class TreeTableModule {}
