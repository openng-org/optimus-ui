import type { AccordionDesignTokens, AccordionTokenSections } from '@primeuix/themes/types/accordion';

export const root: AccordionTokenSections.Root = {
    transitionDuration: '{transition.duration}'
};

export const panel: AccordionTokenSections.Panel = {
    borderWidth: '0',
    borderColor: '{content.border.color}'
};

export const header: AccordionTokenSections.Header = {
    color: '{text.color}',
    hoverColor: '{text.color}',
    activeColor: '{text.color}',
    activeHoverColor: '{text.color}',
    padding: '1.125rem',
    fontWeight: '700',
    borderRadius: '0',
    borderWidth: '0 1px 1px 1px',
    borderColor: '{content.border.color}',
    background: '{content.background}',
    hoverBackground: '{content.hover.background}',
    activeBackground: '{content.background}',
    activeHoverBackground: '{content.hover.background}',
    focusRing: {
        width: '{focus.ring.width}',
        style: '{focus.ring.style}',
        color: '{focus.ring.color}',
        offset: '-2px',
        shadow: '{focus.ring.shadow}'
    },
    toggleIcon: {
        color: '{text.color}',
        hoverColor: '{text.color}',
        activeColor: '{text.color}',
        activeHoverColor: '{text.color}'
    },
    first: {
        topBorderRadius: '{content.border.radius}',
        borderWidth: '1px'
    },
    last: {
        bottomBorderRadius: '{content.border.radius}',
        activeBottomBorderRadius: '0'
    }
};

export const content: AccordionTokenSections.Content = {
    borderWidth: '0 1px 1px 1px',
    borderColor: '{content.border.color}',
    background: '{content.background}',
    color: '{text.color}',
    padding: '1.125rem'
};

export default {
    root,
    panel,
    header,
    content
} satisfies AccordionDesignTokens;
