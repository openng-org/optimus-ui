import { Injectable } from '@angular/core';
import { BaseStyle } from '@openng/optimus-ui/base';

const classes = {
    root: ({ instance }) => [
        'p-stepitem',
        {
            'p-stepitem-active': instance.isActive()
        }
    ]
};

@Injectable()
export class StepItemStyle extends BaseStyle {
    name = 'stepitem';

    classes = classes;
}

/**
 *
 * Stepper is a component that streamlines a wizard-like workflow, organizing content into coherent steps and visually guiding users through a numbered progression in a multi-step process.
 *
 * [Live Demo](https://optimus.openng.org/stepper/)
 *
 * @module stepitemstyle
 *
 */
export enum StepItemClasses {
    /**
     * Class name of the root element
     */
    root = 'p-stepitem'
}

export interface StepItemStyle extends BaseStyle {}
