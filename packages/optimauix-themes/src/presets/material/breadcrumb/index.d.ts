import type { BreadcrumbTokenSections } from '@primeuix/themes/types/breadcrumb';

export * from '@primeuix/themes/types/breadcrumb';

declare const root: BreadcrumbTokenSections.Root;
declare const item: BreadcrumbTokenSections.Item;
declare const separator: BreadcrumbTokenSections.Separator;
declare const css: BreadcrumbTokenSections.CSS;
declare const _default: {
    root: BreadcrumbTokenSections.Root;
    item: BreadcrumbTokenSections.Item;
    separator: BreadcrumbTokenSections.Separator;
    css: string;
};

export { css, _default as default, item, root, separator };
