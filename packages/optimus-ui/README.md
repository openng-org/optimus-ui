<div align="center">
  <h1>Optimus UI</h1>
  <p><strong>A rich set of open-source UI Components for Angular</strong></p>

  <p>
    <a href="https://www.npmjs.com/package/@openng/optimus-ui">
      <img src="https://img.shields.io/npm/v/@openng/optimus-ui.svg" alt="npm version">
    </a>
    <a href="https://www.npmjs.com/package/@openng/optimus-ui">
      <img src="https://img.shields.io/npm/dm/@openng/optimus-ui.svg" alt="npm downloads">
    </a>
    <a href="https://github.com/openng-org/optimus-ui/blob/main/LICENSE">
      <img src="https://img.shields.io/npm/l/@openng/optimus-ui.svg" alt="License">
    </a>
  </p>
</div>

---

Optimus UI is a comprehensive library of open-source UI Components for Angular applications. Designed for flexibility and enterprise-readiness, it provides a powerful foundation for building modern web interfaces.

## 📦 Installation

Optimus UI provides an Angular CLI schematic for quick and easy installation. This will automatically install the package and configure your project.

Please note that Optimus UI requires **Angular 21+**.

```bash
ng add @openng/optimus-ui
```

## 🚀 Quick Start

Optimus UI components can be imported as standalone components or via their respective modules. Here is a quick example demonstrating how to use the `Button` component:

1. Import the component module in your application:

```typescript
import { Component } from '@angular/core';
import { ButtonModule } from '@openng/optimus-ui/button';

@Component({
  selector: 'app-root',
  imports: [ButtonModule],
  template: `<p-button label="Click Me!" />`
})
export class AppComponent {}
```

## 📖 Documentation

For detailed documentation, interactive component demos, theming guides, and more, please visit the official website:

**[Optimus UI Documentation](https://optimus.openng.org/)**


## 🤝 Contributing

We welcome and appreciate contributions from the community! If you're interested in helping improve Optimus UI, please take a look at our [Contributing Guide](https://github.com/openng-org/optimus-ui/blob/main/CONTRIBUTING.md) for instructions on how to get started.

## 📄 License

Optimus UI is licensed under the [MIT License](https://github.com/openng-org/optimus-ui/blob/main/LICENSE.md).
