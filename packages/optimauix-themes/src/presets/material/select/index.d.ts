import type { StyleOptions } from '@primeuix/styled';
import type { SelectTokenSections } from '@primeuix/themes/types/select';

export * from '@primeuix/themes/types/select';

declare const root: SelectTokenSections.Root;
declare const dropdown: SelectTokenSections.Dropdown;
declare const overlay: SelectTokenSections.Overlay;
declare const list: SelectTokenSections.List;
declare const option: SelectTokenSections.Option;
declare const optionGroup: SelectTokenSections.OptionGroup;
declare const clearIcon: SelectTokenSections.ClearIcon;
declare const checkmark: SelectTokenSections.Checkmark;
declare const emptyMessage: SelectTokenSections.EmptyMessage;
declare const css: SelectTokenSections.CSS;
declare const _default: {
    root: SelectTokenSections.Root;
    dropdown: SelectTokenSections.Dropdown;
    overlay: SelectTokenSections.Overlay;
    list: SelectTokenSections.List;
    option: SelectTokenSections.Option;
    optionGroup: SelectTokenSections.OptionGroup;
    clearIcon: SelectTokenSections.ClearIcon;
    checkmark: SelectTokenSections.Checkmark;
    emptyMessage: SelectTokenSections.EmptyMessage;
    css: (options: StyleOptions) => string;
};

export { checkmark, clearIcon, css, _default as default, dropdown, emptyMessage, list, option, optionGroup, overlay, root };
