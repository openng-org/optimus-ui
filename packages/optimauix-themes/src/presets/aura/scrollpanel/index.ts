import type { ScrollPanelDesignTokens, ScrollPanelTokenSections } from '@primeuix/themes/types/scrollpanel';

export const root: ScrollPanelTokenSections.Root = {
    transitionDuration: '{transition.duration}'
};

export const bar: ScrollPanelTokenSections.Bar = {
    size: '9px',
    borderRadius: '{border.radius.sm}',
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
            background: '{surface.100}'
        }
    },
    dark: {
        bar: {
            background: '{surface.800}'
        }
    }
};

export default {
    root,
    bar,
    colorScheme
} satisfies ScrollPanelDesignTokens;
