/**
 *
 * MegaMenu Design Tokens
 *
 * @module megamenu
 *
 */

import type { ColorScheme as CS, DesignTokens, ExtendedCSS, ExtendedTokens } from '..';

/**
 * Design Token Sections
 */
export declare namespace MegaMenuTokenSections {
    interface Root {
        /**
         * Background of root
         *
         * @designToken megamenu.background
         */
        background?: string;
        /**
         * Border color of root
         *
         * @designToken megamenu.border.color
         */
        borderColor?: string;
        /**
         * Border radius of root
         *
         * @designToken megamenu.border.radius
         */
        borderRadius?: string;
        /**
         * Color of root
         *
         * @designToken megamenu.color
         */
        color?: string;
        /**
         * Gap of root
         *
         * @designToken megamenu.gap
         */
        gap?: string;
        /**
         * Vertical orientation of root
         */
        verticalOrientation?: {
            /**
             * Vertical orientation padding of root
             *
             * @designToken megamenu.vertical.orientation.padding
             */
            padding?: string;
            /**
             * Vertical orientation gap of root
             *
             * @designToken megamenu.vertical.orientation.gap
             */
            gap?: string;
        };
        /**
         * Horizontal orientation of root
         */
        horizontalOrientation?: {
            /**
             * Horizontal orientation padding of root
             *
             * @designToken megamenu.horizontal.orientation.padding
             */
            padding?: string;
            /**
             * Horizontal orientation gap of root
             *
             * @designToken megamenu.horizontal.orientation.gap
             */
            gap?: string;
        };
        /**
         * Transition duration of root
         *
         * @designToken megamenu.transition.duration
         */
        transitionDuration?: string;
    }

    interface BaseItem {
        /**
         * Border radius of base item
         *
         * @designToken megamenu.base.item.border.radius
         */
        borderRadius?: string;
        /**
         * Padding of base item
         *
         * @designToken megamenu.base.item.padding
         */
        padding?: string;
    }

    interface Item {
        /**
         * Focus background of item
         *
         * @designToken megamenu.item.focus.background
         */
        focusBackground?: string;
        /**
         * Active background of item
         *
         * @designToken megamenu.item.active.background
         */
        activeBackground?: string;
        /**
         * Color of item
         *
         * @designToken megamenu.item.color
         */
        color?: string;
        /**
         * Focus color of item
         *
         * @designToken megamenu.item.focus.color
         */
        focusColor?: string;
        /**
         * Active color of item
         *
         * @designToken megamenu.item.active.color
         */
        activeColor?: string;
        /**
         * Padding of item
         *
         * @designToken megamenu.item.padding
         */
        padding?: string;
        /**
         * Border radius of item
         *
         * @designToken megamenu.item.border.radius
         */
        borderRadius?: string;
        /**
         * Gap of item
         *
         * @designToken megamenu.item.gap
         */
        gap?: string;
        /**
         * Icon of item
         */
        icon?: {
            /**
             * Icon color of item
             *
             * @designToken megamenu.item.icon.color
             */
            color?: string;
            /**
             * Icon focus color of item
             *
             * @designToken megamenu.item.icon.focus.color
             */
            focusColor?: string;
            /**
             * Icon active color of item
             *
             * @designToken megamenu.item.icon.active.color
             */
            activeColor?: string;
        };
    }

    interface Overlay {
        /**
         * Padding of overlay
         *
         * @designToken megamenu.overlay.padding
         */
        padding?: string;
        /**
         * Background of overlay
         *
         * @designToken megamenu.overlay.background
         */
        background?: string;
        /**
         * Border color of overlay
         *
         * @designToken megamenu.overlay.border.color
         */
        borderColor?: string;
        /**
         * Border radius of overlay
         *
         * @designToken megamenu.overlay.border.radius
         */
        borderRadius?: string;
        /**
         * Color of overlay
         *
         * @designToken megamenu.overlay.color
         */
        color?: string;
        /**
         * Shadow of overlay
         *
         * @designToken megamenu.overlay.shadow
         */
        shadow?: string;
        /**
         * Gap of overlay
         *
         * @designToken megamenu.overlay.gap
         */
        gap?: string;
    }

    interface Submenu {
        /**
         * Padding of submenu
         *
         * @designToken megamenu.submenu.padding
         */
        padding?: string;
        /**
         * Gap of submenu
         *
         * @designToken megamenu.submenu.gap
         */
        gap?: string;
    }

