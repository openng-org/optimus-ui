/**
 *
 * ColorPicker Design Tokens
 *
 * @module colorpicker
 *
 */

import type { ColorScheme as CS, DesignTokens, ExtendedCSS, ExtendedTokens } from '..';

/**
 * Design Token Sections
 */
export declare namespace ColorPickerTokenSections {
    interface Root {
        /**
         * Transition duration of root
         *
         * @designToken colorpicker.transition.duration
         */
        transitionDuration?: string;
    }

    interface Preview {
        /**
         * Width of preview
         *
         * @designToken colorpicker.preview.width
         */
        width?: string;
        /**
         * Height of preview
         *
         * @designToken colorpicker.preview.height
         */
        height?: string;
        /**
         * Border radius of preview
         *
         * @designToken colorpicker.preview.border.radius
         */
        borderRadius?: string;
        /**
         * Focus ring of preview
         */
        focusRing?: {
            /**
             * Focus ring width of preview
             *
             * @designToken colorpicker.preview.focus.ring.width
             */
            width?: string;
            /**
             * Focus ring style of preview
             *
             * @designToken colorpicker.preview.focus.ring.style
             */
            style?: string;
            /**
             * Focus ring color of preview
             *
             * @designToken colorpicker.preview.focus.ring.color
             */
            color?: string;
            /**
             * Focus ring offset of preview
             *
             * @designToken colorpicker.preview.focus.ring.offset
             */
            offset?: string;
            /**
             * Focus ring shadow of preview
             *
             * @designToken colorpicker.preview.focus.ring.shadow
             */
            shadow?: string;
        };
    }

    interface Panel {
        /**
         * Shadow of panel
         *
         * @designToken colorpicker.panel.shadow
         */
        shadow?: string;
        /**
         * Border radius of panel
         *
         * @designToken colorpicker.panel.border.radius
         */
        borderRadius?: string;
        /**
         * Background of panel
         *
         * @designToken colorpicker.panel.background
         */
        background?: string;
        /**
         * Border color of panel
         *
         * @designToken colorpicker.panel.border.color
         */
        borderColor?: string;
    }

    interface Handle {
        /**
         * Color of handle
         *
         * @designToken colorpicker.handle.color
         */
        color?: string;
    }

    /* Static Sections */
    type ColorScheme = CS<ColorPickerDesignTokens>;
    type CSS = ExtendedCSS;
    type Extend = ExtendedTokens;
}

/**
 *
 * _ColorPicker Design Tokens_
 *
 * @group components
 * @module colorpicker
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
export interface ColorPickerDesignTokens extends DesignTokens<ColorPickerDesignTokens> {
    /**
     * Used to pass tokens of the root section
     */
    root?: ColorPickerTokenSections.Root;
    /**
     * Used to pass tokens of the preview section
     */
    preview?: ColorPickerTokenSections.Preview;
    /**
     * Used to pass tokens of the panel section
     */
    panel?: ColorPickerTokenSections.Panel;
    /**
     * Used to pass tokens of the handle section
     */
    handle?: ColorPickerTokenSections.Handle;
}
