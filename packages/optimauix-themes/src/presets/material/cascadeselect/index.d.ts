import type { StyleOptions } from '@primeuix/styled';
import type { CascadeSelectTokenSections } from '@primeuix/themes/types/cascadeselect';

export * from '@primeuix/themes/types/cascadeselect';

declare const root: CascadeSelectTokenSections.Root;
declare const dropdown: CascadeSelectTokenSections.Dropdown;
declare const overlay: CascadeSelectTokenSections.Overlay;
declare const list: CascadeSelectTokenSections.List;
declare const option: CascadeSelectTokenSections.Option;
declare const clearIcon: CascadeSelectTokenSections.ClearIcon;
declare const css: CascadeSelectTokenSections.CSS;
declare const _default: {
    root: CascadeSelectTokenSections.Root;
    dropdown: CascadeSelectTokenSections.Dropdown;
    overlay: CascadeSelectTokenSections.Overlay;
    list: CascadeSelectTokenSections.List;
    option: CascadeSelectTokenSections.Option;
    clearIcon: CascadeSelectTokenSections.ClearIcon;
    css: (options: StyleOptions) => string;
};

export { clearIcon, css, _default as default, dropdown, list, option, overlay, root };
