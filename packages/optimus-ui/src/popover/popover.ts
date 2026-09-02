import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
    afterEveryRender,
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    ElementRef,
    HostListener,
    inject,
    input,
    NgModule,
    NgZone,
    numberAttribute,
    signal,
    TemplateRef,
    ViewEncapsulation,
    ViewRef,
    contentChild,
    contentChildren,
    output
} from '@angular/core';
import { MotionEvent, MotionOptions } from '@openng/optimus-ui-motion';
import { $dt } from '@openng/optimus-ui-styled';
import { absolutePosition, addClass, appendChild, findSingle, getOffset, isIOS, isTouchDevice } from '@openng/optimus-ui-utils';
import { OverlayService, PrimeTemplate, SharedModule } from '@openng/optimus-ui/api';
import { BaseComponent, PARENT_INSTANCE } from '@openng/optimus-ui/basecomponent';
import { Bind } from '@openng/optimus-ui/bind';
import { ConnectedOverlayScrollHandler } from '@openng/optimus-ui/dom';
import { MotionModule } from '@openng/optimus-ui/motion';
import { Nullable, VoidListener } from '@openng/optimus-ui/ts-helpers';
import { PopoverContentTemplateContext, PopoverPassThrough } from '@openng/optimus-ui/types/popover';
import { ZIndexUtils } from '@openng/optimus-ui/utils';
import { Subscription } from 'rxjs';
import { PopoverStyle } from './style/popoverstyle';

/**
 * Popover is a container component that can overlay other components on page.
 * @group Components
 */
