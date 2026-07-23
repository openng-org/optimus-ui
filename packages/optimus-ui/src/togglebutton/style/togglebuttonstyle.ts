import { Injectable } from '@angular/core';
import { style as togglebutton_style } from '@openng/optimus-ui-styles/togglebutton';
import { BaseStyle } from '@openng/optimus-ui/base';

const style = /*css*/ `
    ${togglebutton_style}

    /* For Optimus (iconPos) */
    .p-togglebutton-icon-right {
        order: 1;
    }

    .p-togglebutton.ng-invalid.ng-dirty {
        border-color: dt('togglebutton.invalid.border.color');
    }
`;

const classes = {
    root: ({ instance }) => [
        'p-togglebutton p-component',
        {
            'p-togglebutton-checked': instance.checked,
            'p-invalid': instance.invalid(),
            'p-disabled': instance.$disabled(),
            'p-togglebutton-sm p-inputfield-sm': instance.size() === 'small',
            'p-togglebutton-lg p-inputfield-lg': instance.size() === 'large',
            'p-togglebutton-fluid': instance.fluid()
        }
    ],
    content: 'p-togglebutton-content',
    icon: 'p-togglebutton-icon',
    iconLeft: 'p-togglebutton-icon-left',
    iconRight: 'p-togglebutton-icon-right',
    label: 'p-togglebutton-label'
};

@Injectable()
export class ToggleButtonStyle extends BaseStyle {
    name = 'togglebutton';

    style = style;

    classes = classes;
}

/**
 *
 * ToggleButton is used to select a boolean value using a button.
 *
 * [Live Demo](https://optimus.openng.org/togglebutton/)
 *
 * @module togglebuttonstyle
 *
 */
export enum ToggleButtonClasses {
    /**
     * Class name of the root element
     */
    root = 'p-togglebutton',
    /**
     * Class name of the icon element
     */
    icon = 'p-togglebutton-icon',
    /**
     * Class name of the left icon
     */
    iconLeft = 'p-togglebutton-icon-left',
    /**
     * Class name of the right icon
     */
    iconRight = 'p-togglebutton-icon-right',
    /**
     * Class name of the label element
     */
    label = 'p-togglebutton-label'
}

export interface ToggleButtonStyle extends BaseStyle {}
