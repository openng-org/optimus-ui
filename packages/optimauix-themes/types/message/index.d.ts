/**
 *
 * Message Design Tokens
 *
 * @module message
 *
 */

import type { ColorScheme as CS, DesignTokens, ExtendedCSS, ExtendedTokens } from '..';

/**
 * Design Token Sections
 */
export declare namespace MessageTokenSections {
    interface Root {
        /**
         * Border radius of root
         *
         * @designToken message.border.radius
         */
        borderRadius?: string;
        /**
         * Border width of root
         *
         * @designToken message.border.width
         */
        borderWidth?: string;
        /**
         * Transition duration of root
         *
         * @designToken message.transition.duration
         */
        transitionDuration?: string;
    }

    interface Content {
        /**
         * Padding of content
         *
         * @designToken message.content.padding
         */
        padding?: string;
        /**
         * Gap of content
         *
         * @designToken message.content.gap
         */
        gap?: string;
        /**
         * Sm of content
         */
        sm?: {
            /**
             * Sm padding of content
             *
             * @designToken message.content.sm.padding
             */
            padding?: string;
        };
        /**
         * Lg of content
         */
        lg?: {
            /**
             * Lg padding of content
             *
             * @designToken message.content.lg.padding
             */
            padding?: string;
        };
    }

    interface Text {
        /**
         * Font size of text
         *
         * @designToken message.text.font.size
         */
        fontSize?: string;
        /**
         * Font weight of text
         *
         * @designToken message.text.font.weight
         */
        fontWeight?: string;
        /**
         * Sm of text
         */
        sm?: {
            /**
             * Sm font size of text
             *
             * @designToken message.text.sm.font.size
             */
            fontSize?: string;
        };
        /**
         * Lg of text
         */
        lg?: {
            /**
             * Lg font size of text
             *
             * @designToken message.text.lg.font.size
             */
            fontSize?: string;
        };
    }

    interface Icon {
        /**
         * Size of icon
         *
         * @designToken message.icon.size
         */
        size?: string;
        /**
         * Sm of icon
         */
        sm?: {
            /**
             * Sm size of icon
             *
             * @designToken message.icon.sm.size
             */
            size?: string;
        };
        /**
         * Lg of icon
         */
        lg?: {
            /**
             * Lg size of icon
             *
             * @designToken message.icon.lg.size
             */
            size?: string;
        };
    }

    interface CloseButton {
        /**
         * Width of close button
         *
         * @designToken message.close.button.width
         */
        width?: string;
        /**
         * Height of close button
         *
         * @designToken message.close.button.height
         */
        height?: string;
        /**
         * Border radius of close button
         *
         * @designToken message.close.button.border.radius
         */
        borderRadius?: string;
        /**
         * Focus ring of close button
         */
        focusRing?: {
            /**
             * Focus ring width of close button
             *
             * @designToken message.close.button.focus.ring.width
             */
            width?: string;
            /**
             * Focus ring style of close button
             *
             * @designToken message.close.button.focus.ring.style
             */
            style?: string;
            /**
             * Focus ring offset of close button
             *
             * @designToken message.close.button.focus.ring.offset
             */
            offset?: string;
        };
    }

    interface CloseIcon {
        /**
         * Size of close icon
         *
         * @designToken message.close.icon.size
         */
        size?: string;
        /**
         * Sm of close icon
         */
        sm?: {
            /**
             * Sm size of close icon
             *
             * @designToken message.close.icon.sm.size
             */
            size?: string;
        };
        /**
         * Lg of close icon
         */
        lg?: {
            /**
             * Lg size of close icon
             *
             * @designToken message.close.icon.lg.size
             */
            size?: string;
        };
    }

    interface Outlined {
        /**
         * Root of outlined
         */
        root?: {
            /**
             * Root border width of outlined
             *
             * @designToken message.outlined.border.width
             */
            borderWidth?: string;
        };
    }

    interface Simple {
        /**
         * Content of simple
         */
        content?: {
            /**
             * Content padding of simple
             *
             * @designToken message.simple.content.padding
             */
            padding?: string;
        };
    }

    interface Info {
        /**
         * Background of info
         *
         * @designToken message.info.background
         */
        background?: string;
        /**
         * Border color of info
         *
         * @designToken message.info.border.color
         */
        borderColor?: string;
        /**
         * Color of info
         *
         * @designToken message.info.color
         */
        color?: string;
        /**
         * Shadow of info
         *
         * @designToken message.info.shadow
         */
        shadow?: string;
        /**
         * Close button of info
         */
        closeButton?: {
            /**
             * Close button hover background of info
             *
             * @designToken message.info.close.button.hover.background
             */
            hoverBackground?: string;
            /**
             * Close button focus ring of info
             */
            focusRing?: {
                /**
                 * Close button focus ring color of info
                 *
                 * @designToken message.info.close.button.focus.ring.color
                 */
                color?: string;
                /**
                 * Close button focus ring shadow of info
                 *
                 * @designToken message.info.close.button.focus.ring.shadow
                 */
                shadow?: string;
            };
        };
        /**
         * Outlined of info
         */
        outlined?: {
            /**
             * Outlined color of info
             *
             * @designToken message.info.outlined.color
             */
            color?: string;
            /**
             * Outlined border color of info
             *
             * @designToken message.info.outlined.border.color
             */
            borderColor?: string;
        };
        /**
         * Simple of info
         */
        simple?: {
            /**
             * Simple color of info
             *
             * @designToken message.info.simple.color
             */
            color?: string;
        };
    }

