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
 * [Optimus UI](https://optimus.openng.org/theming/styled)
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
