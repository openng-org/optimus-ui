/**
 *
 * DatePicker Design Tokens
 *
 * @module datepicker
 *
 */

import type { ColorScheme as CS, DesignTokens, ExtendedCSS, ExtendedTokens } from '..';

/**
 * Design Token Sections
 */
export declare namespace DatePickerTokenSections {
    interface Root {
        /**
         * Transition duration of root
         *
         * @designToken datepicker.transition.duration
         */
        transitionDuration?: string;
    }

    interface Panel {
        /**
         * Background of panel
         *
         * @designToken datepicker.panel.background
         */
        background?: string;
        /**
         * Border color of panel
         *
         * @designToken datepicker.panel.border.color
         */
        borderColor?: string;
        /**
         * Color of panel
         *
         * @designToken datepicker.panel.color
         */
        color?: string;
        /**
         * Border radius of panel
         *
         * @designToken datepicker.panel.border.radius
         */
        borderRadius?: string;
        /**
         * Shadow of panel
         *
         * @designToken datepicker.panel.shadow
         */
        shadow?: string;
        /**
         * Padding of panel
         *
         * @designToken datepicker.panel.padding
         */
        padding?: string;
    }

    interface Header {
        /**
         * Background of header
         *
         * @designToken datepicker.header.background
         */
        background?: string;
        /**
         * Border color of header
         *
         * @designToken datepicker.header.border.color
         */
        borderColor?: string;
        /**
         * Color of header
         *
         * @designToken datepicker.header.color
         */
        color?: string;
        /**
         * Padding of header
         *
         * @designToken datepicker.header.padding
         */
        padding?: string;
    }

    interface Title {
        /**
         * Gap of title
         *
         * @designToken datepicker.title.gap
         */
        gap?: string;
        /**
         * Font weight of title
         *
         * @designToken datepicker.title.font.weight
         */
        fontWeight?: string;
    }

    interface Dropdown {
        /**
         * Width of dropdown
         *
         * @designToken datepicker.dropdown.width
         */
        width?: string;
        /**
         * Sm of dropdown
         */
        sm?: {
            /**
             * Sm width of dropdown
             *
             * @designToken datepicker.dropdown.sm.width
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
             * @designToken datepicker.dropdown.lg.width
             */
            width?: string;
        };
        /**
         * Border color of dropdown
         *
         * @designToken datepicker.dropdown.border.color
         */
        borderColor?: string;
        /**
         * Hover border color of dropdown
         *
         * @designToken datepicker.dropdown.hover.border.color
         */
        hoverBorderColor?: string;
        /**
         * Active border color of dropdown
         *
         * @designToken datepicker.dropdown.active.border.color
         */
        activeBorderColor?: string;
        /**
         * Border radius of dropdown
         *
         * @designToken datepicker.dropdown.border.radius
         */
        borderRadius?: string;
        /**
         * Focus ring of dropdown
         */
        focusRing?: {
            /**
             * Focus ring width of dropdown
             *
             * @designToken datepicker.dropdown.focus.ring.width
             */
            width?: string;
            /**
             * Focus ring style of dropdown
             *
             * @designToken datepicker.dropdown.focus.ring.style
             */
            style?: string;
            /**
             * Focus ring color of dropdown
             *
             * @designToken datepicker.dropdown.focus.ring.color
             */
            color?: string;
            /**
             * Focus ring offset of dropdown
             *
             * @designToken datepicker.dropdown.focus.ring.offset
             */
            offset?: string;
            /**
             * Focus ring shadow of dropdown
             *
             * @designToken datepicker.dropdown.focus.ring.shadow
             */
            shadow?: string;
        };
        /**
         * Background of dropdown
         *
         * @designToken datepicker.dropdown.background
         */
        background?: string;
        /**
         * Hover background of dropdown
         *
         * @designToken datepicker.dropdown.hover.background
         */
        hoverBackground?: string;
        /**
         * Active background of dropdown
         *
         * @designToken datepicker.dropdown.active.background
         */
        activeBackground?: string;
        /**
         * Color of dropdown
         *
         * @designToken datepicker.dropdown.color
         */
        color?: string;
        /**
         * Hover color of dropdown
         *
         * @designToken datepicker.dropdown.hover.color
         */
        hoverColor?: string;
        /**
         * Active color of dropdown
         *
         * @designToken datepicker.dropdown.active.color
         */
        activeColor?: string;
    }

