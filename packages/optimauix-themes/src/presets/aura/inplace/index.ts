import type { InplaceDesignTokens, InplaceTokenSections } from '@primeuix/themes/types/inplace';

export const root: InplaceTokenSections.Root = {
    padding: '{form.field.padding.y} {form.field.padding.x}',
    borderRadius: '{content.border.radius}',
    focusRing: {
        width: '{focus.ring.width}',
        style: '{focus.ring.style}',
        color: '{focus.ring.color}',
        offset: '{focus.ring.offset}',
        shadow: '{focus.ring.shadow}'
    },
    transitionDuration: '{transition.duration}'
};

export const display: InplaceTokenSections.Display = {
    hoverBackground: '{content.hover.background}',
    hoverColor: '{content.hover.color}'
};

export default {
    root,
    display
} satisfies InplaceDesignTokens;
