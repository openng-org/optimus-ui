/**
 *
 * Chip Design Tokens
 *
 * @module chip
 *
 */

import type { ColorScheme as CS, DesignTokens, ExtendedCSS, ExtendedTokens } from '..';

/**
 * Design Token Sections
 */
export declare namespace ChipTokenSections {
    interface Root {
        /**
         * Border radius of root
         *
         * @designToken chip.border.radius
         */
        borderRadius?: string;
        /**
         * Padding x of root
         *
         * @designToken chip.padding.x
         */
        paddingX?: string;
        /**
         * Padding y of root
         *
         * @designToken chip.padding.y
         */
        paddingY?: string;
        /**
         * Gap of root
         *
         * @designToken chip.gap
         */
        gap?: string;
        /**
         * Transition duration of root
         *
         * @designToken chip.transition.duration
         */
        transitionDuration?: string;
        /**
         * Background of root
         *
         * @designToken chip.background
         */
        background?: string;
        /**
         * Color of root
         *
         * @designToken chip.color
         */
        color?: string;
    }

    interface Image {
        /**
         * Width of image
         *
         * @designToken chip.image.width
         */
        width?: string;
        /**
         * Height of image
         *
         * @designToken chip.image.height
         */
        height?: string;
    }

    interface Icon {
        /**
         * Size of icon
         *
         * @designToken chip.icon.size
         */
        size?: string;
        /**
         * Color of icon
         *
         * @designToken chip.icon.color
         */
        color?: string;
    }

    interface RemoveIcon {
        /**
         * Size of remove icon
         *
         * @designToken chip.remove.icon.size
         */
        size?: string;
        /**
         * Focus ring of remove icon
         */
        focusRing?: {
            /**
             * Focus ring width of remove icon
             *
             * @designToken chip.remove.icon.focus.ring.width
             */
            width?: string;
            /**
             * Focus ring style of remove icon
             *
             * @designToken chip.remove.icon.focus.ring.style
             */
            style?: string;
            /**
             * Focus ring color of remove icon
             *
             * @designToken chip.remove.icon.focus.ring.color
             */
            color?: string;
            /**
             * Focus ring offset of remove icon
             *
             * @designToken chip.remove.icon.focus.ring.offset
             */
            offset?: string;
            /**
             * Focus ring shadow of remove icon
             *
             * @designToken chip.remove.icon.focus.ring.shadow
             */
            shadow?: string;
        };
        /**
         * Color of remove icon
         *
         * @designToken chip.remove.icon.color
         */
        color?: string;
    }

    /* Static Sections */
    type ColorScheme = CS<ChipDesignTokens>;
    type CSS = ExtendedCSS;
    type Extend = ExtendedTokens;
}

/**
 *
 * _Chip Design Tokens_
 *
 * @group components
 * @module chip
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
export interface ChipDesignTokens extends DesignTokens<ChipDesignTokens> {
    /**
     * Used to pass tokens of the root section
     */
    root?: ChipTokenSections.Root;
    /**
     * Used to pass tokens of the image section
     */
    image?: ChipTokenSections.Image;
    /**
     * Used to pass tokens of the icon section
     */
    icon?: ChipTokenSections.Icon;
    /**
     * Used to pass tokens of the remove icon section
     */
    removeIcon?: ChipTokenSections.RemoveIcon;
}
