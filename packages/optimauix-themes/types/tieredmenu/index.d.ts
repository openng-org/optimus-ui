/**
 *
 * TieredMenu Design Tokens
 *
 * @module tieredmenu
 *
 */

import type { ColorScheme as CS, DesignTokens, ExtendedCSS, ExtendedTokens } from '..';

/**
 * Design Token Sections
 */
export declare namespace TieredMenuTokenSections {
    interface Root {
        /**
         * Background of root
         *
         * @designToken tieredmenu.background
         */
        background?: string;
        /**
         * Border color of root
         *
         * @designToken tieredmenu.border.color
         */
        borderColor?: string;
        /**
         * Color of root
         *
         * @designToken tieredmenu.color
         */
        color?: string;
        /**
         * Border radius of root
         *
         * @designToken tieredmenu.border.radius
         */
        borderRadius?: string;
        /**
         * Shadow of root
         *
         * @designToken tieredmenu.shadow
         */
        shadow?: string;
        /**
         * Transition duration of root
         *
         * @designToken tieredmenu.transition.duration
         */
        transitionDuration?: string;
    }

    interface List {
        /**
         * Padding of list
         *
         * @designToken tieredmenu.list.padding
         */
        padding?: string;
        /**
         * Gap of list
         *
         * @designToken tieredmenu.list.gap
         */
        gap?: string;
    }

    interface Item {
        /**
         * Focus background of item
         *
         * @designToken tieredmenu.item.focus.background
         */
        focusBackground?: string;
        /**
         * Active background of item
         *
         * @designToken tieredmenu.item.active.background
         */
        activeBackground?: string;
        /**
         * Color of item
         *
         * @designToken tieredmenu.item.color
         */
        color?: string;
        /**
         * Focus color of item
         *
         * @designToken tieredmenu.item.focus.color
         */
        focusColor?: string;
        /**
         * Active color of item
         *
         * @designToken tieredmenu.item.active.color
         */
        activeColor?: string;
        /**
         * Padding of item
         *
         * @designToken tieredmenu.item.padding
         */
        padding?: string;
        /**
         * Border radius of item
         *
         * @designToken tieredmenu.item.border.radius
         */
        borderRadius?: string;
        /**
         * Gap of item
         *
         * @designToken tieredmenu.item.gap
         */
        gap?: string;
        /**
         * Icon of item
         */
        icon?: {
            /**
             * Icon color of item
             *
             * @designToken tieredmenu.item.icon.color
             */
            color?: string;
            /**
             * Icon focus color of item
             *
             * @designToken tieredmenu.item.icon.focus.color
             */
            focusColor?: string;
            /**
             * Icon active color of item
             *
             * @designToken tieredmenu.item.icon.active.color
             */
            activeColor?: string;
        };
    }

    interface Submenu {
        /**
         * Mobile indent of submenu
         *
         * @designToken tieredmenu.submenu.mobile.indent
         */
        mobileIndent?: string;
    }

    interface SubmenuIcon {
        /**
         * Size of submenu icon
         *
         * @designToken tieredmenu.submenu.icon.size
         */
        size?: string;
        /**
         * Color of submenu icon
         *
         * @designToken tieredmenu.submenu.icon.color
         */
        color?: string;
        /**
         * Focus color of submenu icon
         *
         * @designToken tieredmenu.submenu.icon.focus.color
         */
        focusColor?: string;
        /**
         * Active color of submenu icon
         *
         * @designToken tieredmenu.submenu.icon.active.color
         */
        activeColor?: string;
    }

    interface Separator {
        /**
         * Border color of separator
         *
         * @designToken tieredmenu.separator.border.color
         */
        borderColor?: string;
    }

    /* Static Sections */
    type ColorScheme = CS<TieredMenuDesignTokens>;
    type CSS = ExtendedCSS;
    type Extend = ExtendedTokens;
}

/**
 *
 * _TieredMenu Design Tokens_
 *
 * @group components
 * @module tieredmenu
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
export interface TieredMenuDesignTokens extends DesignTokens<TieredMenuDesignTokens> {
    /**
     * Used to pass tokens of the root section
     */
    root?: TieredMenuTokenSections.Root;
    /**
     * Used to pass tokens of the list section
     */
    list?: TieredMenuTokenSections.List;
    /**
     * Used to pass tokens of the item section
     */
    item?: TieredMenuTokenSections.Item;
    /**
     * Used to pass tokens of the submenu section
     */
    submenu?: TieredMenuTokenSections.Submenu;
    /**
     * Used to pass tokens of the submenu icon section
     */
    submenuIcon?: TieredMenuTokenSections.SubmenuIcon;
    /**
     * Used to pass tokens of the separator section
     */
    separator?: TieredMenuTokenSections.Separator;
}
