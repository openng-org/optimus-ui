import type { TabsTokenSections } from '@primeuix/themes/types/tabs';

export * from '@primeuix/themes/types/tabs';

declare const root: TabsTokenSections.Root;
declare const tablist: TabsTokenSections.Tablist;
declare const tab: TabsTokenSections.Tab;
declare const tabpanel: TabsTokenSections.Tabpanel;
declare const navButton: TabsTokenSections.NavButton;
declare const activeBar: TabsTokenSections.ActiveBar;
declare const colorScheme: TabsTokenSections.ColorScheme;
declare const _default: {
    root: TabsTokenSections.Root;
    tablist: TabsTokenSections.Tablist;
    tab: TabsTokenSections.Tab;
    tabpanel: TabsTokenSections.Tabpanel;
    navButton: TabsTokenSections.NavButton;
    activeBar: TabsTokenSections.ActiveBar;
    colorScheme: TabsTokenSections.ColorScheme;
};

export { activeBar, colorScheme, _default as default, navButton, root, tab, tablist, tabpanel };
