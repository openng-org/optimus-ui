import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
    afterEveryRender,
    afterNextRender,
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    ElementRef,
    HostBinding,
    inject,
    input,
    NgModule,
    NgZone,
    TemplateRef,
    untracked,
    ViewEncapsulation,
    viewChild,
    contentChild,
    contentChildren,
    output
} from '@angular/core';
import { findSingle, getHeight, getWidth, isTouchDevice, isVisible } from '@openng/optimus-ui-utils';
import { PrimeTemplate, ScrollerOptions, SharedModule } from '@openng/optimus-ui/api';
import { BaseComponent, PARENT_INSTANCE } from '@openng/optimus-ui/basecomponent';
import { Bind } from '@openng/optimus-ui/bind';
import { SpinnerIcon } from '@openng/optimus-ui/icons';
import { Nullable, VoidListener } from '@openng/optimus-ui/ts-helpers';
import {
    ScrollerContentTemplateContext,
    ScrollerItemTemplateContext,
    ScrollerLazyLoadEvent,
    ScrollerLoaderIconTemplateContext,
    ScrollerLoaderTemplateContext,
    ScrollerScrollEvent,
    ScrollerScrollIndexChangeEvent,
    ScrollerToType,
    VirtualScrollerPassThrough
} from '@openng/optimus-ui/types/scroller';
import { ScrollerStyle } from './style/scrollerstyle';

/**
 * Scroller is a performance-approach to handle huge data efficiently.
 * @group Components
 */
@Component({
    selector: 'p-scroller, p-virtualscroller, p-virtual-scroller, p-virtualScroller',
    imports: [CommonModule, SpinnerIcon, SharedModule, Bind],
    standalone: true,
    template: `
        @if (!_disabled) {
            <div #element [attr.id]="_id" [attr.tabindex]="_tabindex" [ngStyle]="_style" [class]="cn(cx('root'), _styleClass)" (scroll)="onContainerScroll($event)" [pBind]="ptm('root')">
                @if ($contentTemplate()) {
                    <ng-container *ngTemplateOutlet="$contentTemplate(); context: { $implicit: loadedItems, options: getContentOptions() }"></ng-container>
                } @else {
                    <div #content [class]="cn(cx('content'), contentStyleClass)" [style]="contentStyle" [pBind]="ptm('content')">
                        @for (item of loadedItems; track _trackBy ? _trackBy($index, item) : item; let index = $index) {
                            <ng-container *ngTemplateOutlet="$itemTemplate(); context: { $implicit: item, options: getOptions(index) }"></ng-container>
                        }
                    </div>
                }
                @if (_showSpacer) {
                    <div [class]="cx('spacer')" [ngStyle]="spacerStyle" [pBind]="ptm('spacer')"></div>
                }
                @if (!_loaderDisabled && _showLoader && d_loading) {
                    <div [class]="cx('loader')" [pBind]="ptm('loader')">
                        @if ($loaderTemplate()) {
                            @for (item of loaderArr; track item; let index = $index) {
                                <ng-container
                                    *ngTemplateOutlet="
                                        $loaderTemplate();
                                        context: {
                                            options: getLoaderOptions(index, both && { numCols: numItemsInViewport.cols })
                                        }
                                    "
                                ></ng-container>
                            }
                        } @else {
                            @if ($loaderIconTemplate()) {
                                <ng-container *ngTemplateOutlet="$loaderIconTemplate(); context: { options: { styleClass: 'p-virtualscroller-loading-icon' } }"></ng-container>
                            } @else {
                                <svg data-p-icon="spinner" [class]="cx('loadingIcon')" [spin]="true" [pBind]="ptm('loadingIcon')" />
                            }
                        }
                    </div>
                }
            </div>
        } @else {
            <ng-content></ng-content>
            @if ($contentTemplate()) {
                <ng-container *ngTemplateOutlet="$contentTemplate(); context: { $implicit: _items, options: { rows: _items, columns: loadedColumns } }"></ng-container>
            }
        }
    `,
    changeDetection: ChangeDetectionStrategy.Eager,
    encapsulation: ViewEncapsulation.None,
    providers: [ScrollerStyle, { provide: PARENT_INSTANCE, useExisting: Scroller }],
    hostDirectives: [Bind]
})
export class Scroller extends BaseComponent<VirtualScrollerPassThrough> {
    private zone = inject(NgZone);

    bindDirectiveInstance = inject(Bind, { self: true });

    _componentStyle = inject(ScrollerStyle);

    readonly hostName = input<string>('');

    /**
     * Unique identifier of the element.
     * @group Props
     */
    readonly id = input<string>();

    /**
     * Inline style of the component.
     * @group Props
     */
    readonly style = input<any>();

    /**
     * Style class of the element.
     * @group Props
     */
    readonly styleClass = input<string>();

    /**
     * Index of the element in tabbing order.
     * @group Props
     */
    readonly tabindex = input<number>(0);

    /**
     * An array of objects to display.
     * @group Props
     */
    readonly items = input<any[] | undefined | null>();

    /**
     * The height/width of item according to orientation.
     * @group Props
     */
    readonly itemSize = input<number[] | number>(0);

    /**
     * Height of the scroll viewport.
     * @group Props
     */
    readonly scrollHeight = input<string>();

    /**
     * Width of the scroll viewport.
     * @group Props
     */
    readonly scrollWidth = input<string>();

    /**
     * The orientation of scrollbar.
     * @group Props
     */
    readonly orientation = input<'vertical' | 'horizontal' | 'both'>('vertical');

    /**
     * Used to specify how many items to load in each load method in lazy mode.
     * @group Props
     */
    readonly step = input<number>(0);

    /**
     * Delay in scroll before new data is loaded.
     * @group Props
     */
    readonly delay = input<number>(0);

    /**
     * Delay after window's resize finishes.
     * @group Props
     */
    readonly resizeDelay = input<number>(10);

    /**
     * Used to append each loaded item to top without removing any items from the DOM. Using very large data may cause the browser to crash.
     * @group Props
     */
    readonly appendOnly = input<boolean>(false);

    /**
     * Specifies whether the scroller should be displayed inline or not.
     * @group Props
     */
    readonly inline = input<boolean>(false);

    /**
     * Defines if data is loaded and interacted with in lazy manner.
     * @group Props
     */
    readonly lazy = input<boolean>(false);

