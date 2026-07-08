import type { PasswordDesignTokens, PasswordTokenSections } from '@primeuix/themes/types/password';

export const meter: PasswordTokenSections.Meter = {
    background: '{content.border.color}',
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
        strength: {
            weakBackground: '{red.500}',
            mediumBackground: '{amber.500}',
            strongBackground: '{green.500}'
        }
    },
    dark: {
        strength: {
            weakBackground: '{red.400}',
            mediumBackground: '{amber.400}',
            strongBackground: '{green.400}'
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
