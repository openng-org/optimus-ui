import type { TabmenuTokenSections } from '@primeuix/themes/types/tabmenu';

export * from '@primeuix/themes/types/tabmenu';

declare const root: TabmenuTokenSections.Root;
declare const tablist: TabmenuTokenSections.Tablist;
declare const item: TabmenuTokenSections.Item;
declare const itemIcon: TabmenuTokenSections.ItemIcon;
declare const activeBar: TabmenuTokenSections.ActiveBar;
declare const _default: {
    root: TabmenuTokenSections.Root;
    tablist: TabmenuTokenSections.Tablist;
    item: TabmenuTokenSections.Item;
    itemIcon: TabmenuTokenSections.ItemIcon;
    activeBar: TabmenuTokenSections.ActiveBar;
};

export { activeBar, _default as default, item, itemIcon, root, tablist };
