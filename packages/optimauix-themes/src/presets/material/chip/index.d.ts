import type { ChipTokenSections } from '@primeuix/themes/types/chip';

export * from '@primeuix/themes/types/chip';

declare const root: ChipTokenSections.Root;
declare const image: ChipTokenSections.Image;
declare const icon: ChipTokenSections.Icon;
declare const removeIcon: ChipTokenSections.RemoveIcon;
declare const colorScheme: ChipTokenSections.ColorScheme;
declare const css: ChipTokenSections.CSS;
declare const _default: {
    root: ChipTokenSections.Root;
    image: ChipTokenSections.Image;
    icon: ChipTokenSections.Icon;
    removeIcon: ChipTokenSections.RemoveIcon;
    colorScheme: ChipTokenSections.ColorScheme;
    css: string;
};

export { colorScheme, css, _default as default, icon, image, removeIcon, root };
