/**
 *
 * Terminal Design Tokens
 *
 * @module terminal
 *
 */

import type { ColorScheme as CS, DesignTokens, ExtendedCSS, ExtendedTokens } from '..';

/**
 * Design Token Sections
 */
export declare namespace TerminalTokenSections {
    interface Root {
        /**
         * Background of root
         *
         * @designToken terminal.background
         */
        background?: string;
        /**
         * Border color of root
         *
         * @designToken terminal.border.color
         */
        borderColor?: string;
        /**
         * Color of root
         *
         * @designToken terminal.color
         */
        color?: string;
        /**
         * Height of root
         *
         * @designToken terminal.height
         */
        height?: string;
        /**
         * Padding of root
         *
         * @designToken terminal.padding
         */
        padding?: string;
        /**
         * Border radius of root
         *
         * @designToken terminal.border.radius
         */
        borderRadius?: string;
    }

    interface Prompt {
        /**
         * Gap of prompt
         *
         * @designToken terminal.prompt.gap
         */
        gap?: string;
    }

    interface CommandResponse {
        /**
         * Margin of command response
         *
         * @designToken terminal.command.response.margin
         */
        margin?: string;
    }

    /* Static Sections */
    type ColorScheme = CS<TerminalDesignTokens>;
    type CSS = ExtendedCSS;
    type Extend = ExtendedTokens;
}

/**
 *
 * _Terminal Design Tokens_
 *
 * @group components
 * @module terminal
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
export interface TerminalDesignTokens extends DesignTokens<TerminalDesignTokens> {
    /**
     * Used to pass tokens of the root section
     */
    root?: TerminalTokenSections.Root;
    /**
     * Used to pass tokens of the prompt section
     */
    prompt?: TerminalTokenSections.Prompt;
    /**
     * Used to pass tokens of the command response section
     */
    commandResponse?: TerminalTokenSections.CommandResponse;
}
