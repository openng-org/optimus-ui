import type { CardDesignTokens, CardTokenSections } from '@primeuix/themes/types/card';

export const root: CardTokenSections.Root = {
    background: '{content.background}',
    borderRadius: '{border.radius.lg}',
    color: '{content.color}',
    shadow: '0 .125rem .25rem rgba(0,0,0,.075)'
};

export const body: CardTokenSections.Body = {
    padding: '1.5rem',
    gap: '0.75rem'
};

export const caption: CardTokenSections.Caption = {
    gap: '0.5rem'
};

export const title: CardTokenSections.Title = {
    fontSize: '1.25rem',
    fontWeight: '700'
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
