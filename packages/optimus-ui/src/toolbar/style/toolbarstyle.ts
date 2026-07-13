import { Injectable } from '@angular/core';
import { style } from '@openng/optimus-ui-styles/toolbar';
import { BaseStyle } from '@openng/optimus-ui/base';

const classes = {
    root: () => ['p-toolbar p-component'],
    start: 'p-toolbar-start',
    center: 'p-toolbar-center',
    end: 'p-toolbar-end'
};

@Injectable()
export class ToolbarStyle extends BaseStyle {
    name = 'toolbar';

    style = style;

    classes = classes;
}

/**
 *
 * Toolbar is a grouping component for buttons and other content.
 *
 * [Live Demo](https://optimus.openng.org/toolbar/)
 *
 * @module toolbarstyle
 *
 */
export enum ToolbarClasses {
    /**
     * Class name of the root element
     */
    root = 'p-toolbar',
    /**
     * Class name of the start element
     */
    start = 'p-toolbar-start',
    /**
     * Class name of the center element
     */
    center = 'p-toolbar-center',
    /**
     * Class name of the end element
     */
    end = 'p-toolbar-end'
}

export interface ToolbarStyle extends BaseStyle {}
