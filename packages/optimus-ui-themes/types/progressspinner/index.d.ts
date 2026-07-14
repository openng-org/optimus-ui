/**
 *
 * ProgressSpinner Design Tokens
 *
 * @module progressspinner
 *
 */

import type { ColorScheme as CS, DesignTokens, ExtendedCSS, ExtendedTokens } from '..';

/**
 * Design Token Sections
 */
export declare namespace ProgressSpinnerTokenSections {
    interface Root {
        /**
         * Color one of root
         *
         * @designToken progressspinner.color.one
         */
        colorOne?: string;
        /**
         * Color two of root
         *
         * @designToken progressspinner.color.two
         */
        colorTwo?: string;
        /**
         * Color three of root
         *
         * @designToken progressspinner.color.three
         */
        colorThree?: string;
        /**
         * Color four of root
         *
         * @designToken progressspinner.color.four
         */
        colorFour?: string;
    }

    /* Static Sections */
    type ColorScheme = CS<ProgressSpinnerDesignTokens>;
    type CSS = ExtendedCSS;
    type Extend = ExtendedTokens;
}

/**
 *
 * _ProgressSpinner Design Tokens_
 *
 * @group components
 * @module progressspinner
 * @see
 * --- ---
 * **Compatible Libraries**
 *
 * [Optimus UI](https://optimus.openng.org/theming/styled)
 *
 */
export interface ProgressSpinnerDesignTokens extends DesignTokens<ProgressSpinnerDesignTokens> {
    /**
     * Used to pass tokens of the root section
     */
    root?: ProgressSpinnerTokenSections.Root;
}
