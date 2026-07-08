import type { PasswordTokenSections } from '@primeuix/themes/types/password';

export * from '@primeuix/themes/types/password';

declare const meter: PasswordTokenSections.Meter;
declare const icon: PasswordTokenSections.Icon;
declare const overlay: PasswordTokenSections.Overlay;
declare const content: PasswordTokenSections.Content;
declare const colorScheme: PasswordTokenSections.ColorScheme;
declare const _default: {
    meter: PasswordTokenSections.Meter;
    icon: PasswordTokenSections.Icon;
    overlay: PasswordTokenSections.Overlay;
    content: PasswordTokenSections.Content;
    colorScheme: PasswordTokenSections.ColorScheme;
};

export { colorScheme, content, _default as default, icon, meter, overlay };
