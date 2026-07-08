/**
 *
 * InputChips Design Tokens
 *
 * @module inputchips
 *
 */

import type { ColorScheme as CS, DesignTokens, ExtendedCSS, ExtendedTokens } from '..';

/**
 * Design Token Sections
 */
export declare namespace InputChipsTokenSections {
    interface Root {
        /**
         * Background of root
         *
         * @designToken inputchips.background
         */
        background?: string;
        /**
         * Disabled background of root
         *
         * @designToken inputchips.disabled.background
         */
        disabledBackground?: string;
        /**
         * Filled background of root
         *
         * @designToken inputchips.filled.background
         */
        filledBackground?: string;
        /**
         * Filled focus background of root
         *
         * @designToken inputchips.filled.focus.background
         */
        filledFocusBackground?: string;
        /**
         * Border color of root
         *
         * @designToken inputchips.border.color
         */
        borderColor?: string;
        /**
         * Hover border color of root
         *
         * @designToken inputchips.hover.border.color
         */
        hoverBorderColor?: string;
        /**
         * Focus border color of root
         *
         * @designToken inputchips.focus.border.color
         */
        focusBorderColor?: string;
        /**
         * Invalid border color of root
         *
         * @designToken inputchips.invalid.border.color
         */
        invalidBorderColor?: string;
        /**
         * Color of root
         *
         * @designToken inputchips.color
         */
        color?: string;
        /**
         * Disabled color of root
         *
         * @designToken inputchips.disabled.color
         */
        disabledColor?: string;
        /**
         * Placeholder color of root
         *
         * @designToken inputchips.placeholder.color
         */
        placeholderColor?: string;
        /**
         * Shadow of root
         *
         * @designToken inputchips.shadow
         */
        shadow?: string;
        /**
         * Padding x of root
         *
         * @designToken inputchips.padding.x
         */
        paddingX?: string;
        /**
         * Padding y of root
         *
         * @designToken inputchips.padding.y
         */
        paddingY?: string;
        /**
         * Border radius of root
         *
         * @designToken inputchips.border.radius
         */
        borderRadius?: string;
        /**
         * Focus ring of root
         */
        focusRing?: {
            /**
             * Focus ring width of root
             *
             * @designToken inputchips.focus.ring.width
             */
            width?: string;
            /**
             * Focus ring style of root
             *
             * @designToken inputchips.focus.ring.style
             */
            style?: string;
            /**
             * Focus ring color of root
             *
             * @designToken inputchips.focus.ring.color
             */
            color?: string;
            /**
             * Focus ring offset of root
             *
             * @designToken inputchips.focus.ring.offset
             */
            offset?: string;
            /**
             * Focus ring shadow of root
             *
             * @designToken inputchips.focus.ring.shadow
             */
            shadow?: string;
        };
        /**
         * Transition duration of root
         *
         * @designToken inputchips.transition.duration
         */
        transitionDuration?: string;
    }

    interface Chip {
        /**
         * Border radius of chip
         *
         * @designToken inputchips.chip.border.radius
         */
        borderRadius?: string;
        /**
         * Focus background of chip
         *
         * @designToken inputchips.chip.focus.background
         */
        focusBackground?: string;
        /**
         * Color of chip
         *
         * @designToken inputchips.chip.color
         */
        color?: string;
    }

    /* Static Sections */
    type ColorScheme = CS<InputChipsDesignTokens>;
    type CSS = ExtendedCSS;
    type Extend = ExtendedTokens;
}

/**
 *
 * _InputChips Design Tokens_
 *
 * @group components
 * @module inputchips
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
export interface InputChipsDesignTokens extends DesignTokens<InputChipsDesignTokens> {
    /**
     * Used to pass tokens of the root section
     */
    root?: InputChipsTokenSections.Root;
    /**
     * Used to pass tokens of the chip section
     */
    chip?: InputChipsTokenSections.Chip;
}
