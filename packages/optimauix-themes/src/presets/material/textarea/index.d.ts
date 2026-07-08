import type { StyleOptions } from '@primeuix/styled';
import type { TextareaTokenSections } from '@primeuix/themes/types/textarea';

export * from '@primeuix/themes/types/textarea';

declare const root: TextareaTokenSections.Root;
declare const css: TextareaTokenSections.CSS;
declare const _default: {
    root: TextareaTokenSections.Root;
    css: (options: StyleOptions) => string;
};

export { css, _default as default, root };
