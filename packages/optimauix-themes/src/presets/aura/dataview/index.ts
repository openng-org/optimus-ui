import type { DataViewDesignTokens, DataViewTokenSections } from '@primeuix/themes/types/dataview';

export const root: DataViewTokenSections.Root = {
    borderColor: 'transparent',
    borderWidth: '0',
    borderRadius: '0',
    padding: '0'
};

export const header: DataViewTokenSections.Header = {
    background: '{content.background}',
    color: '{content.color}',
    borderColor: '{content.border.color}',
    borderWidth: '0 0 1px 0',
    padding: '0.75rem 1rem',
    borderRadius: '0'
};

export const content: DataViewTokenSections.Content = {
    background: '{content.background}',
    color: '{content.color}',
    borderColor: 'transparent',
    borderWidth: '0',
    padding: '0',
    borderRadius: '0'
};

export const footer: DataViewTokenSections.Footer = {
    background: '{content.background}',
    color: '{content.color}',
    borderColor: '{content.border.color}',
    borderWidth: '1px 0 0 0',
    padding: '0.75rem 1rem',
    borderRadius: '0'
};

export const paginatorTop: DataViewTokenSections.PaginatorTop = {
    borderColor: '{content.border.color}',
    borderWidth: '0 0 1px 0'
};

export const paginatorBottom: DataViewTokenSections.PaginatorBottom = {
    borderColor: '{content.border.color}',
    borderWidth: '1px 0 0 0'
};

export default {
    root,
    header,
    content,
    footer,
    paginatorTop,
    paginatorBottom
} satisfies DataViewDesignTokens;
