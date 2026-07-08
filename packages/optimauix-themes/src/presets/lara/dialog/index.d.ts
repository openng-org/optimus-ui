import type { DialogTokenSections } from '@primeuix/themes/types/dialog';

export * from '@primeuix/themes/types/dialog';

declare const root: DialogTokenSections.Root;
declare const header: DialogTokenSections.Header;
declare const title: DialogTokenSections.Title;
declare const content: DialogTokenSections.Content;
declare const footer: DialogTokenSections.Footer;
declare const _default: {
    root: DialogTokenSections.Root;
    header: DialogTokenSections.Header;
    title: DialogTokenSections.Title;
    content: DialogTokenSections.Content;
    footer: DialogTokenSections.Footer;
};

export { content, _default as default, footer, header, root, title };