    interface InputIcon {
        /**
         * Color of input icon
         *
         * @designToken datepicker.input.icon.color
         */
        color?: string;
    }

    interface SelectMonth {
        /**
         * Hover background of select month
         *
         * @designToken datepicker.select.month.hover.background
         */
        hoverBackground?: string;
        /**
         * Color of select month
         *
         * @designToken datepicker.select.month.color
         */
        color?: string;
        /**
         * Hover color of select month
         *
         * @designToken datepicker.select.month.hover.color
         */
        hoverColor?: string;
        /**
         * Padding of select month
         *
         * @designToken datepicker.select.month.padding
         */
        padding?: string;
        /**
         * Border radius of select month
         *
         * @designToken datepicker.select.month.border.radius
         */
        borderRadius?: string;
    }

    interface SelectYear {
        /**
         * Hover background of select year
         *
         * @designToken datepicker.select.year.hover.background
         */
        hoverBackground?: string;
        /**
         * Color of select year
         *
         * @designToken datepicker.select.year.color
         */
        color?: string;
        /**
         * Hover color of select year
         *
         * @designToken datepicker.select.year.hover.color
         */
        hoverColor?: string;
        /**
         * Padding of select year
         *
         * @designToken datepicker.select.year.padding
         */
        padding?: string;
        /**
         * Border radius of select year
         *
         * @designToken datepicker.select.year.border.radius
         */
        borderRadius?: string;
    }

    interface Group {
        /**
         * Border color of group
         *
         * @designToken datepicker.group.border.color
         */
        borderColor?: string;
        /**
         * Gap of group
         *
         * @designToken datepicker.group.gap
         */
        gap?: string;
    }

    interface DayView {
        /**
         * Margin of day view
         *
         * @designToken datepicker.day.view.margin
         */
        margin?: string;
    }

    interface WeekDay {
        /**
         * Padding of week day
         *
         * @designToken datepicker.week.day.padding
         */
        padding?: string;
        /**
         * Font weight of week day
         *
         * @designToken datepicker.week.day.font.weight
         */
        fontWeight?: string;
        /**
         * Color of week day
         *
         * @designToken datepicker.week.day.color
         */
        color?: string;
    }

    interface Date {
        /**
         * Hover background of date
         *
         * @designToken datepicker.date.hover.background
         */
        hoverBackground?: string;
        /**
         * Selected background of date
         *
         * @designToken datepicker.date.selected.background
         */
        selectedBackground?: string;
        /**
         * Range selected background of date
         *
         * @designToken datepicker.date.range.selected.background
         */
        rangeSelectedBackground?: string;
        /**
         * Color of date
         *
         * @designToken datepicker.date.color
         */
        color?: string;
        /**
         * Hover color of date
         *
         * @designToken datepicker.date.hover.color
         */
        hoverColor?: string;
        /**
         * Selected color of date
         *
         * @designToken datepicker.date.selected.color
         */
        selectedColor?: string;
        /**
         * Range selected color of date
         *
         * @designToken datepicker.date.range.selected.color
         */
        rangeSelectedColor?: string;
        /**
         * Width of date
         *
         * @designToken datepicker.date.width
         */
        width?: string;
        /**
         * Height of date
         *
         * @designToken datepicker.date.height
         */
        height?: string;
        /**
         * Border radius of date
         *
         * @designToken datepicker.date.border.radius
         */
        borderRadius?: string;
        /**
         * Padding of date
         *
         * @designToken datepicker.date.padding
         */
        padding?: string;
        /**
         * Focus ring of date
         */
        focusRing?: {
            /**
             * Focus ring width of date
             *
             * @designToken datepicker.date.focus.ring.width
             */
            width?: string;
            /**
             * Focus ring style of date
             *
             * @designToken datepicker.date.focus.ring.style
             */
            style?: string;
            /**
             * Focus ring color of date
             *
             * @designToken datepicker.date.focus.ring.color
             */
            color?: string;
            /**
             * Focus ring offset of date
             *
             * @designToken datepicker.date.focus.ring.offset
             */
            offset?: string;
            /**
             * Focus ring shadow of date
             *
             * @designToken datepicker.date.focus.ring.shadow
             */
            shadow?: string;
        };
    }

