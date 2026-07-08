/**
 *
 * Drawer Design Tokens
 *
 * @module drawer
 *
 */

import type { ColorScheme as CS, DesignTokens, ExtendedCSS, ExtendedTokens } from '..';

/**
 * Design Token Sections
 */
export declare namespace DrawerTokenSections {
    interface Root {
        /**
         * Background of root
         *
         * @designToken drawer.background
         */
        background?: string;
        /**
         * Border color of root
         *
         * @designToken drawer.border.color
         */
        borderColor?: string;
        /**
         * Color of root
         *
         * @designToken drawer.color
         */
        color?: string;
        /**
         * Shadow of root
         *
         * @designToken drawer.shadow
         */
        shadow?: string;
    }

    interface Header {
        /**
         * Padding of header
         *
         * @designToken drawer.header.padding
         */
        padding?: string;
    }

    interface Title {
        /**
         * Font size of title
         *
         * @designToken drawer.title.font.size
         */
        fontSize?: string;
        /**
         * Font weight of title
         *
         * @designToken drawer.title.font.weight
         */
        fontWeight?: string;
    }

    interface Content {
        /**
         * Padding of content
         *
         * @designToken drawer.content.padding
         */
        padding?: string;
    }

    interface Footer {
        /**
         * Padding of footer
         *
         * @designToken drawer.footer.padding
         */
        padding?: string;
    }

    /* Static Sections */
    type ColorScheme = CS<DrawerDesignTokens>;
    type CSS = ExtendedCSS;
    type Extend = ExtendedTokens;
}

/**
 *
 * _Drawer Design Tokens_
 *
 * @group components
 * @module drawer
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
export interface DrawerDesignTokens extends DesignTokens<DrawerDesignTokens> {
    /**
     * Used to pass tokens of the root section
     */
    root?: DrawerTokenSections.Root;
    /**
     * Used to pass tokens of the header section
     */
    header?: DrawerTokenSections.Header;
    /**
     * Used to pass tokens of the title section
     */
    title?: DrawerTokenSections.Title;
    /**
     * Used to pass tokens of the content section
     */
    content?: DrawerTokenSections.Content;
    /**
     * Used to pass tokens of the footer section
     */
    footer?: DrawerTokenSections.Footer;
}
