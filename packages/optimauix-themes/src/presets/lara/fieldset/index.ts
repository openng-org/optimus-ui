import type { FieldsetDesignTokens, FieldsetTokenSections } from '@primeuix/themes/types/fieldset';

export const root: FieldsetTokenSections.Root = {
    background: '{content.background}',
    borderColor: '{content.border.color}',
    borderRadius: '{content.border.radius}',
    color: '{content.color}',
    padding: '0.75rem 1.125rem 1.125rem 1.125rem',
    transitionDuration: '{transition.duration}'
};

export const legend: FieldsetTokenSections.Legend = {
    borderRadius: '{content.border.radius}',
    borderWidth: '1px',
    borderColor: '{content.border.color}',
    padding: '0.625rem 0.875rem',
    gap: '0.5rem',
    fontWeight: '700',
    focusRing: {
        width: '{focus.ring.width}',
        style: '{focus.ring.style}',
        color: '{focus.ring.color}',
        offset: '{focus.ring.offset}',
        shadow: '{focus.ring.shadow}'
    }
};

export const toggleIcon: FieldsetTokenSections.ToggleIcon = {
    color: '{text.muted.color}',
    hoverColor: '{text.hover.muted.color}'
};

export const content: FieldsetTokenSections.Content = {
    padding: '0'
};

export const colorScheme: FieldsetTokenSections.ColorScheme = {
    light: {
        legend: {
            background: '{surface.50}',
            hoverBackground: '{surface.100}',
            color: '{text.color}',
            hoverColor: '{text.hover.color}'
        }
    },
    dark: {
        legend: {
            background: '{surface.800}',
            hoverBackground: '{surface.700}',
            color: '{text.color}',
            hoverColor: '{text.hover.color}'
        }
    }
};

export default {
    root,
    legend,
    toggleIcon,
    content,
    colorScheme
} satisfies FieldsetDesignTokens;
