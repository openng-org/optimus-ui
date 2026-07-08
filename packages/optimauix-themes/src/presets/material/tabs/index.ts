import type { TabsDesignTokens, TabsTokenSections } from '@primeuix/themes/types/tabs';

export const root: TabsTokenSections.Root = {
    transitionDuration: '{transition.duration}'
};

export const tablist: TabsTokenSections.Tablist = {
    borderWidth: '0 0 1px 0',
    background: '{content.background}',
    borderColor: '{content.border.color}'
};

export const tab: TabsTokenSections.Tab = {
    background: 'transparent',
    hoverBackground: '{content.hover.background}',
    activeBackground: 'transparent',
    borderWidth: '0 0 1px 0',
    borderColor: '{content.border.color}',
    hoverBorderColor: '{content.border.color}',
    activeBorderColor: '{primary.color}',
    color: '{text.color}',
    hoverColor: '{text.color}',
    activeColor: '{primary.color}',
    padding: '1rem 1.25rem',
    fontWeight: '600',
    margin: '0 0 -1px 0',
    gap: '0.5rem',
    focusRing: {
        width: '0',
        style: 'none',
        color: 'unset',
        offset: '0',
        shadow: 'none'
    }
};

export const tabpanel: TabsTokenSections.Tabpanel = {
    background: '{content.background}',
    color: '{content.color}',
    padding: '1.25rem 1.25rem 1.25rem 1.25rem',
    focusRing: {
        width: '0',
        style: 'none',
        color: 'unset',
        offset: '0',
        shadow: 'none'
    }
};

export const navButton: TabsTokenSections.NavButton = {
    background: '{content.background}',
    color: '{text.muted.color}',
    hoverColor: '{text.color}',
    width: '3rem',
    shadow: 'none',
    focusRing: {
        width: '0',
        style: 'none',
        color: 'unset',
        offset: '0',
        shadow: 'none'
    }
};

export const activeBar: TabsTokenSections.ActiveBar = {
    height: '2px',
    bottom: '-1px',
    background: '{primary.color}'
};

export const css: TabsTokenSections.CSS = /*css*/ `
.p-tabs-scrollable .p-tab {
    flex-grow: 0
}

.p-tab-active {
    --p-ripple-background: color-mix(in srgb, dt('primary.color'), transparent 90%);
}

.p-tab:not(.p-disabled):focus-visible {
    background: dt('navigation.item.active.background');
}

.p-tablist-nav-button:focus-visible {
    background: dt('navigation.item.active.background');
}
`;

export default {
    root,
    tablist,
    tab,
    tabpanel,
    navButton,
    activeBar,
    css
} satisfies TabsDesignTokens;
