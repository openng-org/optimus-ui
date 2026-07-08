/**
 *
 * PickList Design Tokens
 *
 * @module picklist
 *
 */

import type { ColorScheme as CS, DesignTokens, ExtendedCSS, ExtendedTokens } from '..';

/**
 * Design Token Sections
 */
export declare namespace PickListTokenSections {
    interface Root {
        /**
         * Gap of root
         *
         * @designToken picklist.gap
         */
        gap?: string;
    }

    interface Controls {
        /**
         * Gap of controls
         *
         * @designToken picklist.controls.gap
         */
        gap?: string;
    }

    /* Static Sections */
    type ColorScheme = CS<PickListDesignTokens>;
    type CSS = ExtendedCSS;
    type Extend = ExtendedTokens;
}

/**
 *
 * _PickList Design Tokens_
 *
 * @group components
 * @module picklist
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
export interface PickListDesignTokens extends DesignTokens<PickListDesignTokens> {
    /**
     * Used to pass tokens of the root section
     */
    root?: PickListTokenSections.Root;
    /**
     * Used to pass tokens of the controls section
     */
    controls?: PickListTokenSections.Controls;
}
