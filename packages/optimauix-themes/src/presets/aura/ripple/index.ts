import type { RippleDesignTokens, RippleTokenSections } from '@primeuix/themes/types/ripple';

export const colorScheme: RippleTokenSections.ColorScheme = {
    light: {
        root: {
            background: 'rgba(0,0,0,0.1)'
        }
    },
    dark: {
        root: {
            background: 'rgba(255,255,255,0.3)'
        }
    }
};

export default {
    colorScheme
} satisfies RippleDesignTokens;
