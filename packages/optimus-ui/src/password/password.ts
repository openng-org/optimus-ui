import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
    afterEveryRender,
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    Directive,
    effect,
    ElementRef,
    forwardRef,
    HostListener,
    inject,
    input,
    NgModule,
    NgZone,
    numberAttribute,
    Pipe,
    PipeTransform,
    signal,
    TemplateRef,
    untracked,
    ViewEncapsulation,
    viewChild,
    contentChild,
    contentChildren,
    output
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { MotionOptions } from '@openng/optimus-ui-motion';
import { absolutePosition, addClass, hasClass, isTouchDevice, removeClass } from '@openng/optimus-ui-utils';
import { OverlayOptions, OverlayService, PrimeTemplate, SharedModule, TranslationKeys } from '@openng/optimus-ui/api';
import { AutoFocus } from '@openng/optimus-ui/autofocus';
import { PARENT_INSTANCE } from '@openng/optimus-ui/basecomponent';
import { BaseEditableHolder } from '@openng/optimus-ui/baseeditableholder';
import { BaseInput } from '@openng/optimus-ui/baseinput';
import { Bind, BindModule } from '@openng/optimus-ui/bind';
import { ConnectedOverlayScrollHandler, DomHandler } from '@openng/optimus-ui/dom';
import { Fluid } from '@openng/optimus-ui/fluid';
import { EyeIcon, EyeSlashIcon, TimesIcon } from '@openng/optimus-ui/icons';
import { InputText } from '@openng/optimus-ui/inputtext';
import { Overlay } from '@openng/optimus-ui/overlay';
import { Nullable, VoidListener } from '@openng/optimus-ui/ts-helpers';
import type { PasswordIconTemplateContext, PasswordPassThrough } from '@openng/optimus-ui/types/password';
import { Subscription } from 'rxjs';
import { PasswordStyle } from './style/passwordstyle';

type Meter = {
    strength: string;
    width: string;
};
/**
 * Password directive.
 * @group Components
 */
@Directive({
    selector: '[pPassword]',
    standalone: true,
    host: {
        '[class]': "cx('rootDirective')"
    },
    providers: [PasswordStyle, { provide: PARENT_INSTANCE, useExisting: PasswordDirective }],
    hostDirectives: [Bind]
})
export class PasswordDirective extends BaseEditableHolder {
    zone = inject(NgZone);

    bindDirectiveInstance = inject(Bind, { self: true });

    pcFluid: Fluid | null = inject(Fluid, { optional: true, host: true, skipSelf: true });

    _componentStyle = inject(PasswordStyle);

    /**
     * Used to pass attributes to DOM elements inside the Password component.
     * @defaultValue undefined
     * @group Props
     */
    pPasswordPT = input<PasswordPassThrough | undefined>();

    /**
     * Indicates whether the component should be rendered without styles.
     * @defaultValue undefined
     * @group Props
     */
    pPasswordUnstyled = input<boolean | undefined>();

    /**
     * Text to prompt password entry. Defaults to Optimus I18N API configuration.
     * @group Props
     */
    readonly promptLabel = input<string>('Enter a password');

    /**
     * Text for a weak password. Defaults to PrOptimusimeNG I18N API configuration.
     * @group Props
     */
    readonly weakLabel = input<string>('Weak');

    /**
     * Text for a medium password. Defaults to Optimus I18N API configuration.
     * @group Props
     */
    readonly mediumLabel = input<string>('Medium');

    /**
     * Text for a strong password. Defaults to Optimus I18N API configuration.
     * @group Props
     */
    readonly strongLabel = input<string>('Strong');

    /**
     * Whether to show the strength indicator or not.
     * @group Props
     */
    readonly feedback = input<boolean, unknown>(true, { transform: booleanAttribute });

    /**
     * Sets the visibility of the password field.
     * @defaultValue false
     * @type boolean
     * @group Props
     */
    readonly showPassword = input<boolean | undefined>();

    /**
     * Specifies the input variant of the component.
     * @defaultValue 'outlined'
     * @group Props
     */
    variant = input<'filled' | 'outlined' | undefined>();

    /**
     * Spans 100% width of the container when enabled.
     * @defaultValue false
     * @group Props
     */
    fluid = input(undefined, { transform: booleanAttribute });

