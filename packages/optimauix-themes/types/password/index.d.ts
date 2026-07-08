/**
 *
 * Password Design Tokens
 *
 * @module password
 *
 */

import type { ColorScheme as CS, DesignTokens, ExtendedCSS, ExtendedTokens } from '..';

/**
 * Design Token Sections
 */
export declare namespace PasswordTokenSections {
    interface Meter {
        /**
         * Background of meter
         *
         * @designToken password.meter.background
         */
        background?: string;
        /**
         * Border radius of meter
         *
         * @designToken password.meter.border.radius
         */
        borderRadius?: string;
        /**
         * Height of meter
         *
         * @designToken password.meter.height
         */
        height?: string;
    }

    interface Icon {
        /**
         * Color of icon
         *
         * @designToken password.icon.color
         */
        color?: string;
    }

    interface Overlay {
        /**
         * Background of overlay
         *
         * @designToken password.overlay.background
         */
        background?: string;
        /**
         * Border color of overlay
         *
         * @designToken password.overlay.border.color
         */
        borderColor?: string;
        /**
         * Border radius of overlay
         *
         * @designToken password.overlay.border.radius
         */
        borderRadius?: string;
        /**
         * Color of overlay
         *
         * @designToken password.overlay.color
         */
        color?: string;
        /**
         * Padding of overlay
         *
         * @designToken password.overlay.padding
         */
        padding?: string;
        /**
         * Shadow of overlay
         *
         * @designToken password.overlay.shadow
         */
        shadow?: string;
    }

    interface Content {
        /**
         * Gap of content
         *
         * @designToken password.content.gap
         */
        gap?: string;
    }

    interface Strength {
        /**
         * Weak background of strength
         *
         * @designToken password.strength.weak.background
         */
        weakBackground?: string;
        /**
         * Medium background of strength
         *
         * @designToken password.strength.medium.background
         */
        mediumBackground?: string;
        /**
         * Strong background of strength
         *
         * @designToken password.strength.strong.background
         */
        strongBackground?: string;
    }

    /* Static Sections */
    type ColorScheme = CS<PasswordDesignTokens>;
    type CSS = ExtendedCSS;
    type Extend = ExtendedTokens;
}

/**
 *
 * _Password Design Tokens_
 *
 * @group components
 * @module password
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
export interface PasswordDesignTokens extends DesignTokens<PasswordDesignTokens> {
    /**
     * Used to pass tokens of the meter section
     */
    meter?: PasswordTokenSections.Meter;
    /**
     * Used to pass tokens of the icon section
     */
    icon?: PasswordTokenSections.Icon;
    /**
     * Used to pass tokens of the overlay section
     */
    overlay?: PasswordTokenSections.Overlay;
    /**
     * Used to pass tokens of the content section
     */
    content?: PasswordTokenSections.Content;
    /**
     * Used to pass tokens of the strength section
     */
    strength?: PasswordTokenSections.Strength;
}
