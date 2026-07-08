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
 * [![PrimeNG](https://i.postimg.cc/63f7jVST/primeng-icon-24.png)](https://primeng.org/theming/styled)
 * [![PrimeVue](https://i.postimg.cc/cC1vVgyh/primevue-icon-24.png)](https://primevue.org/theming/styled)
 * --- ---
 * **Figma UI Kit**
 *
 * [PrimeNG](https://primeng.org/uikit) | [PrimeVue](https://primevue.org/uikit)
 *
 */
export interface VirtualScrollerDesignTokens extends DesignTokens<VirtualScrollerDesignTokens> {
    /**
     * Used to pass tokens of the loader section
     */
    loader?: VirtualScrollerTokenSections.Loader;
}
