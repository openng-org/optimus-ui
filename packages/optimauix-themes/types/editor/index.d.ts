/**
 *
 * Editor Design Tokens
 *
 * @module editor
 *
 */

import type { ColorScheme as CS, DesignTokens, ExtendedCSS, ExtendedTokens } from '..';

/**
 * Design Token Sections
 */
export declare namespace EditorTokenSections {
    interface Toolbar {
        /**
         * Background of toolbar
         *
         * @designToken editor.toolbar.background
         */
        background?: string;

        /**
         * Border color of toolbar
         *
         * @designToken editor.toolbar.border.color
         */
        borderColor?: string;

        /**
         * Border radius of toolbar
         *
         * @designToken editor.toolbar.border.radius
         */
        borderRadius?: string;
    }

    interface ToolbarItem {
        /**
         * Color of toolbar item
         *
         * @designToken editor.toolbar.item.color
         */
        color?: string;

        /**
         * Hover color of toolbar item
         *
         * @designToken editor.toolbar.item.hover.color
         */
        hoverColor?: string;

        /**
         * Active color of toolbar item
         *
         * @designToken editor.toolbar.item.active.color
         */
        activeColor?: string;

        /**
         * Padding of toolbar item
         *
         * @designToken editor.toolbar.item.padding
         */
        padding?: string;
    }

    interface Overlay {
        /**
         * Background of overlay
         *
         * @designToken editor.overlay.background
         */
        background?: string;
        /**
         * Border color of overlay
         *
         * @designToken editor.overlay.border.color
         */
        borderColor?: string;
        /**
         * Border radius of overlay
         *
         * @designToken editor.overlay.border.radius
         */
        borderRadius?: string;
        /**
         * Color of overlay
         *
         * @designToken editor.overlay.color
         */
        color?: string;
        /**
         * Shadow of overlay
         *
         * @designToken editor.overlay.shadow
         */
        shadow?: string;
        /**
         * Padding of overlay
         *
         * @designToken editor.overlay.padding
         */
        padding?: string;
    }

    interface OverlayOption {
        /**
         * Focus background of overlay option
         *
         * @designToken editor.overlay.option.focus.background
         */
        focusBackground?: string;
        /**
         * Color of overlay option
         *
         * @designToken editor.overlay.option.color
         */
        color?: string;
        /**
         * Focus color of overlay option
         *
         * @designToken editor.overlay.option.focus.color
         */
        focusColor?: string;
        /**
         * Padding of overlay option
         *
         * @designToken editor.overlay.option.padding
         */
        padding?: string;
        /**
         * Border radius of overlay option
         *
         * @designToken editor.overlay.option.border.radius
         */
        borderRadius?: string;
    }

    interface Content {
        /**
         * Background of content
         *
         * @designToken editor.content.background
         */
        background?: string;
        /**
         * Border color of content
         *
         * @designToken editor.content.border.color
         */
        borderColor?: string;
        /**
         * Color of content
         *
         * @designToken editor.content.color
         */
        color?: string;
        /**
         * Border radius of content
         *
         * @designToken editor.content.border.radius
         */
        borderRadius?: string;
    }

    /* Static Sections */
    type ColorScheme = CS<EditorDesignTokens>;
    type CSS = ExtendedCSS;
    type Extend = ExtendedTokens;
}

/**
 *
 * _Editor Design Tokens_
 *
 * @group components
 * @module editor
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
export interface EditorDesignTokens extends DesignTokens<EditorDesignTokens> {
    /**
     * Used to pass tokens of the toolbar section
     */
    toolbar?: EditorTokenSections.Toolbar;
    /**
     * Used to pass tokens of the toolbar item section
     */
    toolbarItem?: EditorTokenSections.ToolbarItem;
    /**
     * Used to pass tokens of the overlay section
     */
    overlay?: EditorTokenSections.Overlay;
    /**
     * Used to pass tokens of the overlay option section
     */
    overlayOption?: EditorTokenSections.OverlayOption;
    /**
     * Used to pass tokens of the content section
     */
    content?: EditorTokenSections.Content;
}
