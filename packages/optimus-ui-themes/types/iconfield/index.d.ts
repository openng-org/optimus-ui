/**
 *
 * IconField Design Tokens
 *
 * @module iconfield
 *
 */

import type { ColorScheme as CS, DesignTokens, ExtendedCSS, ExtendedTokens } from '..';

/**
 * Design Token Sections
 */
export declare namespace IconFieldTokenSections {
    interface Icon {
        /**
         * Color of icon
         *
         * @designToken iconfield.icon.color
         */
        color?: string;
    }

    /* Static Sections */
    type ColorScheme = CS<IconFieldDesignTokens>;
    type CSS = ExtendedCSS;
    type Extend = ExtendedTokens;
}

/**
 *
 * _IconField Design Tokens_
 *
 * @group components
 * @module iconfield
 * @see
 * --- ---
 * **Compatible Libraries**
 *
 * [Optimus UI](https://optimus.openng.org/theming/styled)
 *
 */
export interface IconFieldDesignTokens extends DesignTokens<IconFieldDesignTokens> {
    /**
     * Used to pass tokens of the icon section
     */
    icon?: IconFieldTokenSections.Icon;
}
