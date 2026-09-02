import { CommonModule } from '@angular/common';
import {
    afterEveryRender,
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    ElementRef,
    inject,
    input,
    linkedSignal,
    NgModule,
    NgZone,
    numberAttribute,
    signal,
    TemplateRef,
    ViewEncapsulation,
    contentChild,
    contentChildren,
    output
} from '@angular/core';
import { findSingle, setAttribute, uuid } from '@openng/optimus-ui-utils';
import { Confirmation, ConfirmationService, ConfirmEventType, PrimeTemplate, SharedModule, TranslationKeys } from '@openng/optimus-ui/api';
import { BaseComponent, PARENT_INSTANCE } from '@openng/optimus-ui/basecomponent';
import { Bind } from '@openng/optimus-ui/bind';
import { Button } from '@openng/optimus-ui/button';
import { Dialog } from '@openng/optimus-ui/dialog';
import { Nullable } from '@openng/optimus-ui/ts-helpers';
import { ConfirmDialogHeadlessTemplateContext, ConfirmDialogMessageTemplateContext, ConfirmDialogPassThrough } from '@openng/optimus-ui/types/confirmdialog';
import { Subject, Subscription } from 'rxjs';
import { ConfirmDialogStyle } from './style/confirmdialogstyle';

/**
 * ConfirmDialog uses a Dialog UI that is integrated with the Confirmation API.
 * @group Components
 */
