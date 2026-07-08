import type { InplaceTokenSections } from '@primeuix/themes/types/inplace';

export * from '@primeuix/themes/types/inplace';

declare const root: InplaceTokenSections.Root;
declare const display: InplaceTokenSections.Display;
declare const css: InplaceTokenSections.CSS;
declare const _default: {
    root: InplaceTokenSections.Root;
    display: InplaceTokenSections.Display;
    css: string;
};

export { css, _default as default, display, root };
