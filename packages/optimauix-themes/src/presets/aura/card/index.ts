import type { CardDesignTokens, CardTokenSections } from '@primeuix/themes/types/card';

export const root: CardTokenSections.Root = {
    background: '{content.background}',
    borderRadius: '{border.radius.xl}',
    color: '{content.color}',
    shadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)'
};

export const body: CardTokenSections.Body = {
    padding: '1.25rem',
    gap: '0.5rem'
};

export const caption: CardTokenSections.Caption = {
    gap: '0.5rem'
};

export const title: CardTokenSections.Title = {
    fontSize: '1.25rem',
    fontWeight: '500'
};

export const subtitle: CardTokenSections.Subtitle = {
    color: '{text.muted.color}'
};

export default {
    root,
    body,
    caption,
    title,
    subtitle
} satisfies CardDesignTokens;
