import type { MessageTokenSections } from '@primeuix/themes/types/message';

export * from '@primeuix/themes/types/message';

declare const root: MessageTokenSections.Root;
declare const content: MessageTokenSections.Content;
declare const text: MessageTokenSections.Text;
declare const icon: MessageTokenSections.Icon;
declare const closeButton: MessageTokenSections.CloseButton;
declare const closeIcon: MessageTokenSections.CloseIcon;
declare const outlined: MessageTokenSections.Outlined;
declare const simple: MessageTokenSections.Simple;
declare const colorScheme: MessageTokenSections.ColorScheme;
declare const css: MessageTokenSections.CSS;
declare const _default: {
    root: MessageTokenSections.Root;
    content: MessageTokenSections.Content;
    text: MessageTokenSections.Text;
    icon: MessageTokenSections.Icon;
    closeButton: MessageTokenSections.CloseButton;
    closeIcon: MessageTokenSections.CloseIcon;
    outlined: MessageTokenSections.Outlined;
    simple: MessageTokenSections.Simple;
    colorScheme: MessageTokenSections.ColorScheme;
    css: string;
};

export { closeButton, closeIcon, colorScheme, content, css, _default as default, icon, outlined, root, simple, text };
