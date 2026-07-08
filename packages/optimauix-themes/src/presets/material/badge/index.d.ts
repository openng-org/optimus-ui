import type { BadgeTokenSections } from '@primeuix/themes/types/badge';

export * from '@primeuix/themes/types/badge';

declare const root: BadgeTokenSections.Root;
declare const dot: BadgeTokenSections.Dot;
declare const sm: BadgeTokenSections.Sm;
declare const lg: BadgeTokenSections.Lg;
declare const xl: BadgeTokenSections.Xl;
declare const colorScheme: BadgeTokenSections.ColorScheme;
declare const css: BadgeTokenSections.CSS;
declare const _default: {
    root: BadgeTokenSections.Root;
    dot: BadgeTokenSections.Dot;
    sm: BadgeTokenSections.Sm;
    lg: BadgeTokenSections.Lg;
    xl: BadgeTokenSections.Xl;
    colorScheme: BadgeTokenSections.ColorScheme;
    css: string;
};

export { colorScheme, css, _default as default, dot, lg, root, sm, xl };
