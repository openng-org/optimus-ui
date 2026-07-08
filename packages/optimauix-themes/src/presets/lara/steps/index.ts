import type { StepsDesignTokens, StepsTokenSections } from '@primeuix/themes/types/steps';

export const root: StepsTokenSections.Root = {
    transitionDuration: '{transition.duration}'
};

export const separator: StepsTokenSections.Separator = {
    background: '{content.border.color}'
};

export const itemLink: StepsTokenSections.ItemLink = {
    borderRadius: '{content.border.radius}',
    focusRing: {
        width: '{focus.ring.width}',
        style: '{focus.ring.style}',
        color: '{focus.ring.color}',
        offset: '{focus.ring.offset}',
        shadow: '{focus.ring.shadow}'
    },
    gap: '0.5rem'
};

export const itemLabel: StepsTokenSections.ItemLabel = {
    color: '{text.muted.color}',
    activeColor: '{primary.color}',
    fontWeight: '500'
};

export const itemNumber: StepsTokenSections.ItemNumber = {
    background: '{content.background}',
    activeBackground: '{primary.color}',
    borderColor: '{content.border.color}',
    activeBorderColor: '{primary.color}',
    color: '{text.muted.color}',
    activeColor: '{primary.contrast.color}',
    size: '2.25rem',
    fontSize: '1.125rem',
    fontWeight: '500',
    borderRadius: '50%',
    shadow: 'none'
};

export default {
    root,
    separator,
    itemLink,
    itemLabel,
    itemNumber
} satisfies StepsDesignTokens;
