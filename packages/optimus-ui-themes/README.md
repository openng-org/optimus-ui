<div align="center">
  <img src="https://optimus.openng.org/large-icon.svg" alt="Optimus UI" width="140" />
</div>

# @openng/optimus-ui-themes

Official themes and presets for [Optimus UI](https://github.com/openng-org/optimus-ui).

This package contains a collection of professionally designed themes and presets for Optimus UI, powered by the core engine in `@openng/optimus-ui-styled`. It includes design tokens, component styles, and various aesthetic flavors to jumpstart your project.

## Features

- **Standard Presets**: Built-in presets including Aura, Lara, Nora, and Material.
- **Design Tokens**: Comprehensive set of tokens for colors, spacing, typography, and more.
- **Component Themes**: Fine-grained styling for over 80+ Optimus UI components.
- **Extensible**: Easily extend or customize existing presets to match your brand.
- **Typed Definitions**: Full TypeScript support for all theme configurations and tokens.

## Installation

```bash
npm install @openng/optimus-ui-themes
```

## Core Presets

Optimus UI Themes comes with several curated presets:

- **Aura**: A modern, sleek design with a focus on whitespace and clarity.
- **Lara**: A versatile and clean aesthetic, suitable for a wide range of applications.
- **Nora**: A distinct look with unique design choices for modern interfaces.
- **Material**: Follows Material Design principles for a familiar and functional UI.

## Usage

### Using a Preset

You can apply a preset globally using the `definePreset` utility:

```typescript
import { definePreset } from '@openng/optimus-ui-themes';
import Aura from '@openng/optimus-ui-themes/aura';

const MyPreset = definePreset(Aura, {
    semantic: {
        primary: {
            50: '{blue.50}',
            100: '{blue.100}',
            // ...
            950: '{blue.950}'
        }
    }
});
```

### Direct Token Access

Access design tokens directly for use in your own styled components:

```typescript
import { tokens } from '@openng/optimus-ui-themes/tokens';

const primaryColor = tokens['primary.color'];
```

## Usage in Optimus UI

This package is the primary source of themes for `@openng/optimus-ui`. It provides the visual layer that brings components to life. Use this package when you want to switch between official themes or create a custom theme based on one of the existing presets.

## License

MIT
