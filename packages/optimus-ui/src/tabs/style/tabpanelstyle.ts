import { Injectable } from '@angular/core';
import { BaseStyle } from '@openng/optimus-ui/base';

const classes = {
    root: ({ instance }) => [
        'p-tabpanel',
        {
            'p-tabpanel-active': instance.active()
        }
    ]
};

@Injectable()
export class TabPanelStyle extends BaseStyle {
    name = 'tabpanel';

    classes = classes;
}

/**
 *
 * Tab is a helper component for Tabs component.
 *
 * [Live Demo](https://optimus.openng.org/tabs/)
 *
 * @module tabstyle
 *
 */

export enum TabPanelClasses {
    /**
     * Class name of the root element
     */
    root = 'p-tabpanel'
}

export interface TabPanelStyle extends BaseStyle {}
