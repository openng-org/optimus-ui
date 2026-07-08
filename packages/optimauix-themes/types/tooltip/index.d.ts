/**
 *
 * Tooltip Design Tokens
 *
 * @module tooltip
 *
 */

import type { ColorScheme as CS, DesignTokens, ExtendedCSS, ExtendedTokens } from '..';

/**
 * Design Token Sections
 */
export declare namespace TooltipTokenSections {
    interface Root {
        /**
         * Max width of root
         *
         * @designToken tooltip.max.width
         */
        maxWidth?: string;
        /**
         * Gutter of root
         *
         * @designToken tooltip.gutter
         */
        gutter?: string;
        /**
         * Shadow of root
         *
         * @designToken tooltip.shadow
         */
        shadow?: string;
        /**
         * Padding of root
         *
         * @designToken tooltip.padding
         */
        padding?: string;
        /**
         * Border radius of root
         *
         * @designToken tooltip.border.radius
         */
        borderRadius?: string;
        /**
         * Background of root
         *
         * @designToken tooltip.background
         */
        background?: string;
        /**
         * Color of root
         *
         * @designToken tooltip.color
         */
        color?: string;
    }

    /* Static Sections */
    type ColorScheme = CS<TooltipDesignTokens>;
    type CSS = ExtendedCSS;
    type Extend = ExtendedTokens;
}

/**
 *
 * _Tooltip Design Tokens_
 *
 * @group components
 * @module tooltip
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
export interface TooltipDesignTokens extends DesignTokens<TooltipDesignTokens> {
    /**
     * Used to pass tokens of the root section
     */
    root?: TooltipTokenSections.Root;
}
