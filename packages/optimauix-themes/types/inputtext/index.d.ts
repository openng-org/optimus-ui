/**
 *
 * InputText Design Tokens
 *
 * @module inputtext
 *
 */

import type { ColorScheme as CS, DesignTokens, ExtendedCSS, ExtendedTokens } from '..';

/**
 * Design Token Sections
 */
export declare namespace InputTextTokenSections {
    interface Root {
        /**
         * Background of root
         *
         * @designToken inputtext.background
         */
        background?: string;
        /**
         * Disabled background of root
         *
         * @designToken inputtext.disabled.background
         */
        disabledBackground?: string;
        /**
         * Filled background of root
         *
         * @designToken inputtext.filled.background
         */
        filledBackground?: string;
        /**
         * Filled hover background of root
         *
         * @designToken inputtext.filled.hover.background
         */
        filledHoverBackground?: string;
        /**
         * Filled focus background of root
         *
         * @designToken inputtext.filled.focus.background
         */
        filledFocusBackground?: string;
        /**
         * Border color of root
         *
         * @designToken inputtext.border.color
         */
        borderColor?: string;
        /**
         * Hover border color of root
         *
         * @designToken inputtext.hover.border.color
         */
        hoverBorderColor?: string;
        /**
         * Focus border color of root
         *
         * @designToken inputtext.focus.border.color
         */
        focusBorderColor?: string;
        /**
         * Invalid border color of root
         *
         * @designToken inputtext.invalid.border.color
         */
        invalidBorderColor?: string;
        /**
         * Color of root
         *
         * @designToken inputtext.color
         */
        color?: string;
        /**
         * Disabled color of root
         *
         * @designToken inputtext.disabled.color
         */
        disabledColor?: string;
        /**
         * Placeholder color of root
         *
         * @designToken inputtext.placeholder.color
         */
        placeholderColor?: string;
        /**
         * Invalid placeholder color of root
         *
         * @designToken inputtext.invalid.placeholder.color
         */
        invalidPlaceholderColor?: string;
        /**
         * Shadow of root
         *
         * @designToken inputtext.shadow
         */
        shadow?: string;
        /**
         * Padding x of root
         *
         * @designToken inputtext.padding.x
         */
        paddingX?: string;
        /**
         * Padding y of root
         *
         * @designToken inputtext.padding.y
         */
        paddingY?: string;
        /**
         * Border radius of root
         *
         * @designToken inputtext.border.radius
         */
        borderRadius?: string;
        /**
         * Focus ring of root
         */
        focusRing?: {
            /**
             * Focus ring width of root
             *
             * @designToken inputtext.focus.ring.width
             */
            width?: string;
            /**
             * Focus ring style of root
             *
             * @designToken inputtext.focus.ring.style
             */
            style?: string;
            /**
             * Focus ring color of root
             *
             * @designToken inputtext.focus.ring.color
             */
            color?: string;
            /**
             * Focus ring offset of root
             *
             * @designToken inputtext.focus.ring.offset
             */
            offset?: string;
            /**
             * Focus ring shadow of root
             *
             * @designToken inputtext.focus.ring.shadow
             */
            shadow?: string;
        };
        /**
         * Transition duration of root
         *
         * @designToken inputtext.transition.duration
         */
        transitionDuration?: string;
        /**
         * Sm of root
         */
        sm?: {
            /**
             * Sm font size of root
             *
             * @designToken inputtext.sm.font.size
             */
            fontSize?: string;
            /**
             * Sm padding x of root
             *
             * @designToken inputtext.sm.padding.x
             */
            paddingX?: string;
            /**
             * Sm padding y of root
             *
             * @designToken inputtext.sm.padding.y
             */
            paddingY?: string;
        };
        /**
         * Lg of root
         */
        lg?: {
            /**
             * Lg font size of root
             *
             * @designToken inputtext.lg.font.size
             */
            fontSize?: string;
            /**
             * Lg padding x of root
             *
             * @designToken inputtext.lg.padding.x
             */
            paddingX?: string;
            /**
             * Lg padding y of root
             *
             * @designToken inputtext.lg.padding.y
             */
            paddingY?: string;
        };
    }

    /* Static Sections */
    type ColorScheme = CS<InputTextDesignTokens>;
    type CSS = ExtendedCSS;
    type Extend = ExtendedTokens;
}

/**
 *
 * _InputText Design Tokens_
 *
 * @group components
 * @module inputtext
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
export interface InputTextDesignTokens extends DesignTokens<InputTextDesignTokens> {
    /**
     * Used to pass tokens of the root section
     */
    root?: InputTextTokenSections.Root;
}
