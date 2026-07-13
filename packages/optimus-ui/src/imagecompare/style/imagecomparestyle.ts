import { Injectable } from '@angular/core';
import { style } from '@openng/optimus-ui-styles/imagecompare';
import { BaseStyle } from '@openng/optimus-ui/base';

const classes = {
    root: 'p-imagecompare',
    slider: 'p-imagecompare-slider'
};

@Injectable()
export class ImageCompareStyle extends BaseStyle {
    name = 'imagecompare';

    style = style;

    classes = classes;
}

/**
 *
 * ImageCompare compares two images side by side with a slider.
 *
 * [Live Demo](https://optimus.openng.org/imagecompare/)
 *
 * @module imagecomparestyle
 *
 */
export enum ImageCompareClasses {
    /**
     * Class name of the root element
     */
    root = 'p-imagecompare',
    /**
     * Class name of the slider element
     */
    slider = 'p-imagecompare-slider'
}
export interface ImageCompareStyle extends BaseStyle {}
