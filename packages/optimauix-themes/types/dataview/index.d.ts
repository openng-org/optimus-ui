/**
 *
 * DataView Design Tokens
 *
 * @module dataview
 *
 */

import type { ColorScheme as CS, DesignTokens, ExtendedCSS, ExtendedTokens } from '..';

/**
 * Design Token Sections
 */
export declare namespace DataViewTokenSections {
    interface Root {
        /**
         * Border color of root
         *
         * @designToken dataview.border.color
         */
        borderColor?: string;
        /**
         * Border width of root
         *
         * @designToken dataview.border.width
         */
        borderWidth?: string;
        /**
         * Border radius of root
         *
         * @designToken dataview.border.radius
         */
        borderRadius?: string;
        /**
         * Padding of root
         *
         * @designToken dataview.padding
         */
        padding?: string;
    }

    interface Header {
        /**
         * Background of header
         *
         * @designToken dataview.header.background
         */
        background?: string;
        /**
         * Color of header
         *
         * @designToken dataview.header.color
         */
        color?: string;
        /**
         * Border color of header
         *
         * @designToken dataview.header.border.color
         */
        borderColor?: string;
        /**
         * Border width of header
         *
         * @designToken dataview.header.border.width
         */
        borderWidth?: string;
        /**
         * Padding of header
         *
         * @designToken dataview.header.padding
         */
        padding?: string;
        /**
         * Border radius of header
         *
         * @designToken dataview.header.border.radius
         */
        borderRadius?: string;
    }

    interface Content {
        /**
         * Background of content
         *
         * @designToken dataview.content.background
         */
        background?: string;
        /**
         * Color of content
         *
         * @designToken dataview.content.color
         */
        color?: string;
        /**
         * Border color of content
         *
         * @designToken dataview.content.border.color
         */
        borderColor?: string;
        /**
         * Border width of content
         *
         * @designToken dataview.content.border.width
         */
        borderWidth?: string;
        /**
         * Padding of content
         *
         * @designToken dataview.content.padding
         */
        padding?: string;
        /**
         * Border radius of content
         *
         * @designToken dataview.content.border.radius
         */
        borderRadius?: string;
    }

    interface Footer {
        /**
         * Background of footer
         *
         * @designToken dataview.footer.background
         */
        background?: string;
        /**
         * Color of footer
         *
         * @designToken dataview.footer.color
         */
        color?: string;
        /**
         * Border color of footer
         *
         * @designToken dataview.footer.border.color
         */
        borderColor?: string;
        /**
         * Border width of footer
         *
         * @designToken dataview.footer.border.width
         */
        borderWidth?: string;
        /**
         * Padding of footer
         *
         * @designToken dataview.footer.padding
         */
        padding?: string;
        /**
         * Border radius of footer
         *
         * @designToken dataview.footer.border.radius
         */
        borderRadius?: string;
    }

    interface PaginatorTop {
        /**
         * Border color of paginator top
         *
         * @designToken dataview.paginator.top.border.color
         */
        borderColor?: string;
        /**
         * Border width of paginator top
         *
         * @designToken dataview.paginator.top.border.width
         */
        borderWidth?: string;
    }

    interface PaginatorBottom {
        /**
         * Border color of paginator bottom
         *
         * @designToken dataview.paginator.bottom.border.color
         */
        borderColor?: string;
        /**
         * Border width of paginator bottom
         *
         * @designToken dataview.paginator.bottom.border.width
         */
        borderWidth?: string;
    }

    /* Static Sections */
    type ColorScheme = CS<DataViewDesignTokens>;
    type CSS = ExtendedCSS;
    type Extend = ExtendedTokens;
}

/**
 *
 * _DataView Design Tokens_
 *
 * @group components
 * @module dataview
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
export interface DataViewDesignTokens extends DesignTokens<DataViewDesignTokens> {
    /**
     * Used to pass tokens of the root section
     */
    root?: DataViewTokenSections.Root;
    /**
     * Used to pass tokens of the header section
     */
    header?: DataViewTokenSections.Header;
    /**
     * Used to pass tokens of the content section
     */
    content?: DataViewTokenSections.Content;
    /**
     * Used to pass tokens of the footer section
     */
    footer?: DataViewTokenSections.Footer;
    /**
     * Used to pass tokens of the paginator top section
     */
    paginatorTop?: DataViewTokenSections.PaginatorTop;
    /**
     * Used to pass tokens of the paginator bottom section
     */
    paginatorBottom?: DataViewTokenSections.PaginatorBottom;
}
