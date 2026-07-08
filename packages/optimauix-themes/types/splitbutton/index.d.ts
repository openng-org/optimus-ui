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
 * [![PrimeNG](https://i.postimg.cc/63f7jVST/primeng-icon-24.png)](https://primeng.org/theming/styled)
 * [![PrimeVue](https://i.postimg.cc/cC1vVgyh/primevue-icon-24.png)](https://primevue.org/theming/styled)
 * --- ---
 * **Figma UI Kit**
 *
 * [PrimeNG](https://primeng.org/uikit) | [PrimeVue](https://primevue.org/uikit)
 *
 */
export interface SplitButtonDesignTokens extends DesignTokens<SplitButtonDesignTokens> {
    /**
     * Used to pass tokens of the root section
     */
    root?: SplitButtonTokenSections.Root;
}
