/**
 *
 * Select Design Tokens
 *
 * @module select
 *
 */

import type { ColorScheme as CS, DesignTokens, ExtendedCSS, ExtendedTokens } from '..';

/**
 * Design Token Sections
 */
export declare namespace SelectTokenSections {
    interface Root {
        /**
         * Background of root
         *
         * @designToken select.background
         */
        background?: string;
        /**
         * Disabled background of root
         *
         * @designToken select.disabled.background
         */
        disabledBackground?: string;
        /**
         * Filled background of root
         *
         * @designToken select.filled.background
         */
        filledBackground?: string;
        /**
         * Filled hover background of root
         *
         * @designToken select.filled.hover.background
         */
        filledHoverBackground?: string;
        /**
         * Filled focus background of root
         *
         * @designToken select.filled.focus.background
         */
        filledFocusBackground?: string;
        /**
         * Border color of root
         *
         * @designToken select.border.color
         */
        borderColor?: string;
        /**
         * Hover border color of root
         *
         * @designToken select.hover.border.color
         */
        hoverBorderColor?: string;
        /**
         * Focus border color of root
         *
         * @designToken select.focus.border.color
         */
        focusBorderColor?: string;
        /**
         * Invalid border color of root
         *
         * @designToken select.invalid.border.color
         */
        invalidBorderColor?: string;
        /**
         * Color of root
         *
         * @designToken select.color
         */
        color?: string;
        /**
         * Disabled color of root
         *
         * @designToken select.disabled.color
         */
        disabledColor?: string;
        /**
         * Placeholder color of root
         *
         * @designToken select.placeholder.color
         */
        placeholderColor?: string;
        /**
         * Invalid placeholder color of root
         *
         * @designToken select.invalid.placeholder.color
         */
        invalidPlaceholderColor?: string;
        /**
         * Shadow of root
         *
         * @designToken select.shadow
         */
        shadow?: string;
        /**
         * Padding x of root
         *
         * @designToken select.padding.x
         */
        paddingX?: string;
        /**
         * Padding y of root
         *
         * @designToken select.padding.y
         */
        paddingY?: string;
        /**
         * Border radius of root
         *
         * @designToken select.border.radius
         */
        borderRadius?: string;
        /**
         * Focus ring of root
         */
        focusRing?: {
            /**
             * Focus ring width of root
             *
             * @designToken select.focus.ring.width
             */
            width?: string;
            /**
             * Focus ring style of root
             *
             * @designToken select.focus.ring.style
             */
            style?: string;
            /**
             * Focus ring color of root
             *
             * @designToken select.focus.ring.color
             */
            color?: string;
            /**
             * Focus ring offset of root
             *
             * @designToken select.focus.ring.offset
             */
            offset?: string;
            /**
             * Focus ring shadow of root
             *
             * @designToken select.focus.ring.shadow
             */
            shadow?: string;
        };
        /**
         * Transition duration of root
         *
         * @designToken select.transition.duration
         */
        transitionDuration?: string;
        /**
         * Sm of root
         */
        sm?: {
            /**
             * Sm font size of root
             *
             * @designToken select.sm.font.size
             */
            fontSize?: string;
            /**
             * Sm padding x of root
             *
             * @designToken select.sm.padding.x
             */
            paddingX?: string;
            /**
             * Sm padding y of root
             *
             * @designToken select.sm.padding.y
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
             * @designToken select.lg.font.size
             */
            fontSize?: string;
            /**
             * Lg padding x of root
             *
             * @designToken select.lg.padding.x
             */
            paddingX?: string;
            /**
             * Lg padding y of root
             *
             * @designToken select.lg.padding.y
             */
            paddingY?: string;
        };
    }

    interface Dropdown {
        /**
         * Width of dropdown
         *
         * @designToken select.dropdown.width
         */
        width?: string;
        /**
         * Color of dropdown
         *
         * @designToken select.dropdown.color
         */
        color?: string;
    }

    interface Overlay {
        /**
         * Background of overlay
         *
         * @designToken select.overlay.background
         */
        background?: string;
        /**
         * Border color of overlay
         *
         * @designToken select.overlay.border.color
         */
        borderColor?: string;
        /**
         * Border radius of overlay
         *
         * @designToken select.overlay.border.radius
         */
        borderRadius?: string;
        /**
         * Color of overlay
         *
         * @designToken select.overlay.color
         */
        color?: string;
        /**
         * Shadow of overlay
         *
         * @designToken select.overlay.shadow
         */
        shadow?: string;
    }

