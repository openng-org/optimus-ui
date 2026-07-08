import type { TabsDesignTokens, TabsTokenSections } from '@primeuix/themes/types/tabs';

export const root: TabsTokenSections.Root = {
    transitionDuration: '{transition.duration}'
};

export const tablist: TabsTokenSections.Tablist = {
    borderWidth: '0',
    background: '{content.background}',
    borderColor: '{content.border.color}'
};

export const tab: TabsTokenSections.Tab = {
    borderWidth: '2px 0 0 0',
    borderColor: 'transparent',
    hoverBorderColor: 'transparent',
    activeBorderColor: '{primary.color}',
    color: '{text.muted.color}',
    hoverColor: '{text.color}',
    activeColor: '{primary.color}',
    padding: '1rem 1.25rem',
    fontWeight: '700',
    margin: '0',
    gap: '0.5rem',
    focusRing: {
        width: '{focus.ring.width}',
        style: '{focus.ring.style}',
        color: '{focus.ring.color}',
        offset: '{focus.ring.offset}',
        shadow: 'inset {focus.ring.shadow}'
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
        offset: '{focus.ring.offset}',
        shadow: 'inset {focus.ring.shadow}'
    }
};

export const activeBar: TabsTokenSections.ActiveBar = {
    height: '0',
    bottom: '0',
    background: 'transparent'
};

export const colorScheme: TabsTokenSections.ColorScheme = {
    light: {
        navButton: {
            shadow: '0px 0px 10px 50px rgba(255, 255, 255, 0.6)'
        },
        tab: {
            background: '{surface.50}',
            hoverBackground: '{surface.100}',
            activeBackground: '{surface.0}'
        }
    },
    dark: {
        navButton: {
            shadow: '0px 0px 10px 50px color-mix(in srgb, {content.background}, transparent 50%)'
        },
        tab: {
            background: '{surface.800}',
            hoverBackground: '{surface.700}',
            activeBackground: '{surface.900}'
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
