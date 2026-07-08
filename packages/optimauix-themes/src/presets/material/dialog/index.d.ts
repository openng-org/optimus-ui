import type { DialogTokenSections } from '@primeuix/themes/types/dialog';

export * from '@primeuix/themes/types/dialog';

declare const root: DialogTokenSections.Root;
declare const header: DialogTokenSections.Header;
declare const title: DialogTokenSections.Title;
declare const content: DialogTokenSections.Content;
declare const footer: DialogTokenSections.Footer;
declare const css: DialogTokenSections.CSS;
declare const _default: {
    root: DialogTokenSections.Root;
    header: DialogTokenSections.Header;
    title: DialogTokenSections.Title;
    content: DialogTokenSections.Content;
    footer: DialogTokenSections.Footer;
    css: string;
};

export { content, css, _default as default, footer, header, root, title };
