import { CommonModule } from '@angular/common';
import { afterEveryRender, booleanAttribute, ChangeDetectionStrategy, Component, computed, forwardRef, inject, input, NgModule, signal, TemplateRef, ViewEncapsulation, contentChild, contentChildren, output } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { PrimeTemplate, SharedModule } from '@openng/optimus-ui/api';
import { AutoFocus } from '@openng/optimus-ui/autofocus';
import { BaseEditableHolder } from '@openng/optimus-ui/baseeditableholder';
import { PARENT_INSTANCE } from '@openng/optimus-ui/basecomponent';
import { Bind, BindModule } from '@openng/optimus-ui/bind';
import { InputText } from '@openng/optimus-ui/inputtext';
import { InputOtpChangeEvent, InputOtpInputTemplateContext, InputOtpPassThrough } from '@openng/optimus-ui/types/inputotp';
import { InputOtpStyle } from './style/inputotpstyle';

export const INPUT_OTP_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => InputOtp),
    multi: true
};

// Re-export interfaces from types for backwards compatibility
export { InputOtpChangeEvent, InputOtpInputTemplateContext, InputOtpTemplateEvents } from '@openng/optimus-ui/types/inputotp';

/**
 * Input Otp is used to enter one time passwords.
 * @group Components
 */
