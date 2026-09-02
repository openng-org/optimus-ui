import { describe, expect, it } from 'vitest';
import { createAppTree, createMigrationRunner } from './helpers';

describe('renamed-inputs', () => {
    it('renames a static size attribute on p-overlayBadge to badgeSize', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-overlayBadge severity="danger" size="small" value="2"></p-overlayBadge>\n`
        });
        const result = await runner.runSchematic('renamed-inputs', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-overlayBadge severity="danger" badgeSize="small" value="2"></p-overlayBadge>\n`);
    });

    it('renames a [size] binding on all selector variants', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-overlay-badge [size]="s"></p-overlay-badge><p-overlaybadge [size]="s"></p-overlaybadge>\n`
        });
        const result = await runner.runSchematic('renamed-inputs', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-overlay-badge [badgeSize]="s"></p-overlay-badge><p-overlaybadge [badgeSize]="s"></p-overlaybadge>\n`);
    });

    it('renames containerStyleClass and containerStyle on p-treeSelect to class and style', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-treeSelect [options]="nodes" containerStyleClass="w-full" [containerStyle]="{ width: '300px' }"></p-treeSelect>\n`
        });
        const result = await runner.runSchematic('renamed-inputs', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-treeSelect [options]="nodes" class="w-full" [style]="{ width: '300px' }"></p-treeSelect>\n`);
    });

    it('does not rename containerStyle on other components', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-galleria [containerStyle]="{ 'max-width': '640px' }"></p-galleria>\n`
        });
        const result = await runner.runSchematic('renamed-inputs', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-galleria [containerStyle]="{ 'max-width': '640px' }"></p-galleria>\n`);
    });

    it('rewrites inside an inline component template only', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/card.component.ts':
                `import { Component } from '@angular/core';\n` +
                '@Component({\n' +
                "    selector: 'app-card',\n" +
                '    template: `<p-overlayBadge size="large" [value]="count"><i class="pi pi-bell"></i></p-overlayBadge>`\n' +
                '})\n' +
                `export class CardComponent {\n` +
                `    count = 2;\n` +
                `    note = 'a size="x" string elsewhere should be untouched';\n` +
                `}\n`
        });
        const result = await runner.runSchematic('renamed-inputs', {}, tree);
        const text = result.readContent('/src/app/card.component.ts');
        expect(text).toContain('<p-overlayBadge badgeSize="large" [value]="count">');
        expect(text).toContain(`note = 'a size="x" string elsewhere should be untouched';`);
    });

    it('leaves size on elements that are not in the rename table', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-avatar size="xlarge"></p-avatar><p-badge size="small"></p-badge>\n`
        });
        const result = await runner.runSchematic('renamed-inputs', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-avatar size="xlarge"></p-avatar><p-badge size="small"></p-badge>\n`);
    });

    it('reports a conflict instead of rewriting when badgeSize is already present', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-overlayBadge size="small" badgeSize="large"></p-overlayBadge>\n`
        });
        const result = await runner.runSchematic('renamed-inputs', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-overlayBadge size="small" badgeSize="large"></p-overlayBadge>\n`);
    });

    it('does not touch badgeSize itself when only badgeSize is present', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-overlayBadge badgeSize="large"></p-overlayBadge>\n`
        });
        const result = await runner.runSchematic('renamed-inputs', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-overlayBadge badgeSize="large"></p-overlayBadge>\n`);
    });
});
