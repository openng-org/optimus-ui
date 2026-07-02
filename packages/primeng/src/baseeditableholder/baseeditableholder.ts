import { booleanAttribute, computed, Directive, input, signal } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import type { ValidationError } from '@angular/forms/signals';
import { BaseModelHolder } from 'primeng/basemodelholder';

@Directive({ standalone: true })
export class BaseEditableHolder<PT = any> extends BaseModelHolder<PT> implements ControlValueAccessor {
    /**
     * There must be a value (if set).
     * @defaultValue false
     * @group Props
     */
    required = input(undefined, { transform: booleanAttribute });
    /**
     * When present, it specifies that the component should have invalid state style.
     * @defaultValue false
     * @group Props
     */
    invalid = input(undefined, { transform: booleanAttribute });
    /**
     * When present, it specifies that the component should have disabled state style.
     * @defaultValue false
     * @group Props
     */
    disabled = input(undefined, { transform: booleanAttribute });
    /**
     * When present, it specifies that the name of the input.
     * @defaultValue undefined
     * @group Props
     */
    name = input<string | undefined>();
    /**
     * When present, it specifies that the component cannot be edited.
     * Automatically bound by the signal forms `[formField]` directive.
     * @defaultValue undefined
     * @group Props
     */
    readonly = input(undefined, { transform: booleanAttribute });
    /**
     * Whether the associated form field has been touched by the user.
     * Automatically bound by the signal forms `[formField]` directive.
     * @defaultValue undefined
     * @group Props
     */
    touched = input(undefined, { transform: booleanAttribute });
    /**
     * Validation errors of the associated form field.
     * Automatically bound by the signal forms `[formField]` directive.
     * @defaultValue undefined
     * @group Props
     */
    errors = input<readonly ValidationError.WithOptionalFieldTree[] | undefined>();

    _disabled = signal<boolean>(false);

    $disabled = computed(() => this.disabled() || this._disabled());

    onModelChange: Function = () => {};

    onModelTouched: Function = () => {};

    writeDisabledState(value: boolean) {
        this._disabled.set(value);
    }

    writeControlValue(value: any, setModelValue?: (value: any) => void) {
        // NOOP - this method should be overridden in the derived classes
    }

    /**** Angular ControlValueAccessors ****/
    writeValue(value: any) {
        this.writeControlValue(value, this.writeModelValue.bind(this));
    }

    registerOnChange(fn: Function) {
        this.onModelChange = fn;
    }

    registerOnTouched(fn: Function) {
        this.onModelTouched = fn;
    }

    setDisabledState(val: boolean) {
        this.writeDisabledState(val);
        this.cd.markForCheck();
    }
}
