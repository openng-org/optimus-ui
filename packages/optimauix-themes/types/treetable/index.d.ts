/**
 *
 * TreeTable Design Tokens
 *
 * @module treetable
 *
 */

import type { ColorScheme as CS, DesignTokens, ExtendedCSS, ExtendedTokens } from '..';

/**
 * Design Token Sections
 */
export declare namespace TreeTableTokenSections {
    interface Root {
        /**
         * Transition duration of root
         *
         * @designToken treetable.transition.duration
         */
        transitionDuration?: string;
        /**
         * Border color of root
         *
         * @designToken treetable.border.color
         */
        borderColor?: string;
    }

    interface Header {
        /**
         * Background of header
         *
         * @designToken treetable.header.background
         */
        background?: string;
        /**
         * Border color of header
         *
         * @designToken treetable.header.border.color
         */
        borderColor?: string;
        /**
         * Color of header
         *
         * @designToken treetable.header.color
         */
        color?: string;
        /**
         * Border width of header
         *
         * @designToken treetable.header.border.width
         */
        borderWidth?: string;
        /**
         * Padding of header
         *
         * @designToken treetable.header.padding
         */
        padding?: string;
    }

    interface HeaderCell {
        /**
         * Background of header cell
         *
         * @designToken treetable.header.cell.background
         */
        background?: string;
        /**
         * Hover background of header cell
         *
         * @designToken treetable.header.cell.hover.background
         */
        hoverBackground?: string;
        /**
         * Selected background of header cell
         *
         * @designToken treetable.header.cell.selected.background
         */
        selectedBackground?: string;
        /**
         * Border color of header cell
         *
         * @designToken treetable.header.cell.border.color
         */
        borderColor?: string;
        /**
         * Color of header cell
         *
         * @designToken treetable.header.cell.color
         */
        color?: string;
        /**
         * Hover color of header cell
         *
         * @designToken treetable.header.cell.hover.color
         */
        hoverColor?: string;
        /**
         * Selected color of header cell
         *
         * @designToken treetable.header.cell.selected.color
         */
        selectedColor?: string;
        /**
         * Gap of header cell
         *
         * @designToken treetable.header.cell.gap
         */
        gap?: string;
        /**
         * Padding of header cell
         *
         * @designToken treetable.header.cell.padding
         */
        padding?: string;
        /**
         * Focus ring of header cell
         */
        focusRing?: {
            /**
             * Focus ring width of header cell
             *
             * @designToken treetable.header.cell.focus.ring.width
             */
            width?: string;
            /**
             * Focus ring style of header cell
             *
             * @designToken treetable.header.cell.focus.ring.style
             */
            style?: string;
            /**
             * Focus ring color of header cell
             *
             * @designToken treetable.header.cell.focus.ring.color
             */
            color?: string;
            /**
             * Focus ring offset of header cell
             *
             * @designToken treetable.header.cell.focus.ring.offset
             */
            offset?: string;
            /**
             * Focus ring shadow of header cell
             *
             * @designToken treetable.header.cell.focus.ring.shadow
             */
            shadow?: string;
        };
    }

    interface ColumnTitle {
        /**
         * Font weight of column title
         *
         * @designToken treetable.column.title.font.weight
         */
        fontWeight?: string;
    }

    interface Row {
        /**
         * Background of row
         *
         * @designToken treetable.row.background
         */
        background?: string;
        /**
         * Hover background of row
         *
         * @designToken treetable.row.hover.background
         */
        hoverBackground?: string;
        /**
         * Selected background of row
         *
         * @designToken treetable.row.selected.background
         */
        selectedBackground?: string;
        /**
         * Color of row
         *
         * @designToken treetable.row.color
         */
        color?: string;
        /**
         * Hover color of row
         *
         * @designToken treetable.row.hover.color
         */
        hoverColor?: string;
        /**
         * Selected color of row
         *
         * @designToken treetable.row.selected.color
         */
        selectedColor?: string;
        /**
         * Focus ring of row
         */
        focusRing?: {
            /**
             * Focus ring width of row
             *
             * @designToken treetable.row.focus.ring.width
             */
            width?: string;
            /**
             * Focus ring style of row
             *
             * @designToken treetable.row.focus.ring.style
             */
            style?: string;
            /**
             * Focus ring color of row
             *
             * @designToken treetable.row.focus.ring.color
             */
            color?: string;
            /**
             * Focus ring offset of row
             *
             * @designToken treetable.row.focus.ring.offset
             */
            offset?: string;
            /**
             * Focus ring shadow of row
             *
             * @designToken treetable.row.focus.ring.shadow
             */
            shadow?: string;
        };
    }

