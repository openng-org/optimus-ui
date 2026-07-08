/**
 *
 * Carousel Design Tokens
 *
 * @module carousel
 *
 */

import type { ColorScheme as CS, DesignTokens, ExtendedCSS, ExtendedTokens } from '..';

/**
 * Design Token Sections
 */
export declare namespace CarouselTokenSections {
    interface Root {
        /**
         * Transition duration of root
         *
         * @designToken carousel.transition.duration
         */
        transitionDuration?: string;
    }

    interface Content {
        /**
         * Gap of content
         *
         * @designToken carousel.content.gap
         */
        gap?: string;
    }

    interface IndicatorList {
        /**
         * Padding of indicator list
         *
         * @designToken carousel.indicator.list.padding
         */
        padding?: string;
        /**
         * Gap of indicator list
         *
         * @designToken carousel.indicator.list.gap
         */
        gap?: string;
    }

    interface Indicator {
        /**
         * Width of indicator
         *
         * @designToken carousel.indicator.width
         */
        width?: string;
        /**
         * Height of indicator
         *
         * @designToken carousel.indicator.height
         */
        height?: string;
        /**
         * Border radius of indicator
         *
         * @designToken carousel.indicator.border.radius
         */
        borderRadius?: string;
        /**
         * Focus ring of indicator
         */
        focusRing?: {
            /**
             * Focus ring width of indicator
             *
             * @designToken carousel.indicator.focus.ring.width
             */
            width?: string;
            /**
             * Focus ring style of indicator
             *
             * @designToken carousel.indicator.focus.ring.style
             */
            style?: string;
            /**
             * Focus ring color of indicator
             *
             * @designToken carousel.indicator.focus.ring.color
             */
            color?: string;
            /**
             * Focus ring offset of indicator
             *
             * @designToken carousel.indicator.focus.ring.offset
             */
            offset?: string;
            /**
             * Focus ring shadow of indicator
             *
             * @designToken carousel.indicator.focus.ring.shadow
             */
            shadow?: string;
        };
        /**
         * Background of indicator
         *
         * @designToken carousel.indicator.background
         */
        background?: string;
        /**
         * Hover background of indicator
         *
         * @designToken carousel.indicator.hover.background
         */
        hoverBackground?: string;
        /**
         * Active background of indicator
         *
         * @designToken carousel.indicator.active.background
         */
        activeBackground?: string;
    }

    /* Static Sections */
    type ColorScheme = CS<CarouselDesignTokens>;
    type CSS = ExtendedCSS;
    type Extend = ExtendedTokens;
}

/**
 *
 * _Carousel Design Tokens_
 *
 * @group components
 * @module carousel
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
export interface CarouselDesignTokens extends DesignTokens<CarouselDesignTokens> {
    /**
     * Used to pass tokens of the root section
     */
    root?: CarouselTokenSections.Root;
    /**
     * Used to pass tokens of the content section
     */
    content?: CarouselTokenSections.Content;
    /**
     * Used to pass tokens of the indicator list section
     */
    indicatorList?: CarouselTokenSections.IndicatorList;
    /**
     * Used to pass tokens of the indicator section
     */
    indicator?: CarouselTokenSections.Indicator;
}
