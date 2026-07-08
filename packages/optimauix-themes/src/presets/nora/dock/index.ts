import type { DockDesignTokens, DockTokenSections } from '@primeuix/themes/types/dock';

export const root: DockTokenSections.Root = {
    background: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    padding: '0.5rem',
    borderRadius: '{border.radius.xl}'
};

export const item: DockTokenSections.Item = {
    borderRadius: '{content.border.radius}',
    padding: '0.5rem',
    size: '3rem',
    focusRing: {
        width: '{focus.ring.width}',
        style: '{focus.ring.style}',
        color: '{focus.ring.color}',
        offset: '{focus.ring.offset}',
        shadow: '{focus.ring.shadow}'
    }
};

export default {
    root,
    item
} satisfies DockDesignTokens;
