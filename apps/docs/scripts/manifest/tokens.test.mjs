import assert from 'node:assert/strict';
import { before, describe, it } from 'node:test';
import ComponentTokens from '@openng/optimus-ui-themes/tokens';
import { buildPresetFile } from '../build-penpot-tokens.mjs';
import { collectTokens, PRESETS, referencesOf } from './tokens.mjs';

let tokens;
// Shadow values are objects; references live in their string fields
const stringLeaves = (value) => (typeof value === 'string' ? [value] : Object.values(value ?? {}).flatMap(stringLeaves));
const token = (name) => tokens.find((t) => t.name === name);

before(() => {
    tokens = collectTokens();
});

describe('collectTokens', () => {
    it('names tokens like the CSS variables the styled engine generates', () => {
        // Every token the themes package documents must exist with the same CSS variable
        const documented = Object.values(ComponentTokens).flatMap((c) => c.tokens ?? []);
        const missing = documented.filter((t) => token(t.token)?.variable !== t.variable).map((t) => t.token);
        assert.ok(missing.length <= 1, `tokens without a matching variable: ${missing.join(', ')}`);
        assert.equal(token('form.field.border.radius').variable, '--p-form-field-border-radius');
    });

    it('keeps one value per preset and splits color scheme tokens into light and dark', () => {
        assert.deepEqual(Object.keys(token('emerald.500').values), Object.keys(PRESETS));
        assert.deepEqual(token('button.primary.background').values.aura, { light: '{primary.color}', dark: '{primary.color}' });
        assert.equal(token('button.primary.background').layer, 'component');
        assert.equal(token('button.primary.background').component, 'button');
    });

    it('spells references like the token names, as the styled engine resolves them', () => {
        // Presets may reference `{overlay.popover.borderRadius}`; the engine reads it as `--p-overlay-popover-border-radius`
        assert.equal(token('colorpicker.panel.border.radius').values.aura, '{overlay.popover.border.radius}');
    });

    it('infers a type from the resolved value and the name', () => {
        assert.equal(token('button.primary.background').type, 'color');
        assert.equal(token('form.field.padding.x').type, 'dimension');
        assert.equal(token('border.radius.none').type, 'dimension');
        assert.equal(token('list.option.group.font.weight').type, 'fontWeight');
        assert.equal(token('transition.duration').type, 'duration');
        assert.equal(token('overlay.modal.shadow').type, 'shadow');
    });

    it('has no group that is also a token, so the names nest', () => {
        const names = new Set(tokens.map((t) => t.name));
        assert.deepEqual(
            tokens.filter((t) => [...names].some((n) => n.startsWith(t.name + '.'))).map((t) => t.name),
            []
        );
    });
});

describe('buildPresetFile (Penpot)', () => {
    let file;
    const get = (set, name) => name.split('.').reduce((node, key) => node?.[key], file[set]);

    before(() => {
        file = buildPresetFile({ theme: { presets: Object.keys(PRESETS), tokens } }, 'aura').file;
    });

    it('splits sets by layer and color scheme, with a theme per scheme', () => {
        assert.deepEqual(file.$metadata.tokenSetOrder, ['primitive', 'semantic', 'semantic/light', 'semantic/dark', 'component', 'component/light', 'component/dark']);
        assert.deepEqual(
            file.$themes.map((t) => [t.group, t.name, Object.keys(t.selectedTokenSets)]),
            [
                ['Color scheme', 'Light', ['primitive', 'semantic', 'semantic/light', 'component', 'component/light']],
                ['Color scheme', 'Dark', ['primitive', 'semantic', 'semantic/dark', 'component', 'component/dark']]
            ]
        );
    });

    it('keeps references and converts rem to px', () => {
        assert.deepEqual(get('component/dark', 'button.primary.background'), { $value: '{primary.color}', $type: 'color', $description: 'Primary background of root' });
        assert.deepEqual(get('semantic', 'form.field.padding.x'), { $value: '12', $type: 'spacing' });
        assert.deepEqual(get('primitive', 'border.radius.md'), { $value: '6', $type: 'borderRadius' });
    });

    it('turns CSS shadows into Penpot shadow objects', () => {
        assert.deepEqual(get('component', 'button.raised.shadow').$value[0], { offsetX: '0', offsetY: '3', blur: '1', spread: '-2', color: 'rgba(0, 0, 0, 0.2)', inset: false });
    });

    it('computes color-mix() and leaves out what Penpot cannot represent', () => {
        const mixed = tokens.find((t) => typeof t.values.aura === 'string' && t.values.aura.startsWith('color-mix('));
        if (mixed) assert.match(get(mixed.layer, mixed.name).$value, /^(#|rgba\()/);
        assert.equal(get('semantic', 'transition.duration'), undefined);
        assert.equal(get('semantic', 'list.option.padding'), undefined);
    });

    it('only references tokens that are in the file', () => {
        const exported = new Set();
        const walk = (node, path) => {
            for (const [key, value] of Object.entries(node)) {
                if (value && typeof value === 'object' && '$value' in value) exported.add([...path, key].join('.'));
                else if (value && typeof value === 'object') walk(value, [...path, key]);
            }
        };
        for (const set of file.$metadata.tokenSetOrder) walk(file[set], []);

        const dangling = [];
        for (const set of file.$metadata.tokenSetOrder) {
            const check = (node, path) => {
                for (const [key, value] of Object.entries(node)) {
                    if (value && typeof value === 'object' && '$value' in value) {
                        for (const ref of stringLeaves(value.$value).flatMap(referencesOf)) if (!exported.has(ref)) dangling.push(`${[...path, key].join('.')} -> ${ref}`);
                    } else if (value && typeof value === 'object') check(value, [...path, key]);
                }
            };
            check(file[set], []);
        }
        assert.deepEqual(dangling, []);
    });
});
