import type { PanelMenuDesignTokens, PanelMenuTokenSections } from '@primeuix/themes/types/panelmenu';

export const root: PanelMenuTokenSections.Root = {
    gap: '0.5rem',
    transitionDuration: '{transition.duration}'
};

export const panel: PanelMenuTokenSections.Panel = {
    background: '{content.background}',
    borderColor: '{content.border.color}',
    borderWidth: '1px',
    color: '{content.color}',
    padding: '0.25rem 0.25rem',
    borderRadius: '{content.border.radius}',
    first: {
        borderWidth: '1px',
        topBorderRadius: '{content.border.radius}'
    },
    last: {
        borderWidth: '1px',
        bottomBorderRadius: '{content.border.radius}'
    }
};

export const item: PanelMenuTokenSections.Item = {
    focusBackground: '{navigation.item.focus.background}',
    color: '{navigation.item.color}',
    focusColor: '{navigation.item.focus.color}',
    gap: '0.5rem',
    padding: '{navigation.item.padding}',
    borderRadius: '{content.border.radius}',
    icon: {
        color: '{navigation.item.icon.color}',
        focusColor: '{navigation.item.icon.focus.color}'
    }
};

export const submenu: PanelMenuTokenSections.Submenu = {
    indent: '1rem'
};

export const submenuIcon: PanelMenuTokenSections.SubmenuIcon = {
    color: '{navigation.submenu.icon.color}',
    focusColor: '{navigation.submenu.icon.focus.color}'
};

export default {
    root,
    panel,
    item,
    submenu,
    submenuIcon
} satisfies PanelMenuDesignTokens;
