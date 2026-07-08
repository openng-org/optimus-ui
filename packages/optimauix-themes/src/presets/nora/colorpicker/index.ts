import type { ColorPickerDesignTokens, ColorPickerTokenSections } from '@primeuix/themes/types/colorpicker';

export const root: ColorPickerTokenSections.Root = {
    transitionDuration: '{transition.duration}'
};

export const preview: ColorPickerTokenSections.Preview = {
    width: '1.5rem',
    height: '1.5rem',
    borderRadius: '{form.field.border.radius}',
    focusRing: {
        width: '{focus.ring.width}',
        style: '{focus.ring.style}',
        color: '{focus.ring.color}',
        offset: '{focus.ring.offset}',
        shadow: '{focus.ring.shadow}'
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
