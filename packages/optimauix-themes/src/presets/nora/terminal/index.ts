import type { TerminalDesignTokens, TerminalTokenSections } from '@primeuix/themes/types/terminal';

export const root: TerminalTokenSections.Root = {
    background: '{form.field.background}',
    borderColor: '{form.field.border.color}',
    color: '{form.field.color}',
    height: '18rem',
    padding: '{form.field.padding.y} {form.field.padding.x}',
    borderRadius: '{form.field.border.radius}'
};

export const prompt: TerminalTokenSections.Prompt = {
    gap: '0.25rem'
};

export const commandResponse: TerminalTokenSections.CommandResponse = {
    margin: '2px 0'
};

export default {
    root,
    prompt,
    commandResponse
} satisfies TerminalDesignTokens;
