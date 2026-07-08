/**
 *
 * SpeedDial Design Tokens
 *
 * @module speeddial
 *
 */

import type { ColorScheme as CS, DesignTokens, ExtendedCSS, ExtendedTokens } from '..';

/**
 * Design Token Sections
 */
export declare namespace SpeedDialTokenSections {
    interface Root {
        /**
         * Gap of root
         *
         * @designToken speeddial.gap
         */
        gap?: string;
        /**
         * Transition duration of root
         *
         * @designToken speeddial.transition.duration
         */
        transitionDuration?: string;
    }

    /* Static Sections */
    type ColorScheme = CS<SpeedDialDesignTokens>;
    type CSS = ExtendedCSS;
    type Extend = ExtendedTokens;
}

/**
 *
 * _SpeedDial Design Tokens_
 *
 * @group components
 * @module speeddial
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
export interface SpeedDialDesignTokens extends DesignTokens<SpeedDialDesignTokens> {
    /**
     * Used to pass tokens of the root section
     */
    root?: SpeedDialTokenSections.Root;
}
