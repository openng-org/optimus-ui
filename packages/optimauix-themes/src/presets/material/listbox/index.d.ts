import type { ListboxTokenSections } from '@primeuix/themes/types/listbox';

export * from '@primeuix/themes/types/listbox';

declare const root: ListboxTokenSections.Root;
declare const list: ListboxTokenSections.List;
declare const option: ListboxTokenSections.Option;
declare const optionGroup: ListboxTokenSections.OptionGroup;
declare const checkmark: ListboxTokenSections.Checkmark;
declare const emptyMessage: ListboxTokenSections.EmptyMessage;
declare const colorScheme: ListboxTokenSections.ColorScheme;
declare const css: ListboxTokenSections.CSS;
declare const _default: {
    root: ListboxTokenSections.Root;
    list: ListboxTokenSections.List;
    option: ListboxTokenSections.Option;
    optionGroup: ListboxTokenSections.OptionGroup;
    checkmark: ListboxTokenSections.Checkmark;
    emptyMessage: ListboxTokenSections.EmptyMessage;
    colorScheme: ListboxTokenSections.ColorScheme;
    css: string;
};

export { checkmark, colorScheme, css, _default as default, emptyMessage, list, option, optionGroup, root };
