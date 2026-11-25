## Breaking change: `InputGroupAddon`

- **Removed**: `$pcInputGroupAddon` property (dead — nothing in the library read it; it only exposed a parent `InputGroupAddon` injected through the private `INPUTGROUPADDON_INSTANCE` token, which was removed with it).

  **Before**
  ```ts
  const parent = addon.$pcInputGroupAddon;
  ```

  **After**

  Delete the usage; `InputGroupAddon` no longer exposes its parent addon and there is no direct replacement. A component or directive placed inside an `InputGroupAddon` that needs the addon instance can inject `PARENT_INSTANCE` from `@openng/optimus-ui/basecomponent` (without `skipSelf`), but this is not an equivalent of `$pcInputGroupAddon`, which pointed at an addon enclosing another addon. Usages are rare and need manual judgment, so this is not suited to an automated codemod.

- **Changed**: `style` and `styleClass` are now signal inputs. Template bindings (`[style]="x"`, `[styleClass]="x"`) are unchanged, but reading them from code now requires a call, including inside `pt` callbacks that receive `instance`. The `@HostBinding('style')` getter was replaced by a direct host `[style]` binding with the same effect.

  **Before**
  ```ts
  pt = { root: ({ instance }) => ({ class: instance.styleClass ? 'has-class' : '' }) };
  const style = addon.style;
  ```

  **After**
  ```ts
  pt = { root: ({ instance }) => ({ class: instance.styleClass() ? 'has-class' : '' }) };
  const style = addon.style();
  ```

  Reads on an `InputGroupAddon` instance (`.style` → `.style()`, `.styleClass` → `.styleClass()`) are a candidate for a `ts-morph` codemod, but the receiver's type must be resolved first, so a plain text search-and-replace is unsafe.
