import type { MenubarTokenSections } from '@primeuix/themes/types/menubar';

export * from '@primeuix/themes/types/menubar';

declare const root: MenubarTokenSections.Root;
declare const baseItem: MenubarTokenSections.BaseItem;
declare const item: MenubarTokenSections.Item;
declare const submenu: MenubarTokenSections.Submenu;
declare const separator: MenubarTokenSections.Separator;
declare const mobileButton: MenubarTokenSections.MobileButton;
declare const _default: {
    root: MenubarTokenSections.Root;
    baseItem: MenubarTokenSections.BaseItem;
    item: MenubarTokenSections.Item;
    submenu: MenubarTokenSections.Submenu;
    separator: MenubarTokenSections.Separator;
    mobileButton: MenubarTokenSections.MobileButton;
};

export { baseItem, _default as default, item, mobileButton, root, separator, submenu };