    /**
     * If disabled, the scroller feature is eliminated and the content is displayed directly.
     * @group Props
     */
    readonly disabled = input<boolean>(false);

    /**
     * Used to implement a custom loader instead of using the loader feature in the scroller.
     * @group Props
     */
    readonly loaderDisabled = input<boolean>(false);

    /**
     * Columns to display.
     * @group Props
     */
    readonly columns = input<any[] | undefined | null>();

    /**
     * Used to implement a custom spacer instead of using the spacer feature in the scroller.
     * @group Props
     */
    readonly showSpacer = input<boolean>(true);

    /**
     * Defines whether to show loader.
     * @group Props
     */
    readonly showLoader = input<boolean>(false);

    /**
     * Determines how many additional elements to add to the DOM outside of the view. According to the scrolls made up and down, extra items are added in a certain algorithm in the form of multiples of this number. Default value is half the number of items shown in the view.
     * @group Props
     */
    readonly numToleratedItems = input<number>();

    /**
     * Defines whether the data is loaded.
     * @group Props
     */
    readonly loading = input<boolean | undefined>();

    /**
     * Defines whether to dynamically change the height or width of scrollable container.
     * @group Props
     */
    readonly autoSize = input<boolean>(false);

    /**
     * Function to optimize the dom operations by delegating to ngForTrackBy, default algoritm checks for object identity.
     * @group Props
     */
    readonly trackBy = input<Function>();

    /**
     * Defines whether to use the scroller feature. The properties of scroller component can be used like an object in it.
     * @group Props
     */
    readonly options = input<ScrollerOptions | undefined>();

    /**
     * Callback to invoke in lazy mode to load new data.
     * @param {ScrollerLazyLoadEvent} event - Custom lazy load event.
     * @group Emits
     */
    readonly onLazyLoad = output<ScrollerLazyLoadEvent>();

    /**
     * Callback to invoke when scroll position changes.
     * @param {ScrollerScrollEvent} event - Custom scroll event.
     * @group Emits
     */
    readonly onScroll = output<ScrollerScrollEvent>();

    /**
     * Callback to invoke when scroll position and item's range in view changes.
     * @param {ScrollerScrollEvent} event - Custom scroll index change event.
     * @group Emits
     */
    readonly onScrollIndexChange = output<ScrollerScrollIndexChangeEvent>();

    readonly elementViewChild = viewChild<Nullable<ElementRef>>('element');

    readonly contentViewChild = viewChild<Nullable<ElementRef>>('content');

    /**
     * Content template of the component.
     * @param {ScrollerContentTemplateContext} context - content context.
     * @see {@link ScrollerContentTemplateContext}
     * @group Templates
     */
    readonly contentTemplate = contentChild<Nullable<TemplateRef<ScrollerContentTemplateContext>>>('content', { descendants: false });

    /**
     * Item template of the component.
     * @param {ScrollerItemTemplateContext} context - item context.
     * @see {@link ScrollerItemTemplateContext}
     * @group Templates
     */
    readonly itemTemplate = contentChild<Nullable<TemplateRef<ScrollerItemTemplateContext>>>('item', { descendants: false });

    /**
     * Loader template of the component.
     * @param {ScrollerLoaderTemplateContext} context - loader context.
     * @see {@link ScrollerLoaderTemplateContext}
     * @group Templates
     */
    readonly loaderTemplate = contentChild<Nullable<TemplateRef<ScrollerLoaderTemplateContext>>>('loader', { descendants: false });

    /**
     * Loader icon template of the component.
     * @param {ScrollerLoaderIconTemplateContext} context - loader icon context.
     * @see {@link ScrollerLoaderIconTemplateContext}
     * @group Templates
     */
    readonly loaderIconTemplate = contentChild<Nullable<TemplateRef<ScrollerLoaderIconTemplateContext>>>('loadericon', { descendants: false });

    readonly templates = contentChildren(PrimeTemplate);

    componentName = 'VirtualScroller';

    private readonly idInputEffect = this.createStoreEffect(
        () => this.id(),
        (v) => (this._id = v)
    );

    private readonly styleInputEffect = this.createStoreEffect(
        () => this.style(),
        (v) => (this._style = v)
    );

    private readonly styleClassInputEffect = this.createStoreEffect(
        () => this.styleClass(),
        (v) => (this._styleClass = v)
    );

    private readonly tabindexInputEffect = this.createStoreEffect(
        () => this.tabindex(),
        (v) => (this._tabindex = v)
    );

    private readonly itemsInputEffect = this.createStoreEffect(
        () => this.items(),
        (v) => (this._items = v)
    );

    private readonly itemSizeInputEffect = this.createStoreEffect(
        () => this.itemSize(),
        (v) => (this._itemSize = v)
    );

    private readonly scrollHeightInputEffect = this.createStoreEffect(
        () => this.scrollHeight(),
        (v) => (this._scrollHeight = v)
    );

    private readonly scrollWidthInputEffect = this.createStoreEffect(
        () => this.scrollWidth(),
        (v) => (this._scrollWidth = v)
    );

    private readonly orientationInputEffect = this.createStoreEffect(
        () => this.orientation(),
        (v) => (this._orientation = v)
    );

    private readonly stepInputEffect = this.createStoreEffect(
        () => this.step(),
        (v) => (this._step = v)
    );

    private readonly delayInputEffect = this.createStoreEffect(
        () => this.delay(),
        (v) => (this._delay = v)
    );

    private readonly resizeDelayInputEffect = this.createStoreEffect(
        () => this.resizeDelay(),
        (v) => (this._resizeDelay = v)
    );

    private readonly appendOnlyInputEffect = this.createStoreEffect(
        () => this.appendOnly(),
        (v) => (this._appendOnly = v)
    );

    private readonly inlineInputEffect = this.createStoreEffect(
        () => this.inline(),
        (v) => (this._inline = v)
    );

    private readonly lazyInputEffect = this.createStoreEffect(
        () => this.lazy(),
        (v) => (this._lazy = v)
    );

    private readonly disabledInputEffect = this.createStoreEffect(
        () => this.disabled(),
        (v) => (this._disabled = v)
    );

    private readonly loaderDisabledInputEffect = this.createStoreEffect(
        () => this.loaderDisabled(),
        (v) => (this._loaderDisabled = v)
    );

    private readonly columnsInputEffect = this.createStoreEffect(
        () => this.columns(),
        (v) => (this._columns = v)
    );