    interface SubmenuLabel {
        /**
         * Padding of submenu label
         *
         * @designToken megamenu.submenu.label.padding
         */
        padding?: string;
        /**
         * Font weight of submenu label
         *
         * @designToken megamenu.submenu.label.font.weight
         */
        fontWeight?: string;
        /**
         * Background of submenu label
         *
         * @designToken megamenu.submenu.label.background
         */
        background?: string;
        /**
         * Color of submenu label
         *
         * @designToken megamenu.submenu.label.color
         */
        color?: string;
    }

    interface SubmenuIcon {
        /**
         * Size of submenu icon
         *
         * @designToken megamenu.submenu.icon.size
         */
        size?: string;
        /**
         * Color of submenu icon
         *
         * @designToken megamenu.submenu.icon.color
         */
        color?: string;
        /**
         * Focus color of submenu icon
         *
         * @designToken megamenu.submenu.icon.focus.color
         */
        focusColor?: string;
        /**
         * Active color of submenu icon
         *
         * @designToken megamenu.submenu.icon.active.color
         */
        activeColor?: string;
    }

    interface Separator {
        /**
         * Border color of separator
         *
         * @designToken megamenu.separator.border.color
         */
        borderColor?: string;
    }

    interface MobileButton {
        /**
         * Border radius of mobile button
         *
         * @designToken megamenu.mobile.button.border.radius
         */
        borderRadius?: string;
        /**
         * Size of mobile button
         *
         * @designToken megamenu.mobile.button.size
         */
        size?: string;
        /**
         * Color of mobile button
         *
         * @designToken megamenu.mobile.button.color
         */
        color?: string;
        /**
         * Hover color of mobile button
         *
         * @designToken megamenu.mobile.button.hover.color
         */
        hoverColor?: string;
        /**
         * Hover background of mobile button
         *
         * @designToken megamenu.mobile.button.hover.background
         */
        hoverBackground?: string;
        /**
         * Focus ring of mobile button
         */
        focusRing?: {
            /**
             * Focus ring width of mobile button
             *
             * @designToken megamenu.mobile.button.focus.ring.width
             */
            width?: string;
            /**
             * Focus ring style of mobile button
             *
             * @designToken megamenu.mobile.button.focus.ring.style
             */
            style?: string;
            /**
             * Focus ring color of mobile button
             *
             * @designToken megamenu.mobile.button.focus.ring.color
             */
            color?: string;
            /**
             * Focus ring offset of mobile button
             *
             * @designToken megamenu.mobile.button.focus.ring.offset
             */
            offset?: string;
            /**
             * Focus ring shadow of mobile button
             *
             * @designToken megamenu.mobile.button.focus.ring.shadow
             */
            shadow?: string;
        };
    }

    /* Static Sections */
    type ColorScheme = CS<MegaMenuDesignTokens>;
    type CSS = ExtendedCSS;
    type Extend = ExtendedTokens;
}

/**
 *
 * _MegaMenu Design Tokens_
 *
 * @group components
 * @module megamenu
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
export interface MegaMenuDesignTokens extends DesignTokens<MegaMenuDesignTokens> {
    /**
     * Used to pass tokens of the root section
     */
    root?: MegaMenuTokenSections.Root;
    /**
     * Used to pass tokens of the base item section
     */
    baseItem?: MegaMenuTokenSections.BaseItem;
    /**
     * Used to pass tokens of the item section
     */
    item?: MegaMenuTokenSections.Item;
    /**
     * Used to pass tokens of the overlay section
     */
    overlay?: MegaMenuTokenSections.Overlay;
    /**
     * Used to pass tokens of the submenu section
     */
    submenu?: MegaMenuTokenSections.Submenu;
    /**
     * Used to pass tokens of the submenu label section
     */
    submenuLabel?: MegaMenuTokenSections.SubmenuLabel;
    /**
     * Used to pass tokens of the submenu icon section
     */
    submenuIcon?: MegaMenuTokenSections.SubmenuIcon;
    /**
     * Used to pass tokens of the separator section
     */
    separator?: MegaMenuTokenSections.Separator;
    /**
     * Used to pass tokens of the mobile button section
     */
    mobileButton?: MegaMenuTokenSections.MobileButton;
}
