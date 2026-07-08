/**
 *
 * SelectButton Design Tokens
 *
 * @module selectbutton
 *
 */

import type { ColorScheme as CS, DesignTokens, ExtendedCSS, ExtendedTokens } from '..';

/**
 * Design Token Sections
 */
export declare namespace SelectButtonTokenSections {
    interface Root {
        /**
         * Border radius of root
         *
         * @designToken selectbutton.border.radius
         */
        borderRadius?: string;
        /**
         * Invalid border color of root
         *
         * @designToken selectbutton.invalid.border.color
         */
        invalidBorderColor?: string;
    }

    /* Static Sections */
    type ColorScheme = CS<SelectButtonDesignTokens>;
    type CSS = ExtendedCSS;
    type Extend = ExtendedTokens;
}

/**
 *
 * _SelectButton Design Tokens_
 *
 * @group components
 * @module selectbutton
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
export interface SelectButtonDesignTokens extends DesignTokens<SelectButtonDesignTokens> {
    /**
     * Used to pass tokens of the root section
     */
    root?: SelectButtonTokenSections.Root;
}
