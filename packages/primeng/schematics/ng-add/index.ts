import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { Schema } from './schema';
import { addImportToModule, addProviderToAppConfig, addProviderToAppModule } from '../utils/ast-utils';

export function ngAdd(options: Schema): Rule {
    return (tree: Tree, context: SchematicContext) => {
        // 1. Add packages to package.json
        const packageJsonPath = '/package.json';
        if (tree.exists(packageJsonPath)) {
            const packageJsonContent = tree.read(packageJsonPath);
            if (packageJsonContent) {
                const packageJson = JSON.parse(packageJsonContent.toString('utf-8'));
                if (!packageJson.dependencies) {
                    packageJson.dependencies = {};
                }

                // Add dependencies
                const pkgVersion = require('../../package.json').version;
                packageJson.dependencies['primeng'] = `^${pkgVersion}`;
                packageJson.dependencies['@primeuix/themes'] = '^2.0.3';

                tree.overwrite(packageJsonPath, JSON.stringify(packageJson, null, 2));
            }
        }

        // 2. Schedule npm install
        context.addTask(new NodePackageInstallTask());

        // 3. Update app.config.ts or app.module.ts
        const theme = options.theme || 'aura';
        const capitalizedTheme = theme.charAt(0).toUpperCase() + theme.slice(1);

        const provideCode = `providePrimeNG({
      theme: {
        preset: ${capitalizedTheme}
      }
    })`;

        const appConfigPath = '/src/app/app.config.ts';
        const appModulePath = '/src/app/app.module.ts';

        if (tree.exists(appConfigPath)) {
            // Standalone
            addImportToModule(tree, appConfigPath, `import { providePrimeNG } from 'primeng/config';`);
            addImportToModule(tree, appConfigPath, `import ${capitalizedTheme} from '@primeuix/themes/${theme}';`);
            addProviderToAppConfig(tree, appConfigPath, provideCode);
            context.logger.info(`✅ Updated app.config.ts with PrimeNG and ${capitalizedTheme} theme.`);
        } else if (tree.exists(appModulePath)) {
            // Module-based
            addImportToModule(tree, appModulePath, `import { providePrimeNG } from 'primeng/config';`);
            addImportToModule(tree, appModulePath, `import ${capitalizedTheme} from '@primeuix/themes/${theme}';`);
            addProviderToAppModule(tree, appModulePath, provideCode);
            context.logger.info(`✅ Updated app.module.ts with PrimeNG and ${capitalizedTheme} theme.`);
        } else {
            context.logger.warn(`Could not find app.config.ts or app.module.ts to configure PrimeNG automatically.`);
        }

        return tree;
    };
}
