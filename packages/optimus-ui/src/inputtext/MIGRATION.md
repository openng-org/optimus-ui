## Breaking change: `InputText`

- **Removed**: `$pcInputText` property (dead — nothing in the library read it; it only exposed a parent `InputText` injected through the private `INPUTTEXT_INSTANCE` token, which was removed with it). Note this is unrelated to the `pcInputText` pass-through section name used by other components such as `InputNumber`/`AutoComplete`/`DatePicker` to style their nested `InputText` element — that is untouched.

  **Before**
  ```ts
  const parent = inputText.$pcInputText;
  ```

  **After**

  Delete the usage; `InputText` no longer exposes its parent input and there is no direct replacement. A component or directive placed inside an `InputText` that needs the instance can inject `PARENT_INSTANCE` from `@openng/optimus-ui/basecomponent` (without `skipSelf`), but this is not an equivalent of `$pcInputText`, which pointed at an input text enclosing another input text. Usages are rare and need manual judgment, so this is not suited to an automated codemod.

- **Changed**: `hostName`, `pSize` are now signal inputs, and `hasFluid`, `dataP` are now `computed()`. Template bindings (`[pSize]="x"`, `pSize="x"`) are unchanged, but reading them from code now requires a call, including inside `pt` callbacks that receive `instance`.

  **Before**
  ```ts
  pt = { root: ({ instance }) => ({ class: instance.hasFluid ? 'is-fluid' : '' }) };
  const size = inputText.pSize;
  ```

  **After**
  ```ts
  pt = { root: ({ instance }) => ({ class: instance.hasFluid() ? 'is-fluid' : '' }) };
  const size = inputText.pSize();
  ```

  Reads on an `InputText` instance (`.pSize` → `.pSize()`) are a candidate for a `ts-morph` codemod, but the receiver's type must be resolved first, so a plain text search-and-replace is unsafe.
