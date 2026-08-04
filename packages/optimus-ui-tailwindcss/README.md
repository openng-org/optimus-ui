<div align="center">
  <img src="https://optimus.openng.org/large-icon.svg" alt="Optimus UI" width="140" />
</div>

# @openng/optimus-ui-tailwindcss

Tailwind CSS utilities for [Optimus UI](https://github.com/openng-org/optimus-ui) — first-class integration between Optimus UI theming and Tailwind CSS, plus the animation utilities missing from core Tailwind.

This package ships two libraries: a CSS package compatible with Tailwind CSS v4, and a JS plugin for Tailwind CSS v3.

## Installation

```bash
npm install @openng/optimus-ui-tailwindcss
```

## Tailwind CSS v4

In the CSS file that contains the `tailwindcss` import, add the import for this package as well.

```css
@import 'tailwindcss';
@import '@openng/optimus-ui-tailwindcss';
```

## Tailwind CSS v3

Use the `plugins` option in your Tailwind config file.

```js
import OptimusUiTailwind from '@openng/optimus-ui-tailwindcss';

export default {
    // ...
    plugins: [OptimusUiTailwind]
};
```

## Features

- Semantic color utilities backed by the Optimus UI theme (e.g. `bg-primary`, `text-surface-500`, `text-muted-color`) that work in both styled and unstyled modes.
- Animation utilities: `animate-*` keyframes, duration, delay, direction, fill-mode, iteration, play-state, timing-function, and enter/leave helpers.
- Variants such as `p-dark` for dark-mode styling of Optimus UI components.

See the [Optimus UI Tailwind documentation](https://github.com/openng-org/optimus-ui) for usage details.
