/**
 *
 * Badge Design Tokens
 *
 * @module badge
 *
 */

import type { ColorScheme as CS, DesignTokens, ExtendedCSS, ExtendedTokens } from '..';

/**
 * Design Token Sections
 */
export declare namespace BadgeTokenSections {
    interface Root {
        /**
         * Border radius of root
         *
         * @designToken badge.border.radius
         */
        borderRadius?: string;
        /**
         * Padding of root
         *
         * @designToken badge.padding
         */
        padding?: string;
        /**
         * Font size of root
         *
         * @designToken badge.font.size
         */
        fontSize?: string;
        /**
         * Font weight of root
         *
         * @designToken badge.font.weight
         */
        fontWeight?: string;
        /**
         * Min width of root
         *
         * @designToken badge.min.width
         */
        minWidth?: string;
        /**
         * Height of root
         *
         * @designToken badge.height
         */
        height?: string;
    }

    interface Dot {
        /**
         * Size of dot
         *
         * @designToken badge.dot.size
         */
        size?: string;
    }

    interface Sm {
        /**
         * Font size of sm
         *
         * @designToken badge.sm.font.size
         */
        fontSize?: string;
        /**
         * Min width of sm
         *
         * @designToken badge.sm.min.width
         */
        minWidth?: string;
        /**
         * Height of sm
         *
         * @designToken badge.sm.height
         */
        height?: string;
    }

    interface Lg {
        /**
         * Font size of lg
         *
         * @designToken badge.lg.font.size
         */
        fontSize?: string;
        /**
         * Min width of lg
         *
         * @designToken badge.lg.min.width
         */
        minWidth?: string;
        /**
         * Height of lg
         *
         * @designToken badge.lg.height
         */
        height?: string;
    }

    interface Xl {
        /**
         * Font size of xl
         *
         * @designToken badge.xl.font.size
         */
        fontSize?: string;
        /**
         * Min width of xl
         *
         * @designToken badge.xl.min.width
         */
        minWidth?: string;
        /**
         * Height of xl
         *
         * @designToken badge.xl.height
         */
        height?: string;
    }

    interface Primary {
        /**
         * Background of primary
         *
         * @designToken badge.primary.background
         */
        background?: string;
        /**
         * Color of primary
         *
         * @designToken badge.primary.color
         */
        color?: string;
    }

    interface Secondary {
        /**
         * Background of secondary
         *
         * @designToken badge.secondary.background
         */
        background?: string;
        /**
         * Color of secondary
         *
         * @designToken badge.secondary.color
         */
        color?: string;
    }

    interface Success {
        /**
         * Background of success
         *
         * @designToken badge.success.background
         */
        background?: string;
        /**
         * Color of success
         *
         * @designToken badge.success.color
         */
        color?: string;
    }

    interface Info {
        /**
         * Background of info
         *
         * @designToken badge.info.background
         */
        background?: string;
        /**
         * Color of info
         *
         * @designToken badge.info.color
         */
        color?: string;
    }

    interface Warn {
        /**
         * Background of warn
         *
         * @designToken badge.warn.background
         */
        background?: string;
        /**
         * Color of warn
         *
         * @designToken badge.warn.color
         */
        color?: string;
    }

    interface Danger {
        /**
         * Background of danger
         *
         * @designToken badge.danger.background
         */
        background?: string;
        /**
         * Color of danger
         *
         * @designToken badge.danger.color
         */
        color?: string;
    }

    interface Contrast {
        /**
         * Background of contrast
         *
         * @designToken badge.contrast.background
         */
        background?: string;
        /**
         * Color of contrast
         *
         * @designToken badge.contrast.color
         */
        color?: string;
    }

    /* Static Sections */
    type ColorScheme = CS<BadgeDesignTokens>;
    type CSS = ExtendedCSS;
    type Extend = ExtendedTokens;
}

/**
 *
 * _Badge Design Tokens_
 *
 * @group components
 * @module badge
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
export interface BadgeDesignTokens extends DesignTokens<BadgeDesignTokens> {
    /**
     * Used to pass tokens of the root section
     */
    root?: BadgeTokenSections.Root;
    /**
     * Used to pass tokens of the dot section
     */
    dot?: BadgeTokenSections.Dot;
    /**
     * Used to pass tokens of the sm section
     */
    sm?: BadgeTokenSections.Sm;
    /**
     * Used to pass tokens of the lg section
     */
    lg?: BadgeTokenSections.Lg;
    /**
     * Used to pass tokens of the xl section
     */
    xl?: BadgeTokenSections.Xl;
    /**
     * Used to pass tokens of the primary section
     */
    primary?: BadgeTokenSections.Primary;
    /**
     * Used to pass tokens of the secondary section
     */
    secondary?: BadgeTokenSections.Secondary;
    /**
     * Used to pass tokens of the success section
     */
    success?: BadgeTokenSections.Success;
    /**
     * Used to pass tokens of the info section
     */
    info?: BadgeTokenSections.Info;
    /**
     * Used to pass tokens of the warn section
     */
    warn?: BadgeTokenSections.Warn;
    /**
     * Used to pass tokens of the danger section
     */
    danger?: BadgeTokenSections.Danger;
    /**
     * Used to pass tokens of the contrast section
     */
    contrast?: BadgeTokenSections.Contrast;
}
