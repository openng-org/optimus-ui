import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
    afterEveryRender,
    afterNextRender,
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    ElementRef,
    HostListener,
    inject,
    input,
    KeyValueDiffers,
    linkedSignal,
    NgModule,
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
import { MotionEvent, MotionOptions } from '@openng/optimus-ui-motion';
import { addClass, find, findSingle, focus, getAttribute, removeClass, setAttribute, uuid } from '@openng/optimus-ui-utils';
import { PrimeTemplate, SharedModule } from '@openng/optimus-ui/api';
import { BaseComponent, PARENT_INSTANCE } from '@openng/optimus-ui/basecomponent';
import { Bind, BindModule } from '@openng/optimus-ui/bind';
import { blockBodyScroll, unblockBodyScroll } from '@openng/optimus-ui/dom';
import { FocusTrap } from '@openng/optimus-ui/focustrap';
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon, TimesIcon } from '@openng/optimus-ui/icons';
import { MotionModule } from '@openng/optimus-ui/motion';
import { Ripple } from '@openng/optimus-ui/ripple';
import { VoidListener } from '@openng/optimus-ui/ts-helpers';
import { GalleriaCaptionTemplateContext, GalleriaIndicatorTemplateContext, GalleriaItemTemplateContext, GalleriaPassThrough, GalleriaResponsiveOptions, GalleriaThumbnailTemplateContext } from '@openng/optimus-ui/types/galleria';
import { ZIndexUtils } from '@openng/optimus-ui/utils';
import { GalleriaStyle } from './style/galleriastyle';

/**
 * Galleria is an advanced content gallery component.
 * @group Components
 */
