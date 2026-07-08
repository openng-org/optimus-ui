import type { ColorPickerDesignTokens, ColorPickerTokenSections } from '@primeuix/themes/types/colorpicker';

export const root: ColorPickerTokenSections.Root = {
    transitionDuration: '{transition.duration}'
};

export const preview: ColorPickerTokenSections.Preview = {
    width: '1.75rem',
    height: '1.75rem',
    borderRadius: '{form.field.border.radius}',
    focusRing: {
        width: '{form.field.focus.ring.width}',
        style: '{form.field.focus.ring.style}',
        color: '{form.field.focus.ring.color}',
        offset: '{form.field.focus.ring.offset}',
        shadow: '{form.field.focus.ring.shadow}'
    }
};

export const panel: ColorPickerTokenSections.Panel = {
    shadow: '{overlay.popover.shadow}',
    borderRadius: '{overlay.popover.borderRadius}'
};

export const colorScheme: ColorPickerTokenSections.ColorScheme = {
    light: {
        panel: {
            background: '{surface.800}',
            borderColor: '{surface.900}'
        },
        handle: {
            color: '{surface.0}'
        }
    },
    dark: {
        panel: {
            background: '{surface.900}',
            borderColor: '{surface.700}'
        },
        handle: {
            color: '{surface.0}'
        }
    }
};

export default {
    root,
    preview,
    panel,
    colorScheme
} satisfies ColorPickerDesignTokens;
