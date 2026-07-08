/**
 *
 * Dock Design Tokens
 *
 * @module dock
 *
 */

import type { ColorScheme as CS, DesignTokens, ExtendedCSS, ExtendedTokens } from '..';

/**
 * Design Token Sections
 */
export declare namespace DockTokenSections {
    interface Root {
        /**
         * Background of root
         *
         * @designToken dock.background
         */
        background?: string;
        /**
         * Border color of root
         *
         * @designToken dock.border.color
         */
        borderColor?: string;
        /**
         * Padding of root
         *
         * @designToken dock.padding
         */
        padding?: string;
        /**
         * Border radius of root
         *
         * @designToken dock.border.radius
         */
        borderRadius?: string;
    }

    interface Item {
        /**
         * Border radius of item
         *
         * @designToken dock.item.border.radius
         */
        borderRadius?: string;
        /**
         * Padding of item
         *
         * @designToken dock.item.padding
         */
        padding?: string;
        /**
         * Size of item
         *
         * @designToken dock.item.size
         */
        size?: string;
        /**
         * Focus ring of item
         */
        focusRing?: {
            /**
             * Focus ring width of item
             *
             * @designToken dock.item.focus.ring.width
             */
            width?: string;
            /**
             * Focus ring style of item
             *
             * @designToken dock.item.focus.ring.style
             */
            style?: string;
            /**
             * Focus ring color of item
             *
             * @designToken dock.item.focus.ring.color
             */
            color?: string;
            /**
             * Focus ring offset of item
             *
             * @designToken dock.item.focus.ring.offset
             */
            offset?: string;
            /**
             * Focus ring shadow of item
             *
             * @designToken dock.item.focus.ring.shadow
             */
            shadow?: string;
        };
    }

    /* Static Sections */
    type ColorScheme = CS<DockDesignTokens>;
    type CSS = ExtendedCSS;
    type Extend = ExtendedTokens;
}

/**
 *
 * _Dock Design Tokens_
 *
 * @group components
 * @module dock
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
export interface DockDesignTokens extends DesignTokens<DockDesignTokens> {
    /**
     * Used to pass tokens of the root section
     */
    root?: DockTokenSections.Root;
    /**
     * Used to pass tokens of the item section
     */
    item?: DockTokenSections.Item;
}
