import type { CarouselDesignTokens, CarouselTokenSections } from '@primeuix/themes/types/carousel';

export const root: CarouselTokenSections.Root = {
    transitionDuration: '{transition.duration}'
};

export const content: CarouselTokenSections.Content = {
    gap: '0.25rem'
};

export const indicatorList: CarouselTokenSections.IndicatorList = {
    padding: '1rem',
    gap: '0.5rem'
};

export const indicator: CarouselTokenSections.Indicator = {
    width: '2rem',
    height: '0.5rem',
    borderRadius: '{content.border.radius}',
    focusRing: {
        width: '{focus.ring.width}',
        style: '{focus.ring.style}',
        color: '{focus.ring.color}',
        offset: '{focus.ring.offset}',
        shadow: '{focus.ring.shadow}'
    }
};

export const colorScheme: CarouselTokenSections.ColorScheme = {
    light: {
        indicator: {
            background: '{surface.200}',
            hoverBackground: '{surface.300}',
            activeBackground: '{primary.color}'
        }
    },
    dark: {
        indicator: {
            background: '{surface.700}',
            hoverBackground: '{surface.600}',
            activeBackground: '{primary.color}'
        }
    }
};

export default {
    root,
    content,
    indicatorList,
    indicator,
    colorScheme
} satisfies CarouselDesignTokens;
