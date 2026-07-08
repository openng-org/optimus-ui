import type { PasswordTokenSections } from '@primeuix/themes/types/password';

export * from '@primeuix/themes/types/password';

declare const meter: PasswordTokenSections.Meter;
declare const icon: PasswordTokenSections.Icon;
declare const overlay: PasswordTokenSections.Overlay;
declare const content: PasswordTokenSections.Content;
declare const colorScheme: PasswordTokenSections.ColorScheme;
declare const css: PasswordTokenSections.CSS;
declare const _default: {
    meter: PasswordTokenSections.Meter;
    icon: PasswordTokenSections.Icon;
    overlay: PasswordTokenSections.Overlay;
    content: PasswordTokenSections.Content;
    colorScheme: PasswordTokenSections.ColorScheme;
    css: string;
};

export { colorScheme, content, css, _default as default, icon, meter, overlay };
