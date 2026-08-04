import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';

const collectionPath = path.join(__dirname, '../collection.json');

describe('ng-add', () => {
    let runner: SchematicTestRunner;

    beforeEach(() => {
        runner = new SchematicTestRunner('schematics', collectionPath);
    });

    it('should add dependencies to package.json and update app.config.ts', async () => {
        let appTree = Tree.empty() as UnitTestTree;
        appTree.create('/package.json', JSON.stringify({ dependencies: {} }));
        appTree.create('/src/app/app.config.ts', `import { ApplicationConfig } from '@angular/core';\n\nexport const appConfig: ApplicationConfig = {\n  providers: []\n};\n`);

        const tree = await runner.runSchematic('ng-add', { theme: 'aura' }, appTree);

        const packageJson = JSON.parse(tree.readContent('/package.json'));
        expect(packageJson.dependencies['primeng']).toBeDefined();
        expect(packageJson.dependencies['@primeuix/themes']).toBeDefined();

        const appConfig = tree.readContent('/src/app/app.config.ts');
        expect(appConfig).toContain(`import { providePrimeNG } from 'primeng/config';`);
        expect(appConfig).toContain(`import Aura from '@primeuix/themes/aura';`);
        expect(appConfig).toContain(`providePrimeNG({
      theme: {
        preset: Aura
      }
    })`);
    });

    it('should add dependencies to package.json and update app.module.ts', async () => {
        let appTree = Tree.empty() as UnitTestTree;
        appTree.create('/package.json', JSON.stringify({ dependencies: {} }));
        appTree.create('/src/app/app.module.ts', `import { NgModule } from '@angular/core';\n\n@NgModule({\n  providers: []\n})\nexport class AppModule { }\n`);

        const tree = await runner.runSchematic('ng-add', { theme: 'lora' }, appTree);

        const packageJson = JSON.parse(tree.readContent('/package.json'));
        expect(packageJson.dependencies['primeng']).toBeDefined();
        expect(packageJson.dependencies['@primeuix/themes']).toBeDefined();

        const appModule = tree.readContent('/src/app/app.module.ts');
        expect(appModule).toContain(`import { providePrimeNG } from 'primeng/config';`);
        expect(appModule).toContain(`import Lora from '@primeuix/themes/lora';`);
        expect(appModule).toContain(`providePrimeNG({
      theme: {
        preset: Lora
      }
    })`);
    });
});