@Component({
    selector: 'p-galleria',
    standalone: false,
    template: `
        @if (fullScreen()) {
            <div #container>
                @if (renderMask()) {
                    <div
                        [pBind]="ptm('mask')"
                        [pMotion]="maskVisible()"
                        [pMotionAppear]="true"
                        [pMotionEnterActiveClass]="fullScreen() ? 'p-overlay-mask-enter-active' : ''"
                        [pMotionLeaveActiveClass]="fullScreen() ? 'p-overlay-mask-leave-active' : ''"
                        [pMotionOptions]="computedMaskMotionOptions()"
                        (pMotionOnAfterLeave)="onMaskAfterLeave()"
                        [ngClass]="cx('mask')"
                        [class]="maskClass()"
                        [attr.role]="fullScreen() ? 'dialog' : 'region'"
                        [attr.aria-modal]="fullScreen() ? 'true' : undefined"
                        (click)="onMaskHide($event)"
                    >
                        @if (renderContent()) {
                            <div
                                pGalleriaContent
                                [pMotion]="$visible()"
                                [pMotionAppear]="true"
                                [pMotionName]="'p-galleria'"
                                [pMotionOptions]="computedMotionOptions()"
                                (pMotionOnBeforeEnter)="onBeforeEnter($event)"
                                (pMotionOnBeforeLeave)="onBeforeLeave()"
                                (pMotionOnAfterLeave)="onAfterLeave()"
                                [value]="value()"
                                [activeIndex]="$activeIndex()"
                                [numVisible]="numVisibleLimit() || numVisible()"
                                (maskHide)="onMaskHide()"
                                (activeItemChange)="onActiveItemChange($event)"
                                [ngStyle]="containerStyle()"
                                [fullScreen]="fullScreen()"
                                [pt]="pt()"
                                pFocusTrap
                                [pFocusTrapDisabled]="!fullScreen()"
                                [unstyled]="unstyled()"
                            ></div>
                        }
                    </div>
                }
            </div>
        } @else {
            <div pGalleriaContent [pt]="pt()" [unstyled]="unstyled()" [value]="value()" [activeIndex]="$activeIndex()" [numVisible]="numVisibleLimit() || numVisible()" (activeItemChange)="onActiveItemChange($event)"></div>
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [GalleriaStyle, { provide: PARENT_INSTANCE, useExisting: Galleria }],
    hostDirectives: [Bind]
})
export class Galleria extends BaseComponent<GalleriaPassThrough> {
    element = inject(ElementRef);

    bindDirectiveInstance = inject(Bind, { self: true });

    _componentStyle = inject(GalleriaStyle);

    /**
     * Index of the first item.
     * @group Props
     */
    readonly activeIndex = input<number>(0);

    /**
     * Whether to display the component on fullscreen.
     * @group Props
     */
    readonly fullScreen = input<boolean, unknown>(false, { transform: booleanAttribute });

    /**
     * Unique identifier of the element.
     * @group Props
     */
    readonly id = input<string>();

    /**
     * An array of objects to display.
     * @group Props
     */
    readonly value = input<any[]>();

    /**
     * Number of items per page.
     * @group Props
     */
    readonly numVisible = input<number, unknown>(3, { transform: numberAttribute });

    /**
     * An array of options for responsive design.
     * @see {GalleriaResponsiveOptions}
     * @group Props
     */
    readonly responsiveOptions = input<GalleriaResponsiveOptions[]>();

    /**
     * Whether to display navigation buttons in item section.
     * @group Props
     */
    readonly showItemNavigators = input<boolean, unknown>(false, { transform: booleanAttribute });

    /**
     * Whether to display navigation buttons in thumbnail container.
     * @group Props
     */
    readonly showThumbnailNavigators = input<boolean, unknown>(true, { transform: booleanAttribute });

    /**
     * Whether to display navigation buttons on item hover.
     * @group Props
     */
    readonly showItemNavigatorsOnHover = input<boolean, unknown>(false, { transform: booleanAttribute });

    /**
     * When enabled, item is changed on indicator hover.
     * @group Props
     */
    readonly changeItemOnIndicatorHover = input<boolean, unknown>(false, { transform: booleanAttribute });

    /**
     * Defines if scrolling would be infinite.
     * @group Props
     */
    readonly circular = input<boolean, unknown>(false, { transform: booleanAttribute });

    /**
     * Items are displayed with a slideshow in autoPlay mode.
     * @group Props
     */
    readonly autoPlay = input<boolean, unknown>(false, { transform: booleanAttribute });

    /**
     * When enabled, autorun should stop by click.
     * @group Props
     */
    readonly shouldStopAutoplayByClick = input<boolean, unknown>(true, { transform: booleanAttribute });

    /**
     * Time in milliseconds to scroll items.
     * @group Props
     */
    readonly transitionInterval = input<number, unknown>(4000, { transform: numberAttribute });

    /**
     * Whether to display thumbnail container.
     * @group Props
     */
    readonly showThumbnails = input<boolean, unknown>(true, { transform: booleanAttribute });

    /**
     * Position of thumbnails.
     * @group Props
     */
    readonly thumbnailsPosition = input<'bottom' | 'top' | 'left' | 'right' | undefined>('bottom');

    /**
     * Height of the viewport in vertical thumbnail.
     * @group Props
     */
    readonly verticalThumbnailViewPortHeight = input<string>('300px');

    /**
     * Whether to display indicator container.
     * @group Props
     */
    readonly showIndicators = input<boolean, unknown>(false, { transform: booleanAttribute });

    /**
     * When enabled, indicator container is displayed on item container.
     * @group Props
     */
    readonly showIndicatorsOnItem = input<boolean, unknown>(false, { transform: booleanAttribute });

    /**
     * Position of indicators.
     * @group Props
     */
    readonly indicatorsPosition = input<'bottom' | 'top' | 'left' | 'right' | undefined>('bottom');

    /**
     * Base zIndex value to use in layering.
     * @group Props
     */
    readonly baseZIndex = input<number, unknown>(0, { transform: numberAttribute });

    /**
     * Style class of the mask on fullscreen mode.
     * @group Props
     */
    readonly maskClass = input<string>();

    /**
     * Style class of the component on fullscreen mode. Otherwise, the 'class' property can be used.
     * @group Props
     */
    readonly containerClass = input<string>();

    /**
     * Inline style of the component on fullscreen mode. Otherwise, the 'style' property can be used.
     * @group Props
     */
    readonly containerStyle = input<{ [klass: string]: any } | null | undefined>();

    /**
     * Transition options of the show animation.
     * @deprecated since v21.0.0. Use `motionOptions` instead.
     * @group Props
     */
    readonly showTransitionOptions = input<string>('150ms cubic-bezier(0, 0, 0.2, 1)');

    /**
     * Transition options of the hide animation.
     * @deprecated since v21.0.0. Use `motionOptions` instead.
     * @group Props
     */
    readonly hideTransitionOptions = input<string>('150ms cubic-bezier(0, 0, 0.2, 1)');

    /**
     * The motion options.
     * @group Props
     */
    motionOptions = input<MotionOptions | undefined>(undefined);

    /**
     * The mask motion options.
     * @group Props
     */
    maskMotionOptions = input<MotionOptions | undefined>(undefined);

    /**
     * Specifies the visibility of the mask on fullscreen mode.
     * @group Props
     */
    readonly visible = input<boolean>(false);

    /**
     * Callback to invoke on active index change.
     * @param {number} number - Active index.
     * @group Emits
     */
    readonly activeIndexChange = output<number>();

    /**
     * Callback to invoke on visiblity change.
     * @param {boolean} boolean - Visible value.
     * @group Emits
     */
    readonly visibleChange = output<boolean>();

    readonly container = viewChild<ElementRef>('container');

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
     * Custom indicator template.
     * @group Templates
     */
    readonly indicatorTemplate = contentChild<TemplateRef<GalleriaIndicatorTemplateContext>>('indicator', { descendants: false });

    /**
     * Custom caption template.
     * @group Templates
     */
    readonly captionTemplate = contentChild<TemplateRef<GalleriaCaptionTemplateContext>>('caption', { descendants: false });

    /**
     * Custom close icon template.
     * @group Templates
     */
    readonly _closeIconTemplate = contentChild<TemplateRef<void>>('closeicon', { descendants: false });

    /**
     * Custom previous thumbnail icon template.
     * @group Templates
     */
    readonly _previousThumbnailIconTemplate = contentChild<TemplateRef<void>>('previousthumbnailicon', { descendants: false });

    /**
     * Custom next thumbnail icon template.
     * @group Templates
     */
    readonly _nextThumbnailIconTemplate = contentChild<TemplateRef<void>>('nextthumbnailicon', { descendants: false });

    /**
     * Custom item previous icon template.
     * @group Templates
     */
    readonly _itemPreviousIconTemplate = contentChild<TemplateRef<void>>('itempreviousicon', { descendants: false });

    /**
     * Custom item next icon template.
     * @group Templates
     */
    readonly _itemNextIconTemplate = contentChild<TemplateRef<void>>('itemnexticon', { descendants: false });

    /**
     * Custom item template.
     * @group Templates
     */
    readonly _itemTemplate = contentChild<TemplateRef<GalleriaItemTemplateContext>>('item', { descendants: false });

    /**
     * Custom thumbnail template.
     * @group Templates
     */
    readonly _thumbnailTemplate = contentChild<TemplateRef<GalleriaThumbnailTemplateContext>>('thumbnail', { descendants: false });

    readonly templates = contentChildren(PrimeTemplate);

    componentName = 'Galleria';

    /**
     * Working active index: follows the `activeIndex` input and is overwritten by internal
     * navigation (the legacy field was both an input and internally assigned — last write wins).
     */
    readonly $activeIndex = linkedSignal(() => this.activeIndex());

    computedMotionOptions = computed<MotionOptions>(() => {
        return {
            ...this.ptm('motion'),
            ...this.motionOptions()
        };
    });

    computedMaskMotionOptions = computed<MotionOptions>(() => {
        return {
            ...this.ptm('maskMotion'),
            ...this.maskMotionOptions()
        };
    });

    /**
     * Working visibility: follows the `visible` input and is overwritten by internal hides
     * (the legacy field was both an input and internally assigned — last write wins).
     */
    readonly $visible = linkedSignal(() => this.visible());

    /**
     * Replays the legacy `visible` setter side effect for both the input and internal writes.
     * The body is idempotent (guarded by `maskVisible`), so it runs on every change including
     * the first one.
     */
    private readonly visibleEffect = effect(() => {
        const visible = this.$visible();

        untracked(() => {
            if (visible && !this.maskVisible()) {
                this.maskVisible.set(true);
                this.renderMask.set(true);
                this.renderContent.set(true);
            } else if (!visible && this.maskVisible()) {
                this.maskVisible.set(false);
            }
        });
    });

    renderMask = signal<boolean>(false);

    renderContent = signal<boolean>(false);

    /** The projected `pTemplate="header"` (the `#header` content child is `headerTemplate`). */
    readonly headerFacet = computed(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'header')
                .at(-1)?.template
    );

    /** The projected `pTemplate="footer"`. */
    readonly footerFacet = computed(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'footer')
                .at(-1)?.template
    );

    /** The projected `pTemplate="indicator"`. */
    readonly indicatorFacet = computed(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'indicator')
                .at(-1)?.template as TemplateRef<GalleriaIndicatorTemplateContext> | undefined
    );

    /** The projected `pTemplate="caption"`. */
    readonly captionFacet = computed(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'caption')
                .at(-1)?.template as TemplateRef<GalleriaCaptionTemplateContext> | undefined
    );

    /** The projected `pTemplate="closeicon"` (the `#closeicon` content child is `_closeIconTemplate`). */
    readonly closeIconTemplate = computed(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'closeicon')
                .at(-1)?.template
    );

    /** The projected `pTemplate="previousthumbnailicon"`. */
    readonly previousThumbnailIconTemplate = computed(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'previousthumbnailicon')
                .at(-1)?.template
    );

    /** The projected `pTemplate="nextthumbnailicon"`. */
    readonly nextThumbnailIconTemplate = computed(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'nextthumbnailicon')
                .at(-1)?.template
    );

    /** The projected `pTemplate="itempreviousicon"`. */
    readonly itemPreviousIconTemplate = computed(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'itempreviousicon')
                .at(-1)?.template
    );

    /** The projected `pTemplate="itemnexticon"`. */
    readonly itemNextIconTemplate = computed(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'itemnexticon')
                .at(-1)?.template
    );

    /** The projected `pTemplate="item"`. */
    readonly itemTemplate = computed(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'item')
                .at(-1)?.template as TemplateRef<GalleriaItemTemplateContext> | undefined
    );

    /** The projected `pTemplate="thumbnail"`. */
    readonly thumbnailTemplate = computed(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'thumbnail')
                .at(-1)?.template as TemplateRef<GalleriaThumbnailTemplateContext> | undefined
    );

    maskVisible = signal<boolean>(false);

    /**
     * Caps the rendered number of items when fewer items than `numVisible` exist. Recomputed on
     * `value` changes only — like the legacy ngOnChanges, a later `numVisible` change alone does
     * not update it.
     */
    readonly numVisibleLimit = computed(() => {
        const value = this.value();
        return untracked(() => (value && value.length < this.numVisible() ? value.length : 0));
    });

    mask: HTMLElement;

    constructor() {
        super();
        // Re-apply the host pass-through section after each render (replaces the former
        // ngAfterViewChecked hook).
        afterEveryRender(() => {
            this.bindDirectiveInstance.setAttrs(this.ptm('host'));
        });
    }

    onDestroy() {
        if (this.fullScreen()) {
            removeClass(this.document.body, 'p-overflow-hidden');
        }

        if (this.mask) {
            this.disableModality();
        }
    }

    onMaskHide(event?: MouseEvent) {
        if (!event || event.target === event.currentTarget) {
            this.$visible.set(false);
            this.visibleChange.emit(false);
        }
    }

    onActiveItemChange(index: number) {
        if (this.$activeIndex() !== index) {
            this.$activeIndex.set(index);
            this.activeIndexChange.emit(index);
        }
    }

    onBeforeEnter(event: MotionEvent) {
        this.mask = <HTMLElement>event.element?.parentElement;
        this.enableModality();
        setTimeout(() => {
            const focusTarget = findSingle(this.container()?.nativeElement, '[data-pc-section="closebutton"]');
            if (focusTarget) focus(focusTarget as HTMLElement);
        }, 25);
    }

    onBeforeLeave() {
        if (this.mask) {
            this.maskVisible.set(false);
        }
    }

    onAfterLeave() {
        this.disableModality();
        this.renderContent.set(false);
    }

    onMaskAfterLeave() {
        if (!this.renderContent()) {
            this.renderMask.set(false);
        }
    }

    enableModality() {
        //@ts-ignore
        blockBodyScroll();
        this.cd.markForCheck();
        if (this.mask) {
            ZIndexUtils.set('modal', this.mask, this.baseZIndex() || this.config.zIndex.modal);
        }
    }

    disableModality() {
        //@ts-ignore
        unblockBodyScroll();
        this.cd.markForCheck();
        if (this.mask) {
            ZIndexUtils.clear(this.mask);
        }
    }
}

