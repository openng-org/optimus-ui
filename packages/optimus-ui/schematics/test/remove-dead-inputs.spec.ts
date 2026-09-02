import { describe, expect, it } from 'vitest';
import { createAppTree, createMigrationRunner } from './helpers';

describe('remove-dead-inputs', () => {
    describe('CascadeSelect inputLabel', () => {
        it('removes an [inputLabel] binding from a standalone template file', async () => {
            const runner = createMigrationRunner();
            const tree = createAppTree({
                '/src/app/app.html': `<p-cascadeselect [options]="countries" [inputLabel]="label" optionLabel="name"></p-cascadeselect>\n`
            });
            const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
            const html = result.readContent('/src/app/app.html');
            expect(html).not.toContain('inputLabel');
            expect(html).toContain('<p-cascadeselect [options]="countries" optionLabel="name"></p-cascadeselect>');
        });

        it('removes a static inputLabel attribute, single- or double-quoted', async () => {
            const runner = createMigrationRunner();
            const tree = createAppTree({
                '/src/app/app.html': `<p-cascade-select inputLabel='City' [options]="cities"></p-cascade-select>\n`
            });
            const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
            expect(result.readContent('/src/app/app.html')).toBe(`<p-cascade-select [options]="cities"></p-cascade-select>\n`);
        });

        it('removes the binding inside an inline component template (camelCase selector)', async () => {
            const runner = createMigrationRunner();
            const tree = createAppTree({
                '/src/app/picker.component.ts':
                    `import { Component } from '@angular/core';\n` +
                    '@Component({\n' +
                    "    selector: 'app-picker',\n" +
                    '    template: `<p-cascadeSelect [inputLabel]="label" [options]="options"></p-cascadeSelect>`\n' +
                    '})\n' +
                    `export class PickerComponent {\n` +
                    `    label = 'Pick one';\n` +
                    `    options = [];\n` +
                    `}\n`
            });
            const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
            const ts = result.readContent('/src/app/picker.component.ts');
            expect(ts).not.toContain('[inputLabel]');
            expect(ts).toContain('<p-cascadeSelect [options]="options"></p-cascadeSelect>');
            // The (now-orphaned) component property is left in place.
            expect(ts).toContain(`label = 'Pick one';`);
        });

        it('does not touch inputLabel on other elements', async () => {
            const runner = createMigrationRunner();
            const content = `<my-widget [inputLabel]="label"></my-widget>\n<p-select [inputLabel]="label"></p-select>\n`;
            const tree = createAppTree({ '/src/app/app.html': content });
            const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
            expect(result.readContent('/src/app/app.html')).toBe(content);
        });

        it('does not rewrite non-template string literals in TypeScript', async () => {
            const runner = createMigrationRunner();
            const content = `export const example = '<p-cascadeselect [inputLabel]="x"></p-cascadeselect>';\n`;
            const tree = createAppTree({ '/src/app/config.ts': content });
            const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
            expect(result.readContent('/src/app/config.ts')).toBe(content);
        });
    });

    it('does not touch node_modules or dist', async () => {
        const runner = createMigrationRunner();
        const content = `<p-cascadeselect [inputLabel]="x"></p-cascadeselect>\n`;
        const tree = createAppTree({
            '/node_modules/pkg/tpl.html': content,
            '/dist/app/tpl.html': content
        });
        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        expect(result.readContent('/node_modules/pkg/tpl.html')).toBe(content);
        expect(result.readContent('/dist/app/tpl.html')).toBe(content);
    });

    it('reports nothing on a workspace with no usage of the removed inputs', async () => {
        const runner = createMigrationRunner();
        const infos: string[] = [];
        runner.logger.subscribe((entry) => {
            if (entry.level === 'info') {
                infos.push(entry.message);
            }
        });
        await runner.runSchematic('remove-dead-inputs', {}, createAppTree());
        expect(infos.join('\n')).toContain('No bindings for the removed inputs were found to remove.');
    });
});
