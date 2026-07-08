/**
 *
 * Image Design Tokens
 *
 * @module image
 *
 */

import type { ColorScheme as CS, DesignTokens, ExtendedCSS, ExtendedTokens } from '..';

/**
 * Design Token Sections
 */
export declare namespace ImageTokenSections {
    interface Root {
        /**
         * Transition duration of root
         *
         * @designToken image.transition.duration
         */
        transitionDuration?: string;
    }

    interface Preview {
        /**
         * Icon of preview
         */
        icon?: {
            /**
             * Icon size of preview
             *
             * @designToken image.preview.icon.size
             */
            size?: string;
        };
        /**
         * Mask of preview
         */
        mask?: {
            /**
             * Mask background of preview
             *
             * @designToken image.preview.mask.background
             */
            background?: string;
            /**
             * Mask color of preview
             *
             * @designToken image.preview.mask.color
             */
            color?: string;
        };
    }

    interface Toolbar {
        /**
         * Position of toolbar
         */
        position?: {
            /**
             * Position left of toolbar
             *
             * @designToken image.toolbar.position.left
             */
            left?: string;
            /**
             * Position right of toolbar
             *
             * @designToken image.toolbar.position.right
             */
            right?: string;
            /**
             * Position top of toolbar
             *
             * @designToken image.toolbar.position.top
             */
            top?: string;
            /**
             * Position bottom of toolbar
             *
             * @designToken image.toolbar.position.bottom
             */
            bottom?: string;
        };
        /**
         * Blur of toolbar
         *
         * @designToken image.toolbar.blur
         */
        blur?: string;
        /**
         * Background of toolbar
         *
         * @designToken image.toolbar.background
         */
        background?: string;
        /**
         * Border color of toolbar
         *
         * @designToken image.toolbar.border.color
         */
        borderColor?: string;
        /**
         * Border width of toolbar
         *
         * @designToken image.toolbar.border.width
         */
        borderWidth?: string;
        /**
         * Border radius of toolbar
         *
         * @designToken image.toolbar.border.radius
         */
        borderRadius?: string;
        /**
         * Padding of toolbar
         *
         * @designToken image.toolbar.padding
         */
        padding?: string;
        /**
         * Gap of toolbar
         *
         * @designToken image.toolbar.gap
         */
        gap?: string;
    }

    interface Action {
        /**
         * Hover background of action
         *
         * @designToken image.action.hover.background
         */
        hoverBackground?: string;
        /**
         * Color of action
         *
         * @designToken image.action.color
         */
        color?: string;
        /**
         * Hover color of action
         *
         * @designToken image.action.hover.color
         */
        hoverColor?: string;
        /**
         * Size of action
         *
         * @designToken image.action.size
         */
        size?: string;
        /**
         * Icon size of action
         *
         * @designToken image.action.icon.size
         */
        iconSize?: string;
        /**
         * Border radius of action
         *
         * @designToken image.action.border.radius
         */
        borderRadius?: string;
        /**
         * Focus ring of action
         */
        focusRing?: {
            /**
             * Focus ring width of action
             *
             * @designToken image.action.focus.ring.width
             */
            width?: string;
            /**
             * Focus ring style of action
             *
             * @designToken image.action.focus.ring.style
             */
            style?: string;
            /**
             * Focus ring color of action
             *
             * @designToken image.action.focus.ring.color
             */
            color?: string;
            /**
             * Focus ring offset of action
             *
             * @designToken image.action.focus.ring.offset
             */
            offset?: string;
            /**
             * Focus ring shadow of action
             *
             * @designToken image.action.focus.ring.shadow
             */
            shadow?: string;
        };
    }

    /* Static Sections */
    type ColorScheme = CS<ImageDesignTokens>;
    type CSS = ExtendedCSS;
    type Extend = ExtendedTokens;
}

/**
 *
 * _Image Design Tokens_
 *
 * @group components
 * @module image
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
export interface ImageDesignTokens extends DesignTokens<ImageDesignTokens> {
    /**
     * Used to pass tokens of the root section
     */
    root?: ImageTokenSections.Root;
    /**
     * Used to pass tokens of the preview section
     */
    preview?: ImageTokenSections.Preview;
    /**
     * Used to pass tokens of the toolbar section
     */
    toolbar?: ImageTokenSections.Toolbar;
    /**
     * Used to pass tokens of the action section
     */
    action?: ImageTokenSections.Action;
}
