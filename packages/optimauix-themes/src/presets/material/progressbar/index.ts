import type { ProgressBarDesignTokens, ProgressBarTokenSections } from '@primeuix/themes/types/progressbar';

export const root: ProgressBarTokenSections.Root = {
    background: '{content.border.color}',
    borderRadius: '{content.border.radius}',
    height: '1rem'
};

export const value: ProgressBarTokenSections.Value = {
    background: '{primary.color}'
};

export const label: ProgressBarTokenSections.Label = {
    color: '{primary.contrast.color}',
    fontSize: '0.75rem',
    fontWeight: '600'
};

export const css: ProgressBarTokenSections.CSS = /*css*/ ``;

export default {
    root,
    value,
    label,
    css
} satisfies ProgressBarDesignTokens;
