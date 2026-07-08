import type { PanelTokenSections } from '@primeuix/themes/types/panel';

export * from '@primeuix/themes/types/panel';

declare const root: PanelTokenSections.Root;
declare const header: PanelTokenSections.Header;
declare const toggleableHeader: PanelTokenSections.ToggleableHeader;
declare const title: PanelTokenSections.Title;
declare const content: PanelTokenSections.Content;
declare const footer: PanelTokenSections.Footer;
declare const _default: {
    root: PanelTokenSections.Root;
    header: PanelTokenSections.Header;
    toggleableHeader: PanelTokenSections.ToggleableHeader;
    title: PanelTokenSections.Title;
    content: PanelTokenSections.Content;
    footer: PanelTokenSections.Footer;
};

export { content, _default as default, footer, header, root, title, toggleableHeader };
