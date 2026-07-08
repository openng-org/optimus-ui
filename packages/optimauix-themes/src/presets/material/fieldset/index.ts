import type { FieldsetDesignTokens, FieldsetTokenSections } from '@primeuix/themes/types/fieldset';

export const root: FieldsetTokenSections.Root = {
    background: '{content.background}',
    borderColor: '{content.border.color}',
    borderRadius: '{content.border.radius}',
    color: '{content.color}',
    padding: '0 1.25rem 1.25rem 1.25rem',
    transitionDuration: '{transition.duration}'
};

export const legend: FieldsetTokenSections.Legend = {
    background: '{content.background}',
    hoverBackground: '{content.hover.background}',
    color: '{content.color}',
    hoverColor: '{content.hover.color}',
    borderRadius: '{content.border.radius}',
    borderWidth: '1px',
    borderColor: 'transparent',
    padding: '0.75rem 1rem',
    gap: '0.5rem',
    fontWeight: '600',
    focusRing: {
        width: '0',
        style: 'none',
        color: 'unset',
        offset: '0',
        shadow: 'none'
    }
};

export const toggleIcon: FieldsetTokenSections.ToggleIcon = {
    color: '{text.muted.color}',
    hoverColor: '{text.hover.muted.color}'
};

export const content: FieldsetTokenSections.Content = {
    padding: '0'
};

export const css: FieldsetTokenSections.CSS = /*css*/ `
.p-fieldset-toggle-button:focus-visible {
    background: dt('navigation.item.active.background');
}
`;

export default {
    root,
    legend,
    toggleIcon,
    content,
    css
} satisfies FieldsetDesignTokens;
