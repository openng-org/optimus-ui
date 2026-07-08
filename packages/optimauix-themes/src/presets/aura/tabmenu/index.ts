import type { TabmenuDesignTokens, TabmenuTokenSections } from '@primeuix/themes/types/tabmenu';

export const root: TabmenuTokenSections.Root = {
    transitionDuration: '{transition.duration}'
};

export const tablist: TabmenuTokenSections.Tablist = {
    borderWidth: '0 0 1px 0',
    background: '{content.background}',
    borderColor: '{content.border.color}'
};

export const item: TabmenuTokenSections.Item = {
    background: 'transparent',
    hoverBackground: 'transparent',
    activeBackground: 'transparent',
    borderWidth: '0 0 1px 0',
    borderColor: '{content.border.color}',
    hoverBorderColor: '{content.border.color}',
    activeBorderColor: '{primary.color}',
    color: '{text.muted.color}',
    hoverColor: '{text.color}',
    activeColor: '{primary.color}',
    padding: '1rem 1.125rem',
    fontWeight: '600',
    margin: '0 0 -1px 0',
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
    height: '1px',
    bottom: '-1px',
    background: '{primary.color}'
};

export default {
    root,
    tablist,
    item,
    itemIcon,
    activeBar
} satisfies TabmenuDesignTokens;
