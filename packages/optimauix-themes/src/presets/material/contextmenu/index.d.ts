import type { ContextMenuTokenSections } from '@primeuix/themes/types/contextmenu';

export * from '@primeuix/themes/types/contextmenu';

declare const root: ContextMenuTokenSections.Root;
declare const list: ContextMenuTokenSections.List;
declare const item: ContextMenuTokenSections.Item;
declare const submenu: ContextMenuTokenSections.Submenu;
declare const submenuIcon: ContextMenuTokenSections.SubmenuIcon;
declare const separator: ContextMenuTokenSections.Separator;
declare const css: ContextMenuTokenSections.CSS;
declare const _default: {
    root: ContextMenuTokenSections.Root;
    list: ContextMenuTokenSections.List;
    item: ContextMenuTokenSections.Item;
    submenu: ContextMenuTokenSections.Submenu;
    submenuIcon: ContextMenuTokenSections.SubmenuIcon;
    separator: ContextMenuTokenSections.Separator;
    css: string;
};

export { css, _default as default, item, list, root, separator, submenu, submenuIcon };
