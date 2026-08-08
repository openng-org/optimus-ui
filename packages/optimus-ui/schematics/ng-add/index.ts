import { Rule, SchematicContext, SchematicsException, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { addRootProvider, readWorkspace } from '@schematics/angular/utility';
import { isObservable, lastValueFrom } from 'rxjs';
import { addDefaultImport } from '../utils/app-config';
import { VERSIONS } from '../utils/mappings';
import { hasPrimeng, SKIP_DIRS } from '../utils/package-json';
import { Schema, Theme } from './schema';

const THEMES_PACKAGE = '@openng/optimus-ui-themes';
const DEFAULT_THEME: Theme = 'Aura';

/** The preset import name and its subpath module for the chosen theme (e.g. `Aura` → `@openng/optimus-ui-themes/aura`). */
function themeImport(theme: Theme): { preset: string; module: string } {
    return { preset: theme, module: `${THEMES_PACKAGE}/${theme.toLowerCase()}` };
}

function manualInstructions(theme: Theme): string {
    const { preset, module } = themeImport(theme);
    return `Could not find a providers array to update automatically. Finish the setup manually:
  1. import { provideOptimus } from '@openng/optimus-ui/config';
  2. import ${preset} from '${module}';
  3. add provideOptimus({ theme: { preset: ${preset} } }) to your root providers
     (bootstrapApplication providers, or an NgModule's providers array).`;
}

/**
 * Sets up Optimus UI in a fresh (non-PrimeNG) project. Migrating an existing PrimeNG workspace is
 * a separate concern handled by the `migrate-from-primeng` schematic
 * (`ng generate @openng/optimus-ui:migrate-from-primeng`) — when primeng is detected, ng-add
 * points the user there and makes no changes.
 */
export function ngAdd(options: Schema): Rule {
    return (tree: Tree, context: SchematicContext) => {
        if (!tree.read('/package.json')) {
            throw new SchematicsException('Could not read /package.json.');
        }
        if (hasPrimeng(tree)) {
            context.logger.warn('primeng detected — ng-add only sets up Optimus UI in new projects, so no changes were made.\n' + 'To migrate this workspace, run: ng generate @openng/optimus-ui:migrate-from-primeng');
            return tree;
        }
        return freshSetup(options);
    };
}

function freshSetup(options: Schema): Rule {
    return async (tree: Tree, context: SchematicContext) => {
        addThemesDependency(tree);
        await wireProvideOptimus(tree, context, options);

        if (!options.skipInstall) {
            context.addTask(new NodePackageInstallTask());
        }
        return tree;
    };
}

function addThemesDependency(tree: Tree): void {
    const pkgBuffer = tree.read('/package.json');
    if (!pkgBuffer) {
        throw new SchematicsException('Could not read /package.json.');
    }
    const raw = pkgBuffer.toString();
    const pkg = JSON.parse(raw);
    pkg.dependencies = pkg.dependencies ?? {};
    if (!pkg.dependencies[THEMES_PACKAGE]) {
        pkg.dependencies[THEMES_PACKAGE] = VERSIONS[THEMES_PACKAGE];
        const indent = raw.match(/^\{\r?\n(\s+)/)?.[1] ?? '    ';
        tree.overwrite('/package.json', JSON.stringify(pkg, null, indent) + '\n');
    }
}

/**
 * Resolves the target project and wires `provideOptimus` into its root providers via the
 * official `addRootProvider` utility (handles both standalone `app.config.ts` and NgModule
 * apps). An explicit but nonexistent `--project` is a hard error; anything else unexpected about
 * the app's shape (no application project, no `build` target, an app.config.ts/main.ts that
 * addRootProvider can't statically analyze, …) degrades to the manual-instructions warning
 * rather than aborting the rest of ng-add.
 */
async function wireProvideOptimus(tree: Tree, context: SchematicContext, options: Schema): Promise<void> {
    const theme = options.theme ?? DEFAULT_THEME;
    const { preset, module } = themeImport(theme);
    const instructions = manualInstructions(theme);

    let projectName: string;
    let sourceRoot: string;
    try {
        const workspace = await readWorkspace(tree);

        if (options.project) {
            if (!workspace.projects.has(options.project)) {
                throw new SchematicsException(`Project "${options.project}" was not found in the workspace.`);
            }
            projectName = options.project;
        } else {
            const application = [...workspace.projects].find(([, project]) => project.extensions['projectType'] === 'application');
            if (!application) {
                context.logger.warn(instructions);
                return;
            }
            projectName = application[0];
        }

        const project = workspace.projects.get(projectName)!;
        sourceRoot = project.sourceRoot ?? (project.root ? `${project.root}/src` : 'src');
    } catch (err) {
        // An explicitly-requested project that doesn't exist is a hard error — everything else
        // (missing angular.json, no application project, …) degrades to manual instructions.
        if (err instanceof SchematicsException && options.project) {
            throw err;
        }
        context.logger.warn(instructions);
        return;
    }

    if (findProvideOptimusFile(tree, sourceRoot)) {
        context.logger.info(`provideOptimus already configured in ${projectName}.`);
        return;
    }

    try {
        const rule = addRootProvider(projectName, ({ code, external }) => code`${external('provideOptimus', '@openng/optimus-ui/config')}({ theme: { preset: ${preset} } })`);
        await applyRule(rule, tree, context);

        const wiredFile = findProvideOptimusFile(tree, sourceRoot);
        if (!wiredFile) {
            context.logger.warn(instructions);
            return;
        }

        // `external()` only emits named imports, and `@openng/optimus-ui-themes/aura` only has a
        // default export — add it ourselves.
        const original = tree.read(wiredFile)!.toString();
        const imported = addDefaultImport(original, preset, module);
        let updated = imported.text;
        if (imported.bindingName !== preset) {
            // The preset name is already taken in this file (e.g. `Aura` imported from another
            // theme package), so the import went in under a different binding — retarget the
            // `preset:` reference in the provider call addRootProvider just inserted. `external()`
            // may itself have aliased the provideOptimus binding (provideOptimus_1, …), hence `\w*`.
            const providerCall = new RegExp(`(provideOptimus\\w*\\(\\{\\s*theme:\\s*\\{\\s*preset:\\s*)${preset}(\\s*\\}\\s*\\}\\s*\\))`);
            if (!providerCall.test(updated)) {
                context.logger.warn(instructions);
                return;
            }
            updated = updated.replace(providerCall, `$1${imported.bindingName}$2`);
        }
        if (updated !== original) {
            tree.overwrite(wiredFile, updated);
        }
        const bindingNote = imported.bindingName === preset ? '' : ` (bound as ${imported.bindingName})`;
        context.logger.info(`Added provideOptimus with the ${preset} preset to ${wiredFile}${bindingNote}.`);
    } catch {
        context.logger.warn(instructions);
    }
}

/** Finds the first `.ts` file under `sourceRoot` (skipping node_modules/dist/…) containing a `provideOptimus(` call. */
function findProvideOptimusFile(tree: Tree, sourceRoot: string): string | null {
    const prefix = `/${sourceRoot}/`;
    let found: string | null = null;
    tree.visit((path) => {
        if (found || SKIP_DIRS.test(path) || !path.startsWith(prefix) || !path.endsWith('.ts')) {
            return;
        }
        const content = tree.read(path)?.toString();
        if (content?.includes('provideOptimus(')) {
            found = path;
        }
    });
    return found;
}

/**
 * Fully resolves a Rule to completion (including the async/nested-Rule/Observable chains that
 * `@schematics/angular`'s standalone utilities return) so its effects — and any error it throws —
 * are observed synchronously by the caller, rather than deferred until the schematics engine gets
 * around to applying it.
 */
async function applyRule(rule: Rule, tree: Tree, context: SchematicContext): Promise<void> {
    let result: unknown = await rule(tree, context);
    while (typeof result === 'function') {
        result = await (result as Rule)(tree, context);
    }
    if (result !== undefined && isObservable(result)) {
        await lastValueFrom(result);
    }
}
