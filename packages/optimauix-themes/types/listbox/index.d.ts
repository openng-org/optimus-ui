/**
 *
 * Listbox Design Tokens
 *
 * @module listbox
 *
 */

import type { ColorScheme as CS, DesignTokens, ExtendedCSS, ExtendedTokens } from '..';

/**
 * Design Token Sections
 */
export declare namespace ListboxTokenSections {
    interface Root {
        /**
         * Background of root
         *
         * @designToken listbox.background
         */
        background?: string;
        /**
         * Disabled background of root
         *
         * @designToken listbox.disabled.background
         */
        disabledBackground?: string;
        /**
         * Border color of root
         *
         * @designToken listbox.border.color
         */
        borderColor?: string;
        /**
         * Invalid border color of root
         *
         * @designToken listbox.invalid.border.color
         */
        invalidBorderColor?: string;
        /**
         * Color of root
         *
         * @designToken listbox.color
         */
        color?: string;
        /**
         * Disabled color of root
         *
         * @designToken listbox.disabled.color
         */
        disabledColor?: string;
        /**
         * Shadow of root
         *
         * @designToken listbox.shadow
         */
        shadow?: string;
        /**
         * Border radius of root
         *
         * @designToken listbox.border.radius
         */
        borderRadius?: string;
        /**
         * Transition duration of root
         *
         * @designToken listbox.transition.duration
         */
        transitionDuration?: string;
    }

    interface List {
        /**
         * Padding of list
         *
         * @designToken listbox.list.padding
         */
        padding?: string;
        /**
         * Gap of list
         *
         * @designToken listbox.list.gap
         */
        gap?: string;
        /**
         * Header of list
         */
        header?: {
            /**
             * Header padding of list
             *
             * @designToken listbox.list.header.padding
             */
            padding?: string;
        };
    }

    interface Option {
        /**
         * Focus background of option
         *
         * @designToken listbox.option.focus.background
         */
        focusBackground?: string;
        /**
         * Selected background of option
         *
         * @designToken listbox.option.selected.background
         */
        selectedBackground?: string;
        /**
         * Selected focus background of option
         *
         * @designToken listbox.option.selected.focus.background
         */
        selectedFocusBackground?: string;
        /**
         * Color of option
         *
         * @designToken listbox.option.color
         */
        color?: string;
        /**
         * Focus color of option
         *
         * @designToken listbox.option.focus.color
         */
        focusColor?: string;
        /**
         * Selected color of option
         *
         * @designToken listbox.option.selected.color
         */
        selectedColor?: string;
        /**
         * Selected focus color of option
         *
         * @designToken listbox.option.selected.focus.color
         */
        selectedFocusColor?: string;
        /**
         * Padding of option
         *
         * @designToken listbox.option.padding
         */
        padding?: string;
        /**
         * Border radius of option
         *
         * @designToken listbox.option.border.radius
         */
        borderRadius?: string;
        /**
         * Striped background of option
         *
         * @designToken listbox.option.striped.background
         */
        stripedBackground?: string;
    }

    interface OptionGroup {
        /**
         * Background of option group
         *
         * @designToken listbox.option.group.background
         */
        background?: string;
        /**
         * Color of option group
         *
         * @designToken listbox.option.group.color
         */
        color?: string;
        /**
         * Font weight of option group
         *
         * @designToken listbox.option.group.font.weight
         */
        fontWeight?: string;
        /**
         * Padding of option group
         *
         * @designToken listbox.option.group.padding
         */
        padding?: string;
    }

    interface Checkmark {
        /**
         * Color of checkmark
         *
         * @designToken listbox.checkmark.color
         */
        color?: string;
        /**
         * Gutter start of checkmark
         *
         * @designToken listbox.checkmark.gutter.start
         */
        gutterStart?: string;
        /**
         * Gutter end of checkmark
         *
         * @designToken listbox.checkmark.gutter.end
         */
        gutterEnd?: string;
    }

    interface EmptyMessage {
        /**
         * Padding of empty message
         *
         * @designToken listbox.empty.message.padding
         */
        padding?: string;
    }

    /* Static Sections */
    type ColorScheme = CS<ListboxDesignTokens>;
    type CSS = ExtendedCSS;
    type Extend = ExtendedTokens;
}

/**
 *
 * _Listbox Design Tokens_
 *
 * @group components
 * @module listbox
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
export interface ListboxDesignTokens extends DesignTokens<ListboxDesignTokens> {
    /**
     * Used to pass tokens of the root section
     */
    root?: ListboxTokenSections.Root;
    /**
     * Used to pass tokens of the list section
     */
    list?: ListboxTokenSections.List;
    /**
     * Used to pass tokens of the option section
     */
    option?: ListboxTokenSections.Option;
    /**
     * Used to pass tokens of the option group section
     */
    optionGroup?: ListboxTokenSections.OptionGroup;
    /**
     * Used to pass tokens of the checkmark section
     */
    checkmark?: ListboxTokenSections.Checkmark;
    /**
     * Used to pass tokens of the empty message section
     */
    emptyMessage?: ListboxTokenSections.EmptyMessage;
}
