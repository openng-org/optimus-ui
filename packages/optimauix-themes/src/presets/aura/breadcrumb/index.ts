import type { BreadcrumbDesignTokens, BreadcrumbTokenSections } from '@primeuix/themes/types/breadcrumb';

export const root: BreadcrumbTokenSections.Root = {
    padding: '1rem',
    background: '{content.background}',
    gap: '0.5rem',
    transitionDuration: '{transition.duration}'
};

export const item: BreadcrumbTokenSections.Item = {
    color: '{text.muted.color}',
    hoverColor: '{text.color}',
    borderRadius: '{content.border.radius}',
    gap: '{navigation.item.gap}',
    icon: {
        color: '{navigation.item.icon.color}',
        hoverColor: '{navigation.item.icon.focus.color}'
    },
    focusRing: {
        width: '{focus.ring.width}',
        style: '{focus.ring.style}',
        color: '{focus.ring.color}',
        offset: '{focus.ring.offset}',
        shadow: '{focus.ring.shadow}'
    }
};

export const separator: BreadcrumbTokenSections.Separator = {
    color: '{navigation.item.icon.color}'
};

export default {
    root,
    item,
    separator
} satisfies BreadcrumbDesignTokens;
