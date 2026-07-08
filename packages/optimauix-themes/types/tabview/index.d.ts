/**
 *
 * TabView Design Tokens
 *
 * @module tabview
 *
 */

import type { ColorScheme as CS, DesignTokens, ExtendedCSS, ExtendedTokens } from '..';

/**
 * Design Token Sections
 */
export declare namespace TabViewTokenSections {
    interface Root {
        /**
         * Transition duration of root
         *
         * @designToken tabview.transition.duration
         */
        transitionDuration?: string;
    }

    interface TabList {
        /**
         * Background of tab list
         *
         * @designToken tabview.tab.list.background
         */
        background?: string;
        /**
         * Border color of tab list
         *
         * @designToken tabview.tab.list.border.color
         */
        borderColor?: string;
    }

    interface Tab {
        /**
         * Border color of tab
         *
         * @designToken tabview.tab.border.color
         */
        borderColor?: string;
        /**
         * Active border color of tab
         *
         * @designToken tabview.tab.active.border.color
         */
        activeBorderColor?: string;
        /**
         * Color of tab
         *
         * @designToken tabview.tab.color
         */
        color?: string;
        /**
         * Hover color of tab
         *
         * @designToken tabview.tab.hover.color
         */
        hoverColor?: string;
        /**
         * Active color of tab
         *
         * @designToken tabview.tab.active.color
         */
        activeColor?: string;
    }

    interface TabPanel {
        /**
         * Background of tab panel
         *
         * @designToken tabview.tab.panel.background
         */
        background?: string;
        /**
         * Color of tab panel
         *
         * @designToken tabview.tab.panel.color
         */
        color?: string;
    }

    interface NavButton {
        /**
         * Background of nav button
         *
         * @designToken tabview.nav.button.background
         */
        background?: string;
        /**
         * Color of nav button
         *
         * @designToken tabview.nav.button.color
         */
        color?: string;
        /**
         * Hover color of nav button
         *
         * @designToken tabview.nav.button.hover.color
         */
        hoverColor?: string;
        /**
         * Shadow of nav button
         *
         * @designToken tabview.nav.button.shadow
         */
        shadow?: string;
    }

    /* Static Sections */
    type ColorScheme = CS<TabViewDesignTokens>;
    type CSS = ExtendedCSS;
    type Extend = ExtendedTokens;
}

/**
 *
 * _TabView Design Tokens_
 *
 * @group components
 * @module tabview
 * @see
 * --- ---
 * **Compatible Libraries**
 *
 * [![PrimeNG](https://i.postimg.cc/63f7jVST/primeng-icon-24.png)](https://primeng.org/theming/styled)
 * [![PrimeVue](https://i.postimg.cc/cC1vVgyh/primevue-icon-24.png)](https://primevue.org/theming/styled)
 * --- ---
 * **Figma UI Kit**
 *
 * [PrimeNG](https://primeng.org/uikit) | [PrimeVue](https://primevue.org/uikit)
 *
 */
export interface TabViewDesignTokens extends DesignTokens<TabViewDesignTokens> {
    /**
     * Used to pass tokens of the root section
     */
    root?: TabViewTokenSections.Root;
    /**
     * Used to pass tokens of the tab list section
     */
    tabList?: TabViewTokenSections.TabList;
    /**
     * Used to pass tokens of the tab section
     */
    tab?: TabViewTokenSections.Tab;
    /**
     * Used to pass tokens of the tab panel section
     */
    tabPanel?: TabViewTokenSections.TabPanel;
    /**
     * Used to pass tokens of the nav button section
     */
    navButton?: TabViewTokenSections.NavButton;
}