    private readonly showSpacerInputEffect = this.createStoreEffect(
        () => this.showSpacer(),
        (v) => (this._showSpacer = v)
    );

    private readonly showLoaderInputEffect = this.createStoreEffect(
        () => this.showLoader(),
        (v) => (this._showLoader = v)
    );

    private readonly numToleratedItemsInputEffect = this.createStoreEffect(
        () => this.numToleratedItems(),
        (v) => (this._numToleratedItems = v)
    );

    private readonly loadingInputEffect = this.createStoreEffect(
        () => this.loading(),
        (v) => (this._loading = v)
    );

    private readonly autoSizeInputEffect = this.createStoreEffect(
        () => this.autoSize(),
        (v) => (this._autoSize = v)
    );

    private readonly trackByInputEffect = this.createStoreEffect(
        () => this.trackBy(),
        (v) => (this._trackBy = v)
    );

    /** Mirrors the legacy `options` setter: copies each option into its `_x` backing field. */
    private readonly optionsInputEffect = effect(() => {
        const v = this.options();
        untracked(() => {
            this._options = v;
            if (v && typeof v === 'object') {
                Object.entries(v).forEach(([k, val]) => (this as any)[`_${k}`] !== val && ((this as any)[`_${k}`] = val));
            }
        });
    });

    @HostBinding('style.height') height: string;

    _id: string | undefined;

    _style: { [klass: string]: any } | null | undefined;

    _styleClass: string | undefined;

    _tabindex: number = 0;

    _items: any[] | undefined | null;

    _itemSize: number | number[] = 0;

    _scrollHeight: string | undefined;

    _scrollWidth: string | undefined;

    _orientation: 'vertical' | 'horizontal' | 'both' = 'vertical';

    _step: number = 0;

    _delay: number = 0;

    _resizeDelay: number = 10;

    _appendOnly: boolean = false;

    _inline: boolean = false;

    _lazy: boolean = false;

    _disabled: boolean = false;

    _loaderDisabled: boolean = false;

    _columns: any[] | undefined | null;

    _showSpacer: boolean = true;

    _showLoader: boolean = false;

    _numToleratedItems: any;

    _loading: boolean | undefined;

    _autoSize: boolean = false;

    _trackBy: any;

    _options: ScrollerOptions | undefined;

    d_loading: boolean = false;

    d_numToleratedItems: any;

    contentEl: any;

    /**
     * Effective content template: the `#content` content child, or the `pTemplate="content"`.
     */
    readonly $contentTemplate = computed(
        () =>
            this.contentTemplate() ??
            (this.templates()
                .filter((item) => item.getType() === 'content')
                .at(-1)?.template as TemplateRef<ScrollerContentTemplateContext> | undefined)
    );

    /**
     * Effective item template: the `#item` content child, or (legacy behavior) the last projected
     * pTemplate that is neither `content`, `loader` nor `loadericon`.
     */
    readonly $itemTemplate = computed(
        () =>
            this.itemTemplate() ??
            (this.templates()
                .filter((item) => item.getType() !== 'content' && item.getType() !== 'loader' && item.getType() !== 'loadericon')
                .at(-1)?.template as TemplateRef<ScrollerItemTemplateContext> | undefined)
    );

    /** Effective loader template: the `#loader` content child, or the `pTemplate="loader"`. */
    readonly $loaderTemplate = computed(
        () =>
            this.loaderTemplate() ??
            (this.templates()
                .filter((item) => item.getType() === 'loader')
                .at(-1)?.template as TemplateRef<ScrollerLoaderTemplateContext> | undefined)
    );

    /** Effective loader icon template: the `#loadericon` content child, or the `pTemplate="loadericon"`. */
    readonly $loaderIconTemplate = computed(
        () =>
            this.loaderIconTemplate() ??
            (this.templates()
                .filter((item) => item.getType() === 'loadericon')
                .at(-1)?.template as TemplateRef<ScrollerLoaderIconTemplateContext> | undefined)
    );

    first: any = 0;

    last: any = 0;

    page: number = 0;

    isRangeChanged: boolean = false;

    numItemsInViewport: any = 0;

    lastScrollPos: any = 0;

    lazyLoadState: any = {};

    loaderArr: any[] = [];

    spacerStyle: { [klass: string]: any } | null | undefined = {};

    contentStyle: { [klass: string]: any } | null | undefined = {};

    scrollTimeout: any;

    resizeTimeout: any;

    initialized: boolean = false;

    windowResizeListener: VoidListener;

    defaultWidth: number | undefined;

    defaultHeight: number | undefined;

    defaultContentWidth: number | undefined;

    defaultContentHeight: number | undefined;

    _contentStyleClass: any;

    get contentStyleClass() {
        return this._contentStyleClass;
    }

    set contentStyleClass(val) {
        this._contentStyleClass = val;
    }

    get vertical() {
        return this._orientation === 'vertical';
    }

    get horizontal() {
        return this._orientation === 'horizontal';
    }

    get both() {
        return this._orientation === 'both';
    }

    get loadedItems() {
        if (this._items && !this.d_loading) {
            if (this.both) {
                return this._items.slice(this._appendOnly ? 0 : this.first.rows, this.last.rows).map((item) => {
                    if (this._columns) {
                        return item;
                    } else if (Array.isArray(item)) {
                        return item.slice(this._appendOnly ? 0 : this.first.cols, this.last.cols);
                    } else {
                        return item;
                    }
                });
            } else if (this.horizontal && this._columns) return this._items;
            else return this._items.slice(this._appendOnly ? 0 : this.first, this.last);
        }

        return [];
    }

    get loadedRows() {
        return this.d_loading ? (this._loaderDisabled ? this.loaderArr : []) : this.loadedItems;
    }

    get loadedColumns() {
        if (this._columns && (this.both || this.horizontal)) {
            return this.d_loading && this._loaderDisabled ? (this.both ? this.loaderArr[0] : this.loaderArr) : this._columns.slice(this.both ? this.first.cols : this.first, this.both ? this.last.cols : this.last);
        }

        return this._columns;
    }

    private previousInputValues: { loading?: any; orientation?: any; numToleratedItems?: any; options?: ScrollerOptions; items?: any[] | null; itemSize?: any; scrollHeight?: any; scrollWidth?: any } = {};

