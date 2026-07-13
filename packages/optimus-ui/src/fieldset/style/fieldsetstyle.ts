import { Injectable } from '@angular/core';
import { style } from '@openng/optimus-ui-styles/fieldset';
import { BaseStyle } from '@openng/optimus-ui/base';

const classes = {
    root: ({ instance }) => [
        'p-fieldset p-component',
        {
            'p-fieldset-toggleable': instance.toggleable,
            'p-fieldset-collapsed': instance.collapsed && instance.toggleable
        }
    ],
    legend: 'p-fieldset-legend',
    legendLabel: 'p-fieldset-legend-label',
    toggleButton: 'p-fieldset-toggle-button',
    toggleIcon: 'p-fieldset-toggle-icon',
    contentContainer: 'p-fieldset-content-container',
    contentWrapper: 'p-fieldset-content-wrapper',
    content: 'p-fieldset-content'
};

@Injectable()
export class FieldsetStyle extends BaseStyle {
    name = 'fieldset';

    style = style;

    classes = classes;
}

/**
 *
 * Fieldset is a grouping component with the optional content toggle feature.
 *
 * [Live Demo](https://optimus.openng.org/fieldset/)
 *
 * @module fieldsetstyle
 *
 */
export enum FieldsetClasses {
    /**
     * Class name of the root element
     */
    root = 'p-fieldset',
    /**
     * Class name of the legend element
     */
    legend = 'p-fieldset-legend',
    /**
     * Class name of the legend label element
     */
    legendLabel = 'p-fieldset-legend-label',
    /**
     * Class name of the toggle icon element
     */
    toggleIcon = 'p-fieldset-toggle-icon',
    /**
     * Class name of the content container element
     */
    contentContainer = 'p-fieldset-content-container',
    /**
     * Class name of the content wrapper element
     */
    contentWrapper = 'p-fieldset-content-wrapper',
    /**
     * Class name of the content element
     */
    content = 'p-fieldset-content'
}

export interface FieldsetStyle extends BaseStyle {}
