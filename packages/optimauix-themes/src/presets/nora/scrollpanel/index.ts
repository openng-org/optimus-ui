import type { ScrollPanelDesignTokens, ScrollPanelTokenSections } from '@primeuix/themes/types/scrollpanel';

export const root: ScrollPanelTokenSections.Root = {
    transitionDuration: '{transition.duration}'
};

export const bar: ScrollPanelTokenSections.Bar = {
    size: '9px',
    borderRadius: '{border.radius.xs}',
    focusRing: {
        width: '{focus.ring.width}',
        style: '{focus.ring.style}',
        color: '{focus.ring.color}',
        offset: '{focus.ring.offset}',
        shadow: '{focus.ring.shadow}'
    }
};

export const colorScheme: ScrollPanelTokenSections.ColorScheme = {
    light: {
        bar: {
            background: '{surface.200}'
        }
    },
    dark: {
        bar: {
            background: '{surface.700}'
        }
    }
};

export default {
    root,
    bar,
    colorScheme
} satisfies ScrollPanelDesignTokens;
