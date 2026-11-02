## Breaking change: `Avatar`

- **Removed**: `styleClass` input (deprecated since v20.0.0; the native `class` attribute replaces it, and Angular merges it with the component's host classes).

  **Before**
  ```html
  <p-avatar label="JD" styleClass="my-avatar"></p-avatar>
  <p-avatar label="JD" [styleClass]="myClass"></p-avatar>
  ```

  **After**
  ```html
  <p-avatar label="JD" class="my-avatar"></p-avatar>
  <p-avatar label="JD" [class]="myClass"></p-avatar>
  ```

  This is a 1:1 attribute rename and is automated by the `styleclass-to-class` migration (`ng update`), which now covers `p-avatar`. A tag that already has its own `[class]` binding next to `[styleClass]` is reported for manual review instead of being rewritten.

- **Removed**: `$pcAvatar` property (dead — nothing in the library read it; it only exposed a parent `Avatar` injected through the private `AVATAR_INSTANCE` token, which was removed with it).

  **Before**
  ```ts
  const parent = avatar.$pcAvatar;
  ```

  **After**

  Delete the usage; `Avatar` no longer exposes its parent avatar and there is no direct replacement. A component or directive placed inside an `Avatar` that needs the avatar instance can inject `PARENT_INSTANCE` from `@openng/optimus-ui/basecomponent` (without `skipSelf`), but this is not an equivalent of `$pcAvatar`, which pointed at an avatar enclosing another avatar. Usages are rare and need manual judgment, so this is not suited to an automated codemod.

- **Changed**: `label`, `icon`, `image`, `size`, `shape`, `ariaLabel` and `ariaLabelledBy` are now signal inputs. Template bindings (`[label]="x"`, `label="x"`) are unchanged, but reading them from code now requires a call, including inside `pt` callbacks that receive `instance`. `dataP` is now a `computed()`.

  **Before**
  ```ts
  pt = { root: ({ instance }) => ({ class: instance.size === 'large' ? 'big' : '' }) };
  const label = avatar.label;
  ```

  **After**
  ```ts
  pt = { root: ({ instance }) => ({ class: instance.size() === 'large' ? 'big' : '' }) };
  const label = avatar.label();
  ```

  Reads on an `Avatar` instance (`.label` → `.label()`) are a candidate for a `ts-morph` codemod, but the receiver's type must be resolved first, so a plain text search-and-replace is unsafe.
