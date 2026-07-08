import type { PanelDesignTokens, PanelTokenSections } from '@primeuix/themes/types/panel';

export const root: PanelTokenSections.Root = {
    background: '{content.background}',
    borderColor: '{content.border.color}',
    color: '{content.color}',
    borderRadius: '{content.border.radius}'
};

export const header: PanelTokenSections.Header = {
    background: 'transparent',
    color: '{text.color}',
    padding: '1.125rem',
    borderWidth: '0 0 1px 0',
    borderColor: '{content.border.color}',
    borderRadius: '0'
};

export const toggleableHeader: PanelTokenSections.ToggleableHeader = {
    padding: '0.375rem 1.125rem'
};

export const title: PanelTokenSections.Title = {
    fontWeight: '700'
};

export const content: PanelTokenSections.Content = {
    padding: '1.125rem'
};

export const footer: PanelTokenSections.Footer = {
    padding: '0 1.125rem 1.125rem 1.125rem'
};

export default {
    root,
    header,
    toggleableHeader,
    title,
    content,
    footer
} satisfies PanelDesignTokens;
