import type { GalleriaDesignTokens, GalleriaTokenSections } from '@primeuix/themes/types/galleria';

export const root: GalleriaTokenSections.Root = {
    borderWidth: '1px',
    borderColor: '{content.border.color}',
    borderRadius: '{content.border.radius}',
    transitionDuration: '{transition.duration}'
};

export const navButton: GalleriaTokenSections.NavButton = {
    background: 'rgba(255, 255, 255, 0.1)',
    hoverBackground: 'rgba(255, 255, 255, 0.2)',
    color: '{surface.100}',
    hoverColor: '{surface.0}',
    size: '3rem',
    gutter: '0.5rem',
    prev: {
        borderRadius: '50%'
    },
    next: {
        borderRadius: '50%'
    },
    focusRing: {
        width: '{focus.ring.width}',
        style: '{focus.ring.style}',
        color: '{focus.ring.color}',
        offset: '{focus.ring.offset}',
        shadow: '{focus.ring.shadow}'
    }
};

export const navIcon: GalleriaTokenSections.NavIcon = {
    size: '1.5rem'
};

export const thumbnailsContent: GalleriaTokenSections.ThumbnailsContent = {
    background: '{content.background}',
    padding: '1rem 0.25rem'
};

export const thumbnailNavButton: GalleriaTokenSections.ThumbnailNavButton = {
    size: '2rem',
    borderRadius: '{content.border.radius}',
    gutter: '0.5rem',
    focusRing: {
        width: '{focus.ring.width}',
        style: '{focus.ring.style}',
        color: '{focus.ring.color}',
        offset: '{focus.ring.offset}',
        shadow: '{focus.ring.shadow}'
    }
};

export const thumbnailNavButtonIcon: GalleriaTokenSections.ThumbnailNavButtonIcon = {
    size: '1rem'
};

export const caption: GalleriaTokenSections.Caption = {
    background: 'rgba(0, 0, 0, 0.5)',
    color: '{surface.100}',
    padding: '1rem'
};

export const indicatorList: GalleriaTokenSections.IndicatorList = {
    gap: '0.5rem',
    padding: '1rem'
};

export const indicatorButton: GalleriaTokenSections.IndicatorButton = {
    width: '1rem',
    height: '1rem',
    activeBackground: '{primary.color}',
    borderRadius: '50%',
    focusRing: {
        width: '{focus.ring.width}',
        style: '{focus.ring.style}',
        color: '{focus.ring.color}',
        offset: '{focus.ring.offset}',
        shadow: '{focus.ring.shadow}'
    }
};

export const insetIndicatorList: GalleriaTokenSections.InsetIndicatorList = {
    background: 'rgba(0, 0, 0, 0.5)'
};

export const insetIndicatorButton: GalleriaTokenSections.InsetIndicatorButton = {
    background: 'rgba(255, 255, 255, 0.4)',
    hoverBackground: 'rgba(255, 255, 255, 0.6)',
    activeBackground: 'rgba(255, 255, 255, 0.9)'
};

export const closeButton: GalleriaTokenSections.CloseButton = {
    size: '3rem',
    gutter: '0.5rem',
    background: 'rgba(255, 255, 255, 0.1)',
    hoverBackground: 'rgba(255, 255, 255, 0.2)',
    color: '{surface.50}',
    hoverColor: '{surface.0}',
    borderRadius: '50%',
    focusRing: {
        width: '{focus.ring.width}',
        style: '{focus.ring.style}',
        color: '{focus.ring.color}',
        offset: '{focus.ring.offset}',
        shadow: '{focus.ring.shadow}'
    }
};

export const closeButtonIcon: GalleriaTokenSections.CloseButtonIcon = {
    size: '1.5rem'
};

export const colorScheme: GalleriaTokenSections.ColorScheme = {
    light: {
        thumbnailNavButton: {
            hoverBackground: '{surface.100}',
            color: '{surface.600}',
            hoverColor: '{surface.700}'
        },
        indicatorButton: {
            background: '{surface.200}',
            hoverBackground: '{surface.300}'
        }
    },
    dark: {
        thumbnailNavButton: {
            hoverBackground: '{surface.700}',
            color: '{surface.400}',
            hoverColor: '{surface.0}'
        },
        indicatorButton: {
            background: '{surface.700}',
            hoverBackground: '{surface.600}'
        }
    }
};

export default {
    root,
    navButton,
    navIcon,
    thumbnailsContent,
    thumbnailNavButton,
    thumbnailNavButtonIcon,
    caption,
    indicatorList,
    indicatorButton,
    insetIndicatorList,
    insetIndicatorButton,
    closeButton,
    closeButtonIcon,
    colorScheme
} satisfies GalleriaDesignTokens;