    /**
     * Reacts to input changes exactly like the legacy ngOnChanges hook did, tracking previous
     * values itself. Declared after the per-input store effects so the `_x` store is already
     * patched when this runs.
     */
    private readonly inputChangesEffect = effect(() => {
        const current = {
            loading: this.loading(),
            orientation: this.orientation(),
            numToleratedItems: this.numToleratedItems(),
            options: this.options(),
            items: this.items(),
            itemSize: this.itemSize(),
            scrollHeight: this.scrollHeight(),
            scrollWidth: this.scrollWidth()
        };

        untracked(() => {
            const previous = this.previousInputValues;
            const changed = (key: keyof typeof current) => current[key] !== previous[key];
            let isLoadingChanged = false;

            if (this._scrollHeight == '100%') {
                this.height = '100%';
            }

            if (changed('loading')) {
                if (this._lazy && current.loading !== this.d_loading) {
                    this.d_loading = current.loading as boolean;
                    isLoadingChanged = true;
                }
            }

            if (changed('orientation')) {
                this.lastScrollPos = this.both ? { top: 0, left: 0 } : 0;
            }

            if (changed('numToleratedItems')) {
                if (current.numToleratedItems !== this.d_numToleratedItems) {
                    this.d_numToleratedItems = current.numToleratedItems;
                }
            }

            if (changed('options')) {
                if (this._lazy && previous.options?.loading !== current.options?.loading && current.options?.loading !== this.d_loading) {
                    this.d_loading = current.options?.loading as boolean;
                    isLoadingChanged = true;
                }

                if (previous.options?.numToleratedItems !== current.options?.numToleratedItems && current.options?.numToleratedItems !== this.d_numToleratedItems) {
                    this.d_numToleratedItems = current.options?.numToleratedItems;
                }
            }

            if (this.initialized) {
                const isChanged = !isLoadingChanged && ((changed('items') && previous.items?.length !== current.items?.length) || changed('itemSize') || changed('scrollHeight') || changed('scrollWidth'));

                if (isChanged) {
                    this.init();
                }
            }

            this.previousInputValues = current;
        });
    });

    constructor() {
        super();
        // Re-apply the host pass-through section after each render and retry the deferred view
        // initialization until the element becomes visible (replaces the former ngAfterViewChecked
        // hook).
        afterEveryRender(() => {
            this.bindDirectiveInstance.setAttrs(this.ptm('host'));
            if (!this.initialized) {
                this.viewInit();
            }
        });

        // Kick off the initial view measurement after the first render (replaces the former
        // ngAfterViewInit hook).
        afterNextRender(() => {
            Promise.resolve().then(() => {
                this.viewInit();
            });
        });
    }

    onInit() {
        // The legacy input setters had already patched the `_x` store by the time ngOnInit ran;
        // the store effects only flush after the first template pass, so sync eagerly here.
        this.syncStoreFromInputs();
        this.setInitialState();
    }

    onDestroy() {
        this.unbindResizeListener();

        this.contentEl = null;
        this.initialized = false;
    }

    /**
     * Per-input effects patching the `_x` backing store (replace the legacy getter/setter pairs).
     * The first run skips undefined so options-patched values survive unbound inputs; later
     * writes flow through verbatim (a bound input set back to undefined clears the store, exactly
     * like the legacy setters). The `options` effect is declared LAST so a bound options object
     * keeps winning over the individual inputs within the initial change, like the legacy setter
     * ordering.
     */
    private createStoreEffect(read: () => any, write: (value: any) => void) {
        let ran = false;
        return effect(() => {
            const value = read();
            if (!ran) {
                ran = true;
                if (value === undefined) {
                    return;
                }
            }
            untracked(() => write(value));
        });
    }

    /** Copies every bound input into its `_x` backing field (the options object last, like the legacy setter order). */
    private syncStoreFromInputs() {
        const assign = (value: any, write: (value: any) => void) => {
            if (value !== undefined) {
                write(value);
            }
        };

        assign(this.id(), (v) => (this._id = v));
        assign(this.style(), (v) => (this._style = v));
        assign(this.styleClass(), (v) => (this._styleClass = v));
        assign(this.tabindex(), (v) => (this._tabindex = v));
        assign(this.items(), (v) => (this._items = v));
        assign(this.itemSize(), (v) => (this._itemSize = v));
        assign(this.scrollHeight(), (v) => (this._scrollHeight = v));
        assign(this.scrollWidth(), (v) => (this._scrollWidth = v));
        assign(this.orientation(), (v) => (this._orientation = v));
        assign(this.step(), (v) => (this._step = v));
        assign(this.delay(), (v) => (this._delay = v));
        assign(this.resizeDelay(), (v) => (this._resizeDelay = v));
        assign(this.appendOnly(), (v) => (this._appendOnly = v));
        assign(this.inline(), (v) => (this._inline = v));
        assign(this.lazy(), (v) => (this._lazy = v));
        assign(this.disabled(), (v) => (this._disabled = v));
        assign(this.loaderDisabled(), (v) => (this._loaderDisabled = v));
        assign(this.columns(), (v) => (this._columns = v));
        assign(this.showSpacer(), (v) => (this._showSpacer = v));
        assign(this.showLoader(), (v) => (this._showLoader = v));
        assign(this.numToleratedItems(), (v) => (this._numToleratedItems = v));
        assign(this.loading(), (v) => (this._loading = v));
        assign(this.autoSize(), (v) => (this._autoSize = v));
        assign(this.trackBy(), (v) => (this._trackBy = v));

        const options = this.options();
        this._options = options;
        if (options && typeof options === 'object') {
            Object.entries(options).forEach(([k, val]) => (this as any)[`_${k}`] !== val && ((this as any)[`_${k}`] = val));
        }
    }

    viewInit() {
        if (isPlatformBrowser(this.platformId) && !this.initialized) {
            const elementViewChild = this.elementViewChild();
            if (isVisible(elementViewChild?.nativeElement)) {
                this.setInitialState();
                this.setContentEl(this.contentEl);
                this.init();

                this.defaultWidth = getWidth(elementViewChild?.nativeElement);
                this.defaultHeight = getHeight(elementViewChild?.nativeElement);
                this.defaultContentWidth = getWidth(this.contentEl);
                this.defaultContentHeight = getHeight(this.contentEl);
                this.initialized = true;
            }
        }
    }

