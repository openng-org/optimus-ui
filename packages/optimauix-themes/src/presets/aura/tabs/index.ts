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
        offset: '-1px',
        shadow: '{focus.ring.shadow}'
    }
};

export const tabpanel: TabsTokenSections.Tabpanel = {
    background: '{content.background}',
    color: '{content.color}',
    padding: '0.875rem 1.125rem 1.125rem 1.125rem',
    focusRing: {
        width: '{focus.ring.width}',
        style: '{focus.ring.style}',
        color: '{focus.ring.color}',
        offset: '{focus.ring.offset}',
        shadow: 'inset {focus.ring.shadow}'
    }
};

export const navButton: TabsTokenSections.NavButton = {
    background: '{content.background}',
    color: '{text.muted.color}',
    hoverColor: '{text.color}',
    width: '2.5rem',
    focusRing: {
        width: '{focus.ring.width}',
        style: '{focus.ring.style}',
        color: '{focus.ring.color}',
        offset: '-1px',
        shadow: '{focus.ring.shadow}'
    }
};

export const activeBar: TabsTokenSections.ActiveBar = {
    height: '1px',
    bottom: '-1px',
    background: '{primary.color}'
};

export const colorScheme: TabsTokenSections.ColorScheme = {
    light: {
        navButton: {
            shadow: '0px 0px 10px 50px rgba(255, 255, 255, 0.6)'
        }
    },
    dark: {
        navButton: {
            shadow: '0px 0px 10px 50px color-mix(in srgb, {content.background}, transparent 50%)'
        }
    }
};

export default {
    root,
    tablist,
    tab,
    tabpanel,
    navButton,
    activeBar,
    colorScheme
} satisfies TabsDesignTokens;
