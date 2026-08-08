import { SchematicsException } from '@angular-devkit/schematics';
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { describe, expect, it } from 'vitest';
import { VERSIONS } from '../utils/mappings';
import { createAppTree, createRealAppTree, createRunner, DEFAULT_PKG } from './helpers';

function findFileContaining(tree: UnitTestTree, substring: string): string {
    const path = tree.files.find((file) => file.endsWith('.ts') && tree.readContent(file).includes(substring));
    if (!path) {
        throw new Error(`No file in the tree contains "${substring}". Files: ${tree.files.join(', ')}`);
    }
    return path;
}

describe('ng-add', () => {
    it('fresh standalone project (real CLI tree): adds the themes dependency and wires provideOptimus', async () => {
        const runner = createRunner();
        const appTree = await createRealAppTree(runner, { standalone: true });
        const result = await runner.runSchematic('ng-add', { skipInstall: true }, appTree);

        const pkg = JSON.parse(result.readContent('/package.json'));
        expect(pkg.dependencies['@openng/optimus-ui-themes']).toBe(VERSIONS['@openng/optimus-ui-themes']);

        const appConfigPath = findFileContaining(result, 'provideOptimus');
        expect(appConfigPath).toBe('/src/app/app.config.ts');
        const appConfig = result.readContent(appConfigPath);
        expect(appConfig).toContain(`import { provideOptimus } from '@openng/optimus-ui/config';`);
        expect(appConfig).toContain(`import Aura from '@openng/optimus-ui-themes/aura';`);
        expect(appConfig).toContain(`provideOptimus({ theme: { preset: Aura } })`);
    });

    it.each([
        ['Lara', 'lara'],
        ['Material', 'material'],
        ['Nora', 'nora']
    ] as const)('fresh standalone project with --theme %s: wires the chosen preset', async (theme, module) => {
        const runner = createRunner();
        const appTree = await createRealAppTree(runner, { standalone: true });
        const result = await runner.runSchematic('ng-add', { skipInstall: true, theme }, appTree);

        const appConfig = result.readContent('/src/app/app.config.ts');
        expect(appConfig).toContain(`import ${theme} from '@openng/optimus-ui-themes/${module}';`);
        expect(appConfig).toContain(`provideOptimus({ theme: { preset: ${theme} } })`);
        expect(appConfig).not.toContain('Aura');
    });

    it('fresh NgModule project (real CLI tree, standalone: false): wires provideOptimus into the AppModule providers', async () => {
        const runner = createRunner();
        const appTree = await createRealAppTree(runner, { standalone: false });
        const result = await runner.runSchematic('ng-add', { skipInstall: true }, appTree);

        const pkg = JSON.parse(result.readContent('/package.json'));
        expect(pkg.dependencies['@openng/optimus-ui-themes']).toBe(VERSIONS['@openng/optimus-ui-themes']);

        const modulePath = findFileContaining(result, 'provideOptimus');
        expect(modulePath).toBe('/src/app/app-module.ts');
        const moduleSource = result.readContent(modulePath);
        expect(moduleSource).toContain(`import { provideOptimus } from '@openng/optimus-ui/config';`);
        expect(moduleSource).toContain(`import Aura from '@openng/optimus-ui-themes/aura';`);
        expect(moduleSource).toMatch(/providers:\s*\[[\s\S]*provideOptimus\(\{ theme: \{ preset: Aura \} \}\)/);
    });

    it('nonexistent --project rejects with SchematicsException (real CLI tree)', async () => {
        const runner = createRunner();
        const appTree = await createRealAppTree(runner);
        await expect(runner.runSchematic('ng-add', { skipInstall: true, project: 'does-not-exist' }, appTree)).rejects.toThrow(SchematicsException);
    });

    it('re-running on an already-configured project (real CLI tree) logs an informational message and leaves the file untouched', async () => {
        const runner = createRunner();
        const appTree = await createRealAppTree(runner);
        const first = await runner.runSchematic('ng-add', { skipInstall: true }, appTree);

        const logs: string[] = [];
        runner.logger.subscribe((entry) => logs.push(entry.message));
        const second = await runner.runSchematic('ng-add', { skipInstall: true }, first);

        expect(logs.join('\n')).toContain('provideOptimus already configured in');
        expect(logs.join('\n')).not.toContain('Added provideOptimus');
        expect(second.readContent('/src/app/app.config.ts')).toBe(first.readContent('/src/app/app.config.ts'));
    });

    it('fresh project on a minimal hand-built tree (no build target): leaves files alone and logs instructions', async () => {
        // createAppTree's angular.json has no `architect`/`build` target, so addRootProvider can't
        // locate a main file — this exercises the degrade-to-manual-instructions path.
        const runner = createRunner();
        const tree = createAppTree();
        const logs: string[] = [];
        runner.logger.subscribe((entry) => logs.push(entry.message));

        const result = await runner.runSchematic('ng-add', { skipInstall: true }, tree);
        expect(logs.join('\n')).toContain('provideOptimus');
        expect(JSON.parse(result.readContent('/package.json')).dependencies['@openng/optimus-ui-themes']).toBe(VERSIONS['@openng/optimus-ui-themes']);
        expect(result.readContent('/src/app/app.config.ts')).not.toContain('provideOptimus');
    });

    it('primeng project: warns, points to migrate-from-primeng, and makes no changes', async () => {
        const runner = createRunner();
        const appConfig = `import { providePrimeNG } from 'primeng/config';\nexport const appConfig = { providers: [providePrimeNG()] };\n`;
        const tree = createAppTree({ '/src/app/app.config.ts': appConfig }, { ...DEFAULT_PKG, dependencies: { '@angular/core': '^21.0.0', primeng: '^21.0.2' } });
        const logs: string[] = [];
        runner.logger.subscribe((entry) => logs.push(entry.message));

        const result = await runner.runSchematic('ng-add', { skipInstall: true }, tree);

        expect(logs.join('\n')).toContain('primeng detected');
        expect(logs.join('\n')).toContain('ng generate @openng/optimus-ui:migrate-from-primeng');
        const pkg = JSON.parse(result.readContent('/package.json'));
        expect(pkg.dependencies.primeng).toBe('^21.0.2');
        expect(pkg.dependencies['@openng/optimus-ui-themes']).toBeUndefined();
        expect(result.readContent('/src/app/app.config.ts')).toBe(appConfig);
    });

    it('schedules an install task unless skipInstall is set', async () => {
        const runner = createRunner();
        await runner.runSchematic('ng-add', {}, createAppTree());
        expect(runner.tasks.some((t) => t.name === 'node-package')).toBe(true);
    });

    it('primeng project: schedules no install task', async () => {
        const runner = createRunner();
        const tree = createAppTree({}, { ...DEFAULT_PKG, dependencies: { '@angular/core': '^21.0.0', primeng: '^21.0.2' } });
        await runner.runSchematic('ng-add', {}, tree);
        expect(runner.tasks.some((t) => t.name === 'node-package')).toBe(false);
    });

    it('primeng only in a workspace sub-package: still warns and makes no changes', async () => {
        const runner = createRunner();
        const libPkgRaw = JSON.stringify({ name: 'app-lib', dependencies: { primeng: '^21.0.2' } }, null, 2) + '\n';
        const tree = createAppTree({ '/libs/app/package.json': libPkgRaw });
        const logs: string[] = [];
        runner.logger.subscribe((entry) => logs.push(entry.message));

        const result = await runner.runSchematic('ng-add', { skipInstall: true }, tree);
        expect(logs.join('\n')).toContain('primeng detected');
        expect(result.readContent('/libs/app/package.json')).toBe(libPkgRaw);
        expect(JSON.parse(result.readContent('/package.json')).dependencies['@openng/optimus-ui-themes']).toBeUndefined();
    });

    it('primeng declared only in peerDependencies: still warns and makes no changes (#1448)', async () => {
        const runner = createRunner();
        const appConfig = `import { providePrimeNG } from 'primeng/config';\nexport const appConfig = { providers: [providePrimeNG()] };\n`;
        const tree = createAppTree({ '/src/app/app.config.ts': appConfig }, { ...DEFAULT_PKG, peerDependencies: { primeng: '^21.0.0' } });
        const logs: string[] = [];
        runner.logger.subscribe((entry) => logs.push(entry.message));

        const result = await runner.runSchematic('ng-add', { skipInstall: true }, tree);

        expect(logs.join('\n')).toContain('primeng detected');
        const pkg = JSON.parse(result.readContent('/package.json'));
        expect(pkg.peerDependencies.primeng).toBe('^21.0.0');
        expect(pkg.dependencies['@openng/optimus-ui-themes']).toBeUndefined();
        expect(result.readContent('/src/app/app.config.ts')).toBe(appConfig);
    });

    it.each([
        ['optionalDependencies', { optionalDependencies: { primeng: '^21.0.0' } }],
        ['resolutions', { resolutions: { '**/primeng': '21.0.2' } }],
        ['overrides', { overrides: { primeng: '21.0.2' } }],
        ['pnpm.overrides', { pnpm: { overrides: { primeng: '21.0.2' } } }]
    ] as const)('primeng declared only in %s: still warns and makes no changes (#1448)', async (_section, extra) => {
        const runner = createRunner();
        const tree = createAppTree({}, { ...DEFAULT_PKG, ...extra });
        const logs: string[] = [];
        runner.logger.subscribe((entry) => logs.push(entry.message));

        const result = await runner.runSchematic('ng-add', { skipInstall: true }, tree);
        expect(logs.join('\n')).toContain('primeng detected');
        expect(JSON.parse(result.readContent('/package.json')).dependencies['@openng/optimus-ui-themes']).toBeUndefined();
    });

    it('pre-existing Aura binding (real CLI tree): imports the preset under an alias and retargets the provider call (#1448)', async () => {
        const runner = createRunner();
        const appTree = await createRealAppTree(runner, { standalone: true });
        appTree.overwrite('/src/app/app.config.ts', `import Aura from './my-aura-theme';\n` + appTree.readContent('/src/app/app.config.ts'));
        const logs: string[] = [];
        runner.logger.subscribe((entry) => logs.push(entry.message));

        const result = await runner.runSchematic('ng-add', { skipInstall: true }, appTree);

        const appConfig = result.readContent('/src/app/app.config.ts');
        expect(appConfig).toContain(`import Aura from './my-aura-theme';`);
        expect(appConfig).toContain(`import OptimusAura from '@openng/optimus-ui-themes/aura';`);
        expect(appConfig).toContain(`provideOptimus({ theme: { preset: OptimusAura } })`);
        expect(appConfig).not.toContain(`import Aura from '@openng/optimus-ui-themes/aura';`);
        expect(appConfig).not.toContain(`preset: Aura `);
        expect(logs.join('\n')).toContain('bound as OptimusAura');
    });

    it('pre-existing legacy @primeuix Aura import (real CLI tree): retargets it in place — no alias, no duplicate (#1448)', async () => {
        const runner = createRunner();
        const appTree = await createRealAppTree(runner, { standalone: true });
        appTree.overwrite('/src/app/app.config.ts', `import Aura from '@primeuix/themes/aura';\n` + appTree.readContent('/src/app/app.config.ts'));

        const result = await runner.runSchematic('ng-add', { skipInstall: true }, appTree);

        const appConfig = result.readContent('/src/app/app.config.ts');
        expect(appConfig).toContain(`import Aura from '@openng/optimus-ui-themes/aura';`);
        expect(appConfig).toContain(`provideOptimus({ theme: { preset: Aura } })`);
        expect(appConfig).not.toContain('@primeuix');
        expect(appConfig).not.toContain('OptimusAura');
        expect(appConfig.match(/import Aura /g)).toHaveLength(1);
    });
});
