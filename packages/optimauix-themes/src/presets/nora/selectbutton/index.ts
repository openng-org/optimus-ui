import type { SelectButtonDesignTokens, SelectButtonTokenSections } from '@primeuix/themes/types/selectbutton';

export const root: SelectButtonTokenSections.Root = {
    borderRadius: '{form.field.border.radius}'
};

export const colorScheme: SelectButtonTokenSections.ColorScheme = {
    light: {
        root: {
            invalidBorderColor: '{form.field.invalid.border.color}'
        }
    },
    dark: {
        root: {
            invalidBorderColor: '{form.field.invalid.border.color}'
        }
    }
};

export default {
    root,
    colorScheme
} satisfies SelectButtonDesignTokens;
