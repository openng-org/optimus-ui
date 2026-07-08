/**
 *
 * MeterGroup Design Tokens
 *
 * @module metergroup
 *
 */

import type { ColorScheme as CS, DesignTokens, ExtendedCSS, ExtendedTokens } from '..';

/**
 * Design Token Sections
 */
export declare namespace MeterGroupTokenSections {
    interface Root {
        /**
         * Border radius of root
         *
         * @designToken metergroup.border.radius
         */
        borderRadius?: string;
        /**
         * Gap of root
         *
         * @designToken metergroup.gap
         */
        gap?: string;
    }

    interface Meters {
        /**
         * Background of meters
         *
         * @designToken metergroup.meters.background
         */
        background?: string;
        /**
         * Size of meters
         *
         * @designToken metergroup.meters.size
         */
        size?: string;
    }

    interface Label {
        /**
         * Gap of label
         *
         * @designToken metergroup.label.gap
         */
        gap?: string;
    }

    interface LabelMarker {
        /**
         * Size of label marker
         *
         * @designToken metergroup.label.marker.size
         */
        size?: string;
    }

    interface LabelIcon {
        /**
         * Size of label icon
         *
         * @designToken metergroup.label.icon.size
         */
        size?: string;
    }

    interface LabelList {
        /**
         * Vertical gap of label list
         *
         * @designToken metergroup.label.list.vertical.gap
         */
        verticalGap?: string;
        /**
         * Horizontal gap of label list
         *
         * @designToken metergroup.label.list.horizontal.gap
         */
        horizontalGap?: string;
    }

    /* Static Sections */
    type ColorScheme = CS<MeterGroupDesignTokens>;
    type CSS = ExtendedCSS;
    type Extend = ExtendedTokens;
}

/**
 *
 * _MeterGroup Design Tokens_
 *
 * @group components
 * @module metergroup
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
export interface MeterGroupDesignTokens extends DesignTokens<MeterGroupDesignTokens> {
    /**
     * Used to pass tokens of the root section
     */
    root?: MeterGroupTokenSections.Root;
    /**
     * Used to pass tokens of the meters section
     */
    meters?: MeterGroupTokenSections.Meters;
    /**
     * Used to pass tokens of the label section
     */
    label?: MeterGroupTokenSections.Label;
    /**
     * Used to pass tokens of the label marker section
     */
    labelMarker?: MeterGroupTokenSections.LabelMarker;
    /**
     * Used to pass tokens of the label icon section
     */
    labelIcon?: MeterGroupTokenSections.LabelIcon;
    /**
     * Used to pass tokens of the label list section
     */
    labelList?: MeterGroupTokenSections.LabelList;
}
