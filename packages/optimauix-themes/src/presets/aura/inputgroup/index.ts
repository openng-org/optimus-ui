import type { InputGroupDesignTokens, InputGroupTokenSections } from '@primeuix/themes/types/inputgroup';

export const addon: InputGroupTokenSections.Addon = {
    background: '{form.field.background}',
    borderColor: '{form.field.border.color}',
    color: '{form.field.icon.color}',
    borderRadius: '{form.field.border.radius}',
    padding: '0.5rem',
    minWidth: '2.5rem'
};

export default {
    addon
} satisfies InputGroupDesignTokens;
