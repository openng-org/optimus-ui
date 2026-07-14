/**
 *
 * Inplace Design Tokens
 *
 * @module inplace
 *
 */

import type { ColorScheme as CS, DesignTokens, ExtendedCSS, ExtendedTokens } from '..';

/**
 * Design Token Sections
 */
export declare namespace InplaceTokenSections {
    interface Root {
        /**
         * Padding of root
         *
         * @designToken inplace.padding
         */
        padding?: string;
        /**
         * Border radius of root
         *
         * @designToken inplace.border.radius
         */
        borderRadius?: string;
        /**
         * Focus ring of root
         */
        focusRing?: {
            /**
             * Focus ring width of root
             *
             * @designToken inplace.focus.ring.width
             */
            width?: string;
            /**
             * Focus ring style of root
             *
             * @designToken inplace.focus.ring.style
             */
            style?: string;
            /**
             * Focus ring color of root
             *
             * @designToken inplace.focus.ring.color
             */
            color?: string;
            /**
             * Focus ring offset of root
             *
             * @designToken inplace.focus.ring.offset
             */
            offset?: string;
            /**
             * Focus ring shadow of root
             *
             * @designToken inplace.focus.ring.shadow
             */
            shadow?: string;
        };
        /**
         * Transition duration of root
         *
         * @designToken inplace.transition.duration
         */
        transitionDuration?: string;
    }

    interface Display {
        /**
         * Hover background of display
         *
         * @designToken inplace.display.hover.background
         */
        hoverBackground?: string;
        /**
         * Hover color of display
         *
         * @designToken inplace.display.hover.color
         */
        hoverColor?: string;
    }

    /* Static Sections */
    type ColorScheme = CS<InplaceDesignTokens>;
    type CSS = ExtendedCSS;
    type Extend = ExtendedTokens;
}

/**
 *
 * _Inplace Design Tokens_
 *
 * @group components
 * @module inplace
 * @see
 * --- ---
 * **Compatible Libraries**
 * 
 * [Optimus UI](https://optimus.openng.org/theming/styled)
 *
 */
export interface InplaceDesignTokens extends DesignTokens<InplaceDesignTokens> {
    /**
     * Used to pass tokens of the root section
     */
    root?: InplaceTokenSections.Root;
    /**
     * Used to pass tokens of the display section
     */
    display?: InplaceTokenSections.Display;
}
