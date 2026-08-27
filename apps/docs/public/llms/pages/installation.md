# Installation

Setting up Optimus UI in an Angular CLI project.

## Download-

Prefer to wire things up yourself? Install the packages from the npm registry directly. The next section covers the provider setup that ng add would have written for you.

```bash
# Using npm
npm install @openng/optimus-ui @openng/optimus-ui-themes

# Using yarn
yarn add @openng/optimus-ui @openng/optimus-ui-themes

# Using pnpm
pnpm add @openng/optimus-ui @openng/optimus-ui-themes
```

## Examples-

Every example in this documentation opens in StackBlitz from the code toolbar above each demo, already wired up with the current version. The source repository is the reference for how the library itself is built and consumed.

## Icons-

Optimus UI components accept any icon through templating, so an icon library is optional. That said, every example in this documentation uses the pi pi-&#123;icon&#125; classes from OpenNG Icons , and component defaults such as the DatePicker arrows reference them too. Install it if you want the demos to look the way they do here. Then import the stylesheet, either from your global stylesheet or from the styles array in angular.json .

## Nextsteps-

Once you have Optimus UI up and running, we recommend exploring the following resources to gain a deeper understanding of the library. Global configuration Styled mode and unstyled mode Tailwind CSS integration Pass Through for direct access to the underlying elements Philosophy — what this project promises, and what it does not FAQ

## Ngadd-

The recommended way to add Optimus UI to an Angular CLI workspace is a single command. The schematic asks which theme preset you want and then does the rest: adds &#64;openng/optimus-ui and &#64;openng/optimus-ui-themes to your dependencies wires provideOptimus into your root providers with the chosen preset, in app.config.ts or your root NgModule installs the packages Pass the preset up front to skip the prompt, or skip the install step if you want to run it yourself: If the schematic cannot find a providers array to update it prints the three manual steps instead of guessing, so nothing in your workspace is rewritten unexpectedly. If it detects an existing primeng dependency it makes no changes to your code and points you at the migration guide , which covers the migrate-from-primeng schematic. It does not run that schematic for you.

```bash
ng add @openng/optimus-ui
```

## Prerequisites-

Optimus UI targets Angular v21 and newer. Any workspace created with the Angular CLI works, standalone or NgModule based. Angular v21 or newer, including &#64;angular/cdk , &#64;angular/forms and &#64;angular/router RxJS v7.8.1 or newer A package manager of your choice — npm, yarn or pnpm Already using PrimeNG? Do not follow this page. The migration guide covers moving an existing PrimeNG v21 workspace across with the migrate-from-primeng schematic, which is a separate command from the ng add below.

## Provider-

Add provideOptimus to the list of providers in your app.config.ts and use the theme property to configure a theme such as Aura.

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideOptimus } from '@openng/optimus-ui/config';
import Aura from '@openng/optimus-ui-themes/aura';

export const appConfig: ApplicationConfig = {
    providers: [
        provideOptimus({
            theme: {
                preset: Aura
            }
        })
    ]
};
```

## Verify-

Verify your setup by adding a component such as Button. Each component can be imported and registered individually so that you only include what you use for bundle optimization. Import path is available in the documentation of the corresponding component.

## Versioncompatibility-

Each Optimus UI major targets a single Angular major. Install the version matching your workspace, and see the update guide when moving to a newer one.

