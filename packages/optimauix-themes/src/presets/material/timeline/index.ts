import type { TimelineDesignTokens, TimelineTokenSections } from '@primeuix/themes/types/timeline';

export const event: TimelineTokenSections.Event = {
    minHeight: '5rem'
};

export const horizontal: TimelineTokenSections.Horizontal = {
    eventContent: {
        padding: '1rem 0'
    }
};

export const vertical: TimelineTokenSections.Vertical = {
    eventContent: {
        padding: '0 1rem'
    }
};

export const eventMarker: TimelineTokenSections.EventMarker = {
    size: '1.5rem',
    borderRadius: '50%',
    borderWidth: '2px',
    background: '{primary.color}',
    content: {
        borderRadius: '50%',
        size: '0',
        background: '{primary.color}',
        insetShadow: 'none'
    }
};

export const eventConnector: TimelineTokenSections.EventConnector = {
    color: '{content.border.color}',
    size: '2px'
};

export const colorScheme: TimelineTokenSections.ColorScheme = {
    light: {
        eventMarker: {
            borderColor: '{surface.0}'
        }
    },
    dark: {
        eventMarker: {
            borderColor: '{surface.900}'
        }
    }
};

export const css: TimelineTokenSections.CSS = /*css*/ ``;

export default {
    event,
    horizontal,
    vertical,
    eventMarker,
    eventConnector,
    colorScheme,
    css
} satisfies TimelineDesignTokens;
