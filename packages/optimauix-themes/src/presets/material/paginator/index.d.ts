import type { PaginatorTokenSections } from '@primeuix/themes/types/paginator';

export * from '@primeuix/themes/types/paginator';

declare const root: PaginatorTokenSections.Root;
declare const navButton: PaginatorTokenSections.NavButton;
declare const currentPageReport: PaginatorTokenSections.CurrentPageReport;
declare const jumpToPageInput: PaginatorTokenSections.JumpToPageInput;
declare const css: PaginatorTokenSections.CSS;
declare const _default: {
    root: PaginatorTokenSections.Root;
    navButton: PaginatorTokenSections.NavButton;
    currentPageReport: PaginatorTokenSections.CurrentPageReport;
    jumpToPageInput: PaginatorTokenSections.JumpToPageInput;
    css: string;
};

export { css, currentPageReport, _default as default, jumpToPageInput, navButton, root };
