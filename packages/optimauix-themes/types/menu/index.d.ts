/**
 *
 * Menu Design Tokens
 *
 * @module menu
 *
 */

import type { ColorScheme as CS, DesignTokens, ExtendedCSS, ExtendedTokens } from '..';

/**
 * Design Token Sections
 */
export declare namespace MenuTokenSections {
    interface Root {
        /**
         * Background of root
         *
         * @designToken menu.background
         */
        background?: string;
        /**
         * Border color of root
         *
         * @designToken menu.border.color
         */
        borderColor?: string;
        /**
         * Color of root
         *
         * @designToken menu.color
         */
        color?: string;
        /**
         * Border radius of root
         *
         * @designToken menu.border.radius
         */
        borderRadius?: string;
        /**
         * Shadow of root
         *
         * @designToken menu.shadow
         */
        shadow?: string;
        /**
         * Transition duration of root
         *
         * @designToken menu.transition.duration
         */
        transitionDuration?: string;
    }

    interface List {
        /**
         * Padding of list
         *
         * @designToken menu.list.padding
         */
        padding?: string;
        /**
         * Gap of list
         *
         * @designToken menu.list.gap
         */
        gap?: string;
    }

    interface Item {
        /**
         * Focus background of item
         *
         * @designToken menu.item.focus.background
         */
        focusBackground?: string;
        /**
         * Color of item
         *
         * @designToken menu.item.color
         */
        color?: string;
        /**
         * Focus color of item
         *
         * @designToken menu.item.focus.color
         */
        focusColor?: string;
        /**
         * Padding of item
         *
         * @designToken menu.item.padding
         */
        padding?: string;
        /**
         * Border radius of item
         *
         * @designToken menu.item.border.radius
         */
        borderRadius?: string;
        /**
         * Gap of item
         *
         * @designToken menu.item.gap
         */
        gap?: string;
        /**
         * Icon of item
         */
        icon?: {
            /**
             * Icon color of item
             *
             * @designToken menu.item.icon.color
             */
            color?: string;
            /**
             * Icon focus color of item
             *
             * @designToken menu.item.icon.focus.color
             */
            focusColor?: string;
        };
    }

    interface SubmenuLabel {
        /**
         * Padding of submenu label
         *
         * @designToken menu.submenu.label.padding
         */
        padding?: string;
        /**
         * Font weight of submenu label
         *
         * @designToken menu.submenu.label.font.weight
         */
        fontWeight?: string;
        /**
         * Background of submenu label
         *
         * @designToken menu.submenu.label.background
         */
        background?: string;
        /**
         * Color of submenu label
         *
         * @designToken menu.submenu.label.color
         */
        color?: string;
    }

    interface Separator {
        /**
         * Border color of separator
         *
         * @designToken menu.separator.border.color
         */
        borderColor?: string;
    }

    /* Static Sections */
    type ColorScheme = CS<MenuDesignTokens>;
    type CSS = ExtendedCSS;
    type Extend = ExtendedTokens;
}

/**
 *
 * _Menu Design Tokens_
 *
 * @group components
 * @module menu
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
export interface MenuDesignTokens extends DesignTokens<MenuDesignTokens> {
    /**
     * Used to pass tokens of the root section
     */
    root?: MenuTokenSections.Root;
    /**
     * Used to pass tokens of the list section
     */
    list?: MenuTokenSections.List;
    /**
     * Used to pass tokens of the item section
     */
    item?: MenuTokenSections.Item;
    /**
     * Used to pass tokens of the submenu label section
     */
    submenuLabel?: MenuTokenSections.SubmenuLabel;
    /**
     * Used to pass tokens of the separator section
     */
    separator?: MenuTokenSections.Separator;
}
