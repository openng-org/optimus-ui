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
 * [![PrimeNG](https://i.postimg.cc/63f7jVST/primeng-icon-24.png)](https://primeng.org/theming/styled)
 * [![PrimeVue](https://i.postimg.cc/cC1vVgyh/primevue-icon-24.png)](https://primevue.org/theming/styled)
 * --- ---
 * **Figma UI Kit**
 *
 * [PrimeNG](https://primeng.org/uikit) | [PrimeVue](https://primevue.org/uikit)
 *
 */
export interface SkeletonDesignTokens extends DesignTokens<SkeletonDesignTokens> {
    /**
     * Used to pass tokens of the root section
     */
    root?: SkeletonTokenSections.Root;
}
