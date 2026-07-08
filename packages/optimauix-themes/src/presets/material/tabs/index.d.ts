import type { StyleOptions } from '@primeuix/styled';
import type { TabsTokenSections } from '@primeuix/themes/types/tabs';

export * from '@primeuix/themes/types/tabs';

declare const root: TabsTokenSections.Root;
declare const tablist: TabsTokenSections.Tablist;
declare const tab: TabsTokenSections.Tab;
declare const tabpanel: TabsTokenSections.Tabpanel;
declare const navButton: TabsTokenSections.NavButton;
declare const activeBar: TabsTokenSections.ActiveBar;
declare const css: TabsTokenSections.CSS;
declare const _default: {
    root: TabsTokenSections.Root;
    tablist: TabsTokenSections.Tablist;
    tab: TabsTokenSections.Tab;
    tabpanel: TabsTokenSections.Tabpanel;
    navButton: TabsTokenSections.NavButton;
    activeBar: TabsTokenSections.ActiveBar;
    css: (options: StyleOptions) => string;
};

export { activeBar, css, _default as default, navButton, root, tab, tablist, tabpanel };