@Component({
    selector: 'p-confirmDialog, p-confirmdialog, p-confirm-dialog',
    standalone: true,
    imports: [CommonModule, Button, Dialog, SharedModule, Bind],
    template: `
        <p-dialog
            [pt]="pt()"
            #dialog
            [visible]="$visible()"
            (visibleChange)="onVisibleChange($event)"
            role="alertdialog"
            [closable]="option('closable')"
            [styleClass]="cn(cx('root'), styleClass())"
            [modal]="option('modal')"
            [header]="option('header')"
            [closeOnEscape]="option('closeOnEscape')"
            [blockScroll]="option('blockScroll')"
            [appendTo]="$appendTo()"
            [position]="option('position')"
            [style]="style()"
            [dismissableMask]="option('dismissableMask')"
            [draggable]="draggable()"
            [baseZIndex]="baseZIndex()"
            [autoZIndex]="autoZIndex()"
            [maskStyleClass]="cn(cx('mask'), maskStyleClass())"
            [unstyled]="unstyled()"
            (onHide)="onDialogHide()"
        >
            @if ($headlessTemplate()) {
                <ng-template #headless>
                    <ng-container
                        *ngTemplateOutlet="
                            $headlessTemplate();
                            context: {
                                $implicit: confirmation(),
                                onAccept: onAccept.bind(this),
                                onReject: onReject.bind(this)
                            }
                        "
                    ></ng-container>
                </ng-template>
            } @else {
                @if ($headerTemplate()) {
                    <ng-template #header>
                        <ng-container *ngTemplateOutlet="$headerTemplate()"></ng-container>
                    </ng-template>
                }

                <ng-template #content>
                    @if ($iconTemplate()) {
                        <ng-template *ngTemplateOutlet="$iconTemplate()"></ng-template>
                    } @else if (!$iconTemplate() && !$messageTemplate()) {
                        <i [ngClass]="cx('icon')" [class]="option('icon')" [pBind]="ptm('icon')" *ngIf="option('icon')"></i>
                    }
                    @if ($messageTemplate()) {
                        <ng-template *ngTemplateOutlet="$messageTemplate(); context: { $implicit: confirmation() }"></ng-template>
                    } @else {
                        <span [class]="cx('message')" [pBind]="ptm('message')" [innerHTML]="option('message')"> </span>
                    }
                </ng-template>
            }
            <ng-template #footer>
                @if ($footerTemplate()) {
                    <ng-content select="p-footer"></ng-content>
                    <ng-container *ngTemplateOutlet="$footerTemplate()"></ng-container>
                }
                @if (!$footerTemplate()) {
                    <p-button
                        [pt]="ptm('pcRejectButton')"
                        *ngIf="option('rejectVisible')"
                        [label]="rejectButtonLabel"
                        (onClick)="onReject()"
                        [styleClass]="getButtonStyleClass('pcRejectButton', 'rejectButtonStyleClass')"
                        [ariaLabel]="option('rejectButtonProps', 'ariaLabel')"
                        [buttonProps]="getRejectButtonProps()"
                        [unstyled]="unstyled()"
                    >
                        <ng-template #icon>
                            @if (option('rejectIcon') && !$rejectIconTemplate()) {
                                <i *ngIf="option('rejectIcon')" [class]="option('rejectIcon')" [pBind]="ptm('pcRejectButton')['icon']"></i>
                            }
                            <ng-template *ngTemplateOutlet="$rejectIconTemplate()"></ng-template>
                        </ng-template>
                    </p-button>
                    <p-button
                        [pt]="ptm('pcAcceptButton')"
                        [label]="acceptButtonLabel"
                        (onClick)="onAccept()"
                        [styleClass]="getButtonStyleClass('pcAcceptButton', 'acceptButtonStyleClass')"
                        *ngIf="option('acceptVisible')"
                        [ariaLabel]="option('acceptButtonProps', 'ariaLabel')"
                        [buttonProps]="getAcceptButtonProps()"
                        [unstyled]="unstyled()"
                    >
                        <ng-template #icon>
                            @if (option('acceptIcon') && !$acceptIconTemplate()) {
                                <i *ngIf="option('acceptIcon')" [class]="option('acceptIcon')" [pBind]="ptm('pcAcceptButton')['icon']"></i>
                            }
                            <ng-template *ngTemplateOutlet="$acceptIconTemplate()"></ng-template>
                        </ng-template>
                    </p-button>
                }
            </ng-template>
        </p-dialog>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [ConfirmDialogStyle, { provide: PARENT_INSTANCE, useExisting: ConfirmDialog }],
    hostDirectives: [Bind]
})
export class ConfirmDialog extends BaseComponent<ConfirmDialogPassThrough> {
    private confirmationService = inject(ConfirmationService);

    zone = inject(NgZone);

    bindDirectiveInstance = inject(Bind, { self: true });

    _componentStyle = inject(ConfirmDialogStyle);

    /**
     * Title text of the dialog.
     * @group Props
     */
    readonly header = input<string>();

    /**
     * Icon to display next to message.
     * @group Props
     */
    readonly icon = input<string>();

    /**
     * Message of the confirmation.
     * @group Props
     */
    readonly message = input<string>();

    /**
     * Inline style of the element.
     * @group Props
     */
    readonly style = input<{ [klass: string]: any } | null>();

    /**
     * Class of the element.
     * @group Props
     */
    readonly styleClass = input<string>();

    /**
     * Specify the CSS class(es) for styling the mask element
     * @group Props
     */
    readonly maskStyleClass = input<string>();

    /**
     * Icon of the accept button.
     * @group Props
     */
    readonly acceptIcon = input<string>();

    /**
     * Label of the accept button.
     * @group Props
     */
    readonly acceptLabel = input<string>();

    /**
     * Defines a string that labels the close button for accessibility.
     * @group Props
     */
    readonly closeAriaLabel = input<string>();

    /**
     * Defines a string that labels the accept button for accessibility.
     * @group Props
     */
    readonly acceptAriaLabel = input<string>();

    /**
     * Visibility of the accept button.
     * @group Props
     */
    readonly acceptVisible = input<boolean, unknown>(true, { transform: booleanAttribute });

    /**
     * Icon of the reject button.
     * @group Props
     */
    readonly rejectIcon = input<string>();

    /**
     * Label of the reject button.
     * @group Props
     */
    readonly rejectLabel = input<string>();

    /**
     * Defines a string that labels the reject button for accessibility.
     * @group Props
     */
    readonly rejectAriaLabel = input<string>();

    /**
     * Visibility of the reject button.
     * @group Props
     */
    readonly rejectVisible = input<boolean, unknown>(true, { transform: booleanAttribute });

    /**
     * Style class of the accept button.
     * @group Props
     */
    readonly acceptButtonStyleClass = input<string>();

    /**
     * Style class of the reject button.
     * @group Props
     */
    readonly rejectButtonStyleClass = input<string>();

    /**
     * Specifies if pressing escape key should hide the dialog.
     * @group Props
     */
    readonly closeOnEscape = input<boolean, unknown>(true, { transform: booleanAttribute });

    /**
     * Specifies if clicking the modal background should hide the dialog.
     * @group Props
     */
    readonly dismissableMask = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    /**
     * Determines whether scrolling behavior should be blocked within the component.
     * @group Props
     */
    readonly blockScroll = input<boolean, unknown>(true, { transform: booleanAttribute });

    /**
     * When enabled dialog is displayed in RTL direction.
     * @group Props
     */
    readonly rtl = input<boolean, unknown>(false, { transform: booleanAttribute });

    /**
     * Adds a close icon to the header to hide the dialog.
     * @group Props
     */
    readonly closable = input<boolean, unknown>(true, { transform: booleanAttribute });

    /**
     * Target element to attach the overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name).
     * @defaultValue 'body'
     * @group Props
     */
    appendTo = input<HTMLElement | ElementRef | TemplateRef<any> | 'self' | 'body' | null | undefined | any>('body');

    /**
     * Optional key to match the key of confirm object, necessary to use when component tree has multiple confirm dialogs.
     * @group Props
     */
    readonly key = input<string>();

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
     * Transition options of the animation.
     * @group Props
     */
    readonly transitionOptions = input<string>('150ms cubic-bezier(0, 0, 0.2, 1)');

    /**
     * When enabled, can only focus on elements inside the confirm dialog.
     * @group Props
     */
    readonly focusTrap = input<boolean, unknown>(true, { transform: booleanAttribute });

    /**
     * Element to receive the focus when the dialog gets visible.
     * @group Props
     */
    readonly defaultFocus = input<'accept' | 'reject' | 'close' | 'none'>('accept');

    /**
     * Object literal to define widths per screen size.
     * @group Props
     */
    readonly breakpoints = input<any>();

    /**
     * Defines if background should be blocked when dialog is displayed.
     * @group Props
     */
    readonly modal = input<boolean, unknown>(true, { transform: booleanAttribute });

    /**
     * Current visible state as a boolean.
     * @group Props
     */
    readonly visible = input<any>();

    /**
     *  Allows getting the position of the component.
     * @group Props
     */
    readonly position = input<'center' | 'top' | 'bottom' | 'left' | 'right' | 'topleft' | 'topright' | 'bottomleft' | 'bottomright'>('center');

    /**
     * Enables dragging to change the position using header.
     * @group Props
     */
    readonly draggable = input<boolean, unknown>(true, { transform: booleanAttribute });

    /**
     * Callback to invoke when dialog is hidden.
     * @param {ConfirmEventType} enum - Custom confirm event.
     * @group Emits
     */
    readonly onHide = output<ConfirmEventType | undefined>();

    /**
     * Custom header template.
     * @group Templates
     */
    readonly headerTemplate = contentChild<Nullable<TemplateRef<void>>>('header', { descendants: false });

    /**
     * Custom footer template.
     * @group Templates
     */
    readonly footerTemplate = contentChild<Nullable<TemplateRef<void>>>('footer', { descendants: false });

    /**
     * Custom reject icon template.
     * @group Templates
     */
    readonly rejectIconTemplate = contentChild<Nullable<TemplateRef<void>>>('rejecticon', { descendants: false });

    /**
     * Custom accept icon template.
     * @group Templates
     */
    readonly acceptIconTemplate = contentChild<Nullable<TemplateRef<void>>>('accepticon', { descendants: false });

    /**
     * Custom message template.
     * @group Templates
     */
    readonly messageTemplate = contentChild<Nullable<TemplateRef<ConfirmDialogMessageTemplateContext>>>('message', { descendants: false });

    /**
     * Custom icon template.
     * @group Templates
     */
    readonly iconTemplate = contentChild<Nullable<TemplateRef<void>>>('icon', { descendants: false });

    /**
     * Custom headless template.
     * @group Templates
     */
    readonly headlessTemplate = contentChild<Nullable<TemplateRef<ConfirmDialogHeadlessTemplateContext>>>('headless', { descendants: false });

    readonly templates = contentChildren(PrimeTemplate);

    componentName = 'ConfirmDialog';

    $appendTo = computed(() => this.appendTo() || this.config.overlayAppendTo());

    /** Effective header template: the `#header` content child, or the `pTemplate="header"`. */
    readonly $headerTemplate = computed(() => this.headerTemplate() ?? this.templates().find((t) => t.getType() === 'header')?.template);

    /** Effective footer template: the `#footer` content child, or the `pTemplate="footer"`. */
    readonly $footerTemplate = computed(() => this.footerTemplate() ?? this.templates().find((t) => t.getType() === 'footer')?.template);

    /** Effective reject icon template: the `#rejecticon` content child, or the `pTemplate="rejecticon"`. */
    readonly $rejectIconTemplate = computed(() => this.rejectIconTemplate() ?? this.templates().find((t) => t.getType() === 'rejecticon')?.template);

    /** Effective accept icon template: the `#accepticon` content child, or the `pTemplate="accepticon"`. */
    readonly $acceptIconTemplate = computed(() => this.acceptIconTemplate() ?? this.templates().find((t) => t.getType() === 'accepticon')?.template);

    /** Effective message template: the `#message` content child, or the `pTemplate="message"`. */
    readonly $messageTemplate = computed(() => (this.messageTemplate() ?? this.templates().find((t) => t.getType() === 'message')?.template) as TemplateRef<ConfirmDialogMessageTemplateContext> | undefined);

    /** Effective icon template: the `#icon` content child, or the `pTemplate="icon"`. */
    readonly $iconTemplate = computed(() => this.iconTemplate() ?? this.templates().find((t) => t.getType() === 'icon')?.template);

    /** Effective headless template: the `#headless` content child, or the `pTemplate="headless"`. */
    readonly $headlessTemplate = computed(() => (this.headlessTemplate() ?? this.templates().find((t) => t.getType() === 'headless')?.template) as TemplateRef<ConfirmDialogHeadlessTemplateContext> | undefined);

    /** The active confirmation, set while the dialog is requested through the ConfirmationService. */
    readonly confirmation = signal<Nullable<Confirmation>>(undefined);

    /**
     * Effective visibility: follows the `visible` input and is also written internally when a
     * confirmation is requested or the dialog is hidden (last write wins).
     */
    readonly $visible = linkedSignal<any>(() => this.visible());

    dialog: Nullable<Dialog>;

    subscription: Subscription;

    styleElement: any;

    id = uuid('pn_id_');

    translationSubscription: Subscription | undefined;

    get acceptButtonLabel(): string {
        return this.option('acceptLabel') || this.getAcceptButtonProps()?.label || this.config.getTranslation(TranslationKeys.ACCEPT);
    }

    get rejectButtonLabel(): string {
        return this.option('rejectLabel') || this.getRejectButtonProps()?.label || this.config.getTranslation(TranslationKeys.REJECT);
    }

    constructor() {
        super();
        // Re-apply the host pass-through section after each render (replaces the former
        // ngAfterViewChecked hook). Bind.setAttrs writes into a signal behind an equality check,
        // so unchanged PT resolutions are no-ops.
        afterEveryRender(() => {
            this.bindDirectiveInstance.setAttrs(this.ptm('host'));
        });
        this.subscription = this.confirmationService.requireConfirmation$.subscribe((confirmation) => {
            if (!confirmation) {
                this.hide();
                return;
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
                this.$visible.set(true);
            }
        });
    }

    onInit() {
        if (this.breakpoints()) {
            this.createStyle();
        }

        this.translationSubscription = this.config.translationObserver.subscribe(() => {
            if (this.$visible()) {
                this.cd.markForCheck();
            }
        });
    }

    onDestroy() {
        this.subscription.unsubscribe();
        // Unsubscribe from confirmation events if the dialogue is opened and this component is somehow destroyed.
        this.unsubscribeConfirmationEvents();

        if (this.translationSubscription) {
            this.translationSubscription.unsubscribe();
        }

        this.destroyStyle();
    }

    option(name: string, k?: string) {
        const confirmation: { [key: string]: any } = this.confirmation() ?? {};
        const source: { [key: string]: any } = Object.prototype.hasOwnProperty.call(confirmation, name) ? confirmation : this;

        if (Object.prototype.hasOwnProperty.call(source, name)) {
            const raw = source[name];
            // Inputs on the component are signals — unwrap them before drilling into `k`.
            const value = typeof raw === 'function' ? raw.call(this) : raw;
            return k ? value?.[k] : value;
        }

        return undefined;
    }

    getButtonStyleClass(cx: string, opt: string): string {
        const cxClass = this.cx(cx);
        const optionClass = this.option(opt);

        return [cxClass, optionClass].filter(Boolean).join(' ');
    }

    getElementToFocus() {
        if (!this.dialog?.el?.nativeElement) return;

        switch (this.option('defaultFocus')) {
            case 'accept':
                return findSingle(this.dialog.el.nativeElement, '.p-confirm-dialog-accept');

            case 'reject':
                return findSingle(this.dialog.el.nativeElement, '.p-confirm-dialog-reject');

            case 'close':
                return findSingle(this.dialog.el.nativeElement, '.p-dialog-header-close');

            case 'none':
                return null;

            //backward compatibility
            default:
                return findSingle(this.dialog.el.nativeElement, '.p-confirm-dialog-accept');
        }
    }

    createStyle() {
        if (!this.styleElement) {
            this.styleElement = this.document.createElement('style');
            this.styleElement.type = 'text/css';
            setAttribute(this.styleElement, 'nonce', this.config?.csp()?.nonce);
            this.document.head.appendChild(this.styleElement);
            let innerHTML = '';
            const breakpoints = this.breakpoints();
            for (let breakpoint in breakpoints) {
                innerHTML += `
                    @media screen and (max-width: ${breakpoint}) {
                        .p-dialog[${this.id}] {
                            width: ${breakpoints[breakpoint]} !important;
                        }
                    }
                `;
            }

            this.styleElement.innerHTML = innerHTML;
            setAttribute(this.styleElement, 'nonce', this.config?.csp()?.nonce);
        }
    }

    close() {
        if (this.confirmation()?.rejectEvent) {
            this.confirmation()!.rejectEvent!.next(ConfirmEventType.CANCEL);
        }

        this.hide(ConfirmEventType.CANCEL);
    }

    hide(type?: ConfirmEventType) {
        this.onHide.emit(type);
        this.$visible.set(false);
        // Unsubscribe from confirmation events when the dialogue is closed, because events are created when the dialogue is opened.
        this.unsubscribeConfirmationEvents();
    }

    onDialogHide() {
        this.confirmation.set(null);
    }

    destroyStyle() {
        if (this.styleElement) {
            this.document.head.removeChild(this.styleElement);
            this.styleElement = null;
        }
    }

    onVisibleChange(value: boolean) {
        if (!value) {
            this.close();
        } else {
            this.$visible.set(value);
        }
    }

    onAccept() {
        const confirmation = this.confirmation();
        if (confirmation && confirmation.acceptEvent) {
            confirmation.acceptEvent.next(undefined);
        }
        this.hide(ConfirmEventType.ACCEPT);
    }

    onReject() {
        const confirmation = this.confirmation();
        if (confirmation && confirmation.rejectEvent) {
            confirmation.rejectEvent.next(ConfirmEventType.REJECT);
        }

        this.hide(ConfirmEventType.REJECT);
    }

    unsubscribeConfirmationEvents() {
        const confirmation = this.confirmation();
        if (confirmation) {
            confirmation.acceptEvent?.unsubscribe();
            confirmation.rejectEvent?.unsubscribe();
        }
    }

    getAcceptButtonProps() {
        return this.option('acceptButtonProps');
    }

    getRejectButtonProps() {
        return this.option('rejectButtonProps');
    }
}

@NgModule({
    imports: [ConfirmDialog, SharedModule],
    exports: [ConfirmDialog, SharedModule]
})
export class ConfirmDialogModule {}
