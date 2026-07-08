import type { ProgressBarTokenSections } from '@primeuix/themes/types/progressbar';

export * from '@primeuix/themes/types/progressbar';

declare const root: ProgressBarTokenSections.Root;
declare const value: ProgressBarTokenSections.Value;
declare const label: ProgressBarTokenSections.Label;
declare const css: ProgressBarTokenSections.CSS;
declare const _default: {
    root: ProgressBarTokenSections.Root;
    value: ProgressBarTokenSections.Value;
    label: ProgressBarTokenSections.Label;
    css: string;
};

export { css, _default as default, label, root, value };
