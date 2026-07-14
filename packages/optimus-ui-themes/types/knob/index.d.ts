/**
 *
 * Knob Design Tokens
 *
 * @module knob
 *
 */

import type { ColorScheme as CS, DesignTokens, ExtendedCSS, ExtendedTokens } from '..';

/**
 * Design Token Sections
 */
export declare namespace KnobTokenSections {
    interface Root {
        /**
         * Transition duration of root
         *
         * @designToken knob.transition.duration
         */
        transitionDuration?: string;
        /**
         * Focus ring of root
         */
        focusRing?: {
            /**
             * Focus ring width of root
             *
             * @designToken knob.focus.ring.width
             */
            width?: string;
            /**
             * Focus ring style of root
             *
             * @designToken knob.focus.ring.style
             */
            style?: string;
            /**
             * Focus ring color of root
             *
             * @designToken knob.focus.ring.color
             */
            color?: string;
            /**
             * Focus ring offset of root
             *
             * @designToken knob.focus.ring.offset
             */
            offset?: string;
            /**
             * Focus ring shadow of root
             *
             * @designToken knob.focus.ring.shadow
             */
            shadow?: string;
        };
    }

    interface Value {
        /**
         * Background of value
         *
         * @designToken knob.value.background
         */
        background?: string;
    }

    interface Range {
        /**
         * Background of range
         *
         * @designToken knob.range.background
         */
        background?: string;
    }

    interface Text {
        /**
         * Color of text
         *
         * @designToken knob.text.color
         */
        color?: string;
    }

    /* Static Sections */
    type ColorScheme = CS<KnobDesignTokens>;
    type CSS = ExtendedCSS;
    type Extend = ExtendedTokens;
}

/**
 *
 * _Knob Design Tokens_
 *
 * @group components
 * @module knob
 * @see
 * --- ---
 * **Compatible Libraries**
 * 
 * [Optimus UI](https://optimus.openng.org/theming/styled)
 *
 */
export interface KnobDesignTokens extends DesignTokens<KnobDesignTokens> {
    /**
     * Used to pass tokens of the root section
     */
    root?: KnobTokenSections.Root;
    /**
     * Used to pass tokens of the value section
     */
    value?: KnobTokenSections.Value;
    /**
     * Used to pass tokens of the range section
     */
    range?: KnobTokenSections.Range;
    /**
     * Used to pass tokens of the text section
     */
    text?: KnobTokenSections.Text;
}