    init() {
        if (!this._disabled) {
            this.bindResizeListener();

            // wait for the next tick
            setTimeout(() => {
                this.setSpacerSize();
                this.setSize();
                this.calculateOptions();
                this.calculateAutoSize();
                this.cd.detectChanges();
            }, 1);
        }
    }

    setContentEl(el?: HTMLElement) {
        this.contentEl = el || this.contentViewChild()?.nativeElement || findSingle(this.elementViewChild()?.nativeElement, '.p-virtualscroller-content');
    }

    setInitialState() {
        this.first = this.both ? { rows: 0, cols: 0 } : 0;
        this.last = this.both ? { rows: 0, cols: 0 } : 0;
        this.numItemsInViewport = this.both ? { rows: 0, cols: 0 } : 0;
        this.lastScrollPos = this.both ? { top: 0, left: 0 } : 0;
        if (this.d_loading === undefined || this.d_loading === false) {
            this.d_loading = this._loading || false;
        }
        this.d_numToleratedItems = this._numToleratedItems;
        this.loaderArr = this.loaderArr.length > 0 ? this.loaderArr : [];
    }

    getElementRef() {
        return this.elementViewChild();
    }

    getPageByFirst(first?: any) {
        return Math.floor(((first ?? this.first) + this.d_numToleratedItems * 4) / (this._step || 1));
    }

    isPageChanged(first?: any) {
        return this._step ? this.page !== this.getPageByFirst(first ?? this.first) : true;
    }

    scrollTo(options: ScrollToOptions) {
        // this.lastScrollPos = this.both ? { top: 0, left: 0 } : 0;
        this.elementViewChild()?.nativeElement?.scrollTo(options);
    }

    scrollToIndex(index: number | number[], behavior: ScrollBehavior = 'auto') {
        const valid = this.both ? (index as number[]).every((i) => i > -1) : (index as number) > -1;

        if (valid) {
            const first = this.first;
            const { scrollTop = 0, scrollLeft = 0 } = this.elementViewChild()?.nativeElement;
            const { numToleratedItems } = this.calculateNumItems();
            const contentPos = this.getContentPosition();
            const itemSize = this._itemSize;
            const calculateFirst = (_index = 0, _numT) => (_index <= _numT ? 0 : _index);
            const calculateCoord = (_first, _size, _cpos) => _first * _size + _cpos;
            const scrollTo = (left = 0, top = 0) => this.scrollTo({ left, top, behavior });
            let newFirst = this.both ? { rows: 0, cols: 0 } : 0;
            let isRangeChanged = false,
                isScrollChanged = false;

            if (this.both) {
                newFirst = {
                    rows: calculateFirst(index[0], numToleratedItems[0]),
                    cols: calculateFirst(index[1], numToleratedItems[1])
                };
                scrollTo(calculateCoord(newFirst.cols, itemSize[1], contentPos.left), calculateCoord(newFirst.rows, itemSize[0], contentPos.top));
                isScrollChanged = this.lastScrollPos.top !== scrollTop || this.lastScrollPos.left !== scrollLeft;
                isRangeChanged = newFirst.rows !== first.rows || newFirst.cols !== first.cols;
            } else {
                newFirst = calculateFirst(index as number, numToleratedItems);
                this.horizontal ? scrollTo(calculateCoord(newFirst, itemSize, contentPos.left), scrollTop) : scrollTo(scrollLeft, calculateCoord(newFirst, itemSize, contentPos.top));
                isScrollChanged = this.lastScrollPos !== (this.horizontal ? scrollLeft : scrollTop);
                isRangeChanged = newFirst !== first;
            }

            this.isRangeChanged = isRangeChanged;
            isScrollChanged && (this.first = newFirst);
        }
    }

    scrollInView(index: number, to: ScrollerToType, behavior: ScrollBehavior = 'auto') {
        if (to) {
            const { first, viewport } = this.getRenderedRange();
            const scrollTo = (left = 0, top = 0) => this.scrollTo({ left, top, behavior });
            const isToStart = to === 'to-start';
            const isToEnd = to === 'to-end';

            if (isToStart) {
                if (this.both) {
                    if (viewport.first.rows - first.rows > (<any>index)[0]) {
                        scrollTo(viewport.first.cols * (<number[]>this._itemSize)[1], (viewport.first.rows - 1) * (<number[]>this._itemSize)[0]);
                    } else if (viewport.first.cols - first.cols > (<any>index)[1]) {
                        scrollTo((viewport.first.cols - 1) * (<number[]>this._itemSize)[1], viewport.first.rows * (<number[]>this._itemSize)[0]);
                    }
                } else {
                    if (viewport.first - first > index) {
                        const pos = (viewport.first - 1) * <number>this._itemSize;
                        this.horizontal ? scrollTo(pos, 0) : scrollTo(0, pos);
                    }
                }
            } else if (isToEnd) {
                if (this.both) {
                    if (viewport.last.rows - first.rows <= (<any>index)[0] + 1) {
                        scrollTo(viewport.first.cols * (<number[]>this._itemSize)[1], (viewport.first.rows + 1) * (<number[]>this._itemSize)[0]);
                    } else if (viewport.last.cols - first.cols <= (<any>index)[1] + 1) {
                        scrollTo((viewport.first.cols + 1) * (<number[]>this._itemSize)[1], viewport.first.rows * (<number[]>this._itemSize)[0]);
                    }
                } else {
                    if (viewport.last - first <= index + 1) {
                        const pos = (viewport.first + 1) * <number>this._itemSize;
                        this.horizontal ? scrollTo(pos, 0) : scrollTo(0, pos);
                    }
                }
            }
        } else {
            this.scrollToIndex(index, behavior);
        }
    }

    getRenderedRange() {
        const calculateFirstInViewport = (_pos: number, _size: number) => (_size || _pos ? Math.floor(_pos / (_size || _pos)) : 0);

        let firstInViewport = this.first;
        let lastInViewport: any = 0;

        const elementViewChild = this.elementViewChild();
        if (elementViewChild?.nativeElement) {
            const { scrollTop, scrollLeft } = elementViewChild.nativeElement;

            if (this.both) {
                firstInViewport = {
                    rows: calculateFirstInViewport(scrollTop, (<number[]>this._itemSize)[0]),
                    cols: calculateFirstInViewport(scrollLeft, (<number[]>this._itemSize)[1])
                };
                lastInViewport = {
                    rows: firstInViewport.rows + this.numItemsInViewport.rows,
                    cols: firstInViewport.cols + this.numItemsInViewport.cols
                };
            } else {
                const scrollPos = this.horizontal ? scrollLeft : scrollTop;
                firstInViewport = calculateFirstInViewport(scrollPos, <number>this._itemSize);
                lastInViewport = firstInViewport + this.numItemsInViewport;
            }
        }

        return {
            first: this.first,
            last: this.last,
            viewport: {
                first: firstInViewport,
                last: lastInViewport
            }
        };
    }

