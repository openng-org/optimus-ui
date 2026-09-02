import { afterEveryRender, afterNextRender, booleanAttribute, computed, Directive, effect, HostListener, inject, input, NgModule } from '@angular/core';
import { NgControl } from '@angular/forms';
import { PARENT_INSTANCE } from '@openng/optimus-ui/basecomponent';
import { BaseModelHolder } from '@openng/optimus-ui/basemodelholder';
import { Bind } from '@openng/optimus-ui/bind';
import { Fluid } from '@openng/optimus-ui/fluid';
import { InputTextPassThrough } from '@openng/optimus-ui/types/inputtext';
import { InputTextStyle } from './style/inputtextstyle';

/**
 * InputText directive is an extension to standard input element with theming.
 * @group Components
 */
@Directive({
    selector: '[pInputText]',
    standalone: true,
    host: {
        '[class]': "cx('root')",
        '[attr.data-p]': 'dataP()'
    },
    providers: [InputTextStyle, { provide: PARENT_INSTANCE, useExisting: InputText }],
    hostDirectives: [Bind]
})
export class InputText extends BaseModelHolder<InputTextPassThrough> {
    bindDirectiveInstance = inject(Bind, { self: true });

    ngControl = inject(NgControl, { optional: true, self: true });

    pcFluid: Fluid | null = inject(Fluid, { optional: true, host: true, skipSelf: true });

    _componentStyle = inject(InputTextStyle);

    readonly hostName = input<any>('');

    /**
     * Used to pass attributes to DOM elements inside the InputText component.
     * @defaultValue undefined
     * @deprecated use pInputTextPT instead.
     * @group Props
     */
    ptInputText = input<InputTextPassThrough>();

    /**
     * Used to pass attributes to DOM elements inside the InputText component.
     * @defaultValue undefined
     * @group Props
     */
    pInputTextPT = input<InputTextPassThrough>();

    /**
     * Indicates whether the component should be rendered without styles.
     * @defaultValue undefined
     * @group Props
     */
    pInputTextUnstyled = input<boolean | undefined>();

    /**
     * Defines the size of the component.
     * @group Props
     */
    readonly pSize = input<'large' | 'small'>();

    /**
     * Specifies the input variant of the component.
     * @defaultValue undefined
     * @group Props
     */
    variant = input<'filled' | 'outlined' | undefined>();

    /**
     * Spans 100% width of the container when enabled.
     * @defaultValue undefined
     * @group Props
     */
    fluid = input(undefined, { transform: booleanAttribute });

    /**
     * When present, it specifies that the component should have invalid state style.
     * @defaultValue false
     * @group Props
     */
    invalid = input(undefined, { transform: booleanAttribute });

    componentName = 'InputText';

    $variant = computed(() => this.variant() || this.config.inputStyle() || this.config.inputVariant());

    readonly hasFluid = computed(() => this.fluid() ?? !!this.pcFluid);

    readonly dataP = computed(() =>
        this.cn({
            invalid: this.invalid(),
            fluid: this.hasFluid(),
            filled: this.$variant() === 'filled',
            [this.pSize() as string]: this.pSize()
        })
    );

    constructor() {
        super();
        effect(() => {
            const pt = this.ptInputText() || this.pInputTextPT();
            pt && this.directivePT.set(pt);
        });

        effect(() => {
            this.pInputTextUnstyled() && this.directiveUnstyled.set(this.pInputTextUnstyled());
        });

        // Seed the model value from the rendered element (replaces the former ngAfterViewInit hook).
        afterNextRender(() => {
            this.writeModelValue(this.ngControl?.value ?? this.el.nativeElement.value);
            this.cd.detectChanges();
        });

        // Re-apply the root pass-through section after each render (replaces the former
        // ngAfterViewChecked hook). Bind.setAttrs writes into a signal behind an equality check,
        // so unchanged PT resolutions are no-ops.
        afterEveryRender(() => {
            this.bindDirectiveInstance.setAttrs(this.ptm('root'));
        });
    }

    onDoCheck() {
        this.writeModelValue(this.ngControl?.value ?? this.el.nativeElement.value);
    }

    @HostListener('input')
    onInput() {
        this.writeModelValue(this.ngControl?.value ?? this.el.nativeElement.value);
    }
}

@NgModule({
    imports: [InputText],
    exports: [InputText]
})
export class InputTextModule {}
