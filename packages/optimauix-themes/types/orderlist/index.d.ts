/**
 *
 * OrderList Design Tokens
 *
 * @module orderlist
 *
 */

import type { ColorScheme as CS, DesignTokens, ExtendedCSS, ExtendedTokens } from '..';

/**
 * Design Token Sections
 */
export declare namespace OrderListTokenSections {
    interface Root {
        /**
         * Gap of root
         *
         * @designToken orderlist.gap
         */
        gap?: string;
    }

    interface Controls {
        /**
         * Gap of controls
         *
         * @designToken orderlist.controls.gap
         */
        gap?: string;
    }

    /* Static Sections */
    type ColorScheme = CS<OrderListDesignTokens>;
    type CSS = ExtendedCSS;
    type Extend = ExtendedTokens;
}

/**
 *
 * _OrderList Design Tokens_
 *
 * @group components
 * @module orderlist
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
export interface OrderListDesignTokens extends DesignTokens<OrderListDesignTokens> {
    /**
     * Used to pass tokens of the root section
     */
    root?: OrderListTokenSections.Root;
    /**
     * Used to pass tokens of the controls section
     */
    controls?: OrderListTokenSections.Controls;
}
