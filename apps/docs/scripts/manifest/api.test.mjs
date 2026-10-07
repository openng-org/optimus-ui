import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { before, describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import { collectApi } from './api.mjs';

// Reads the built library typings, so run `pnpm run build:lib` and `pnpm --filter docs build:apidoc` first
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const libDir = path.resolve(__dirname, '../../../../packages/optimus-ui');
const apiDocs = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../doc/apidoc/index.json'), 'utf-8'));

let entryPoints;
const entry = (name) => entryPoints.find((e) => e.name === name);
const declaration = (entryName, className) => entry(entryName).declarations.find((d) => d.className === className);
const input = (entryName, className, name) => declaration(entryName, className).inputs.find((i) => i.name === name);

before(() => {
    entryPoints = collectApi({ libDir, apiDocs });
});

describe('collectApi', () => {
    it('lists each entry point with its import path, NgModule and declarations', () => {
        const button = entry('button');
        assert.equal(button.import, '@openng/optimus-ui/button');
        assert.deepEqual(button.modules, ['ButtonModule']);
        assert.deepEqual(
            button.declarations.map((d) => [d.className, d.selector, d.kind]),
            [
                ['Button', 'p-button', 'component'],
                ['ButtonDirective', '[pButton]', 'directive'],
                ['ButtonIcon', '[pButtonIcon]', 'directive'],
                ['ButtonLabel', '[pButtonLabel]', 'directive']
            ]
        );
    });

    it('includes inputs inherited from base classes', () => {
        for (const name of ['dt', 'unstyled', 'pt']) assert.ok(input('button', 'Button', name), `missing inherited input ${name}`);
    });

    it('reads defaults and transforms from the sources', () => {
        assert.equal(input('button', 'Button', 'iconPos').default, "'left'");
        assert.equal(input('button', 'Button', 'raised').transform, 'booleanAttribute');
        assert.equal(input('button', 'Button', 'raised').default, 'false');
        assert.equal(input('button', 'Button', 'tabindex').transform, 'numberAttribute');
    });

    it('expands literal unions into allowed values', () => {
        assert.deepEqual(input('button', 'Button', 'severity').values.sort(), ['contrast', 'danger', 'help', 'info', 'primary', 'secondary', 'success', 'warn']);
        assert.equal(input('button', 'Button', 'label').values, undefined);
    });

    it('unwraps signal inputs to the type a binding accepts', () => {
        const fluid = input('button', 'Button', 'fluid');
        assert.equal(fluid.signal, true);
        assert.equal(fluid.type, 'boolean | undefined');
    });

    it('marks two-way bindings and forms support', () => {
        assert.equal(input('dialog', 'Dialog', 'visible').twoWay, true);
        assert.equal(declaration('select', 'Select').forms, true);
        assert.equal(declaration('dialog', 'Dialog').forms, undefined);
    });

    it('describes outputs with their payload type and templates with their context', () => {
        assert.equal(declaration('button', 'Button').outputs.find((o) => o.name === 'onClick').payload, 'MouseEvent');
        assert.equal(declaration('button', 'Button').templates.find((t) => t.name === 'icon').context, 'ButtonIconTemplateContext');
    });

    it('lists services, plain classes and exported types, but not style providers', () => {
        assert.ok(entry('api').services.includes('MessageService'));
        assert.ok(!entryPoints.some((e) => e.services?.some((s) => s.endsWith('Style'))));
        assert.ok(entry('dynamicdialog').classes.some((c) => c.name === 'DynamicDialogRef'));
        assert.ok(
            entry('api')
                .types.find((t) => t.name === 'MenuItem')
                .properties.some((p) => p.name === 'routerLink')
        );
    });
});
