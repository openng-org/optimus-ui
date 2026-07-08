/**
 *
 * AutoComplete Design Tokens
 *
 * @module autocomplete
 *
 */

import type { ColorScheme as CS, DesignTokens, ExtendedCSS, ExtendedTokens } from '..';

/**
 * Design Token Sections
 */
export declare namespace AutoCompleteTokenSections {
    interface Root {
        /**
         * Background of root
         *
         * @designToken autocomplete.background
         */
        background?: string;
        /**
         * Disabled background of root
         *
         * @designToken autocomplete.disabled.background
         */
        disabledBackground?: string;
        /**
         * Filled background of root
         *
         * @designToken autocomplete.filled.background
         */
        filledBackground?: string;
        /**
         * Filled hover background of root
         *
         * @designToken autocomplete.filled.hover.background
         */
        filledHoverBackground?: string;
        /**
         * Filled focus background of root
         *
         * @designToken autocomplete.filled.focus.background
         */
        filledFocusBackground?: string;
        /**
         * Border color of root
         *
         * @designToken autocomplete.border.color
         */
        borderColor?: string;
        /**
         * Hover border color of root
         *
         * @designToken autocomplete.hover.border.color
         */
        hoverBorderColor?: string;
        /**
         * Focus border color of root
         *
         * @designToken autocomplete.focus.border.color
         */
        focusBorderColor?: string;
        /**
         * Invalid border color of root
         *
         * @designToken autocomplete.invalid.border.color
         */
        invalidBorderColor?: string;
        /**
         * Color of root
         *
         * @designToken autocomplete.color
         */
        color?: string;
        /**
         * Disabled color of root
         *
         * @designToken autocomplete.disabled.color
         */
        disabledColor?: string;
        /**
         * Placeholder color of root
         *
         * @designToken autocomplete.placeholder.color
         */
        placeholderColor?: string;
        /**
         * Invalid placeholder color of root
         *
         * @designToken autocomplete.invalid.placeholder.color
         */
        invalidPlaceholderColor?: string;
        /**
         * Shadow of root
         *
         * @designToken autocomplete.shadow
         */
        shadow?: string;
        /**
         * Padding x of root
         *
         * @designToken autocomplete.padding.x
         */
        paddingX?: string;
        /**
         * Padding y of root
         *
         * @designToken autocomplete.padding.y
         */
        paddingY?: string;
        /**
         * Border radius of root
         *
         * @designToken autocomplete.border.radius
         */
        borderRadius?: string;
        /**
         * Focus ring of root
         */
        focusRing?: {
            /**
             * Focus ring width of root
             *
             * @designToken autocomplete.focus.ring.width
             */
            width?: string;
            /**
             * Focus ring style of root
             *
             * @designToken autocomplete.focus.ring.style
             */
            style?: string;
            /**
             * Focus ring color of root
             *
             * @designToken autocomplete.focus.ring.color
             */
            color?: string;
            /**
             * Focus ring offset of root
             *
             * @designToken autocomplete.focus.ring.offset
             */
            offset?: string;
            /**
             * Focus ring shadow of root
             *
             * @designToken autocomplete.focus.ring.shadow
             */
            shadow?: string;
        };
        /**
         * Transition duration of root
         *
         * @designToken autocomplete.transition.duration
         */
        transitionDuration?: string;
    }

    interface Overlay {
        /**
         * Background of overlay
         *
         * @designToken autocomplete.overlay.background
         */
        background?: string;
        /**
         * Border color of overlay
         *
         * @designToken autocomplete.overlay.border.color
         */
        borderColor?: string;
        /**
         * Border radius of overlay
         *
         * @designToken autocomplete.overlay.border.radius
         */
        borderRadius?: string;
        /**
         * Color of overlay
         *
         * @designToken autocomplete.overlay.color
         */
        color?: string;
        /**
         * Shadow of overlay
         *
         * @designToken autocomplete.overlay.shadow
         */
        shadow?: string;
    }

    interface List {
        /**
         * Padding of list
         *
         * @designToken autocomplete.list.padding
         */
        padding?: string;
        /**
         * Gap of list
         *
         * @designToken autocomplete.list.gap
         */
        gap?: string;
    }

    interface Option {
        /**
         * Focus background of option
         *
         * @designToken autocomplete.option.focus.background
         */
        focusBackground?: string;
        /**
         * Selected background of option
         *
         * @designToken autocomplete.option.selected.background
         */
        selectedBackground?: string;
        /**
         * Selected focus background of option
         *
         * @designToken autocomplete.option.selected.focus.background
         */
        selectedFocusBackground?: string;
        /**
         * Color of option
         *
         * @designToken autocomplete.option.color
         */
        color?: string;
        /**
         * Focus color of option
         *
         * @designToken autocomplete.option.focus.color
         */
        focusColor?: string;
        /**
         * Selected color of option
         *
         * @designToken autocomplete.option.selected.color
         */
        selectedColor?: string;
        /**
         * Selected focus color of option
         *
         * @designToken autocomplete.option.selected.focus.color
         */
        selectedFocusColor?: string;
        /**
         * Padding of option
         *
         * @designToken autocomplete.option.padding
         */
        padding?: string;
        /**
         * Border radius of option
         *
         * @designToken autocomplete.option.border.radius
         */
        borderRadius?: string;
    }

