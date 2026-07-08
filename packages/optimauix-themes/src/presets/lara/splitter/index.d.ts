import type { SplitterTokenSections } from '@primeuix/themes/types/splitter';

export * from '@primeuix/themes/types/splitter';

declare const root: SplitterTokenSections.Root;
declare const gutter: SplitterTokenSections.Gutter;
declare const handle: SplitterTokenSections.Handle;
declare const colorScheme: SplitterTokenSections.ColorScheme;
declare const _default: {
    root: SplitterTokenSections.Root;
    gutter: SplitterTokenSections.Gutter;
    handle: SplitterTokenSections.Handle;
    colorScheme: SplitterTokenSections.ColorScheme;
};

export { colorScheme, _default as default, gutter, handle, root };
