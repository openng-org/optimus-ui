/**
 *
 * Divider Design Tokens
 *
 * @module divider
 *
 */

import type { ColorScheme as CS, DesignTokens, ExtendedCSS, ExtendedTokens } from '..';

/**
 * Design Token Sections
 */
export declare namespace DividerTokenSections {
    interface Root {
        /**
         * Border color of root
         *
         * @designToken divider.border.color
         */
        borderColor?: string;
    }

    interface Content {
        /**
         * Background of content
         *
         * @designToken divider.content.background
         */
        background?: string;
        /**
         * Color of content
         *
         * @designToken divider.content.color
         */
        color?: string;
    }

    interface Horizontal {
        /**
         * Margin of horizontal
         *
         * @designToken divider.horizontal.margin
         */
        margin?: string;
        /**
         * Padding of horizontal
         *
         * @designToken divider.horizontal.padding
         */
        padding?: string;
        /**
         * Content of horizontal
         */
        content?: {
            /**
             * Content padding of horizontal
             *
             * @designToken divider.horizontal.content.padding
             */
            padding?: string;
        };
    }

    interface Vertical {
        /**
         * Margin of vertical
         *
         * @designToken divider.vertical.margin
         */
        margin?: string;
        /**
         * Padding of vertical
         *
         * @designToken divider.vertical.padding
         */
        padding?: string;
        /**
         * Content of vertical
         */
        content?: {
            /**
             * Content padding of vertical
             *
             * @designToken divider.vertical.content.padding
             */
            padding?: string;
        };
    }

    /* Static Sections */
    type ColorScheme = CS<DividerDesignTokens>;
    type CSS = ExtendedCSS;
    type Extend = ExtendedTokens;
}

/**
 *
 * _Divider Design Tokens_
 *
 * @group components
 * @module divider
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
export interface DividerDesignTokens extends DesignTokens<DividerDesignTokens> {
    /**
     * Used to pass tokens of the root section
     */
    root?: DividerTokenSections.Root;
    /**
     * Used to pass tokens of the content section
     */
    content?: DividerTokenSections.Content;
    /**
     * Used to pass tokens of the horizontal section
     */
    horizontal?: DividerTokenSections.Horizontal;
    /**
     * Used to pass tokens of the vertical section
     */
    vertical?: DividerTokenSections.Vertical;
}
