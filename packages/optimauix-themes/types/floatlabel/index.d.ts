/**
 *
 * FloatLabel Design Tokens
 *
 * @module floatlabel
 *
 */

import type { ColorScheme as CS, DesignTokens, ExtendedCSS, ExtendedTokens } from '..';

/**
 * Design Token Sections
 */
export declare namespace FloatLabelTokenSections {
    interface Root {
        /**
         * Color of root
         *
         * @designToken floatlabel.color
         */
        color?: string;
        /**
         * Focus color of root
         *
         * @designToken floatlabel.focus.color
         */
        focusColor?: string;
        /**
         * Active color of root
         *
         * @designToken floatlabel.active.color
         */
        activeColor?: string;
        /**
         * Invalid color of root
         *
         * @designToken floatlabel.invalid.color
         */
        invalidColor?: string;
        /**
         * Transition duration of root
         *
         * @designToken floatlabel.transition.duration
         */
        transitionDuration?: string;
        /**
         * Position x of root
         *
         * @designToken floatlabel.position.x
         */
        positionX?: string;
        /**
         * Position y of root
         *
         * @designToken floatlabel.position.y
         */
        positionY?: string;
        /**
         * Font weight of root
         *
         * @designToken floatlabel.font.weight
         */
        fontWeight?: string;
        /**
         * Active of root
         */
        active?: {
            /**
             * Active font size of root
             *
             * @designToken floatlabel.active.font.size
             */
            fontSize?: string;
            /**
             * Active font weight of root
             *
             * @designToken floatlabel.active.font.weight
             */
            fontWeight?: string;
        };
    }

    interface Over {
        /**
         * Active of over
         */
        active?: {
            /**
             * Active top of over
             *
             * @designToken floatlabel.over.active.top
             */
            top?: string;
        };
    }

    interface In {
        /**
         * Input of in
         */
        input?: {
            /**
             * Input padding top of in
             *
             * @designToken floatlabel.in.input.padding.top
             */
            paddingTop?: string;
            /**
             * Input padding bottom of in
             *
             * @designToken floatlabel.in.input.padding.bottom
             */
            paddingBottom?: string;
        };
        /**
         * Active of in
         */
        active?: {
            /**
             * Active top of in
             *
             * @designToken floatlabel.in.active.top
             */
            top?: string;
        };
    }

    interface On {
        /**
         * Border radius of on
         *
         * @designToken floatlabel.on.border.radius
         */
        borderRadius?: string;
        /**
         * Active of on
         */
        active?: {
            /**
             * Active background of on
             *
             * @designToken floatlabel.on.active.background
             */
            background?: string;
            /**
             * Active padding of on
             *
             * @designToken floatlabel.on.active.padding
             */
            padding?: string;
        };
    }

    /* Static Sections */
    type ColorScheme = CS<FloatLabelDesignTokens>;
    type CSS = ExtendedCSS;
    type Extend = ExtendedTokens;
}

/**
 *
 * _FloatLabel Design Tokens_
 *
 * @group components
 * @module floatlabel
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
export interface FloatLabelDesignTokens extends DesignTokens<FloatLabelDesignTokens> {
    /**
     * Used to pass tokens of the root section
     */
    root?: FloatLabelTokenSections.Root;
    /**
     * Used to pass tokens of the over section
     */
    over?: FloatLabelTokenSections.Over;
    /**
     * Used to pass tokens of the in section
     */
    in?: FloatLabelTokenSections.In;
    /**
     * Used to pass tokens of the on section
     */
    on?: FloatLabelTokenSections.On;
}
