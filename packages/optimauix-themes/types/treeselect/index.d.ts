/**
 *
 * TreeSelect Design Tokens
 *
 * @module treeselect
 *
 */

import type { ColorScheme as CS, DesignTokens, ExtendedCSS, ExtendedTokens } from '..';

/**
 * Design Token Sections
 */
export declare namespace TreeSelectTokenSections {
    interface Root {
        /**
         * Background of root
         *
         * @designToken treeselect.background
         */
        background?: string;
        /**
         * Disabled background of root
         *
         * @designToken treeselect.disabled.background
         */
        disabledBackground?: string;
        /**
         * Filled background of root
         *
         * @designToken treeselect.filled.background
         */
        filledBackground?: string;
        /**
         * Filled hover background of root
         *
         * @designToken treeselect.filled.hover.background
         */
        filledHoverBackground?: string;
        /**
         * Filled focus background of root
         *
         * @designToken treeselect.filled.focus.background
         */
        filledFocusBackground?: string;
        /**
         * Border color of root
         *
         * @designToken treeselect.border.color
         */
        borderColor?: string;
        /**
         * Hover border color of root
         *
         * @designToken treeselect.hover.border.color
         */
        hoverBorderColor?: string;
        /**
         * Focus border color of root
         *
         * @designToken treeselect.focus.border.color
         */
        focusBorderColor?: string;
        /**
         * Invalid border color of root
         *
         * @designToken treeselect.invalid.border.color
         */
        invalidBorderColor?: string;
        /**
         * Color of root
         *
         * @designToken treeselect.color
         */
        color?: string;
        /**
         * Disabled color of root
         *
         * @designToken treeselect.disabled.color
         */
        disabledColor?: string;
        /**
         * Placeholder color of root
         *
         * @designToken treeselect.placeholder.color
         */
        placeholderColor?: string;
        /**
         * Invalid placeholder color of root
         *
         * @designToken treeselect.invalid.placeholder.color
         */
        invalidPlaceholderColor?: string;
        /**
         * Shadow of root
         *
         * @designToken treeselect.shadow
         */
        shadow?: string;
        /**
         * Padding x of root
         *
         * @designToken treeselect.padding.x
         */
        paddingX?: string;
        /**
         * Padding y of root
         *
         * @designToken treeselect.padding.y
         */
        paddingY?: string;
        /**
         * Border radius of root
         *
         * @designToken treeselect.border.radius
         */
        borderRadius?: string;
        /**
         * Focus ring of root
         */
        focusRing?: {
            /**
             * Focus ring width of root
             *
             * @designToken treeselect.focus.ring.width
             */
            width?: string;
            /**
             * Focus ring style of root
             *
             * @designToken treeselect.focus.ring.style
             */
            style?: string;
            /**
             * Focus ring color of root
             *
             * @designToken treeselect.focus.ring.color
             */
            color?: string;
            /**
             * Focus ring offset of root
             *
             * @designToken treeselect.focus.ring.offset
             */
            offset?: string;
            /**
             * Focus ring shadow of root
             *
             * @designToken treeselect.focus.ring.shadow
             */
            shadow?: string;
        };
        /**
         * Transition duration of root
         *
         * @designToken treeselect.transition.duration
         */
        transitionDuration?: string;
        /**
         * Sm of root
         */
        sm?: {
            /**
             * Sm font size of root
             *
             * @designToken treeselect.sm.font.size
             */
            fontSize?: string;
            /**
             * Sm padding x of root
             *
             * @designToken treeselect.sm.padding.x
             */
            paddingX?: string;
            /**
             * Sm padding y of root
             *
             * @designToken treeselect.sm.padding.y
             */
            paddingY?: string;
        };
        /**
         * Lg of root
         */
        lg?: {
            /**
             * Lg font size of root
             *
             * @designToken treeselect.lg.font.size
             */
            fontSize?: string;
            /**
             * Lg padding x of root
             *
             * @designToken treeselect.lg.padding.x
             */
            paddingX?: string;
            /**
             * Lg padding y of root
             *
             * @designToken treeselect.lg.padding.y
             */
            paddingY?: string;
        };
    }

    interface Dropdown {
        /**
         * Width of dropdown
         *
         * @designToken treeselect.dropdown.width
         */
        width?: string;
        /**
         * Color of dropdown
         *
         * @designToken treeselect.dropdown.color
         */
        color?: string;
    }

    interface Overlay {
        /**
         * Background of overlay
         *
         * @designToken treeselect.overlay.background
         */
        background?: string;
        /**
         * Border color of overlay
         *
         * @designToken treeselect.overlay.border.color
         */
        borderColor?: string;
        /**
         * Border radius of overlay
         *
         * @designToken treeselect.overlay.border.radius
         */
        borderRadius?: string;
        /**
         * Color of overlay
         *
         * @designToken treeselect.overlay.color
         */
        color?: string;
        /**
         * Shadow of overlay
         *
         * @designToken treeselect.overlay.shadow
         */
        shadow?: string;
    }

    interface Tree {
        /**
         * Padding of tree
         *
         * @designToken treeselect.tree.padding
         */
        padding?: string;
    }

    interface ClearIcon {
        /**
         * Color of clear icon
         *
         * @designToken treeselect.clear.icon.color
         */
        color?: string;
    }

    interface EmptyMessage {
        /**
         * Padding of empty message
         *
         * @designToken treeselect.empty.message.padding
         */
        padding?: string;
    }

    interface Chip {
        /**
         * Border radius of chip
         *
         * @designToken treeselect.chip.border.radius
         */
        borderRadius?: string;
    }

    /* Static Sections */
    type ColorScheme = CS<TreeSelectDesignTokens>;
    type CSS = ExtendedCSS;
    type Extend = ExtendedTokens;
}

/**
 *
 * _TreeSelect Design Tokens_
 *
 * @group components
 * @module treeselect
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
export interface TreeSelectDesignTokens extends DesignTokens<TreeSelectDesignTokens> {
    /**
     * Used to pass tokens of the root section
     */
    root?: TreeSelectTokenSections.Root;
    /**
     * Used to pass tokens of the dropdown section
     */
    dropdown?: TreeSelectTokenSections.Dropdown;
    /**
     * Used to pass tokens of the overlay section
     */
    overlay?: TreeSelectTokenSections.Overlay;
    /**
     * Used to pass tokens of the tree section
     */
    tree?: TreeSelectTokenSections.Tree;
    /**
     * Used to pass tokens of the clear icon section
     */
    clearIcon?: TreeSelectTokenSections.ClearIcon;
    /**
     * Used to pass tokens of the empty message section
     */
    emptyMessage?: TreeSelectTokenSections.EmptyMessage;
    /**
     * Used to pass tokens of the chip section
     */
    chip?: TreeSelectTokenSections.Chip;
}
