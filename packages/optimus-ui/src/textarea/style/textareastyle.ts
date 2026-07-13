import { Injectable } from '@angular/core';
import { style as textarea_style } from '@openng/optimus-ui-styles/textarea';
import { BaseStyle } from '@openng/optimus-ui/base';

const style = /*css*/ `
    ${textarea_style}

    /* For Optimus */
    .p-textarea.ng-invalid.ng-dirty {
        border-color: dt('textarea.invalid.border.color');
    }
    .p-textarea.ng-invalid.ng-dirty::placeholder {
        color: dt('textarea.invalid.placeholder.color');
    }
`;

const classes = {
    root: ({ instance }) => [
        'p-textarea p-component',
        {
            'p-filled': instance.$filled(),
            'p-textarea-resizable ': instance.autoResize,
            'p-variant-filled': instance.$variant() === 'filled',
            'p-textarea-fluid': instance.hasFluid,
            'p-inputfield-sm p-textarea-sm': instance.pSize === 'small',
            'p-textarea-lg p-inputfield-lg': instance.pSize === 'large',
            'p-invalid': instance.invalid()
        }
    ]
};

@Injectable()
export class TextareaStyle extends BaseStyle {
    name = 'textarea';

    style = style;

    classes = classes;
}

/**
 *
 * Textarea is a multi-line text input element.
 *
 * [Live Demo](https://optimus.openng.org/textarea/)
 *
 * @module textareastyle
 *
 */
export enum TextareaClasses {
    /**
     * Class name of the root element
     */
    root = 'p-textarea'
}

export interface TextareaStyle extends BaseStyle {}