    interface Success {
        /**
         * Background of success
         *
         * @designToken message.success.background
         */
        background?: string;
        /**
         * Border color of success
         *
         * @designToken message.success.border.color
         */
        borderColor?: string;
        /**
         * Color of success
         *
         * @designToken message.success.color
         */
        color?: string;
        /**
         * Shadow of success
         *
         * @designToken message.success.shadow
         */
        shadow?: string;
        /**
         * Close button of success
         */
        closeButton?: {
            /**
             * Close button hover background of success
             *
             * @designToken message.success.close.button.hover.background
             */
            hoverBackground?: string;
            /**
             * Close button focus ring of success
             */
            focusRing?: {
                /**
                 * Close button focus ring color of success
                 *
                 * @designToken message.success.close.button.focus.ring.color
                 */
                color?: string;
                /**
                 * Close button focus ring shadow of success
                 *
                 * @designToken message.success.close.button.focus.ring.shadow
                 */
                shadow?: string;
            };
        };
        /**
         * Outlined of success
         */
        outlined?: {
            /**
             * Outlined color of success
             *
             * @designToken message.success.outlined.color
             */
            color?: string;
            /**
             * Outlined border color of success
             *
             * @designToken message.success.outlined.border.color
             */
            borderColor?: string;
        };
        /**
         * Simple of success
         */
        simple?: {
            /**
             * Simple color of success
             *
             * @designToken message.success.simple.color
             */
            color?: string;
        };
    }

    interface Warn {
        /**
         * Background of warn
         *
         * @designToken message.warn.background
         */
        background?: string;
        /**
         * Border color of warn
         *
         * @designToken message.warn.border.color
         */
        borderColor?: string;
        /**
         * Color of warn
         *
         * @designToken message.warn.color
         */
        color?: string;
        /**
         * Shadow of warn
         *
         * @designToken message.warn.shadow
         */
        shadow?: string;
        /**
         * Close button of warn
         */
        closeButton?: {
            /**
             * Close button hover background of warn
             *
             * @designToken message.warn.close.button.hover.background
             */
            hoverBackground?: string;
            /**
             * Close button focus ring of warn
             */
            focusRing?: {
                /**
                 * Close button focus ring color of warn
                 *
                 * @designToken message.warn.close.button.focus.ring.color
                 */
                color?: string;
                /**
                 * Close button focus ring shadow of warn
                 *
                 * @designToken message.warn.close.button.focus.ring.shadow
                 */
                shadow?: string;
            };
        };
        /**
         * Outlined of warn
         */
        outlined?: {
            /**
             * Outlined color of warn
             *
             * @designToken message.warn.outlined.color
             */
            color?: string;
            /**
             * Outlined border color of warn
             *
             * @designToken message.warn.outlined.border.color
             */
            borderColor?: string;
        };
        /**
         * Simple of warn
         */
        simple?: {
            /**
             * Simple color of warn
             *
             * @designToken message.warn.simple.color
             */
            color?: string;
        };
    }

    interface Error {
        /**
         * Background of error
         *
         * @designToken message.error.background
         */
        background?: string;
        /**
         * Border color of error
         *
         * @designToken message.error.border.color
         */
        borderColor?: string;
        /**
         * Color of error
         *
         * @designToken message.error.color
         */
        color?: string;
        /**
         * Shadow of error
         *
         * @designToken message.error.shadow
         */
        shadow?: string;
        /**
         * Close button of error
         */
        closeButton?: {
            /**
             * Close button hover background of error
             *
             * @designToken message.error.close.button.hover.background
             */
            hoverBackground?: string;
            /**
             * Close button focus ring of error
             */
            focusRing?: {
                /**
                 * Close button focus ring color of error
                 *
                 * @designToken message.error.close.button.focus.ring.color
                 */
                color?: string;
                /**
                 * Close button focus ring shadow of error
                 *
                 * @designToken message.error.close.button.focus.ring.shadow
                 */
                shadow?: string;
            };
        };
        /**
         * Outlined of error
         */
        outlined?: {
            /**
             * Outlined color of error
             *
             * @designToken message.error.outlined.color
             */
            color?: string;
            /**
             * Outlined border color of error
             *
             * @designToken message.error.outlined.border.color
             */
            borderColor?: string;
        };
        /**
         * Simple of error
         */
        simple?: {
            /**
             * Simple color of error
             *
             * @designToken message.error.simple.color
             */
            color?: string;
        };
    }