    interface BodyCell {
        /**
         * Border color of body cell
         *
         * @designToken treetable.body.cell.border.color
         */
        borderColor?: string;
        /**
         * Padding of body cell
         *
         * @designToken treetable.body.cell.padding
         */
        padding?: string;
        /**
         * Gap of body cell
         *
         * @designToken treetable.body.cell.gap
         */
        gap?: string;
        /**
         * Selected border color of body cell
         *
         * @designToken treetable.body.cell.selected.border.color
         */
        selectedBorderColor?: string;
    }

    interface FooterCell {
        /**
         * Background of footer cell
         *
         * @designToken treetable.footer.cell.background
         */
        background?: string;
        /**
         * Border color of footer cell
         *
         * @designToken treetable.footer.cell.border.color
         */
        borderColor?: string;
        /**
         * Color of footer cell
         *
         * @designToken treetable.footer.cell.color
         */
        color?: string;
        /**
         * Padding of footer cell
         *
         * @designToken treetable.footer.cell.padding
         */
        padding?: string;
    }

    interface ColumnFooter {
        /**
         * Font weight of column footer
         *
         * @designToken treetable.column.footer.font.weight
         */
        fontWeight?: string;
    }

    interface Footer {
        /**
         * Background of footer
         *
         * @designToken treetable.footer.background
         */
        background?: string;
        /**
         * Border color of footer
         *
         * @designToken treetable.footer.border.color
         */
        borderColor?: string;
        /**
         * Color of footer
         *
         * @designToken treetable.footer.color
         */
        color?: string;
        /**
         * Border width of footer
         *
         * @designToken treetable.footer.border.width
         */
        borderWidth?: string;
        /**
         * Padding of footer
         *
         * @designToken treetable.footer.padding
         */
        padding?: string;
    }

    interface ColumnResizer {
        /**
         * Width of column resizer
         *
         * @designToken treetable.column.resizer.width
         */
        width?: string;
    }

    interface ResizeIndicator {
        /**
         * Width of resize indicator
         *
         * @designToken treetable.resize.indicator.width
         */
        width?: string;
        /**
         * Color of resize indicator
         *
         * @designToken treetable.resize.indicator.color
         */
        color?: string;
    }

    interface SortIcon {
        /**
         * Color of sort icon
         *
         * @designToken treetable.sort.icon.color
         */
        color?: string;
        /**
         * Hover color of sort icon
         *
         * @designToken treetable.sort.icon.hover.color
         */
        hoverColor?: string;
        /**
         * Size of sort icon
         *
         * @designToken treetable.sort.icon.size
         */
        size?: string;
    }

    interface LoadingIcon {
        /**
         * Size of loading icon
         *
         * @designToken treetable.loading.icon.size
         */
        size?: string;
    }