    /**
     * Specifies the size of the component.
     * @defaultValue undefined
     * @group Props
     */
    size = input<'large' | 'small' | undefined>(undefined, { alias: 'pSize' });

    /** Mirrors the legacy `showPassword` setter: toggles the native input type when the input is bound. */
    private readonly showPasswordEffect = effect(() => {
        const show = this.showPassword();
        if (show === undefined) {
            return;
        }
        untracked(() => {
            this.el.nativeElement.type = show ? 'text' : 'password';
        });
    });

    $variant = computed(() => this.variant() || this.config.inputStyle() || this.config.inputVariant());

    get hasFluid() {
        return this.fluid() ?? !!this.pcFluid;
    }

    panel: Nullable<HTMLDivElement>;

    meter: Nullable<HTMLDivElement>;

    info: Nullable<HTMLDivElement>;

    content: Nullable<HTMLDivElement>;

    label: Nullable<HTMLLabelElement>;

    scrollHandler: Nullable<ConnectedOverlayScrollHandler>;

    documentResizeListener: VoidListener;

    labelSignal = signal('');

    constructor() {
        super();

        effect(() => {
            const pt = this.pPasswordPT();
            pt && this.directivePT.set(pt);
        });

        effect(() => {
            this.pPasswordUnstyled() && this.directiveUnstyled.set(this.pPasswordUnstyled());
        });

        // Re-apply the host/root pass-through sections after each render (replaces the former
        // ngAfterViewChecked hook).
        afterEveryRender(() => {
            this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
        });
    }

    onDestroy() {
        if (this.panel) {
            if (this.scrollHandler) {
                this.scrollHandler.destroy();
                this.scrollHandler = null;
            }

            this.unbindDocumentResizeListener();

            this.renderer.removeChild(this.document.body, this.panel);
            this.panel = null;
            this.meter = null;
            this.info = null;
        }
    }

    @HostListener('input', ['$event'])
    onInput(e: Event) {
        this.writeModelValue(this.el.nativeElement.value);
    }

    createPanel() {
        if (isPlatformBrowser(this.platformId)) {
            this.panel = this.renderer.createElement('div');
            this.renderer.addClass(this.panel, 'p-password-overlay');
            this.renderer.addClass(this.panel, 'p-component');

            this.content = this.renderer.createElement('div');
            this.renderer.addClass(this.content, 'p-password-content');
            this.renderer.appendChild(this.panel, this.content);

            this.meter = this.renderer.createElement('div');
            this.renderer.addClass(this.meter, 'p-password-meter');
            this.renderer.appendChild(this.content, this.meter);

            this.label = this.renderer.createElement('div');
            this.renderer.addClass(this.label, 'p-password-meter-label');
            this.renderer.appendChild(this.meter, this.label);

            this.info = this.renderer.createElement('div');
            this.renderer.addClass(this.info, 'p-password-meter-text');
            this.renderer.setProperty(this.info, 'textContent', this.promptLabel());
            this.renderer.appendChild(this.content, this.info);

            this.renderer.setStyle(this.panel, 'minWidth', `${this.el.nativeElement.offsetWidth}px`);
            this.renderer.appendChild(document.body, this.panel);
            this.updateMeter();
        }
    }

    showOverlay() {
        if (this.feedback()) {
            if (!this.panel) {
                this.createPanel();
            }

            this.renderer.setStyle(this.panel, 'zIndex', String(++DomHandler.zindex));
            this.renderer.setStyle(this.panel, 'display', 'block');
            this.zone.runOutsideAngular(() => {
                setTimeout(() => {
                    addClass(this.panel!, 'p-connected-overlay-visible');
                    this.bindScrollListener();
                    this.bindDocumentResizeListener();
                }, 1);
            });
            absolutePosition(this.panel!, this.el.nativeElement);
        }
    }

    hideOverlay() {
        if (this.feedback() && this.panel) {
            addClass(this.panel, 'p-connected-overlay-hidden');
            removeClass(this.panel, 'p-connected-overlay-visible');
            this.unbindScrollListener();
            this.unbindDocumentResizeListener();

            this.zone.runOutsideAngular(() => {
                setTimeout(() => {
                    this.onDestroy();
                }, 150);
            });
        }
    }

