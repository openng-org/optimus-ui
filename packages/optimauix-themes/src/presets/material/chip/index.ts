import type { ChipDesignTokens, ChipTokenSections } from '@primeuix/themes/types/chip';

export const root: ChipTokenSections.Root = {
    borderRadius: '2rem',
    paddingX: '0.75rem',
    paddingY: '0.75rem',
    gap: '0.5rem',
    transitionDuration: '{transition.duration}'
};

export const image: ChipTokenSections.Image = {
    width: '2.25rem',
    height: '2.25rem'
};

export const icon: ChipTokenSections.Icon = {
    size: '1rem'
};

export const removeIcon: ChipTokenSections.RemoveIcon = {
    size: '1rem',
    focusRing: {
        width: '{focus.ring.width}',
        style: '{focus.ring.style}',
        color: '{focus.ring.color}',
        offset: '{focus.ring.offset}'
    }
};

export const colorScheme: ChipTokenSections.ColorScheme = {
    light: {
        root: {
            background: '{surface.200}',
            color: '{surface.900}'
        },
        icon: {
            color: '{surface.600}'
        },
        removeIcon: {
            color: '{surface.600}',
            focusRing: {
                shadow: '0 0 1px 4px {surface.300}'
            }
        }
    },
    dark: {
        root: {
            background: '{surface.700}',
            color: '{surface.0}'
        },
        icon: {
            color: '{surface.0}'
        },
        removeIcon: {
            color: '{surface.0}',
            focusRing: {
                shadow: '0 0 1px 4px {surface.600}'
            }
        }
    }
};

export const css: ChipTokenSections.CSS = /*css*/ ``;

export default {
    root,
    image,
    icon,
    removeIcon,
    colorScheme,
    css
} satisfies ChipDesignTokens;
