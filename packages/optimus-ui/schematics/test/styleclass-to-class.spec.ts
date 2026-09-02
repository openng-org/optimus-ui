import { describe, expect, it } from 'vitest';
import { createAppTree, createMigrationRunner } from './helpers';

describe('styleclass-to-class', () => {
    it('renames a static styleClass attribute on p-tag in a template file', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-tag value="New" severity="success" styleClass="font-medium"></p-tag>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-tag value="New" severity="success" class="font-medium"></p-tag>\n`);
    });

    it('renames a [styleClass] binding on p-tag', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-tag [value]="v" [styleClass]="klass"></p-tag>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-tag [value]="v" [class]="klass"></p-tag>\n`);
    });

    it('merges styleClass into an existing static class attribute', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-tag class="mr-2" styleClass="font-medium" value="X"></p-tag>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-tag class="mr-2 font-medium" value="X"></p-tag>\n`);
    });

    it('handles > characters inside other attribute values on the same tag', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-tag [severity]="count > 3 ? 'danger' : 'info'" styleClass="font-medium" [value]="v"></p-tag>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-tag [severity]="count > 3 ? 'danger' : 'info'" class="font-medium" [value]="v"></p-tag>\n`);
    });

    it('rewrites inside an inline component template only', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/card.component.ts':
                `import { Component } from '@angular/core';\n` +
                '@Component({\n' +
                "    selector: 'app-card',\n" +
                '    template: `<p-tag styleClass="mb-1" [value]="status"></p-tag>`\n' +
                '})\n' +
                `export class CardComponent {\n` +
                `    status = 'ok';\n` +
                `    note = 'a styleClass="x" string elsewhere should be untouched';\n` +
                `}\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        const text = result.readContent('/src/app/card.component.ts');
        expect(text).toContain('<p-tag class="mb-1" [value]="status"></p-tag>');
        expect(text).toContain(`note = 'a styleClass="x" string elsewhere should be untouched';`);
    });

    it('leaves styleClass on components that are not migrated yet', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-drawer styleClass="x"></p-drawer><p-button styleClass="y"></p-button>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-drawer styleClass="x"></p-drawer><p-button styleClass="y"></p-button>\n`);
    });

    it('reports a conflict instead of rewriting when [class] is already bound', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-tag [class]="a" [styleClass]="b"></p-tag>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-tag [class]="a" [styleClass]="b"></p-tag>\n`);
    });

    it('rewrites the wave-1 selectors independently, including the p-inputgroup / p-inputgroup-addon prefix pair', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html':
                `<p-inputgroup styleClass="g"><p-inputgroup-addon styleClass="a">$</p-inputgroup-addon></p-inputgroup>\n` +
                `<p-iconfield [styleClass]="f"><p-inputicon styleClass="i" /></p-iconfield>\n` +
                `<p-avatar-group styleClass="av"></p-avatar-group>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(
            `<p-inputgroup class="g"><p-inputgroup-addon class="a">$</p-inputgroup-addon></p-inputgroup>\n` + `<p-iconfield [class]="f"><p-inputicon class="i" /></p-iconfield>\n` + `<p-avatar-group class="av"></p-avatar-group>\n`
        );
    });

    it('does not confuse a p-tag prefix with longer selectors', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-tag-cloud styleClass="x"></p-tag-cloud><p-tag styleClass="y"></p-tag>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-tag-cloud styleClass="x"></p-tag-cloud><p-tag class="y"></p-tag>\n`);
    });
});
