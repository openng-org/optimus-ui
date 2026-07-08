/**
 *
 * Toast Design Tokens
 *
 * @module toast
 *
 */

import type { ColorScheme as CS, DesignTokens, ExtendedCSS, ExtendedTokens } from '..';

/**
 * Design Token Sections
 */
export declare namespace ToastTokenSections {
    interface Root {
        /**
         * Width of root
         *
         * @designToken toast.width
         */
        width?: string;
        /**
         * Border radius of root
         *
         * @designToken toast.border.radius
         */
        borderRadius?: string;
        /**
         * Border width of root
         *
         * @designToken toast.border.width
         */
        borderWidth?: string;
        /**
         * Transition duration of root
         *
         * @designToken toast.transition.duration
         */
        transitionDuration?: string;
        /**
         * Used to pass tokens of the blur section
         *
         * @designToken toast.blur
         */
        blur?: ToastTokenSections.Blur;
    }

    interface Icon {
        /**
         * Size of icon
         *
         * @designToken toast.icon.size
         */
        size?: string;
    }

    interface Content {
        /**
         * Padding of content
         *
         * @designToken toast.content.padding
         */
        padding?: string;
        /**
         * Gap of content
         *
         * @designToken toast.content.gap
         */
        gap?: string;
    }

    interface Text {
        /**
         * Gap of text
         *
         * @designToken toast.text.gap
         */
        gap?: string;
    }

    interface Summary {
        /**
         * Font weight of summary
         *
         * @designToken toast.summary.font.weight
         */
        fontWeight?: string;
        /**
         * Font size of summary
         *
         * @designToken toast.summary.font.size
         */
        fontSize?: string;
    }

    interface Detail {
        /**
         * Font weight of detail
         *
         * @designToken toast.detail.font.weight
         */
        fontWeight?: string;
        /**
         * Font size of detail
         *
         * @designToken toast.detail.font.size
         */
        fontSize?: string;
    }

    interface CloseButton {
        /**
         * Width of close button
         *
         * @designToken toast.close.button.width
         */
        width?: string;
        /**
         * Height of close button
         *
         * @designToken toast.close.button.height
         */
        height?: string;
        /**
         * Border radius of close button
         *
         * @designToken toast.close.button.border.radius
         */
        borderRadius?: string;
        /**
         * Focus ring of close button
         */
        focusRing?: {
            /**
             * Focus ring width of close button
             *
             * @designToken toast.close.button.focus.ring.width
             */
            width?: string;
            /**
             * Focus ring style of close button
             *
             * @designToken toast.close.button.focus.ring.style
             */
            style?: string;
            /**
             * Focus ring offset of close button
             *
             * @designToken toast.close.button.focus.ring.offset
             */
            offset?: string;
        };
    }

    interface CloseIcon {
        /**
         * Size of close icon
         *
         * @designToken toast.close.icon.size
         */
        size?: string;
    }

    type Blur = string;

    interface Info {
        /**
         * Background of info
         *
         * @designToken toast.info.background
         */
        background?: string;
        /**
         * Border color of info
         *
         * @designToken toast.info.border.color
         */
        borderColor?: string;
        /**
         * Color of info
         *
         * @designToken toast.info.color
         */
        color?: string;
        /**
         * Detail color of info
         *
         * @designToken toast.info.detail.color
         */
        detailColor?: string;
        /**
         * Shadow of info
         *
         * @designToken toast.info.shadow
         */
        shadow?: string;
        /**
         * Close button of info
         */
        closeButton?: {
            /**
             * Close button hover background of info
             *
             * @designToken toast.info.close.button.hover.background
             */
            hoverBackground?: string;
            /**
             * Close button focus ring of info
             */
            focusRing?: {
                /**
                 * Close button focus ring color of info
                 *
                 * @designToken toast.info.close.button.focus.ring.color
                 */
                color?: string;
                /**
                 * Close button focus ring shadow of info
                 *
                 * @designToken toast.info.close.button.focus.ring.shadow
                 */
                shadow?: string;
            };
        };
    }