    calculateNumItems() {
        const contentPos = this.getContentPosition();
        const elementViewChild = this.elementViewChild();
        const contentWidth = (elementViewChild?.nativeElement ? elementViewChild.nativeElement.offsetWidth - contentPos.left : 0) || 0;
        const elementViewChildValue = this.elementViewChild();
        const contentHeight = (elementViewChildValue?.nativeElement ? elementViewChildValue.nativeElement.offsetHeight - contentPos.top : 0) || 0;
        const calculateNumItemsInViewport = (_contentSize: number, _itemSize: number) => (_itemSize || _contentSize ? Math.ceil(_contentSize / (_itemSize || _contentSize)) : 0);
        const calculateNumToleratedItems = (_numItems: number) => Math.ceil(_numItems / 2);
        const numItemsInViewport: any = this.both
            ? {
                  rows: calculateNumItemsInViewport(contentHeight, (<number[]>this._itemSize)[0]),
                  cols: calculateNumItemsInViewport(contentWidth, (<number[]>this._itemSize)[1])
              }
            : calculateNumItemsInViewport(this.horizontal ? contentWidth : contentHeight, <number>this._itemSize);

        const numToleratedItems = this.d_numToleratedItems || (this.both ? [calculateNumToleratedItems(numItemsInViewport.rows), calculateNumToleratedItems(numItemsInViewport.cols)] : calculateNumToleratedItems(numItemsInViewport));

        return { numItemsInViewport, numToleratedItems };
    }

    calculateOptions() {
        const { numItemsInViewport, numToleratedItems } = this.calculateNumItems();
        const calculateLast = (_first: number, _num: number, _numT: number, _isCols: boolean = false) => this.getLast(_first + _num + (_first < _numT ? 2 : 3) * _numT, _isCols);
        const first = this.first;
        const last = this.both
            ? {
                  rows: calculateLast(this.first.rows, numItemsInViewport.rows, numToleratedItems[0]),
                  cols: calculateLast(this.first.cols, numItemsInViewport.cols, numToleratedItems[1], true)
              }
            : calculateLast(this.first, numItemsInViewport, numToleratedItems);

        this.last = last;
        this.numItemsInViewport = numItemsInViewport;
        this.d_numToleratedItems = numToleratedItems;

        if (this._showLoader) {
            this.loaderArr = this.both ? Array.from({ length: numItemsInViewport.rows }).map(() => Array.from({ length: numItemsInViewport.cols })) : Array.from({ length: numItemsInViewport });
        }

        if (this._lazy) {
            Promise.resolve().then(() => {
                this.lazyLoadState = {
                    first: this._step ? (this.both ? { rows: 0, cols: first.cols } : 0) : first,
                    last: Math.min(this._step ? this._step : this.last, (<any[]>this._items).length)
                };

                this.handleEvents('onLazyLoad', this.lazyLoadState);
            });
        }
    }

    calculateAutoSize() {
        if (this._autoSize && !this.d_loading) {
            Promise.resolve().then(() => {
                if (this.contentEl) {
                    this.contentEl.style.minHeight = this.contentEl.style.minWidth = 'auto';
                    this.contentEl.style.position = 'relative';
                    (<ElementRef>this.elementViewChild()).nativeElement.style.contain = 'none';

                    const [contentWidth, contentHeight] = [getWidth(this.contentEl), getHeight(this.contentEl)];
                    contentWidth !== this.defaultContentWidth && ((<ElementRef>this.elementViewChild()).nativeElement.style.width = '');
                    contentHeight !== this.defaultContentHeight && ((<ElementRef>this.elementViewChild()).nativeElement.style.height = '');

                    const [width, height] = [getWidth((<ElementRef>this.elementViewChild()).nativeElement), getHeight((<ElementRef>this.elementViewChild()).nativeElement)];
                    (this.both || this.horizontal) && ((<ElementRef>this.elementViewChild()).nativeElement.style.width = width < <number>this.defaultWidth ? width + 'px' : this._scrollWidth || this.defaultWidth + 'px');
                    (this.both || this.vertical) && ((<ElementRef>this.elementViewChild()).nativeElement.style.height = height < <number>this.defaultHeight ? height + 'px' : this._scrollHeight || this.defaultHeight + 'px');

                    this.contentEl.style.minHeight = this.contentEl.style.minWidth = '';
                    this.contentEl.style.position = '';
                    (<ElementRef>this.elementViewChild()).nativeElement.style.contain = '';
                }
            });
        }
    }

    getLast(last = 0, isCols = false) {
        return this._items ? Math.min(isCols ? (this._columns || this._items[0]).length : this._items.length, last) : 0;
    }

    getContentPosition() {
        if (this.contentEl) {
            const style = getComputedStyle(this.contentEl);
            const left = parseFloat(style.paddingLeft) + Math.max(parseFloat(style.left) || 0, 0);
            const right = parseFloat(style.paddingRight) + Math.max(parseFloat(style.right) || 0, 0);
            const top = parseFloat(style.paddingTop) + Math.max(parseFloat(style.top) || 0, 0);
            const bottom = parseFloat(style.paddingBottom) + Math.max(parseFloat(style.bottom) || 0, 0);

            return { left, right, top, bottom, x: left + right, y: top + bottom };
        }

        return { left: 0, right: 0, top: 0, bottom: 0, x: 0, y: 0 };
    }

    setSize() {
        const elementViewChild = this.elementViewChild();
        if (elementViewChild?.nativeElement) {
            const nativeElement = elementViewChild.nativeElement;
            const parentElement = nativeElement.parentElement?.parentElement;

            const elementWidth = nativeElement.offsetWidth;
            const parentWidth = parentElement?.offsetWidth || 0;
            const width = this._scrollWidth || `${elementWidth || parentWidth}px`;

            const elementHeight = nativeElement.offsetHeight;
            const parentHeight = parentElement?.offsetHeight || 0;
            const height = this._scrollHeight || `${elementHeight || parentHeight}px`;

            const setProp = (_name: string, _value: any) => (nativeElement.style[_name] = _value);

            if (this.both || this.horizontal) {
                setProp('height', height);
                setProp('width', width);
            } else {
                setProp('height', height);
            }
        }
    }

