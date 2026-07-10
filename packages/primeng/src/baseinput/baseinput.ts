import { booleanAttribute, computed, Directive, inject, input } from '@angular/core';
import { BaseEditableHolder } from 'primeng/baseeditableholder';
import { Fluid } from 'primeng/fluid';

/**
 * Transforms a pattern value into the normalized `readonly RegExp[]` shape used by Angular signal forms.
 * Accepts a single pattern or an array of patterns, given as strings or RegExp instances.
 */
export function patternAttribute(value: string | RegExp | readonly (string | RegExp)[] | null | undefined): readonly RegExp[] | undefined {
    if (value === null || value === undefined || value === '') {
        return undefined;
    }

    const patterns: RegExp[] = [];

    for (const pattern of Array.isArray(value) ? value : [value]) {
        if (pattern instanceof RegExp) {
            patterns.push(pattern);
        } else if (typeof pattern === 'string' && pattern !== '') {
            try {
                patterns.push(new RegExp(pattern));
            } catch {
                // Invalid pattern sources are ignored, mirroring native input behavior.
            }
        }
    }

    return patterns.length > 0 ? patterns : undefined;
}

@Directive({ standalone: true })
export class BaseInput<PT = any> extends BaseEditableHolder<PT> {
    pcFluid: Fluid | null = inject(Fluid, { optional: true, host: true, skipSelf: true });

    /**
     * Spans 100% width of the container when enabled.
     * @defaultValue false
     * @group Props
     */
    fluid = input(undefined, { transform: booleanAttribute });
    /**
     * Specifies the input variant of the component.
     * @defaultValue 'outlined'
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
     * Specifies the visible width of the input element in characters.
     * @defaultValue undefined
     * @group Props
     */
    inputSize = input<number | null | undefined>();
    /**
     * Specifies the value must match the pattern. Accepts a string, a RegExp or an array of patterns.
     * Automatically bound as `readonly RegExp[]` by the signal forms `[formField]` directive.
     * @defaultValue undefined
     * @group Props
     */
    pattern = input(undefined, { transform: patternAttribute });
    /**
     * The value must be greater than or equal to the value.
     * @defaultValue undefined
     * @group Props
     */
    min = input<number | null | undefined>();
    /**
     * The value must be less than or equal to the value.
     * @defaultValue undefined
     * @group Props
     */
    max = input<number | null | undefined>();
    /**
     * Unless the step is set to the any literal, the value must be min + an integral multiple of the step.
     * @defaultValue undefined
     * @group Props
     */
    step = input<number | null | undefined>();
    /**
     * The number of characters (code points) must not be less than the value of the attribute, if non-empty.
     * Automatically bound by the signal forms `[formField]` directive.
     * @defaultValue undefined
     * @group Props
     */
    minLength = input<number | null | undefined>();
    /**
     * The number of characters (code points) must not exceed the value of the attribute.
     * Automatically bound by the signal forms `[formField]` directive.
     * @defaultValue undefined
     * @group Props
     */
    maxLength = input<number | null | undefined>();
    /**
     * The number of characters (code points) must not be less than the value of the attribute, if non-empty.
     * @defaultValue undefined
     * @group Props
     * @deprecated use `minLength` instead.
     */
    minlength = input<number | null | undefined>();
    /**
     * The number of characters (code points) must not exceed the value of the attribute.
     * @defaultValue undefined
     * @group Props
     * @deprecated use `maxLength` instead.
     */
    maxlength = input<number | null | undefined>();

    $variant = computed(() => this.variant() || this.config.inputVariant());

    /**
     * Resolved minimum length, merging the `minLength` and deprecated `minlength` inputs.
     */
    $minLength = computed(() => this.minLength() ?? this.minlength());

    /**
     * Resolved maximum length, merging the `maxLength` and deprecated `maxlength` inputs.
     */
    $maxLength = computed(() => this.maxLength() ?? this.maxlength());

    /**
     * String representation of the first pattern, suitable for the native `pattern` attribute.
     */
    $patternAttr = computed(() => this.pattern()?.[0]?.source);

    get hasFluid() {
        return this.fluid() ?? !!this.pcFluid;
    }
}
