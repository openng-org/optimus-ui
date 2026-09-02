import { CommonModule } from '@angular/common';
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
    model,
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
import { MotionEvent, MotionOptions } from '@openng/optimus-ui-motion';
import { addClass, appendChild, removeClass, setAttribute } from '@openng/optimus-ui-utils';
import { PrimeTemplate, SharedModule } from '@openng/optimus-ui/api';
import { BaseComponent, PARENT_INSTANCE } from '@openng/optimus-ui/basecomponent';
import { Bind } from '@openng/optimus-ui/bind';
import { Button, ButtonProps } from '@openng/optimus-ui/button';
import { blockBodyScroll, unblockBodyScroll } from '@openng/optimus-ui/dom';
import { FocusTrapModule } from '@openng/optimus-ui/focustrap';
import { TimesIcon } from '@openng/optimus-ui/icons';
import { MotionModule } from '@openng/optimus-ui/motion';
import { Nullable, VoidListener } from '@openng/optimus-ui/ts-helpers';
import { DrawerPassThrough } from '@openng/optimus-ui/types/drawer';
import { ZIndexUtils } from '@openng/optimus-ui/utils';
import { DrawerStyle } from './style/drawerstyle';

/**
 * Sidebar is a panel component displayed as an overlay at the edges of the screen.
 * @group Components
 */
