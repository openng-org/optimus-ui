import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
    afterEveryRender,
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    ElementRef,
    inject,
    input,
    linkedSignal,
    NgModule,
    NgZone,
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
import { absolutePosition, addClass, appendChild, focus, getOuterWidth, getTargetElement, isTouchDevice, relativePosition, removeClass } from '@openng/optimus-ui-utils';
import { OverlayModeType, OverlayOnBeforeHideEvent, OverlayOnBeforeShowEvent, OverlayOnHideEvent, OverlayOnShowEvent, OverlayOptions, OverlayService, PrimeTemplate, ResponsiveOverlayOptions, SharedModule } from '@openng/optimus-ui/api';
import { BaseComponent, PARENT_INSTANCE } from '@openng/optimus-ui/basecomponent';
import { Bind } from '@openng/optimus-ui/bind';
import { ConnectedOverlayScrollHandler } from '@openng/optimus-ui/dom';
import { MotionModule } from '@openng/optimus-ui/motion';
import { Subscription } from 'rxjs';
import { VoidListener } from '@openng/optimus-ui/ts-helpers';
import { ObjectUtils, ZIndexUtils } from '@openng/optimus-ui/utils';
import { OverlayContentTemplateContext } from '@openng/optimus-ui/types/overlay';
import { OverlayStyle } from './style/overlaystyle';

/**
 * This API allows overlay components to be controlled from Optimus. In this way, all overlay components in the application can have the same behavior.
 * @group Components
 */
