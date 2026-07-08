import type { MegaMenuDesignTokens, MegaMenuTokenSections } from '@primeuix/themes/types/megamenu';

export const root: MegaMenuTokenSections.Root = {
    borderColor: 'transparent',
    borderRadius: '{content.border.radius}',
    color: '{content.color}',
    gap: '0.5rem',
    verticalOrientation: {
        padding: '{navigation.list.padding}',
        gap: '{navigation.list.gap}'
    },
    horizontalOrientation: {
        padding: '0.75rem 1rem',
        gap: '0.5rem'
    },
    transitionDuration: '{transition.duration}'
};

export const baseItem: MegaMenuTokenSections.BaseItem = {
    borderRadius: '{content.border.radius}',
    padding: '0.75rem 1rem'
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
    borderColor: '{content.border.color}',
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
    size: '2rem',
    color: '{text.muted.color}',
    hoverColor: '{text.hover.muted.color}',
    hoverBackground: '{content.hover.background}',
    focusRing: {
        width: '{focus.ring.width}',
        style: '{focus.ring.style}',
        color: '{focus.ring.color}',
        offset: '{focus.ring.offset}',
        shadow: '{focus.ring.shadow}'
    }
};

export const colorScheme: MegaMenuTokenSections.ColorScheme = {
    light: {
        root: {
            background: '{surface.50}'
        }
    },
    dark: {
        root: {
            background: '{surface.800}'
        }
    }
};

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
    colorScheme
} satisfies MegaMenuDesignTokens;
