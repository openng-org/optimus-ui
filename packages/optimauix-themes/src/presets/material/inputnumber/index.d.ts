import type { StyleOptions } from '@primeuix/styled';
import type { InputNumberTokenSections } from '@primeuix/themes/types/inputnumber';

export * from '@primeuix/themes/types/inputnumber';

declare const root: InputNumberTokenSections.Root;
declare const button: InputNumberTokenSections.Button;
declare const colorScheme: InputNumberTokenSections.ColorScheme;
declare const css: InputNumberTokenSections.CSS;
declare const _default: {
    root: InputNumberTokenSections.Root;
    button: InputNumberTokenSections.Button;
    colorScheme: InputNumberTokenSections.ColorScheme;
    css: (options: StyleOptions) => string;
};

export { button, colorScheme, css, _default as default, root };
