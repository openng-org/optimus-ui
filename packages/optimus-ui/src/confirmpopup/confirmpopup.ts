import { CommonModule } from '@angular/common';
import {
    afterEveryRender,
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    ElementRef,
    HostListener,
    inject,
    input,
    NgModule,
    numberAttribute,
    signal,
    TemplateRef,
    untracked,
    viewChild,
    ViewEncapsulation,
    contentChild,
    contentChildren
} from '@angular/core';
import { MotionEvent, MotionOptions } from '@openng/optimus-ui-motion';
import { absolutePosition, addClass, appendChild, findSingle, focus, getOffset, isIOS, isTouchDevice } from '@openng/optimus-ui-utils';
import { Confirmation, ConfirmationService, OverlayService, PrimeTemplate, SharedModule, TranslationKeys } from '@openng/optimus-ui/api';
import { BaseComponent, PARENT_INSTANCE } from '@openng/optimus-ui/basecomponent';
import { Bind } from '@openng/optimus-ui/bind';
import { ButtonModule } from '@openng/optimus-ui/button';
import { ConnectedOverlayScrollHandler } from '@openng/optimus-ui/dom';
import { FocusTrap } from '@openng/optimus-ui/focustrap';
import { MotionModule } from '@openng/optimus-ui/motion';
import { Nullable, VoidListener } from '@openng/optimus-ui/ts-helpers';
import { ConfirmPopupContentTemplateContext, ConfirmPopupHeadlessTemplateContext, ConfirmPopupPassThrough } from '@openng/optimus-ui/types/confirmpopup';
import { ZIndexUtils } from '@openng/optimus-ui/utils';
import { Subject, Subscription } from 'rxjs';
import { ConfirmPopupStyle } from './style/confirmpopupstyle';

/**
 * ConfirmPopup displays a confirmation overlay displayed relatively to its target.
 * @group Components
 */