    setSpacerSize() {
        if (this._items) {
            const contentPos = this.getContentPosition();
            const setProp = (_name: string, _value: any, _size: number, _cpos: number = 0) =>
                (this.spacerStyle = {
                    ...this.spacerStyle,
                    ...{ [`${_name}`]: (_value || []).length * _size + _cpos + 'px' }
                });

            if (this.both) {
                setProp('height', this._items, (<number[]>this._itemSize)[0], contentPos.y);
                setProp('width', this._columns || this._items[1], (<number[]>this._itemSize)[1], contentPos.x);
            } else {
                this.horizontal ? setProp('width', this._columns || this._items, <number>this._itemSize, contentPos.x) : setProp('height', this._items, <number>this._itemSize, contentPos.y);
            }
        }
    }

    setContentPosition(pos: any) {
        if (this.contentEl && !this._appendOnly) {
            const first = pos ? pos.first : this.first;
            const calculateTranslateVal = (_first: number, _size: number) => _first * _size;
            const setTransform = (_x = 0, _y = 0) => (this.contentStyle = { ...this.contentStyle, ...{ transform: `translate3d(${_x}px, ${_y}px, 0)` } });

            if (this.both) {
                setTransform(calculateTranslateVal(first.cols, (<number[]>this._itemSize)[1]), calculateTranslateVal(first.rows, (<number[]>this._itemSize)[0]));
            } else {
                const translateVal = calculateTranslateVal(first, <number>this._itemSize);
                this.horizontal ? setTransform(translateVal, 0) : setTransform(0, translateVal);
            }
        }
    }

    onScrollPositionChange(event: Event) {
        const target = event.target;
        if (!target) {
            throw new Error('Event target is null');
        }
        const contentPos = this.getContentPosition();
        const calculateScrollPos = (_pos: number, _cpos: number) => (_pos ? (_pos > _cpos ? _pos - _cpos : _pos) : 0);
        const calculateCurrentIndex = (_pos: number, _size: number) => (_size || _pos ? Math.floor(_pos / (_size || _pos)) : 0);
        const calculateTriggerIndex = (_currentIndex: number, _first: number, _last: number, _num: number, _numT: number, _isScrollDownOrRight: any) => {
            return _currentIndex <= _numT ? _numT : _isScrollDownOrRight ? _last - _num - _numT : _first + _numT - 1;
        };
        const calculateFirst = (_currentIndex: number, _triggerIndex: number, _first: number, _last: number, _num: number, _numT: number, _isScrollDownOrRight: any) => {
            if (_currentIndex <= _numT) return 0;
            else return Math.max(0, _isScrollDownOrRight ? (_currentIndex < _triggerIndex ? _first : _currentIndex - _numT) : _currentIndex > _triggerIndex ? _first : _currentIndex - 2 * _numT);
        };
        const calculateLast = (_currentIndex: number, _first: number, _last: number, _num: number, _numT: number, _isCols = false) => {
            let lastValue = _first + _num + 2 * _numT;

            if (_currentIndex >= _numT) {
                lastValue += _numT + 1;
            }

            return this.getLast(lastValue, _isCols);
        };

        const scrollTop = calculateScrollPos((<HTMLElement>target).scrollTop, contentPos.top);
        const scrollLeft = calculateScrollPos((<HTMLElement>target).scrollLeft, contentPos.left);

        let newFirst = this.both ? { rows: 0, cols: 0 } : 0;
        let newLast = this.last;
        let isRangeChanged = false;
        let newScrollPos = this.lastScrollPos;

        if (this.both) {
            const isScrollDown = this.lastScrollPos.top <= scrollTop;
            const isScrollRight = this.lastScrollPos.left <= scrollLeft;

            if (!this._appendOnly || (this._appendOnly && (isScrollDown || isScrollRight))) {
                const currentIndex = {
                    rows: calculateCurrentIndex(scrollTop, (<number[]>this._itemSize)[0]),
                    cols: calculateCurrentIndex(scrollLeft, (<number[]>this._itemSize)[1])
                };
                const triggerIndex = {
                    rows: calculateTriggerIndex(currentIndex.rows, this.first.rows, this.last.rows, this.numItemsInViewport.rows, this.d_numToleratedItems[0], isScrollDown),
                    cols: calculateTriggerIndex(currentIndex.cols, this.first.cols, this.last.cols, this.numItemsInViewport.cols, this.d_numToleratedItems[1], isScrollRight)
                };

                newFirst = {
                    rows: calculateFirst(currentIndex.rows, triggerIndex.rows, this.first.rows, this.last.rows, this.numItemsInViewport.rows, this.d_numToleratedItems[0], isScrollDown),
                    cols: calculateFirst(currentIndex.cols, triggerIndex.cols, this.first.cols, this.last.cols, this.numItemsInViewport.cols, this.d_numToleratedItems[1], isScrollRight)
                };
                newLast = {
                    rows: calculateLast(currentIndex.rows, newFirst.rows, this.last.rows, this.numItemsInViewport.rows, this.d_numToleratedItems[0]),
                    cols: calculateLast(currentIndex.cols, newFirst.cols, this.last.cols, this.numItemsInViewport.cols, this.d_numToleratedItems[1], true)
                };

                isRangeChanged = newFirst.rows !== this.first.rows || newLast.rows !== this.last.rows || newFirst.cols !== this.first.cols || newLast.cols !== this.last.cols || this.isRangeChanged;
                newScrollPos = { top: scrollTop, left: scrollLeft };
            }
        } else {
            const scrollPos = this.horizontal ? scrollLeft : scrollTop;
            const isScrollDownOrRight = this.lastScrollPos <= scrollPos;

            if (!this._appendOnly || (this._appendOnly && isScrollDownOrRight)) {
                const currentIndex = calculateCurrentIndex(scrollPos, <number>this._itemSize);
                const triggerIndex = calculateTriggerIndex(currentIndex, this.first, this.last, this.numItemsInViewport, this.d_numToleratedItems, isScrollDownOrRight);

                newFirst = calculateFirst(currentIndex, triggerIndex, this.first, this.last, this.numItemsInViewport, this.d_numToleratedItems, isScrollDownOrRight);
                newLast = calculateLast(currentIndex, newFirst, this.last, this.numItemsInViewport, this.d_numToleratedItems);
                isRangeChanged = newFirst !== this.first || newLast !== this.last || this.isRangeChanged;
                newScrollPos = scrollPos;
            }
        }

        return {
            first: newFirst,
            last: newLast,
            isRangeChanged,
            scrollPos: newScrollPos
        };
    }

