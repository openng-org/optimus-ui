import type { ColorPickerTokenSections } from '@primeuix/themes/types/colorpicker';

export * from '@primeuix/themes/types/colorpicker';

declare const root: ColorPickerTokenSections.Root;
declare const preview: ColorPickerTokenSections.Preview;
declare const panel: ColorPickerTokenSections.Panel;
declare const colorScheme: ColorPickerTokenSections.ColorScheme;
declare const _default: {
    root: ColorPickerTokenSections.Root;
    preview: ColorPickerTokenSections.Preview;
    panel: ColorPickerTokenSections.Panel;
    colorScheme: ColorPickerTokenSections.ColorScheme;
};

export { colorScheme, _default as default, panel, preview, root };