    interface List {
        /**
         * Padding of list
         *
         * @designToken select.list.padding
         */
        padding?: string;
        /**
         * Gap of list
         *
         * @designToken select.list.gap
         */
        gap?: string;
        /**
         * Header of list
         */
        header?: {
            /**
             * Header padding of list
             *
             * @designToken select.list.header.padding
             */
            padding?: string;
        };
    }

    interface Option {
        /**
         * Focus background of option
         *
         * @designToken select.option.focus.background
         */
        focusBackground?: string;
        /**
         * Selected background of option
         *
         * @designToken select.option.selected.background
         */
        selectedBackground?: string;
        /**
         * Selected focus background of option
         *
         * @designToken select.option.selected.focus.background
         */
        selectedFocusBackground?: string;
        /**
         * Color of option
         *
         * @designToken select.option.color
         */
        color?: string;
        /**
         * Focus color of option
         *
         * @designToken select.option.focus.color
         */
        focusColor?: string;
        /**
         * Selected color of option
         *
         * @designToken select.option.selected.color
         */
        selectedColor?: string;
        /**
         * Selected focus color of option
         *
         * @designToken select.option.selected.focus.color
         */
        selectedFocusColor?: string;
        /**
         * Padding of option
         *
         * @designToken select.option.padding
         */
        padding?: string;
        /**
         * Border radius of option
         *
         * @designToken select.option.border.radius
         */
        borderRadius?: string;
    }

    interface OptionGroup {
        /**
         * Background of option group
         *
         * @designToken select.option.group.background
         */
        background?: string;
        /**
         * Color of option group
         *
         * @designToken select.option.group.color
         */
        color?: string;
        /**
         * Font weight of option group
         *
         * @designToken select.option.group.font.weight
         */
        fontWeight?: string;
        /**
         * Padding of option group
         *
         * @designToken select.option.group.padding
         */
        padding?: string;
    }

    interface ClearIcon {
        /**
         * Color of clear icon
         *
         * @designToken select.clear.icon.color
         */
        color?: string;
    }

    interface Checkmark {
        /**
         * Color of checkmark
         *
         * @designToken select.checkmark.color
         */
        color?: string;
        /**
         * Gutter start of checkmark
         *
         * @designToken select.checkmark.gutter.start
         */
        gutterStart?: string;
        /**
         * Gutter end of checkmark
         *
         * @designToken select.checkmark.gutter.end
         */
        gutterEnd?: string;
    }

    interface EmptyMessage {
        /**
         * Padding of empty message
         *
         * @designToken select.empty.message.padding
         */
        padding?: string;
    }

    /* Static Sections */
    type ColorScheme = CS<SelectDesignTokens>;
    type CSS = ExtendedCSS;
    type Extend = ExtendedTokens;
}

/**
 *
 * _Select Design Tokens_
 *
 * @group components
 * @module select
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
export interface SelectDesignTokens extends DesignTokens<SelectDesignTokens> {
    /**
     * Used to pass tokens of the root section
     */
    root?: SelectTokenSections.Root;
    /**
     * Used to pass tokens of the dropdown section
     */
    dropdown?: SelectTokenSections.Dropdown;
    /**
     * Used to pass tokens of the overlay section
     */
    overlay?: SelectTokenSections.Overlay;
    /**
     * Used to pass tokens of the list section
     */
    list?: SelectTokenSections.List;
    /**
     * Used to pass tokens of the option section
     */
    option?: SelectTokenSections.Option;
    /**
     * Used to pass tokens of the option group section
     */
    optionGroup?: SelectTokenSections.OptionGroup;
    /**
     * Used to pass tokens of the clear icon section
     */
    clearIcon?: SelectTokenSections.ClearIcon;
    /**
     * Used to pass tokens of the checkmark section
     */
    checkmark?: SelectTokenSections.Checkmark;
    /**
     * Used to pass tokens of the empty message section
     */
    emptyMessage?: SelectTokenSections.EmptyMessage;
}