@Component({
    selector: 'p-inputOtp, p-inputotp, p-input-otp',
    standalone: true,
    imports: [CommonModule, InputText, AutoFocus, SharedModule, BindModule],
    template: `
        @for (i of range(); track i) {
            @if (!$inputTemplate()) {
                <input
                    type="text"
                    pInputText
                    [value]="getModelValue(i)"
                    [attr.maxlength]="i === 1 ? length() : 1"
                    [attr.type]="inputType()"
                    [class]="cn(cx('pcInputText'), styleClass())"
                    [pSize]="size()"
                    [variant]="$variant()"
                    [invalid]="invalid()"
                    [attr.inputmode]="inputMode()"
                    [attr.name]="name()"
                    [attr.tabindex]="tabindex()"
                    [attr.required]="required() ? '' : undefined"
                    [attr.readonly]="readonly() ? '' : undefined"
                    [attr.disabled]="$disabled() ? '' : undefined"
                    (input)="onInput($event, i - 1)"
                    (focus)="onInputFocus($event)"
                    (blur)="onInputBlur($event)"
                    (paste)="onPaste($event)"
                    (keydown)="onKeyDown($event)"
                    [pAutoFocus]="getAutofocus(i)"
                    [pt]="ptm('pcInputText')"
                    [unstyled]="unstyled()"
                />
            }
            @if ($inputTemplate()) {
                <ng-container *ngTemplateOutlet="$inputTemplate(); context: { $implicit: getToken(i - 1), events: getTemplateEvents(i - 1), index: i }"> </ng-container>
            }
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [INPUT_OTP_VALUE_ACCESSOR, InputOtpStyle, { provide: PARENT_INSTANCE, useExisting: InputOtp }],
    hostDirectives: [Bind],
    host: {
        '[class]': "cx('root')"
    }
})
export class InputOtp extends BaseEditableHolder<InputOtpPassThrough> {
    _componentStyle = inject(InputOtpStyle);

    bindDirectiveInstance = inject(Bind, { self: true });

    /**
     * When present, it specifies that an input field is read-only.
     * @group Props
     */
    readonly readonly = input<boolean, unknown>(undefined, { transform: booleanAttribute });

    /**
     * Index of the element in tabbing order.
     * @group Props
     */
    readonly tabindex = input<number | null>(null);

    /**
     * Number of characters to initiate.
     * @group Props
     */
    readonly length = input<number>(4);

    /**
     * Style class of the input element.
     * @group Props
     */
    readonly styleClass = input<string>();

    /**
     * Mask pattern.
     * @group Props
     */
    readonly mask = input<boolean>(false);

    /**
     * When present, it specifies that an input field is integer-only.
     * @group Props
     */
    readonly integerOnly = input<boolean>(false);

    /**
     * When present, it specifies that the component should automatically get focus on load.
     * @group Props
     */
    readonly autofocus = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    /**
     * Specifies the input variant of the component.
     * @defaultValue undefined
     * @group Props
     */
    variant = input<'filled' | 'outlined' | undefined>();

    /**
     * Specifies the size of the component.
     * @defaultValue undefined
     * @group Props
     */
    size = input<'large' | 'small' | undefined>();

    /**
     * Callback to invoke on value change.
     * @group Emits
     */
    readonly onChange = output<InputOtpChangeEvent>();

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
     * Custom input template.
     * @param {InputOtpInputTemplateContext} context - Context of the template
     * @see {@link InputOtpInputTemplateContext}
     * @group Templates
     */
    readonly inputTemplate = contentChild<TemplateRef<InputOtpInputTemplateContext>>('input', { descendants: false });

    readonly templates = contentChildren(PrimeTemplate);

    componentName = 'InputOtp';

    /**
     * Effective input template: the \`#input\` content child, or (legacy behavior) the last
     * projected \`pTemplate\` of any type.
     */
    readonly $inputTemplate = computed(() => this.inputTemplate() ?? (this.templates().at(-1)?.template as TemplateRef<InputOtpInputTemplateContext> | undefined));

    /** The entered characters, one entry per input. */
    readonly tokens = signal<any[]>([]);

    /** The current model value as written through the value accessor. */
    readonly value = signal<any>(undefined);

    $variant = computed(() => this.variant() || this.config.inputStyle() || this.config.inputVariant());

    /** Input mode of the fields: numeric while \`integerOnly\` is set. */
    readonly inputMode = computed<string>(() => (this.integerOnly() ? 'numeric' : 'text'));

    /** Rendered input type: password while \`mask\` is set. */
    readonly inputType = computed<string>(() => (this.mask() ? 'password' : 'text'));

    /** The 1-based indices of the inputs to render, derived from \`length\`. */
    readonly range = computed<number[]>(() => Array.from({ length: this.length() }, (_, index) => index + 1));

    constructor() {
        super();
        // Re-apply the host/root pass-through sections after each render (replaces the former
        // ngAfterViewChecked hook). Bind.setAttrs writes into a signal behind an equality check,
        // so unchanged PT resolutions are no-ops.
        afterEveryRender(() => {
            this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
        });
    }

    getToken(index) {
        return this.tokens()[index];
    }

    getTemplateEvents(index) {
        return {
            input: (event) => this.onInput(event, index),
            keydown: (event) => this.onKeyDown(event),
            focus: (event) => this.onFocus.emit(event),
            blur: (event) => this.onBlur.emit(event),
            paste: (event) => this.onPaste(event)
        };
    }

    onInput(event, index) {
        const value = event.target.value;
        if (index === 0 && value.length > 1) {
            this.handleOnPaste(value, event);
            event.stopPropagation();
            return;
        }
        this.tokens.update((tokens) => {
            const next = [...tokens];
            next[index] = value;
            return next;
        });
        this.updateModel(event);

        if (event.inputType === 'deleteContentBackward') {
            this.moveToPrev(event);
        } else if (event.inputType === 'insertText' || event.inputType === 'deleteContentForward') {
            this.moveToNext(event);
        }
    }

    updateModel(event: any) {
        const newValue = this.tokens().join('');
        this.writeModelValue(newValue);
        this.onModelChange(newValue);

        this.onChange.emit({
            originalEvent: event,
            value: newValue
        });
    }

    updateTokens() {
        const value = this.value();
        if (value !== null && value !== undefined) {
            if (Array.isArray(value)) {
                this.tokens.set([...value]);
            } else {
                this.tokens.set(value.toString().split(''));
            }
        } else {
            this.tokens.set([]);
        }
    }

    getModelValue(i: number) {
        return this.tokens()[i - 1] || '';
    }

    getAutofocus(i: number): boolean {
        if (i === 1) {
            return this.autofocus() || false;
        }
        return false;
    }

    moveToPrev(event) {
        let prevInput = this.findPrevInput(event.target);

        if (prevInput) {
            prevInput.focus();
            prevInput.select();
        }
    }

    moveToNext(event) {
        let nextInput = this.findNextInput(event.target);

        if (nextInput) {
            nextInput.focus();
            nextInput.select();
        }
    }

    findNextInput(element) {
        let nextElement = element.nextElementSibling;

        if (!nextElement) return;

        return nextElement.nodeName === 'INPUT' ? nextElement : this.findNextInput(nextElement);
    }

    findPrevInput(element) {
        let prevElement = element.previousElementSibling;

        if (!prevElement) return;

        return prevElement.nodeName === 'INPUT' ? prevElement : this.findPrevInput(prevElement);
    }

    onInputFocus(event) {
        event.target.select();
        this.onFocus.emit(event);
    }

    onInputBlur(event) {
        this.onBlur.emit(event);
    }

    onKeyDown(event) {
        if (event.altKey || event.ctrlKey || event.metaKey) {
            return;
        }

        switch (event.key) {
            case 'ArrowLeft':
                this.moveToPrev(event);
                event.preventDefault();

                break;

            case 'ArrowUp':
            case 'ArrowDown':
                event.preventDefault();

                break;

            case 'Backspace':
                if (event.target.value.length === 0) {
                    this.moveToPrev(event);
                    event.preventDefault();
                }

                break;

            case 'ArrowRight':
                this.moveToNext(event);
                event.preventDefault();

                break;

            default:
                const target = event.target;
                const hasSelection = target.selectionStart !== target.selectionEnd;
                const isAtMaxLength = this.tokens().join('').length >= this.length();
                const isValidKey = this.integerOnly() ? /^[0-9]$/.test(event.key) : true;

                if (!isValidKey || (isAtMaxLength && event.key !== 'Delete' && !hasSelection)) {
                    event.preventDefault();
                }

                break;
        }
    }

    onPaste(event) {
        if (!this.$disabled() && !this.readonly()) {
            let paste = event.clipboardData.getData('text');

            if (paste.length) {
                this.handleOnPaste(paste, event);
            }

            event.preventDefault();
        }
    }

    handleOnPaste(paste, event) {
        let pastedCode = paste.substring(0, this.length() + 1);

        if (!this.integerOnly() || !isNaN(pastedCode)) {
            this.tokens.set(pastedCode.split(''));
            this.updateModel(event);
        }
    }

    /**
     * @override
     *
     * @see {@link BaseEditableHolder.writeControlValue}
     * Writes the value to the control.
     */
    writeControlValue(value: any, setModelValue: (value: any) => void): void {
        if (value) {
            if (Array.isArray(value) && value.length > 0) {
                this.value.set(value.slice(0, this.length()));
            } else {
                this.value.set(value.toString().split('').slice(0, this.length()));
            }
        } else {
            this.value.set(value);
        }
        setModelValue(this.value());
        this.updateTokens();
        this.cd.markForCheck();
    }
}

@NgModule({
    imports: [InputOtp, SharedModule],
    exports: [InputOtp, SharedModule]
})
export class InputOtpModule {}
