import type { PaginatorDesignTokens, PaginatorTokenSections } from '@primeuix/themes/types/paginator';

export const root: PaginatorTokenSections.Root = {
    padding: '0.5rem 1rem',
    gap: '0.25rem',
    borderRadius: '{content.border.radius}',
    background: '{content.background}',
    color: '{content.color}',
    transitionDuration: '{transition.duration}'
};

export const navButton: PaginatorTokenSections.NavButton = {
    background: 'transparent',
    hoverBackground: '{content.hover.background}',
    selectedBackground: '{highlight.background}',
    color: '{text.muted.color}',
    hoverColor: '{text.hover.muted.color}',
    selectedColor: '{highlight.color}',
    width: '2.5rem',
    height: '2.5rem',
    borderRadius: '50%',
    focusRing: {
        width: '{focus.ring.width}',
        style: '{focus.ring.style}',
        color: '{focus.ring.color}',
        offset: '{focus.ring.offset}',
        shadow: '{focus.ring.shadow}'
    }
};

export const currentPageReport: PaginatorTokenSections.CurrentPageReport = {
    color: '{text.muted.color}'
};

export const jumpToPageInput: PaginatorTokenSections.JumpToPageInput = {
    maxWidth: '2.5rem'
};

export default {
    root,
    navButton,
    currentPageReport,
    jumpToPageInput
} satisfies PaginatorDesignTokens;
