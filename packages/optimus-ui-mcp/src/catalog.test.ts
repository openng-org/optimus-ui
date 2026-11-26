import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { Catalog } from './catalog';
import type { Manifest } from './manifest';

const manifest = JSON.parse(readFileSync(new URL('../data/manifest.json', import.meta.url), 'utf-8')) as Manifest;
const catalog = new Catalog(manifest);

describe('resolveComponent', () => {
    it.each(['button', 'Button', 'p-button', 'pButton', '[pButton]', 'ButtonDirective'])('finds the button page from %s', (query) => {
        expect(catalog.resolveComponent(query)?.page.name).toBe('button');
    });

    it('focuses the declaration a selector names', () => {
        const resolved = catalog.resolveComponent('pButton');
        expect(resolved?.focus?.className).toBe('ButtonDirective');
        expect(catalog.resolveComponent('button')?.focus).toBeUndefined();
    });

    it('resolves directives and sub-components to their page', () => {
        expect(catalog.resolveComponent('pTooltip')?.page.name).toBe('tooltip');
        expect(catalog.resolveComponent('p-columnFilter')?.page.name).toBe('table');
        expect(catalog.resolveComponent('AvatarGroup')?.page.name).toBe('avatar');
    });

    it('lists the declarations the page documents first', () => {
        const names = catalog.resolveComponent('button')!.declarations.map((d) => d.className);
        expect(names.slice(0, 2)).toEqual(['Button', 'ButtonDirective']);
    });

    it('returns undefined and suggestions for unknown names', () => {
        expect(catalog.resolveComponent('dropdwn')).toBeUndefined();
        expect(catalog.suggest('datepiker')).toContain('datepicker');
    });
});

describe('getType', () => {
    it('describes interfaces, aliases and classes with their import', () => {
        expect(catalog.getType('MenuItem')?.properties?.some((p) => p.name === 'label')).toBe(true);
        expect(catalog.getType('ButtonSeverity')?.values).toContain('danger');
        expect(catalog.getType('DynamicDialogRef')?.members?.some((m) => m.name === 'close')).toBe(true);
        expect(catalog.getType('menuitem')?.name).toBe('MenuItem');
    });
});

describe('search', () => {
    it('ranks the component first for its name', () => {
        expect(catalog.search('datepicker')[0]).toMatchObject({ kind: 'component', next: 'get_component({ "name": "datepicker" })' });
    });

    it('finds inputs, types and guides', () => {
        expect(catalog.search('tooltipPosition').some((h) => h.kind === 'input' && h.title.includes('pTooltip'))).toBe(true);
        expect(catalog.search('MenuItem')[0].kind).toBe('type');
        expect(catalog.search('tailwind').some((h) => h.kind === 'guide')).toBe(true);
    });

    it('returns nothing for an empty query', () => {
        expect(catalog.search('   ')).toEqual([]);
    });
});
