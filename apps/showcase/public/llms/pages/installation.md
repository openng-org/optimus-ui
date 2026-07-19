# Installation

Setting up Optimus UI in an Angular CLI project.

## Download-

Optimus UI is available for download on the npm registry .

```bash
# Using npm
npm install @openng/optimus-ui @openng/optimus-ui-themes

# Using yarn
yarn add @openng/optimus-ui @openng/optimus-ui-themes

# Using pnpm
pnpm add @openng/optimus-ui @openng/optimus-ui-themes
```

## Examples-

An example starter with Angular CLI is available at GitHub .

## Nextsteps-

Welcome to the Prime UI Ecosystem! Once you have Optimus UI up and running, we recommend exploring the following resources to gain a deeper understanding of the library. Global configuration Customization of styles

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

## Theme-

Configure Optimus UI to use a theme like Aura.

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideOptimus } from '@openng/optimus-ui/config';
import Aura from '@openng/optimus-ui-themes/aura';

export const appConfig: ApplicationConfig = {
    providers: [
        provideAnimationsAsync(),
        provideOptimus({
            theme: Aura
        })
    ]
};
```

## Verify-

Verify your setup by adding a component such as Button. Each component can be imported and registered individually so that you only include what you use for bundle optimization. Import path is available in the documentation of the corresponding component.

## Videos

Angular CLI is the recommended way to build Angular applications with Optimus UI.

