import type { DividerTokenSections } from '@primeuix/themes/types/divider';

export * from '@primeuix/themes/types/divider';

declare const root: DividerTokenSections.Root;
declare const content: DividerTokenSections.Content;
declare const horizontal: DividerTokenSections.Horizontal;
declare const vertical: DividerTokenSections.Vertical;
declare const _default: {
    root: DividerTokenSections.Root;
    content: DividerTokenSections.Content;
    horizontal: DividerTokenSections.Horizontal;
    vertical: DividerTokenSections.Vertical;
};

export { content, _default as default, horizontal, root, vertical };