@Component({
    selector: 'div[pGalleriaContent]',
    standalone: false,
    template: `
        @if (value() && value().length > 0) {
            @if (galleria.fullScreen()) {
                <button type="button" [pBind]="getPTOptions('closeButton')" [class]="cx('closeButton')" (click)="maskHide.emit()" [attr.aria-label]="closeAriaLabel()">
                    @if (!galleria.closeIconTemplate() && !galleria._closeIconTemplate()) {
                        <svg data-p-icon="times" [pBind]="getPTOptions('closeIcon')" [class]="cx('closeIcon')" />
                    }
                    <ng-template *ngTemplateOutlet="galleria.closeIconTemplate() || galleria._closeIconTemplate()"></ng-template>
                </button>
            }
            @if (galleria.templates() && (galleria.headerFacet() || galleria.headerTemplate())) {
                <div pGalleriaItemSlot [unstyled]="unstyled()" type="header" [templates]="galleria.templates()" [pBind]="getPTOptions('header')" [class]="cx('header')"></div>
            }
            <div [pBind]="getPTOptions('content')" [class]="cx('content')" [attr.aria-live]="galleria.autoPlay() ? 'polite' : 'off'">
                <div
                    pGalleriaItem
                    [id]="id"
                    [value]="value()"
                    [activeIndex]="$activeIndex()"
                    [circular]="galleria.circular()"
                    [templates]="galleria.templates()"
                    (onActiveIndexChange)="onActiveIndexChange($event)"
                    [showIndicators]="galleria.showIndicators()"
                    [changeItemOnIndicatorHover]="galleria.changeItemOnIndicatorHover()"
                    [indicatorFacet]="galleria.indicatorFacet()"
                    [captionFacet]="galleria.captionFacet()"
                    [showItemNavigators]="galleria.showItemNavigators()"
                    [autoPlay]="galleria.autoPlay()"
                    [slideShowActive]="slideShowActive"
                    (startSlideShow)="startSlideShow()"
                    (stopSlideShow)="stopSlideShow()"
                    [pt]="pt()"
                    [unstyled]="unstyled()"
                    [class]="cx('itemsContainer')"
                ></div>
                @if (galleria.showThumbnails()) {
                    <div
                        pGalleriaThumbnails
                        [containerId]="id"
                        [value]="value()"
                        (onActiveIndexChange)="onActiveIndexChange($event)"
                        [activeIndex]="$activeIndex()"
                        [templates]="galleria.templates()"
                        [numVisible]="numVisible()"
                        [responsiveOptions]="galleria.responsiveOptions()"
                        [circular]="galleria.circular()"
                        [isVertical]="isVertical()"
                        [contentHeight]="galleria.verticalThumbnailViewPortHeight()"
                        [showThumbnailNavigators]="galleria.showThumbnailNavigators()"
                        [slideShowActive]="slideShowActive"
                        (stopSlideShow)="stopSlideShow()"
                        [pt]="pt()"
                        [unstyled]="unstyled()"
                    ></div>
                }
            </div>
            @if (shouldRenderFooter()) {
                <div pGalleriaItemSlot [pBind]="getPTOptions('footer')" [class]="cx('footer')" type="footer" [templates]="galleria.templates()" [unstyled]="unstyled()"></div>
            }
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [GalleriaStyle],
    host: {
        '[attr.id]': 'id',
        '[attr.role]': '"region"',
        '[style]': '!galleria.fullScreen() ? galleria.containerStyle() : {}',
        '[class]': "cn(cx('root'))"
    },
    hostDirectives: [Bind]
})
export class GalleriaContent extends BaseComponent<GalleriaPassThrough> {
    galleria = inject(Galleria);

    private differs = inject(KeyValueDiffers);

    bindDirectiveInstance = inject(Bind, { self: true });

    _componentStyle = inject(GalleriaStyle);

    readonly activeIndex = input<number>(0);

    readonly value = input<any[]>([]);

    readonly numVisible = input<number | undefined, unknown>(undefined, { transform: numberAttribute });

    readonly fullScreen = input<boolean, unknown>(undefined, { transform: booleanAttribute });

    readonly maskHide = output<boolean>();

    readonly activeItemChange = output<number>();

    hostName: string = 'Galleria';

    /** Working active index: follows the input and is overwritten by internal navigation. */
    readonly $activeIndex = linkedSignal(() => this.activeIndex());

    /** Working copy of `fullScreen`, updated by the document fullscreenchange listener. */
    readonly $fullScreen = linkedSignal(() => this.fullScreen());

    id: string;

    slideShowActive: boolean = true;

    interval: any;

    private differ: any;

    constructor() {
        super();
        this.id = this.galleria.id() || uuid('pn_id_');
        this.differ = this.differs.find(this.galleria).create();

        // Re-apply the root pass-through section after each render (replaces the former
        // ngAfterViewChecked hook).
        afterEveryRender(() => {
            this.bindDirectiveInstance.setAttrs(this.getPTOptions('root'));
        });
    }

    onDoCheck(): void {
        if (isPlatformBrowser(this.galleria.platformId)) {
            const changes = this.differ.diff(this.galleria as unknown as Record<string, unknown>);
            if (changes && changes.forEachItem.length > 0) {
                // Because we change the properties of the parent component,
                // and the children take our entity from the injector.
                // We can tell the children to redraw themselves when we change the properties of the parent component.
                // Since we have an onPush strategy
                this.cd.markForCheck();
            }
        }
    }

    // For custom fullscreen
    @HostListener('document:fullscreenchange', ['$event'])
    handleFullscreenChange(event: Event) {
        if (document?.fullscreenElement === this.el.nativeElement?.children[0]) {
            this.$fullScreen.set(true);
        } else {
            this.$fullScreen.set(false);
        }
    }

    shouldRenderFooter() {
        const templates = this.galleria.templates();
        return (this.galleria.footerFacet() && templates && templates.length > 0) || this.galleria.footerTemplate();
    }

    startSlideShow() {
        if (isPlatformBrowser(this.galleria.platformId)) {
            this.interval = setInterval(() => {
                let activeIndex = this.galleria.circular() && this.value().length - 1 === this.$activeIndex() ? 0 : this.$activeIndex() + 1;
                this.onActiveIndexChange(activeIndex);
                this.$activeIndex.set(activeIndex);
            }, this.galleria.transitionInterval());

            this.slideShowActive = true;
        }
    }

    stopSlideShow() {
        if (this.galleria.autoPlay() && !this.galleria.shouldStopAutoplayByClick()) {
            return;
        }

        if (this.interval) {
            clearInterval(this.interval);
        }

        this.slideShowActive = false;
    }

    getPositionClass(preClassName: string, position: string) {
        const positions = ['top', 'left', 'bottom', 'right'];
        const pos = positions.find((item) => item === position);

        return pos ? `${preClassName}-${pos}` : '';
    }

    isVertical() {
        return this.galleria.thumbnailsPosition() === 'left' || this.galleria.thumbnailsPosition() === 'right';
    }

    onActiveIndexChange(index: number) {
        if (this.$activeIndex() !== index) {
            this.$activeIndex.set(index);
            this.activeItemChange.emit(this.$activeIndex());
        }
    }

    closeAriaLabel() {
        return this.config.translation.aria ? this.config.translation.aria.close : undefined;
    }

    getPTOptions(key: string) {
        return this.ptm(key, {
            context: {
                pt: this.pt(),
                unstyled: this.unstyled()
            }
        });
    }
}

@Component({
    selector: 'div[pGalleriaItemSlot]',
    standalone: false,
    template: `
        @if (shouldRender()) {
            <ng-container *ngTemplateOutlet="$contentTemplate(); context: $context()"></ng-container>
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GalleriaItemSlot extends BaseComponent<GalleriaPassThrough> {
    galleria: Galleria = inject(Galleria);

    readonly templates = input<readonly PrimeTemplate[]>();

    readonly index = input<number | undefined, unknown>(undefined, { transform: numberAttribute });

    readonly item = input<any>();

    readonly type = input<string>();

    hostName: string = 'Galleria';

    /**
     * Effective slot template: the last matching template from the `templates` input when given,
     * otherwise the parent Galleria's content child / pTemplate for this slot's `type` (replaces
     * the legacy `item` setter + onAfterContentInit recomputes).
     */
    readonly $contentTemplate = computed(() => {
        const templates = this.templates();
        const type = this.type();

        if (templates && templates.length > 0) {
            return templates.filter((template) => template.getType() === type).at(-1)?.template;
        }

        switch (type) {
            case 'caption':
                return this.galleria.captionTemplate() || this.getTemplateFromQueryList('caption');
            case 'thumbnail':
                return this.galleria._thumbnailTemplate() || this.getTemplateFromQueryList('thumbnail');
            case 'indicator':
                return this.galleria.indicatorTemplate() || this.getTemplateFromQueryList('indicator');
            case 'footer':
                return this.galleria.footerTemplate() || this.getTemplateFromQueryList('footer');
            case 'item':
            default:
                return this.galleria._itemTemplate() || this.getTemplateFromQueryList('item');
        }
    });

    /** Template context for the slot: the indicator's index, or the slot's item. */
    readonly $context = computed(() => (this.type() === 'indicator' ? { $implicit: this.index() } : { $implicit: this.item() }));

    shouldRender() {
        const captionTemplate = this.galleria.captionTemplate();
        return (
            this.$contentTemplate() ||
            this.galleria._itemTemplate() ||
            this.galleria.itemTemplate() ||
            captionTemplate ||
            captionTemplate ||
            this.galleria.captionFacet() ||
            this.galleria.thumbnailTemplate() ||
            this.galleria._thumbnailTemplate() ||
            this.galleria.footerTemplate()
        );
    }

    getTemplateFromQueryList(type: string): TemplateRef<any> | undefined {
        return this.galleria.templates()?.find((item) => item.getType() === type)?.template;
    }
}

@Component({
    selector: 'div[pGalleriaItem]',
    standalone: false,
    template: `
        <div [pBind]="ptm('items')" [class]="cx('items')">
            @if (showItemNavigators()) {
                <button type="button" role="navigation" [pBind]="ptm('prevButton')" [class]="cx('prevButton')" (click)="navBackward($event)" (focus)="onButtonFocus('left')" (blur)="onButtonBlur('left')" data-pc-group-section="itemnavigator">
                    @if (!galleria.itemPreviousIconTemplate() && !galleria._itemPreviousIconTemplate()) {
                        <svg data-p-icon="chevron-left" [pBind]="ptm('prevIcon')" [class]="cx('prevIcon')" />
                    }
                    <ng-template *ngTemplateOutlet="galleria.itemPreviousIconTemplate() || galleria._itemPreviousIconTemplate()"></ng-template>
                </button>
            }
            <div
                pGalleriaItemSlot
                [pBind]="ptm('item')"
                [unstyled]="unstyled()"
                [class]="cx('item')"
                [item]="activeItem"
                [templates]="templates()"
                [id]="id() + '_item_' + activeIndex()"
                role="group"
                [class]="cx('item')"
                [attr.aria-label]="ariaSlideNumber(activeIndex() + 1)"
                [attr.aria-roledescription]="ariaSlideLabel()"
            ></div>
            @if (showItemNavigators()) {
                <button type="button" [pBind]="ptm('nextButton')" [class]="cx('nextButton')" (click)="navForward($event)" role="navigation" (focus)="onButtonFocus('right')" (blur)="onButtonBlur('right')" data-pc-group-section="itemnavigator">
                    @if (!galleria.itemNextIconTemplate() && !galleria._itemNextIconTemplate()) {
                        <svg data-p-icon="chevron-right" [pBind]="ptm('nextIcon')" [class]="cx('nextIcon')" />
                    }
                    <ng-template *ngTemplateOutlet="galleria.itemNextIconTemplate() || galleria._itemNextIconTemplate()"></ng-template>
                </button>
            }
            @if (captionFacet() || galleria.captionTemplate()) {
                <div pGalleriaItemSlot [pBind]="ptm('caption')" [unstyled]="unstyled()" [class]="cx('caption')" type="caption" [item]="activeItem" [templates]="templates()"></div>
            }
        </div>
        @if (showIndicators()) {
            <ul [pBind]="ptm('indicatorList')" [class]="cx('indicatorList')">
                @for (item of value(); track item; let index = $index) {
                    <li
                        [pBind]="getIndicatorPTOptions(index)"
                        tabindex="0"
                        (click)="onIndicatorClick(index)"
                        (mouseenter)="onIndicatorMouseEnter(index)"
                        (keydown)="onIndicatorKeyDown($event, index)"
                        [class]="cx('indicator', { index })"
                        [attr.aria-label]="ariaPageLabel(index + 1)"
                        [attr.aria-selected]="activeIndex() === index"
                        [attr.aria-controls]="id() + '_item_' + index"
                        [pBind]="ptm('indicator', getIndicatorPTOptions(index))"
                        [attr.data-p-active]="isIndicatorItemActive(index)"
                    >
                        @if (!indicatorFacet() && !galleria.indicatorTemplate()) {
                            <button type="button" tabIndex="-1" [pBind]="ptm('indicatorButton', getIndicatorPTOptions(index))" [class]="cx('indicatorButton')"></button>
                        }
                        @if (indicatorFacet() || galleria.indicatorTemplate()) {
                            <div pGalleriaItemSlot type="indicator" [index]="index" [templates]="templates()" [pBind]="ptm('item')" [unstyled]="unstyled()"></div>
                        }
                    </li>
                }
            </ul>
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [GalleriaStyle],
    hostDirectives: [Bind]
})
export class GalleriaItem extends BaseComponent<GalleriaPassThrough> {
    galleria = inject(Galleria);

    bindDirectiveInstance = inject(Bind, { self: true });

    _componentStyle = inject(GalleriaStyle);

    readonly id = input<string>();

    readonly circular = input<boolean, unknown>(false, { transform: booleanAttribute });

    readonly value = input<any[]>();

    readonly showItemNavigators = input<boolean, unknown>(false, { transform: booleanAttribute });

    readonly showIndicators = input<boolean, unknown>(true, { transform: booleanAttribute });

    readonly slideShowActive = input<boolean, unknown>(true, { transform: booleanAttribute });

    readonly changeItemOnIndicatorHover = input<boolean, unknown>(true, { transform: booleanAttribute });

    readonly autoPlay = input<boolean, unknown>(false, { transform: booleanAttribute });

    readonly templates = input<readonly PrimeTemplate[]>();

    readonly indicatorFacet = input<any>();

    readonly captionFacet = input<any>();

    readonly activeIndex = input<number>(0);

    readonly startSlideShow = output<Event | undefined>();

    readonly stopSlideShow = output<Event | undefined>();

    readonly onActiveIndexChange = output<number>();

    hostName: string = 'Galleria';

    get activeItem() {
        return this.value() && this.value()![this.activeIndex()];
    }

    leftButtonFocused: boolean = false;

    rightButtonFocused: boolean = false;

    /**
     * Starts/stops the slideshow on `autoPlay` changes (replaces the former ngOnChanges hook,
     * which also fired on the initial binding — so this effect does not skip its first run).
     */
    private readonly autoPlayEffect = effect(() => {
        const autoPlay = this.autoPlay();

        untracked(() => {
            if (autoPlay) {
                this.startSlideShow.emit(undefined);
            }

            if (autoPlay === false) {
                this.stopTheSlideShow();
            }
        });
    });

    constructor() {
        super();
        // Re-apply the itemsContainer pass-through section after each render (replaces the
        // former ngAfterViewChecked hook).
        afterEveryRender(() => {
            this.bindDirectiveInstance.setAttrs(this.ptm('itemsContainer'));
        });
    }

    getIndicatorPTOptions(index: number) {
        return this.ptm('indicator', {
            context: {
                highlighted: this.activeIndex() === index
            }
        });
    }

    next() {
        let nextItemIndex = this.activeIndex() + 1;
        let activeIndex = this.circular() && (<any[]>this.value()).length - 1 === this.activeIndex() ? 0 : nextItemIndex;
        this.onActiveIndexChange.emit(activeIndex);
    }

    prev() {
        let prevItemIndex = this.activeIndex() !== 0 ? this.activeIndex() - 1 : 0;
        let activeIndex = this.circular() && this.activeIndex() === 0 ? (<any[]>this.value()).length - 1 : prevItemIndex;
        this.onActiveIndexChange.emit(activeIndex);
    }

    onButtonFocus(pos: 'left' | 'right') {
        if (pos === 'left') {
            this.leftButtonFocused = true;
        } else this.rightButtonFocused = true;
    }

    onButtonBlur(pos: 'left' | 'right') {
        if (pos === 'left') {
            this.leftButtonFocused = false;
        } else this.rightButtonFocused = false;
    }

    stopTheSlideShow() {
        if (this.slideShowActive() && this.stopSlideShow) {
            this.stopSlideShow.emit(undefined);
        }
    }

    navForward(e: MouseEvent) {
        this.stopTheSlideShow();
        this.next();

        if (e && e.cancelable) {
            e.stopPropagation();
            e.preventDefault();
        }
    }

    navBackward(e: MouseEvent) {
        this.stopTheSlideShow();
        this.prev();

        if (e && e.cancelable) {
            e.stopPropagation();
            e.preventDefault();
        }
    }

    onIndicatorClick(index: number) {
        this.stopTheSlideShow();
        this.onActiveIndexChange.emit(index);
    }

    onIndicatorMouseEnter(index: number) {
        if (this.changeItemOnIndicatorHover()) {
            this.stopTheSlideShow();
            this.onActiveIndexChange.emit(index);
        }
    }

    onIndicatorKeyDown(event, index: number) {
        switch (event.code) {
            case 'Enter':
            case 'Space':
                this.stopTheSlideShow();
                this.onActiveIndexChange.emit(index);
                event.preventDefault();
                break;

            case 'ArrowDown':
            case 'ArrowUp':
                event.preventDefault();
                break;

            default:
                break;
        }
    }

    isNavForwardDisabled() {
        return !this.circular() && this.activeIndex() === (<any[]>this.value()).length - 1;
    }

    isNavBackwardDisabled() {
        return !this.circular() && this.activeIndex() === 0;
    }

    isIndicatorItemActive(index: number) {
        return this.activeIndex() === index;
    }

    ariaSlideLabel() {
        return this.galleria.config.translation.aria ? this.galleria.config.translation.aria.slide : undefined;
    }

    ariaSlideNumber(value: any) {
        return this.galleria.config.translation.aria ? this.galleria.config.translation.aria.slideNumber?.replace(/{slideNumber}/g, value) : undefined;
    }

    ariaPageLabel(value: any) {
        return this.galleria.config.translation.aria ? this.galleria.config.translation.aria.pageLabel?.replace(/{page}/g, value) : undefined;
    }
}

@Component({
    selector: 'div[pGalleriaThumbnails]',
    standalone: false,
    template: `
        <div [pBind]="ptm('thumbnailContent')" [class]="cx('thumbnailContent')">
            @if (showThumbnailNavigators()) {
                <button type="button" [pBind]="ptm('thumbnailPrevButton')" [class]="cx('thumbnailPrevButton')" (click)="navBackward($event)" pRipple [attr.aria-label]="ariaPrevButtonLabel()" data-pc-group-section="thumbnailnavigator">
                    @if (!galleria.previousThumbnailIconTemplate() && !galleria._previousThumbnailIconTemplate()) {
                        @if (!isVertical()) {
                            <svg data-p-icon="chevron-left" [pBind]="ptm('thumbnailPrevIcon')" [class]="cx('thumbnailPrevIcon')" />
                        }
                        @if (isVertical()) {
                            <svg data-p-icon="chevron-up" [pBind]="ptm('thumbnailPrevIcon')" [class]="cx('thumbnailPrevIcon')" />
                        }
                    }
                    <ng-template *ngTemplateOutlet="galleria.previousThumbnailIconTemplate() || galleria._previousThumbnailIconTemplate()"></ng-template>
                </button>
            }
            <div [pBind]="ptm('thumbnailsViewport')" [class]="cx('thumbnailsViewport')" [ngStyle]="{ height: isVertical() ? contentHeight() : '' }">
                <div #itemsContainer [pBind]="ptm('thumbnailItems')" [class]="cx('thumbnailItems')" (transitionend)="onTransitionEnd()" (touchstart)="onTouchStart($event)" (touchmove)="onTouchMove($event)" role="tablist">
                    @for (item of value(); track item; let index = $index) {
                        <div
                            [pBind]="ptm('thumbnailItem')"
                            [class]="cx('thumbnailItem', { index, activeIndex: activeIndex() })"
                            [attr.aria-selected]="activeIndex() === index"
                            [attr.aria-controls]="containerId() + '_item_' + index"
                            (keydown)="onThumbnailKeydown($event, index)"
                            [attr.data-p-active]="activeIndex() === index"
                        >
                            <div
                                [pBind]="ptm('thumbnail')"
                                [class]="cx('thumbnail')"
                                [attr.tabindex]="activeIndex() === index ? 0 : -1"
                                [attr.aria-current]="activeIndex() === index ? 'page' : undefined"
                                [attr.aria-label]="ariaPageLabel(index + 1)"
                                (click)="onItemClick(index)"
                                (touchend)="onItemClick(index)"
                                (keydown.enter)="onItemClick(index)"
                            >
                                <div pGalleriaItemSlot type="thumbnail" [pBind]="ptm('thumbnailItem')" [item]="item" [templates]="templates()" [unstyled]="unstyled()"></div>
                            </div>
                        </div>
                    }
                </div>
            </div>
            @if (showThumbnailNavigators()) {
                <button type="button" [pBind]="ptm('thumbnailNextButton')" [class]="cx('thumbnailNextButton')" (click)="navForward($event)" pRipple [attr.aria-label]="ariaNextButtonLabel()" data-pc-group-section="thumbnailnavigator">
                    @if (!galleria.nextThumbnailIconTemplate() && !galleria._nextThumbnailIconTemplate()) {
                        @if (!isVertical()) {
                            <svg data-p-icon="chevron-right" [pBind]="ptm('thumbnailNextIcon')" [class]="cx('thumbnailNextIcon')" />
                        }
                        @if (isVertical()) {
                            <svg data-p-icon="chevron-down" [pBind]="ptm('thumbnailNextIcon')" [class]="cx('thumbnailNextIcon')" />
                        }
                    }
                    <ng-template *ngTemplateOutlet="galleria.nextThumbnailIconTemplate() || galleria._nextThumbnailIconTemplate()"></ng-template>
                </button>
            }
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [GalleriaStyle],
    host: {
        '[class]': 'cx("thumbnails")'
    },
    hostDirectives: [Bind]
})
export class GalleriaThumbnails extends BaseComponent<GalleriaPassThrough> {
    galleria = inject(Galleria);

    bindDirectiveInstance = inject(Bind, { self: true });

    _componentStyle = inject(GalleriaStyle);

    readonly containerId = input<string>();

    readonly value = input<any[]>();

    readonly isVertical = input<boolean, unknown>(false, { transform: booleanAttribute });

    readonly slideShowActive = input<boolean, unknown>(false, { transform: booleanAttribute });

    readonly circular = input<boolean, unknown>(false, { transform: booleanAttribute });

    readonly responsiveOptions = input<GalleriaResponsiveOptions[]>();

    readonly contentHeight = input<string>('300px');

    readonly showThumbnailNavigators = input<boolean>(true);

    readonly templates = input<readonly PrimeTemplate[]>();

    readonly numVisible = input<number>(0);

    readonly activeIndex = input<number>(0);

    readonly onActiveIndexChange = output<number>();

    readonly stopSlideShow = output<Event | undefined>();

    readonly itemsContainer = viewChild<ElementRef>('itemsContainer');

    hostName: string = 'Galleria';

    private numVisibleEffectFirstRun = true;

    /**
     * Replays the legacy `numVisible` setter side effect on later input changes (the first
     * binding is applied eagerly in `onInit`, before `createStyle` reads `d_numVisible`).
     */
    private readonly numVisibleEffect = effect(() => {
        const numVisible = this.numVisible();

        if (this.numVisibleEffectFirstRun) {
            this.numVisibleEffectFirstRun = false;
            return;
        }

        untracked(() => this.applyNumVisible(numVisible));
    });

    private activeIndexEffectFirstRun = true;

    /**
     * Replays the legacy `activeIndex` setter side effect on later input changes (the first
     * binding is applied eagerly in `onInit`). `setActiveIndex` is also called programmatically
     * from `onItemClick`, exactly like the legacy setter was.
     */
    private readonly activeIndexEffect = effect(() => {
        const activeIndex = this.activeIndex();

        if (this.activeIndexEffectFirstRun) {
            this.activeIndexEffectFirstRun = false;
            return;
        }

        untracked(() => this.setActiveIndex(activeIndex));
    });

    index: number | undefined;

    startPos: { x: number; y: number } | null = null;

    thumbnailsStyle: HTMLStyleElement | null = null;

    sortedResponsiveOptions: GalleriaResponsiveOptions[] | null = null;

    totalShiftedItems: number = 0;

    page: number = 0;

    documentResizeListener: VoidListener;

    _numVisible: number = 0;

    d_numVisible: number = 0;

    _oldNumVisible: number = 0;

    _activeIndex: number = 0;

    _oldactiveIndex: number = 0;

    constructor() {
        super();
        // Re-apply the thumbnails pass-through section after each render (replaces the former
        // ngAfterViewChecked hook).
        afterEveryRender(() => {
            this.bindDirectiveInstance.setAttrs(this.ptm('thumbnails'));
        });

        // Replaces the former ngAfterViewInit hook.
        afterNextRender(() => {
            if (isPlatformBrowser(this.platformId)) {
                this.calculatePosition();
            }
        });
    }

    onInit() {
        // Apply the initial input values eagerly — effects only flush after the first template
        // pass, but `createStyle` and the first render already read the derived fields.
        this.applyNumVisible(this.numVisible());
        this.setActiveIndex(this.activeIndex());

        if (isPlatformBrowser(this.platformId)) {
            this.createStyle();

            if (this.responsiveOptions()) {
                this.bindDocumentListeners();
            }
        }
    }

    onAfterContentChecked() {
        let totalShiftedItems = this.totalShiftedItems;

        const itemsContainer = this.itemsContainer();
        if ((this._oldNumVisible !== this.d_numVisible || this._oldactiveIndex !== this._activeIndex) && itemsContainer) {
            if (this._activeIndex <= this.getMedianItemIndex()) {
                totalShiftedItems = 0;
            } else if ((<any[]>this.value()).length - this.d_numVisible + this.getMedianItemIndex() < this._activeIndex) {
                totalShiftedItems = this.d_numVisible - (<any[]>this.value()).length;
            } else if ((<any[]>this.value()).length - this.d_numVisible < this._activeIndex && this.d_numVisible % 2 === 0) {
                totalShiftedItems = this._activeIndex * -1 + this.getMedianItemIndex() + 1;
            } else {
                totalShiftedItems = this._activeIndex * -1 + this.getMedianItemIndex();
            }

            if (totalShiftedItems !== this.totalShiftedItems) {
                this.totalShiftedItems = totalShiftedItems;
            }

            if (itemsContainer && itemsContainer.nativeElement) {
                itemsContainer.nativeElement.style.transform = this.isVertical() ? `translate3d(0, ${totalShiftedItems * (100 / this.d_numVisible)}%, 0)` : `translate3d(${totalShiftedItems * (100 / this.d_numVisible)}%, 0, 0)`;
            }

            if (this._oldactiveIndex !== this._activeIndex) {
                this.document.body.setAttribute('data-p-items-hidden', 'false');
                !this.$unstyled() && removeClass(itemsContainer.nativeElement, 'p-items-hidden');
                itemsContainer.nativeElement.style.transition = 'transform 500ms ease 0s';
            }

            this._oldactiveIndex = this._activeIndex;
            this._oldNumVisible = this.d_numVisible;
        }
    }

    onDestroy() {
        if (this.responsiveOptions()) {
            this.unbindDocumentListeners();
        }

        if (this.thumbnailsStyle) {
            this.thumbnailsStyle.parentNode?.removeChild(this.thumbnailsStyle);
        }
    }

    private applyNumVisible(numVisible: number) {
        this._numVisible = numVisible;
        this._oldNumVisible = this.d_numVisible;
        this.d_numVisible = numVisible;
    }

    setActiveIndex(activeIndex: number) {
        this._oldactiveIndex = this._activeIndex;
        this._activeIndex = activeIndex;
    }

    createStyle() {
        if (!this.thumbnailsStyle) {
            this.thumbnailsStyle = this.document.createElement('style');
            setAttribute(this.thumbnailsStyle, 'nonce', this.galleria.config?.csp()?.nonce);
            this.document.body.appendChild(this.thumbnailsStyle);
        }

        let innerHTML = `
            #${this.containerId()} .p-galleria-thumbnail-item {
                flex: 1 0 ${100 / this.d_numVisible}%
            }
        `;

        if (this.responsiveOptions() && !this.$unstyled()) {
            this.sortedResponsiveOptions = [...this.responsiveOptions()!];
            this.sortedResponsiveOptions.sort((data1, data2) => {
                const value1 = data1.breakpoint;
                const value2 = data2.breakpoint;
                let result: number;

                if (value1 == null && value2 != null) result = -1;
                else if (value1 != null && value2 == null) result = 1;
                else if (value1 == null && value2 == null) result = 0;
                else if (typeof value1 === 'string' && typeof value2 === 'string') result = value1.localeCompare(value2, undefined, { numeric: true });
                else result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;

                return -1 * result;
            });

            for (let i = 0; i < this.sortedResponsiveOptions.length; i++) {
                let res = this.sortedResponsiveOptions[i];

                innerHTML += `
                    @media screen and (max-width: ${res.breakpoint}) {
                        #${this.containerId()} .p-galleria-thumbnail-item {
                            flex: 1 0 ${100 / res.numVisible}%
                        }
                    }
                `;
            }
        }

        this.thumbnailsStyle.innerHTML = innerHTML;
        setAttribute(this.thumbnailsStyle, 'nonce', this.galleria.config?.csp()?.nonce);
    }

    calculatePosition() {
        if (isPlatformBrowser(this.platformId)) {
            if (this.itemsContainer() && this.sortedResponsiveOptions) {
                let windowWidth = window.innerWidth;
                let matchedResponsiveData = {
                    numVisible: this._numVisible
                };

                for (let i = 0; i < this.sortedResponsiveOptions.length; i++) {
                    let res = this.sortedResponsiveOptions[i];

                    if (parseInt(res.breakpoint, 10) >= windowWidth) {
                        matchedResponsiveData = res;
                    }
                }

                if (this.d_numVisible !== matchedResponsiveData.numVisible) {
                    this.d_numVisible = matchedResponsiveData.numVisible;
                    this.cd.markForCheck();
                }
            }
        }
    }

    getTabIndex(index: number) {
        return this.isItemActive(index) ? 0 : null;
    }

    navForward(e: TouchEvent | MouseEvent) {
        this.stopTheSlideShow();

        let nextItemIndex = this._activeIndex + 1;
        if (nextItemIndex + this.totalShiftedItems > this.getMedianItemIndex() && (-1 * this.totalShiftedItems < this.getTotalPageNumber() - 1 || this.circular())) {
            this.step(-1);
        }

        let activeIndex = this.circular() && (<any[]>this.value()).length - 1 === this._activeIndex ? 0 : nextItemIndex;
        this.onActiveIndexChange.emit(activeIndex);

        if (e.cancelable) {
            e.preventDefault();
        }
    }

    navBackward(e: TouchEvent | MouseEvent) {
        this.stopTheSlideShow();

        let prevItemIndex = this._activeIndex !== 0 ? this._activeIndex - 1 : 0;
        let diff = prevItemIndex + this.totalShiftedItems;
        if (this.d_numVisible - diff - 1 > this.getMedianItemIndex() && (-1 * this.totalShiftedItems !== 0 || this.circular())) {
            this.step(1);
        }

        let activeIndex = this.circular() && this._activeIndex === 0 ? (<any[]>this.value()).length - 1 : prevItemIndex;
        this.onActiveIndexChange.emit(activeIndex);

        if (e.cancelable) {
            e.preventDefault();
        }
    }

    onItemClick(index: number) {
        this.stopTheSlideShow();

        let selectedItemIndex = index;
        if (selectedItemIndex !== this._activeIndex) {
            const diff = selectedItemIndex + this.totalShiftedItems;
            let dir = 0;
            if (selectedItemIndex < this._activeIndex) {
                dir = this.d_numVisible - diff - 1 - this.getMedianItemIndex();
                if (dir > 0 && -1 * this.totalShiftedItems !== 0) {
                    this.step(dir);
                }
            } else {
                dir = this.getMedianItemIndex() - diff;
                if (dir < 0 && -1 * this.totalShiftedItems < this.getTotalPageNumber() - 1) {
                    this.step(dir);
                }
            }

            this.setActiveIndex(selectedItemIndex);
            this.onActiveIndexChange.emit(this._activeIndex);
        }
    }

    onThumbnailKeydown(event: KeyboardEvent, index: number) {
        if (event.code === 'Enter' || event.code === 'Space') {
            this.onItemClick(index);
            event.preventDefault();
        }

        switch (event.code) {
            case 'ArrowRight':
                this.onRightKey();
                break;

            case 'ArrowLeft':
                this.onLeftKey();
                break;

            case 'Home':
                this.onHomeKey();
                event.preventDefault();
                break;

            case 'End':
                this.onEndKey();
                event.preventDefault();
                break;

            case 'ArrowUp':
            case 'ArrowDown':
                event.preventDefault();
                break;

            case 'Tab':
                this.onTabKey();
                break;

            default:
                break;
        }
    }

    onRightKey() {
        const indicators = find(this.itemsContainer()?.nativeElement, '[data-pc-section="thumbnailitem"]');
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
        const indicators = find(this.itemsContainer()?.nativeElement, '[data-pc-section="thumbnailitem"]');
        const activeIndex = this.findFocusedIndicatorIndex();

        this.changedFocusedIndicator(activeIndex, indicators.length - 1);
    }

    onTabKey() {
        const itemsContainer = this.itemsContainer();
        const indicators = <any>[...find(itemsContainer?.nativeElement, '[data-pc-section="thumbnailitem"]')];
        const highlightedIndex = indicators.findIndex((ind: any) => getAttribute(ind, 'data-p-active') === true);

        const activeIndicator = <any>findSingle(itemsContainer?.nativeElement, '[tabindex="0"]');

        const activeIndex = indicators.findIndex((ind: any) => ind === activeIndicator?.parentElement);

        indicators[activeIndex].children[0].tabIndex = '-1';
        indicators[highlightedIndex].children[0].tabIndex = '0';
    }

    findFocusedIndicatorIndex() {
        const itemsContainer = this.itemsContainer();
        const indicators = [...find(itemsContainer?.nativeElement, '[data-pc-section="thumbnailitem"]')];
        const activeIndicator = findSingle(itemsContainer?.nativeElement, '[data-pc-section="thumbnailitem"] > [tabindex="0"]');

        return indicators.findIndex((ind) => ind === activeIndicator?.parentElement);
    }

    changedFocusedIndicator(prevInd: number, nextInd: number) {
        const indicators = <any>find(this.itemsContainer()?.nativeElement, '[data-pc-section="thumbnailitem"]');

        indicators[prevInd].children[0].tabIndex = '-1';
        indicators[nextInd].children[0].tabIndex = '0';
        indicators[nextInd].children[0].focus();
    }

    step(dir: number) {
        let totalShiftedItems = this.totalShiftedItems + dir;

        if (dir < 0 && -1 * totalShiftedItems + this.d_numVisible > (<any[]>this.value()).length - 1) {
            totalShiftedItems = this.d_numVisible - (<any[]>this.value()).length;
        } else if (dir > 0 && totalShiftedItems > 0) {
            totalShiftedItems = 0;
        }

        if (this.circular()) {
            if (dir < 0 && (<any[]>this.value()).length - 1 === this._activeIndex) {
                totalShiftedItems = 0;
            } else if (dir > 0 && this._activeIndex === 0) {
                totalShiftedItems = this.d_numVisible - (<any[]>this.value()).length;
            }
        }

        const itemsContainer = this.itemsContainer();
        if (itemsContainer) {
            this.document.body.setAttribute('data-p-items-hidden', 'false');
            !this.$unstyled() && removeClass(itemsContainer.nativeElement, 'p-items-hidden');
            itemsContainer.nativeElement.style.transform = this.isVertical() ? `translate3d(0, ${totalShiftedItems * (100 / this.d_numVisible)}%, 0)` : `translate3d(${totalShiftedItems * (100 / this.d_numVisible)}%, 0, 0)`;
            itemsContainer.nativeElement.style.transition = 'transform 500ms ease 0s';
        }

        this.totalShiftedItems = totalShiftedItems;
    }

    stopTheSlideShow() {
        if (this.slideShowActive() && this.stopSlideShow) {
            this.stopSlideShow.emit(undefined);
        }
    }

    changePageOnTouch(e: TouchEvent, diff: number) {
        if (diff < 0) {
            // left
            this.navForward(e);
        } else {
            // right
            this.navBackward(e);
        }
    }

    getTotalPageNumber() {
        return (<any[]>this.value()).length > this.d_numVisible ? (<any[]>this.value()).length - this.d_numVisible + 1 : 0;
    }

    getMedianItemIndex() {
        let index = Math.floor(this.d_numVisible / 2);

        return this.d_numVisible % 2 ? index : index - 1;
    }

    onTransitionEnd() {
        const itemsContainer = this.itemsContainer();
        if (itemsContainer && itemsContainer.nativeElement) {
            this.document.body.setAttribute('data-p-items-hidden', 'true');
            !this.$unstyled() && addClass(itemsContainer.nativeElement, 'p-items-hidden');
            itemsContainer.nativeElement.style.transition = '';
        }
    }

    onTouchEnd(e: TouchEvent) {
        let touchobj = e.changedTouches[0];

        if (this.isVertical()) {
            this.changePageOnTouch(e, touchobj.pageY - (<{ x: number; y: number }>this.startPos).y);
        } else {
            this.changePageOnTouch(e, touchobj.pageX - (<{ x: number; y: number }>this.startPos).x);
        }
    }

    onTouchMove(e: TouchEvent) {
        if (e.cancelable) {
            e.preventDefault();
        }
    }

    onTouchStart(e: TouchEvent) {
        let touchobj = e.changedTouches[0];

        this.startPos = {
            x: touchobj.pageX,
            y: touchobj.pageY
        };
    }

    isNavBackwardDisabled() {
        return (!this.circular() && this._activeIndex === 0) || (<any[]>this.value()).length <= this.d_numVisible;
    }

    isNavForwardDisabled() {
        return (!this.circular() && this._activeIndex === (<any[]>this.value()).length - 1) || (<any[]>this.value()).length <= this.d_numVisible;
    }

    firstItemAciveIndex() {
        return this.totalShiftedItems * -1;
    }

    lastItemActiveIndex() {
        return this.firstItemAciveIndex() + this.d_numVisible - 1;
    }

    isItemActive(index: number) {
        return this.firstItemAciveIndex() <= index && this.lastItemActiveIndex() >= index;
    }

    bindDocumentListeners() {
        if (isPlatformBrowser(this.platformId)) {
            const window = this.document.defaultView || 'window';
            this.documentResizeListener = this.renderer.listen(window, 'resize', () => {
                this.calculatePosition();
            });
        }
    }

    unbindDocumentListeners() {
        if (this.documentResizeListener) {
            this.documentResizeListener();
            this.documentResizeListener = null;
        }
    }

    ariaPrevButtonLabel() {
        return this.galleria.config.translation.aria ? this.galleria.config.translation.aria.prevPageLabel : undefined;
    }

    ariaNextButtonLabel() {
        return this.galleria.config.translation.aria ? this.galleria.config.translation.aria.nextPageLabel : undefined;
    }

    ariaPageLabel(value: any) {
        return this.galleria.config.translation.aria ? this.galleria.config.translation.aria.pageLabel?.replace(/{page}/g, value) : undefined;
    }
}

@NgModule({
    imports: [CommonModule, SharedModule, Ripple, TimesIcon, ChevronRightIcon, ChevronUpIcon, ChevronDownIcon, ChevronLeftIcon, FocusTrap, BindModule, MotionModule],
    exports: [CommonModule, Galleria, GalleriaContent, GalleriaItemSlot, GalleriaItem, GalleriaThumbnails, SharedModule],
    declarations: [Galleria, GalleriaContent, GalleriaItemSlot, GalleriaItem, GalleriaThumbnails]
})
export class GalleriaModule {}
