import type { KnobDesignTokens, KnobTokenSections } from '@primeuix/themes/types/knob';

export const root: KnobTokenSections.Root = {
    transitionDuration: '{transition.duration}',
    focusRing: {
        width: '{focus.ring.width}',
        style: '{focus.ring.style}',
        color: '{focus.ring.color}',
        offset: '{focus.ring.offset}',
        shadow: '{focus.ring.shadow}'
    }
};

export const value: KnobTokenSections.Value = {
    background: '{primary.color}'
};

export const text: KnobTokenSections.Text = {
    color: '{text.muted.color}'
};

export const colorScheme: KnobTokenSections.ColorScheme = {
    light: {
        range: {
            background: '{surface.300}'
        }
    },
    dark: {
        range: {
            background: '{surface.600}'
        }
    }
};

export default {
    root,
    value,
    text,
    colorScheme
} satisfies KnobDesignTokens;
