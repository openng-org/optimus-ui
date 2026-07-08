import type { StyleOptions } from '@primeuix/styled';
import type { ToggleButtonTokenSections } from '@primeuix/themes/types/togglebutton';

export * from '@primeuix/themes/types/togglebutton';

declare const root: ToggleButtonTokenSections.Root;
declare const icon: ToggleButtonTokenSections.Icon;
declare const content: ToggleButtonTokenSections.Content;
declare const colorScheme: ToggleButtonTokenSections.ColorScheme;
declare const css: ToggleButtonTokenSections.CSS;
declare const _default: {
    root: ToggleButtonTokenSections.Root;
    icon: ToggleButtonTokenSections.Icon;
    content: ToggleButtonTokenSections.Content;
    colorScheme: ToggleButtonTokenSections.ColorScheme;
    css: (options: StyleOptions) => string;
};

export { colorScheme, content, css, _default as default, icon, root };
