/**
 *
 * Skeleton Design Tokens
 *
 * @module skeleton
 *
 */

import type { ColorScheme as CS, DesignTokens, ExtendedCSS, ExtendedTokens } from '..';

/**
 * Design Token Sections
 */
export declare namespace SkeletonTokenSections {
    interface Root {
        /**
         * Border radius of root
         *
         * @designToken skeleton.border.radius
         */
        borderRadius?: string;
        /**
         * Background of root
         *
         * @designToken skeleton.background
         */
        background?: string;
        /**
         * Animation background of root
         *
         * @designToken skeleton.animation.background
         */
        animationBackground?: string;
    }

    /* Static Sections */
    type ColorScheme = CS<SkeletonDesignTokens>;
    type CSS = ExtendedCSS;
    type Extend = ExtendedTokens;
}

/**
 *
 * _Skeleton Design Tokens_
 *
 * @group components
 * @module skeleton
 * @see
 * --- ---
 * **Compatible Libraries**
 * 
 * [Optimus UI](https://optimus.openng.org/theming/styled)
 *
 */
export interface SkeletonDesignTokens extends DesignTokens<SkeletonDesignTokens> {
    /**
     * Used to pass tokens of the root section
     */
    root?: SkeletonTokenSections.Root;
}
