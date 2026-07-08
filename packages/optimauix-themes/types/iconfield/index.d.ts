/**
 *
 * IconField Design Tokens
 *
 * @module iconfield
 *
 */

import type { ColorScheme as CS, DesignTokens, ExtendedCSS, ExtendedTokens } from '..';

/**
 * Design Token Sections
 */
export declare namespace IconFieldTokenSections {
    interface Icon {
        /**
         * Color of icon
         *
         * @designToken iconfield.icon.color
         */
        color?: string;
    }

    /* Static Sections */
    type ColorScheme = CS<IconFieldDesignTokens>;
    type CSS = ExtendedCSS;
    type Extend = ExtendedTokens;
}

/**
 *
 * _IconField Design Tokens_
 *
 * @group components
 * @module iconfield
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
export interface IconFieldDesignTokens extends DesignTokens<IconFieldDesignTokens> {
    /**
     * Used to pass tokens of the icon section
     */
    icon?: IconFieldTokenSections.Icon;
}
