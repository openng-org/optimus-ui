/**
 *
 * Menubar Design Tokens
 *
 * @module menubar
 *
 */

import type { ColorScheme as CS, DesignTokens, ExtendedCSS, ExtendedTokens } from '..';

/**
 * Design Token Sections
 */
export declare namespace MenubarTokenSections {
    interface Root {
        /**
         * Background of root
         *
         * @designToken menubar.background
         */
        background?: string;
        /**
         * Border color of root
         *
         * @designToken menubar.border.color
         */
        borderColor?: string;
        /**
         * Border radius of root
         *
         * @designToken menubar.border.radius
         */
        borderRadius?: string;
        /**
         * Color of root
         *
         * @designToken menubar.color
         */
        color?: string;
        /**
         * Gap of root
         *
         * @designToken menubar.gap
         */
        gap?: string;
        /**
         * Padding of root
         *
         * @designToken menubar.padding
         */
        padding?: string;
        /**
         * Transition duration of root
         *
         * @designToken menubar.transition.duration
         */
        transitionDuration?: string;
    }

    interface BaseItem {
        /**
         * Border radius of base item
         *
         * @designToken menubar.base.item.border.radius
         */
        borderRadius?: string;
        /**
         * Padding of base item
         *
         * @designToken menubar.base.item.padding
         */
        padding?: string;
    }

    interface Item {
        /**
         * Focus background of item
         *
         * @designToken menubar.item.focus.background
         */
        focusBackground?: string;
        /**
         * Active background of item
         *
         * @designToken menubar.item.active.background
         */
        activeBackground?: string;
        /**
         * Color of item
         *
         * @designToken menubar.item.color
         */
        color?: string;
        /**
         * Focus color of item
         *
         * @designToken menubar.item.focus.color
         */
        focusColor?: string;
        /**
         * Active color of item
         *
         * @designToken menubar.item.active.color
         */
        activeColor?: string;
        /**
         * Padding of item
         *
         * @designToken menubar.item.padding
         */
        padding?: string;
        /**
         * Border radius of item
         *
         * @designToken menubar.item.border.radius
         */
        borderRadius?: string;
        /**
         * Gap of item
         *
         * @designToken menubar.item.gap
         */
        gap?: string;
        /**
         * Icon of item
         */
        icon?: {
            /**
             * Icon color of item
             *
             * @designToken menubar.item.icon.color
             */
            color?: string;
            /**
             * Icon focus color of item
             *
             * @designToken menubar.item.icon.focus.color
             */
            focusColor?: string;
            /**
             * Icon active color of item
             *
             * @designToken menubar.item.icon.active.color
             */
            activeColor?: string;
        };
    }

    interface Submenu {
        /**
         * Padding of submenu
         *
         * @designToken menubar.submenu.padding
         */
        padding?: string;
        /**
         * Gap of submenu
         *
         * @designToken menubar.submenu.gap
         */
        gap?: string;
        /**
         * Background of submenu
         *
         * @designToken menubar.submenu.background
         */
        background?: string;
        /**
         * Border color of submenu
         *
         * @designToken menubar.submenu.border.color
         */
        borderColor?: string;
        /**
         * Border radius of submenu
         *
         * @designToken menubar.submenu.border.radius
         */
        borderRadius?: string;
        /**
         * Shadow of submenu
         *
         * @designToken menubar.submenu.shadow
         */
        shadow?: string;
        /**
         * Mobile indent of submenu
         *
         * @designToken menubar.submenu.mobile.indent
         */
        mobileIndent?: string;
        /**
         * Icon of submenu
         */
        icon?: {
            /**
             * Icon size of submenu
             *
             * @designToken menubar.submenu.icon.size
             */
            size?: string;
            /**
             * Icon color of submenu
             *
             * @designToken menubar.submenu.icon.color
             */
            color?: string;
            /**
             * Icon focus color of submenu
             *
             * @designToken menubar.submenu.icon.focus.color
             */
            focusColor?: string;
            /**
             * Icon active color of submenu
             *
             * @designToken menubar.submenu.icon.active.color
             */
            activeColor?: string;
        };
    }

    interface Separator {
        /**
         * Border color of separator
         *
         * @designToken menubar.separator.border.color
         */
        borderColor?: string;
    }

    interface MobileButton {
        /**
         * Border radius of mobile button
         *
         * @designToken menubar.mobile.button.border.radius
         */
        borderRadius?: string;
        /**
         * Size of mobile button
         *
         * @designToken menubar.mobile.button.size
         */
        size?: string;
        /**
         * Color of mobile button
         *
         * @designToken menubar.mobile.button.color
         */
        color?: string;
        /**
         * Hover color of mobile button
         *
         * @designToken menubar.mobile.button.hover.color
         */
        hoverColor?: string;
        /**
         * Hover background of mobile button
         *
         * @designToken menubar.mobile.button.hover.background
         */
        hoverBackground?: string;
        /**
         * Focus ring of mobile button
         */
        focusRing?: {
            /**
             * Focus ring width of mobile button
             *
             * @designToken menubar.mobile.button.focus.ring.width
             */
            width?: string;
            /**
             * Focus ring style of mobile button
             *
             * @designToken menubar.mobile.button.focus.ring.style
             */
            style?: string;
            /**
             * Focus ring color of mobile button
             *
             * @designToken menubar.mobile.button.focus.ring.color
             */
            color?: string;
            /**
             * Focus ring offset of mobile button
             *
             * @designToken menubar.mobile.button.focus.ring.offset
             */
            offset?: string;
            /**
             * Focus ring shadow of mobile button
             *
             * @designToken menubar.mobile.button.focus.ring.shadow
             */
            shadow?: string;
        };
    }

    /* Static Sections */
    type ColorScheme = CS<MenubarDesignTokens>;
    type CSS = ExtendedCSS;
    type Extend = ExtendedTokens;
}

/**
 *
 * _Menubar Design Tokens_
 *
 * @group components
 * @module menubar
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
export interface MenubarDesignTokens extends DesignTokens<MenubarDesignTokens> {
    /**
     * Used to pass tokens of the root section
     */
    root?: MenubarTokenSections.Root;
    /**
     * Used to pass tokens of the base item section
     */
    baseItem?: MenubarTokenSections.BaseItem;
    /**
     * Used to pass tokens of the item section
     */
    item?: MenubarTokenSections.Item;
    /**
     * Used to pass tokens of the submenu section
     */
    submenu?: MenubarTokenSections.Submenu;
    /**
     * Used to pass tokens of the separator section
     */
    separator?: MenubarTokenSections.Separator;
    /**
     * Used to pass tokens of the mobile button section
     */
    mobileButton?: MenubarTokenSections.MobileButton;
}
