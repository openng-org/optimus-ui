import type { DrawerDesignTokens, DrawerTokenSections } from '@primeuix/themes/types/drawer';

export const root: DrawerTokenSections.Root = {
    background: '{overlay.modal.background}',
    borderColor: '{overlay.modal.border.color}',
    color: '{overlay.modal.color}',
    shadow: '{overlay.modal.shadow}'
};

export const header: DrawerTokenSections.Header = {
    padding: '{overlay.modal.padding}'
};

export const title: DrawerTokenSections.Title = {
    fontSize: '1.5rem',
    fontWeight: '600'
};

export const content: DrawerTokenSections.Content = {
    padding: '0 {overlay.modal.padding} {overlay.modal.padding} {overlay.modal.padding}'
};

export const footer: DrawerTokenSections.Footer = {
    padding: '{overlay.modal.padding}'
};

export default {
    root,
    header,
    title,
    content,
    footer
} satisfies DrawerDesignTokens;
