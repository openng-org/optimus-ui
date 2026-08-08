<div align="center">
  <img src="https://optimus.openng.org/large-icon.svg" alt="Optimus UI" width="140" />
</div>

# @openng/optimus-ui-styles

Core style definitions and CSS utilities for [Optimus UI](https://github.com/openng-org/optimus-ui).

This package contains the base CSS architectural patterns and component-specific style definitions used across the Optimus UI ecosystem. It leverages design tokens for highly customizable and consistent styling.

## Features

- **Component Styles**: Comprehensive CSS definitions for over 80+ UI components.
- **Design Token Integration**: Styles are powered by `dt()` (design token) functions for seamless theming.
- **Modular Architecture**: Styles are organized by component, allowing for lean bundles and targeted imports.
- **Framework Agnostic Core**: While optimized for Angular via Optimus UI, the core CSS logic is highly reusable.

## Installation

```bash
npm install @openng/optimus-ui-styles
```

## Core Concepts

### Style Definitions
Each component has its styles defined using standard CSS syntax, enhanced with design tokens. 

Example of a button style fragment:
```css
.p-button {
    background: dt('button.primary.background');
    color: dt('button.primary.color');
    border-radius: dt('button.border.radius');
    transition: background dt('button.transition.duration');
}
```

### Design Tokens (`dt`)
The `dt()` function is used within the style strings to reference theme-specific values. These tokens are resolved at runtime by the `@openng/optimus-ui-styled` engine.

## Usage in Optimus UI

This package is a core dependency of `@openng/optimus-ui`. Component styles are exported as named constants (e.g., `ButtonStyle`, `DataTableStyle`) and are automatically consumed by the component library to inject necessary styles into the DOM.

## License

MIT
