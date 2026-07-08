/**
 *
 * Timeline Design Tokens
 *
 * @module timeline
 *
 */

import type { ColorScheme as CS, DesignTokens, ExtendedCSS, ExtendedTokens } from '..';

/**
 * Design Token Sections
 */
export declare namespace TimelineTokenSections {
    interface Event {
        /**
         * Min height of event
         *
         * @designToken timeline.event.min.height
         */
        minHeight?: string;
    }

    interface Horizontal {
        /**
         * Event content of horizontal
         */
        eventContent?: {
            /**
             * Event content padding of horizontal
             *
             * @designToken timeline.horizontal.event.content.padding
             */
            padding?: string;
        };
    }

    interface Vertical {
        /**
         * Event content of vertical
         */
        eventContent?: {
            /**
             * Event content padding of vertical
             *
             * @designToken timeline.vertical.event.content.padding
             */
            padding?: string;
        };
    }

    interface EventMarker {
        /**
         * Size of event marker
         *
         * @designToken timeline.event.marker.size
         */
        size?: string;
        /**
         * Border radius of event marker
         *
         * @designToken timeline.event.marker.border.radius
         */
        borderRadius?: string;
        /**
         * Border width of event marker
         *
         * @designToken timeline.event.marker.border.width
         */
        borderWidth?: string;
        /**
         * Background of event marker
         *
         * @designToken timeline.event.marker.background
         */
        background?: string;
        /**
         * Border color of event marker
         *
         * @designToken timeline.event.marker.border.color
         */
        borderColor?: string;
        /**
         * Content of event marker
         */
        content?: {
            /**
             * Content border radius of event marker
             *
             * @designToken timeline.event.marker.content.border.radius
             */
            borderRadius?: string;
            /**
             * Content size of event marker
             *
             * @designToken timeline.event.marker.content.size
             */
            size?: string;
            /**
             * Content background of event marker
             *
             * @designToken timeline.event.marker.content.background
             */
            background?: string;
            /**
             * Content inset shadow of event marker
             *
             * @designToken timeline.event.marker.content.inset.shadow
             */
            insetShadow?: string;
        };
    }

    interface EventConnector {
        /**
         * Color of event connector
         *
         * @designToken timeline.event.connector.color
         */
        color?: string;
        /**
         * Size of event connector
         *
         * @designToken timeline.event.connector.size
         */
        size?: string;
    }

    /* Static Sections */
    type ColorScheme = CS<TimelineDesignTokens>;
    type CSS = ExtendedCSS;
    type Extend = ExtendedTokens;
}

/**
 *
 * _Timeline Design Tokens_
 *
 * @group components
 * @module timeline
 * @see
 * --- ---
 * **Compatible Libraries**
 *
 * [![PrimeNG](https://i.postimg.cc/63f7jVST/primeng-icon-24.png)](https://primeng.org/theming/styled)
 * [![PrimeVue](https://i.postimg.cc/cC1vVgyh/primevue-icon-24.png)](https://primevue.org/theming/styled)
 * --- ---
 * **Figma UI Kit**
 *
 * [PrimeNG](https://primeng.org/uikit) | [PrimeVue](https://primevue.org/uikit)
 *
 */
export interface TimelineDesignTokens extends DesignTokens<TimelineDesignTokens> {
    /**
     * Used to pass tokens of the event section
     */
    event?: TimelineTokenSections.Event;
    /**
     * Used to pass tokens of the horizontal section
     */
    horizontal?: TimelineTokenSections.Horizontal;
    /**
     * Used to pass tokens of the vertical section
     */
    vertical?: TimelineTokenSections.Vertical;
    /**
     * Used to pass tokens of the event marker section
     */
    eventMarker?: TimelineTokenSections.EventMarker;
    /**
     * Used to pass tokens of the event connector section
     */
    eventConnector?: TimelineTokenSections.EventConnector;
}
