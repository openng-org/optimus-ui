## Breaking change: `Textarea`

- **Removed**: `$pcTextarea` property (dead — nothing in the library read it; it only exposed a parent `Textarea` injected through the private `TEXTAREA_INSTANCE` token, which was removed with it).

  **Before**
  ```ts
  const parent = textarea.$pcTextarea;
  ```

  **After**

  Delete the usage; `Textarea` no longer exposes its parent textarea and there is no direct replacement. A component or directive placed inside a `Textarea` that needs the instance can inject `PARENT_INSTANCE` from `@openng/optimus-ui/basecomponent` (without `skipSelf`), but this is not an equivalent of `$pcTextarea`, which pointed at a textarea enclosing another textarea. Usages are rare and need manual judgment, so this is not suited to an automated codemod.

- **Changed**: `autoResize` and `pSize` are now signal inputs, and `hasFluid` is now a `computed()`. Template bindings (`[autoResize]="x"`, `autoResize`) are unchanged, but reading them from code now requires a call, including inside `pt` callbacks that receive `instance`.

  **Before**
  ```ts
  pt = { root: ({ instance }) => ({ class: instance.autoResize ? 'is-resizable' : '' }) };
  const size = textarea.pSize;
  ```

  **After**
  ```ts
  pt = { root: ({ instance }) => ({ class: instance.autoResize() ? 'is-resizable' : '' }) };
  const size = textarea.pSize();
  ```

  Reads on a `Textarea` instance (`.pSize` → `.pSize()`) are a candidate for a `ts-morph` codemod, but the receiver's type must be resolved first, so a plain text search-and-replace is unsafe.
