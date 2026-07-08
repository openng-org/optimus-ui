/**
 *
 * ContextMenu Design Tokens
 *
 * @module contextmenu
 *
 */

import type { ColorScheme as CS, DesignTokens, ExtendedCSS, ExtendedTokens } from '..';

/**
 * Design Token Sections
 */
export declare namespace ContextMenuTokenSections {
    interface Root {
        /**
         * Background of root
         *
         * @designToken contextmenu.background
         */
        background?: string;
        /**
         * Border color of root
         *
         * @designToken contextmenu.border.color
         */
        borderColor?: string;
        /**
         * Color of root
         *
         * @designToken contextmenu.color
         */
        color?: string;
        /**
         * Border radius of root
         *
         * @designToken contextmenu.border.radius
         */
        borderRadius?: string;
        /**
         * Shadow of root
         *
         * @designToken contextmenu.shadow
         */
        shadow?: string;
        /**
         * Transition duration of root
         *
         * @designToken contextmenu.transition.duration
         */
        transitionDuration?: string;
    }

    interface List {
        /**
         * Padding of list
         *
         * @designToken contextmenu.list.padding
         */
        padding?: string;
        /**
         * Gap of list
         *
         * @designToken contextmenu.list.gap
         */
        gap?: string;
    }

    interface Item {
        /**
         * Focus background of item
         *
         * @designToken contextmenu.item.focus.background
         */
        focusBackground?: string;
        /**
         * Active background of item
         *
         * @designToken contextmenu.item.active.background
         */
        activeBackground?: string;
        /**
         * Color of item
         *
         * @designToken contextmenu.item.color
         */
        color?: string;
        /**
         * Focus color of item
         *
         * @designToken contextmenu.item.focus.color
         */
        focusColor?: string;
        /**
         * Active color of item
         *
         * @designToken contextmenu.item.active.color
         */
        activeColor?: string;
        /**
         * Padding of item
         *
         * @designToken contextmenu.item.padding
         */
        padding?: string;
        /**
         * Border radius of item
         *
         * @designToken contextmenu.item.border.radius
         */
        borderRadius?: string;
        /**
         * Gap of item
         *
         * @designToken contextmenu.item.gap
         */
        gap?: string;
        /**
         * Icon of item
         */
        icon?: {
            /**
             * Icon color of item
             *
             * @designToken contextmenu.item.icon.color
             */
            color?: string;
            /**
             * Icon focus color of item
             *
             * @designToken contextmenu.item.icon.focus.color
             */
            focusColor?: string;
            /**
             * Icon active color of item
             *
             * @designToken contextmenu.item.icon.active.color
             */
            activeColor?: string;
        };
    }

    interface Submenu {
        /**
         * Mobile indent of submenu
         *
         * @designToken contextmenu.submenu.mobile.indent
         */
        mobileIndent?: string;
    }

    interface SubmenuIcon {
        /**
         * Size of submenu icon
         *
         * @designToken contextmenu.submenu.icon.size
         */
        size?: string;
        /**
         * Color of submenu icon
         *
         * @designToken contextmenu.submenu.icon.color
         */
        color?: string;
        /**
         * Focus color of submenu icon
         *
         * @designToken contextmenu.submenu.icon.focus.color
         */
        focusColor?: string;
        /**
         * Active color of submenu icon
         *
         * @designToken contextmenu.submenu.icon.active.color
         */
        activeColor?: string;
    }

    interface Separator {
        /**
         * Border color of separator
         *
         * @designToken contextmenu.separator.border.color
         */
        borderColor?: string;
    }

    /* Static Sections */
    type ColorScheme = CS<ContextMenuDesignTokens>;
    type CSS = ExtendedCSS;
    type Extend = ExtendedTokens;
}

/**
 *
 * _ContextMenu Design Tokens_
 *
 * @group components
 * @module contextmenu
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
export interface ContextMenuDesignTokens extends DesignTokens<ContextMenuDesignTokens> {
    /**
     * Used to pass tokens of the root section
     */
    root?: ContextMenuTokenSections.Root;
    /**
     * Used to pass tokens of the list section
     */
    list?: ContextMenuTokenSections.List;
    /**
     * Used to pass tokens of the item section
     */
    item?: ContextMenuTokenSections.Item;
    /**
     * Used to pass tokens of the submenu section
     */
    submenu?: ContextMenuTokenSections.Submenu;
    /**
     * Used to pass tokens of the submenu icon section
     */
    submenuIcon?: ContextMenuTokenSections.SubmenuIcon;
    /**
     * Used to pass tokens of the separator section
     */
    separator?: ContextMenuTokenSections.Separator;
}
