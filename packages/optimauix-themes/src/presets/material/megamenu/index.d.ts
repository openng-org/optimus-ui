import type { StyleOptions } from '@primeuix/styled';
import type { MegaMenuTokenSections } from '@primeuix/themes/types/megamenu';

export * from '@primeuix/themes/types/megamenu';

declare const root: MegaMenuTokenSections.Root;
declare const baseItem: MegaMenuTokenSections.BaseItem;
declare const item: MegaMenuTokenSections.Item;
declare const overlay: MegaMenuTokenSections.Overlay;
declare const submenu: MegaMenuTokenSections.Submenu;
declare const submenuLabel: MegaMenuTokenSections.SubmenuLabel;
declare const submenuIcon: MegaMenuTokenSections.SubmenuIcon;
declare const separator: MegaMenuTokenSections.Separator;
declare const mobileButton: MegaMenuTokenSections.MobileButton;
declare const css: MegaMenuTokenSections.CSS;
declare const _default: {
    root: MegaMenuTokenSections.Root;
    baseItem: MegaMenuTokenSections.BaseItem;
    item: MegaMenuTokenSections.Item;
    overlay: MegaMenuTokenSections.Overlay;
    submenu: MegaMenuTokenSections.Submenu;
    submenuLabel: MegaMenuTokenSections.SubmenuLabel;
    submenuIcon: MegaMenuTokenSections.SubmenuIcon;
    separator: MegaMenuTokenSections.Separator;
    mobileButton: MegaMenuTokenSections.MobileButton;
    css: (options: StyleOptions) => string;
};

export { baseItem, css, _default as default, item, mobileButton, overlay, root, separator, submenu, submenuIcon, submenuLabel };
