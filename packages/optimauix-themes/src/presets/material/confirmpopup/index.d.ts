import type { ConfirmPopupTokenSections } from '@primeuix/themes/types/confirmpopup';

export * from '@primeuix/themes/types/confirmpopup';

declare const root: ConfirmPopupTokenSections.Root;
declare const content: ConfirmPopupTokenSections.Content;
declare const icon: ConfirmPopupTokenSections.Icon;
declare const footer: ConfirmPopupTokenSections.Footer;
declare const css: ConfirmPopupTokenSections.CSS;
declare const _default: {
    root: ConfirmPopupTokenSections.Root;
    content: ConfirmPopupTokenSections.Content;
    icon: ConfirmPopupTokenSections.Icon;
    footer: ConfirmPopupTokenSections.Footer;
    css: string;
};

export { content, css, _default as default, footer, icon, root };
