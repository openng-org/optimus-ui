import type { RatingDesignTokens, RatingTokenSections } from '@primeuix/themes/types/rating';

export const root: RatingTokenSections.Root = {
    gap: '0.25rem',
    transitionDuration: '{transition.duration}',
    focusRing: {
        width: '{focus.ring.width}',
        style: '{focus.ring.style}',
        color: '{focus.ring.color}',
        offset: '{focus.ring.offset}',
        shadow: '{focus.ring.shadow}'
    }
};

export const icon: RatingTokenSections.Icon = {
    size: '1rem',
    color: '{text.muted.color}',
    hoverColor: '{primary.color}',
    activeColor: '{primary.color}'
};

export default {
    root,
    icon
} satisfies RatingDesignTokens;
