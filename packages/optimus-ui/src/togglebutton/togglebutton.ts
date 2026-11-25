import { CommonModule } from '@angular/common';
import { afterEveryRender, booleanAttribute, ChangeDetectionStrategy, Component, computed, forwardRef, HostListener, inject, input, NgModule, numberAttribute, signal, TemplateRef, contentChild, contentChildren, output } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { PrimeTemplate, SharedModule } from '@openng/optimus-ui/api';
import { PARENT_INSTANCE } from '@openng/optimus-ui/basecomponent';
import { BaseEditableHolder } from '@openng/optimus-ui/baseeditableholder';
import { Bind } from '@openng/optimus-ui/bind';
import { BindModule } from '@openng/optimus-ui/bind';
import { Ripple } from '@openng/optimus-ui/ripple';
import { Nullable } from '@openng/optimus-ui/ts-helpers';
import { ToggleButtonChangeEvent, ToggleButtonContentTemplateContext, ToggleButtonIconTemplateContext, ToggleButtonPassThrough } from '@openng/optimus-ui/types/togglebutton';
import { ToggleButtonStyle } from './style/togglebuttonstyle';

export const TOGGLEBUTTON_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ToggleButton),
    multi: true
};
/**
 * ToggleButton is used to select a boolean value using a button.
 * @group Components
 */
