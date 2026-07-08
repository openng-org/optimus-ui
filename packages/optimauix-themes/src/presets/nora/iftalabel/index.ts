import type { IftaLabelDesignTokens, IftaLabelTokenSections } from '@primeuix/themes/types/iftalabel';

export const root: IftaLabelTokenSections.Root = {
    color: '{form.field.float.label.color}',
    focusColor: '{form.field.float.label.focus.color}',
    invalidColor: '{form.field.float.label.invalid.color}',
    transitionDuration: '0.2s',
    positionX: '{form.field.padding.x}',
    top: '{form.field.padding.y}',
    fontSize: '0.75rem',
    fontWeight: '400'
};

export const input: IftaLabelTokenSections.Input = {
    paddingTop: '1.5rem',
    paddingBottom: '{form.field.padding.y}'
};

export default {
    root,
    input
} satisfies IftaLabelDesignTokens;
