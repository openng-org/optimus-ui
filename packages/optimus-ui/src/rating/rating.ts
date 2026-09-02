import { CommonModule } from '@angular/common';
import { afterEveryRender, booleanAttribute, ChangeDetectionStrategy, Component, computed, contentChild, contentChildren, forwardRef, inject, input, NgModule, numberAttribute, signal, TemplateRef, ViewEncapsulation, output } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { focus, getFirstFocusableElement, uuid } from '@openng/optimus-ui-utils';
import { PrimeTemplate, SharedModule } from '@openng/optimus-ui/api';
import { AutoFocus } from '@openng/optimus-ui/autofocus';
import { PARENT_INSTANCE } from '@openng/optimus-ui/basecomponent';
import { BaseEditableHolder } from '@openng/optimus-ui/baseeditableholder';
import { Bind } from '@openng/optimus-ui/bind';
import { BindModule } from '@openng/optimus-ui/bind';
import { StarFillIcon, StarIcon } from '@openng/optimus-ui/icons';
import { Nullable } from '@openng/optimus-ui/ts-helpers';
import { RatingIconTemplateContext, RatingPassThrough } from '@openng/optimus-ui/types/rating';
import type { RatingRateEvent } from '@openng/optimus-ui/types/rating';
import { RatingStyle } from './style/ratingstyle';

export const RATING_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => Rating),
    multi: true
};
/**
 * Rating is an extension to standard radio button element with theming.
 * @group Components
 */
@Component({
    selector: 'p-rating',
    imports: [CommonModule, AutoFocus, StarFillIcon, StarIcon, SharedModule, BindModule],
    standalone: true,
    template: `
        @for (star of starsArray(); track star; let i = $index) {
            <div [class]="cx('option', { star, value: value() })" (click)="onOptionClick($event, star + 1)" [pBind]="ptm('option')">
                <span class="p-hidden-accessible" [attr.data-p-hidden-accessible]="true" [pBind]="ptm('hiddenOptionInputContainer')">
                    <input
                        type="radio"
                        [value]="star + 1"
                        [attr.name]="name() || nameattr + '_name'"
                        [attr.value]="modelValue()"
                        [attr.required]="required() ? '' : undefined"
                        [attr.readonly]="readonly() ? '' : undefined"
                        [attr.disabled]="$disabled() ? '' : undefined"
                        [checked]="value() === star + 1"
                        [attr.aria-label]="starAriaLabel(star + 1)"
                        (focus)="onInputFocus($event, star + 1)"
                        (blur)="onInputBlur($event)"
                        (change)="onChange($event, star + 1)"
                        [pAutoFocus]="autofocus()"
                        [pBind]="ptm('hiddenOptionInput')"
                    />
                </span>
                @if (star + 1 <= value()) {
                    @if ($onIconTemplate(); as onIconTemplate) {
                        <ng-container *ngTemplateOutlet="onIconTemplate; context: { $implicit: star + 1, class: cx('onIcon') }"></ng-container>
                    } @else {
                        @if (iconOnClass()) {
                            <span [class]="cx('onIcon')" [ngStyle]="iconOnStyle()" [ngClass]="iconOnClass()" [pBind]="ptm('onIcon')"></span>
                        }
                        @if (!iconOnClass()) {
                            <svg data-p-icon="star-fill" [ngStyle]="iconOnStyle()" [class]="cx('onIcon')" [pBind]="ptm('onIcon')" />
                        }
                    }
                } @else {
                    @if ($offIconTemplate(); as offIconTemplate) {
                        <ng-container *ngTemplateOutlet="offIconTemplate; context: { $implicit: star + 1, class: cx('offIcon') }"></ng-container>
                    } @else {
                        @if (iconOffClass()) {
                            <span [class]="cx('offIcon')" [ngStyle]="iconOffStyle()" [ngClass]="iconOffClass()" [pBind]="ptm('offIcon')"></span>
                        }
                        @if (!iconOffClass()) {
                            <svg data-p-icon="star" [ngStyle]="iconOffStyle()" [class]="cx('offIcon')" [pBind]="ptm('offIcon')" />
                        }
                    }
                }
            </div>
        }
    `,
    providers: [RATING_VALUE_ACCESSOR, RatingStyle, { provide: PARENT_INSTANCE, useExisting: Rating }],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        '[class]': "cx('root')",
        '[attr.data-p]': 'dataP()'
    },
    hostDirectives: [Bind]
})
export class Rating extends BaseEditableHolder<RatingPassThrough> {
    bindDirectiveInstance = inject(Bind, { self: true });

    _componentStyle = inject(RatingStyle);

    /**
     * When present, changing the value is not possible.
     * @group Props
     */
    readonly readonly = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    /**
     * Number of stars.
     * @group Props
     */
    readonly stars = input<number, unknown>(5, { transform: numberAttribute });

    /**
     * Style class of the on icon.
     * @group Props
     */
    readonly iconOnClass = input<string>();

    /**
     * Inline style of the on icon.
     * @group Props
     */
    readonly iconOnStyle = input<{ [klass: string]: any } | null>();

