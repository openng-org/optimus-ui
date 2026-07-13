import { Injectable } from '@angular/core';
import { style as floatlabel_style } from '@openng/optimus-ui-styles/floatlabel';
import { BaseStyle } from '@openng/optimus-ui/base';

const style = /*css*/ `
    ${floatlabel_style}

    /* For Optimus */
    .p-floatlabel:has(.ng-invalid.ng-dirty) label {
        color: dt('floatlabel.invalid.color');
    }
`;

const classes = {
    root: ({ instance }) => [
        'p-floatlabel',
        {
            'p-floatlabel-over': instance.variant === 'over',
            'p-floatlabel-on': instance.variant === 'on',
            'p-floatlabel-in': instance.variant === 'in'
        }
    ]
};

@Injectable()
export class FloatLabelStyle extends BaseStyle {
    name = 'floatlabel';

    style = style;

    classes = classes;
}

/**
 *
 * FloatLabel visually integrates a label with its form element.
 *
 * [Live Demo](https://optimus.openng.org/floatlabel/)
 *
 * @module floatlabelstyle
 *
 */
export enum FloatLabelClasses {
    /**
     * Class name of the root element
     */
    root = 'p-floatlabel'
}

export interface FloatLabelStyle extends BaseStyle {}
