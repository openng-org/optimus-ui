import type { DialogDesignTokens, DialogTokenSections } from '@primeuix/themes/types/dialog';

export const root: DialogTokenSections.Root = {
    background: '{overlay.modal.background}',
    borderColor: '{overlay.modal.border.color}',
    color: '{overlay.modal.color}',
    borderRadius: '{overlay.modal.border.radius}',
    shadow: '{overlay.modal.shadow}'
};

export const header: DialogTokenSections.Header = {
    padding: '{overlay.modal.padding}',
    gap: '0.5rem'
};

export const title: DialogTokenSections.Title = {
    fontSize: '1.25rem',
    fontWeight: '600'
};

export const content: DialogTokenSections.Content = {
    padding: '0 {overlay.modal.padding} {overlay.modal.padding} {overlay.modal.padding}'
};

export const footer: DialogTokenSections.Footer = {
    padding: '0 {overlay.modal.padding} {overlay.modal.padding} {overlay.modal.padding}',
    gap: '0.5rem'
};

export default {
    root,
    header,
    title,
    content,
    footer
} satisfies DialogDesignTokens;
