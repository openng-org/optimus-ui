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
 * [![PrimeNG](https://i.postimg.cc/63f7jVST/primeng-icon-24.png)](https://primeng.org/theming/styled)
 * [![PrimeVue](https://i.postimg.cc/cC1vVgyh/primevue-icon-24.png)](https://primevue.org/theming/styled)
 * --- ---
 * **Figma UI Kit**
 *
 * [PrimeNG](https://primeng.org/uikit) | [PrimeVue](https://primevue.org/uikit)
 *
 */
export interface OverlayBadgeDesignTokens extends DesignTokens<OverlayBadgeDesignTokens> {
    /**
     * Used to pass tokens of the root section
     */
    root?: OverlayBadgeTokenSections.Root;
}
