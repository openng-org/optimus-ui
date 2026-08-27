<div align="center">
  <img src="https://optimus.openng.org/large-icon.svg" alt="Optimus UI" width="140" />
</div>

# @openng/optimus-ui-motion

Motion and animation utilities for [Optimus UI](https://github.com/openng-org/optimus-ui).

This package provides a programmatic way to manage CSS transitions and animations within the Optimus UI ecosystem. It offers a robust API for controlling motion lifecycles, handling dynamic dimensions, and ensuring accessibility.

## Features

- **Programmatic Motion**: Create and control motion instances for any DOM element.
- **Lifecycle Hooks**: Comprehensive hooks for `before`, `start`, `after`, and `cancelled` stages of both enter and leave phases.
- **Auto-Dimensions**: Built-in support for smoothly animating to/from `auto` height and width.
- **Accessibility**: Respects user's `prefers-reduced-motion` settings out of the box.
- **Configurable**: Flexible options for durations, easing types, and custom CSS class names.
- **Lightweight**: Zero dependencies (other than internal utilities) and optimized for performance.

## Installation

```bash
npm install @openng/optimus-ui-motion
```

## Core Concepts

### createMotion
The primary entry point to create a motion instance for a target element.

```typescript
import { createMotion } from '@openng/optimus-ui-motion';

const motion = createMotion(element, {
    name: 'my-fade',
    enter: true,
    leave: true
});

// Trigger phases
await motion.enter();
await motion.leave();
```

### Motion Options
Fine-tune the behavior with detailed configuration:
- `name`: Base prefix for CSS classes (e.g., `p-` -> `p-enter-active`).
- `duration`: Control timing for enter and leave phases independently.
- `autoHeight` / `autoWidth`: Enable automatic dimension calculation for smooth transitions to variable content sizes.
- `hooks`: Attach logic to specific points in the animation timeline.

### Lifecycle Hooks
Stay in sync with your animations:
- `onBeforeEnter` / `onBeforeLeave`
- `onEnter` / `onLeave`
- `onAfterEnter` / `onAfterLeave`

## Usage in Optimus UI

This package is a core dependency of `@openng/optimus-ui`, powering the animations found in overlays, transitions, and interactive components. It can also be used independently to add standard-compliant motion to custom Angular components.

## License

MIT
