import type { PanelMenuTokenSections } from '@primeuix/themes/types/panelmenu';

export * from '@primeuix/themes/types/panelmenu';

declare const root: PanelMenuTokenSections.Root;
declare const panel: PanelMenuTokenSections.Panel;
declare const item: PanelMenuTokenSections.Item;
declare const submenu: PanelMenuTokenSections.Submenu;
declare const submenuIcon: PanelMenuTokenSections.SubmenuIcon;
declare const _default: {
    root: PanelMenuTokenSections.Root;
    panel: PanelMenuTokenSections.Panel;
    item: PanelMenuTokenSections.Item;
    submenu: PanelMenuTokenSections.Submenu;
    submenuIcon: PanelMenuTokenSections.SubmenuIcon;
};

export { _default as default, item, panel, root, submenu, submenuIcon };
