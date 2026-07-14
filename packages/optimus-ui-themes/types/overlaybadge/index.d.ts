/**
 *
 * OverlayBadge Design Tokens
 *
 * @module overlaybadge
 *
 */

import type { ColorScheme as CS, DesignTokens, ExtendedCSS, ExtendedTokens } from '..';

/**
 * Design Token Sections
 */
export declare namespace OverlayBadgeTokenSections {
    interface Root {
        /**
         * Outline of root
         */
        outline?: {
            /**
             * Outline width of root
             *
             * @designToken overlaybadge.outline.width
             */
            width?: string;
            /**
             * Outline color of root
             *
             * @designToken overlaybadge.outline.color
             */
            color?: string;
        };
    }

    /* Static Sections */
    type ColorScheme = CS<OverlayBadgeDesignTokens>;
    type CSS = ExtendedCSS;
    type Extend = ExtendedTokens;
}

/**
 *
 * _OverlayBadge Design Tokens_
 *
 * @group components
 * @module overlaybadge
 * @see
 * --- ---
 * **Compatible Libraries**
 * 
 * [Optimus UI](https://optimus.openng.org/theming/styled)
 *
 */
export interface OverlayBadgeDesignTokens extends DesignTokens<OverlayBadgeDesignTokens> {
    /**
     * Used to pass tokens of the root section
     */
    root?: OverlayBadgeTokenSections.Root;
}
