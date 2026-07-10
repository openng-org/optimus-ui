import { Injectable } from '@angular/core';
import { style as autocomplete_style } from '@primeuix/styles/autocomplete';
import { BaseStyle } from 'primeng/base';

const style = /*css*/ `
${autocomplete_style}

/* For PrimeNG */
p-autoComplete.ng-invalid.ng-dirty .p-autocomplete-input,
p-autoComplete.ng-invalid.ng-dirty .p-autocomplete-input-multiple,
p-auto-complete.ng-invalid.ng-dirty .p-autocomplete-input,
p-auto-complete.ng-invalid.ng-dirty .p-autocomplete-input-multiple p-autocomplete.ng-invalid.ng-dirty .p-autocomplete-input,
p-autocomplete.ng-invalid.ng-dirty .p-autocomplete-input-multiple {
    border-color: dt('autocomplete.invalid.border.color');
}

p-autoComplete.ng-invalid.ng-dirty .p-autocomplete-input:enabled:focus,
p-autoComplete.ng-invalid.ng-dirty:not(.p-disabled).p-focus .p-autocomplete-input-multiple,
p-auto-complete.ng-invalid.ng-dirty .p-autocomplete-input:enabled:focus,
p-auto-complete.ng-invalid.ng-dirty:not(.p-disabled).p-focus .p-autocomplete-input-multiple,
p-autocomplete.ng-invalid.ng-dirty .p-autocomplete-input:enabled:focus,
p-autocomplete.ng-invalid.ng-dirty:not(.p-disabled).p-focus .p-autocomplete-input-multiple {
    border-color: dt('autocomplete.focus.border.color');
}

p-autoComplete.ng-invalid.ng-dirty .p-autocomplete-input-chip input::placeholder,
p-auto-complete.ng-invalid.ng-dirty .p-autocomplete-input-chip input::placeholder,
p-autocomplete.ng-invalid.ng-dirty .p-autocomplete-input-chip input::placeholder {
    color: dt('autocomplete.invalid.placeholder.color');
}

p-autoComplete.ng-invalid.ng-dirty .p-autocomplete-input::placeholder,
p-auto-complete.ng-invalid.ng-dirty .p-autocomplete-input::placeholder,
p-autocomplete.ng-invalid.ng-dirty .p-autocomplete-input::placeholder {
    color: dt('autocomplete.invalid.placeholder.color');
}

.p-autocomplete-selected-item {
    position: absolute;
    inset-block: 1px;
    inset-inline-start: 1px;
    inset-inline-end: 1px;
    display: flex;
    align-items: center;
    overflow: hidden;
    white-space: nowrap;
    padding-inline: dt('autocomplete.padding.x');
    border-radius: dt('autocomplete.border.radius');
    pointer-events: none;
}

.p-autocomplete:has(.p-autocomplete-selected-item) .p-autocomplete-input {
    color: transparent;
}

.p-autocomplete:has(.p-autocomplete-dropdown) .p-autocomplete-selected-item {
    inset-inline-end: calc(dt('autocomplete.dropdown.width') + 1px);
}

.p-autocomplete:has(.p-autocomplete-clear-icon) .p-autocomplete-selected-item {
    padding-inline-end: calc((dt('form.field.padding.x') * 2) + dt('icon.size'));
}

.p-autocomplete-sm .p-autocomplete-input-multiple {
    font-size: dt('form.field.sm.font.size');
    padding-block: calc(dt('form.field.sm.padding.y') / 2);
    padding-inline: dt('form.field.sm.padding.x');
}

.p-autocomplete-sm .p-autocomplete-input-chip input {
    font-size: dt('form.field.sm.font.size');
}

.p-autocomplete-sm .p-autocomplete-dropdown {
    width: dt('autocomplete.dropdown.sm.width');
}

.p-autocomplete-lg .p-autocomplete-input-multiple {
    font-size: dt('form.field.lg.font.size');
    padding-block: calc(dt('form.field.lg.padding.y') / 2);
    padding-inline: dt('form.field.lg.padding.x');
}

.p-autocomplete-lg .p-autocomplete-input-chip input {
    font-size: dt('form.field.lg.font.size');
}

.p-autocomplete-lg .p-autocomplete-dropdown {
    width: dt('autocomplete.dropdown.lg.width');
}
`;

const inlineStyles = {
    root: { position: 'relative' }
};

