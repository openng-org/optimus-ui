import type { ChipDesignTokens, ChipTokenSections } from '@primeuix/themes/types/chip';

export const root: ChipTokenSections.Root = {
    borderRadius: '16px',
    paddingX: '0.75rem',
    paddingY: '0.5rem',
    gap: '0.5rem',
    transitionDuration: '{transition.duration}'
};

export const image: ChipTokenSections.Image = {
    width: '2rem',
    height: '2rem'
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
        offset: '{focus.ring.offset}',
        shadow: '{form.field.focus.ring.shadow}'
    }
};

export const colorScheme: ChipTokenSections.ColorScheme = {
    light: {
        root: {
            background: '{surface.200}',
            color: '{surface.900}'
        },
        icon: {
            color: '{surface.900}'
        },
        removeIcon: {
            color: '{surface.900}'
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
            color: '{surface.0}'
        }
    }
};

export default {
    root,
    image,
    icon,
    removeIcon,
    colorScheme
} satisfies ChipDesignTokens;
