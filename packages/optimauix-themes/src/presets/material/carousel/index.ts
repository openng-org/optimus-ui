import type { CarouselDesignTokens, CarouselTokenSections } from '@primeuix/themes/types/carousel';

export const root: CarouselTokenSections.Root = {
    transitionDuration: '{transition.duration}'
};

export const content: CarouselTokenSections.Content = {
    gap: '0.25rem'
};

export const indicatorList: CarouselTokenSections.IndicatorList = {
    padding: '1rem',
    gap: '1rem'
};

export const indicator: CarouselTokenSections.Indicator = {
    width: '1.25rem',
    height: '1.25rem',
    borderRadius: '50%',
    focusRing: {
        width: '0',
        style: 'none',
        color: 'unset',
        offset: '0',
        shadow: 'none'
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

export const css: CarouselTokenSections.CSS = /*css*/ `
.p-carousel-indicator-button:hover {
    box-shadow: 0 0 1px 10px color-mix(in srgb, dt('text.color'), transparent 96%);
}

.p-carousel-indicator-button:focus-visible {
    box-shadow: 0 0 1px 10px color-mix(in srgb, dt('text.color'), transparent 96%);
}

.p-carousel-indicator-active .p-carousel-indicator-button:hover {
    box-shadow: 0 0 1px 10px color-mix(in srgb, dt('carousel.indicator.active.background'), transparent 92%);
}

.p-carousel-indicator-active .p-carousel-indicator-button:focus-visible {
    box-shadow: 0 0 1px 10px color-mix(in srgb, dt('carousel.indicator.active.background'), transparent 84%);
}
`;

export default {
    root,
    content,
    indicatorList,
    indicator,
    colorScheme,
    css
} satisfies CarouselDesignTokens;
