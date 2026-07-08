/**
 *
 * ConfirmDialog Design Tokens
 *
 * @module confirmdialog
 *
 */

import type { ColorScheme as CS, DesignTokens, ExtendedCSS, ExtendedTokens } from '..';

/**
 * Design Token Sections
 */
export declare namespace ConfirmDialogTokenSections {
    interface Icon {
        /**
         * Size of icon
         *
         * @designToken confirmdialog.icon.size
         */
        size?: string;
        /**
         * Color of icon
         *
         * @designToken confirmdialog.icon.color
         */
        color?: string;
    }

    interface Content {
        /**
         * Gap of content
         *
         * @designToken confirmdialog.content.gap
         */
        gap?: string;
    }

    /* Static Sections */
    type ColorScheme = CS<ConfirmDialogDesignTokens>;
    type CSS = ExtendedCSS;
    type Extend = ExtendedTokens;
}

/**
 *
 * _ConfirmDialog Design Tokens_
 *
 * @group components
 * @module confirmdialog
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
export interface ConfirmDialogDesignTokens extends DesignTokens<ConfirmDialogDesignTokens> {
    /**
     * Used to pass tokens of the icon section
     */
    icon?: ConfirmDialogTokenSections.Icon;
    /**
     * Used to pass tokens of the content section
     */
    content?: ConfirmDialogTokenSections.Content;
}
