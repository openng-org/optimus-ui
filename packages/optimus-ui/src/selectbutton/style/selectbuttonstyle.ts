import { Injectable } from '@angular/core';
import { style as selectbutton_style } from '@openng/optimus-ui-styles/selectbutton';
import { BaseStyle } from '@openng/optimus-ui/base';

const style = /*css*/ `
    ${selectbutton_style}

    /* For Optimus */
    .p-selectbutton.ng-invalid.ng-dirty {
        outline: 1px solid dt('selectbutton.invalid.border.color');
        outline-offset: 0;
    }
`;

const classes = {
    root: ({ instance }) => [
        'p-selectbutton p-component',
        {
            'p-invalid': instance.invalid(),
            'p-selectbutton-fluid': instance.fluid()
        }
    ]
};

@Injectable()
export class SelectButtonStyle extends BaseStyle {
    name = 'selectbutton';

    style = style;

    classes = classes;
}

/**
 *
 * SelectButton is used to choose single or multiple items from a list using buttons.
 *
 * [Live Demo](https://optimus.openng.org/selectbutton/)
 *
 * @module selectbuttonstyle
 *
 */
export enum SelectButtonClasses {
    /**
     * Class name of the root element
     */
    root = 'p-selectbutton'
}

export interface SelectButtonStyle extends BaseStyle {}