@Component({
    selector: 'p-popover',
    standalone: true,
    imports: [CommonModule, SharedModule, Bind, MotionModule],
    providers: [PopoverStyle, { provide: PARENT_INSTANCE, useExisting: Popover }],
    hostDirectives: [Bind],
    template: `
        @if (render()) {
            <div
                [pBind]="ptm('root')"
                [class]="cn(cx('root'), styleClass())"
                [style]="sx('root')"
                [ngStyle]="style()"
                (click)="onOverlayClick($event)"
                role="dialog"
                [attr.aria-modal]="overlayVisible()"
                [attr.aria-label]="ariaLabel()"
                [attr.aria-labelledBy]="ariaLabelledBy()"
                [pMotion]="overlayVisible()"
                pMotionName="p-anchored-overlay"
                [pMotionAppear]="true"
                (pMotionOnEnter)="onAnimationStart($event)"
                (pMotionOnAfterLeave)="onAnimationEnd()"
                [pMotionOptions]="computedMotionOptions()"
            >
                <div [pBind]="ptm('content')" [class]="cx('content')" (click)="onContentClick($event)" (mousedown)="onContentClick($event)">
                    <ng-content></ng-content>
                    <ng-template *ngTemplateOutlet="$contentTemplate(); context: { closeCallback: onCloseClick.bind(this) }"></ng-template>
                </div>
            </div>
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class Popover extends BaseComponent<PopoverPassThrough> {
    bindDirectiveInstance = inject(Bind, { self: true });

    _componentStyle = inject(PopoverStyle);

    zone = inject(NgZone);

    overlayService = inject(OverlayService);

    /**
     * Defines a string that labels the input for accessibility.
     * @group Props
     */
    readonly ariaLabel = input<string>();

    /**
     * Establishes relationships between the component and label(s) where its value should be one or more element IDs.
     * @group Props
     */
    readonly ariaLabelledBy = input<string>();

    /**
     * Enables to hide the overlay when outside is clicked.
     * @group Props
     */
    readonly dismissable = input<boolean, unknown>(true, { transform: booleanAttribute });

    /**
     * Inline style of the component.
     * @group Props
     */
    readonly style = input<{ [klass: string]: any } | null>();

    /**
     * Style class of the component.
     * @group Props
     */
    readonly styleClass = input<string>();

    /**
     * Target element to attach the overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name).
     * @defaultValue 'self'
     * @group Props
     */
    appendTo = input<HTMLElement | ElementRef | TemplateRef<any> | 'self' | 'body' | null | undefined | any>('body');

    /**
     * Whether to automatically manage layering.
     * @group Props
     */
    readonly autoZIndex = input<boolean, unknown>(true, { transform: booleanAttribute });

    /**
     * Aria label of the close icon.
     * @group Props
     */
    readonly ariaCloseLabel = input<string>();

    /**
     * Base zIndex value to use in layering.
     * @group Props
     */
    readonly baseZIndex = input<number, unknown>(0, { transform: numberAttribute });

    /**
     * When enabled, first button receives focus on show.
     * @group Props
     */
    readonly focusOnShow = input<boolean, unknown>(true, { transform: booleanAttribute });

    /**
     * Transition options of the show animation.
     * @group Props
     * @deprecated since v21.0.0. Use `motionOptions` instead.
     */
    readonly showTransitionOptions = input<string>('.12s cubic-bezier(0, 0, 0.2, 1)');

    /**
     * Transition options of the hide animation.
     * @group Props
     * @deprecated since v21.0.0. Use `motionOptions` instead.
     */
    readonly hideTransitionOptions = input<string>('.1s linear');

    /**
     * The motion options.
     * @group Props
     */
    motionOptions = input<MotionOptions | undefined>(undefined);

    /**
     * Callback to invoke when an overlay becomes visible.
     * @group Emits
     */
    readonly onShow = output<any>();

    /**
     * Callback to invoke when an overlay gets hidden.
     * @group Emits
     */
    readonly onHide = output<any>();

    /**
     * Custom content template.
     * @param {PopoverContentTemplateContext} context - content context.
     * @see {@link PopoverContentTemplateContext}
     * @group Templates
     */
    readonly contentTemplate = contentChild<Nullable<TemplateRef<PopoverContentTemplateContext>>>('content', { descendants: false });

    readonly templates = contentChildren(PrimeTemplate);

    componentName = 'Popover';

    computedMotionOptions = computed<MotionOptions>(() => {
        return {
            ...this.ptm('motion'),
            ...this.motionOptions()
        };
    });

    $appendTo = computed(() => this.appendTo() || this.config.overlayAppendTo());

    container: Nullable<HTMLDivElement>;

    readonly overlayVisible = signal<boolean>(false);

    readonly render = signal<boolean>(false);

    selfClick: boolean = false;

    documentClickListener: VoidListener;

    target: any;

    scrollHandler: Nullable<ConnectedOverlayScrollHandler>;

    documentResizeListener: VoidListener;

    /** Effective content template: the `#content` content child, or a legacy `pTemplate="content"`. */
    readonly $contentTemplate = computed(() => this.contentTemplate() ?? (this.templates().find((item) => item.getType() === 'content')?.template as TemplateRef<PopoverContentTemplateContext> | undefined));

    destroyCallback: Nullable<Function>;

    overlayEventListener: Nullable<(event?: any) => void>;

    overlaySubscription: Subscription | undefined;

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
        if (this.scrollHandler) {
            this.scrollHandler.destroy();
            this.scrollHandler = null;
        }

        if (this.container && this.autoZIndex()) {
            ZIndexUtils.clear(this.container);
        }

        if (!(this.cd as ViewRef).destroyed) {
            this.target = null;
        }

        this.destroyCallback = null;
        if (this.container) {
            this.restoreAppend();
            this.onContainerDestroy();
        }

        if (this.overlaySubscription) {
            this.overlaySubscription.unsubscribe();
        }
    }

    bindDocumentClickListener() {
        if (isPlatformBrowser(this.platformId)) {
            if (!this.documentClickListener) {
                let documentEvent = isIOS() ? 'touchstart' : 'click';
                const documentTarget: any = this.el ? this.el.nativeElement.ownerDocument : this.document;

                this.documentClickListener = this.renderer.listen(documentTarget, documentEvent, (event) => {
                    if (!this.dismissable()) {
                        return;
                    }

                    if (!this.container?.contains(event.target) && this.target !== event.target && !this.target.contains(event.target) && !this.selfClick) {
                        this.hide();
                    }

                    this.selfClick = false;
                    this.cd.markForCheck();
                });
            }
        }
    }

    unbindDocumentClickListener() {
        if (this.documentClickListener) {
            this.documentClickListener();
            this.documentClickListener = null;
            this.selfClick = false;
        }
    }

    /**
     * Toggles the visibility of the panel.
     * @param {Event} event - Browser event
     * @param {Target} target - Target element.
     * @group Method
     */
    toggle(event: any, target?: any) {
        if (this.overlayVisible()) {
            if (this.hasTargetChanged(event, target)) {
                this.destroyCallback = () => {
                    this.show(null, target || event.currentTarget || event.target);
                };
            }

            this.hide();
        } else {
            this.show(event, target);
        }
    }

    /**
     * Displays the panel.
     * @param {Event} event - Browser event
     * @param {Target} target - Target element.
     * @group Method
     */
    show(event: any, target?: any) {
        target && event && event.stopPropagation();

        // Clear container if it exists from previous show
        if (this.container && !this.overlayVisible()) {
            this.container = null;
        }

        this.target = target || event.currentTarget || event.target;
        this.overlayVisible.set(true);
        this.render.set(true);
        this.cd.markForCheck();
    }

    onOverlayClick(event: MouseEvent) {
        this.overlayService.add({
            originalEvent: event,
            target: this.el.nativeElement
        });

        this.selfClick = true;
    }

    onContentClick(event: MouseEvent) {
        const targetElement = event.target as HTMLElement;
        this.selfClick = event.offsetX < targetElement.clientWidth && event.offsetY < targetElement.clientHeight;
    }

    hasTargetChanged(event: any, target: any) {
        return this.target != null && this.target !== (target || event.currentTarget || event.target);
    }

    appendOverlay() {
        if (this.$appendTo() && this.$appendTo() !== 'self') {
            if (this.$appendTo() === 'body') {
                appendChild(this.document.body, this.container!);
            } else {
                appendChild(this.$appendTo(), this.container!);
            }
        }
    }

    restoreAppend() {
        if (this.container && this.$appendTo() && this.$appendTo() !== 'self') {
            appendChild(this.el.nativeElement, this.container);
        }
    }

    setZIndex() {
        if (this.autoZIndex()) {
            ZIndexUtils.set('overlay', this.container, this.baseZIndex() + this.config.zIndex.overlay);
        }
    }

    align() {
        if (this.target && this.container) {
            absolutePosition(this.container, this.target, false);

            const containerOffset = <any>getOffset(this.container);
            const targetOffset = <any>getOffset(this.target);
            const borderRadius = this.document.defaultView?.getComputedStyle(this.container).getPropertyValue('border-radius');
            let arrowLeft = 0;

            if (containerOffset.left < targetOffset.left) {
                arrowLeft = targetOffset.left - containerOffset.left - parseFloat(borderRadius!) * 2;
            }
            this.container.style.setProperty($dt('popover.arrow.left').name, `${arrowLeft}px`);

            if (containerOffset.top < targetOffset.top) {
                this.container.setAttribute('data-p-popover-flipped', 'true');
                !this.$unstyled() && addClass(this.container, 'p-popover-flipped');
            }
        }
    }

    onAnimationStart(event: MotionEvent) {
        this.container = event.element as HTMLDivElement;
        this.container?.setAttribute(this.$attrSelector, '');
        this.appendOverlay();
        this.align();
        this.setZIndex();
        this.bindDocumentClickListener();
        this.bindDocumentResizeListener();
        this.bindScrollListener();

        if (this.focusOnShow()) {
            this.focus();
        }

        this.overlayEventListener = (e) => {
            if (this.container && this.container.contains(e.target)) {
                this.selfClick = true;
            }
        };

        this.overlaySubscription = this.overlayService.clickObservable.subscribe(this.overlayEventListener);
        this.onShow.emit(null);
    }

    onAnimationEnd() {
        if (!this.overlayVisible()) {
            if (this.destroyCallback) {
                this.destroyCallback();
                this.destroyCallback = null;
            }

            if (this.overlaySubscription) {
                this.overlaySubscription.unsubscribe();
            }

            if (this.autoZIndex()) {
                ZIndexUtils.clear(this.container);
            }

            this.onContainerDestroy();
            this.onHide.emit({});
            this.render.set(false);
            this.container = null;
        }
    }

    focus() {
        let focusable = <any>findSingle(this.container!, '[autofocus]');
        if (focusable) {
            this.zone.runOutsideAngular(() => {
                setTimeout(() => focusable.focus(), 5);
            });
        }
    }

    /**
     * Hides the panel.
     * @group Method
     */
    hide() {
        this.overlayVisible.set(false);
        this.cd.markForCheck();
    }

    onCloseClick(event: MouseEvent) {
        this.hide();
        event.preventDefault();
    }

    @HostListener('document:keydown.escape', ['$event'])
    onEscapeKeydown(_event: KeyboardEvent) {
        this.hide();
    }

    onWindowResize() {
        if (this.overlayVisible() && !isTouchDevice()) {
            this.hide();
        }
    }

    bindDocumentResizeListener() {
        if (isPlatformBrowser(this.platformId)) {
            if (!this.documentResizeListener) {
                const window = this.document.defaultView as Window;
                this.documentResizeListener = this.renderer.listen(window, 'resize', this.onWindowResize.bind(this));
            }
        }
    }

    unbindDocumentResizeListener() {
        if (this.documentResizeListener) {
            this.documentResizeListener();
            this.documentResizeListener = null;
        }
    }

    bindScrollListener() {
        if (isPlatformBrowser(this.platformId)) {
            if (!this.scrollHandler) {
                this.scrollHandler = new ConnectedOverlayScrollHandler(this.target, () => {
                    if (this.overlayVisible()) {
                        this.hide();
                    }
                });
            }

            this.scrollHandler.bindScrollListener();
        }
    }

    unbindScrollListener() {
        if (this.scrollHandler) {
            this.scrollHandler.unbindScrollListener();
        }
    }

    onContainerDestroy() {
        if (!(this.cd as ViewRef).destroyed) {
            this.target = null;
        }

        this.unbindDocumentClickListener();
        this.unbindDocumentResizeListener();
        this.unbindScrollListener();
    }
}

@NgModule({
    imports: [Popover, SharedModule],
    exports: [Popover, SharedModule]
})
export class PopoverModule {}