    interface NodeToggleButton {
        /**
         * Hover background of node toggle button
         *
         * @designToken treetable.node.toggle.button.hover.background
         */
        hoverBackground?: string;
        /**
         * Selected hover background of node toggle button
         *
         * @designToken treetable.node.toggle.button.selected.hover.background
         */
        selectedHoverBackground?: string;
        /**
         * Color of node toggle button
         *
         * @designToken treetable.node.toggle.button.color
         */
        color?: string;
        /**
         * Hover color of node toggle button
         *
         * @designToken treetable.node.toggle.button.hover.color
         */
        hoverColor?: string;
        /**
         * Selected hover color of node toggle button
         *
         * @designToken treetable.node.toggle.button.selected.hover.color
         */
        selectedHoverColor?: string;
        /**
         * Size of node toggle button
         *
         * @designToken treetable.node.toggle.button.size
         */
        size?: string;
        /**
         * Border radius of node toggle button
         *
         * @designToken treetable.node.toggle.button.border.radius
         */
        borderRadius?: string;
        /**
         * Focus ring of node toggle button
         */
        focusRing?: {
            /**
             * Focus ring width of node toggle button
             *
             * @designToken treetable.node.toggle.button.focus.ring.width
             */
            width?: string;
            /**
             * Focus ring style of node toggle button
             *
             * @designToken treetable.node.toggle.button.focus.ring.style
             */
            style?: string;
            /**
             * Focus ring color of node toggle button
             *
             * @designToken treetable.node.toggle.button.focus.ring.color
             */
            color?: string;
            /**
             * Focus ring offset of node toggle button
             *
             * @designToken treetable.node.toggle.button.focus.ring.offset
             */
            offset?: string;
            /**
             * Focus ring shadow of node toggle button
             *
             * @designToken treetable.node.toggle.button.focus.ring.shadow
             */
            shadow?: string;
        };
    }

    interface PaginatorTop {
        /**
         * Border color of paginator top
         *
         * @designToken treetable.paginator.top.border.color
         */
        borderColor?: string;
        /**
         * Border width of paginator top
         *
         * @designToken treetable.paginator.top.border.width
         */
        borderWidth?: string;
    }

    interface PaginatorBottom {
        /**
         * Border color of paginator bottom
         *
         * @designToken treetable.paginator.bottom.border.color
         */
        borderColor?: string;
        /**
         * Border width of paginator bottom
         *
         * @designToken treetable.paginator.bottom.border.width
         */
        borderWidth?: string;
    }

    /* Static Sections */
    type ColorScheme = CS<TreeTableDesignTokens>;
    type CSS = ExtendedCSS;
    type Extend = ExtendedTokens;
}

/**
 *
 * _TreeTable Design Tokens_
 *
 * @group components
 * @module treetable
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
export interface TreeTableDesignTokens extends DesignTokens<TreeTableDesignTokens> {
    /**
     * Used to pass tokens of the root section
     */
    root?: TreeTableTokenSections.Root;
    /**
     * Used to pass tokens of the header section
     */
    header?: TreeTableTokenSections.Header;
    /**
     * Used to pass tokens of the header cell section
     */
    headerCell?: TreeTableTokenSections.HeaderCell;
    /**
     * Used to pass tokens of the column title section
     */
    columnTitle?: TreeTableTokenSections.ColumnTitle;
    /**
     * Used to pass tokens of the row section
     */
    row?: TreeTableTokenSections.Row;
    /**
     * Used to pass tokens of the body cell section
     */
    bodyCell?: TreeTableTokenSections.BodyCell;
    /**
     * Used to pass tokens of the footer cell section
     */
    footerCell?: TreeTableTokenSections.FooterCell;
    /**
     * Used to pass tokens of the column footer section
     */
    columnFooter?: TreeTableTokenSections.ColumnFooter;
    /**
     * Used to pass tokens of the footer section
     */
    footer?: TreeTableTokenSections.Footer;
    /**
     * Used to pass tokens of the column resizer section
     */
    columnResizer?: TreeTableTokenSections.ColumnResizer;
    /**
     * Used to pass tokens of the resize indicator section
     */
    resizeIndicator?: TreeTableTokenSections.ResizeIndicator;
    /**
     * Used to pass tokens of the sort icon section
     */
    sortIcon?: TreeTableTokenSections.SortIcon;
    /**
     * Used to pass tokens of the loading icon section
     */
    loadingIcon?: TreeTableTokenSections.LoadingIcon;
    /**
     * Used to pass tokens of the node toggle button section
     */
    nodeToggleButton?: TreeTableTokenSections.NodeToggleButton;
    /**
     * Used to pass tokens of the paginator top section
     */
    paginatorTop?: TreeTableTokenSections.PaginatorTop;
    /**
     * Used to pass tokens of the paginator bottom section
     */
    paginatorBottom?: TreeTableTokenSections.PaginatorBottom;
}
