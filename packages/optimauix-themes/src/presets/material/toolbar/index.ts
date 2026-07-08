import type { ToolbarDesignTokens, ToolbarTokenSections } from '@primeuix/themes/types/toolbar';

export const root: ToolbarTokenSections.Root = {
    color: '{content.color}',
    borderRadius: '{content.border.radius}',
    gap: '0.5rem',
    padding: '1rem'
};

export const colorScheme: ToolbarTokenSections.ColorScheme = {
    light: {
        root: {
            background: '{surface.100}',
            borderColor: '{surface.100}'
        }
    },
    dark: {
        root: {
            background: '{surface.800}',
            borderColor: '{surface.800}'
        }
    }
};

export const css: ToolbarTokenSections.CSS = /*css*/ ``;

export default {
    root,
    colorScheme,
    css
} satisfies ToolbarDesignTokens;
