import type { DividerDesignTokens, DividerTokenSections } from '@primeuix/themes/types/divider';

export const root: DividerTokenSections.Root = {
    borderColor: '{content.border.color}'
};

export const content: DividerTokenSections.Content = {
    background: '{content.background}',
    color: '{text.color}'
};

export const horizontal: DividerTokenSections.Horizontal = {
    margin: '1.125rem 0',
    padding: '0 1.125rem',
    content: {
        padding: '0 0.625rem'
    }
};

export const vertical: DividerTokenSections.Vertical = {
    margin: '0 1.125rem',
    padding: '1.125rem 0',
    content: {
        padding: '0.625rem 0'
    }
};

export default {
    root,
    content,
    horizontal,
    vertical
} satisfies DividerDesignTokens;
