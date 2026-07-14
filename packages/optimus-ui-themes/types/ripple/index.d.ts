/**
 *
 * Ripple Design Tokens
 *
 * @module ripple
 *
 */

import type { ColorScheme as CS, DesignTokens, ExtendedCSS, ExtendedTokens } from '..';

/**
 * Design Token Sections
 */
export declare namespace RippleTokenSections {
    interface Root {
        /**
         * Background of root
         *
         * @designToken ripple.background
         */
        background?: string;
    }

    /* Static Sections */
    type ColorScheme = CS<RippleDesignTokens>;
    type CSS = ExtendedCSS;
    type Extend = ExtendedTokens;
}

/**
 *
 * _Ripple Design Tokens_
 *
 * @group components
 * @module ripple
 * @see
 * --- ---
 * **Compatible Libraries**
 * 
 * [Optimus UI](https://optimus.openng.org/theming/styled)
 *
 */
export interface RippleDesignTokens extends DesignTokens<RippleDesignTokens> {
    /**
     * Used to pass tokens of the root section
     */
    root?: RippleTokenSections.Root;
}
