import type { DataViewTokenSections } from '@primeuix/themes/types/dataview';

export * from '@primeuix/themes/types/dataview';

declare const root: DataViewTokenSections.Root;
declare const header: DataViewTokenSections.Header;
declare const content: DataViewTokenSections.Content;
declare const footer: DataViewTokenSections.Footer;
declare const paginatorTop: DataViewTokenSections.PaginatorTop;
declare const paginatorBottom: DataViewTokenSections.PaginatorBottom;
declare const _default: {
    root: DataViewTokenSections.Root;
    header: DataViewTokenSections.Header;
    content: DataViewTokenSections.Content;
    footer: DataViewTokenSections.Footer;
    paginatorTop: DataViewTokenSections.PaginatorTop;
    paginatorBottom: DataViewTokenSections.PaginatorBottom;
};

export { content, _default as default, footer, header, paginatorBottom, paginatorTop, root };
