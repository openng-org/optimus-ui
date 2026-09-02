import { CommonModule } from '@angular/common';
import {
    afterEveryRender,
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    contentChild,
    contentChildren,
    ElementRef,
    forwardRef,
    HostListener,
    inject,
    input,
    NgModule,
    numberAttribute,
    signal,
    TemplateRef,
    ViewEncapsulation,
    viewChild,
    output
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { PrimeTemplate, SharedModule } from '@openng/optimus-ui/api';
import { AutoFocus } from '@openng/optimus-ui/autofocus';
import { PARENT_INSTANCE } from '@openng/optimus-ui/basecomponent';
import { BaseEditableHolder } from '@openng/optimus-ui/baseeditableholder';
import { Bind, BindModule } from '@openng/optimus-ui/bind';
import { ToggleSwitchChangeEvent, ToggleSwitchHandleTemplateContext, ToggleSwitchPassThrough } from '@openng/optimus-ui/types/toggleswitch';
import { ToggleSwitchStyle } from './style/toggleswitchstyle';

export const TOGGLESWITCH_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ToggleSwitch),
    multi: true
};
/**
 * ToggleSwitch is used to select a boolean value.
 * @group Components
 */
@Component({
    selector: 'p-toggleswitch, p-toggleSwitch, p-toggle-switch',
    standalone: true,
    imports: [CommonModule, AutoFocus, SharedModule, BindModule],
    template: `
        <input
            #input
            [attr.id]="inputId()"
            type="checkbox"
            role="switch"
            [class]="cx('input')"
            [checked]="checked()"
            [attr.required]="required() ? '' : undefined"
            [attr.disabled]="$disabled() ? '' : undefined"
            [attr.aria-checked]="checked()"
            [attr.aria-labelledby]="ariaLabelledBy()"
            [attr.aria-label]="ariaLabel()"
            [attr.name]="name()"
            [attr.tabindex]="tabindex()"
            (focus)="onFocus()"
            (blur)="onBlur()"
            [pAutoFocus]="autofocus()"
            [pBind]="ptm('input')"
        />
        <div [class]="cx('slider')" [pBind]="ptm('slider')" [attr.data-p]="dataP()">
            <div [class]="cx('handle')" [pBind]="ptm('handle')" [attr.data-p]="dataP()">
                @if ($handleTemplate(); as handleTemplate) {
                    <ng-container *ngTemplateOutlet="handleTemplate; context: { checked: checked() }" />
                }
            </div>
        </div>
    `,
    providers: [TOGGLESWITCH_VALUE_ACCESSOR, ToggleSwitchStyle, { provide: PARENT_INSTANCE, useExisting: ToggleSwitch }],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        '[class]': "cx('root')",
        '[style]': "sx('root')",
        '[attr.data-p-checked]': 'checked()',
        '[attr.data-p-disabled]': '$disabled()',
        '[attr.data-p]': 'dataP()'
    },
    hostDirectives: [Bind]
})
export class ToggleSwitch extends BaseEditableHolder<ToggleSwitchPassThrough> {
    bindDirectiveInstance = inject(Bind, { self: true });

    _componentStyle = inject(ToggleSwitchStyle);

    /**
     * Index of the element in tabbing order.
     * @group Props
     */
    readonly tabindex = input<number | undefined, unknown>(undefined, { transform: numberAttribute });

    /**
     * Identifier of the input element.
     * @group Props
     */
    readonly inputId = input<string>();

    /**
     * When present, it specifies that the component cannot be edited.
     * @group Props
     */
    readonly readonly = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    /**
     * Value in checked state.
     * @group Props
     */
    readonly trueValue = input<any>(true);

    /**
     * Value in unchecked state.
     * @group Props
     */
    readonly falseValue = input<any>(false);

    /**
     * Used to define a string that autocomplete attribute the current element.
     * @group Props
     */
    readonly ariaLabel = input<string>();

    /**
     * Specifies the size of the component.
     * @defaultValue undefined
     * @group Props
     */
    size = input<'large' | 'small' | undefined>();

    /**
     * Establishes relationships between the component and label(s) where its value should be one or more element IDs.
     * @group Props
     */
    readonly ariaLabelledBy = input<string>();

    /**
     * When present, it specifies that the component should automatically get focus on load.
     * @group Props
     */
    readonly autofocus = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    /**
     * Callback to invoke when the on value change.
     * @param {ToggleSwitchChangeEvent} event - Custom change event.
     * @group Emits
     */
    readonly onChange = output<ToggleSwitchChangeEvent>();

    readonly input = viewChild.required<ElementRef>('input');

    /**
     * Custom handle template.
     * @param {ToggleSwitchHandleTemplateContext} context - handle context.
     * @see {@link ToggleSwitchHandleTemplateContext}
     * @group Templates
     */
    readonly handleTemplate = contentChild<TemplateRef<ToggleSwitchHandleTemplateContext>>('handle', { descendants: false });

    readonly templates = contentChildren(PrimeTemplate);

    componentName = 'ToggleSwitch';

    readonly focused = signal(false);

    /**
     * Effective handle template: the \`#handle\` content child, or (legacy behavior) the last
     * \`pTemplate\` regardless of type.
     */
    readonly $handleTemplate = computed(() => this.handleTemplate() ?? this.templates().at(-1)?.template);

    readonly dataP = computed(() =>
        this.cn({
            checked: this.checked(),
            disabled: this.$disabled(),
            invalid: this.invalid()
        })
    );

    constructor() {
        super();
        // Re-apply the host/root pass-through sections after each render (replaces the former
        // ngAfterViewChecked hook). Bind.setAttrs writes into a signal behind an equality check,
        // so unchanged PT resolutions are no-ops.
        afterEveryRender(() => {
            this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
        });
    }

    @HostListener('click', ['$event'])
    onHostClick(event: MouseEvent) {
        this.onClick(event);
    }

    onClick(event: Event) {
        if (!this.$disabled() && !this.readonly()) {
            this.writeModelValue(this.checked() ? this.falseValue() : this.trueValue());

            this.onModelChange(this.modelValue());
            this.onChange.emit({
                originalEvent: event,
                checked: this.modelValue()
            });

            this.input().nativeElement.focus();
        }
    }

    onFocus() {
        this.focused.set(true);
    }

    onBlur() {
        this.focused.set(false);
        this.onModelTouched();
    }

    checked() {
        return this.modelValue() === this.trueValue();
    }

    /**
     * @override
     *
     * @see {@link BaseEditableHolder.writeControlValue}
     * Writes the value to the control.
     */
    writeControlValue(value: any, setModelValue: (value: any) => void): void {
        setModelValue(value);
        this.cd.markForCheck();
    }
}

@NgModule({
    imports: [ToggleSwitch, SharedModule],
    exports: [ToggleSwitch, SharedModule]
})
export class ToggleSwitchModule {}