    interface OptionGroup {
        /**
         * Background of option group
         *
         * @designToken autocomplete.option.group.background
         */
        background?: string;
        /**
         * Color of option group
         *
         * @designToken autocomplete.option.group.color
         */
        color?: string;
        /**
         * Font weight of option group
         *
         * @designToken autocomplete.option.group.font.weight
         */
        fontWeight?: string;
        /**
         * Padding of option group
         *
         * @designToken autocomplete.option.group.padding
         */
        padding?: string;
    }

    interface Dropdown {
        /**
         * Width of dropdown
         *
         * @designToken autocomplete.dropdown.width
         */
        width?: string;
        /**
         * Sm of dropdown
         */
        sm?: {
            /**
             * Sm width of dropdown
             *
             * @designToken autocomplete.dropdown.sm.width
             */
            width?: string;
        };
        /**
         * Lg of dropdown
         */
        lg?: {
            /**
             * Lg width of dropdown
             *
             * @designToken autocomplete.dropdown.lg.width
             */
            width?: string;
        };
        /**
         * Border color of dropdown
         *
         * @designToken autocomplete.dropdown.border.color
         */
        borderColor?: string;
        /**
         * Hover border color of dropdown
         *
         * @designToken autocomplete.dropdown.hover.border.color
         */
        hoverBorderColor?: string;
        /**
         * Active border color of dropdown
         *
         * @designToken autocomplete.dropdown.active.border.color
         */
        activeBorderColor?: string;
        /**
         * Border radius of dropdown
         *
         * @designToken autocomplete.dropdown.border.radius
         */
        borderRadius?: string;
        /**
         * Focus ring of dropdown
         */
        focusRing?: {
            /**
             * Focus ring width of dropdown
             *
             * @designToken autocomplete.dropdown.focus.ring.width
             */
            width?: string;
            /**
             * Focus ring style of dropdown
             *
             * @designToken autocomplete.dropdown.focus.ring.style
             */
            style?: string;
            /**
             * Focus ring color of dropdown
             *
             * @designToken autocomplete.dropdown.focus.ring.color
             */
            color?: string;
            /**
             * Focus ring offset of dropdown
             *
             * @designToken autocomplete.dropdown.focus.ring.offset
             */
            offset?: string;
            /**
             * Focus ring shadow of dropdown
             *
             * @designToken autocomplete.dropdown.focus.ring.shadow
             */
            shadow?: string;
        };
        /**
         * Background of dropdown
         *
         * @designToken autocomplete.dropdown.background
         */
        background?: string;
        /**
         * Hover background of dropdown
         *
         * @designToken autocomplete.dropdown.hover.background
         */
        hoverBackground?: string;
        /**
         * Active background of dropdown
         *
         * @designToken autocomplete.dropdown.active.background
         */
        activeBackground?: string;
        /**
         * Color of dropdown
         *
         * @designToken autocomplete.dropdown.color
         */
        color?: string;
        /**
         * Hover color of dropdown
         *
         * @designToken autocomplete.dropdown.hover.color
         */
        hoverColor?: string;
        /**
         * Active color of dropdown
         *
         * @designToken autocomplete.dropdown.active.color
         */
        activeColor?: string;
    }

    interface Chip {
        /**
         * Border radius of chip
         *
         * @designToken autocomplete.chip.border.radius
         */
        borderRadius?: string;
        /**
         * Focus background of chip
         *
         * @designToken autocomplete.chip.focus.background
         */
        focusBackground?: string;
        /**
         * Focus color of chip
         *
         * @designToken autocomplete.chip.focus.color
         */
        focusColor?: string;
    }

    interface EmptyMessage {
        /**
         * Padding of empty message
         *
         * @designToken autocomplete.empty.message.padding
         */
        padding?: string;
    }

    /* Static Sections */
    type ColorScheme = CS<AutoCompleteDesignTokens>;
    type CSS = ExtendedCSS;
    type Extend = ExtendedTokens;
}

/**
 *
 * _AutoComplete Design Tokens_
 *
 * @group components
 * @module autocomplete
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
export interface AutoCompleteDesignTokens extends DesignTokens<AutoCompleteDesignTokens> {
    /**
     * Used to pass tokens of the root section
     */
    root?: AutoCompleteTokenSections.Root;
    /**
     * Used to pass tokens of the overlay section
     */
    overlay?: AutoCompleteTokenSections.Overlay;
    /**
     * Used to pass tokens of the list section
     */
    list?: AutoCompleteTokenSections.List;
    /**
     * Used to pass tokens of the option section
     */
    option?: AutoCompleteTokenSections.Option;
    /**
     * Used to pass tokens of the option group section
     */
    optionGroup?: AutoCompleteTokenSections.OptionGroup;
    /**
     * Used to pass tokens of the dropdown section
     */
    dropdown?: AutoCompleteTokenSections.Dropdown;
    /**
     * Used to pass tokens of the chip section
     */
    chip?: AutoCompleteTokenSections.Chip;
    /**
     * Used to pass tokens of the empty message section
     */
    emptyMessage?: AutoCompleteTokenSections.EmptyMessage;
}
