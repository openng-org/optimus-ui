import { CommonModule } from '@angular/common';
import {
    afterEveryRender,
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    ElementRef,
    HostBinding,
    inject,
    input,
    linkedSignal,
    NgModule,
    numberAttribute,
    signal,
    TemplateRef,
    untracked,
    ViewEncapsulation,
    contentChild,
    contentChildren,
    output
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Aria, PrimeTemplate, SelectItem, SharedModule } from '@openng/optimus-ui/api';
import { BaseComponent, PARENT_INSTANCE } from '@openng/optimus-ui/basecomponent';
import { Bind } from '@openng/optimus-ui/bind';
import { Select, SelectChangeEvent } from '@openng/optimus-ui/select';
import { AngleDoubleLeftIcon, AngleDoubleRightIcon, AngleLeftIcon, AngleRightIcon } from '@openng/optimus-ui/icons';
import { InputNumber } from '@openng/optimus-ui/inputnumber';
import { Ripple } from '@openng/optimus-ui/ripple';
import { Nullable } from '@openng/optimus-ui/ts-helpers';
import { PaginatorDropdownItemTemplateContext, PaginatorPassThrough, PaginatorState, PaginatorTemplateContext } from '@openng/optimus-ui/types/paginator';
import { PaginatorStyle } from './style/paginatorstyle';

/**
 * Paginator is a generic component to display content in paged format.
 * @group Components
 */