@Component({
    selector: 'p-overlay',
    standalone: true,
    imports: [CommonModule, SharedModule, Bind, MotionModule],
    hostDirectives: [Bind],
    template: `
        @if (inline()) {
            <ng-content></ng-content>
            <ng-container *ngTemplateOutlet="$contentTemplate(); context: { $implicit: { mode: null } }"></ng-container>
        } @else {
            @if (modalVisible()) {
                <div #overlay [class]="cn(cx('root'), $styleClass)" [style]="sx('root')" [pBind]="ptm('root')" (click)="onOverlayClick()">
                    <p-motion
                        [visible]="$visible()"
                        name="p-anchored-overlay"
                        [appear]="true"
                        [options]="computedMotionOptions()"
                        (onBeforeEnter)="onOverlayBeforeEnter($event)"
                        (onEnter)="onOverlayEnter($event)"
                        (onAfterEnter)="onOverlayAfterEnter($event)"
                        (onBeforeLeave)="onOverlayBeforeLeave($event)"
                        (onLeave)="onOverlayLeave($event)"
                        (onAfterLeave)="onOverlayAfterLeave($event)"
                    >
                        <div #content [class]="cn(cx('content'), $contentStyleClass)" [pBind]="ptm('content')" (click)="onOverlayContentClick($event)">
                            <ng-content></ng-content>
                            <ng-container *ngTemplateOutlet="$contentTemplate(); context: { $implicit: { mode: overlayMode } }"></ng-container>
                        </div>
                    </p-motion>
                </div>
            }
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [OverlayStyle, { provide: PARENT_INSTANCE, useExisting: Overlay }]
})
export class Overlay extends BaseComponent {
    overlayService = inject(OverlayService);

    private zone = inject(NgZone);

    _componentStyle = inject(OverlayStyle);

    bindDirectiveInstance = inject(Bind, { self: true });

    readonly hostName = input<string>('');

    /**
     * The visible property is an input that determines the visibility of the component.
     * @defaultValue false
     * @group Props
     */
    readonly visible = input<boolean>(false);

    /**
     * The mode property is an input that determines the overlay mode type or string.
     * @defaultValue null
     * @group Props
     */
    readonly mode = input<OverlayModeType | string | undefined>(undefined);

    /**
     * The style property is an input that determines the style object for the component.
     * @defaultValue null
     * @group Props
     */
    readonly style = input<{ [klass: string]: any } | null | undefined>(null);

    /**
     * The styleClass property is an input that determines the CSS class(es) for the component.
     * @defaultValue null
     * @group Props
     */
    readonly styleClass = input<string | undefined>();

    /**
     * The contentStyle property is an input that determines the style object for the content of the component.
     * @defaultValue null
     * @group Props
     */
    readonly contentStyle = input<{ [klass: string]: any } | null | undefined>(null);

    /**
     * The contentStyleClass property is an input that determines the CSS class(es) for the content of the component.
     * @defaultValue null
     * @group Props
     */
    readonly contentStyleClass = input<string | undefined>();

    /**
     * The target property is an input that specifies the target element or selector for the component.
     * @defaultValue null
     * @group Props
     */
    readonly target = input<string | null | undefined>(undefined);

    /**
     * The autoZIndex determines whether to automatically manage layering. Its default value is 'false'.
     * @defaultValue false
     * @group Props
     */
    readonly autoZIndex = input<boolean | undefined>(undefined);

    /**
     * The baseZIndex is base zIndex value to use in layering.
     * @defaultValue null
     * @group Props
     */
    readonly baseZIndex = input<number | undefined>(undefined);

    /**
     * Transition options of the show or hide animation.
     * @defaultValue .12s cubic-bezier(0, 0, 0.2, 1)
     * @group Props
     * @deprecated since v21.0.0. Use `motionOptions` instead.
     */
    readonly showTransitionOptions = input<string | undefined>(undefined);

    /**
     * The hideTransitionOptions property is an input that determines the CSS transition options for hiding the component.
     * @defaultValue .1s linear
     * @group Props
     * @deprecated since v21.0.0. Use `motionOptions` instead.
     */
    readonly hideTransitionOptions = input<string | undefined>(undefined);

    /**
     * The listener property is an input that specifies the listener object for the component.
     * @defaultValue null
     * @group Props
     */
    readonly listener = input<any>();

    /**
     * It is the option used to determine in which mode it should appear according to the given media or breakpoint.
     * @defaultValue null
     * @group Props
     */
    readonly responsive = input<ResponsiveOverlayOptions | undefined>(undefined);

    /**
     * The options property is an input that specifies the overlay options for the component.
     * @defaultValue null
     * @group Props
     */
    readonly options = input<OverlayOptions | undefined>(undefined);

    /**
     * Target element to attach the overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name).
     * @defaultValue 'self'
     * @group Props
     */
    appendTo = input<HTMLElement | ElementRef | TemplateRef<any> | 'self' | 'body' | null | undefined | any>(undefined);

    /**
     * Specifies whether the overlay should be rendered inline within the current component's template.
     * @defaultValue false
     * @group Props
     */
    inline = input<boolean>(false);

    /**
     * The motion options.
     * @group Props
     */
    motionOptions = input<MotionOptions | undefined>(undefined);

    hostAttrSelector = input<string>();

    /**
     * This EventEmitter is used to notify changes in the visibility state of a component.
     * @param {Boolean} boolean - Value of visibility as boolean.
     * @group Emits
     */
    readonly visibleChange = output<boolean>();

    /**
     * Callback to invoke before the overlay is shown.
     * @param {OverlayOnBeforeShowEvent} event - Custom overlay before show event.
     * @group Emits
     */
    readonly onBeforeShow = output<OverlayOnBeforeShowEvent>();

    /**
     * Callback to invoke when the overlay is shown.
     * @param {OverlayOnShowEvent} event - Custom overlay show event.
     * @group Emits
     */
    readonly onShow = output<OverlayOnShowEvent>();

    /**
     * Callback to invoke before the overlay is hidden.
     * @param {OverlayOnBeforeHideEvent} event - Custom overlay before hide event.
     * @group Emits
     */
    readonly onBeforeHide = output<OverlayOnBeforeHideEvent>();

    /**
     * Callback to invoke when the overlay is hidden
     * @param {OverlayOnHideEvent} event - Custom hide event.
     * @group Emits
     */
    readonly onHide = output<OverlayOnHideEvent>();

    /**
     * Callback to invoke before the overlay enters.
     * @param {MotionEvent} event - Event before enter.
     * @group Emits
     */
    readonly onBeforeEnter = output<MotionEvent>();

    /**
     * Callback to invoke when the overlay enters.
     * @param {MotionEvent} event - Event on enter.
     * @group Emits
     */
    readonly onEnter = output<MotionEvent>();

    /**
     * Callback to invoke after the overlay has entered.
     * @param {MotionEvent} event - Event after enter.
     * @group Emits
     */
    readonly onAfterEnter = output<MotionEvent>();

    /**
     * Callback to invoke before the overlay leaves.
     * @param {MotionEvent} event - Event before leave.
     * @group Emits
     */
    readonly onBeforeLeave = output<MotionEvent>();

    /**
     * Callback to invoke when the overlay leaves.
     * @param {MotionEvent} event - Event on leave.
     * @group Emits
     */
    readonly onLeave = output<MotionEvent>();

    /**
     * Callback to invoke after the overlay has left.
     * @param {MotionEvent} event - Event after leave.
     * @group Emits
     */
    readonly onAfterLeave = output<MotionEvent>();

    readonly overlayViewChild = viewChild<ElementRef>('overlay');

    readonly contentViewChild = viewChild<ElementRef>('content');

    /**
     * Content template of the component.
     * @param {OverlayContentTemplateContext} context - content context.
     * @see {@link OverlayContentTemplateContext}
     * @group Templates
     */
    readonly contentTemplate = contentChild<TemplateRef<OverlayContentTemplateContext>>('content', { descendants: false });

    readonly templates = contentChildren(PrimeTemplate);

    componentName = 'Overlay';

    /**
     * Effective visibility: follows the `visible` input and is also written internally when the
     * overlay shows or hides itself (last write wins).
     */
    readonly $visible = linkedSignal(() => this.visible());

    /** Effective mode: the `mode` input, or the mode from the overlay options. */
    get $mode(): OverlayModeType | string {
        return this.mode() || this.overlayOptions?.mode;
    }

    /** Effective style: the `style` input merged with the (responsive) overlay options style. */
    get $mergedStyle(): { [klass: string]: any } | null | undefined {
        return ObjectUtils.merge(this.style(), this.modal ? this.overlayResponsiveOptions?.style : this.overlayOptions?.style);
    }

    /** Effective style class: the `styleClass` input merged with the (responsive) overlay options style class. */
    get $styleClass(): string {
        return ObjectUtils.merge(this.styleClass(), this.modal ? this.overlayResponsiveOptions?.styleClass : this.overlayOptions?.styleClass);
    }

    /** Effective content style: the `contentStyle` input merged with the (responsive) overlay options content style. */
    get $contentStyle(): { [klass: string]: any } | null | undefined {
        return ObjectUtils.merge(this.contentStyle(), this.modal ? this.overlayResponsiveOptions?.contentStyle : this.overlayOptions?.contentStyle);
    }

    /** Effective content style class: the `contentStyleClass` input merged with the (responsive) overlay options content style class. */
    get $contentStyleClass(): string {
        return ObjectUtils.merge(this.contentStyleClass(), this.modal ? this.overlayResponsiveOptions?.contentStyleClass : this.overlayOptions?.contentStyleClass);
    }

    /** Effective target: the `target` input, the overlay options target, or '@prev'. */
    get $target(): string | null | undefined {
        const value = this.target() || this.overlayOptions?.target;
        return value === undefined ? '@prev' : value;
    }

    /** Effective autoZIndex: the `autoZIndex` input, the overlay options value, or true. */
    get $autoZIndex(): boolean {
        const value = this.autoZIndex() || this.overlayOptions?.autoZIndex;
        return value === undefined ? true : value;
    }

    /** Effective baseZIndex: the `baseZIndex` input, the overlay options value, or 0. */
    get $baseZIndex(): number {
        const value = this.baseZIndex() || this.overlayOptions?.baseZIndex;
        return value === undefined ? 0 : value;
    }

    /** Effective show transition options. @deprecated since v21.0.0. Use `motionOptions` instead. */
    get $showTransitionOptions(): string {
        const value = this.showTransitionOptions() || this.overlayOptions?.showTransitionOptions;
        return value === undefined ? '.12s cubic-bezier(0, 0, 0.2, 1)' : value;
    }

    /** Effective hide transition options. @deprecated since v21.0.0. Use `motionOptions` instead. */
    get $hideTransitionOptions(): string {
        const value = this.hideTransitionOptions() || this.overlayOptions?.hideTransitionOptions;
        return value === undefined ? '.1s linear' : value;
    }

    /** Effective listener: the `listener` input, or the listener from the overlay options. */
    get $listener(): any {
        return this.listener() || this.overlayOptions?.listener;
    }

    /** Effective responsive options: the `responsive` input, or the responsive options from the overlay options. */
    get $responsive(): ResponsiveOverlayOptions | undefined {
        return this.responsive() || this.overlayOptions?.responsive;
    }

    computedMotionOptions = computed<MotionOptions>(() => {
        return {
            ...this.ptm('motion'),
            ...(this.motionOptions() || this.overlayOptions?.motionOptions)
        };
    });

    $appendTo = computed(() => this.appendTo() || this.config.overlayAppendTo());

    /**
     * Effective content template: the `#content` content child, or (legacy behavior) the last
     * projected pTemplate of any type.
     */
    readonly $contentTemplate = computed(() => this.contentTemplate() ?? (this.templates().at(-1)?.template as TemplateRef<OverlayContentTemplateContext> | undefined));

    /** Whether the (modal) wrapper element is rendered; stays on until the leave animation finishes. */
    readonly modalVisible = signal<boolean>(false);

    /**
     * Mirrors the legacy `visible` setter side effect: the wrapper renders as soon as the
     * overlay becomes visible, and is torn down only after the leave animation completes.
     */
    private readonly modalVisibleEffect = effect(() => {
        if (this.$visible()) {
            untracked(() => {
                if (!this.modalVisible()) {
                    this.modalVisible.set(true);
                }
            });
        }
    });

    isOverlayClicked: boolean = false;

    isOverlayContentClicked: boolean = false;

    scrollHandler: any;

    documentClickListener: any;

    documentResizeListener: any;

    private documentKeyboardListener: VoidListener;

    private parentDragSubscription: Subscription | null = null;

    private window: Window | null;

    protected transformOptions: any = {
        default: 'scaleY(0.8)',
        center: 'scale(0.7)',
        top: 'translate3d(0px, -100%, 0px)',
        'top-start': 'translate3d(0px, -100%, 0px)',
        'top-end': 'translate3d(0px, -100%, 0px)',
        bottom: 'translate3d(0px, 100%, 0px)',
        'bottom-start': 'translate3d(0px, 100%, 0px)',
        'bottom-end': 'translate3d(0px, 100%, 0px)',
        left: 'translate3d(-100%, 0px, 0px)',
        'left-start': 'translate3d(-100%, 0px, 0px)',
        'left-end': 'translate3d(-100%, 0px, 0px)',
        right: 'translate3d(100%, 0px, 0px)',
        'right-start': 'translate3d(100%, 0px, 0px)',
        'right-end': 'translate3d(100%, 0px, 0px)'
    };

    get modal() {
        if (isPlatformBrowser(this.platformId)) {
            return this.$mode === 'modal' || (this.overlayResponsiveOptions && this.document.defaultView?.matchMedia(this.overlayResponsiveOptions.media?.replace('@media', '') || `(max-width: ${this.overlayResponsiveOptions.breakpoint})`).matches);
        }
    }

    get overlayMode() {
        return this.$mode || (this.modal ? 'modal' : 'overlay');
    }

    get overlayOptions(): OverlayOptions {
        return { ...this.config?.overlayOptions, ...this.options() }; // TODO: Improve performance
    }

    get overlayResponsiveOptions(): ResponsiveOverlayOptions {
        return { ...this.overlayOptions?.responsive, ...this.responsive() }; // TODO: Improve performance
    }

    get overlayResponsiveDirection() {
        return this.overlayResponsiveOptions?.direction || 'center';
    }

    get overlayEl() {
        return this.overlayViewChild()?.nativeElement;
    }

    get contentEl() {
        return this.contentViewChild()?.nativeElement;
    }

    get targetEl() {
        return <any>getTargetElement(this.$target, this.el?.nativeElement);
    }

    container = signal<any>(undefined);

    constructor() {
        super();
        // Re-apply the host pass-through section after each render (replaces the former
        // ngAfterViewChecked hook). Bind.setAttrs writes into a signal behind an equality check,
        // so unchanged PT resolutions are no-ops.
        afterEveryRender(() => {
            this.bindDirectiveInstance.setAttrs(this.ptm('host'));
        });
    }

    onDestroy() {
        this.hide(this.overlayEl, true);

        if (this.overlayEl && this.$appendTo() !== 'self') {
            this.renderer.appendChild(this.el.nativeElement, this.overlayEl);
            ZIndexUtils.clear(this.overlayEl);
        }

        if (this.scrollHandler) {
            this.scrollHandler.destroy();
            this.scrollHandler = null;
        }

        this.unbindListeners();
    }

    show(overlay?: HTMLElement, isFocus: boolean = false) {
        this.onVisibleChange(true);
        this.handleEvents('onShow', { overlay: overlay || this.overlayEl, target: this.targetEl, mode: this.overlayMode });

        isFocus && focus(this.targetEl);
        this.modal && addClass(this.document?.body, 'p-overflow-hidden');
    }

    hide(overlay?: HTMLElement, isFocus: boolean = false) {
        if (!this.$visible()) {
            return;
        } else {
            this.onVisibleChange(false);
            this.handleEvents('onHide', { overlay: overlay || this.overlayEl, target: this.targetEl, mode: this.overlayMode });
            isFocus && focus(this.targetEl as any);
            this.modal && removeClass(this.document?.body, 'p-overflow-hidden');
        }
    }

    onVisibleChange(visible: boolean) {
        this.$visible.set(visible);
        this.visibleChange.emit(visible);
    }

    onOverlayClick() {
        this.isOverlayClicked = true;
    }

    onOverlayContentClick(event: MouseEvent) {
        this.overlayService.add({
            originalEvent: event,
            target: this.targetEl
        });

        this.isOverlayContentClicked = true;
    }

    onOverlayBeforeEnter(event: MotionEvent) {
        this.handleEvents('onBeforeShow', { overlay: this.overlayEl, target: this.targetEl, mode: this.overlayMode });
        this.container.set(this.overlayEl || event.element);
        this.show(this.overlayEl, true);
        this.hostAttrSelector() && this.overlayEl && this.overlayEl.setAttribute(this.hostAttrSelector(), '');
        this.appendOverlay();
        this.alignOverlay();
        this.bindParentDragListener();
        this.setZIndex();

        this.handleEvents('onBeforeEnter', event);
    }

    onOverlayEnter(event: MotionEvent) {
        this.handleEvents('onEnter', event);
    }

    onOverlayAfterEnter(event: MotionEvent) {
        this.bindListeners();
        this.handleEvents('onAfterEnter', event);
    }

    onOverlayBeforeLeave(event: MotionEvent) {
        this.handleEvents('onBeforeHide', { overlay: this.overlayEl, target: this.targetEl, mode: this.overlayMode });
        this.handleEvents('onBeforeLeave', event);
    }

    onOverlayLeave(event: MotionEvent) {
        this.handleEvents('onLeave', event);
    }

    onOverlayAfterLeave(event: MotionEvent) {
        this.hide(this.overlayEl, true);
        this.container.set(null);
        this.unbindListeners();
        this.appendOverlay();
        ZIndexUtils.clear(this.overlayEl);
        this.modalVisible.set(false);
        this.handleEvents('onAfterLeave', event);
    }

    handleEvents(name: string, params: any) {
        (this as any)[name].emit(params);
        const options = this.options();
        options && (options as any)[name] && (options as any)[name](params);
        this.config?.overlayOptions && (this.config?.overlayOptions as any)[name] && (this.config?.overlayOptions as any)[name](params);
    }

    setZIndex() {
        if (this.$autoZIndex) {
            ZIndexUtils.set(this.overlayMode, this.overlayEl, this.$baseZIndex + this.config?.zIndex[this.overlayMode]);
        }
    }

    appendOverlay() {
        if (this.$appendTo() && this.$appendTo() !== 'self') {
            if (this.$appendTo() === 'body') {
                appendChild(this.document.body, this.overlayEl);
            } else {
                appendChild(this.$appendTo(), this.overlayEl);
            }
        }
    }

    alignOverlay() {
        if (!this.modal) {
            if (this.overlayEl && this.targetEl) {
                this.overlayEl.style.minWidth = getOuterWidth(this.targetEl) + 'px';
                if (this.$appendTo() === 'self') {
                    relativePosition(this.overlayEl, this.targetEl);
                } else {
                    absolutePosition(this.overlayEl, this.targetEl);
                }
            }
        }
    }

    bindListeners() {
        this.bindScrollListener();
        this.bindDocumentClickListener();
        this.bindDocumentResizeListener();
        this.bindDocumentKeyboardListener();
    }

    unbindListeners() {
        this.unbindScrollListener();
        this.unbindDocumentClickListener();
        this.unbindDocumentResizeListener();
        this.unbindDocumentKeyboardListener();
        this.unbindParentDragListener();
    }

    bindParentDragListener() {
        if (!this.parentDragSubscription && this.$appendTo() !== 'self' && this.targetEl) {
            this.parentDragSubscription = this.overlayService.parentDragObservable.subscribe((container: Element) => {
                if (container.contains(this.targetEl)) {
                    this.hide(this.overlayEl, true);
                }
            });
        }
    }

    unbindParentDragListener() {
        if (this.parentDragSubscription) {
            this.parentDragSubscription.unsubscribe();
            this.parentDragSubscription = null;
        }
    }

    bindScrollListener() {
        if (!this.scrollHandler) {
            this.scrollHandler = new ConnectedOverlayScrollHandler(this.targetEl, (event: any) => {
                const valid = this.$listener ? this.$listener(event, { type: 'scroll', mode: this.overlayMode, valid: true }) : true;

                valid && this.hide(event, true);
            });
        }

        this.scrollHandler.bindScrollListener();
    }

    unbindScrollListener() {
        if (this.scrollHandler) {
            this.scrollHandler.unbindScrollListener();
        }
    }

    bindDocumentClickListener() {
        if (!this.documentClickListener) {
            this.documentClickListener = this.renderer.listen(this.document, 'click', (event) => {
                const isTargetClicked = this.targetEl && ((this.targetEl as any).isSameNode(event.target) || (!this.isOverlayClicked && (this.targetEl as any).contains(event.target)));
                const isOutsideClicked = !isTargetClicked && !this.isOverlayContentClicked;
                const valid = this.$listener ? this.$listener(event, { type: 'outside', mode: this.overlayMode, valid: event.which !== 3 && isOutsideClicked }) : isOutsideClicked;

                valid && this.hide(event);
                this.isOverlayClicked = this.isOverlayContentClicked = false;
            });
        }
    }

    unbindDocumentClickListener() {
        if (this.documentClickListener) {
            this.documentClickListener();
            this.documentClickListener = null;
        }
    }

    bindDocumentResizeListener() {
        if (!this.documentResizeListener) {
            this.documentResizeListener = this.renderer.listen(this.document.defaultView, 'resize', (event) => {
                const valid = this.$listener ? this.$listener(event, { type: 'resize', mode: this.overlayMode, valid: !isTouchDevice() }) : !isTouchDevice();

                valid && this.hide(event, true);
            });
        }
    }

    unbindDocumentResizeListener() {
        if (this.documentResizeListener) {
            this.documentResizeListener();
            this.documentResizeListener = null;
        }
    }

    bindDocumentKeyboardListener(): void {
        if (this.documentKeyboardListener) {
            return;
        }

        this.zone.runOutsideAngular(() => {
            this.documentKeyboardListener = this.renderer.listen(this.document.defaultView, 'keydown', (event) => {
                if (this.overlayOptions.hideOnEscape === false || event.code !== 'Escape') {
                    return;
                }

                const valid = this.$listener ? this.$listener(event, { type: 'keydown', mode: this.overlayMode, valid: !isTouchDevice() }) : !isTouchDevice();

                if (valid) {
                    this.zone.run(() => {
                        this.hide(event, true);
                    });
                }
            });
        });
    }

    unbindDocumentKeyboardListener(): void {
        if (this.documentKeyboardListener) {
            this.documentKeyboardListener();
            this.documentKeyboardListener = null;
        }
    }
}

@NgModule({
    imports: [Overlay, SharedModule],
    exports: [Overlay, SharedModule]
})
export class OverlayModule {}
