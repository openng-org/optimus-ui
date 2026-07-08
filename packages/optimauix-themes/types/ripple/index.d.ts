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
 * [![PrimeNG](https://i.postimg.cc/63f7jVST/primeng-icon-24.png)](https://primeng.org/theming/styled)
 * [![PrimeVue](https://i.postimg.cc/cC1vVgyh/primevue-icon-24.png)](https://primevue.org/theming/styled)
 * --- ---
 * **Figma UI Kit**
 *
 * [PrimeNG](https://primeng.org/uikit) | [PrimeVue](https://primevue.org/uikit)
 *
 */
export interface RippleDesignTokens extends DesignTokens<RippleDesignTokens> {
    /**
     * Used to pass tokens of the root section
     */
    root?: RippleTokenSections.Root;
}