    interface MonthView {
        /**
         * Margin of month view
         *
         * @designToken datepicker.month.view.margin
         */
        margin?: string;
    }

    interface Month {
        /**
         * Padding of month
         *
         * @designToken datepicker.month.padding
         */
        padding?: string;
        /**
         * Border radius of month
         *
         * @designToken datepicker.month.border.radius
         */
        borderRadius?: string;
    }

    interface YearView {
        /**
         * Margin of year view
         *
         * @designToken datepicker.year.view.margin
         */
        margin?: string;
    }

    interface Year {
        /**
         * Padding of year
         *
         * @designToken datepicker.year.padding
         */
        padding?: string;
        /**
         * Border radius of year
         *
         * @designToken datepicker.year.border.radius
         */
        borderRadius?: string;
    }

    interface Buttonbar {
        /**
         * Padding of buttonbar
         *
         * @designToken datepicker.buttonbar.padding
         */
        padding?: string;
        /**
         * Border color of buttonbar
         *
         * @designToken datepicker.buttonbar.border.color
         */
        borderColor?: string;
    }

    interface TimePicker {
        /**
         * Padding of time picker
         *
         * @designToken datepicker.time.picker.padding
         */
        padding?: string;
        /**
         * Border color of time picker
         *
         * @designToken datepicker.time.picker.border.color
         */
        borderColor?: string;
        /**
         * Gap of time picker
         *
         * @designToken datepicker.time.picker.gap
         */
        gap?: string;
        /**
         * Button gap of time picker
         *
         * @designToken datepicker.time.picker.button.gap
         */
        buttonGap?: string;
    }

    interface Today {
        /**
         * Background of today
         *
         * @designToken datepicker.today.background
         */
        background?: string;
        /**
         * Color of today
         *
         * @designToken datepicker.today.color
         */
        color?: string;
    }

    /* Static Sections */
    type ColorScheme = CS<DatePickerDesignTokens>;
    type CSS = ExtendedCSS;
    type Extend = ExtendedTokens;
}

/**
 *
 * _DatePicker Design Tokens_
 *
 * @group components
 * @module datepicker
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
export interface DatePickerDesignTokens extends DesignTokens<DatePickerDesignTokens> {
    /**
     * Used to pass tokens of the root section
     */
    root?: DatePickerTokenSections.Root;
    /**
     * Used to pass tokens of the panel section
     */
    panel?: DatePickerTokenSections.Panel;
    /**
     * Used to pass tokens of the header section
     */
    header?: DatePickerTokenSections.Header;
    /**
     * Used to pass tokens of the title section
     */
    title?: DatePickerTokenSections.Title;
    /**
     * Used to pass tokens of the dropdown section
     */
    dropdown?: DatePickerTokenSections.Dropdown;
    /**
     * Used to pass tokens of the input icon section
     */
    inputIcon?: DatePickerTokenSections.InputIcon;
    /**
     * Used to pass tokens of the select month section
     */
    selectMonth?: DatePickerTokenSections.SelectMonth;
    /**
     * Used to pass tokens of the select year section
     */
    selectYear?: DatePickerTokenSections.SelectYear;
    /**
     * Used to pass tokens of the group section
     */
    group?: DatePickerTokenSections.Group;
    /**
     * Used to pass tokens of the day view section
     */
    dayView?: DatePickerTokenSections.DayView;
    /**
     * Used to pass tokens of the week day section
     */
    weekDay?: DatePickerTokenSections.WeekDay;
    /**
     * Used to pass tokens of the date section
     */
    date?: DatePickerTokenSections.Date;
    /**
     * Used to pass tokens of the month view section
     */
    monthView?: DatePickerTokenSections.MonthView;
    /**
     * Used to pass tokens of the month section
     */
    month?: DatePickerTokenSections.Month;
    /**
     * Used to pass tokens of the year view section
     */
    yearView?: DatePickerTokenSections.YearView;
    /**
     * Used to pass tokens of the year section
     */
    year?: DatePickerTokenSections.Year;
    /**
     * Used to pass tokens of the buttonbar section
     */
    buttonbar?: DatePickerTokenSections.Buttonbar;
    /**
     * Used to pass tokens of the time picker section
     */
    timePicker?: DatePickerTokenSections.TimePicker;
    /**
     * Used to pass tokens of the today section
     */
    today?: DatePickerTokenSections.Today;
}
