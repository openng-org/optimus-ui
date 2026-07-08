/**
 *
 * Rating Design Tokens
 *
 * @module rating
 *
 */

import type { ColorScheme as CS, DesignTokens, ExtendedCSS, ExtendedTokens } from '..';

/**
 * Design Token Sections
 */
export declare namespace RatingTokenSections {
    interface Root {
        /**
         * Gap of root
         *
         * @designToken rating.gap
         */
        gap?: string;
        /**
         * Transition duration of root
         *
         * @designToken rating.transition.duration
         */
        transitionDuration?: string;
        /**
         * Focus ring of root
         */
        focusRing?: {
            /**
             * Focus ring width of root
             *
             * @designToken rating.focus.ring.width
             */
            width?: string;
            /**
             * Focus ring style of root
             *
             * @designToken rating.focus.ring.style
             */
            style?: string;
            /**
             * Focus ring color of root
             *
             * @designToken rating.focus.ring.color
             */
            color?: string;
            /**
             * Focus ring offset of root
             *
             * @designToken rating.focus.ring.offset
             */
            offset?: string;
            /**
             * Focus ring shadow of root
             *
             * @designToken rating.focus.ring.shadow
             */
            shadow?: string;
        };
    }

    interface Icon {
        /**
         * Size of icon
         *
         * @designToken rating.icon.size
         */
        size?: string;
        /**
         * Color of icon
         *
         * @designToken rating.icon.color
         */
        color?: string;
        /**
         * Hover color of icon
         *
         * @designToken rating.icon.hover.color
         */
        hoverColor?: string;
        /**
         * Active color of icon
         *
         * @designToken rating.icon.active.color
         */
        activeColor?: string;
    }

    /* Static Sections */
    type ColorScheme = CS<RatingDesignTokens>;
    type CSS = ExtendedCSS;
    type Extend = ExtendedTokens;
}

/**
 *
 * _Rating Design Tokens_
 *
 * @group components
 * @module rating
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
export interface RatingDesignTokens extends DesignTokens<RatingDesignTokens> {
    /**
     * Used to pass tokens of the root section
     */
    root?: RatingTokenSections.Root;
    /**
     * Used to pass tokens of the icon section
     */
    icon?: RatingTokenSections.Icon;
}
