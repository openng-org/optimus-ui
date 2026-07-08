import type { StyleOptions } from '@primeuix/styled';
import type { TreeSelectTokenSections } from '@primeuix/themes/types/treeselect';

export * from '@primeuix/themes/types/treeselect';

declare const root: TreeSelectTokenSections.Root;
declare const dropdown: TreeSelectTokenSections.Dropdown;
declare const overlay: TreeSelectTokenSections.Overlay;
declare const tree: TreeSelectTokenSections.Tree;
declare const emptyMessage: TreeSelectTokenSections.EmptyMessage;
declare const chip: TreeSelectTokenSections.Chip;
declare const clearIcon: TreeSelectTokenSections.ClearIcon;
declare const css: TreeSelectTokenSections.CSS;
declare const _default: {
    root: TreeSelectTokenSections.Root;
    dropdown: TreeSelectTokenSections.Dropdown;
    overlay: TreeSelectTokenSections.Overlay;
    tree: TreeSelectTokenSections.Tree;
    emptyMessage: TreeSelectTokenSections.EmptyMessage;
    chip: TreeSelectTokenSections.Chip;
    clearIcon: TreeSelectTokenSections.ClearIcon;
    css: (options: StyleOptions) => string;
};

export { chip, clearIcon, css, _default as default, dropdown, emptyMessage, overlay, root, tree };
