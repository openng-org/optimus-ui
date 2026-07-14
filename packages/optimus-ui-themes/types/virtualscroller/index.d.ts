/**
 *
 * VirtualScroller Design Tokens
 *
 * @module virtualscroller
 *
 */

import type { ColorScheme as CS, DesignTokens, ExtendedCSS, ExtendedTokens } from '..';

/**
 * Design Token Sections
 */
export declare namespace VirtualScrollerTokenSections {
    interface Loader {
        /**
         * Used to pass tokens of the mask section
         */
        mask?: {
            /**
             * Background of loader mask
             *
             * @designToken virtualscroller.loader.mask.background
             */
            background?: string;
            /**
             * Color of loader mask
             *
             * @designToken virtualscroller.loader.mask.color
             */
            color?: string;
        };
        /**
         * Used to pass tokens of the loader icon section
         */
        icon?: {
            /**
             * Size of the loader icon
             *
             * @designToken virtualscroller.loader.icon.size
             */
            size?: string;
        };
    }

    /* Static Sections */
    type ColorScheme = CS<VirtualScrollerDesignTokens>;
    type CSS = ExtendedCSS;
    type Extend = ExtendedTokens;
}

/**
 *
 * _VirtualScroller Design Tokens_
 *
 * @group components
 * @module virtualscroller
 * @see
 * --- ---
 * **Compatible Libraries**
 * 
 * [Optimus UI](https://optimus.openng.org/theming/styled)
 *
 */
export interface VirtualScrollerDesignTokens extends DesignTokens<VirtualScrollerDesignTokens> {
    /**
     * Used to pass tokens of the loader section
     */
    loader?: VirtualScrollerTokenSections.Loader;
}
