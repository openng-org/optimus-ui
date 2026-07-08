/**
 *
 * ToggleSwitch Design Tokens
 *
 * @module toggleswitch
 *
 */

import type { ColorScheme as CS, DesignTokens, ExtendedCSS, ExtendedTokens } from '..';

/**
 * Design Token Sections
 */
export declare namespace ToggleSwitchTokenSections {
    interface Root {
        /**
         * Width of root
         *
         * @designToken toggleswitch.width
         */
        width?: string;
        /**
         * Height of root
         *
         * @designToken toggleswitch.height
         */
        height?: string;
        /**
         * Border radius of root
         *
         * @designToken toggleswitch.border.radius
         */
        borderRadius?: string;
        /**
         * Gap of root
         *
         * @designToken toggleswitch.gap
         */
        gap?: string;
        /**
         * Shadow of root
         *
         * @designToken toggleswitch.shadow
         */
        shadow?: string;
        /**
         * Focus ring of root
         */
        focusRing?: {
            /**
             * Focus ring width of root
             *
             * @designToken toggleswitch.focus.ring.width
             */
            width?: string;
            /**
             * Focus ring style of root
             *
             * @designToken toggleswitch.focus.ring.style
             */
            style?: string;
            /**
             * Focus ring color of root
             *
             * @designToken toggleswitch.focus.ring.color
             */
            color?: string;
            /**
             * Focus ring offset of root
             *
             * @designToken toggleswitch.focus.ring.offset
             */
            offset?: string;
            /**
             * Focus ring shadow of root
             *
             * @designToken toggleswitch.focus.ring.shadow
             */
            shadow?: string;
        };
        /**
         * Border width of root
         *
         * @designToken toggleswitch.border.width
         */
        borderWidth?: string;
        /**
         * Border color of root
         *
         * @designToken toggleswitch.border.color
         */
        borderColor?: string;
        /**
         * Hover border color of root
         *
         * @designToken toggleswitch.hover.border.color
         */
        hoverBorderColor?: string;
        /**
         * Checked border color of root
         *
         * @designToken toggleswitch.checked.border.color
         */
        checkedBorderColor?: string;
        /**
         * Checked hover border color of root
         *
         * @designToken toggleswitch.checked.hover.border.color
         */
        checkedHoverBorderColor?: string;
        /**
         * Invalid border color of root
         *
         * @designToken toggleswitch.invalid.border.color
         */
        invalidBorderColor?: string;
        /**
         * Transition duration of root
         *
         * @designToken toggleswitch.transition.duration
         */
        transitionDuration?: string;
        /**
         * Slide duration of root
         *
         * @designToken toggleswitch.slide.duration
         */
        slideDuration?: string;
        /**
         * Background of root
         *
         * @designToken toggleswitch.background
         */
        background?: string;
        /**
         * Disabled background of root
         *
         * @designToken toggleswitch.disabled.background
         */
        disabledBackground?: string;
        /**
         * Hover background of root
         *
         * @designToken toggleswitch.hover.background
         */
        hoverBackground?: string;
        /**
         * Checked background of root
         *
         * @designToken toggleswitch.checked.background
         */
        checkedBackground?: string;
        /**
         * Checked hover background of root
         *
         * @designToken toggleswitch.checked.hover.background
         */
        checkedHoverBackground?: string;
    }

    interface Handle {
        /**
         * Border radius of handle
         *
         * @designToken toggleswitch.handle.border.radius
         */
        borderRadius?: string;
        /**
         * Size of handle
         *
         * @designToken toggleswitch.handle.size
         */
        size?: string;
        /**
         * Background of handle
         *
         * @designToken toggleswitch.handle.background
         */
        background?: string;
        /**
         * Disabled background of handle
         *
         * @designToken toggleswitch.handle.disabled.background
         */
        disabledBackground?: string;
        /**
         * Hover background of handle
         *
         * @designToken toggleswitch.handle.hover.background
         */
        hoverBackground?: string;
        /**
         * Checked background of handle
         *
         * @designToken toggleswitch.handle.checked.background
         */
        checkedBackground?: string;
        /**
         * Checked hover background of handle
         *
         * @designToken toggleswitch.handle.checked.hover.background
         */
        checkedHoverBackground?: string;
        /**
         * Color of handle
         *
         * @designToken toggleswitch.handle.color
         */
        color?: string;
        /**
         * Hover color of handle
         *
         * @designToken toggleswitch.handle.hover.color
         */
        hoverColor?: string;
        /**
         * Checked color of handle
         *
         * @designToken toggleswitch.handle.checked.color
         */
        checkedColor?: string;
        /**
         * Checked hover color of handle
         *
         * @designToken toggleswitch.handle.checked.hover.color
         */
        checkedHoverColor?: string;
    }

    /* Static Sections */
    type ColorScheme = CS<ToggleSwitchDesignTokens>;
    type CSS = ExtendedCSS;
    type Extend = ExtendedTokens;
}

/**
 *
 * _ToggleSwitch Design Tokens_
 *
 * @group components
 * @module toggleswitch
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
export interface ToggleSwitchDesignTokens extends DesignTokens<ToggleSwitchDesignTokens> {
    /**
     * Used to pass tokens of the root section
     */
    root?: ToggleSwitchTokenSections.Root;
    /**
     * Used to pass tokens of the handle section
     */
    handle?: ToggleSwitchTokenSections.Handle;
}