const classes = {
    root: ({ instance }) => [
        'p-autocomplete p-component p-inputwrapper',
        {
            'p-invalid': instance.invalid(),
            'p-focus': instance.focused(),
            'p-inputwrapper-filled': instance.$filled(),
            'p-inputwrapper-focus': (instance.focused() && !instance.$disabled()) || instance.autofocus() || instance.overlayVisible(),
            'p-autocomplete-open': instance.overlayVisible(),
            'p-autocomplete-clearable': instance.showClear() && !instance.$disabled(),
            'p-autocomplete-fluid': instance.hasFluid,
            'p-autocomplete-sm p-inputfield-sm': instance.size() === 'small',
            'p-autocomplete-lg p-inputfield-lg': instance.size() === 'large'
        }
    ],
    pcInputText: 'p-autocomplete-input',
    selectedItem: 'p-autocomplete-selected-item',
    inputMultiple: ({ instance }) => [
        'p-autocomplete-input-multiple',
        {
            'p-disabled': instance.$disabled(),
            'p-variant-filled': instance.$variant() === 'filled'
        }
    ],
    chipItem: ({ instance, i }) => [
        'p-autocomplete-chip-item',
        {
            'p-focus': instance.focusedMultipleOptionIndex() === i
        }
    ],
    pcChip: 'p-autocomplete-chip',
    chipIcon: 'p-autocomplete-chip-icon',
    inputChip: 'p-autocomplete-input-chip',
    loader: 'p-autocomplete-loader',
    dropdown: 'p-autocomplete-dropdown',
    overlay: ({ instance }) => ['p-autocomplete-overlay p-component-overlay p-component', { 'p-input-filled': instance.$variant() === 'filled', 'p-ripple-disabled': instance.config.ripple() === false }],
    listContainer: 'p-autocomplete-list-container',
    list: 'p-autocomplete-list',
    optionGroup: 'p-autocomplete-option-group',
    option: ({ instance, option, i, scrollerOptions }) => ({
        'p-autocomplete-option': true,
        'p-autocomplete-option-selected': instance.isSelected(option),
        'p-focus': instance.focusedOptionIndex() === instance.getOptionIndex(i, scrollerOptions),
        'p-disabled': instance.isOptionDisabled(option)
    }),
    emptyMessage: 'p-autocomplete-empty-message',
    clearIcon: 'p-autocomplete-clear-icon'
};

@Injectable()
export class AutoCompleteStyle extends BaseStyle {
    name = 'autocomplete';

    style = style;

    classes = classes;

    inlineStyles = inlineStyles;
}

/**
 *
 * AutoComplete is an input component that provides real-time suggestions while being typed.
 *
 * [Live Demo](https://www.primeng.org/autocomplete/)
 *
 * @module autocompletestyle
 *
 */
export enum AutoCompleteClasses {
    /**
     * Class name of the root element
     */
    root = 'p-autocomplete',
    /**
     * Class name of the input element
     */
    pcInputText = 'p-autocomplete-input',
    /**
     * Class name of the selected item element
     */
    selectedItem = 'p-autocomplete-selected-item',
    /**
     * Class name of the input multiple element
     */
    inputMultiple = 'p-autocomplete-input-multiple',
    /**
     * Class name of the chip item element
     */
    chipItem = 'p-autocomplete-chip-item',
    /**
     * Class name of the chip element
     */
    pcChip = 'p-autocomplete-chip',
    /**
     * Class name of the chip icon element
     */
    chipIcon = 'p-autocomplete-chip-icon',
    /**
     * Class name of the input chip element
     */
    inputChip = 'p-autocomplete-input-chip',
    /**
     * Class name of the loader element
     */
    loader = 'p-autocomplete-loader',
    /**
     * Class name of the dropdown element
     */
    dropdown = 'p-autocomplete-dropdown',
    /**
     * Class name of the panel element
     */
    panel = 'p-autocomplete-overlay',
    /**
     * Class name of the list element
     */
    list = 'p-autocomplete-list',
    /**
     * Class name of the option group element
     */
    optionGroup = 'p-autocomplete-option-group',
    /**
     * Class name of the option element
     */
    option = 'p-autocomplete-option',
    /**
     * Class name of the empty message element
     */
    emptyMessage = 'p-autocomplete-empty-message',
    /**
     * Class name of the clear icon
     */
    clearIcon = 'p-autocomplete-clear-icon'
}

export interface AutoCompleteStyle extends BaseStyle {}
