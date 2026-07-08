import type { ToolbarDesignTokens, ToolbarTokenSections } from '@primeuix/themes/types/toolbar';

export const root: ToolbarTokenSections.Root = {
    background: '{content.background}',
    borderColor: '{content.border.color}',
    borderRadius: '{content.border.radius}',
    color: '{content.color}',
    gap: '0.5rem',
    padding: '0.75rem'
};

export default {
    root
} satisfies ToolbarDesignTokens;
