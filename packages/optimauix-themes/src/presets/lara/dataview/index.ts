import type { DataViewDesignTokens, DataViewTokenSections } from '@primeuix/themes/types/dataview';

export const root: DataViewTokenSections.Root = {
    borderColor: '{content.border.color}',
    borderWidth: '1px',
    borderRadius: '4px',
    padding: '0'
};

export const header: DataViewTokenSections.Header = {
    borderColor: '{content.border.color}',
    borderWidth: '0 0 1px 0',
    padding: '0.875rem 1.125rem',
    borderRadius: '5px 5px 0 0'
};

export const content: DataViewTokenSections.Content = {
    background: '{content.background}',
    color: '{content.color}',
    borderColor: 'transparent',
    borderWidth: '0',
    padding: '0',
    borderRadius: '5px'
};

export const footer: DataViewTokenSections.Footer = {
    background: '{content.background}',
    color: '{content.color}',
    borderColor: '{content.border.color}',
    borderWidth: '1px 0 0 0',
    padding: '0.875rem 1.125rem',
    borderRadius: '0 0 5px 5px'
};

export const paginatorTop: DataViewTokenSections.PaginatorTop = {
    borderColor: '{content.border.color}',
    borderWidth: '0 0 1px 0'
};

export const paginatorBottom: DataViewTokenSections.PaginatorBottom = {
    borderColor: '{content.border.color}',
    borderWidth: '1px 0 0 0'
};

export const colorScheme: DataViewTokenSections.ColorScheme = {
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
    content,
    footer,
    paginatorTop,
    paginatorBottom,
    colorScheme
} satisfies DataViewDesignTokens;
