import type { StyleOptions } from '@primeuix/styled';
import type { InputGroupTokenSections } from '@primeuix/themes/types/inputgroup';

export * from '@primeuix/themes/types/inputgroup';

declare const addon: InputGroupTokenSections.Addon;
declare const css: InputGroupTokenSections.CSS;
declare const _default: {
    addon: InputGroupTokenSections.Addon;
    css: (options: StyleOptions) => string;
};

export { addon, css, _default as default };