@Component({
    selector: 'p-drawer',
    standalone: true,
    imports: [CommonModule, Button, TimesIcon, SharedModule, Bind, FocusTrapModule, MotionModule],
    providers: [DrawerStyle, { provide: PARENT_INSTANCE, useExisting: Drawer }],
    hostDirectives: [Bind],
    template: `
        @if (modalVisible()) {
            <div
                #container
                [pBind]="ptm('root')"
                [pMotion]="visible()"
                [pMotionAppear]="true"
                [pMotionEnterActiveClass]="$enterAnimation()"
                [pMotionLeaveActiveClass]="$leaveAnimation()"
                [pMotionOptions]="computedMotionOptions()"
                (pMotionOnBeforeEnter)="onBeforeEnter($event)"
                (pMotionOnAfterLeave)="onAfterLeave($event)"
                [class]="cn(cx('root'), styleClass())"
                [style]="style()"
                role="complementary"
                (keydown)="onKeyDown($event)"
                pFocusTrap
                [attr.data-p]="dataP()"
                [attr.data-p-open]="visible()"
            >
                @if ($headlessTemplate()) {
                    <ng-container *ngTemplateOutlet="$headlessTemplate()"></ng-container>
                } @else {
                    <div [pBind]="ptm('header')" [ngClass]="cx('header')" [attr.data-pc-section]="'header'">
                        <ng-container *ngTemplateOutlet="$headerTemplate()"></ng-container>
                        @if (header()) {
                            <div [pBind]="ptm('title')" [class]="cx('title')">{{ header() }}</div>
                        }
                        @if (showCloseIcon() && closable()) {
                            <p-button
                                [pt]="ptm('pcCloseButton')"
                                [ngClass]="cx('pcCloseButton')"
                                (onClick)="close($event)"
                                (keydown.enter)="close($event)"
                                [buttonProps]="closeButtonProps()"
                                [ariaLabel]="ariaCloseLabel()"
                                [attr.data-pc-group-section]="'iconcontainer'"
                                [unstyled]="unstyled()"
                            >
                                <ng-template #icon>
                                    @if (!$closeIconTemplate()) {
                                        <svg data-p-icon="times" [attr.data-pc-section]="'closeicon'" />
                                    }
                                    <ng-template *ngTemplateOutlet="$closeIconTemplate()"></ng-template>
                                </ng-template>
                            </p-button>
                        }
                    </div>

                    <div [pBind]="ptm('content')" [ngClass]="cx('content')" [attr.data-pc-section]="'content'">
                        <ng-content></ng-content>
                        <ng-container *ngTemplateOutlet="$contentTemplate()"></ng-container>
                    </div>

                    @if ($footerTemplate()) {
                        <div [pBind]="ptm('footer')" [ngClass]="cx('footer')" [attr.data-pc-section]="'footer'">
                            <ng-container *ngTemplateOutlet="$footerTemplate()"></ng-container>
                        </div>
                    }
                }
            </div>
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class Drawer extends BaseComponent<DrawerPassThrough> {
    bindDirectiveInstance = inject(Bind, { self: true });

    _componentStyle = inject(DrawerStyle);

    /**
     * Target element to attach the overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name).
     * @defaultValue 'self'
     * @group Props
     */
    appendTo = input<HTMLElement | ElementRef | TemplateRef<any> | 'self' | 'body' | null | undefined | any>(undefined);

    /**
     * The motion options.
     * @group Props
     */
    motionOptions = input<MotionOptions | undefined>(undefined);

    /**
     * Whether to block scrolling of the document when drawer is active.
     * @group Props
     */
    readonly blockScroll = input<boolean, unknown>(false, { transform: booleanAttribute });

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
     * Aria label of the close icon.
     * @group Props
     */
    readonly ariaCloseLabel = input<string>();

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
     * Whether an overlay mask is displayed behind the drawer.
     * @group Props
     */
    readonly modal = input<boolean, unknown>(true, { transform: booleanAttribute });

    /**
     * Used to pass all properties of the ButtonProps to the Button component.
     * @group Props
     */
    readonly closeButtonProps = input<ButtonProps>({ severity: 'secondary', text: true, rounded: true });

    /**
     * Whether to dismiss drawer on click of the mask.
     * @group Props
     */
    readonly dismissible = input<boolean, unknown>(true, { transform: booleanAttribute });

    /**
     * Whether to display the close icon.
     * @group Props
     * @deprecated use 'closable' instead.
     */
    readonly showCloseIcon = input<boolean, unknown>(true, { transform: booleanAttribute });

    /**
     * Specifies if pressing escape key should hide the drawer.
     * @group Props
     */
    readonly closeOnEscape = input<boolean, unknown>(true, { transform: booleanAttribute });

    /**
     * Transition options of the animation.
     * @group Props
     * @deprecated since v21.0.0. Use `motionOptions` instead.
     */
    readonly transitionOptions = input<string>('150ms cubic-bezier(0, 0, 0.2, 1)');

    /**
     * The visible property determines the visibility of the component. Supports two-way binding
     * via `[(visible)]`; the model emits `visibleChange` on every change.
     * @defaultValue false
     * @group Props
     */
    readonly visible = model<boolean>(false);

    /**
     * Specifies the position of the drawer, valid values are "left", "right", "bottom" and "top".
     * @defaultValue 'left'
     * @group Props
     */
    position = input<'left' | 'right' | 'bottom' | 'top' | 'full'>('left');

    /**
     * Adds a close icon to the header to hide the dialog.
     * @defaultValue false
     * @group Props
     */
    fullScreen = input<boolean>(false);

    /**
     * Title content of the dialog.
     * @group Props
     */
    readonly header = input<string>();

    /**
     * Style of the mask.
     * @group Props
     */
    readonly maskStyle = input<{ [klass: string]: any } | null>();

    /**
     * Whether to display close button.
     * @group Props
     * @defaultValue true
     */
    readonly closable = input<boolean, unknown>(true, { transform: booleanAttribute });

    /**
     * Callback to invoke when dialog is shown.
     * @group Emits
     */
    readonly onShow = output<any>();

    /**
     * Callback to invoke when dialog is hidden.
     * @group Emits
     */
    readonly onHide = output<any>();

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
     * Custom content template.
     * @group Templates
     */
    readonly contentTemplate = contentChild<TemplateRef<void>>('content', { descendants: false });

    /**
     * Custom close icon template.
     * @group Templates
     */
    readonly closeIconTemplate = contentChild<TemplateRef<void>>('closeicon', { descendants: false });

    /**
     * Custom headless template to replace the entire drawer content.
     * @group Templates
     */
    readonly headlessTemplate = contentChild<TemplateRef<void>>('headless', { descendants: false });

    readonly templates = contentChildren(PrimeTemplate);

    componentName = 'Drawer';

    computedMotionOptions = computed<MotionOptions>(() => {
        return {
            ...this.ptm('motion'),
            ...this.motionOptions()
        };
    });

    /** Renders the drawer container as soon as `visible` becomes true (it is removed again after the leave animation). */
    private readonly syncModalVisibleEffect = effect(() => {
        if (this.visible() && !untracked(this.modalVisible)) {
            this.modalVisible.set(true);
        }
    });

    $enterAnimation = computed(() => (this.fullScreen() ? 'p-drawer-enter-full' : `p-drawer-enter-${this.position()}`));

    $leaveAnimation = computed(() => (this.fullScreen() ? 'p-drawer-leave-full' : `p-drawer-leave-${this.position()}`));

    readonly modalVisible = signal<boolean>(false);

    container: Nullable<HTMLDivElement>;

    mask: Nullable<HTMLDivElement>;

    maskClickListener: VoidListener;

    documentEscapeListener: VoidListener;

    animationEndListener: VoidListener;

    $appendTo = computed(() => this.appendTo() || this.config.overlayAppendTo());

    /** Effective header template: the `#header` content child, or a legacy `pTemplate="header"`. */
    readonly $headerTemplate = computed(() => this.headerTemplate() ?? this.templates().find((item) => item.getType() === 'header')?.template);

    /** Effective footer template: the `#footer` content child, or a legacy `pTemplate="footer"`. */
    readonly $footerTemplate = computed(() => this.footerTemplate() ?? this.templates().find((item) => item.getType() === 'footer')?.template);

    /**
     * Effective content template: the `#content` content child, a legacy `pTemplate="content"`,
     * or (legacy behavior) the last `pTemplate` with an unrecognized type.
     */
    readonly $contentTemplate = computed(() => {
        const contentTemplate = this.contentTemplate();
        if (contentTemplate) {
            return contentTemplate;
        }
        const known = ['header', 'footer', 'closeicon', 'headless'];
        return [...this.templates()].reverse().find((item) => !known.includes(item.getType()))?.template;
    });

    /** Effective close icon template: the `#closeicon` content child, or a legacy `pTemplate="closeicon"`. */
    readonly $closeIconTemplate = computed(() => this.closeIconTemplate() ?? this.templates().find((item) => item.getType() === 'closeicon')?.template);

    /** Effective headless template: the `#headless` content child, or a legacy `pTemplate="headless"`. */
    readonly $headlessTemplate = computed(() => this.headlessTemplate() ?? this.templates().find((item) => item.getType() === 'headless')?.template);

    readonly dataP = computed(() =>
        this.cn({
            'full-screen': this.position() === 'full',
            [this.position()]: this.position(),
            open: this.visible(),
            modal: this.modal()
        })
    );

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
        if (this.visible() && this.modal()) {
            this.destroyModal();
        }

        if (this.$appendTo() && this.container) {
            this.renderer.appendChild(this.el.nativeElement, this.container);
        }

        if (this.container && this.autoZIndex()) {
            ZIndexUtils.clear(this.container);
        }

        this.container = null;
        this.unbindGlobalListeners();
        this.unbindAnimationEndListener();
    }

    onKeyDown(event: KeyboardEvent) {
        if (event.code === 'Escape') {
            this.hide(false);
        }
    }

    show() {
        this.container?.setAttribute(this.$attrSelector, '');

        if (this.autoZIndex()) {
            ZIndexUtils.set('modal', this.container, this.baseZIndex() || this.config.zIndex.modal);
        }

        if (this.modal()) {
            this.enableModality();
        }

        this.onShow.emit({});
    }

    hide(emit: boolean = true) {
        if (emit) {
            this.onHide.emit({});
        }

        if (this.modal()) {
            this.disableModality();
        }
    }

    close(event: Event) {
        this.hide();
        this.visible.set(false);
        this.cd.markForCheck();
        event.preventDefault();
    }

    enableModality() {
        const activeDrawers = this.document.querySelectorAll('[data-p-open="true"]');
        const activeDrawersLength = activeDrawers.length;
        const zIndex = activeDrawersLength == 1 ? String(parseInt((this.container as HTMLDivElement).style.zIndex) - 1) : String(parseInt((activeDrawers[activeDrawersLength - 1] as HTMLElement).style.zIndex) - 1);

        if (!this.mask) {
            this.mask = this.renderer.createElement('div');

            if (this.mask) {
                const style = `z-index: ${zIndex};${this.getMaskStyle()}`;
                setAttribute(this.mask, 'style', style);
                setAttribute(this.mask, 'data-p', this.dataP());
                addClass(this.mask, this.cx('mask'));
            }

            if (this.dismissible()) {
                this.maskClickListener = this.renderer.listen(this.mask, 'click', (event: any) => {
                    if (this.dismissible()) {
                        this.close(event);
                    }
                });
            }

            this.renderer.appendChild(this.document.body, this.mask);
            if (this.blockScroll()) {
                blockBodyScroll();
            }
        }
    }

    getMaskStyle() {
        const maskStyle = this.maskStyle();
        return maskStyle
            ? Object.entries(maskStyle)
                  .map(([key, value]) => `${key}: ${value}`)
                  .join('; ')
            : '';
    }

    disableModality() {
        if (this.mask) {
            !this.$unstyled() && removeClass(this.mask, 'p-overlay-mask-enter-active');
            !this.$unstyled() && addClass(this.mask, 'p-overlay-mask-leave-active');
            this.animationEndListener = this.renderer.listen(this.mask, 'animationend', this.destroyModal.bind(this));
        }
    }

    destroyModal() {
        this.unbindMaskClickListener();

        if (this.mask) {
            this.renderer.removeChild(this.document.body, this.mask);
        }

        if (this.blockScroll()) {
            unblockBodyScroll();
        }

        this.unbindAnimationEndListener();
        this.mask = null;
    }

    onBeforeEnter(event: MotionEvent) {
        this.container = event.element as HTMLDivElement;
        this.appendContainer();
        this.show();

        if (this.closeOnEscape()) {
            this.bindDocumentEscapeListener();
        }
    }

    onAfterLeave() {
        this.hide(false);
        ZIndexUtils.clear(this.container);
        this.unbindGlobalListeners();
        this.modalVisible.set(false);
        this.container = null;
    }

    appendContainer() {
        if (this.$appendTo() && this.$appendTo() !== 'self') {
            if (this.$appendTo() === 'body') {
                appendChild(this.document.body, this.container!);
            } else {
                appendChild(this.$appendTo(), this.container!);
            }
        }
    }

    bindDocumentEscapeListener() {
        const documentTarget: any = this.el ? this.el.nativeElement.ownerDocument : this.document;

        this.documentEscapeListener = this.renderer.listen(documentTarget, 'keydown', (event) => {
            if (event.which == 27) {
                if (parseInt((this.container as HTMLDivElement)?.style.zIndex) === ZIndexUtils.get(this.container)) {
                    this.close(event);
                }
            }
        });
    }

    unbindDocumentEscapeListener() {
        if (this.documentEscapeListener) {
            this.documentEscapeListener();
            this.documentEscapeListener = null;
        }
    }

    unbindMaskClickListener() {
        if (this.maskClickListener) {
            this.maskClickListener();
            this.maskClickListener = null;
        }
    }

    unbindGlobalListeners() {
        this.unbindMaskClickListener();
        this.unbindDocumentEscapeListener();
    }

    unbindAnimationEndListener() {
        if (this.animationEndListener && this.mask) {
            this.animationEndListener();
            this.animationEndListener = null;
        }
    }
}

@NgModule({
    imports: [Drawer, SharedModule],
    exports: [Drawer, SharedModule]
})
export class DrawerModule {}
