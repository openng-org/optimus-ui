import type { ListboxDesignTokens, ListboxTokenSections } from '@primeuix/themes/types/listbox';

export const root: ListboxTokenSections.Root = {
    background: '{form.field.background}',
    disabledBackground: '{form.field.disabled.background}',
    borderColor: '{form.field.border.color}',
    invalidBorderColor: '{form.field.invalid.border.color}',
    color: '{form.field.color}',
    disabledColor: '{form.field.disabled.color}',
    shadow: '{form.field.shadow}',
    borderRadius: '{form.field.border.radius}',
    transitionDuration: '{form.field.transition.duration}'
};

export const list: ListboxTokenSections.List = {
    padding: '{list.padding}',
    gap: '{list.gap}',
    header: {
        padding: '{list.header.padding}'
    }
};

export const option: ListboxTokenSections.Option = {
    focusBackground: '{list.option.focus.background}',
    selectedBackground: '{list.option.selected.background}',
    selectedFocusBackground: '{list.option.selected.focus.background}',
    color: '{list.option.color}',
    focusColor: '{list.option.focus.color}',
    selectedColor: '{list.option.selected.color}',
    selectedFocusColor: '{list.option.selected.focus.color}',
    padding: '{list.option.padding}',
    borderRadius: '{list.option.border.radius}'
};

export const optionGroup: ListboxTokenSections.OptionGroup = {
    background: '{list.option.group.background}',
    color: '{list.option.group.color}',
    fontWeight: '{list.option.group.font.weight}',
    padding: '{list.option.group.padding}'
};

export const checkmark: ListboxTokenSections.Checkmark = {
    color: '{list.option.color}',
    gutterStart: '-0.375rem',
    gutterEnd: '0.375rem'
};

export const emptyMessage: ListboxTokenSections.EmptyMessage = {
    padding: '{list.option.padding}'
};

export const colorScheme: ListboxTokenSections.ColorScheme = {
    light: {
        option: {
            stripedBackground: '{surface.50}'
        }
    },
    dark: {
        option: {
            stripedBackground: '{surface.900}'
        }
    }
};

export default {
    root,
    list,
    option,
    optionGroup,
    checkmark,
    emptyMessage,
    colorScheme
} satisfies ListboxDesignTokens;