    @HostListener('focus')
    onFocus() {
        this.showOverlay();
    }

    @HostListener('blur')
    onBlur() {
        this.hideOverlay();
    }

    @HostListener('keyup', ['$event'])
    onKeyup(e: Event) {
        if (this.feedback()) {
            let value = (e.target as HTMLInputElement).value,
                label: string | null = null,
                meterPos: string | null = null;

            if (value.length === 0) {
                label = this.promptLabel();
                meterPos = '0px 0px';
            } else {
                var score = this.testStrength(value);

                if (score < 30) {
                    label = this.weakLabel();
                    meterPos = '0px -10px';
                } else if (score >= 30 && score < 80) {
                    label = this.mediumLabel();
                    meterPos = '0px -20px';
                } else if (score >= 80) {
                    label = this.strongLabel();
                    meterPos = '0px -30px';
                }

                this.labelSignal.set(label!);
                this.updateMeter();
            }

            if (!this.panel || !hasClass(this.panel, 'p-connected-overlay-visible')) {
                this.showOverlay();
            }

            if (this.meter) {
                this.renderer.setStyle(this.meter, 'backgroundPosition', meterPos);
            }

            if (this.info) {
                (this.info as HTMLDivElement).textContent = label;
            }
        }
    }

    updateMeter() {
        if (this.labelSignal() && this.meter && this.info) {
            const label = this.labelSignal();
            const strengthClass = this.strengthClass(label.toLowerCase());
            const width = this.getWidth(label.toLowerCase());

            this.renderer.addClass(this.meter, strengthClass);
            this.renderer.setStyle(this.meter, 'width', width);
            (this.info as HTMLDivElement).textContent = label;
        }
    }

    getWidth(label: string) {
        return label === 'weak' ? '33.33%' : label === 'medium' ? '66.66%' : label === 'strong' ? '100%' : '';
    }

    strengthClass(label) {
        return `p-password-meter${label ? `-${label}` : ''}`;
    }

    testStrength(str: string) {
        let grade: number = 0;
        let val: Nullable<RegExpMatchArray>;

        val = str.match('[0-9]');
        grade += this.normalize(val ? val.length : 1 / 4, 1) * 25;

        val = str.match('[a-zA-Z]');
        grade += this.normalize(val ? val.length : 1 / 2, 3) * 10;

        val = str.match('[!@#$%^&*?_~.,;=]');
        grade += this.normalize(val ? val.length : 1 / 6, 1) * 35;

        val = str.match('[A-Z]');
        grade += this.normalize(val ? val.length : 1 / 6, 1) * 30;

        grade *= str.length / 8;

        return grade > 100 ? 100 : grade;
    }

    normalize(x: number, y: number) {
        let diff = x - y;

        if (diff <= 0) return x / y;
        else return 1 + 0.5 * (x / (x + y / 4));
    }