@Component({
    selector: 'p-toggleButton, p-togglebutton, p-toggle-button',
    imports: [CommonModule, SharedModule, BindModule],
    hostDirectives: [{ directive: Ripple }, Bind],
    host: {
        '[class]': "cx('root')",
        '[attr.aria-labelledby]': 'ariaLabelledBy()',
        '[attr.aria-label]': 'ariaLabel()',
        '[attr.aria-pressed]': 'checked() ? "true" : "false"',
        '[attr.role]': '"button"',
        '[attr.tabindex]': '$disabled() ? -1 : (tabindex() ?? 0)',
        '[attr.data-pc-name]': "'togglebutton'",
        '[attr.data-p-checked]': 'active()',
        '[attr.data-p-disabled]': '$disabled()',
        '[attr.data-p]': 'dataP()'
    },
    template: `<span [class]="cx('content')" [pBind]="ptm('content')" [attr.data-p]="dataP()">
        <ng-container *ngTemplateOutlet="contentTemplate() || _contentTemplate(); context: { $implicit: checked() }"></ng-container>
        @if (!contentTemplate()) {
            @if (!iconTemplate()) {
                @if (onIcon() || offIcon()) {
                    <span [class]="cn(cx('icon'), checked() ? this.onIcon() : this.offIcon(), iconPos() === 'left' ? cx('iconLeft') : cx('iconRight'))" [pBind]="ptm('icon')"></span>
                }
            } @else {
                <ng-container *ngTemplateOutlet="iconTemplate() || _iconTemplate(); context: { $implicit: checked() }"></ng-container>
            }
            <span [class]="cx('label')" [pBind]="ptm('label')">{{ checked() ? (hasOnLabel() ? onLabel() : ' ') : hasOffLabel() ? offLabel() : ' ' }}</span>
        }
    </span>`,
    providers: [TOGGLEBUTTON_VALUE_ACCESSOR, ToggleButtonStyle, { provide: PARENT_INSTANCE, useExisting: ToggleButton }],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToggleButton extends BaseEditableHolder<ToggleButtonPassThrough> {
    componentName = 'ToggleButton';

    bindDirectiveInstance = inject(Bind, { self: true });

    constructor() {
        super();
        afterEveryRender(() => this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root'])));
    }

    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        switch (event.code) {
            case 'Enter':
                this.toggle(event);
                event.preventDefault();
                break;
            case 'Space':
                this.toggle(event);
                event.preventDefault();
                break;
        }
    }

    @HostListener('click', ['$event'])
    toggle(event: Event) {
        if (!this.$disabled() && !(this.allowEmpty() === false && this.checked())) {
            this.checked.set(!this.checked());
            this.writeModelValue(this.checked());
            this.onModelChange(this.checked());
            this.onModelTouched();
            this.onChange.emit({
                originalEvent: event,
                checked: this.checked()
            });
        }
    }
    /**
     * Label for the on state.
     * @group Props
     */
    readonly onLabel = input<string>('Yes');
    /**
     * Label for the off state.
     * @group Props
     */
    readonly offLabel = input<string>('No');
    /**
     * Icon for the on state.
     * @group Props
     */
    readonly onIcon = input<string | undefined>();
    /**
     * Icon for the off state.
     * @group Props
     */
    readonly offIcon = input<string | undefined>();
    /**
     * Defines a string that labels the input for accessibility.
     * @group Props
     */
    readonly ariaLabel = input<string | undefined>();
    /**
     * Establishes relationships between the component and label(s) where its value should be one or more element IDs.
     * @group Props
     */
    readonly ariaLabelledBy = input<string | undefined>();
    /**
     * Index of the element in tabbing order.
     * @group Props
     */
    readonly tabindex = input<number | undefined, unknown>(0, { transform: numberAttribute });
    /**
     * Position of the icon.
     * @group Props
     */
    readonly iconPos = input<'left' | 'right'>('left');
    /**
     * Defines the size of the component.
     * @defaultValue undefined
     * @group Props
     */
    size = input<'small' | 'large' | undefined>();
    /**
     * Whether selection can not be cleared.
     * @group Props
     */
    readonly allowEmpty = input<boolean | undefined>();
    /**
     * Spans 100% width of the container when enabled.
     * @defaultValue undefined
     * @group Props
     */
    fluid = input(undefined, { transform: booleanAttribute });
    /**
     * Callback to invoke on value change.
     * @param {ToggleButtonChangeEvent} event - Custom change event.
     * @group Emits
     */
    readonly onChange = output<ToggleButtonChangeEvent>();
    /**
     * Custom icon template.
     * @param {ToggleButtonIconTemplateContext} context - icon context.
     * @see {@link ToggleButtonIconTemplateContext}
     * @group Templates
     */
    readonly iconTemplate = contentChild<Nullable<TemplateRef<ToggleButtonIconTemplateContext>>>('icon', { descendants: false });
    /**
     * Custom content template.
     * @param {ToggleButtonContentTemplateContext} context - content context.
     * @see {@link ToggleButtonContentTemplateContext}
     * @group Templates
     */
    readonly contentTemplate = contentChild<Nullable<TemplateRef<ToggleButtonContentTemplateContext>>>('content', { descendants: false });

    readonly templates = contentChildren(PrimeTemplate);

    checked = signal<boolean>(false);

    _componentStyle = inject(ToggleButtonStyle);

    readonly hasOnLabel = computed<boolean>(() => (this.onLabel() && this.onLabel().length > 0) as boolean);

    readonly hasOffLabel = computed<boolean>(() => (this.offLabel() && this.offLabel().length > 0) as boolean);

    readonly active = computed(() => this.checked() === true);

    readonly _iconTemplate = computed<TemplateRef<ToggleButtonIconTemplateContext> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'icon')
                .at(-1)?.template
    );

    readonly _contentTemplate = computed<TemplateRef<ToggleButtonContentTemplateContext> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() !== 'icon')
                .at(-1)?.template
    );

    /**
     * @override
     *
     * @see {@link BaseEditableHolder.writeControlValue}
     * Writes the value to the control.
     */
    writeControlValue(value: any, setModelValue: (value: any) => void): void {
        this.checked.set(value);
        setModelValue(value);
    }

    readonly dataP = computed(() =>
        this.cn({
            checked: this.active(),
            invalid: this.invalid(),
            [this.size() as string]: this.size()
        })
    );
}

@NgModule({
    imports: [ToggleButton, SharedModule],
    exports: [ToggleButton, SharedModule]
})
export class ToggleButtonModule {}