@Component({
    selector: 'p-paginator',
    standalone: true,
    imports: [CommonModule, Select, InputNumber, FormsModule, Ripple, AngleDoubleLeftIcon, AngleDoubleRightIcon, AngleLeftIcon, AngleRightIcon, SharedModule, Bind],
    template: `
        @if (templateLeft()) {
            <div [pBind]="ptm('contentStart')" [class]="cx('contentStart')">
                <ng-container *ngTemplateOutlet="templateLeft(); context: { $implicit: paginatorState() }"></ng-container>
            </div>
        }
        @if (showCurrentPageReport()) {
            <span [pBind]="ptm('current')" [class]="cx('current')">{{ currentPageReport }}</span>
        }
        @if (showFirstLastIcon()) {
            <button [pBind]="ptm('first')" type="button" (click)="changePageToFirst($event)" pRipple [class]="cx('first')" [attr.aria-label]="getAriaLabel('firstPageLabel')">
                @if (!$firstPageLinkIconTemplate()) {
                    <svg [pBind]="ptm('firstIcon')" data-p-icon="angle-double-left" [class]="cx('firstIcon')" />
                }
                @if ($firstPageLinkIconTemplate()) {
                    <span [class]="cx('firstIcon')">
                        <ng-template *ngTemplateOutlet="$firstPageLinkIconTemplate()"></ng-template>
                    </span>
                }
            </button>
        }
        <button [pBind]="ptm('prev')" type="button" [disabled]="isFirstPage() || empty()" (click)="changePageToPrev($event)" pRipple [class]="cx('prev')" [attr.aria-label]="getAriaLabel('prevPageLabel')">
            @if (!$previousPageLinkIconTemplate()) {
                <svg [pBind]="ptm('prevIcon')" data-p-icon="angle-left" [class]="cx('prevIcon')" />
            }
            @if ($previousPageLinkIconTemplate()) {
                <span [class]="cx('prevIcon')">
                    <ng-template *ngTemplateOutlet="$previousPageLinkIconTemplate()"></ng-template>
                </span>
            }
        </button>
        @if (showPageLinks()) {
            <span [pBind]="ptm('pages')" [class]="cx('pages')">
                @for (pageLink of pageLinks(); track pageLink) {
                    <button
                        [pBind]="ptm('page')"
                        type="button"
                        [class]="cx('page', { pageLink })"
                        [attr.aria-label]="getPageAriaLabel(pageLink)"
                        [attr.aria-current]="pageLink - 1 == getPage() ? 'page' : undefined"
                        (click)="onPageLinkClick($event, pageLink - 1)"
                        pRipple
                    >
                        {{ getLocalization(pageLink) }}
                    </button>
                }
            </span>
        }
        @if (showJumpToPageDropdown()) {
            <p-select
                [options]="pageItems()"
                [ngModel]="getPage()"
                [ngModelOptions]="{ standalone: true }"
                [disabled]="empty()"
                [attr.aria-label]="getAriaLabel('jumpToPageDropdownLabel')"
                [class]="cx('pcJumpToPageDropdown')"
                (onChange)="onPageDropdownChange($event)"
                [appendTo]="dropdownAppendTo() || $appendTo()"
                [scrollHeight]="dropdownScrollHeight()"
                [pt]="ptm('pcJumpToPageDropdown')"
                [unstyled]="unstyled()"
            >
                <ng-template pTemplate="selectedItem">{{ currentPageReport }}</ng-template>
                @if (jumpToPageItemTemplate()) {
                    <ng-template let-item pTemplate="item">
                        <ng-container *ngTemplateOutlet="jumpToPageItemTemplate(); context: { $implicit: item }"></ng-container>
                    </ng-template>
                }
                @if ($dropdownIconTemplate()) {
                    <ng-template pTemplate="dropdownicon">
                        <ng-container *ngTemplateOutlet="$dropdownIconTemplate()"></ng-container>
                    </ng-template>
                }
            </p-select>
        }
        <button [pBind]="ptm('next')" type="button" [disabled]="isLastPage() || empty()" (click)="changePageToNext($event)" pRipple [class]="cx('next')" [attr.aria-label]="getAriaLabel('nextPageLabel')">
            @if (!$nextPageLinkIconTemplate()) {
                <svg [pBind]="ptm('nextIcon')" data-p-icon="angle-right" [class]="cx('nextIcon')" />
            }
            @if ($nextPageLinkIconTemplate()) {
                <span [class]="cx('nextIcon')">
                    <ng-template *ngTemplateOutlet="$nextPageLinkIconTemplate()"></ng-template>
                </span>
            }
        </button>
        @if (showFirstLastIcon()) {
            <button [pBind]="ptm('last')" type="button" [disabled]="isLastPage() || empty()" (click)="changePageToLast($event)" pRipple [class]="cx('last')" [attr.aria-label]="getAriaLabel('lastPageLabel')">
                @if (!$lastPageLinkIconTemplate()) {
                    <svg [pBind]="ptm('lastIcon')" data-p-icon="angle-double-right" [class]="cx('lastIcon')" />
                }
                @if ($lastPageLinkIconTemplate()) {
                    <span [class]="cx('lastIcon')">
                        <ng-template *ngTemplateOutlet="$lastPageLinkIconTemplate()"></ng-template>
                    </span>
                }
            </button>
        }
        @if (showJumpToPageInput()) {
            <p-inputnumber
                [pt]="ptm('pcJumpToPageInput')"
                [ngModel]="currentPage()"
                [ngModelOptions]="{ standalone: true }"
                [class]="cx('pcJumpToPageInput')"
                [disabled]="empty()"
                (ngModelChange)="changePage($event - 1)"
                [unstyled]="unstyled()"
            ></p-inputnumber>
        }
        @if (rowsPerPageOptions()) {
            <p-select
                [options]="rowsPerPageItems()"
                [ngModel]="$rows()"
                (ngModelChange)="$rows.set($event)"
                [ngModelOptions]="{ standalone: true }"
                [class]="cx('pcRowPerPageDropdown')"
                [disabled]="empty()"
                (onChange)="onRppChange($event)"
                [appendTo]="dropdownAppendTo() || $appendTo()"
                [scrollHeight]="dropdownScrollHeight()"
                [ariaLabel]="getAriaLabel('rowsPerPageLabel')"
                [pt]="ptm('pcRowPerPageDropdown')"
                [unstyled]="unstyled()"
            >
                @if (dropdownItemTemplate()) {
                    <ng-template let-item pTemplate="item">
                        <ng-container *ngTemplateOutlet="dropdownItemTemplate(); context: { $implicit: item }"></ng-container>
                    </ng-template>
                }
                @if ($dropdownIconTemplate()) {
                    <ng-template pTemplate="dropdownicon">
                        <ng-container *ngTemplateOutlet="$dropdownIconTemplate()"></ng-container>
                    </ng-template>
                }
            </p-select>
        }
        @if (templateRight()) {
            <div [pBind]="ptm('contentEnd')" [class]="cx('contentEnd')">
                <ng-container *ngTemplateOutlet="templateRight(); context: { $implicit: paginatorState() }"></ng-container>
            </div>
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [PaginatorStyle, { provide: PARENT_INSTANCE, useExisting: Paginator }],
    host: {
        '[class]': "cx('paginator')"
    },
    hostDirectives: [Bind]
})
export class Paginator extends BaseComponent<PaginatorPassThrough> {
    bindDirectiveInstance = inject(Bind, { self: true });

    _componentStyle = inject(PaginatorStyle);

    /**
     * Number of page links to display.
     * @group Props
     */
    readonly pageLinkSize = input<number, unknown>(5, { transform: numberAttribute });

    /**
     * Whether to show it even there is only one page.
     * @group Props
     */
    readonly alwaysShow = input<boolean, unknown>(true, { transform: booleanAttribute });

    /**
     * Target element to attach the dropdown overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name).
     * @deprecated since v20.0.0. Use `appendTo` instead.
     * @group Props
     */
    readonly dropdownAppendTo = input<HTMLElement | ElementRef | TemplateRef<any> | string | null | undefined | any>();

    /**
     * Template instance to inject into the left side of the paginator.
     * @param {PaginatorTemplateContext} context - Paginator template context.
     * @see {@link PaginatorTemplateContext}
     * @group Props
     */
    readonly templateLeft = input<TemplateRef<PaginatorTemplateContext>>();

    /**
     * Template instance to inject into the right side of the paginator.
     * @param {PaginatorTemplateContext} context - Paginator template context.
     * @see {@link PaginatorTemplateContext}
     * @group Props
     */
    readonly templateRight = input<TemplateRef<PaginatorTemplateContext>>();

    /**
     * Dropdown height of the viewport in pixels, a scrollbar is defined if height of list exceeds this value.
     * @group Props
     */
    readonly dropdownScrollHeight = input<string>('200px');

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
     * When enabled, icons are displayed on paginator to go first and last page.
     * @group Props
     */
    readonly showFirstLastIcon = input<boolean, unknown>(true, { transform: booleanAttribute });

    /**
     * Number of total records.
     * @group Props
     */
    readonly totalRecords = input<number, unknown>(0, { transform: numberAttribute });

    /**
     * Data count to display per page.
     * @group Props
     */
    readonly rows = input<number, unknown>(0, { transform: numberAttribute });

    /**
     * Array of integer/object values to display inside rows per page dropdown. A object that have 'showAll' key can be added to it to show all data. Exp; [10,20,30,{showAll:'All'}]
     * @group Props
     */
    readonly rowsPerPageOptions = input<any[]>();

    /**
     * Whether to display a dropdown to navigate to any page.
     * @group Props
     */
    readonly showJumpToPageDropdown = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    /**
     * Whether to display a input to navigate to any page.
     * @group Props
     */
    readonly showJumpToPageInput = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    /**
     * Template instance to inject into the jump to page dropdown item inside in the paginator.
     * @param {PaginatorDropdownItemTemplateContext} context - dropdown item context.
     * @see {@link PaginatorDropdownItemTemplateContext}
     * @group Props
     */
    readonly jumpToPageItemTemplate = input<TemplateRef<PaginatorDropdownItemTemplateContext>>();

    /**
     * Whether to show page links.
     * @group Props
     */
    readonly showPageLinks = input<boolean, unknown>(true, { transform: booleanAttribute });

    /**
     * Locale to be used in formatting.
     * @group Props
     */
    readonly locale = input<string>();

    /**
     * Template instance to inject into the rows per page dropdown item inside in the paginator.
     * @param {PaginatorDropdownItemTemplateContext} context - dropdown item context.
     * @see {@link PaginatorDropdownItemTemplateContext}
     * @group Props
     */
    readonly dropdownItemTemplate = input<TemplateRef<PaginatorDropdownItemTemplateContext>>();

    /**
     * Zero-relative number of the first row to be displayed.
     * @group Props
     */
    readonly first = input<number>(0);

    /**
     * Target element to attach the overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name).
     * @defaultValue 'self'
     * @group Props
     */
    appendTo = input<HTMLElement | ElementRef | TemplateRef<any> | 'self' | 'body' | null | undefined | any>(undefined);

    /**
     * Callback to invoke when page changes, the event object contains information about the new state.
     * @param {PaginatorState} event - Paginator state.
     * @group Emits
     */
    readonly onPageChange = output<PaginatorState>();

    /**
     * Template for the dropdown icon.
     * @group Templates
     */
    readonly dropdownIconTemplate = contentChild<Nullable<TemplateRef<void>>>('dropdownicon', { descendants: false });

    /**
     * Template for the first page link icon.
     * @group Templates
     */
    readonly firstPageLinkIconTemplate = contentChild<Nullable<TemplateRef<void>>>('firstpagelinkicon', { descendants: false });

    /**
     * Template for the previous page link icon.
     * @group Templates
     */
    readonly previousPageLinkIconTemplate = contentChild<Nullable<TemplateRef<void>>>('previouspagelinkicon', { descendants: false });

    /**
     * Template for the last page link icon.
     * @group Templates
     */
    readonly lastPageLinkIconTemplate = contentChild<Nullable<TemplateRef<void>>>('lastpagelinkicon', { descendants: false });

    /**
     * Template for the next page link icon.
     * @group Templates
     */
    readonly nextPageLinkIconTemplate = contentChild<Nullable<TemplateRef<void>>>('nextpagelinkicon', { descendants: false });

    readonly templates = contentChildren(PrimeTemplate);

    componentName = 'Paginator';

    /** Effective first-row index: follows the `first` input and is updated by page changes. */
    readonly $first = linkedSignal(() => this.first());

    /** Effective rows per page: follows the `rows` input and is updated by the rows-per-page dropdown. */
    readonly $rows = linkedSignal(() => this.rows());

    /** Effective dropdown icon template: the `#dropdownicon` content child, or a legacy `pTemplate="dropdownicon"`. */
    readonly $dropdownIconTemplate = computed(() => this.dropdownIconTemplate() ?? (this.templates().find((item) => item.getType() === 'dropdownicon')?.template as TemplateRef<void> | undefined));

    /** Effective first page link icon template: the `#firstpagelinkicon` content child, or a legacy `pTemplate="firstpagelinkicon"`. */
    readonly $firstPageLinkIconTemplate = computed(() => this.firstPageLinkIconTemplate() ?? (this.templates().find((item) => item.getType() === 'firstpagelinkicon')?.template as TemplateRef<void> | undefined));

    /** Effective previous page link icon template: the `#previouspagelinkicon` content child, or a legacy `pTemplate="previouspagelinkicon"`. */
    readonly $previousPageLinkIconTemplate = computed(() => this.previousPageLinkIconTemplate() ?? (this.templates().find((item) => item.getType() === 'previouspagelinkicon')?.template as TemplateRef<void> | undefined));

    /** Effective last page link icon template: the `#lastpagelinkicon` content child, or a legacy `pTemplate="lastpagelinkicon"`. */
    readonly $lastPageLinkIconTemplate = computed(() => this.lastPageLinkIconTemplate() ?? (this.templates().find((item) => item.getType() === 'lastpagelinkicon')?.template as TemplateRef<void> | undefined));

    /** Effective next page link icon template: the `#nextpagelinkicon` content child, or a legacy `pTemplate="nextpagelinkicon"`. */
    readonly $nextPageLinkIconTemplate = computed(() => this.nextPageLinkIconTemplate() ?? (this.templates().find((item) => item.getType() === 'nextpagelinkicon')?.template as TemplateRef<void> | undefined));

    readonly pageLinks = signal<number[] | undefined>(undefined);

    readonly pageItems = signal<SelectItem[] | undefined>(undefined);

    readonly rowsPerPageItems = signal<SelectItem[] | undefined>(undefined);

    readonly paginatorState = signal<any>(undefined);

    /** Recomputes the derived paginator state when the driving inputs change (legacy ngOnChanges behavior). */
    private readonly totalRecordsChangeEffect = effect(() => {
        this.totalRecords();
        untracked(() => {
            this.updatePageLinks();
            this.updatePaginatorState();
            this.updateFirst();
            this.updateRowsPerPageOptions();
        });
    });

    private readonly firstChangeEffect = effect(() => {
        this.first();
        untracked(() => {
            this.updatePageLinks();
            this.updatePaginatorState();
        });
    });

    private readonly rowsChangeEffect = effect(() => {
        this.rows();
        untracked(() => {
            this.updatePageLinks();
            this.updatePaginatorState();
        });
    });

    private readonly rowsPerPageOptionsChangeEffect = effect(() => {
        this.rowsPerPageOptions();
        untracked(() => this.updateRowsPerPageOptions());
    });

    private readonly pageLinkSizeChangeEffect = effect(() => {
        this.pageLinkSize();
        untracked(() => this.updatePageLinks());
    });

    $appendTo = computed(() => this.appendTo() || this.config.overlayAppendTo());

    @HostBinding('style.display') get display(): string | null {
        const pageLinks = this.pageLinks();
        return this.alwaysShow() || (pageLinks && pageLinks.length > 1) ? null : 'none';
    }

    get currentPageReport(): string {
        return this.currentPageReportTemplate()
            .replace('{currentPage}', String(this.currentPage()))
            .replace('{totalPages}', String(this.getPageCount()))
            .replace('{first}', String(this.totalRecords() > 0 ? this.$first() + 1 : 0))
            .replace('{last}', String(Math.min(this.$first() + this.$rows(), this.totalRecords())))
            .replace('{rows}', String(this.$rows()))
            .replace('{totalRecords}', String(this.totalRecords()));
    }

    constructor() {
        super();
        // Re-apply the host/root pass-through sections after each render (replaces the former
        // ngAfterViewChecked hook). Bind.setAttrs writes into a signal behind an equality check,
        // so unchanged PT resolutions are no-ops.
        afterEveryRender(() => {
            this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
        });
    }

    onInit() {
        this.updatePaginatorState();
    }

    getAriaLabel(labelType: keyof Aria): string | undefined {
        return this.config.translation.aria ? this.config.translation.aria[labelType] : undefined;
    }

    getPageAriaLabel(value: number): string | undefined {
        return this.config.translation.aria ? this.config.translation.aria.pageLabel?.replace(/{page}/g, `${value}`) : undefined;
    }

    getLocalization(digit: number): string {
        const numerals = [...new Intl.NumberFormat(this.locale(), { useGrouping: false }).format(9876543210)].reverse();
        const index = new Map(numerals.map((d, i) => [i, d]));
        if (digit > 9) {
            const numbers = String(digit).split('');
            return numbers.map((number) => index.get(Number(number))).join('');
        } else {
            return index.get(digit) as string;
        }
    }

    updateRowsPerPageOptions(): void {
        const rowsPerPageOptions = this.rowsPerPageOptions();
        if (rowsPerPageOptions) {
            const rowsPerPageItems: SelectItem[] = [];
            let showAllItem: SelectItem | null = null;

            for (let opt of rowsPerPageOptions) {
                if (typeof opt == 'object' && opt['showAll']) {
                    showAllItem = { label: opt['showAll'], value: this.totalRecords() };
                } else {
                    rowsPerPageItems.push({ label: String(this.getLocalization(opt)), value: opt });
                }
            }

            if (showAllItem) {
                rowsPerPageItems.push(showAllItem);
            }
            this.rowsPerPageItems.set(rowsPerPageItems);
        }
    }

    isFirstPage(): boolean {
        return this.getPage() === 0;
    }

    isLastPage(): boolean {
        return this.getPage() === this.getPageCount() - 1;
    }

    getPageCount(): number {
        return Math.ceil(this.totalRecords() / this.$rows());
    }

    calculatePageLinkBoundaries(): [number, number] {
        let numberOfPages = this.getPageCount(),
            visiblePages = Math.min(this.pageLinkSize(), numberOfPages);

        //calculate range, keep current in middle if necessary
        let start = Math.max(0, Math.ceil(this.getPage() - visiblePages / 2)),
            end = Math.min(numberOfPages - 1, start + visiblePages - 1);

        //check when approaching to last page
        var delta = this.pageLinkSize() - (end - start + 1);
        start = Math.max(0, start - delta);

        return [start, end];
    }

    updatePageLinks(): void {
        const pageLinks: number[] = [];
        let boundaries = this.calculatePageLinkBoundaries(),
            start = boundaries[0],
            end = boundaries[1];

        for (let i = start; i <= end; i++) {
            pageLinks.push(i + 1);
        }
        this.pageLinks.set(pageLinks);

        if (this.showJumpToPageDropdown()) {
            const pageItems: SelectItem[] = [];
            for (let i = 0; i < this.getPageCount(); i++) {
                pageItems.push({ label: String(i + 1), value: i });
            }
            this.pageItems.set(pageItems);
        }
    }

    changePage(p: number): void {
        var pc = this.getPageCount();

        if (p >= 0 && p < pc) {
            this.$first.set(this.$rows() * p);
            var state = {
                page: p,
                first: this.$first(),
                rows: this.$rows(),
                pageCount: pc
            };
            this.updatePageLinks();

            this.onPageChange.emit(state);
            this.updatePaginatorState();
        }
    }

    updateFirst(): void {
        const page = this.getPage();
        if (page > 0 && this.totalRecords() && this.$first() >= this.totalRecords()) {
            Promise.resolve(null).then(() => this.changePage(page - 1));
        }
    }

    getPage(): number {
        return Math.floor(this.$first() / this.$rows());
    }

    changePageToFirst(event: Event): void {
        if (!this.isFirstPage()) {
            this.changePage(0);
        }

        event.preventDefault();
    }

    changePageToPrev(event: Event): void {
        this.changePage(this.getPage() - 1);
        event.preventDefault();
    }

    changePageToNext(event: Event): void {
        this.changePage(this.getPage() + 1);
        event.preventDefault();
    }

    changePageToLast(event: Event): void {
        if (!this.isLastPage()) {
            this.changePage(this.getPageCount() - 1);
        }

        event.preventDefault();
    }

    onPageLinkClick(event: Event, page: number): void {
        this.changePage(page);
        event.preventDefault();
    }

    onRppChange(event: Event): void {
        this.changePage(this.getPage());
    }

    onPageDropdownChange(event: SelectChangeEvent): void {
        this.changePage(event.value);
    }

    updatePaginatorState(): void {
        this.paginatorState.set({
            page: this.getPage(),
            pageCount: this.getPageCount(),
            rows: this.$rows(),
            first: this.$first(),
            totalRecords: this.totalRecords()
        });
    }

    empty(): boolean {
        return this.getPageCount() === 0;
    }

    currentPage(): number {
        return this.getPageCount() > 0 ? this.getPage() + 1 : 0;
    }
}

@NgModule({
    imports: [Paginator, SharedModule],
    exports: [Paginator, SharedModule]
})
export class PaginatorModule {}
