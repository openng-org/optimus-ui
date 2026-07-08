import type { PanelDesignTokens, PanelTokenSections } from '@primeuix/themes/types/panel';

export const root: PanelTokenSections.Root = {
    background: '{content.background}',
    borderColor: '{content.border.color}',
    borderRadius: '{content.border.radius}',
    color: '{content.color}'
};

export const header: PanelTokenSections.Header = {
    borderWidth: '0 0 1px 0',
    borderColor: '{content.border.color}',
    padding: '1.125rem',
    borderRadius: '5px 5px 0 0'
};

export const toggleableHeader: PanelTokenSections.ToggleableHeader = {
    padding: '0.25rem 1.125rem'
};

export const title: PanelTokenSections.Title = {
    fontWeight: '700'
};

export const content: PanelTokenSections.Content = {
    padding: '1.125rem'
};

export const footer: PanelTokenSections.Footer = {
    padding: '1.125rem'
};

export const colorScheme: PanelTokenSections.ColorScheme = {
    light: {
        header: {
            background: '{surface.50}',
            color: '{text.color}'
        }
    },
    dark: {
        header: {
            background: '{surface.800}',
            color: '{text.color}'
        }
    }
};

export default {
    root,
    header,
    toggleableHeader,
    title,
    content,
    footer,
    colorScheme
} satisfies PanelDesignTokens;
