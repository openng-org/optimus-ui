import type { FloatLabelTokenSections } from '@primeuix/themes/types/floatlabel';

export * from '@primeuix/themes/types/floatlabel';

declare const root: FloatLabelTokenSections.Root;
declare const over: FloatLabelTokenSections.Over;
declare const inside: FloatLabelTokenSections.In;
declare const on: FloatLabelTokenSections.On;
declare const css: FloatLabelTokenSections.CSS;
declare const _default: {
    root: FloatLabelTokenSections.Root;
    over: FloatLabelTokenSections.Over;
    in: FloatLabelTokenSections.In;
    on: FloatLabelTokenSections.On;
    css: string;
};

export { css, _default as default, inside, on, over, root };
