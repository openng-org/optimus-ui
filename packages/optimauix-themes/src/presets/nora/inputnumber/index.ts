import type { InputNumberDesignTokens, InputNumberTokenSections } from '@primeuix/themes/types/inputnumber';

export const root: InputNumberTokenSections.Root = {
    transitionDuration: '{transition.duration}'
};

export const button: InputNumberTokenSections.Button = {
    background: 'transparent',
    borderColor: '{form.field.border.color}',
    hoverBorderColor: '{form.field.border.color}',
    activeBorderColor: '{form.field.border.color}',
    color: '{form.field.icon.color}',
    hoverColor: '{form.field.icon.color}',
    activeColor: '{form.field.icon.color}',
    width: '2.5rem',
    borderRadius: '{form.field.border.radius}',
    verticalPadding: '{form.field.padding.y}'
};

export const colorScheme: InputNumberTokenSections.ColorScheme = {
    light: {
        button: {
            hoverBackground: '{surface.200}',
            activeBackground: '{surface.300}'
        }
    },
    dark: {
        button: {
            hoverBackground: '{surface.700}',
            activeBackground: '{surface.600}'
        }
    }
};

export default {
    root,
    button,
    colorScheme
} satisfies InputNumberDesignTokens;
