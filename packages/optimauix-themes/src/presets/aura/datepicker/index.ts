import type { DatePickerDesignTokens, DatePickerTokenSections } from '@primeuix/themes/types/datepicker';

export const root: DatePickerTokenSections.Root = {
    transitionDuration: '{transition.duration}'
};

export const panel: DatePickerTokenSections.Panel = {
    background: '{content.background}',
    borderColor: '{content.border.color}',
    color: '{content.color}',
    borderRadius: '{content.border.radius}',
    shadow: '{overlay.popover.shadow}',
    padding: '{overlay.popover.padding}'
};

export const header: DatePickerTokenSections.Header = {
    background: '{content.background}',
    borderColor: '{content.border.color}',
    color: '{content.color}',
    padding: '0 0 0.5rem 0'
};

export const title: DatePickerTokenSections.Title = {
    gap: '0.5rem',
    fontWeight: '500'
};

export const dropdown: DatePickerTokenSections.Dropdown = {
    width: '2.5rem',
    sm: {
        width: '2rem'
    },
    lg: {
        width: '3rem'
    },
    borderColor: '{form.field.border.color}',
    hoverBorderColor: '{form.field.border.color}',
    activeBorderColor: '{form.field.border.color}',
    borderRadius: '{form.field.border.radius}',
    focusRing: {
        width: '{focus.ring.width}',
        style: '{focus.ring.style}',
        color: '{focus.ring.color}',
        offset: '{focus.ring.offset}',
        shadow: '{focus.ring.shadow}'
    }
};

export const inputIcon: DatePickerTokenSections.InputIcon = {
    color: '{form.field.icon.color}'
};

export const selectMonth: DatePickerTokenSections.SelectMonth = {
    hoverBackground: '{content.hover.background}',
    color: '{content.color}',
    hoverColor: '{content.hover.color}',
    padding: '0.25rem 0.5rem',
    borderRadius: '{content.border.radius}'
};

export const selectYear: DatePickerTokenSections.SelectYear = {
    hoverBackground: '{content.hover.background}',
    color: '{content.color}',
    hoverColor: '{content.hover.color}',
    padding: '0.25rem 0.5rem',
    borderRadius: '{content.border.radius}'
};

export const group: DatePickerTokenSections.Group = {
    borderColor: '{content.border.color}',
    gap: '{overlay.popover.padding}'
};

export const dayView: DatePickerTokenSections.DayView = {
    margin: '0.5rem 0 0 0'
};

export const weekDay: DatePickerTokenSections.WeekDay = {
    padding: '0.25rem',
    fontWeight: '500',
    color: '{content.color}'
};

export const date: DatePickerTokenSections.Date = {
    hoverBackground: '{content.hover.background}',
    selectedBackground: '{primary.color}',
    rangeSelectedBackground: '{highlight.background}',
    color: '{content.color}',
    hoverColor: '{content.hover.color}',
    selectedColor: '{primary.contrast.color}',
    rangeSelectedColor: '{highlight.color}',
    width: '2rem',
    height: '2rem',
    borderRadius: '50%',
    padding: '0.25rem',
    focusRing: {
        width: '{focus.ring.width}',
        style: '{focus.ring.style}',
        color: '{focus.ring.color}',
        offset: '{focus.ring.offset}',
        shadow: '{focus.ring.shadow}'
    }
};

export const monthView: DatePickerTokenSections.MonthView = {
    margin: '0.5rem 0 0 0'
};

export const month: DatePickerTokenSections.Month = {
    padding: '0.375rem',
    borderRadius: '{content.border.radius}'
};

export const yearView: DatePickerTokenSections.YearView = {
    margin: '0.5rem 0 0 0'
};

export const year: DatePickerTokenSections.Year = {
    padding: '0.375rem',
    borderRadius: '{content.border.radius}'
};

export const buttonbar: DatePickerTokenSections.Buttonbar = {
    padding: '0.5rem 0 0 0',
    borderColor: '{content.border.color}'
};

export const timePicker: DatePickerTokenSections.TimePicker = {
    padding: '0.5rem 0 0 0',
    borderColor: '{content.border.color}',
    gap: '0.5rem',
    buttonGap: '0.25rem'
};

export const colorScheme: DatePickerTokenSections.ColorScheme = {
    light: {
        dropdown: {
            background: '{surface.100}',
            hoverBackground: '{surface.200}',
            activeBackground: '{surface.300}',
            color: '{surface.600}',
            hoverColor: '{surface.700}',
            activeColor: '{surface.800}'
        },
        today: {
            background: '{surface.200}',
            color: '{surface.900}'
        }
    },
    dark: {
        dropdown: {
            background: '{surface.800}',
            hoverBackground: '{surface.700}',
            activeBackground: '{surface.600}',
            color: '{surface.300}',
            hoverColor: '{surface.200}',
            activeColor: '{surface.100}'
        },
        today: {
            background: '{surface.700}',
            color: '{surface.0}'
        }
    }
};

export default {
    root,
    panel,
    header,
    title,
    dropdown,
    inputIcon,
    selectMonth,
    selectYear,
    group,
    dayView,
    weekDay,
    date,
    monthView,
    month,
    yearView,
    year,
    buttonbar,
    timePicker,
    colorScheme
} satisfies DatePickerDesignTokens;
