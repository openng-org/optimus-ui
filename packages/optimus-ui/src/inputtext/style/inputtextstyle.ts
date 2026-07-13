import { Injectable } from '@angular/core';
import { style as inputtext_style } from '@openng/optimus-ui-styles/inputtext';
import { BaseStyle } from '@openng/optimus-ui/base';

const style = /*css*/ `
    ${inputtext_style}

    /* For Optimus */
   .p-inputtext.ng-invalid.ng-dirty {
        border-color: dt('inputtext.invalid.border.color');
    }

    .p-inputtext.ng-invalid.ng-dirty::placeholder {
        color: dt('inputtext.invalid.placeholder.color');
    }
`;

const classes = {
    root: ({ instance }) => [
        'p-inputtext p-component',
        {
            'p-filled': instance.$filled(),
            'p-inputtext-sm': instance.pSize === 'small',
            'p-inputtext-lg': instance.pSize === 'large',
            'p-invalid': instance.invalid(),
            'p-variant-filled': instance.$variant() === 'filled',
            'p-inputtext-fluid': instance.hasFluid
        }
    ]
};

@Injectable()
export class InputTextStyle extends BaseStyle {
    name = 'inputtext';

    style = style;

    classes = classes;
}

/**
 *
 * InputText renders a text field to enter data.
 *
 * [Live Demo](https://optimus.openng.org/inputtext/)
 *
 * @module inputtextstyle
 *
 */
export enum InputTextClasses {
    /**
     * The class of root element
     */
    root = 'p-inputtext'
}

export interface InputTextStyle extends BaseStyle {}
