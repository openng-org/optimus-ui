/**
 *
 * SplitButton Design Tokens
 *
 * @module splitbutton
 *
 */

import type { ColorScheme as CS, DesignTokens, ExtendedCSS, ExtendedTokens } from '..';

/**
 * Design Token Sections
 */
export declare namespace SplitButtonTokenSections {
    interface Root {
        /**
         * Border radius of root
         *
         * @designToken splitbutton.border.radius
         */
        borderRadius?: string;
        /**
         * Rounded border radius of root
         *
         * @designToken splitbutton.rounded.border.radius
         */
        roundedBorderRadius?: string;
        /**
         * Raised shadow of root
         *
         * @designToken splitbutton.raised.shadow
         */
        raisedShadow?: string;
    }

    /* Static Sections */
    type ColorScheme = CS<SplitButtonDesignTokens>;
    type CSS = ExtendedCSS;
    type Extend = ExtendedTokens;
}

/**
 *
 * _SplitButton Design Tokens_
 *
 * @group components
 * @module splitbutton
 * @see
 * --- ---
 * **Compatible Libraries**
 *
 * [Optimus UI](https://optimus.openng.org/theming/styled)
 *
 */
export interface SplitButtonDesignTokens extends DesignTokens<SplitButtonDesignTokens> {
    /**
     * Used to pass tokens of the root section
     */
    root?: SplitButtonTokenSections.Root;
}
