import type { SliderTokenSections } from '@primeuix/themes/types/slider';

export * from '@primeuix/themes/types/slider';

declare const root: SliderTokenSections.Root;
declare const track: SliderTokenSections.Track;
declare const range: SliderTokenSections.Range;
declare const handle: SliderTokenSections.Handle;
declare const colorScheme: SliderTokenSections.ColorScheme;
declare const _default: {
    root: SliderTokenSections.Root;
    track: SliderTokenSections.Track;
    range: SliderTokenSections.Range;
    handle: SliderTokenSections.Handle;
    colorScheme: SliderTokenSections.ColorScheme;
};

export { colorScheme, _default as default, handle, range, root, track };
