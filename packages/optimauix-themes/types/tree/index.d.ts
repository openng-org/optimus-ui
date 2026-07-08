/**
 *
 * Tree Design Tokens
 *
 * @module tree
 *
 */

import type { ColorScheme as CS, DesignTokens, ExtendedCSS, ExtendedTokens } from '..';

/**
 * Design Token Sections
 */
export declare namespace TreeTokenSections {
    interface Root {
        /**
         * Background of root
         *
         * @designToken tree.background
         */
        background?: string;
        /**
         * Color of root
         *
         * @designToken tree.color
         */
        color?: string;
        /**
         * Padding of root
         *
         * @designToken tree.padding
         */
        padding?: string;
        /**
         * Gap of root
         *
         * @designToken tree.gap
         */
        gap?: string;
        /**
         * Indent of root
         *
         * @designToken tree.indent
         */
        indent?: string;
        /**
         * Transition duration of root
         *
         * @designToken tree.transition.duration
         */
        transitionDuration?: string;
    }

    interface Node {
        /**
         * Padding of node
         *
         * @designToken tree.node.padding
         */
        padding?: string;
        /**
         * Border radius of node
         *
         * @designToken tree.node.border.radius
         */
        borderRadius?: string;
        /**
         * Hover background of node
         *
         * @designToken tree.node.hover.background
         */
        hoverBackground?: string;
        /**
         * Selected background of node
         *
         * @designToken tree.node.selected.background
         */
        selectedBackground?: string;
        /**
         * Color of node
         *
         * @designToken tree.node.color
         */
        color?: string;
        /**
         * Hover color of node
         *
         * @designToken tree.node.hover.color
         */
        hoverColor?: string;
        /**
         * Selected color of node
         *
         * @designToken tree.node.selected.color
         */
        selectedColor?: string;
        /**
         * Focus ring of node
         */
        focusRing?: {
            /**
             * Focus ring width of node
             *
             * @designToken tree.node.focus.ring.width
             */
            width?: string;
            /**
             * Focus ring style of node
             *
             * @designToken tree.node.focus.ring.style
             */
            style?: string;
            /**
             * Focus ring color of node
             *
             * @designToken tree.node.focus.ring.color
             */
            color?: string;
            /**
             * Focus ring offset of node
             *
             * @designToken tree.node.focus.ring.offset
             */
            offset?: string;
            /**
             * Focus ring shadow of node
             *
             * @designToken tree.node.focus.ring.shadow
             */
            shadow?: string;
        };
        /**
         * Gap of node
         *
         * @designToken tree.node.gap
         */
        gap?: string;
    }

    interface NodeIcon {
        /**
         * Color of node icon
         *
         * @designToken tree.node.icon.color
         */
        color?: string;
        /**
         * Hover color of node icon
         *
         * @designToken tree.node.icon.hover.color
         */
        hoverColor?: string;
        /**
         * Selected color of node icon
         *
         * @designToken tree.node.icon.selected.color
         */
        selectedColor?: string;
    }

    interface NodeToggleButton {
        /**
         * Border radius of node toggle button
         *
         * @designToken tree.node.toggle.button.border.radius
         */
        borderRadius?: string;
        /**
         * Size of node toggle button
         *
         * @designToken tree.node.toggle.button.size
         */
        size?: string;
        /**
         * Hover background of node toggle button
         *
         * @designToken tree.node.toggle.button.hover.background
         */
        hoverBackground?: string;
        /**
         * Selected hover background of node toggle button
         *
         * @designToken tree.node.toggle.button.selected.hover.background
         */
        selectedHoverBackground?: string;
        /**
         * Color of node toggle button
         *
         * @designToken tree.node.toggle.button.color
         */
        color?: string;
        /**
         * Hover color of node toggle button
         *
         * @designToken tree.node.toggle.button.hover.color
         */
        hoverColor?: string;
        /**
         * Selected hover color of node toggle button
         *
         * @designToken tree.node.toggle.button.selected.hover.color
         */
        selectedHoverColor?: string;
        /**
         * Focus ring of node toggle button
         */
        focusRing?: {
            /**
             * Focus ring width of node toggle button
             *
             * @designToken tree.node.toggle.button.focus.ring.width
             */
            width?: string;
            /**
             * Focus ring style of node toggle button
             *
             * @designToken tree.node.toggle.button.focus.ring.style
             */
            style?: string;
            /**
             * Focus ring color of node toggle button
             *
             * @designToken tree.node.toggle.button.focus.ring.color
             */
            color?: string;
            /**
             * Focus ring offset of node toggle button
             *
             * @designToken tree.node.toggle.button.focus.ring.offset
             */
            offset?: string;
            /**
             * Focus ring shadow of node toggle button
             *
             * @designToken tree.node.toggle.button.focus.ring.shadow
             */
            shadow?: string;
        };
    }

    interface LoadingIcon {
        /**
         * Size of loading icon
         *
         * @designToken tree.loading.icon.size
         */
        size?: string;
    }

    interface Filter {
        /**
         * Margin of filter
         *
         * @designToken tree.filter.margin
         */
        margin?: string;
    }

    /* Static Sections */
    type ColorScheme = CS<TreeDesignTokens>;
    type CSS = ExtendedCSS;
    type Extend = ExtendedTokens;
}

/**
 *
 * _Tree Design Tokens_
 *
 * @group components
 * @module tree
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
export interface TreeDesignTokens extends DesignTokens<TreeDesignTokens> {
    /**
     * Used to pass tokens of the root section
     */
    root?: TreeTokenSections.Root;
    /**
     * Used to pass tokens of the node section
     */
    node?: TreeTokenSections.Node;
    /**
     * Used to pass tokens of the node icon section
     */
    nodeIcon?: TreeTokenSections.NodeIcon;
    /**
     * Used to pass tokens of the node toggle button section
     */
    nodeToggleButton?: TreeTokenSections.NodeToggleButton;
    /**
     * Used to pass tokens of the loading icon section
     */
    loadingIcon?: TreeTokenSections.LoadingIcon;
    /**
     * Used to pass tokens of the filter section
     */
    filter?: TreeTokenSections.Filter;
}
