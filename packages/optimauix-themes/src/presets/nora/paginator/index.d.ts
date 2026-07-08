import type { PaginatorTokenSections } from '@primeuix/themes/types/paginator';

export * from '@primeuix/themes/types/paginator';

declare const root: PaginatorTokenSections.Root;
declare const navButton: PaginatorTokenSections.NavButton;
declare const currentPageReport: PaginatorTokenSections.CurrentPageReport;
declare const jumpToPageInput: PaginatorTokenSections.JumpToPageInput;
declare const _default: {
    root: PaginatorTokenSections.Root;
    navButton: PaginatorTokenSections.NavButton;
    currentPageReport: PaginatorTokenSections.CurrentPageReport;
    jumpToPageInput: PaginatorTokenSections.JumpToPageInput;
};

export { currentPageReport, _default as default, jumpToPageInput, navButton, root };
