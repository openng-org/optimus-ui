/**
 *
 * Paginator Design Tokens
 *
 * @module paginator
 *
 */

import type { ColorScheme as CS, DesignTokens, ExtendedCSS, ExtendedTokens } from '..';

/**
 * Design Token Sections
 */
export declare namespace PaginatorTokenSections {
    interface Root {
        /**
         * Padding of root
         *
         * @designToken paginator.padding
         */
        padding?: string;
        /**
         * Gap of root
         *
         * @designToken paginator.gap
         */
        gap?: string;
        /**
         * Border radius of root
         *
         * @designToken paginator.border.radius
         */
        borderRadius?: string;
        /**
         * Background of root
         *
         * @designToken paginator.background
         */
        background?: string;
        /**
         * Color of root
         *
         * @designToken paginator.color
         */
        color?: string;
        /**
         * Transition duration of root
         *
         * @designToken paginator.transition.duration
         */
        transitionDuration?: string;
    }

    interface NavButton {
        /**
         * Background of nav button
         *
         * @designToken paginator.nav.button.background
         */
        background?: string;
        /**
         * Hover background of nav button
         *
         * @designToken paginator.nav.button.hover.background
         */
        hoverBackground?: string;
        /**
         * Selected background of nav button
         *
         * @designToken paginator.nav.button.selected.background
         */
        selectedBackground?: string;
        /**
         * Color of nav button
         *
         * @designToken paginator.nav.button.color
         */
        color?: string;
        /**
         * Hover color of nav button
         *
         * @designToken paginator.nav.button.hover.color
         */
        hoverColor?: string;
        /**
         * Selected color of nav button
         *
         * @designToken paginator.nav.button.selected.color
         */
        selectedColor?: string;
        /**
         * Width of nav button
         *
         * @designToken paginator.nav.button.width
         */
        width?: string;
        /**
         * Height of nav button
         *
         * @designToken paginator.nav.button.height
         */
        height?: string;
        /**
         * Border radius of nav button
         *
         * @designToken paginator.nav.button.border.radius
         */
        borderRadius?: string;
        /**
         * Focus ring of nav button
         */
        focusRing?: {
            /**
             * Focus ring width of nav button
             *
             * @designToken paginator.nav.button.focus.ring.width
             */
            width?: string;
            /**
             * Focus ring style of nav button
             *
             * @designToken paginator.nav.button.focus.ring.style
             */
            style?: string;
            /**
             * Focus ring color of nav button
             *
             * @designToken paginator.nav.button.focus.ring.color
             */
            color?: string;
            /**
             * Focus ring offset of nav button
             *
             * @designToken paginator.nav.button.focus.ring.offset
             */
            offset?: string;
            /**
             * Focus ring shadow of nav button
             *
             * @designToken paginator.nav.button.focus.ring.shadow
             */
            shadow?: string;
        };
    }

    interface CurrentPageReport {
        /**
         * Color of current page report
         *
         * @designToken paginator.current.page.report.color
         */
        color?: string;
    }

    interface JumpToPageInput {
        /**
         * Max width of jump to page input
         *
         * @designToken paginator.jump.to.page.input.max.width
         */
        maxWidth?: string;
    }

    /* Static Sections */
    type ColorScheme = CS<PaginatorDesignTokens>;
    type CSS = ExtendedCSS;
    type Extend = ExtendedTokens;
}

/**
 *
 * _Paginator Design Tokens_
 *
 * @group components
 * @module paginator
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
export interface PaginatorDesignTokens extends DesignTokens<PaginatorDesignTokens> {
    /**
     * Used to pass tokens of the root section
     */
    root?: PaginatorTokenSections.Root;
    /**
     * Used to pass tokens of the nav button section
     */
    navButton?: PaginatorTokenSections.NavButton;
    /**
     * Used to pass tokens of the current page report section
     */
    currentPageReport?: PaginatorTokenSections.CurrentPageReport;
    /**
     * Used to pass tokens of the jump to page input section
     */
    jumpToPageInput?: PaginatorTokenSections.JumpToPageInput;
}
