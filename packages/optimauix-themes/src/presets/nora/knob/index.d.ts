import type { KnobTokenSections } from '@primeuix/themes/types/knob';

export * from '@primeuix/themes/types/knob';

declare const root: KnobTokenSections.Root;
declare const value: KnobTokenSections.Value;
declare const text: KnobTokenSections.Text;
declare const colorScheme: KnobTokenSections.ColorScheme;
declare const _default: {
    root: KnobTokenSections.Root;
    value: KnobTokenSections.Value;
    text: KnobTokenSections.Text;
    colorScheme: KnobTokenSections.ColorScheme;
};

export { colorScheme, _default as default, root, text, value };
