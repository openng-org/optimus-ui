/**
 *
 * Textarea Design Tokens
 *
 * @module textarea
 *
 */

import type { ColorScheme as CS, DesignTokens, ExtendedCSS, ExtendedTokens } from '..';

/**
 * Design Token Sections
 */
export declare namespace TextareaTokenSections {
    interface Root {
        /**
         * Background of root
         *
         * @designToken textarea.background
         */
        background?: string;
        /**
         * Disabled background of root
         *
         * @designToken textarea.disabled.background
         */
        disabledBackground?: string;
        /**
         * Filled background of root
         *
         * @designToken textarea.filled.background
         */
        filledBackground?: string;
        /**
         * Filled hover background of root
         *
         * @designToken textarea.filled.hover.background
         */
        filledHoverBackground?: string;
        /**
         * Filled focus background of root
         *
         * @designToken textarea.filled.focus.background
         */
        filledFocusBackground?: string;
        /**
         * Border color of root
         *
         * @designToken textarea.border.color
         */
        borderColor?: string;
        /**
         * Hover border color of root
         *
         * @designToken textarea.hover.border.color
         */
        hoverBorderColor?: string;
        /**
         * Focus border color of root
         *
         * @designToken textarea.focus.border.color
         */
        focusBorderColor?: string;
        /**
         * Invalid border color of root
         *
         * @designToken textarea.invalid.border.color
         */
        invalidBorderColor?: string;
        /**
         * Color of root
         *
         * @designToken textarea.color
         */
        color?: string;
        /**
         * Disabled color of root
         *
         * @designToken textarea.disabled.color
         */
        disabledColor?: string;
        /**
         * Placeholder color of root
         *
         * @designToken textarea.placeholder.color
         */
        placeholderColor?: string;
        /**
         * Invalid placeholder color of root
         *
         * @designToken textarea.invalid.placeholder.color
         */
        invalidPlaceholderColor?: string;
        /**
         * Shadow of root
         *
         * @designToken textarea.shadow
         */
        shadow?: string;
        /**
         * Padding x of root
         *
         * @designToken textarea.padding.x
         */
        paddingX?: string;
        /**
         * Padding y of root
         *
         * @designToken textarea.padding.y
         */
        paddingY?: string;
        /**
         * Border radius of root
         *
         * @designToken textarea.border.radius
         */
        borderRadius?: string;
        /**
         * Focus ring of root
         */
        focusRing?: {
            /**
             * Focus ring width of root
             *
             * @designToken textarea.focus.ring.width
             */
            width?: string;
            /**
             * Focus ring style of root
             *
             * @designToken textarea.focus.ring.style
             */
            style?: string;
            /**
             * Focus ring color of root
             *
             * @designToken textarea.focus.ring.color
             */
            color?: string;
            /**
             * Focus ring offset of root
             *
             * @designToken textarea.focus.ring.offset
             */
            offset?: string;
            /**
             * Focus ring shadow of root
             *
             * @designToken textarea.focus.ring.shadow
             */
            shadow?: string;
        };
        /**
         * Transition duration of root
         *
         * @designToken textarea.transition.duration
         */
        transitionDuration?: string;
        /**
         * Sm of root
         */
        sm?: {
            /**
             * Sm font size of root
             *
             * @designToken textarea.sm.font.size
             */
            fontSize?: string;
            /**
             * Sm padding x of root
             *
             * @designToken textarea.sm.padding.x
             */
            paddingX?: string;
            /**
             * Sm padding y of root
             *
             * @designToken textarea.sm.padding.y
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
             * @designToken textarea.lg.font.size
             */
            fontSize?: string;
            /**
             * Lg padding x of root
             *
             * @designToken textarea.lg.padding.x
             */
            paddingX?: string;
            /**
             * Lg padding y of root
             *
             * @designToken textarea.lg.padding.y
             */
            paddingY?: string;
        };
    }

    /* Static Sections */
    type ColorScheme = CS<TextareaDesignTokens>;
    type CSS = ExtendedCSS;
    type Extend = ExtendedTokens;
}

/**
 *
 * _Textarea Design Tokens_
 *
 * @group components
 * @module textarea
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
export interface TextareaDesignTokens extends DesignTokens<TextareaDesignTokens> {
    /**
     * Used to pass tokens of the root section
     */
    root?: TextareaTokenSections.Root;
}