    interface Secondary {
        /**
         * Background of secondary
         *
         * @designToken message.secondary.background
         */
        background?: string;
        /**
         * Border color of secondary
         *
         * @designToken message.secondary.border.color
         */
        borderColor?: string;
        /**
         * Color of secondary
         *
         * @designToken message.secondary.color
         */
        color?: string;
        /**
         * Shadow of secondary
         *
         * @designToken message.secondary.shadow
         */
        shadow?: string;
        /**
         * Close button of secondary
         */
        closeButton?: {
            /**
             * Close button hover background of secondary
             *
             * @designToken message.secondary.close.button.hover.background
             */
            hoverBackground?: string;
            /**
             * Close button focus ring of secondary
             */
            focusRing?: {
                /**
                 * Close button focus ring color of secondary
                 *
                 * @designToken message.secondary.close.button.focus.ring.color
                 */
                color?: string;
                /**
                 * Close button focus ring shadow of secondary
                 *
                 * @designToken message.secondary.close.button.focus.ring.shadow
                 */
                shadow?: string;
            };
        };
        /**
         * Outlined of secondary
         */
        outlined?: {
            /**
             * Outlined color of secondary
             *
             * @designToken message.secondary.outlined.color
             */
            color?: string;
            /**
             * Outlined border color of secondary
             *
             * @designToken message.secondary.outlined.border.color
             */
            borderColor?: string;
        };
        /**
         * Simple of secondary
         */
        simple?: {
            /**
             * Simple color of secondary
             *
             * @designToken message.secondary.simple.color
             */
            color?: string;
        };
    }

    interface Contrast {
        /**
         * Background of contrast
         *
         * @designToken message.contrast.background
         */
        background?: string;
        /**
         * Border color of contrast
         *
         * @designToken message.contrast.border.color
         */
        borderColor?: string;
        /**
         * Color of contrast
         *
         * @designToken message.contrast.color
         */
        color?: string;
        /**
         * Shadow of contrast
         *
         * @designToken message.contrast.shadow
         */
        shadow?: string;
        /**
         * Close button of contrast
         */
        closeButton?: {
            /**
             * Close button hover background of contrast
             *
             * @designToken message.contrast.close.button.hover.background
             */
            hoverBackground?: string;
            /**
             * Close button focus ring of contrast
             */
            focusRing?: {
                /**
                 * Close button focus ring color of contrast
                 *
                 * @designToken message.contrast.close.button.focus.ring.color
                 */
                color?: string;
                /**
                 * Close button focus ring shadow of contrast
                 *
                 * @designToken message.contrast.close.button.focus.ring.shadow
                 */
                shadow?: string;
            };
        };
        /**
         * Outlined of contrast
         */
        outlined?: {
            /**
             * Outlined color of contrast
             *
             * @designToken message.contrast.outlined.color
             */
            color?: string;
            /**
             * Outlined border color of contrast
             *
             * @designToken message.contrast.outlined.border.color
             */
            borderColor?: string;
        };
        /**
         * Simple of contrast
         */
        simple?: {
            /**
             * Simple color of contrast
             *
             * @designToken message.contrast.simple.color
             */
            color?: string;
        };
    }

    /* Static Sections */
    type ColorScheme = CS<MessageDesignTokens>;
    type CSS = ExtendedCSS;
    type Extend = ExtendedTokens;
}

/**
 *
 * _Message Design Tokens_
 *
 * @group components
 * @module message
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
export interface MessageDesignTokens extends DesignTokens<MessageDesignTokens> {
    /**
     * Used to pass tokens of the root section
     */
    root?: MessageTokenSections.Root;
    /**
     * Used to pass tokens of the content section
     */
    content?: MessageTokenSections.Content;
    /**
     * Used to pass tokens of the text section
     */
    text?: MessageTokenSections.Text;
    /**
     * Used to pass tokens of the icon section
     */
    icon?: MessageTokenSections.Icon;
    /**
     * Used to pass tokens of the close button section
     */
    closeButton?: MessageTokenSections.CloseButton;
    /**
     * Used to pass tokens of the close icon section
     */
    closeIcon?: MessageTokenSections.CloseIcon;
    /**
     * Used to pass tokens of the outlined section
     */
    outlined?: MessageTokenSections.Outlined;
    /**
     * Used to pass tokens of the simple section
     */
    simple?: MessageTokenSections.Simple;
    /**
     * Used to pass tokens of the info section
     */
    info?: MessageTokenSections.Info;
    /**
     * Used to pass tokens of the success section
     */
    success?: MessageTokenSections.Success;
    /**
     * Used to pass tokens of the warn section
     */
    warn?: MessageTokenSections.Warn;
    /**
     * Used to pass tokens of the error section
     */
    error?: MessageTokenSections.Error;
    /**
     * Used to pass tokens of the secondary section
     */
    secondary?: MessageTokenSections.Secondary;
    /**
     * Used to pass tokens of the contrast section
     */
    contrast?: MessageTokenSections.Contrast;
}
