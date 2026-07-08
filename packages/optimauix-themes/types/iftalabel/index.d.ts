/**
 *
 * IftaLabel Design Tokens
 *
 * @module iftalabel
 *
 */

import type { ColorScheme as CS, DesignTokens, ExtendedCSS, ExtendedTokens } from '..';

/**
 * Design Token Sections
 */
export declare namespace IftaLabelTokenSections {
    interface Root {
        /**
         * Color of root
         *
         * @designToken iftalabel.color
         */
        color?: string;
        /**
         * Focus color of root
         *
         * @designToken iftalabel.focus.color
         */
        focusColor?: string;
        /**
         * Invalid color of root
         *
         * @designToken iftalabel.invalid.color
         */
        invalidColor?: string;
        /**
         * Transition duration of root
         *
         * @designToken iftalabel.transition.duration
         */
        transitionDuration?: string;
        /**
         * Position x of root
         *
         * @designToken iftalabel.position.x
         */
        positionX?: string;
        /**
         * Top of root
         *
         * @designToken iftalabel.top
         */
        top?: string;
        /**
         * Font size of root
         *
         * @designToken iftalabel.font.size
         */
        fontSize?: string;
        /**
         * Font weight of root
         *
         * @designToken iftalabel.font.weight
         */
        fontWeight?: string;
    }

    interface Input {
        /**
         * Padding top of input
         *
         * @designToken iftalabel.input.padding.top
         */
        paddingTop?: string;
        /**
         * Padding bottom of input
         *
         * @designToken iftalabel.input.padding.bottom
         */
        paddingBottom?: string;
    }

    /* Static Sections */
    type ColorScheme = CS<IftaLabelDesignTokens>;
    type CSS = ExtendedCSS;
    type Extend = ExtendedTokens;
}

/**
 *
 * _IftaLabel Design Tokens_
 *
 * @group components
 * @module iftalabel
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
export interface IftaLabelDesignTokens extends DesignTokens<IftaLabelDesignTokens> {
    /**
     * Used to pass tokens of the root section
     */
    root?: IftaLabelTokenSections.Root;
    /**
     * Used to pass tokens of the input section
     */
    input?: IftaLabelTokenSections.Input;
}
