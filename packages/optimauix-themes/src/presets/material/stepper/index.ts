import type { StepperDesignTokens, StepperTokenSections } from '@primeuix/themes/types/stepper';

export const root: StepperTokenSections.Root = {
    transitionDuration: '{transition.duration}'
};

export const separator: StepperTokenSections.Separator = {
    background: '{content.border.color}',
    activeBackground: '{primary.color}',
    margin: '0 0 0 1.625rem',
    size: '2px'
};

export const step: StepperTokenSections.Step = {
    padding: '0.5rem',
    gap: '1rem'
};

export const stepHeader: StepperTokenSections.StepHeader = {
    padding: '0.75rem 1rem',
    borderRadius: '{content.border.radius}',
    focusRing: {
        width: '0',
        style: 'none',
        color: 'unset',
        offset: '0',
        shadow: 'none'
    },
    gap: '0.5rem'
};

export const stepTitle: StepperTokenSections.StepTitle = {
    color: '{text.muted.color}',
    activeColor: '{text.color}',
    fontWeight: '500'
};

export const stepNumber: StepperTokenSections.StepNumber = {
    activeBackground: '{primary.color}',
    activeBorderColor: '{primary.color}',
    activeColor: '{primary.contrast.color}',
    size: '2rem',
    fontSize: '1.143rem',
    fontWeight: '500',
    borderRadius: '50%',
    shadow: 'none'
};

export const steppanels: StepperTokenSections.Steppanels = {
    padding: '0.875rem 0.5rem 1.125rem 0.5rem'
};

export const steppanel: StepperTokenSections.Steppanel = {
    background: '{content.background}',
    color: '{content.color}',
    padding: '0',
    indent: '1rem'
};

export const colorScheme: StepperTokenSections.ColorScheme = {
    light: {
        stepNumber: {
            background: '{surface.400}',
            borderColor: '{surface.400}',
            color: '{surface.0}'
        }
    },
    dark: {
        stepNumber: {
            background: '{surface.200}',
            borderColor: '{surface.200}',
            color: '{surface.900}'
        }
    }
};

export const css: StepperTokenSections.CSS = /*css*/ `
.p-step-header:focus-visible {
    background: dt('navigation.item.active.background');
}
`;

export default {
    root,
    separator,
    step,
    stepHeader,
    stepTitle,
    stepNumber,
    steppanels,
    steppanel,
    colorScheme,
    css
} satisfies StepperDesignTokens;
