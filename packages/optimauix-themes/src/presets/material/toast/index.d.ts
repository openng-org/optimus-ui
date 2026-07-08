import type { ToastTokenSections } from '@primeuix/themes/types/toast';

export * from '@primeuix/themes/types/toast';

declare const root: ToastTokenSections.Root;
declare const icon: ToastTokenSections.Icon;
declare const content: ToastTokenSections.Content;
declare const text: ToastTokenSections.Text;
declare const summary: ToastTokenSections.Summary;
declare const detail: ToastTokenSections.Detail;
declare const closeButton: ToastTokenSections.CloseButton;
declare const closeIcon: ToastTokenSections.CloseIcon;
declare const colorScheme: ToastTokenSections.ColorScheme;
declare const css: ToastTokenSections.CSS;
declare const _default: {
    root: ToastTokenSections.Root;
    icon: ToastTokenSections.Icon;
    content: ToastTokenSections.Content;
    text: ToastTokenSections.Text;
    summary: ToastTokenSections.Summary;
    detail: ToastTokenSections.Detail;
    closeButton: ToastTokenSections.CloseButton;
    closeIcon: ToastTokenSections.CloseIcon;
    colorScheme: ToastTokenSections.ColorScheme;
    css: string;
};

export { closeButton, closeIcon, colorScheme, content, css, _default as default, detail, icon, root, summary, text };
