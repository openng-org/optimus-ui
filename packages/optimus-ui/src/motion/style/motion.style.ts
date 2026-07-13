import { Injectable } from '@angular/core';
import { BaseStyle } from '@openng/optimus-ui/base';

const style = /*css*/ `
    .p-motion {
        display: block;
    }
`;

const classes = {
    root: 'p-motion'
};

@Injectable()
export class MotionStyle extends BaseStyle {
    name = 'motion';

    style = style;

    classes = classes;
}

/**
 *
 * Motion and MotionDirective provide an easy way to add motion effects to Angular applications.
 *
 * [Live Demo](https://optimus.openng.org/motion)
 *
 * @module motionstyle
 *
 */
export enum MotionClasses {
    /**
     * Class name of the root element
     */
    root = 'p-motion'
}

export interface MotionStyle extends BaseStyle {}