    onScrollChange(event: Event) {
        const { first, last, isRangeChanged, scrollPos } = this.onScrollPositionChange(event);

        if (isRangeChanged) {
            const newState = { first, last };

            this.setContentPosition(newState);

            // When the range moves anywhere other than one page forward (a backward scroll or a
            // multi-page jump), the page before the landing page can still be (partially) visible
            // through the tolerated items, so it must be included in the lazy load request.
            const currentPage = this.getPageByFirst(first);
            const previousPage = this.getPageByFirst(this.first);
            const loadPreviousPage = currentPage !== previousPage && currentPage !== previousPage + 1;

            this.first = first;
            this.last = last;
            this.lastScrollPos = scrollPos;

            this.handleEvents('onScrollIndexChange', newState);

            if (this._lazy && this.isPageChanged(first)) {
                const lazyLoadState = {
                    first: this._step ? Math.max(0, Math.min((currentPage - (loadPreviousPage ? 1 : 0)) * this._step, (<any[]>this._items).length - this._step)) : first,
                    last: Math.min(this._step ? (currentPage + 1) * this._step : last, (<any[]>this._items).length)
                };
                const isLazyStateChanged = lazyLoadState.first < this.lazyLoadState.first || lazyLoadState.last > this.lazyLoadState.last;

                isLazyStateChanged && this.handleEvents('onLazyLoad', lazyLoadState);
                this.lazyLoadState = lazyLoadState;
            }
        }
    }

    onContainerScroll(event: Event) {
        this.handleEvents('onScroll', { originalEvent: event });

        if (this._delay) {
            if (this.scrollTimeout) {
                clearTimeout(this.scrollTimeout);
            }

            if (!this.d_loading && this._showLoader) {
                const { isRangeChanged } = this.onScrollPositionChange(event);
                const changed = isRangeChanged || (this._step ? this.isPageChanged() : false);

                if (changed) {
                    this.d_loading = true;

                    this.cd.detectChanges();
                }
            }

            this.scrollTimeout = setTimeout(() => {
                this.onScrollChange(event);

                if (this.d_loading && this._showLoader && (!this._lazy || this._loading === undefined)) {
                    this.d_loading = false;
                    this.page = this.getPageByFirst();
                }
                this.cd.detectChanges();
            }, this._delay);
        } else {
            !this.d_loading && this.onScrollChange(event);
        }
    }

    bindResizeListener() {
        if (isPlatformBrowser(this.platformId)) {
            if (!this.windowResizeListener) {
                this.zone.runOutsideAngular(() => {
                    const window = this.document.defaultView as Window;
                    const event = isTouchDevice() ? 'orientationchange' : 'resize';
                    this.windowResizeListener = this.renderer.listen(window, event, this.onWindowResize.bind(this));
                });
            }
        }
    }

    unbindResizeListener() {
        if (this.windowResizeListener) {
            this.windowResizeListener();
            this.windowResizeListener = null;
        }
    }

    onWindowResize() {
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
        }

        this.resizeTimeout = setTimeout(() => {
            const elementViewChild = this.elementViewChild();
            if (isVisible(elementViewChild?.nativeElement)) {
                const [width, height] = [getWidth(elementViewChild?.nativeElement), getHeight(elementViewChild?.nativeElement)];
                const [isDiffWidth, isDiffHeight] = [width !== this.defaultWidth, height !== this.defaultHeight];
                const reinit = this.both ? isDiffWidth || isDiffHeight : this.horizontal ? isDiffWidth : this.vertical ? isDiffHeight : false;

                reinit &&
                    this.zone.run(() => {
                        this.d_numToleratedItems = this._numToleratedItems;
                        this.defaultWidth = width;
                        this.defaultHeight = height;
                        this.defaultContentWidth = getWidth(this.contentEl);
                        this.defaultContentHeight = getHeight(this.contentEl);

                        this.init();
                    });
            }
        }, this._resizeDelay);
    }

    handleEvents(name: string, params: any) {
        //@ts-ignore
        return this._options && (<any>this._options)[name] ? (<any>this._options)[name](params) : this[name].emit(params);
    }

    getContentOptions() {
        return {
            contentStyleClass: `p-virtualscroller-content ${this.d_loading ? 'p-virtualscroller-loading' : ''}`,
            items: this.loadedItems,
            getItemOptions: (index: number) => this.getOptions(index),
            loading: this.d_loading,
            getLoaderOptions: (index: number, options?: any) => this.getLoaderOptions(index, options),
            itemSize: this._itemSize,
            rows: this.loadedRows,
            columns: this.loadedColumns,
            spacerStyle: this.spacerStyle,
            contentStyle: this.contentStyle,
            vertical: this.vertical,
            horizontal: this.horizontal,
            both: this.both,
            scrollTo: this.scrollTo.bind(this),
            scrollToIndex: this.scrollToIndex.bind(this),
            orientation: this._orientation,
            scrollableElement: this.elementViewChild()?.nativeElement
        };
    }

    getOptions(renderedIndex: number) {
        const count = (this._items || []).length;
        const index = this.both ? this.first.rows + renderedIndex : this.first + renderedIndex;

        return {
            index,
            count,
            first: index === 0,
            last: index === count - 1,
            even: index % 2 === 0,
            odd: index % 2 !== 0
        };
    }

    getLoaderOptions(index: number, extOptions: any) {
        const count = this.loaderArr.length;

        return {
            index,
            count,
            first: index === 0,
            last: index === count - 1,
            even: index % 2 === 0,
            odd: index % 2 !== 0,
            loading: this.d_loading,
            ...extOptions
        };
    }
}

@NgModule({
    imports: [Scroller, SharedModule],
    exports: [Scroller, SharedModule]
})
export class ScrollerModule {}
