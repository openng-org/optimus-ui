import type { PopoverTokenSections } from '@primeuix/themes/types/popover';

export * from '@primeuix/themes/types/popover';

declare const root: PopoverTokenSections.Root;
declare const content: PopoverTokenSections.Content;
declare const css: PopoverTokenSections.CSS;
declare const _default: {
    root: PopoverTokenSections.Root;
    content: PopoverTokenSections.Content;
    css: string;
};

export { content, css, _default as default, root };
