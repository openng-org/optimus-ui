## Breaking change: `InputIcon`

- **Removed**: `styleClass` input (deprecated, the host's own `[class]` binding already merges with a native `class`/`[class]` attribute on the element).

  **Before**
  ```html
  <p-inputicon styleClass="my-icon"></p-inputicon>
  ```

  **After**
  ```html
  <p-inputicon class="my-icon"></p-inputicon>
  ```

  This is a 1:1 attribute rename and is handled by the `styleclass-to-class` schematic, including the conflict case where an element already binds both `styleClass` and `class`/`[class]`.

- **Removed**: `$pcInputIcon` property (dead — nothing in the library read it; it only exposed a parent `InputIcon` injected through the private `INPUTICON_INSTANCE` token, which was removed with it).

  **Before**
  ```ts
  const parent = inputIcon.$pcInputIcon;
  ```

  **After**

  Delete the usage; `InputIcon` no longer exposes its parent input icon and there is no direct replacement. A component or directive placed inside an `InputIcon` that needs the instance can inject `PARENT_INSTANCE` from `@openng/optimus-ui/basecomponent` (without `skipSelf`), but this is not an equivalent of `$pcInputIcon`, which pointed at an input icon enclosing another input icon. Usages are rare and need manual judgment, so this is not suited to an automated codemod.

- **Changed**: `hostName` is now a signal input. Template bindings are unchanged, but reading it from code now requires a call, including inside `pt` callbacks that receive `instance`.

  **Before**
  ```ts
  pt = { root: ({ instance }) => ({ 'data-host': instance.hostName }) };
  ```

  **After**
  ```ts
  pt = { root: ({ instance }) => ({ 'data-host': instance.hostName() }) };
  ```

  Reads on an `InputIcon` instance (`.hostName` → `.hostName()`) are a candidate for a `ts-morph` codemod, but the receiver's type must be resolved first, so a plain text search-and-replace is unsafe.
