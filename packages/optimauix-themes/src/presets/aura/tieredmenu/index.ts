import type { TieredMenuDesignTokens, TieredMenuTokenSections } from '@primeuix/themes/types/tieredmenu';

export const root: TieredMenuTokenSections.Root = {
    background: '{content.background}',
    borderColor: '{content.border.color}',
    color: '{content.color}',
    borderRadius: '{content.border.radius}',
    shadow: '{overlay.navigation.shadow}',
    transitionDuration: '{transition.duration}'
};

export const list: TieredMenuTokenSections.List = {
    padding: '{navigation.list.padding}',
    gap: '{navigation.list.gap}'
};

export const item: TieredMenuTokenSections.Item = {
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

export const submenu: TieredMenuTokenSections.Submenu = {
    mobileIndent: '1rem'
};

export const submenuIcon: TieredMenuTokenSections.SubmenuIcon = {
    size: '{navigation.submenu.icon.size}',
    color: '{navigation.submenu.icon.color}',
    focusColor: '{navigation.submenu.icon.focus.color}',
    activeColor: '{navigation.submenu.icon.active.color}'
};

export const separator: TieredMenuTokenSections.Separator = {
    borderColor: '{content.border.color}'
};

export default {
    root,
    list,
    item,
    submenu,
    submenuIcon,
    separator
} satisfies TieredMenuDesignTokens;
