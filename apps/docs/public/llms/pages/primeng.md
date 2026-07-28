# Migrate from PrimeNG

Moving a PrimeNG v21 application to Optimus UI.

## Automated-

The recommended way to migrate is the migrate-from-primeng schematic. Install &#64;openng/optimus-ui first so the Angular CLI can resolve it, then run the schematic: packages are swapped, imports are rewritten and dependencies are installed. Note that ng add does not run the migration. It only sets up Optimus UI in a fresh project and makes no changes when primeng is detected. The schematic can be re-run at any time, for example after pulling in unmigrated code, and accepts a couple of flags. --skip-install skips the package install task and --force bypasses the PrimeNG v21 version check. After rewriting, the schematic scans the workspace and prints a report of any remaining primeng , primeicons or &#64;primeuix references it could not migrate automatically, with file and line numbers. Review these manually using the tables in the manual migration section below. Files your .gitignore excludes are left alone, so coverage reports and build output are neither rewritten nor reported. The report itself is printed before the CLI lists the files it created and updated — that list only covers what the migration changed for you, so scroll back up to the warnings before you build.

## Manual-

If you prefer to migrate by hand, or need to finish references the schematic reported as leftovers, apply the renames below. Start by replacing the packages. Packages Replace the packages in package.json and in every import path. Subpath imports keep their suffix, for example primeng/button becomes &#64;openng/optimus-ui/button . Identifiers Rename the following exported identifiers. The PrimeIcons constants class still compiles through a deprecated alias, however OpenngIcons is the current API. Assets The PrimeIcons stylesheet moved along with the package rename. Update references in global stylesheets and in the styles arrays of angular.json or project.json from primeicons/primeicons.css to &#64;openng/icons/openng-icons.css . Example A typical app.config.ts and component before the migration. The same code after the migration.

## Overview-

Optimus UI is the open-source MIT licensed continuation of PrimeNG (now closed-source), rebranded due to trademark restrictions. Optimus UI v1 targets Angular 21 and is fully API-compatible with PrimeNG v21, so migrating is a rename rather than a rewrite. From v1 onward, Optimus UI evolves independently and future versions will diverge from PrimeNG, so v1 is the smoothest point to switch. Component selectors keep the p- prefix and icon classes keep the pi- prefix, so your templates are not affected by the migration.

## Prerequisites-

Your project must be on PrimeNG v21 before migrating, as Optimus UI v1 mirrors the PrimeNG v21 API. If you are on an older version, update PrimeNG first by following its v21 migration guide . The migration schematic verifies this requirement and aborts when PrimeNG is missing or older than v21. The check can be bypassed with the --force flag, for example in workspaces where the dependency is declared in a non-standard location.

```bash
ng update primeng@21
```

## Schematic-details-

The schematic performs the following steps across the whole workspace, skipping build output and dependency folders. Swaps the PrimeNG package family for the Optimus UI equivalents in every package.json . Rewrites import specifiers and renamed identifiers, such as providePrimeNG , in all .ts and .mts source files. Updates asset references, such as the PrimeIcons stylesheet, in stylesheets and in angular.json / project.json . Prints a report of leftover references that require manual review. Schedules a package install, unless --skip-install is set.

## Verify-

Build the application and run your test suite to confirm the migration. Searching the project for the old package names is a quick way to find anything left behind. The schematic scans for the same pattern when it prints its leftover report.

```bash
ng build

grep -riEn "primeng|primeicons|@primeuix" src/
```

