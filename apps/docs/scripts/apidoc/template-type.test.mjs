import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { templateContextType, templateRefType } from './template-type.mjs';

describe('templateRefType', () => {
    it('leaves a decorator query type alone', () => {
        assert.equal(templateRefType('TemplateRef<ButtonIconTemplateContext>'), 'TemplateRef<ButtonIconTemplateContext>');
        assert.equal(templateRefType('TemplateRef<void>'), 'TemplateRef<void>');
    });

    it('unwraps a signal query, with or without the optional branch', () => {
        assert.equal(templateRefType('Signal<TemplateRef<ButtonIconTemplateContext>>'), 'TemplateRef<ButtonIconTemplateContext>');
        assert.equal(templateRefType('Signal<TemplateRef<ButtonIconTemplateContext> | undefined>'), 'TemplateRef<ButtonIconTemplateContext>');
        assert.equal(templateRefType('Signal<TemplateRef<void> | undefined>'), 'TemplateRef<void>');
    });

    it('unwraps the Nullable alias, including when nested in a signal query', () => {
        assert.equal(templateRefType('Nullable<TemplateRef<void>>'), 'TemplateRef<void>');
        assert.equal(templateRefType('Signal<Nullable<TemplateRef<void>>>'), 'TemplateRef<void>');
    });

    it('keeps unions inside the template context intact', () => {
        assert.equal(templateRefType('Signal<TemplateRef<{ $implicit: string | null }>>'), 'TemplateRef<{ $implicit: string | null }>');
    });

    it('passes through nullish and non-template types', () => {
        assert.equal(templateRefType(undefined), undefined);
        assert.equal(templateRefType(null), null);
        assert.equal(templateRefType('Signal<unknown>'), 'unknown');
    });
});

describe('templateContextType', () => {
    it('reads the context type of plain and signal query templates', () => {
        assert.equal(templateContextType('TemplateRef<ButtonIconTemplateContext>'), 'ButtonIconTemplateContext');
        assert.equal(templateContextType('Signal<TemplateRef<ButtonIconTemplateContext>>'), 'ButtonIconTemplateContext');
        assert.equal(templateContextType('Signal<Nullable<TemplateRef<void>>>'), 'void');
    });

    it('falls back to unknown when there is no TemplateRef', () => {
        assert.equal(templateContextType('Signal<unknown>'), 'unknown');
        assert.equal(templateContextType(undefined), 'unknown');
    });
});
