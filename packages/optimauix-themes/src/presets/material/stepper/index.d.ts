import type { StyleOptions } from '@primeuix/styled';
import type { StepperTokenSections } from '@primeuix/themes/types/stepper';

export * from '@primeuix/themes/types/stepper';

declare const root: StepperTokenSections.Root;
declare const separator: StepperTokenSections.Separator;
declare const step: StepperTokenSections.Step;
declare const stepHeader: StepperTokenSections.StepHeader;
declare const stepTitle: StepperTokenSections.StepTitle;
declare const stepNumber: StepperTokenSections.StepNumber;
declare const steppanels: StepperTokenSections.Steppanels;
declare const steppanel: StepperTokenSections.Steppanel;
declare const colorScheme: StepperTokenSections.ColorScheme;
declare const css: StepperTokenSections.CSS;
declare const _default: {
    root: StepperTokenSections.Root;
    separator: StepperTokenSections.Separator;
    step: StepperTokenSections.Step;
    stepHeader: StepperTokenSections.StepHeader;
    stepTitle: StepperTokenSections.StepTitle;
    stepNumber: StepperTokenSections.StepNumber;
    steppanels: StepperTokenSections.Steppanels;
    steppanel: StepperTokenSections.Steppanel;
    colorScheme: StepperTokenSections.ColorScheme;
    css: (options: StyleOptions) => string;
};

export { colorScheme, css, _default as default, root, separator, step, stepHeader, stepNumber, steppanel, steppanels, stepTitle };
