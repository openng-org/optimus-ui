/**
 *
 * InputGroup Design Tokens
 *
 * @module inputgroup
 *
 */

import type { ColorScheme as CS, DesignTokens, ExtendedCSS, ExtendedTokens } from '..';

/**
 * Design Token Sections
 */
export declare namespace InputGroupTokenSections {
    interface Addon {
        /**
         * Background of addon
         *
         * @designToken inputgroup.addon.background
         */
        background?: string;
        /**
         * Border color of addon
         *
         * @designToken inputgroup.addon.border.color
         */
        borderColor?: string;
        /**
         * Color of addon
         *
         * @designToken inputgroup.addon.color
         */
        color?: string;
        /**
         * Border radius of addon
         *
         * @designToken inputgroup.addon.border.radius
         */
        borderRadius?: string;
        /**
         * Padding of addon
         *
         * @designToken inputgroup.addon.padding
         */
        padding?: string;
        /**
         * Min width of addon
         *
         * @designToken inputgroup.addon.min.width
         */
        minWidth?: string;
    }

    /* Static Sections */
    type ColorScheme = CS<InputGroupDesignTokens>;
    type CSS = ExtendedCSS;
    type Extend = ExtendedTokens;
}

/**
 *
 * _InputGroup Design Tokens_
 *
 * @group components
 * @module inputgroup
 * @see
 * --- ---
 * **Compatible Libraries**
 * 
 * [Optimus UI](https://optimus.openng.org/theming/styled)
 *
 */
export interface InputGroupDesignTokens extends DesignTokens<InputGroupDesignTokens> {
    /**
     * Used to pass tokens of the addon section
     */
    addon?: InputGroupTokenSections.Addon;
}
