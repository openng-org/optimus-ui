import type { FloatLabelDesignTokens, FloatLabelTokenSections } from '@primeuix/themes/types/floatlabel';

export const root: FloatLabelTokenSections.Root = {
    color: '{form.field.float.label.color}',
    focusColor: '{form.field.float.label.focus.color}',
    activeColor: '{form.field.float.label.active.color}',
    invalidColor: '{form.field.float.label.invalid.color}',
    transitionDuration: '0.2s',
    positionX: '{form.field.padding.x}',
    positionY: '{form.field.padding.y}',
    fontWeight: '500',
    active: {
        fontSize: '0.75rem',
        fontWeight: '400'
    }
};

export const over: FloatLabelTokenSections.Over = {
    active: {
        top: '-1.25rem'
    }
};

export const inside: FloatLabelTokenSections.In = {
    input: {
        paddingTop: '1.5rem',
        paddingBottom: '{form.field.padding.y}'
    },
    active: {
        top: '{form.field.padding.y}'
    }
};

export const on: FloatLabelTokenSections.On = {
    borderRadius: '{border.radius.xs}',
    active: {
        background: '{form.field.background}',
        padding: '0 0.125rem'
    }
};

export default {
    root,
    over,
    in: inside,
    on
} satisfies FloatLabelDesignTokens;
