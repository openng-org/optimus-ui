import type { TieredMenuTokenSections } from '@primeuix/themes/types/tieredmenu';

export * from '@primeuix/themes/types/tieredmenu';

declare const root: TieredMenuTokenSections.Root;
declare const list: TieredMenuTokenSections.List;
declare const item: TieredMenuTokenSections.Item;
declare const submenu: TieredMenuTokenSections.Submenu;
declare const submenuIcon: TieredMenuTokenSections.SubmenuIcon;
declare const separator: TieredMenuTokenSections.Separator;
declare const _default: {
    root: TieredMenuTokenSections.Root;
    list: TieredMenuTokenSections.List;
    item: TieredMenuTokenSections.Item;
    submenu: TieredMenuTokenSections.Submenu;
    submenuIcon: TieredMenuTokenSections.SubmenuIcon;
    separator: TieredMenuTokenSections.Separator;
};

export { _default as default, item, list, root, separator, submenu, submenuIcon };