    interface Success {
        /**
         * Background of success
         *
         * @designToken toast.success.background
         */
        background?: string;
        /**
         * Border color of success
         *
         * @designToken toast.success.border.color
         */
        borderColor?: string;
        /**
         * Color of success
         *
         * @designToken toast.success.color
         */
        color?: string;
        /**
         * Detail color of success
         *
         * @designToken toast.success.detail.color
         */
        detailColor?: string;
        /**
         * Shadow of success
         *
         * @designToken toast.success.shadow
         */
        shadow?: string;
        /**
         * Close button of success
         */
        closeButton?: {
            /**
             * Close button hover background of success
             *
             * @designToken toast.success.close.button.hover.background
             */
            hoverBackground?: string;
            /**
             * Close button focus ring of success
             */
            focusRing?: {
                /**
                 * Close button focus ring color of success
                 *
                 * @designToken toast.success.close.button.focus.ring.color
                 */
                color?: string;
                /**
                 * Close button focus ring shadow of success
                 *
                 * @designToken toast.success.close.button.focus.ring.shadow
                 */
                shadow?: string;
            };
        };
    }

    interface Warn {
        /**
         * Background of warn
         *
         * @designToken toast.warn.background
         */
        background?: string;
        /**
         * Border color of warn
         *
         * @designToken toast.warn.border.color
         */
        borderColor?: string;
        /**
         * Color of warn
         *
         * @designToken toast.warn.color
         */
        color?: string;
        /**
         * Detail color of warn
         *
         * @designToken toast.warn.detail.color
         */
        detailColor?: string;
        /**
         * Shadow of warn
         *
         * @designToken toast.warn.shadow
         */
        shadow?: string;
        /**
         * Close button of warn
         */
        closeButton?: {
            /**
             * Close button hover background of warn
             *
             * @designToken toast.warn.close.button.hover.background
             */
            hoverBackground?: string;
            /**
             * Close button focus ring of warn
             */
            focusRing?: {
                /**
                 * Close button focus ring color of warn
                 *
                 * @designToken toast.warn.close.button.focus.ring.color
                 */
                color?: string;
                /**
                 * Close button focus ring shadow of warn
                 *
                 * @designToken toast.warn.close.button.focus.ring.shadow
                 */
                shadow?: string;
            };
        };
    }

    interface Error {
        /**
         * Background of error
         *
         * @designToken toast.error.background
         */
        background?: string;
        /**
         * Border color of error
         *
         * @designToken toast.error.border.color
         */
        borderColor?: string;
        /**
         * Color of error
         *
         * @designToken toast.error.color
         */
        color?: string;
        /**
         * Detail color of error
         *
         * @designToken toast.error.detail.color
         */
        detailColor?: string;
        /**
         * Shadow of error
         *
         * @designToken toast.error.shadow
         */
        shadow?: string;
        /**
         * Close button of error
         */
        closeButton?: {
            /**
             * Close button hover background of error
             *
             * @designToken toast.error.close.button.hover.background
             */
            hoverBackground?: string;
            /**
             * Close button focus ring of error
             */
            focusRing?: {
                /**
                 * Close button focus ring color of error
                 *
                 * @designToken toast.error.close.button.focus.ring.color
                 */
                color?: string;
                /**
                 * Close button focus ring shadow of error
                 *
                 * @designToken toast.error.close.button.focus.ring.shadow
                 */
                shadow?: string;
            };
        };
    }

