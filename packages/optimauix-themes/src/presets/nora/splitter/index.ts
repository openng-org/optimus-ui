import type { SplitterDesignTokens, SplitterTokenSections } from '@primeuix/themes/types/splitter';

export const root: SplitterTokenSections.Root = {
    background: '{content.background}',
    borderColor: '{content.border.color}',
    color: '{content.color}',
    transitionDuration: '{transition.duration}'
};

export const gutter: SplitterTokenSections.Gutter = {
    background: '{content.border.color}'
};

export const handle: SplitterTokenSections.Handle = {
    size: '24px',
    background: 'transparent',
    borderRadius: '{content.border.radius}',
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
    gutter,
    handle
} satisfies SplitterDesignTokens;
