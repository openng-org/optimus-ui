import type { AutoCompleteTokenSections } from '@primeuix/themes/types/autocomplete';

export * from '@primeuix/themes/types/autocomplete';

declare const root: AutoCompleteTokenSections.Root;
declare const overlay: AutoCompleteTokenSections.Overlay;
declare const list: AutoCompleteTokenSections.List;
declare const option: AutoCompleteTokenSections.Option;
declare const optionGroup: AutoCompleteTokenSections.OptionGroup;
declare const dropdown: AutoCompleteTokenSections.Dropdown;
declare const chip: AutoCompleteTokenSections.Chip;
declare const emptyMessage: AutoCompleteTokenSections.EmptyMessage;
declare const colorScheme: AutoCompleteTokenSections.ColorScheme;
declare const _default: {
    root: AutoCompleteTokenSections.Root;
    overlay: AutoCompleteTokenSections.Overlay;
    list: AutoCompleteTokenSections.List;
    option: AutoCompleteTokenSections.Option;
    optionGroup: AutoCompleteTokenSections.OptionGroup;
    dropdown: AutoCompleteTokenSections.Dropdown;
    chip: AutoCompleteTokenSections.Chip;
    emptyMessage: AutoCompleteTokenSections.EmptyMessage;
    colorScheme: AutoCompleteTokenSections.ColorScheme;
};

export { chip, colorScheme, _default as default, dropdown, emptyMessage, list, option, optionGroup, overlay, root };
