import type { ConfirmPopupDesignTokens, ConfirmPopupTokenSections } from '@primeuix/themes/types/confirmpopup';

export const root: ConfirmPopupTokenSections.Root = {
    background: '{overlay.popover.background}',
    borderColor: '{overlay.popover.border.color}',
    color: '{overlay.popover.color}',
    borderRadius: '{overlay.popover.border.radius}',
    shadow: '{overlay.popover.shadow}',
    gutter: '10px',
    arrowOffset: '1.25rem'
};

export const content: ConfirmPopupTokenSections.Content = {
    padding: '{overlay.popover.padding}',
    gap: '1rem'
};

export const icon: ConfirmPopupTokenSections.Icon = {
    size: '1.5rem',
    color: '{overlay.popover.color}'
};

export const footer: ConfirmPopupTokenSections.Footer = {
    gap: '0.5rem',
    padding: '0 {overlay.popover.padding} {overlay.popover.padding} {overlay.popover.padding}'
};

export default {
    root,
    content,
    icon,
    footer
} satisfies ConfirmPopupDesignTokens;
