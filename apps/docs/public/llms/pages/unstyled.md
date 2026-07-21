# Unstyled Mode

Theming Optimus UI with alternative styling approaches.

## Architecture-

The term unstyled is used to define an alternative styling approach instead of the default theming with design tokens. In unstyled mode the css variables of the design tokens and the css rule sets that utilize them are not included. Here is an example of an Unstyled Select, the core functionality and accessibility is provided whereas styling is not included.

## Example-

Unstyled components require styling using your preferred approach. We recommend using Tailwind CSS with PassThrough attributes, a combination that works seamlessly together. The tailwindcss-primeui even provides special variants such as p-outlined: , p-vertical for the Optimus UI components. The example below demonstrates how to style a button component with Tailwind CSS using PassThrough attributes. Before you begin, refer to the pass through section in the button documentation to familiarize yourself with the component's internal structure and PassThrough attributes. In this example, we'll target the root , label and icon elements to apply custom styles.

## Global-

A global configuration can be created at application level to avoid repetition via the global pt option so that the styles can be shared from a single location. A particular component can still override a global configuration with its own pt property.

```typescript
import { ApplicationConfig } from '@angular/core';

export const appConfig: ApplicationConfig = {
    providers: [
        provideOptimus({
            unstyled: true,
            pt: {
                button: {
                    root: 'bg-teal-500 hover:bg-teal-700 active:bg-teal-900 cursor-pointer py-2 px-4 rounded-full border-0 flex gap-2',
                    label: 'text-white font-bold text-lg',
                    icon: 'text-white !text-xl'
                }
            }
        })
    ]
};
```

## Setup-

Unstyled mode is enabled for the whole suite by enabling unstyled option during Optimus UI installation. Alternatively even in the default styled mode, a particular component can still be used as unstyled by adding the unstyled prop of the component.

