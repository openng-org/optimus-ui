import type { InputGroupDesignTokens, InputGroupTokenSections } from '@primeuix/themes/types/inputgroup';

export const addon: InputGroupTokenSections.Addon = {
    borderRadius: '{form.field.border.radius}',
    padding: '0.625rem 0.5rem',
    minWidth: '2.75rem'
};

export const colorScheme: InputGroupTokenSections.ColorScheme = {
    light: {
        addon: {
            background: '{surface.50}',
            borderColor: '{form.field.border.color}',
            color: '{text.muted.color}'
        }
    },
    dark: {
        addon: {
            background: '{surface.800}',
            borderColor: '{form.field.border.color}',
            color: '{text.muted.color}'
        }
    }
};

export default {
    addon,
    colorScheme
} satisfies InputGroupDesignTokens;
