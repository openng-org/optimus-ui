/**
 *
 * InputNumber Design Tokens
 *
 * @module inputnumber
 *
 */

import type { ColorScheme as CS, DesignTokens, ExtendedCSS, ExtendedTokens } from '..';

/**
 * Design Token Sections
 */
export declare namespace InputNumberTokenSections {
    interface Root {
        /**
         * Transition duration of root
         *
         * @designToken inputnumber.transition.duration
         */
        transitionDuration?: string;
    }

    interface Button {
        /**
         * Width of button
         *
         * @designToken inputnumber.button.width
         */
        width?: string;
        /**
         * Border radius of button
         *
         * @designToken inputnumber.button.border.radius
         */
        borderRadius?: string;
        /**
         * Vertical padding of button
         *
         * @designToken inputnumber.button.vertical.padding
         */
        verticalPadding?: string;
        /**
         * Background of button
         *
         * @designToken inputnumber.button.background
         */
        background?: string;
        /**
         * Hover background of button
         *
         * @designToken inputnumber.button.hover.background
         */
        hoverBackground?: string;
        /**
         * Active background of button
         *
         * @designToken inputnumber.button.active.background
         */
        activeBackground?: string;
        /**
         * Border color of button
         *
         * @designToken inputnumber.button.border.color
         */
        borderColor?: string;
        /**
         * Hover border color of button
         *
         * @designToken inputnumber.button.hover.border.color
         */
        hoverBorderColor?: string;
        /**
         * Active border color of button
         *
         * @designToken inputnumber.button.active.border.color
         */
        activeBorderColor?: string;
        /**
         * Color of button
         *
         * @designToken inputnumber.button.color
         */
        color?: string;
        /**
         * Hover color of button
         *
         * @designToken inputnumber.button.hover.color
         */
        hoverColor?: string;
        /**
         * Active color of button
         *
         * @designToken inputnumber.button.active.color
         */
        activeColor?: string;
    }

    /* Static Sections */
    type ColorScheme = CS<InputNumberDesignTokens>;
    type CSS = ExtendedCSS;
    type Extend = ExtendedTokens;
}

/**
 *
 * _InputNumber Design Tokens_
 *
 * @group components
 * @module inputnumber
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
export interface InputNumberDesignTokens extends DesignTokens<InputNumberDesignTokens> {
    /**
     * Used to pass tokens of the root section
     */
    root?: InputNumberTokenSections.Root;
    /**
     * Used to pass tokens of the button section
     */
    button?: InputNumberTokenSections.Button;
}