    interface Secondary {
        /**
         * Background of secondary
         *
         * @designToken toast.secondary.background
         */
        background?: string;
        /**
         * Border color of secondary
         *
         * @designToken toast.secondary.border.color
         */
        borderColor?: string;
        /**
         * Color of secondary
         *
         * @designToken toast.secondary.color
         */
        color?: string;
        /**
         * Detail color of secondary
         *
         * @designToken toast.secondary.detail.color
         */
        detailColor?: string;
        /**
         * Shadow of secondary
         *
         * @designToken toast.secondary.shadow
         */
        shadow?: string;
        /**
         * Close button of secondary
         */
        closeButton?: {
            /**
             * Close button hover background of secondary
             *
             * @designToken toast.secondary.close.button.hover.background
             */
            hoverBackground?: string;
            /**
             * Close button focus ring of secondary
             */
            focusRing?: {
                /**
                 * Close button focus ring color of secondary
                 *
                 * @designToken toast.secondary.close.button.focus.ring.color
                 */
                color?: string;
                /**
                 * Close button focus ring shadow of secondary
                 *
                 * @designToken toast.secondary.close.button.focus.ring.shadow
                 */
                shadow?: string;
            };
        };
    }

    interface Contrast {
        /**
         * Background of contrast
         *
         * @designToken toast.contrast.background
         */
        background?: string;
        /**
         * Border color of contrast
         *
         * @designToken toast.contrast.border.color
         */
        borderColor?: string;
        /**
         * Color of contrast
         *
         * @designToken toast.contrast.color
         */
        color?: string;
        /**
         * Detail color of contrast
         *
         * @designToken toast.contrast.detail.color
         */
        detailColor?: string;
        /**
         * Shadow of contrast
         *
         * @designToken toast.contrast.shadow
         */
        shadow?: string;
        /**
         * Close button of contrast
         */
        closeButton?: {
            /**
             * Close button hover background of contrast
             *
             * @designToken toast.contrast.close.button.hover.background
             */
            hoverBackground?: string;
            /**
             * Close button focus ring of contrast
             */
            focusRing?: {
                /**
                 * Close button focus ring color of contrast
                 *
                 * @designToken toast.contrast.close.button.focus.ring.color
                 */
                color?: string;
                /**
                 * Close button focus ring shadow of contrast
                 *
                 * @designToken toast.contrast.close.button.focus.ring.shadow
                 */
                shadow?: string;
            };
        };
    }

    /* Static Sections */
    type ColorScheme = CS<ToastDesignTokens>;
    type CSS = ExtendedCSS;
    type Extend = ExtendedTokens;
}

/**
 *
 * _Toast Design Tokens_
 *
 * @group components
 * @module toast
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
export interface ToastDesignTokens extends DesignTokens<ToastDesignTokens> {
    /**
     * Used to pass tokens of the root section
     */
    root?: ToastTokenSections.Root;
    /**
     * Used to pass tokens of the icon section
     */
    icon?: ToastTokenSections.Icon;
    /**
     * Used to pass tokens of the content section
     */
    content?: ToastTokenSections.Content;
    /**
     * Used to pass tokens of the text section
     */
    text?: ToastTokenSections.Text;
    /**
     * Used to pass tokens of the summary section
     */
    summary?: ToastTokenSections.Summary;
    /**
     * Used to pass tokens of the detail section
     */
    detail?: ToastTokenSections.Detail;
    /**
     * Used to pass tokens of the close button section
     */
    closeButton?: ToastTokenSections.CloseButton;
    /**
     * Used to pass tokens of the close icon section
     */
    closeIcon?: ToastTokenSections.CloseIcon;
    /**
     * Used to pass tokens of the info section
     */
    info?: ToastTokenSections.Info;
    /**
     * Used to pass tokens of the success section
     */
    success?: ToastTokenSections.Success;
    /**
     * Used to pass tokens of the warn section
     */
    warn?: ToastTokenSections.Warn;
    /**
     * Used to pass tokens of the error section
     */
    error?: ToastTokenSections.Error;
    /**
     * Used to pass tokens of the secondary section
     */
    secondary?: ToastTokenSections.Secondary;
    /**
     * Used to pass tokens of the contrast section
     */
    contrast?: ToastTokenSections.Contrast;
}
