import type { KnobTokenSections } from '@primeuix/themes/types/knob';

export * from '@primeuix/themes/types/knob';

declare const root: KnobTokenSections.Root;
declare const value: KnobTokenSections.Value;
declare const range: KnobTokenSections.Range;
declare const text: KnobTokenSections.Text;
declare const css: KnobTokenSections.CSS;
declare const _default: {
    root: KnobTokenSections.Root;
    value: KnobTokenSections.Value;
    range: KnobTokenSections.Range;
    text: KnobTokenSections.Text;
    css: string;
};

export { css, _default as default, range, root, text, value };
