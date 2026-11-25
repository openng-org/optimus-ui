## Breaking change: `IconField`

- **Removed**: `styleClass` input (deprecated, the host's own `[class]` binding already merges with a native `class`/`[class]` attribute on the element).

  **Before**
  ```html
  <p-iconfield styleClass="my-field"></p-iconfield>
  ```

  **After**
  ```html
  <p-iconfield class="my-field"></p-iconfield>
  ```

  This is a 1:1 attribute rename and is handled by the `styleclass-to-class` schematic, including the conflict case where an element already binds both `styleClass` and `class`/`[class]`.

- **Removed**: `$pcIconField` property (dead — nothing in the library read it; it only exposed a parent `IconField` injected through the private `ICONFIELD_INSTANCE` token, which was removed with it).

  **Before**
  ```ts
  const parent = iconField.$pcIconField;
  ```

  **After**

  Delete the usage; `IconField` no longer exposes its parent icon field and there is no direct replacement. A component or directive placed inside an `IconField` that needs the instance can inject `PARENT_INSTANCE` from `@openng/optimus-ui/basecomponent` (without `skipSelf`), but this is not an equivalent of `$pcIconField`, which pointed at an icon field enclosing another icon field. Usages are rare and need manual judgment, so this is not suited to an automated codemod.

- **Changed**: `hostName` and `iconPosition` are now signal inputs. Template bindings (`[iconPosition]="x"`, `iconPosition="x"`) are unchanged, but reading them from code now requires a call, including inside `pt` callbacks that receive `instance`.

  **Before**
  ```ts
  pt = { root: ({ instance }) => ({ class: instance.iconPosition === 'right' ? 'is-right' : '' }) };
  ```

  **After**
  ```ts
  pt = { root: ({ instance }) => ({ class: instance.iconPosition() === 'right' ? 'is-right' : '' }) };
  ```

  Reads on an `IconField` instance (`.iconPosition` → `.iconPosition()`) are a candidate for a `ts-morph` codemod, but the receiver's type must be resolved first, so a plain text search-and-replace is unsafe.