    bindScrollListener() {
        if (!this.scrollHandler) {
            this.scrollHandler = new ConnectedOverlayScrollHandler(this.el.nativeElement, () => {
                if (hasClass(this.panel!, 'p-connected-overlay-visible')) {
                    this.hideOverlay();
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

    onWindowResize() {
        if (!isTouchDevice()) {
            this.hideOverlay();
        }
    }
}

type Mapper<T, G> = (item: T, ...args: any[]) => G;

@Pipe({
    name: 'mapper',
    pure: true,
    standalone: true
})
export class MapperPipe implements PipeTransform {
    public transform<T, G>(value: T, mapper: Mapper<T, G>, ...args: unknown[]): G {
        return mapper(value, ...args);
    }
}

export const Password_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => Password),
    multi: true
};
/**
 * Password displays strength indicator for password fields.
 * @group Components
 */
@Component({
    selector: 'p-password',
    standalone: true,
    imports: [CommonModule, InputText, AutoFocus, TimesIcon, EyeSlashIcon, EyeIcon, Overlay, SharedModule, BindModule],
    template: `
        <input
            #input
            [attr.label]="label()"
            [attr.aria-label]="ariaLabel()"
            [attr.aria-labelledBy]="ariaLabelledBy()"
            [attr.id]="inputId()"
            [attr.tabindex]="tabindex()"
            pInputText
            [pSize]="size()"
            [ngStyle]="inputStyle()"
            [class]="cn(cx('pcInputText'), inputStyleClass())"
            [attr.type]="unmasked() ? 'text' : 'password'"
            [attr.placeholder]="placeholder()"
            [attr.autocomplete]="autocomplete()"
            [value]="value()"
            [variant]="$variant()"
            [attr.name]="name()"
            [attr.maxlength]="maxlength() || maxLength()"
            [attr.minlength]="minlength()"
            [attr.required]="required() ? '' : undefined"
            [attr.disabled]="$disabled() ? '' : undefined"
            [invalid]="invalid()"
            (input)="onInput($event)"
            (focus)="onInputFocus($event)"
            (blur)="onInputBlur($event)"
            (keyup)="onKeyUp($event)"
            [pAutoFocus]="autofocus()"
            [pt]="ptm('pcInputText')"
            [unstyled]="unstyled()"
        />
        @if (showClear() && value() != null) {
            @if (!$clearIconTemplate()) {
                <svg data-p-icon="times" [class]="cx('clearIcon')" (click)="clear()" [pBind]="ptm('clearIcon')" />
            }
            <span (click)="clear()" [class]="cx('clearIcon')" [pBind]="ptm('clearIcon')">
                <ng-template *ngTemplateOutlet="$clearIconTemplate()"></ng-template>
            </span>
        }

        @if (toggleMask()) {
            @if (unmasked()) {
                @if (!$hideIconTemplate()) {
                    <svg data-p-icon="eyeslash" [class]="cx('maskIcon')" [pBind]="ptm('maskIcon')" (click)="onMaskToggle()" />
                }
                @if ($hideIconTemplate()) {
                    <span (click)="onMaskToggle()" [pBind]="ptm('maskIcon')">
                        <ng-template *ngTemplateOutlet="$hideIconTemplate(); context: { class: cx('maskIcon') }"></ng-template>
                    </span>
                }
            }
            @if (!unmasked()) {
                @if (!$showIconTemplate()) {
                    <svg data-p-icon="eye" [class]="cx('unmaskIcon')" [pBind]="ptm('unmaskIcon')" (click)="onMaskToggle()" />
                }
                @if ($showIconTemplate()) {
                    <span (click)="onMaskToggle()" [pBind]="ptm('unmaskIcon')">
                        <ng-template *ngTemplateOutlet="$showIconTemplate(); context: { class: cx('unmaskIcon') }"></ng-template>
                    </span>
                }
            }
        }

        <p-overlay #overlay [hostAttrSelector]="$attrSelector" [(visible)]="overlayVisible" [options]="overlayOptions()" [target]="'@parent'" [appendTo]="$appendTo()" [unstyled]="unstyled()" [pt]="ptm('pcOverlay')" [motionOptions]="motionOptions()">
            <ng-template #content>
                <div [class]="cx('overlay')" [style]="sx('overlay')" (click)="onOverlayClick($event)" [pBind]="ptm('overlay')" [attr.data-p]="overlayDataP">
                    <ng-container *ngTemplateOutlet="$headerTemplate()"></ng-container>
                    @if ($contentTemplate()) {
                        <ng-container *ngTemplateOutlet="$contentTemplate()"></ng-container>
                    } @else {
                        <div [class]="cx('content')" [pBind]="ptm('content')">
                            <div [class]="cx('meter')" [pBind]="ptm('meter')">
                                <div [class]="cx('meterLabel')" [ngStyle]="{ width: meter() ? meter()!.width : '' }" [pBind]="ptm('meterLabel')" [attr.data-p]="meterDataP"></div>
                            </div>
                            <div [class]="cx('meterText')" [pBind]="ptm('meterText')">{{ infoText() }}</div>
                        </div>
                    }
                    <ng-container *ngTemplateOutlet="$footerTemplate()"></ng-container>
                </div>
            </ng-template>
        </p-overlay>
    `,
    providers: [Password_VALUE_ACCESSOR, PasswordStyle, { provide: PARENT_INSTANCE, useExisting: Password }],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        '[class]': "cx('root')",
        '[style]': "sx('root')",
        '[attr.data-p]': 'containerDataP'
    },
    hostDirectives: [Bind]
})
export class Password extends BaseInput<PasswordPassThrough> {
    bindDirectiveInstance = inject(Bind, { self: true });

    _componentStyle = inject(PasswordStyle);

    overlayService = inject(OverlayService);

    /**
     * Defines a string that labels the input for accessibility.
     * @group Props
     */
    readonly ariaLabel = input<string>();

    /**
     * Specifies one or more IDs in the DOM that labels the input field.
     * @group Props
     */
    readonly ariaLabelledBy = input<string>();

    /**
     * Label of the input for accessibility.
     * @group Props
     */
    readonly label = input<string>();

    /**
     * Text to prompt password entry. Defaults to Optimus I18N API configuration.
     * @group Props
     */
    readonly promptLabel = input<string>();

    /**
     * Regex value for medium regex.
     * @group Props
     */
    readonly mediumRegex = input<string>('^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})');

    /**
     * Regex value for strong regex.
     * @group Props
     */
    readonly strongRegex = input<string>('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})');

    /**
     * Text for a weak password. Defaults to Optimus I18N API configuration.
     * @group Props
     */
    readonly weakLabel = input<string>();

    /**
     * Text for a medium password. Defaults to Optimus I18N API configuration.
     * @group Props
     */
    readonly mediumLabel = input<string>();

    /**
     * specifies the maximum number of characters allowed in the input element.
     * @deprecated since v20.0.0, use maxlength instead.
     * @group Props
     */
    readonly maxLength = input<number, unknown>(undefined, { transform: numberAttribute });

    /**
     * Text for a strong password. Defaults to Optimus I18N API configuration.
     * @group Props
     */
    readonly strongLabel = input<string>();

    /**
     * Identifier of the accessible input element.
     * @group Props
     */
    readonly inputId = input<string>();

    /**
     * Whether to show the strength indicator or not.
     * @group Props
     */
    readonly feedback = input<boolean, unknown>(true, { transform: booleanAttribute });

    /**
     * Whether to show an icon to display the password as plain text.
     * @group Props
     */
    readonly toggleMask = input<boolean, unknown>(undefined, { transform: booleanAttribute });

    /**
     * Style class of the input field.
     * @group Props
     */
    readonly inputStyleClass = input<string>();

    /**
     * Inline style of the input field.
     * @group Props
     */
    readonly inputStyle = input<{ [klass: string]: any } | null | undefined>();

    /**
     * Transition options of the show animation.
     * @group Props
     * @deprecated since v21.0.0, use `motionOptions` instead.
     */
    readonly showTransitionOptions = input<string>('.12s cubic-bezier(0, 0, 0.2, 1)');

    /**
     * Transition options of the hide animation.
     * @group Props
     * @deprecated since v21.0.0, use `motionOptions` instead.
     */
    readonly hideTransitionOptions = input<string>('.1s linear');

    /**
     * Specify automated assistance in filling out password by browser.
     * @group Props
     */
    readonly autocomplete = input<string>();

    /**
     * Advisory information to display on input.
     * @group Props
     */
    readonly placeholder = input<string>();

    /**
     * When enabled, a clear icon is displayed to clear the value.
     * @group Props
     */
    readonly showClear = input<boolean, unknown>(false, { transform: booleanAttribute });

    /**
     * When present, it specifies that the component should automatically get focus on load.
     * @group Props
     */
    readonly autofocus = input<boolean, unknown>(undefined, { transform: booleanAttribute });

    /**
     * Index of the element in tabbing order.
     * @group Props
     */
    readonly tabindex = input<number, unknown>(undefined, { transform: numberAttribute });

    /**
     * Target element to attach the overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name).
     * @defaultValue 'self'
     * @group Props
     */
    appendTo = input<HTMLElement | ElementRef | TemplateRef<any> | 'self' | 'body' | null | undefined | any>('self');

    /**
     * The motion options.
     * @group Props
     */
    motionOptions = input<MotionOptions | undefined>(undefined);

    /**
     * Whether to use overlay API feature. The properties of overlay API can be used like an object in it.
     * @group Props
     */
    readonly overlayOptions = input<OverlayOptions>();

    /**
     * Callback to invoke when the component receives focus.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    readonly onFocus = output<Event>();

    /**
     * Callback to invoke when the component loses focus.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    readonly onBlur = output<Event>();

    /**
     * Callback to invoke when clear button is clicked.
     * @group Emits
     */
    readonly onClear = output<any>();

    readonly input = viewChild.required<ElementRef>('input');

    /**
     * Custom template of content.
     * @group Templates
     */
    readonly contentTemplate = contentChild<Nullable<TemplateRef<void>>>('content', { descendants: false });

    /**
     * Custom template of footer.
     * @group Templates
     */
    readonly footerTemplate = contentChild<Nullable<TemplateRef<void>>>('footer', { descendants: false });

    /**
     * Custom template of header.
     * @group Templates
     */
    readonly headerTemplate = contentChild<Nullable<TemplateRef<void>>>('header', { descendants: false });

    /**
     * Custom template of clear icon.
     * @group Templates
     */
    readonly clearIconTemplate = contentChild<Nullable<TemplateRef<void>>>('clearicon', { descendants: false });

    /**
     * Custom template of hide icon.
     * @param {PasswordIconTemplateContext} context - icon context.
     * @see {@link PasswordIconTemplateContext}
     * @group Templates
     */
    readonly hideIconTemplate = contentChild<Nullable<TemplateRef<PasswordIconTemplateContext>>>('hideicon', { descendants: false });

    /**
     * Custom template of show icon.
     * @param {PasswordIconTemplateContext} context - icon context.
     * @see {@link PasswordIconTemplateContext}
     * @group Templates
     */
    readonly showIconTemplate = contentChild<Nullable<TemplateRef<PasswordIconTemplateContext>>>('showicon', { descendants: false });

    readonly templates = contentChildren(PrimeTemplate);

    componentName = 'Password';

    $appendTo = computed(() => this.appendTo() || this.config.overlayAppendTo());

    /**
     * Effective content template: the `#content` content child or (legacy behavior) the last
     * projected pTemplate of type `content` or of an unknown type.
     */
    readonly $contentTemplate = computed(
        () =>
            this.contentTemplate() ??
            this.templates()
                .filter((item) => !['header', 'footer', 'clearicon', 'hideicon', 'showicon'].includes(item.getType()))
                .at(-1)?.template
    );

    /** Effective header template: the `#header` content child or the `pTemplate="header"`. */
    readonly $headerTemplate = computed(
        () =>
            this.headerTemplate() ??
            this.templates()
                .filter((item) => item.getType() === 'header')
                .at(-1)?.template
    );

    /** Effective footer template: the `#footer` content child or the `pTemplate="footer"`. */
    readonly $footerTemplate = computed(
        () =>
            this.footerTemplate() ??
            this.templates()
                .filter((item) => item.getType() === 'footer')
                .at(-1)?.template
    );

    /** Effective clear icon template: the `#clearicon` content child or the `pTemplate="clearicon"`. */
    readonly $clearIconTemplate = computed(
        () =>
            this.clearIconTemplate() ??
            this.templates()
                .filter((item) => item.getType() === 'clearicon')
                .at(-1)?.template
    );

    /** Effective hide icon template: the `#hideicon` content child or the `pTemplate="hideicon"`. */
    readonly $hideIconTemplate = computed(
        () =>
            (this.hideIconTemplate() ??
                this.templates()
                    .filter((item) => item.getType() === 'hideicon')
                    .at(-1)?.template) as TemplateRef<PasswordIconTemplateContext> | undefined
    );

    /** Effective show icon template: the `#showicon` content child or the `pTemplate="showicon"`. */
    readonly $showIconTemplate = computed(
        () =>
            (this.showIconTemplate() ??
                this.templates()
                    .filter((item) => item.getType() === 'showicon')
                    .at(-1)?.template) as TemplateRef<PasswordIconTemplateContext> | undefined
    );

    readonly overlayVisible = signal<boolean>(false);

    readonly meter = signal<Nullable<Meter>>(null);

    readonly infoText = signal<Nullable<string>>(null);

    readonly focused = signal<boolean>(false);

    readonly unmasked = signal<boolean>(false);

    readonly mediumCheckRegExp = computed(() => new RegExp(this.mediumRegex()));

    readonly strongCheckRegExp = computed(() => new RegExp(this.strongRegex()));

    readonly value = signal<Nullable<string>>(null);

    translationSubscription: Nullable<Subscription>;

    get containerDataP() {
        return this.cn({
            fluid: this.hasFluid
        });
    }

    get meterDataP() {
        return this.cn({
            [this.meter()?.strength as string]: this.meter()?.strength
        });
    }

    get overlayDataP() {
        return this.cn({
            ['overlay-' + this.$appendTo()]: 'overlay-' + this.$appendTo()
        });
    }

    constructor() {
        super();
        // Re-apply the host/root pass-through sections after each render (replaces the former
        // ngAfterViewChecked hook).
        afterEveryRender(() => {
            this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
        });
    }

    onInit() {
        this.infoText.set(this.promptText());
        this.translationSubscription = this.config.translationObserver.subscribe(() => {
            this.updateUI(this.value() || '');
        });
    }

    onDestroy() {
        if (this.translationSubscription) {
            this.translationSubscription.unsubscribe();
        }
    }

    onInput(event: Event) {
        this.value.set((event.target as HTMLInputElement).value);
        this.onModelChange(this.value());
    }

    onInputFocus(event: Event) {
        this.focused.set(true);
        if (this.feedback()) {
            this.overlayVisible.set(true);
        }

        this.onFocus.emit(event);
    }

    onInputBlur(event: Event) {
        this.focused.set(false);
        if (this.feedback()) {
            this.overlayVisible.set(false);
        }

        this.onModelTouched();
        this.onBlur.emit(event);
    }

    onKeyUp(event: KeyboardEvent) {
        if (this.feedback()) {
            let value = (event.target as HTMLInputElement).value;
            this.updateUI(value);

            if (event.code === 'Escape') {
                this.overlayVisible() && this.overlayVisible.set(false);

                return;
            }

            if (!this.overlayVisible()) {
                this.overlayVisible.set(true);
            }
        }
    }

    updateUI(value: string) {
        let label = null;
        let meter: { strength: string; width: string } | null = null;

        switch (this.testStrength(value)) {
            case 1:
                label = this.weakText();
                meter = {
                    strength: 'weak',
                    width: '33.33%'
                };
                break;

            case 2:
                label = this.mediumText();
                meter = {
                    strength: 'medium',
                    width: '66.66%'
                };
                break;

            case 3:
                label = this.strongText();
                meter = {
                    strength: 'strong',
                    width: '100%'
                };
                break;

            default:
                label = this.promptText();
                meter = null;
                break;
        }

        this.meter.set(meter);
        this.infoText.set(label);
    }

    onMaskToggle() {
        this.unmasked.set(!this.unmasked());
    }

    onOverlayClick(event: Event) {
        this.overlayService.add({
            originalEvent: event,
            target: this.el.nativeElement
        });
    }

    testStrength(str: string) {
        let level = 0;

        if (this.strongCheckRegExp().test(str)) level = 3;
        else if (this.mediumCheckRegExp().test(str)) level = 2;
        else if (str.length) level = 1;

        return level;
    }

    promptText() {
        return this.promptLabel() || this.getTranslation(TranslationKeys.PASSWORD_PROMPT);
    }

    weakText() {
        return this.weakLabel() || this.getTranslation(TranslationKeys.WEAK);
    }

    mediumText() {
        return this.mediumLabel() || this.getTranslation(TranslationKeys.MEDIUM);
    }

    strongText() {
        return this.strongLabel() || this.getTranslation(TranslationKeys.STRONG);
    }

    getTranslation(option: string) {
        return this.config.getTranslation(option);
    }

    clear() {
        this.value.set(null);
        this.onModelChange(this.value());
        this.writeValue(this.value());
        this.onClear.emit(undefined);
    }

    /**
     * @override
     *
     * @see {@link BaseEditableHolder.writeControlValue}
     * Writes the value to the control.
     */
    writeControlValue(value: any, setModelValue: (value: any) => void): void {
        this.value.set(value === undefined ? null : value);

        if (this.feedback()) this.updateUI(this.value() || '');
        setModelValue(this.value());
        this.cd.markForCheck();
    }
}

@NgModule({
    imports: [Password, PasswordDirective, SharedModule, BindModule],
    exports: [PasswordDirective, Password, SharedModule, BindModule]
})
export class PasswordModule {}
