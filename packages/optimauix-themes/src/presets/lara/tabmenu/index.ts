import type { TabmenuDesignTokens, TabmenuTokenSections } from '@primeuix/themes/types/tabmenu';

export const root: TabmenuTokenSections.Root = {
    transitionDuration: '{transition.duration}'
};

export const tablist: TabmenuTokenSections.Tablist = {
    borderWidth: '0',
    background: '{content.background}',
    borderColor: '{content.border.color}'
};

export const item: TabmenuTokenSections.Item = {
    borderWidth: '2px 0 0 0',
    borderColor: 'transparent',
    hoverBorderColor: 'transparent',
    activeBorderColor: '{primary.color}',
    color: '{text.muted.color}',
    hoverColor: '{text.color}',
    activeColor: '{primary.color}',
    padding: '1rem 1.25rem',
    fontWeight: '600',
    margin: '0',
    gap: '0.5rem',
    focusRing: {
        width: '{focus.ring.width}',
        style: '{focus.ring.style}',
        color: '{focus.ring.color}',
        offset: '{focus.ring.offset}',
        shadow: '{focus.ring.shadow}'
    }
};

export const itemIcon: TabmenuTokenSections.ItemIcon = {
    color: '{text.muted.color}',
    hoverColor: '{text.color}',
    activeColor: '{primary.color}'
};

export const activeBar: TabmenuTokenSections.ActiveBar = {
    height: '0',
    bottom: '0',
    background: 'transparent'
};

export const colorScheme: TabmenuTokenSections.ColorScheme = {
    light: {
        item: {
            background: '{surface.50}',
            hoverBackground: '{surface.100}',
            activeBackground: '{surface.0}'
        }
    },
    dark: {
        item: {
            background: '{surface.800}',
            hoverBackground: '{surface.700}',
            activeBackground: '{surface.900}'
        }
    }
};

export default {
    root,
    tablist,
    item,
    itemIcon,
    activeBar,
    colorScheme
} satisfies TabmenuDesignTokens;
