import type { TreeDesignTokens, TreeTokenSections } from '@primeuix/themes/types/tree';

export const root: TreeTokenSections.Root = {
    background: '{content.background}',
    color: '{content.color}',
    padding: '1rem',
    gap: '2px',
    indent: '1rem',
    transitionDuration: '{transition.duration}'
};

export const node: TreeTokenSections.Node = {
    padding: '0.25rem 0.5rem',
    borderRadius: '{content.border.radius}',
    hoverBackground: '{content.hover.background}',
    selectedBackground: '{highlight.background}',
    color: '{text.color}',
    hoverColor: '{text.hover.color}',
    selectedColor: '{highlight.color}',
    focusRing: {
        width: '{focus.ring.width}',
        style: '{focus.ring.style}',
        color: '{focus.ring.color}',
        offset: '-1px',
        shadow: '{focus.ring.shadow}'
    },
    gap: '0.25rem'
};

export const nodeIcon: TreeTokenSections.NodeIcon = {
    color: '{text.muted.color}',
    hoverColor: '{text.hover.muted.color}',
    selectedColor: '{highlight.color}'
};

export const nodeToggleButton: TreeTokenSections.NodeToggleButton = {
    borderRadius: '50%',
    size: '1.75rem',
    hoverBackground: '{content.hover.background}',
    selectedHoverBackground: '{content.background}',
    color: '{text.muted.color}',
    hoverColor: '{text.hover.muted.color}',
    selectedHoverColor: '{primary.color}',
    focusRing: {
        width: '{focus.ring.width}',
        style: '{focus.ring.style}',
        color: '{focus.ring.color}',
        offset: '{focus.ring.offset}',
        shadow: '{focus.ring.shadow}'
    }
};

export const loadingIcon: TreeTokenSections.LoadingIcon = {
    size: '2rem'
};

export const filter: TreeTokenSections.Filter = {
    margin: '0 0 0.5rem 0'
};

export const css: TreeTokenSections.CSS = /*css*/ `
    .p-tree-mask.p-overlay-mask {
        --px-mask-background: light-dark(rgba(255,255,255,0.5),rgba(0,0,0,0.3));
    }
`;

export default {
    root,
    node,
    nodeIcon,
    nodeToggleButton,
    loadingIcon,
    filter,
    css
} satisfies TreeDesignTokens;
