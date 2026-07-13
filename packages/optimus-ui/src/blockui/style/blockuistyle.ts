import { Injectable } from '@angular/core';
import { style } from '@openng/optimus-ui-styles/blockui';
import { BaseStyle } from '@openng/optimus-ui/base';

const classes = {
    root: ({ instance }) => [
        'p-blockui p-blockui-mask',
        {
            'p-blockui-mask-document': !instance.target
        }
    ]
};

@Injectable()
export class BlockUiStyle extends BaseStyle {
    name = 'blockui';

    style = style;

    classes = classes;
}

/**
 *
 * BlockUI represents people using icons, labels and images.
 *
 * [Live Demo](https://optimus.openng.org/blockui)
 *
 * @module blockuistyle
 *
 */
export enum BlockUIClasses {
    /**
     * Class name of the root element
     */
    root = 'p-blockui'
}

export interface BlockUIStyle extends BaseStyle {}
