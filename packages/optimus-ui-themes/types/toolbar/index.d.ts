/**
 *
 * Toolbar Design Tokens
 *
 * @module toolbar
 *
 */

import type { ColorScheme as CS, DesignTokens, ExtendedCSS, ExtendedTokens } from '..';

/**
 * Design Token Sections
 */
export declare namespace ToolbarTokenSections {
    interface Root {
        /**
         * Background of root
         *
         * @designToken toolbar.background
         */
        background?: string;
        /**
         * Border color of root
         *
         * @designToken toolbar.border.color
         */
        borderColor?: string;
        /**
         * Border radius of root
         *
         * @designToken toolbar.border.radius
         */
        borderRadius?: string;
        /**
         * Color of root
         *
         * @designToken toolbar.color
         */
        color?: string;
        /**
         * Gap of root
         *
         * @designToken toolbar.gap
         */
        gap?: string;
        /**
         * Padding of root
         *
         * @designToken toolbar.padding
         */
        padding?: string;
    }

    /* Static Sections */
    type ColorScheme = CS<ToolbarDesignTokens>;
    type CSS = ExtendedCSS;
    type Extend = ExtendedTokens;
}

/**
 *
 * _Toolbar Design Tokens_
 *
 * @group components
 * @module toolbar
 * @see
 * --- ---
 * **Compatible Libraries**
 *
 * [Optimus UI](https://optimus.openng.org/theming/styled)
 *
 */
export interface ToolbarDesignTokens extends DesignTokens<ToolbarDesignTokens> {
    /**
     * Used to pass tokens of the root section
     */
    root?: ToolbarTokenSections.Root;
}
