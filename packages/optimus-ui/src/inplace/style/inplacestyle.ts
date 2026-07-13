import { Injectable } from '@angular/core';
import { style } from '@openng/optimus-ui-styles/inplace';
import { BaseStyle } from '@openng/optimus-ui/base';

const classes = {
    root: () => ['p-inplace p-component'],
    display: ({ instance }) => ['p-inplace-display', { 'p-disabled': instance.disabled }],
    content: 'p-inplace-content'
};

@Injectable()
export class InplaceStyle extends BaseStyle {
    name = 'inplace';

    style = style;

    classes = classes;
}

/**
 *
 * Inplace provides an easy to do editing and display at the same time where clicking the output displays the actual content.
 *
 * [Live Demo](https://optimus.openng.org/inplace)
 *
 * @module inplacestyle
 *
 */
export enum InplaceClasses {
    /**
     * Class name of the root element
     */
    root = 'p-inplace',
    /**
     * Class name of the display element
     */
    display = 'p-inplace-display',
    /**
     * Class name of the content element
     */
    content = 'p-inplace-content'
}

export interface InplaceStyle extends BaseStyle {}