    /**
     * Style class of the off icon.
     * @group Props
     */
    readonly iconOffClass = input<string>();

    /**
     * Inline style of the off icon.
     * @group Props
     */
    readonly iconOffStyle = input<{ [klass: string]: any } | null>();

    /**
     * When present, it specifies that the component should automatically get focus on load.
     * @group Props
     */
    readonly autofocus = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    /**
     * Emitted on value change.
     * @param {RatingRateEvent} value - Custom rate event.
     * @group Emits
     */
    readonly onRate = output<RatingRateEvent>();

    /**
     * Emitted when the rating receives focus.
     * @param {Event} value - Browser event.
     * @group Emits
     */
    readonly onFocus = output<FocusEvent>();

    /**
     * Emitted when the rating loses focus.
     * @param {Event} value - Browser event.
     * @group Emits
     */
    readonly onBlur = output<FocusEvent>();

    /**
     * Custom on icon template.
     * @param {RatingIconTemplateContext} context - icon context.
     * @see {@link RatingIconTemplateContext}
     * @group Templates
     */
    readonly onIconTemplate = contentChild<Nullable<TemplateRef<RatingIconTemplateContext>>>('onicon', { descendants: false });

    /**
     * Custom off icon template.
     * @param {RatingIconTemplateContext} context - icon context.
     * @see {@link RatingIconTemplateContext}
     * @group Templates
     */
    readonly offIconTemplate = contentChild<Nullable<TemplateRef<RatingIconTemplateContext>>>('officon', { descendants: false });

    readonly templates = contentChildren(PrimeTemplate);

    componentName = 'Rating';

    /** Effective on icon template: the \`#onicon\` content child, or a legacy \`pTemplate="onicon"\`. */
    readonly $onIconTemplate = computed(() => this.onIconTemplate() ?? (this.templates().find((item) => item.getType() === 'onicon')?.template as TemplateRef<RatingIconTemplateContext> | undefined));

    /** Effective off icon template: the \`#officon\` content child, or a legacy \`pTemplate="officon"\`. */
    readonly $offIconTemplate = computed(() => this.offIconTemplate() ?? (this.templates().find((item) => item.getType() === 'officon')?.template as TemplateRef<RatingIconTemplateContext> | undefined));

    readonly value = signal<Nullable<number>>(undefined);

    /** The star indices to render, derived from \`stars\`. */
    readonly starsArray = computed<number[]>(() => Array.from({ length: this.stars() }, (_, i) => i));

    isFocusVisibleItem: boolean = true;

    focusedOptionIndex = signal<number>(-1);

    nameattr: string | undefined;

    readonly isCustomIcon = computed<boolean>(() => !!(this.$onIconTemplate() || this.$offIconTemplate()));

    readonly dataP = computed(() =>
        this.cn({
            readonly: this.readonly(),
            disabled: this.$disabled()
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

    onInit() {
        this.nameattr = this.nameattr || uuid('pn_id_');
    }

    onOptionClick(event, value) {
        if (!this.readonly() && !this.$disabled()) {
            this.onOptionSelect(event, value);
            this.isFocusVisibleItem = false;
            const firstFocusableEl = <any>getFirstFocusableElement(event.currentTarget, '');

            firstFocusableEl && focus(firstFocusableEl);
        }
    }

    onOptionSelect(event, value) {
        if (!this.readonly() && !this.$disabled()) {
            if (this.focusedOptionIndex() === value || value === this.value()) {
                this.focusedOptionIndex.set(-1);
                this.updateModel(event, null);
            } else {
                this.focusedOptionIndex.set(value);
                this.updateModel(event, value || null);
            }
        }
    }

    onChange(event, value) {
        this.onOptionSelect(event, value);
        this.isFocusVisibleItem = true;
    }

    onInputBlur(event) {
        this.focusedOptionIndex.set(-1);
        this.onBlur.emit(event);
    }

    onInputFocus(event, value) {
        if (!this.readonly() && !this.$disabled()) {
            this.focusedOptionIndex.set(value);
            this.isFocusVisibleItem = event.sourceCapabilities?.firesTouchEvents === false;

            this.onFocus.emit(event);
        }
    }

    updateModel(event, value) {
        this.writeValue(value);
        this.onModelChange(this.value());
        this.onModelTouched();

        this.onRate.emit({
            originalEvent: event,
            value
        });
    }

    starAriaLabel(value) {
        return value === 1 ? this.config.translation.aria?.star : this.config.translation.aria?.stars?.replace(/{star}/g, value);
    }

    getIconTemplate(i: number): Nullable<TemplateRef<RatingIconTemplateContext>> {
        return !this.value() || i >= this.value()! ? this.$offIconTemplate() : this.onIconTemplate() || this.offIconTemplate();
    }

    /**
     * @override
     *
     * @see {@link BaseEditableHolder.writeControlValue}
     * Writes the value to the control.
     */
    writeControlValue(value: any, setModelValue: (value: any) => void): void {
        this.value.set(value);
        setModelValue(value);
    }
}

@NgModule({
    imports: [Rating, SharedModule],
    exports: [Rating, SharedModule]
})
export class RatingModule {}
