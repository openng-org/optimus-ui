import type { InlineMessageTokenSections } from '@primeuix/themes/types/inlinemessage';

export * from '@primeuix/themes/types/inlinemessage';

declare const root: InlineMessageTokenSections.Root;
declare const text: InlineMessageTokenSections.Text;
declare const icon: InlineMessageTokenSections.Icon;
declare const colorScheme: InlineMessageTokenSections.ColorScheme;
declare const _default: {
    root: InlineMessageTokenSections.Root;
    text: InlineMessageTokenSections.Text;
    icon: InlineMessageTokenSections.Icon;
    colorScheme: InlineMessageTokenSections.ColorScheme;
};

export { colorScheme, _default as default, icon, root, text };
