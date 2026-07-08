/**
 *
 * Panel Design Tokens
 *
 * @module panel
 *
 */

import type { ColorScheme as CS, DesignTokens, ExtendedCSS, ExtendedTokens } from '..';

/**
 * Design Token Sections
 */
export declare namespace PanelTokenSections {
    interface Root {
        /**
         * Background of root
         *
         * @designToken panel.background
         */
        background?: string;
        /**
         * Border color of root
         *
         * @designToken panel.border.color
         */
        borderColor?: string;
        /**
         * Color of root
         *
         * @designToken panel.color
         */
        color?: string;
        /**
         * Border radius of root
         *
         * @designToken panel.border.radius
         */
        borderRadius?: string;
    }

    interface Header {
        /**
         * Background of header
         *
         * @designToken panel.header.background
         */
        background?: string;
        /**
         * Color of header
         *
         * @designToken panel.header.color
         */
        color?: string;
        /**
         * Padding of header
         *
         * @designToken panel.header.padding
         */
        padding?: string;
        /**
         * Border color of header
         *
         * @designToken panel.header.border.color
         */
        borderColor?: string;
        /**
         * Border width of header
         *
         * @designToken panel.header.border.width
         */
        borderWidth?: string;
        /**
         * Border radius of header
         *
         * @designToken panel.header.border.radius
         */
        borderRadius?: string;
    }

    interface ToggleableHeader {
        /**
         * Padding of toggleable header
         *
         * @designToken panel.toggleable.header.padding
         */
        padding?: string;
    }

    interface Title {
        /**
         * Font weight of title
         *
         * @designToken panel.title.font.weight
         */
        fontWeight?: string;
    }

    interface Content {
        /**
         * Padding of content
         *
         * @designToken panel.content.padding
         */
        padding?: string;
    }

    interface Footer {
        /**
         * Padding of footer
         *
         * @designToken panel.footer.padding
         */
        padding?: string;
    }

    /* Static Sections */
    type ColorScheme = CS<PanelDesignTokens>;
    type CSS = ExtendedCSS;
    type Extend = ExtendedTokens;
}

/**
 *
 * _Panel Design Tokens_
 *
 * @group components
 * @module panel
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
export interface PanelDesignTokens extends DesignTokens<PanelDesignTokens> {
    /**
     * Used to pass tokens of the root section
     */
    root?: PanelTokenSections.Root;
    /**
     * Used to pass tokens of the header section
     */
    header?: PanelTokenSections.Header;
    /**
     * Used to pass tokens of the toggleable header section
     */
    toggleableHeader?: PanelTokenSections.ToggleableHeader;
    /**
     * Used to pass tokens of the title section
     */
    title?: PanelTokenSections.Title;
    /**
     * Used to pass tokens of the content section
     */
    content?: PanelTokenSections.Content;
    /**
     * Used to pass tokens of the footer section
     */
    footer?: PanelTokenSections.Footer;
}
