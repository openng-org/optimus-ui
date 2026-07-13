import { Injectable } from '@angular/core';
import { style as checkbox_style } from '@openng/optimus-ui-styles/checkbox';
import { BaseStyle } from '@openng/optimus-ui/base';

const style = /*css*/ `
    ${checkbox_style}

    /* For Optimus */
    p-checkBox.ng-invalid.ng-dirty .p-checkbox-box,
    p-check-box.ng-invalid.ng-dirty .p-checkbox-box,
    p-checkbox.ng-invalid.ng-dirty .p-checkbox-box {
        border-color: dt('checkbox.invalid.border.color');
    }
`;

const classes = {
    root: ({ instance }) => [
        'p-checkbox p-component',
        {
            'p-checkbox-checked p-highlight': instance.checked,
            'p-disabled': instance.$disabled(),
            'p-invalid': instance.invalid(),
            'p-variant-filled': instance.$variant() === 'filled',
            'p-checkbox-sm p-inputfield-sm': instance.size() === 'small',
            'p-checkbox-lg p-inputfield-lg': instance.size() === 'large'
        }
    ],
    box: 'p-checkbox-box',
    input: 'p-checkbox-input',
    icon: 'p-checkbox-icon'
};

@Injectable()
export class CheckboxStyle extends BaseStyle {
    name = 'checkbox';

    style = style;

    classes = classes;
}

/**
 *
 * Checkbox is an extension to standard checkbox element with theming.
 *
 * [Live Demo](https://optimus.openng.org/checkbox/)
 *
 * @module checkboxstyle
 *
 */
export enum CheckboxClasses {
    /**
     * Class name of the root element
     */
    root = 'p-checkbox',
    /**
     * Class name of the box element
     */
    box = 'p-checkbox-box',
    /**
     * Class name of the input element
     */
    input = 'p-checkbox-input',
    /**
     * Class name of the icon element
     */
    icon = 'p-checkbox-icon'
}

export interface CheckboxStyle extends BaseStyle {}
