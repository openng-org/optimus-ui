import type { MegaMenuDesignTokens, MegaMenuTokenSections } from '@primeuix/themes/types/megamenu';

export const root: MegaMenuTokenSections.Root = {
    background: '{content.background}',
    borderColor: '{content.border.color}',
    borderRadius: '{content.border.radius}',
    color: '{content.color}',
    gap: '0.5rem',
    verticalOrientation: {
        padding: '{navigation.list.padding}',
        gap: '{navigation.list.gap}'
    },
    horizontalOrientation: {
        padding: '0.5rem 0.75rem',
        gap: '0.5rem'
    },
    transitionDuration: '{transition.duration}'
};

export const baseItem: MegaMenuTokenSections.BaseItem = {
    borderRadius: '{content.border.radius}',
    padding: '{navigation.item.padding}'
};

export const item: MegaMenuTokenSections.Item = {
    focusBackground: '{navigation.item.focus.background}',
    activeBackground: '{navigation.item.active.background}',
    color: '{navigation.item.color}',
    focusColor: '{navigation.item.focus.color}',
    activeColor: '{navigation.item.active.color}',
    padding: '{navigation.item.padding}',
    borderRadius: '{navigation.item.border.radius}',
    gap: '{navigation.item.gap}',
    icon: {
        color: '{navigation.item.icon.color}',
        focusColor: '{navigation.item.icon.focus.color}',
        activeColor: '{navigation.item.icon.active.color}'
    }
};

export const overlay: MegaMenuTokenSections.Overlay = {
    padding: '0',
    background: '{content.background}',
    borderColor: 'transparent',
    borderRadius: '{content.border.radius}',
    color: '{content.color}',
    shadow: '{overlay.navigation.shadow}',
    gap: '0.5rem'
};

export const submenu: MegaMenuTokenSections.Submenu = {
    padding: '{navigation.list.padding}',
    gap: '{navigation.list.gap}'
};

export const submenuLabel: MegaMenuTokenSections.SubmenuLabel = {
    padding: '{navigation.submenu.label.padding}',
    fontWeight: '{navigation.submenu.label.font.weight}',
    background: '{navigation.submenu.label.background}',
    color: '{navigation.submenu.label.color}'
};

export const submenuIcon: MegaMenuTokenSections.SubmenuIcon = {
    size: '{navigation.submenu.icon.size}',
    color: '{navigation.submenu.icon.color}',
    focusColor: '{navigation.submenu.icon.focus.color}',
    activeColor: '{navigation.submenu.icon.active.color}'
};

export const separator: MegaMenuTokenSections.Separator = {
    borderColor: '{content.border.color}'
};

export const mobileButton: MegaMenuTokenSections.MobileButton = {
    borderRadius: '50%',
    size: '2.5rem',
    color: '{text.muted.color}',
    hoverColor: '{text.hover.muted.color}',
    hoverBackground: '{content.hover.background}',
    focusRing: {
        width: '0',
        style: 'none',
        color: 'unset',
        offset: '0',
        shadow: 'none'
    }
};

export const css: MegaMenuTokenSections.CSS = /*css*/ `
.p-megamenu-button:focus-visible {
    background: dt('navigation.item.active.background');
}
`;

export default {
    root,
    baseItem,
    item,
    overlay,
    submenu,
    submenuLabel,
    submenuIcon,
    separator,
    mobileButton,
    css
} satisfies MegaMenuDesignTokens;
