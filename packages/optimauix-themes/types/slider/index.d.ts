/**
 *
 * Slider Design Tokens
 *
 * @module slider
 *
 */

import type { ColorScheme as CS, DesignTokens, ExtendedCSS, ExtendedTokens } from '..';

/**
 * Design Token Sections
 */
export declare namespace SliderTokenSections {
    interface Root {
        /**
         * Transition duration of root
         *
         * @designToken slider.transition.duration
         */
        transitionDuration?: string;
    }

    interface Track {
        /**
         * Background of track
         *
         * @designToken slider.track.background
         */
        background?: string;
        /**
         * Border radius of track
         *
         * @designToken slider.track.border.radius
         */
        borderRadius?: string;
        /**
         * Size of track
         *
         * @designToken slider.track.size
         */
        size?: string;
    }

    interface Range {
        /**
         * Background of range
         *
         * @designToken slider.range.background
         */
        background?: string;
    }

    interface Handle {
        /**
         * Width of handle
         *
         * @designToken slider.handle.width
         */
        width?: string;
        /**
         * Height of handle
         *
         * @designToken slider.handle.height
         */
        height?: string;
        /**
         * Border radius of handle
         *
         * @designToken slider.handle.border.radius
         */
        borderRadius?: string;
        /**
         * Background of handle
         *
         * @designToken slider.handle.background
         */
        background?: string;
        /**
         * Hover background of handle
         *
         * @designToken slider.handle.hover.background
         */
        hoverBackground?: string;
        /**
         * Content of handle
         */
        content?: {
            /**
             * Content border radius of handle
             *
             * @designToken slider.handle.content.border.radius
             */
            borderRadius?: string;
            /**
             * Background of handle
             *
             * @designToken slider.handle.content.background
             */
            background?: string;
            /**
             * Content hover background of handle
             *
             * @designToken slider.handle.content.hover.background
             */
            hoverBackground?: string;
            /**
             * Content width of handle
             *
             * @designToken slider.handle.content.width
             */
            width?: string;
            /**
             * Content height of handle
             *
             * @designToken slider.handle.content.height
             */
            height?: string;
            /**
             * Content shadow of handle
             *
             * @designToken slider.handle.content.shadow
             */
            shadow?: string;
        };
        /**
         * Focus ring of handle
         */
        focusRing?: {
            /**
             * Focus ring width of handle
             *
             * @designToken slider.handle.focus.ring.width
             */
            width?: string;
            /**
             * Focus ring style of handle
             *
             * @designToken slider.handle.focus.ring.style
             */
            style?: string;
            /**
             * Focus ring color of handle
             *
             * @designToken slider.handle.focus.ring.color
             */
            color?: string;
            /**
             * Focus ring offset of handle
             *
             * @designToken slider.handle.focus.ring.offset
             */
            offset?: string;
            /**
             * Focus ring shadow of handle
             *
             * @designToken slider.handle.focus.ring.shadow
             */
            shadow?: string;
        };
    }

    /* Static Sections */
    type ColorScheme = CS<SliderDesignTokens>;
    type CSS = ExtendedCSS;
    type Extend = ExtendedTokens;
}

/**
 *
 * _Slider Design Tokens_
 *
 * @group components
 * @module slider
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
export interface SliderDesignTokens extends DesignTokens<SliderDesignTokens> {
    /**
     * Used to pass tokens of the root section
     */
    root?: SliderTokenSections.Root;
    /**
     * Used to pass tokens of the track section
     */
    track?: SliderTokenSections.Track;
    /**
     * Used to pass tokens of the range section
     */
    range?: SliderTokenSections.Range;
    /**
     * Used to pass tokens of the handle section
     */
    handle?: SliderTokenSections.Handle;
}
