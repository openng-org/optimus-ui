import type { PasswordDesignTokens, PasswordTokenSections } from '@primeuix/themes/types/password';

export const meter: PasswordTokenSections.Meter = {
    borderRadius: '{content.border.radius}',
    height: '.75rem'
};

export const icon: PasswordTokenSections.Icon = {
    color: '{form.field.icon.color}'
};

export const overlay: PasswordTokenSections.Overlay = {
    background: '{overlay.popover.background}',
    borderColor: '{overlay.popover.border.color}',
    borderRadius: '{overlay.popover.border.radius}',
    color: '{overlay.popover.color}',
    padding: '{overlay.popover.padding}',
    shadow: '{overlay.popover.shadow}'
};

export const content: PasswordTokenSections.Content = {
    gap: '0.5rem'
};

export const colorScheme: PasswordTokenSections.ColorScheme = {
    light: {
        meter: {
            background: '{surface.300}'
        },
        strength: {
            weakBackground: '{red.600}',
            mediumBackground: '{yellow.600}',
            strongBackground: '{green.600}'
        }
    },
    dark: {
        meter: {
            background: '{surface.600}'
        },
        strength: {
            weakBackground: '{red.500}',
            mediumBackground: '{yellow.500}',
            strongBackground: '{green.500}'
        }
    }
};

export default {
    meter,
    icon,
    overlay,
    content,
    colorScheme
} satisfies PasswordDesignTokens;
