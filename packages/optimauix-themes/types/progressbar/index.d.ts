/**
 *
 * ProgressBar Design Tokens
 *
 * @module progressbar
 *
 */

import type { ColorScheme as CS, DesignTokens, ExtendedCSS, ExtendedTokens } from '..';

/**
 * Design Token Sections
 */
export declare namespace ProgressBarTokenSections {
    interface Root {
        /**
         * Background of root
         *
         * @designToken progressbar.background
         */
        background?: string;
        /**
         * Border radius of root
         *
         * @designToken progressbar.border.radius
         */
        borderRadius?: string;
        /**
         * Height of root
         *
         * @designToken progressbar.height
         */
        height?: string;
    }

    interface Value {
        /**
         * Background of value
         *
         * @designToken progressbar.value.background
         */
        background?: string;
    }

    interface Label {
        /**
         * Color of label
         *
         * @designToken progressbar.label.color
         */
        color?: string;
        /**
         * Font size of label
         *
         * @designToken progressbar.label.font.size
         */
        fontSize?: string;
        /**
         * Font weight of label
         *
         * @designToken progressbar.label.font.weight
         */
        fontWeight?: string;
    }

    /* Static Sections */
    type ColorScheme = CS<ProgressBarDesignTokens>;
    type CSS = ExtendedCSS;
    type Extend = ExtendedTokens;
}

/**
 *
 * _ProgressBar Design Tokens_
 *
 * @group components
 * @module progressbar
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
export interface ProgressBarDesignTokens extends DesignTokens<ProgressBarDesignTokens> {
    /**
     * Used to pass tokens of the root section
     */
    root?: ProgressBarTokenSections.Root;
    /**
     * Used to pass tokens of the value section
     */
    value?: ProgressBarTokenSections.Value;
    /**
     * Used to pass tokens of the label section
     */
    label?: ProgressBarTokenSections.Label;
}
