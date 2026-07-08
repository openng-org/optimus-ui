import type { TimelineTokenSections } from '@primeuix/themes/types/timeline';

export * from '@primeuix/themes/types/timeline';

declare const event: TimelineTokenSections.Event;
declare const horizontal: TimelineTokenSections.Horizontal;
declare const vertical: TimelineTokenSections.Vertical;
declare const eventMarker: TimelineTokenSections.EventMarker;
declare const eventConnector: TimelineTokenSections.EventConnector;
declare const colorScheme: TimelineTokenSections.ColorScheme;
declare const css: TimelineTokenSections.CSS;
declare const _default: {
    event: TimelineTokenSections.Event;
    horizontal: TimelineTokenSections.Horizontal;
    vertical: TimelineTokenSections.Vertical;
    eventMarker: TimelineTokenSections.EventMarker;
    eventConnector: TimelineTokenSections.EventConnector;
    colorScheme: TimelineTokenSections.ColorScheme;
    css: string;
};

export { colorScheme, css, _default as default, event, eventConnector, eventMarker, horizontal, vertical };
