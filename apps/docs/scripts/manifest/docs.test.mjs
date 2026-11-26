import assert from 'node:assert/strict';
import { before, describe, it } from 'node:test';
import { indexManifest, renderComponent } from '../build-llm-docs.mjs';
import { buildManifest } from '../build-manifest.mjs';

// Reads the built library, the API docs and demos.json, so run the docs content build first
let manifest;
const page = (name) => manifest.components.find((c) => c.name === name);

before(() => {
    manifest = buildManifest();
});

describe('manifest docs pages', () => {
    it('includes every docs page, also when the doc folder is not lowercase', () => {
        assert.ok(page('image'), 'the Image page (doc/Image) is missing');
        assert.equal(page('image').url, 'https://optimus.openng.org/image');
        assert.ok(manifest.guides.some((g) => g.name === 'installation'));
        assert.ok(!page('llms'), 'guide pages must not be listed as components');
    });

    it('links each page to the entry points of the components it documents', () => {
        assert.deepEqual(page('avatar').entryPoints, ['avatar', 'avatargroup']);
        assert.deepEqual(page('button').api, ['Button', 'ButtonDirective']);
        assert.ok(page('table').tokens.every((t) => t.name.startsWith('datatable.')));
        for (const component of manifest.components) assert.ok(component.entryPoints?.length, `${component.name} links no entry point`);
    });

    it('keeps shared services and types as related imports instead of linking the api entry point', () => {
        assert.deepEqual(page('tooltip').entryPoints, ['tooltip']);
        assert.deepEqual(page('confirmdialog').related, [
            { name: 'ConfirmationService', kind: 'service', import: '@openng/optimus-ui/api' },
            { name: 'Confirmation', kind: 'interface', import: '@openng/optimus-ui/api' }
        ]);
    });

    it('orders sections as the page shows them', () => {
        const ids = page('avatar').sections.map((s) => s.id);
        assert.deepEqual(ids.slice(0, 3), ['label', 'icon', 'image']);
    });
});

describe('renderComponent', () => {
    it('renders imports, selectors, allowed values, defaults and two-way bindings from the manifest', () => {
        const index = indexManifest(manifest);
        const button = renderComponent(page('button'), index);
        assert.match(button, /import \{ ButtonModule, Button, ButtonDirective, ButtonIcon, ButtonLabel \} from '@openng\/optimus-ui\/button';/);
        assert.match(button, /Selector: `p-button`/);
        assert.match(button, /\| `iconPos` \| `"top" \\\| "bottom" \\\| "left" \\\| "right"` \| `'left'` \|/);
        assert.match(button, /\| `button.primary.background` \| `--p-button-primary-background` \| Primary background of root \|/);

        assert.match(renderComponent(page('dialog'), index), /Two-way: `\[\(visible\)\]`/);
        assert.match(renderComponent(page('select'), index), /works with `ngModel`, `formControl` and `formControlName`/);
        assert.match(renderComponent(page('confirmdialog'), index), /import \{ ConfirmationService, Confirmation \} from '@openng\/optimus-ui\/api';/);
    });
});
