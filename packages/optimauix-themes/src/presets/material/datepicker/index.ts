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
    padding: '0.5rem'
};

export const header: DatePickerTokenSections.Header = {
    background: '{content.background}',
    borderColor: '{content.border.color}',
    color: '{content.color}',
    padding: '0 0 0.5rem 0'
};

export const title: DatePickerTokenSections.Title = {
    gap: '0.5rem',
    fontWeight: '700'
};

export const dropdown: DatePickerTokenSections.Dropdown = {
    width: '3rem',
    sm: {
        width: '2.5rem'
    },
    lg: {
        width: '3.5rem'
    },
    borderColor: '{form.field.border.color}',
    hoverBorderColor: '{form.field.border.color}',
    activeBorderColor: '{form.field.border.color}',
    borderRadius: '{form.field.border.radius}',
    focusRing: {
        width: '0',
        style: 'none',
        color: 'unset',
        offset: '0',
        shadow: 'none'
    }
};

export const inputIcon: DatePickerTokenSections.InputIcon = {
    color: '{form.field.icon.color}'
};

export const selectMonth: DatePickerTokenSections.SelectMonth = {
    hoverBackground: '{content.hover.background}',
    color: '{content.color}',
    hoverColor: '{content.hover.color}',
    padding: '0.5rem 0.75rem',
    borderRadius: '{content.border.radius}'
};

export const selectYear: DatePickerTokenSections.SelectYear = {
    hoverBackground: '{content.hover.background}',
    color: '{content.color}',
    hoverColor: '{content.hover.color}',
    padding: '0.5rem 0.75rem',
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
    padding: '0.5rem',
    fontWeight: '700',
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
    width: '2.5rem',
    height: '2.5rem',
    borderRadius: '50%',
    padding: '0.125rem',
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
    padding: '0.625rem',
    borderRadius: '{content.border.radius}'
};

export const yearView: DatePickerTokenSections.YearView = {
    margin: '0.5rem 0 0 0'
};

export const year: DatePickerTokenSections.Year = {
    padding: '0.625rem',
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

export const css: DatePickerTokenSections.CSS = /*css*/ `
.p-datepicker-header {
    justify-content: start;
}

.p-datepicker-title {
    order: 1;
}

.p-datepicker-prev-button {
    order: 2;
    margin-inline-start: auto;
}

.p-datepicker-next-button {
    order: 2;
    margin-inline-start: 0.5rem;
}

.p-datepicker-select-month:focus-visible {
    background: dt('datepicker.select.month.hover.background');
    color: dt('datepicker.select.month.hover.color');
    outline: 0 none;
}

.p-datepicker-select-year:focus-visible {
    background: dt('datepicker.select.year.hover.background');
    color: dt('datepicker.select.year.hover.color');
    outline: 0 none;
}

.p-datepicker-dropdown:focus-visible {
    outline: 0 none;
    background: dt('datepicker.dropdown.hover.background');
    border-color: dt('datepicker.dropdown.hover.border.color');
    color: dt('datepicker.dropdown.hover.color');
}
`;

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
    colorScheme,
    css
} satisfies DatePickerDesignTokens;
