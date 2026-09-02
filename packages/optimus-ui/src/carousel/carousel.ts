import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
    afterEveryRender,
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    ElementRef,
    inject,
    input,
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
import { addClass, find, findSingle, getAttribute, removeClass, setAttribute, uuid } from '@openng/optimus-ui-utils';
import { Footer, Header, PrimeTemplate, SharedModule } from '@openng/optimus-ui/api';
import { BaseComponent, PARENT_INSTANCE } from '@openng/optimus-ui/basecomponent';
import { Bind, BindModule } from '@openng/optimus-ui/bind';
import { ButtonModule, ButtonProps } from '@openng/optimus-ui/button';
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon } from '@openng/optimus-ui/icons';
import { CarouselItemTemplateContext, CarouselPageEvent, CarouselResponsiveOptions } from '@openng/optimus-ui/types/carousel';
import { CarouselStyle } from './style/carouselstyle';

/**
 * Carousel is a content slider featuring various customization options.
 * @group Components
 */
@Component({
    selector: 'p-carousel',
    standalone: true,
    imports: [CommonModule, ChevronRightIcon, ButtonModule, ChevronLeftIcon, ChevronDownIcon, ChevronUpIcon, SharedModule, BindModule],
    template: `
        <div [class]="cx('header')" *ngIf="headerFacet() || headerTemplate()" [pBind]="ptm('header')">
            <ng-content select="p-header"></ng-content>
            <ng-container *ngTemplateOutlet="headerTemplate()"></ng-container>
        </div>
        <div [class]="contentClass()" [ngClass]="cx('contentContainer')" [pBind]="ptm('contentContainer')">
            <div [class]="cx('content')" [attr.aria-live]="allowAutoplay() ? 'polite' : 'off'" [pBind]="ptm('content')">
                <p-button
                    *ngIf="showNavigators()"
                    [class]="cx('pcPrevButton')"
                    [attr.aria-label]="ariaPrevButtonLabel()"
                    (click)="navBackward($event)"
                    [text]="true"
                    [buttonProps]="prevButtonProps()"
                    [pt]="ptm('pcPrevButton')"
                    [unstyled]="unstyled()"
                    attr.data-pc-group-section="navigator"
                >
                    <ng-template #icon>
                        <ng-container *ngIf="!$previousIconTemplate() && !prevButtonProps()?.icon">
                            <svg data-p-icon="chevron-left" *ngIf="!isVertical()" />
                            <svg data-p-icon="chevron-up" *ngIf="isVertical()" />
                        </ng-container>
                        <ng-container *ngIf="$previousIconTemplate() && !prevButtonProps()?.icon">
                            <ng-template *ngTemplateOutlet="$previousIconTemplate()"></ng-template>
                        </ng-container>
                    </ng-template>
                </p-button>
                <div [class]="cx('viewport')" [ngStyle]="{ height: isVertical() ? verticalViewPortHeight() : 'auto' }" (touchend)="onTouchEnd($event)" (touchstart)="onTouchStart($event)" (touchmove)="onTouchMove($event)" [pBind]="ptm('viewport')">
                    <div #itemsContainer [class]="cx('itemList')" (transitionend)="onTransitionEnd()" [pBind]="ptm('itemList')">
                        <div
                            *ngFor="let item of clonedItemsForStarting; let index = index"
                            [class]="cx('itemClone', { index })"
                            [attr.aria-hidden]="!(totalShiftedItems * -1 === value()!.length)"
                            [attr.aria-label]="ariaSlideNumber(index)"
                            [attr.aria-roledescription]="ariaSlideLabel()"
                            [attr.data-p-carousel-item-active]="totalShiftedItems * -1 === value()!.length + _numVisible"
                            [attr.data-p-carousel-item-start]="index === 0"
                            [attr.data-p-carousel-item-end]="clonedItemsForStarting && clonedItemsForStarting.length - 1 === index"
                            [pBind]="ptm('itemClone')"
                        >
                            <ng-container *ngTemplateOutlet="$itemTemplate(); context: { $implicit: item }"></ng-container>
                        </div>
                        <div
                            *ngFor="let item of value(); let index = index"
                            [class]="cx('item', { index })"
                            role="group"
                            [attr.aria-hidden]="!(firstIndex() <= index && lastIndex() >= index)"
                            [attr.aria-label]="ariaSlideNumber(index)"
                            [attr.aria-roledescription]="ariaSlideLabel()"
                            [attr.data-p-carousel-item-active]="firstIndex() <= index && lastIndex() >= index"
                            [attr.data-p-carousel-item-start]="firstIndex() === index"
                            [attr.data-p-carousel-item-end]="lastIndex() === index"
                            [pBind]="getItemPTOptions('item', index)"
                        >
                            <ng-container *ngTemplateOutlet="$itemTemplate(); context: { $implicit: item }"></ng-container>
                        </div>
                        <div
                            *ngFor="let item of clonedItemsForFinishing; let index = index"
                            [class]="cx('itemClone', { index })"
                            [attr.data-p-carousel-item-active]="false"
                            [attr.data-p-carousel-item-start]="false"
                            [attr.data-p-carousel-item-end]="false"
                            [pBind]="ptm('itemClone')"
                        >
                            <ng-container *ngTemplateOutlet="$itemTemplate(); context: { $implicit: item }"></ng-container>
                        </div>
                    </div>
                </div>
                <p-button
                    type="button"
                    *ngIf="showNavigators()"
                    [class]="cx('pcNextButton')"
                    (click)="navForward($event)"
                    [attr.aria-label]="ariaNextButtonLabel()"
                    [buttonProps]="nextButtonProps()"
                    [text]="true"
                    [pt]="ptm('pcNextButton')"
                    [unstyled]="unstyled()"
                    attr.data-pc-group-section="navigator"
                >
                    <ng-template #icon>
                        <ng-container *ngIf="!$nextIconTemplate() && !nextButtonProps()?.icon">
                            <svg data-p-icon="chevron-right" *ngIf="!isVertical()" />
                            <svg data-p-icon="chevron-down" *ngIf="isVertical()" />
                        </ng-container>
                        <span *ngIf="nextIconTemplate() || ($nextIconTemplate() && !nextButtonProps()?.icon)">
                            <ng-template *ngTemplateOutlet="$nextIconTemplate()"></ng-template>
                        </span>
                    </ng-template>
                </p-button>
            </div>
            <ul #indicatorContent [class]="cx('indicatorList')" [ngStyle]="indicatorsContentStyle()" *ngIf="showIndicators()" (keydown)="onIndicatorKeydown($event)" [pBind]="ptm('indicatorList')">
                <li *ngFor="let totalDot of totalDotsArray(); let i = index" [class]="cx('indicator', { index: i })" [attr.data-p-active]="_page === i" [pBind]="getIndicatorPTOptions('indicator', i)">
                    <button
                        type="button"
                        [class]="cx('indicatorButton')"
                        (click)="onDotClick($event, i)"
                        [ngStyle]="indicatorStyle()"
                        [attr.aria-label]="ariaPageLabel(i + 1)"
                        [attr.aria-current]="_page === i ? 'page' : undefined"
                        [tabindex]="_page === i ? 0 : -1"
                        [pBind]="getIndicatorPTOptions('indicatorButton', i)"
                    ></button>
                </li>
            </ul>
        </div>
        <div [class]="cx('footer')" *ngIf="footerFacet() || $footerTemplate()" [pBind]="ptm('footer')">
            <ng-content select="p-footer"></ng-content>
            <ng-container *ngTemplateOutlet="$footerTemplate()"></ng-container>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [CarouselStyle, { provide: PARENT_INSTANCE, useExisting: Carousel }],
    hostDirectives: [Bind],
    host: {
        '[attr.id]': 'id',
        '[attr.role]': "'region'",
        '[class]': "cx('root')"
    }
})
export class Carousel extends BaseComponent {
    el = inject(ElementRef);

    zone = inject(NgZone);

    bindDirectiveInstance = inject(Bind, { self: true });

    _componentStyle = inject(CarouselStyle);

    /**
     * Index of the first item.
     * @defaultValue 0
     * @group Props
     */
    readonly page = input<number, unknown>(0, { transform: numberAttribute });

    /**
     * Number of items per page.
     * @defaultValue 1
     * @group Props
     */
    readonly numVisible = input<number, unknown>(1, { transform: numberAttribute });

    /**
     * Number of items to scroll.
     * @defaultValue 1
     * @group Props
     */
    readonly numScroll = input<number, unknown>(1, { transform: numberAttribute });

    /**
     * An array of options for responsive design.
     * @see {CarouselResponsiveOptions}
     * @group Props
     */
    readonly responsiveOptions = input<CarouselResponsiveOptions[]>();

    /**
     * Specifies the layout of the component.
     * @group Props
     */
    readonly orientation = input<'horizontal' | 'vertical'>('horizontal');

    /**
     * Height of the viewport in vertical layout.
     * @group Props
     */
    readonly verticalViewPortHeight = input<string>('300px');

    /**
     * Style class of main content.
     * @group Props
     */
    readonly contentClass = input<string>('');

    /**
     * Style class of the indicator items.
     * @group Props
     */
    readonly indicatorsContentClass = input<string>('');

    /**
     * Inline style of the indicator items.
     * @group Props
     */
    readonly indicatorsContentStyle = input<{ [klass: string]: any } | null | undefined>();

    /**
     * Style class of the indicators.
     * @group Props
     */
    readonly indicatorStyleClass = input<string>('');

    /**
     * Style of the indicators.
     * @group Props
     */
    readonly indicatorStyle = input<{ [klass: string]: any } | null | undefined>();

    /**
     * An array of objects to display.
     * @defaultValue null
     * @group Props
     */
    readonly value = input<any[]>();

    /**
     * Defines if scrolling would be infinite.
     * @group Props
     */
    readonly circular = input<boolean, unknown>(false, { transform: booleanAttribute });

    /**
     * Whether to display indicator container.
     * @group Props
     */
    readonly showIndicators = input<boolean, unknown>(true, { transform: booleanAttribute });

    /**
     * Whether to display navigation buttons in container.
     * @group Props
     */
    readonly showNavigators = input<boolean, unknown>(true, { transform: booleanAttribute });

    /**
     * Time in milliseconds to scroll items automatically.
     * @group Props
     */
    readonly autoplayInterval = input<number, unknown>(0, { transform: numberAttribute });

    /**
     * Used to pass all properties of the ButtonProps to the Button component.
     * @group Props
     */
    readonly prevButtonProps = input<ButtonProps>({
        severity: 'secondary',
        text: true,
        rounded: true
    });

    /**
     * Used to pass all properties of the ButtonProps to the Button component.
     * @group Props
     */
    readonly nextButtonProps = input<ButtonProps>({
        severity: 'secondary',
        text: true,
        rounded: true
    });

    /**
     * Callback to invoke after scroll.
     * @param {CarouselPageEvent} event - Custom page event.
     * @group Emits
     */
    readonly onPage = output<CarouselPageEvent>();

    readonly itemsContainer = viewChild<ElementRef>('itemsContainer');

    readonly indicatorContent = viewChild<ElementRef>('indicatorContent');

    readonly headerFacet = contentChild(Header);

    readonly footerFacet = contentChild(Footer);

    /**
     * Custom item template.
     * @group Templates
     */
    readonly itemTemplate = contentChild<TemplateRef<CarouselItemTemplateContext>>('item', { descendants: false });

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
     * Custom previous icon template.
     * @group Templates
     */
    readonly previousIconTemplate = contentChild<TemplateRef<void>>('previousicon', { descendants: false });

    /**
     * Custom next icon template.
     * @group Templates
     */
    readonly nextIconTemplate = contentChild<TemplateRef<void>>('nexticon', { descendants: false });

    readonly templates = contentChildren(PrimeTemplate);

    componentName = 'Carousel';

    /**
     * Reacts to later `page` changes (replaces the legacy setter): navigates to the requested page.
     * The first run only registers the dependency — the initial value is synced eagerly in `onInit`,
     * exactly like the legacy input setter.
     */
    private pageEffectRan = false;

    private readonly pageEffect = effect(() => {
        const val = this.page();

        if (!this.pageEffectRan) {
            this.pageEffectRan = true;
            return;
        }

        untracked(() => {
            if (this.isCreated && val !== this._page) {
                if (this.autoplayInterval()) {
                    this.stopAutoplay();
                }

                if (val > this._page && val <= this.totalDots() - 1) {
                    this.step(-1, val);
                } else if (val < this._page) {
                    this.step(1, val);
                }
            }

            this._page = val;
        });
    });

    /**
     * Reacts to later `numVisible` changes (replaces the legacy setter plus the ngOnChanges
     * `numVisible` branch). The first run only registers the dependency — the initial value is
     * synced eagerly in `onInit`.
     */
    private numVisibleEffectRan = false;

    private readonly numVisibleEffect = effect(() => {
        const val = this.numVisible();

        if (!this.numVisibleEffectRan) {
            this.numVisibleEffectRan = true;
            return;
        }

        untracked(() => {
            this._numVisible = val;

            if (isPlatformBrowser(this.platformId) && this.isCreated) {
                if (this.responsiveOptions()) {
                    this.defaultNumVisible = val;
                }

                if (this.isCircular()) {
                    this.setCloneItems();
                }

                this.createStyle();
                this.calculatePosition();
            }

            this.cd.markForCheck();
        });
    });

    /**
     * Reacts to later `numScroll` changes (replaces the legacy setter plus the ngOnChanges
     * `numScroll` branch). The first run only registers the dependency — the initial value is
     * synced eagerly in `onInit`. Note: the legacy `numScroll` getter returned `_numVisible`, so
     * the ngOnChanges branch stored the visible count as the default scroll count — preserved
     * verbatim.
     */
    private numScrollEffectRan = false;

    private readonly numScrollEffect = effect(() => {
        const val = this.numScroll();

        if (!this.numScrollEffectRan) {
            this.numScrollEffectRan = true;
            return;
        }

        untracked(() => {
            this._numScroll = val;

            if (isPlatformBrowser(this.platformId) && this.isCreated && this.responsiveOptions()) {
                this.defaultNumScroll = this._numVisible;
            }

            this.cd.markForCheck();
        });
    });

    /**
     * Reacts to later `value` changes (replaces the ngOnChanges `value` branch): refreshes the
     * cloned items in circular mode. The first run only registers the dependency — the initial
     * clones are created in `onAfterContentInit`.
     */
    private valueEffectRan = false;

    private readonly valueEffect = effect(() => {
        this.value();

        if (!this.valueEffectRan) {
            this.valueEffectRan = true;
            return;
        }

        untracked(() => {
            if (isPlatformBrowser(this.platformId) && this.circular() && this.value()) {
                this.setCloneItems();
            }

            this.cd.markForCheck();
        });
    });

    _numVisible: number = 1;

    _numScroll: number = 1;

    prevState: any = {
        numScroll: 0,
        numVisible: 0,
        value: []
    };

    defaultNumScroll: number = 1;

    defaultNumVisible: number = 1;

    _page: number = 0;

    carouselStyle: any;

    id: string | undefined;

    totalShiftedItems;

    isRemainingItemsAdded: boolean = false;

    remainingItems: number = 0;

    startPos: any;

    documentResizeListener: any;

    clonedItemsForStarting: any[] | undefined;

    clonedItemsForFinishing: any[] | undefined;

    readonly allowAutoplay = signal<boolean | undefined>(undefined);

    interval: any;

    isCreated: boolean | undefined;

    swipeThreshold: number = 20;

    /**
     * Effective item template: the `#item` content child or (legacy behavior) the last projected
     * pTemplate of type `item` or of an unknown type. `header`, `footer`, `previousicon` and
     * `nexticon` pTemplates never fall through to the item template.
     */
    readonly $itemTemplate = computed(
        () =>
            this.itemTemplate() ??
            (this.templates()
                .filter((item) => !['header', 'footer', 'previousicon', 'nexticon'].includes(item.getType()))
                .at(-1)?.template as TemplateRef<CarouselItemTemplateContext> | undefined)
    );

    /** Effective footer template: the `#footer` content child or the `pTemplate="footer"`. */
    readonly $footerTemplate = computed(
        () =>
            this.footerTemplate() ??
            this.templates()
                .filter((item) => item.getType() === 'footer')
                .at(-1)?.template
    );

    /** Effective previous icon template: the `#previousicon` content child or the `pTemplate="previousicon"`. */
    readonly $previousIconTemplate = computed(
        () =>
            this.previousIconTemplate() ??
            this.templates()
                .filter((item) => item.getType() === 'previousicon')
                .at(-1)?.template
    );

    /** Effective next icon template: the `#nexticon` content child or the `pTemplate="nexticon"`. */
    readonly $nextIconTemplate = computed(
        () =>
            this.nextIconTemplate() ??
            this.templates()
                .filter((item) => item.getType() === 'nexticon')
                .at(-1)?.template
    );

    window: Window;

    constructor() {
        super();
        // Legacy: `this.page * this.numScroll * -1` — both are still at their input defaults here
        // (0 and 1), so this is always -0. Kept as an expression so the sign of zero (observable
        // via Object.is in firstIndex()) matches the legacy behavior.
        this.totalShiftedItems = this.page() * this.numScroll() * -1;
        this.window = this.document.defaultView as Window;

        // Re-apply the root pass-through section after each render (replaces the former
        // ngAfterViewChecked hook).
        afterEveryRender(() => {
            this.bindDirectiveInstance.setAttrs(this.ptm('root'));
        });
    }

    onInit() {
        // The input effects only flush after the first template pass, but the legacy setters had
        // already patched the internal state by now — sync it eagerly (the effects skip their
        // first run).
        this._page = this.page();
        this._numVisible = this.numVisible();
        this._numScroll = this.numScroll();
    }

    onAfterContentInit() {
        this.id = uuid('pn_id_');
        if (isPlatformBrowser(this.platformId)) {
            this.allowAutoplay.set(!!this.autoplayInterval());

            if (this.circular()) {
                this.setCloneItems();
            }

            if (this.responsiveOptions()) {
                this.defaultNumScroll = this._numScroll;
                this.defaultNumVisible = this._numVisible;
            }

            this.createStyle();
            this.calculatePosition();

            if (this.responsiveOptions()) {
                this.bindDocumentListeners();
            }
        }

        this.cd.detectChanges();
    }

    onAfterContentChecked() {
        if (isPlatformBrowser(this.platformId)) {
            const isCircular = this.isCircular();
            let totalShiftedItems = this.totalShiftedItems;

            const itemsContainer = this.itemsContainer();
            if (this.value() && itemsContainer && (this.prevState.numScroll !== this._numScroll || this.prevState.numVisible !== this._numVisible || this.prevState.value.length !== this.value()!.length)) {
                if (this.autoplayInterval()) {
                    this.stopAutoplay(false);
                }

                this.remainingItems = (this.value()!.length - this._numVisible) % this._numScroll;

                let page = this._page;
                if (this.totalDots() !== 0 && page >= this.totalDots()) {
                    page = this.totalDots() - 1;
                    this._page = page;
                    this.onPage.emit({
                        page: this._page
                    });
                }

                totalShiftedItems = page * this._numScroll * -1;
                if (isCircular) {
                    totalShiftedItems -= this._numVisible;
                }

                if (page === this.totalDots() - 1 && this.remainingItems > 0) {
                    totalShiftedItems += -1 * this.remainingItems + this._numScroll;
                    this.isRemainingItemsAdded = true;
                } else {
                    this.isRemainingItemsAdded = false;
                }

                if (totalShiftedItems !== this.totalShiftedItems) {
                    this.totalShiftedItems = totalShiftedItems;
                }

                this.prevState.numScroll = this._numScroll;
                this.prevState.numVisible = this._numVisible;
                this.prevState.value = [...(this.value() as any[])];

                if (this.totalDots() > 0 && itemsContainer.nativeElement) {
                    itemsContainer.nativeElement.style.transform = this.isVertical() ? `translate3d(0, ${totalShiftedItems * (100 / this._numVisible)}%, 0)` : `translate3d(${totalShiftedItems * (100 / this._numVisible)}%, 0, 0)`;
                }

                this.isCreated = true;

                if (this.autoplayInterval() && this.isAutoplay()) {
                    this.startAutoplay();
                }
            }

            if (isCircular) {
                if (this._page === 0) {
                    totalShiftedItems = -1 * this._numVisible;
                } else if (totalShiftedItems === 0) {
                    totalShiftedItems = -1 * this.value()!.length;
                    if (this.remainingItems > 0) {
                        this.isRemainingItemsAdded = true;
                    }
                }

                if (totalShiftedItems !== this.totalShiftedItems) {
                    this.totalShiftedItems = totalShiftedItems;
                }
            }
        }
    }

    onDestroy() {
        if (this.responsiveOptions()) {
            this.unbindDocumentListeners();
        }
        if (this.autoplayInterval()) {
            this.stopAutoplay();
        }
    }

    createStyle() {
        if (!this.carouselStyle) {
            this.carouselStyle = this.renderer.createElement('style');
            this.carouselStyle.type = 'text/css';
            setAttribute(this.carouselStyle, 'nonce', this.config?.csp()?.nonce);
            this.renderer.appendChild(this.document.head, this.carouselStyle);
            setAttribute(this.carouselStyle, 'nonce', this.config?.csp()?.nonce);
        }

        let innerHTML = `
            #${this.id} .p-carousel-item {
				flex: 1 0 ${100 / this._numVisible}%
			}
        `;

        const responsiveOptions = this.responsiveOptions();
        if (responsiveOptions && !this.$unstyled()) {
            responsiveOptions.sort((data1, data2) => {
                const value1 = data1.breakpoint;
                const value2 = data2.breakpoint;
                let result: number | null = null;

                if (value1 == null && value2 != null) result = -1;
                else if (value1 != null && value2 == null) result = 1;
                else if (value1 == null && value2 == null) result = 0;
                else if (typeof value1 === 'string' && typeof value2 === 'string') result = value1.localeCompare(value2, undefined, { numeric: true });
                else result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;

                return -1 * result;
            });

            for (let i = 0; i < responsiveOptions.length; i++) {
                let res = responsiveOptions[i];

                innerHTML += `
                    @media screen and (max-width: ${res.breakpoint}) {
                        #${this.id} .p-carousel-item {
                            flex: 1 0 ${100 / res.numVisible}%
                        }
                    }
                `;
            }
        }

        this.carouselStyle.innerHTML = innerHTML;
    }

    calculatePosition() {
        const responsiveOptions = this.responsiveOptions();
        if (responsiveOptions) {
            let matchedResponsiveData = {
                numVisible: this.defaultNumVisible,
                numScroll: this.defaultNumScroll
            };

            if (typeof window !== 'undefined') {
                let windowWidth = window.innerWidth;
                for (let i = 0; i < responsiveOptions.length; i++) {
                    let res = responsiveOptions[i];

                    if (parseInt(res.breakpoint, 10) >= windowWidth) {
                        matchedResponsiveData = res;
                    }
                }
            }

            if (this._numScroll !== matchedResponsiveData.numScroll) {
                let page = this._page;
                page = Math.floor((page * this._numScroll) / matchedResponsiveData.numScroll);

                let totalShiftedItems = matchedResponsiveData.numScroll * this._page * -1;

                if (this.isCircular()) {
                    totalShiftedItems -= matchedResponsiveData.numVisible;
                }

                this.totalShiftedItems = totalShiftedItems;
                this._numScroll = matchedResponsiveData.numScroll;

                this._page = page;
                this.onPage.emit({
                    page: this._page
                });
            }

            if (this._numVisible !== matchedResponsiveData.numVisible) {
                this._numVisible = matchedResponsiveData.numVisible;
                this.setCloneItems();
            }

            this.cd.markForCheck();
        }
    }

    setCloneItems() {
        this.clonedItemsForStarting = [];
        this.clonedItemsForFinishing = [];
        if (this.isCircular()) {
            this.clonedItemsForStarting.push(...this.value()!.slice(-1 * this._numVisible));
            this.clonedItemsForFinishing.push(...this.value()!.slice(0, this._numVisible));
        }
    }

    firstIndex() {
        return this.isCircular() ? -1 * (this.totalShiftedItems + this._numVisible) : this.totalShiftedItems * -1;
    }

    lastIndex() {
        return this.firstIndex() + this._numVisible - 1;
    }

    totalDots() {
        return this.value()?.length ? Math.ceil((this.value()!.length - this._numVisible) / this._numScroll) + 1 : 0;
    }

    totalDotsArray() {
        const totalDots = this.totalDots();
        return totalDots <= 0 ? [] : Array(totalDots).fill(0);
    }

    isVertical() {
        return this.orientation() === 'vertical';
    }

    isCircular() {
        return this.circular() && this.value() && this.value()!.length >= this._numVisible;
    }

    isAutoplay() {
        return this.autoplayInterval() && this.allowAutoplay();
    }

    isForwardNavDisabled() {
        return this.isEmpty() || (this._page >= this.totalDots() - 1 && !this.isCircular());
    }

    isBackwardNavDisabled() {
        return this.isEmpty() || (this._page <= 0 && !this.isCircular());
    }

    isEmpty() {
        return !this.value() || this.value()!.length === 0;
    }

    navForward(e: MouseEvent | TouchEvent, index?: number) {
        if (this.isCircular() || this._page < this.totalDots() - 1) {
            this.step(-1, index);
        }

        if (this.autoplayInterval()) {
            this.stopAutoplay();
        }

        if (e && e.cancelable) {
            e.preventDefault();
        }
    }

    navBackward(e: MouseEvent | TouchEvent, index?: number) {
        if (this.isCircular() || this._page !== 0) {
            this.step(1, index);
        }

        if (this.autoplayInterval()) {
            this.stopAutoplay();
        }

        if (e && e.cancelable) {
            e.preventDefault();
        }
    }

    onDotClick(e: MouseEvent, index: number) {
        let page = this._page;

        if (this.autoplayInterval()) {
            this.stopAutoplay();
        }

        if (index > page) {
            this.navForward(e, index);
        } else if (index < page) {
            this.navBackward(e, index);
        }
    }

    onIndicatorKeydown(event: KeyboardEvent) {
        switch (event.code) {
            case 'ArrowRight':
                this.onRightKey();
                break;

            case 'ArrowLeft':
                this.onLeftKey();
                break;
        }
    }

    onRightKey() {
        const indicators = [...find(this.indicatorContent()?.nativeElement, '[data-pc-section="indicator"]')];
        const activeIndex = this.findFocusedIndicatorIndex();

        this.changedFocusedIndicator(activeIndex, activeIndex + 1 === indicators.length ? indicators.length - 1 : activeIndex + 1);
    }

    onLeftKey() {
        const activeIndex = this.findFocusedIndicatorIndex();

        this.changedFocusedIndicator(activeIndex, activeIndex - 1 <= 0 ? 0 : activeIndex - 1);
    }

    onHomeKey() {
        const activeIndex = this.findFocusedIndicatorIndex();

        this.changedFocusedIndicator(activeIndex, 0);
    }

    onEndKey() {
        const indicators = [...find(this.indicatorContent()?.nativeElement, '[data-pc-section="indicator"]')];
        const activeIndex = this.findFocusedIndicatorIndex();

        this.changedFocusedIndicator(activeIndex, indicators.length - 1);
    }

    onTabKey() {
        const indicatorContent = this.indicatorContent();
        const indicators = <any>[...find(indicatorContent?.nativeElement, '[data-pc-section="indicator"]')];
        const highlightedIndex = indicators.findIndex((ind) => getAttribute(ind, 'data-p-highlight') === true);

        const activeIndicator = <any>findSingle(indicatorContent?.nativeElement, '[data-pc-section="indicator"] > button[tabindex="0"]');
        const activeIndex = indicators.findIndex((ind) => ind === activeIndicator.parentElement);

        indicators[activeIndex].children[0].tabIndex = '-1';
        indicators[highlightedIndex].children[0].tabIndex = '0';
    }

    findFocusedIndicatorIndex() {
        const indicatorContent = this.indicatorContent();
        const indicators = [...find(indicatorContent?.nativeElement, '[data-pc-section="indicator"]')];
        const activeIndicator = findSingle(indicatorContent?.nativeElement, '[data-pc-section="indicator"] > button[tabindex="0"]');

        return indicators.findIndex((ind) => ind === activeIndicator?.parentElement);
    }

    changedFocusedIndicator(prevInd, nextInd) {
        const indicators = <any>[...find(this.indicatorContent()?.nativeElement, '[data-pc-section="indicator"]')];

        indicators[prevInd].children[0].tabIndex = '-1';
        indicators[nextInd].children[0].tabIndex = '0';
        indicators[nextInd].children[0].focus();
    }

    step(dir: number, page?: number) {
        let totalShiftedItems = this.totalShiftedItems;
        const isCircular = this.isCircular();

        if (page != null) {
            totalShiftedItems = this._numScroll * page * -1;

            if (isCircular) {
                totalShiftedItems -= this._numVisible;
            }

            this.isRemainingItemsAdded = false;
        } else {
            totalShiftedItems += this._numScroll * dir;
            if (this.isRemainingItemsAdded) {
                totalShiftedItems += this.remainingItems - this._numScroll * dir;
                this.isRemainingItemsAdded = false;
            }

            let originalShiftedItems = isCircular ? totalShiftedItems + this._numVisible : totalShiftedItems;
            page = Math.abs(Math.floor(originalShiftedItems / this._numScroll));
        }

        if (isCircular && this._page === this.totalDots() - 1 && dir === -1) {
            totalShiftedItems = -1 * (this.value()!.length + this._numVisible);
            page = 0;
        } else if (isCircular && this._page === 0 && dir === 1) {
            totalShiftedItems = 0;
            page = this.totalDots() - 1;
        } else if (page === this.totalDots() - 1 && this.remainingItems > 0) {
            totalShiftedItems += this.remainingItems * -1 - this._numScroll * dir;
            this.isRemainingItemsAdded = true;
        }

        const itemsContainer = this.itemsContainer();
        if (itemsContainer) {
            !this.$unstyled() && removeClass(itemsContainer.nativeElement, 'p-items-hidden');
            itemsContainer.nativeElement.style.transform = this.isVertical() ? `translate3d(0, ${totalShiftedItems * (100 / this._numVisible)}%, 0)` : `translate3d(${totalShiftedItems * (100 / this._numVisible)}%, 0, 0)`;
            itemsContainer.nativeElement.style.transition = 'transform 500ms ease 0s';
        }

        this.totalShiftedItems = totalShiftedItems;
        this._page = page!;
        this.onPage.emit({
            page: this._page
        });
        this.cd.markForCheck();
    }

    startAutoplay() {
        this.interval = setInterval(() => {
            if (this.totalDots() > 0) {
                if (this._page === this.totalDots() - 1) {
                    this.step(-1, 0);
                } else {
                    this.step(-1, this._page + 1);
                }
            }
        }, this.autoplayInterval());
        this.allowAutoplay.set(true);
        this.cd.markForCheck();
    }

    stopAutoplay(changeAllow: boolean = true) {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = undefined;
            if (changeAllow) {
                this.allowAutoplay.set(false);
            }
        }
        this.cd.markForCheck();
    }

    isPlaying(): boolean {
        return !!this.interval;
    }

    onTransitionEnd() {
        const itemsContainer = this.itemsContainer();
        if (itemsContainer) {
            !this.$unstyled() && addClass(itemsContainer.nativeElement, 'p-items-hidden');
            itemsContainer.nativeElement.style.transition = '';

            if ((this._page === 0 || this._page === this.totalDots() - 1) && this.isCircular()) {
                itemsContainer.nativeElement.style.transform = this.isVertical() ? `translate3d(0, ${this.totalShiftedItems * (100 / this._numVisible)}%, 0)` : `translate3d(${this.totalShiftedItems * (100 / this._numVisible)}%, 0, 0)`;
            }
        }
    }

    onTouchStart(e: TouchEvent) {
        let touchobj = e.changedTouches[0];

        this.startPos = {
            x: touchobj.pageX,
            y: touchobj.pageY
        };
    }

    onTouchMove(e: TouchEvent | MouseEvent) {
        if (e.cancelable) {
            e.preventDefault();
        }
    }

    onTouchEnd(e: TouchEvent) {
        let touchobj = e.changedTouches[0];

        if (this.isVertical()) {
            this.changePageOnTouch(e, touchobj.pageY - this.startPos.y);
        } else {
            this.changePageOnTouch(e, touchobj.pageX - this.startPos.x);
        }
    }

    changePageOnTouch(e: TouchEvent | MouseEvent, diff: number) {
        if (Math.abs(diff) > this.swipeThreshold) {
            if (diff < 0) {
                this.navForward(e);
            } else {
                this.navBackward(e);
            }
        }
    }

    ariaPrevButtonLabel() {
        return this.config.translation.aria ? this.config.translation.aria?.prevPageLabel : undefined;
    }

    ariaSlideLabel() {
        return this.config.translation.aria ? this.config.translation.aria?.slide : undefined;
    }

    ariaNextButtonLabel() {
        return this.config.translation.aria ? this.config.translation.aria?.nextPageLabel : undefined;
    }

    ariaSlideNumber(value) {
        return this.config.translation.aria ? this.config.translation.aria?.slideNumber?.replace(/{slideNumber}/g, value) : undefined;
    }

    ariaPageLabel(value) {
        return this.config.translation.aria ? this.config.translation.aria?.pageLabel?.replace(/{page}/g, value) : undefined;
    }

    getIndicatorPTOptions(key: string, index: number) {
        return this.ptm(key, {
            context: {
                highlighted: index === this._page
            }
        });
    }

    getItemPTOptions(key: string, index: number) {
        return this.ptm(key, {
            context: {
                index,
                active: this.firstIndex() <= index && this.lastIndex() >= index,
                start: this.firstIndex() === index,
                end: this.lastIndex() === index
            }
        });
    }

    bindDocumentListeners() {
        if (isPlatformBrowser(this.platformId)) {
            if (!this.documentResizeListener) {
                this.documentResizeListener = this.renderer.listen(this.window, 'resize', (event) => {
                    this.calculatePosition();
                });
            }
        }
    }

    unbindDocumentListeners() {
        if (isPlatformBrowser(this.platformId)) {
            if (this.documentResizeListener) {
                this.documentResizeListener();
                this.documentResizeListener = null;
            }
        }
    }
}

@NgModule({
    imports: [Carousel, SharedModule],
    exports: [Carousel, SharedModule]
})
export class CarouselModule {}
