/**
 *
 * Checkbox Design Tokens
 *
 * @module checkbox
 *
 */

import type { ColorScheme as CS, DesignTokens, ExtendedCSS, ExtendedTokens } from '..';

/**
 * Design Token Sections
 */
export declare namespace CheckboxTokenSections {
    interface Root {
        /**
         * Border radius of root
         *
         * @designToken checkbox.border.radius
         */
        borderRadius?: string;
        /**
         * Width of root
         *
         * @designToken checkbox.width
         */
        width?: string;
        /**
         * Height of root
         *
         * @designToken checkbox.height
         */
        height?: string;
        /**
         * Background of root
         *
         * @designToken checkbox.background
         */
        background?: string;
        /**
         * Checked background of root
         *
         * @designToken checkbox.checked.background
         */
        checkedBackground?: string;
        /**
         * Checked hover background of root
         *
         * @designToken checkbox.checked.hover.background
         */
        checkedHoverBackground?: string;
        /**
         * Disabled background of root
         *
         * @designToken checkbox.disabled.background
         */
        disabledBackground?: string;
        /**
         * Filled background of root
         *
         * @designToken checkbox.filled.background
         */
        filledBackground?: string;
        /**
         * Border color of root
         *
         * @designToken checkbox.border.color
         */
        borderColor?: string;
        /**
         * Hover border color of root
         *
         * @designToken checkbox.hover.border.color
         */
        hoverBorderColor?: string;
        /**
         * Focus border color of root
         *
         * @designToken checkbox.focus.border.color
         */
        focusBorderColor?: string;
        /**
         * Checked border color of root
         *
         * @designToken checkbox.checked.border.color
         */
        checkedBorderColor?: string;
        /**
         * Checked hover border color of root
         *
         * @designToken checkbox.checked.hover.border.color
         */
        checkedHoverBorderColor?: string;
        /**
         * Checked focus border color of root
         *
         * @designToken checkbox.checked.focus.border.color
         */
        checkedFocusBorderColor?: string;
        /**
         * Checked disabled border color of root
         *
         * @designToken checkbox.checked.disabled.border.color
         */
        checkedDisabledBorderColor?: string;
        /**
         * Invalid border color of root
         *
         * @designToken checkbox.invalid.border.color
         */
        invalidBorderColor?: string;
        /**
         * Shadow of root
         *
         * @designToken checkbox.shadow
         */
        shadow?: string;
        /**
         * Focus ring of root
         */
        focusRing?: {
            /**
             * Focus ring width of root
             *
             * @designToken checkbox.focus.ring.width
             */
            width?: string;
            /**
             * Focus ring style of root
             *
             * @designToken checkbox.focus.ring.style
             */
            style?: string;
            /**
             * Focus ring color of root
             *
             * @designToken checkbox.focus.ring.color
             */
            color?: string;
            /**
             * Focus ring offset of root
             *
             * @designToken checkbox.focus.ring.offset
             */
            offset?: string;
            /**
             * Focus ring shadow of root
             *
             * @designToken checkbox.focus.ring.shadow
             */
            shadow?: string;
        };
        /**
         * Transition duration of root
         *
         * @designToken checkbox.transition.duration
         */
        transitionDuration?: string;
        /**
         * Sm of root
         */
        sm?: {
            /**
             * Sm width of root
             *
             * @designToken checkbox.sm.width
             */
            width?: string;
            /**
             * Sm height of root
             *
             * @designToken checkbox.sm.height
             */
            height?: string;
        };
        /**
         * Lg of root
         */
        lg?: {
            /**
             * Lg width of root
             *
             * @designToken checkbox.lg.width
             */
            width?: string;
            /**
             * Lg height of root
             *
             * @designToken checkbox.lg.height
             */
            height?: string;
        };
    }

    interface Icon {
        /**
         * Size of icon
         *
         * @designToken checkbox.icon.size
         */
        size?: string;
        /**
         * Color of icon
         *
         * @designToken checkbox.icon.color
         */
        color?: string;
        /**
         * Checked color of icon
         *
         * @designToken checkbox.icon.checked.color
         */
        checkedColor?: string;
        /**
         * Checked hover color of icon
         *
         * @designToken checkbox.icon.checked.hover.color
         */
        checkedHoverColor?: string;
        /**
         * Disabled color of icon
         *
         * @designToken checkbox.icon.disabled.color
         */
        disabledColor?: string;
        /**
         * Sm of icon
         */
        sm?: {
            /**
             * Sm size of icon
             *
             * @designToken checkbox.icon.sm.size
             */
            size?: string;
        };
        /**
         * Lg of icon
         */
        lg?: {
            /**
             * Lg size of icon
             *
             * @designToken checkbox.icon.lg.size
             */
            size?: string;
        };
    }

    /* Static Sections */
    type ColorScheme = CS<CheckboxDesignTokens>;
    type CSS = ExtendedCSS;
    type Extend = ExtendedTokens;
}

/**
 *
 * _Checkbox Design Tokens_
 *
 * @group components
 * @module checkbox
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
export interface CheckboxDesignTokens extends DesignTokens<CheckboxDesignTokens> {
    /**
     * Used to pass tokens of the root section
     */
    root?: CheckboxTokenSections.Root;
    /**
     * Used to pass tokens of the icon section
     */
    icon?: CheckboxTokenSections.Icon;
}
