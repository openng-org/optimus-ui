import type { SkeletonDesignTokens, SkeletonTokenSections } from '@primeuix/themes/types/skeleton';

export const root: SkeletonTokenSections.Root = {
    borderRadius: '{content.border.radius}'
};

export const colorScheme: SkeletonTokenSections.ColorScheme = {
    light: {
        root: {
            background: '{surface.200}',
            animationBackground: 'rgba(255,255,255,0.4)'
        }
    },
    dark: {
        root: {
            background: 'rgba(255, 255, 255, 0.06)',
            animationBackground: 'rgba(255, 255, 255, 0.04)'
        }
    }
};

export default {
    root,
    colorScheme
} satisfies SkeletonDesignTokens;