@Component({
    selector: 'p-confirmpopup',
    standalone: true,
    imports: [CommonModule, SharedModule, ButtonModule, FocusTrap, Bind, MotionModule],
    providers: [ConfirmPopupStyle, { provide: PARENT_INSTANCE, useExisting: ConfirmPopup }],
    hostDirectives: [Bind],
    template: `
        @if (render()) {
            <div
                [pMotion]="computedVisible()"
                [pMotionAppear]="true"
                [pMotionName]="'p-anchored-overlay'"
                [pMotionOptions]="computedMotionOptions()"
                (pMotionOnBeforeEnter)="onBeforeEnter($event)"
                (pMotionOnAfterLeave)="onAfterLeave()"
                pFocusTrap
                [pBind]="ptm('root')"
                [class]="cn(cx('root'), styleClass())"
                [ngStyle]="style()"
                role="alertdialog"
                (click)="onOverlayClick($event)"
            >
                <ng-container *ngIf="$headlessTemplate(); else notHeadless">
                    <ng-container *ngTemplateOutlet="$headlessTemplate(); context: { $implicit: confirmation() }"></ng-container>
                </ng-container>
                <ng-template #notHeadless>
                    <div #content [pBind]="ptm('content')" [class]="cx('content')">
                        <ng-container *ngIf="$contentTemplate(); else withoutContentTemplate">
                            <ng-container *ngTemplateOutlet="$contentTemplate(); context: { $implicit: confirmation() }"></ng-container>
                        </ng-container>
                        <ng-template #withoutContentTemplate>
                            <i [pBind]="ptm('icon')" [class]="cx('icon')" *ngIf="confirmation()?.icon"></i>
                            <span [pBind]="ptm('message')" [class]="cx('message')">{{ confirmation()?.message }}</span>
                        </ng-template>
                    </div>
                    <div [pBind]="ptm('footer')" [class]="cx('footer')">
                        <p-button
                            type="button"
                            [label]="rejectButtonLabel"
                            (onClick)="onReject()"
                            [pt]="ptm('pcRejectButton')"
                            [class]="cx('pcRejectButton')"
                            [styleClass]="confirmation()?.rejectButtonStyleClass"
                            [size]="confirmation()?.rejectButtonProps?.size || 'small'"
                            [text]="confirmation()?.rejectButtonProps?.text || false"
                            *ngIf="confirmation()?.rejectVisible !== false"
                            [attr.aria-label]="rejectButtonLabel"
                            [buttonProps]="getRejectButtonProps()"
                            [autofocus]="autoFocusReject()"
                            [unstyled]="unstyled()"
                        >
                            <ng-template #icon>
                                <i [class]="confirmation()?.rejectIcon" *ngIf="confirmation()?.rejectIcon; else rejecticon"></i>
                                <ng-template #rejecticon *ngTemplateOutlet="$rejectIconTemplate()"></ng-template>
                            </ng-template>
                        </p-button>
                        <p-button
                            type="button"
                            [label]="acceptButtonLabel"
                            (onClick)="onAccept()"
                            [pt]="ptm('pcAcceptButton')"
                            [class]="cx('pcAcceptButton')"
                            [styleClass]="confirmation()?.acceptButtonStyleClass"
                            [size]="confirmation()?.acceptButtonProps?.size || 'small'"
                            *ngIf="confirmation()?.acceptVisible !== false"
                            [attr.aria-label]="acceptButtonLabel"
                            [buttonProps]="getAcceptButtonProps()"
                            [autofocus]="autoFocusAccept()"
                            [unstyled]="unstyled()"
                        >
                            <ng-template #icon>
                                <i [class]="confirmation()?.acceptIcon" *ngIf="confirmation()?.acceptIcon; else accepticontemplate"></i>
                                <ng-template #accepticontemplate *ngTemplateOutlet="$acceptIconTemplate()"></ng-template>
                            </ng-template>
                        </p-button>
                    </div>
                </ng-template>
            </div>
        }
    `,

    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class ConfirmPopup extends BaseComponent<ConfirmPopupPassThrough> {
    private confirmationService = inject(ConfirmationService);

    overlayService = inject(OverlayService);

    bindDirectiveInstance = inject(Bind, { self: true });

    _componentStyle = inject(ConfirmPopupStyle);

    /**
     * Optional key to match the key of confirm object, necessary to use when component tree has multiple confirm dialogs.
     * @group Props
     */
    readonly key = input<string>();

    /**
     * Element to receive the focus when the popup gets visible, valid values are "accept", "reject", and "none".
     * @group Props
     */
    readonly defaultFocus = input<string>('accept');

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
     * Whether to automatically manage layering.
     * @group Props
     */
    readonly autoZIndex = input<boolean, unknown>(true, { transform: booleanAttribute });

    /**
     * Base zIndex value to use in layering.
     * @group Props
     */
    readonly baseZIndex = input<number, unknown>(0, { transform: numberAttribute });

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
     * Defines if the component is visible.
     * @group Props
     */
    visible = input<boolean>();

    /**
     * The motion options.
     * @group Props
     */
    motionOptions = input<MotionOptions | undefined>(undefined);

    /**
     * Target element to attach the overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name).
     * @defaultValue 'body'
     * @group Props
     */
    appendTo = input<HTMLElement | ElementRef | TemplateRef<any> | 'self' | 'body' | null | undefined | any>('body');

    acceptButtonViewChild = viewChild('acceptButton', { read: ElementRef });

    rejectButtonViewChild = viewChild('rejectButton', { read: ElementRef });

    /**
     * Custom content template.
     * @group Templates
     */
    readonly contentTemplate = contentChild<Nullable<TemplateRef<ConfirmPopupContentTemplateContext>>>('content', { descendants: false });

    /**
     * Custom accept icon template.
     * @group Templates
     */
    readonly acceptIconTemplate = contentChild<Nullable<TemplateRef<void>>>('accepticon', { descendants: false });

    /**
     * Custom reject icon template.
     * @group Templates
     */
    readonly rejectIconTemplate = contentChild<Nullable<TemplateRef<void>>>('rejecticon', { descendants: false });

    /**
     * Custom headless template.
     * @group Templates
     */
    readonly headlessTemplate = contentChild<Nullable<TemplateRef<ConfirmPopupHeadlessTemplateContext>>>('headless', { descendants: false });

    readonly templates = contentChildren(PrimeTemplate);

    componentName = 'ConfirmPopup';

    private _visible = signal<boolean>(false);

    computedVisible = computed(() => this.visible() ?? this._visible());

    render = signal<boolean>(false);

    computedMotionOptions = computed<MotionOptions>(() => {
        return {
            ...this.ptm('motion'),
            ...this.motionOptions()
        };
    });

    $appendTo = computed(() => this.appendTo() || this.config.overlayAppendTo());

    container: HTMLElement | null;

    subscription: Subscription;

    readonly confirmation = signal<Nullable<Confirmation>>(null);

    readonly autoFocusAccept = signal<boolean>(false);

    readonly autoFocusReject = signal<boolean>(false);

    /** Effective content template: the `#content` content child, or a legacy `pTemplate="content"`. */
    readonly $contentTemplate = computed(() => this.contentTemplate() ?? (this.templates().find((item) => item.getType() === 'content')?.template as TemplateRef<ConfirmPopupContentTemplateContext> | undefined));

    /** Effective accept icon template: the `#accepticon` content child, or a legacy `pTemplate="accepticon"`. */
    readonly $acceptIconTemplate = computed(() => this.acceptIconTemplate() ?? (this.templates().find((item) => item.getType() === 'accepticon')?.template as TemplateRef<void> | undefined));

    /** Effective reject icon template: the `#rejecticon` content child, or a legacy `pTemplate="rejecticon"`. */
    readonly $rejectIconTemplate = computed(() => this.rejectIconTemplate() ?? (this.templates().find((item) => item.getType() === 'rejecticon')?.template as TemplateRef<void> | undefined));

    /** Effective headless template: the `#headless` content child, or a legacy `pTemplate="headless"`. */
    readonly $headlessTemplate = computed(() => this.headlessTemplate() ?? (this.templates().find((item) => item.getType() === 'headless')?.template as TemplateRef<ConfirmPopupHeadlessTemplateContext> | undefined));

    documentClickListener: VoidListener;

    documentResizeListener: VoidListener;

    scrollHandler: Nullable<ConnectedOverlayScrollHandler>;

    private window: Window;

    get acceptButtonLabel(): string {
        return this.confirmation()?.acceptLabel || this.confirmation()?.acceptButtonProps?.label || this.config.getTranslation(TranslationKeys.ACCEPT);
    }

    get rejectButtonLabel(): string {
        return this.confirmation()?.rejectLabel || this.confirmation()?.rejectButtonProps?.label || this.config.getTranslation(TranslationKeys.REJECT);
    }

    constructor() {
        super();
        this.window = this.document.defaultView as Window;
        this.subscription = this.confirmationService.requireConfirmation$.subscribe((confirmation) => {
            if (!confirmation) {
                this.hide();
                return;
            }

            if (this.computedVisible()) {
                requestAnimationFrame(() => {
                    this.alignOverlay();
                    this.cd.markForCheck();
                });
            }

            if (confirmation.key === this.key()) {
                if (confirmation.accept) {
                    confirmation.acceptEvent = new Subject();
                    confirmation.acceptEvent.subscribe(confirmation.accept as () => void);
                }

                if (confirmation.reject) {
                    confirmation.rejectEvent = new Subject();
                    confirmation.rejectEvent.subscribe(confirmation.reject as () => void);
                }
                this.confirmation.set(confirmation);

                this._visible.set(true);
            }
        });

        // Re-apply the host pass-through section after each render (replaces the former
        // ngAfterViewChecked hook). Bind.setAttrs writes into a signal behind an equality check,
        // so unchanged PT resolutions are no-ops.
        afterEveryRender(() => {
            this.bindDirectiveInstance.setAttrs(this.ptm('host'));
        });

        effect(() => {
            if (this.computedVisible()) {
                untracked(() => {
                    if (!this.render()) {
                        this.render.set(true);
                    }
                });
            }
        });
    }

    onDestroy() {
        this.restoreAppend();

        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    option(name: string, k?: string) {
        const confirmation: { [key: string]: any } = this.confirmation() ?? {};
        const fromConfirmation = Object.prototype.hasOwnProperty.call(confirmation, name);
        const source: { [key: string]: any } = fromConfirmation ? confirmation : this;

        if (Object.prototype.hasOwnProperty.call(source, name)) {
            let value = source[name];
            // Inputs on the component itself are signals now — unwrap them.
            if (!fromConfirmation && typeof value === 'function') {
                value = value.call(this);
            }
            if (k) {
                return value?.[k];
            }
            return value;
        }

        return undefined;
    }

    @HostListener('document:keydown.Escape', ['$event'])
    onEscapeKeydown(event: KeyboardEvent) {
        const confirmation = this.confirmation();
        if (confirmation && confirmation.closeOnEscape !== false) {
            this.onReject();
        }
    }

    onBeforeEnter(event: MotionEvent) {
        if (this.confirmation()) {
            const focus = this.option('defaultFocus');
            this.autoFocusAccept.set(focus === 'accept');
            this.autoFocusReject.set(focus === 'reject');
        }

        this.container = event.element as HTMLElement;
        this.appendOverlay();
        this.alignOverlay();
        this.alignArrow();
        this.setZIndex();
        this.handleFocus();
        this.bindListeners();
    }

    handleFocus() {
        const defaultFocus = this.option('defaultFocus');

        if (defaultFocus && (this.acceptButtonViewChild() || this.rejectButtonViewChild())) {
            const focusEl = <HTMLButtonElement>(defaultFocus === 'accept' ? findSingle(this.acceptButtonViewChild()?.nativeElement, '[data-pc-section="root"]') : findSingle(this.rejectButtonViewChild()?.nativeElement, '[data-pc-section="root"]'));
            focusEl.focus();
        }
    }

    onAfterLeave() {
        this.autoFocusAccept.set(false);
        this.autoFocusReject.set(false);
        this.restoreAppend();
        this.onContainerDestroy();
    }

    getAcceptButtonProps() {
        return this.option('acceptButtonProps');
    }

    getRejectButtonProps() {
        return this.option('rejectButtonProps');
    }

    alignOverlay() {
        const confirmation = this.confirmation();
        if (!confirmation || !confirmation.target) {
            return;
        }

        absolutePosition(this.container!, confirmation.target as HTMLElement, false);
    }

    setZIndex() {
        if (this.autoZIndex()) {
            ZIndexUtils.set('overlay', this.container, this.config.zIndex.overlay);
        }
    }

    alignArrow() {
        const containerOffset = <any>getOffset(this.container);
        const targetOffset = <any>getOffset(this.confirmation()?.target as any);
        let arrowLeft = 0;

        if (containerOffset && targetOffset && containerOffset.left < targetOffset.left) {
            arrowLeft = targetOffset.left - containerOffset.left;
        }
        if (this.container) {
            (this.container as HTMLDivElement).style.setProperty('--p-confirmpopup-arrow-left', `${arrowLeft}px`);
        }

        if (containerOffset && targetOffset && containerOffset.top < targetOffset.top) {
            (this.container as HTMLElement).setAttribute('data-p-confirmpopup-flipped', 'true');
            !this.$unstyled() && addClass(this.container as HTMLDivElement, 'p-confirm-popup-flipped');
        }
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
        if (this.container && this.$appendTo() !== 'self') {
            appendChild(this.el.nativeElement, this.container);
        }

        this.onContainerDestroy();
    }

    hide() {
        this._visible.set(false);
    }

    onAccept() {
        const confirmation = this.confirmation();
        if (confirmation?.acceptEvent) {
            confirmation.acceptEvent.next(undefined);
        }

        this.hide();
        focus(confirmation?.target as any);
    }

    onReject() {
        const confirmation = this.confirmation();
        if (confirmation?.rejectEvent) {
            confirmation.rejectEvent.next(undefined);
        }

        this.hide();
        focus(confirmation?.target as any);
    }

    onOverlayClick(event: MouseEvent) {
        this.overlayService.add({
            originalEvent: event,
            target: this.el.nativeElement
        });
    }

    bindListeners(): void {
        /*
         * Called inside `setTimeout` to avoid listening to the click event that appears when `confirm` is first called(bubbling).
         * Need wait when bubbling event up and hang the handler on the next tick.
         * This is the case when eventTarget and confirmation.target do not match when the `confirm` method is called.
         */
        setTimeout(() => {
            this.bindDocumentClickListener();
            this.bindDocumentResizeListener();
            this.bindScrollListener();
        });
    }

    unbindListeners() {
        this.unbindDocumentClickListener();
        this.unbindDocumentResizeListener();
        this.unbindScrollListener();
    }

    bindDocumentClickListener() {
        if (!this.documentClickListener) {
            let documentEvent = isIOS() ? 'touchstart' : 'click';
            const documentTarget: any = this.el ? this.el.nativeElement.ownerDocument : this.document;

            this.documentClickListener = this.renderer.listen(documentTarget, documentEvent, (event) => {
                const confirmation = this.confirmation();
                if (confirmation && confirmation.dismissableMask !== false) {
                    let targetElement = <HTMLElement>confirmation.target;
                    if (this.container !== event.target && !this.container?.contains(event.target) && targetElement !== event.target && !targetElement.contains(event.target)) {
                        this.hide();
                    }
                }
            });
        }
    }

    unbindDocumentClickListener() {
        if (this.documentClickListener) {
            this.documentClickListener();
            this.documentClickListener = null;
        }
    }

    onWindowResize() {
        if (this.computedVisible() && !isTouchDevice()) {
            this.hide();
        }
    }

    bindDocumentResizeListener() {
        if (!this.documentResizeListener) {
            this.documentResizeListener = this.renderer.listen(this.window, 'resize', this.onWindowResize.bind(this));
        }
    }

    unbindDocumentResizeListener() {
        if (this.documentResizeListener) {
            this.documentResizeListener();
            this.documentResizeListener = null;
        }
    }

    bindScrollListener() {
        if (!this.scrollHandler) {
            this.scrollHandler = new ConnectedOverlayScrollHandler(this.confirmation()?.target, () => {
                if (this.computedVisible()) {
                    this.hide();
                }
            });
        }

        this.scrollHandler.bindScrollListener();
    }

    unbindScrollListener() {
        if (this.scrollHandler) {
            this.scrollHandler.unbindScrollListener();
        }
    }

    unsubscribeConfirmationSubscriptions() {
        const confirmation = this.confirmation();
        if (confirmation) {
            if (confirmation.acceptEvent) {
                confirmation.acceptEvent.unsubscribe();
            }

            if (confirmation.rejectEvent) {
                confirmation.rejectEvent.unsubscribe();
            }
        }
    }

    onContainerDestroy() {
        this.unbindListeners();
        this.unsubscribeConfirmationSubscriptions();

        if (this.autoZIndex()) {
            ZIndexUtils.clear(this.container);
        }

        this.confirmation.set(null);
        this.render.set(false);
        this.container = null;
    }
}

@NgModule({
    imports: [ConfirmPopup, SharedModule],
    exports: [ConfirmPopup, SharedModule]
})
export class ConfirmPopupModule {}
