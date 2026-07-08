import type { MultiSelectTokenSections } from '@primeuix/themes/types/multiselect';

export * from '@primeuix/themes/types/multiselect';

declare const root: MultiSelectTokenSections.Root;
declare const dropdown: MultiSelectTokenSections.Dropdown;
declare const overlay: MultiSelectTokenSections.Overlay;
declare const list: MultiSelectTokenSections.List;
declare const option: MultiSelectTokenSections.Option;
declare const optionGroup: MultiSelectTokenSections.OptionGroup;
declare const clearIcon: MultiSelectTokenSections.ClearIcon;
declare const chip: MultiSelectTokenSections.Chip;
declare const emptyMessage: MultiSelectTokenSections.EmptyMessage;
declare const _default: {
    root: MultiSelectTokenSections.Root;
    dropdown: MultiSelectTokenSections.Dropdown;
    overlay: MultiSelectTokenSections.Overlay;
    list: MultiSelectTokenSections.List;
    option: MultiSelectTokenSections.Option;
    optionGroup: MultiSelectTokenSections.OptionGroup;
    chip: MultiSelectTokenSections.Chip;
    clearIcon: MultiSelectTokenSections.ClearIcon;
    emptyMessage: MultiSelectTokenSections.EmptyMessage;
};

export { chip, clearIcon, _default as default, dropdown, emptyMessage, list, option, optionGroup, overlay, root };
