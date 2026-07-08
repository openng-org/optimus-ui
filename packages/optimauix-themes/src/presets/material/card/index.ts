import type { CardDesignTokens, CardTokenSections } from '@primeuix/themes/types/card';

export const root: CardTokenSections.Root = {
    background: '{content.background}',
    borderRadius: '{content.border.radius}',
    color: '{content.color}',
    shadow: '0 2px 1px -1px rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 1px 3px 0 rgba(0,0,0,.12)'
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
    fontWeight: '500'
};

export const subtitle: CardTokenSections.Subtitle = {
    color: '{text.muted.color}'
};

export const css: CardTokenSections.CSS = /*css*/ ``;

export default {
    root,
    body,
    caption,
    title,
    subtitle,
    css
} satisfies CardDesignTokens;
