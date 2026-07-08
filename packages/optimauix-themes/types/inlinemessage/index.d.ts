/**
 *
 * InlineMessage Design Tokens
 *
 * @module inlinemessage
 *
 */

import type { ColorScheme as CS, DesignTokens, ExtendedCSS, ExtendedTokens } from '..';

/**
 * Design Token Sections
 */
export declare namespace InlineMessageTokenSections {
    interface Root {
        /**
         * Padding of root
         *
         * @designToken inlinemessage.padding
         */
        padding?: string;
        /**
         * Border radius of root
         *
         * @designToken inlinemessage.border.radius
         */
        borderRadius?: string;
        /**
         * Gap of root
         *
         * @designToken inlinemessage.gap
         */
        gap?: string;
    }

    interface Text {
        /**
         * Font weight of text
         *
         * @designToken inlinemessage.text.font.weight
         */
        fontWeight?: string;
    }

    interface Icon {
        /**
         * Size of icon
         *
         * @designToken inlinemessage.icon.size
         */
        size?: string;
    }

    interface Info {
        /**
         * Background of info
         *
         * @designToken inlinemessage.info.background
         */
        background?: string;
        /**
         * Border color of info
         *
         * @designToken inlinemessage.info.border.color
         */
        borderColor?: string;
        /**
         * Color of info
         *
         * @designToken inlinemessage.info.color
         */
        color?: string;
        /**
         * Shadow of info
         *
         * @designToken inlinemessage.info.shadow
         */
        shadow?: string;
    }

    interface Success {
        /**
         * Background of success
         *
         * @designToken inlinemessage.success.background
         */
        background?: string;
        /**
         * Border color of success
         *
         * @designToken inlinemessage.success.border.color
         */
        borderColor?: string;
        /**
         * Color of success
         *
         * @designToken inlinemessage.success.color
         */
        color?: string;
        /**
         * Shadow of success
         *
         * @designToken inlinemessage.success.shadow
         */
        shadow?: string;
    }

    interface Warn {
        /**
         * Background of warn
         *
         * @designToken inlinemessage.warn.background
         */
        background?: string;
        /**
         * Border color of warn
         *
         * @designToken inlinemessage.warn.border.color
         */
        borderColor?: string;
        /**
         * Color of warn
         *
         * @designToken inlinemessage.warn.color
         */
        color?: string;
        /**
         * Shadow of warn
         *
         * @designToken inlinemessage.warn.shadow
         */
        shadow?: string;
    }

    interface Error {
        /**
         * Background of error
         *
         * @designToken inlinemessage.error.background
         */
        background?: string;
        /**
         * Border color of error
         *
         * @designToken inlinemessage.error.border.color
         */
        borderColor?: string;
        /**
         * Color of error
         *
         * @designToken inlinemessage.error.color
         */
        color?: string;
        /**
         * Shadow of error
         *
         * @designToken inlinemessage.error.shadow
         */
        shadow?: string;
    }

    interface Secondary {
        /**
         * Background of secondary
         *
         * @designToken inlinemessage.secondary.background
         */
        background?: string;
        /**
         * Border color of secondary
         *
         * @designToken inlinemessage.secondary.border.color
         */
        borderColor?: string;
        /**
         * Color of secondary
         *
         * @designToken inlinemessage.secondary.color
         */
        color?: string;
        /**
         * Shadow of secondary
         *
         * @designToken inlinemessage.secondary.shadow
         */
        shadow?: string;
    }

    interface Contrast {
        /**
         * Background of contrast
         *
         * @designToken inlinemessage.contrast.background
         */
        background?: string;
        /**
         * Border color of contrast
         *
         * @designToken inlinemessage.contrast.border.color
         */
        borderColor?: string;
        /**
         * Color of contrast
         *
         * @designToken inlinemessage.contrast.color
         */
        color?: string;
        /**
         * Shadow of contrast
         *
         * @designToken inlinemessage.contrast.shadow
         */
        shadow?: string;
    }

    /* Static Sections */
    type ColorScheme = CS<InlineMessageDesignTokens>;
    type CSS = ExtendedCSS;
    type Extend = ExtendedTokens;
}

/**
 *
 * _InlineMessage Design Tokens_
 *
 * @group components
 * @module inlinemessage
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
export interface InlineMessageDesignTokens extends DesignTokens<InlineMessageDesignTokens> {
    /**
     * Used to pass tokens of the root section
     */
    root?: InlineMessageTokenSections.Root;
    /**
     * Used to pass tokens of the text section
     */
    text?: InlineMessageTokenSections.Text;
    /**
     * Used to pass tokens of the icon section
     */
    icon?: InlineMessageTokenSections.Icon;
    /**
     * Used to pass tokens of the info section
     */
    info?: InlineMessageTokenSections.Info;
    /**
     * Used to pass tokens of the success section
     */
    success?: InlineMessageTokenSections.Success;
    /**
     * Used to pass tokens of the warn section
     */
    warn?: InlineMessageTokenSections.Warn;
    /**
     * Used to pass tokens of the error section
     */
    error?: InlineMessageTokenSections.Error;
    /**
     * Used to pass tokens of the secondary section
     */
    secondary?: InlineMessageTokenSections.Secondary;
    /**
     * Used to pass tokens of the contrast section
     */
    contrast?: InlineMessageTokenSections.Contrast;
}
