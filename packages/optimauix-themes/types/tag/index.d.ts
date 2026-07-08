/**
 *
 * Tag Design Tokens
 *
 * @module tag
 *
 */

import type { ColorScheme as CS, DesignTokens, ExtendedCSS, ExtendedTokens } from '..';

/**
 * Design Token Sections
 */
export declare namespace TagTokenSections {
    interface Root {
        /**
         * Font size of root
         *
         * @designToken tag.font.size
         */
        fontSize?: string;
        /**
         * Font weight of root
         *
         * @designToken tag.font.weight
         */
        fontWeight?: string;
        /**
         * Padding of root
         *
         * @designToken tag.padding
         */
        padding?: string;
        /**
         * Gap of root
         *
         * @designToken tag.gap
         */
        gap?: string;
        /**
         * Border radius of root
         *
         * @designToken tag.border.radius
         */
        borderRadius?: string;
        /**
         * Rounded border radius of root
         *
         * @designToken tag.rounded.border.radius
         */
        roundedBorderRadius?: string;
    }

    interface Icon {
        /**
         * Size of icon
         *
         * @designToken tag.icon.size
         */
        size?: string;
    }

    interface Primary {
        /**
         * Background of primary
         *
         * @designToken tag.primary.background
         */
        background?: string;
        /**
         * Color of primary
         *
         * @designToken tag.primary.color
         */
        color?: string;
    }

    interface Secondary {
        /**
         * Background of secondary
         *
         * @designToken tag.secondary.background
         */
        background?: string;
        /**
         * Color of secondary
         *
         * @designToken tag.secondary.color
         */
        color?: string;
    }

    interface Success {
        /**
         * Background of success
         *
         * @designToken tag.success.background
         */
        background?: string;
        /**
         * Color of success
         *
         * @designToken tag.success.color
         */
        color?: string;
    }

    interface Info {
        /**
         * Background of info
         *
         * @designToken tag.info.background
         */
        background?: string;
        /**
         * Color of info
         *
         * @designToken tag.info.color
         */
        color?: string;
    }

    interface Warn {
        /**
         * Background of warn
         *
         * @designToken tag.warn.background
         */
        background?: string;
        /**
         * Color of warn
         *
         * @designToken tag.warn.color
         */
        color?: string;
    }

    interface Danger {
        /**
         * Background of danger
         *
         * @designToken tag.danger.background
         */
        background?: string;
        /**
         * Color of danger
         *
         * @designToken tag.danger.color
         */
        color?: string;
    }

    interface Contrast {
        /**
         * Background of contrast
         *
         * @designToken tag.contrast.background
         */
        background?: string;
        /**
         * Color of contrast
         *
         * @designToken tag.contrast.color
         */
        color?: string;
    }

    /* Static Sections */
    type ColorScheme = CS<TagDesignTokens>;
    type CSS = ExtendedCSS;
    type Extend = ExtendedTokens;
}

/**
 *
 * _Tag Design Tokens_
 *
 * @group components
 * @module tag
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
export interface TagDesignTokens extends DesignTokens<TagDesignTokens> {
    /**
     * Used to pass tokens of the root section
     */
    root?: TagTokenSections.Root;
    /**
     * Used to pass tokens of the icon section
     */
    icon?: TagTokenSections.Icon;
    /**
     * Used to pass tokens of the primary section
     */
    primary?: TagTokenSections.Primary;
    /**
     * Used to pass tokens of the secondary section
     */
    secondary?: TagTokenSections.Secondary;
    /**
     * Used to pass tokens of the success section
     */
    success?: TagTokenSections.Success;
    /**
     * Used to pass tokens of the info section
     */
    info?: TagTokenSections.Info;
    /**
     * Used to pass tokens of the warn section
     */
    warn?: TagTokenSections.Warn;
    /**
     * Used to pass tokens of the danger section
     */
    danger?: TagTokenSections.Danger;
    /**
     * Used to pass tokens of the contrast section
     */
    contrast?: TagTokenSections.Contrast;
}
