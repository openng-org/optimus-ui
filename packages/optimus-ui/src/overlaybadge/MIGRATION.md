## Breaking change: `OverlayBadge`

- **Removed**: `size` input (deprecated, replacement `badgeSize` already existed; it only logged a console deprecation warning and had no effect on rendering).

  **Before**
  ```html
  <p-overlay-badge size="large"></p-overlay-badge>
  ```

  **After**
  ```html
  <p-overlay-badge badgeSize="large"></p-overlay-badge>
  ```

  This is a 1:1 attribute rename and is a good candidate for an automated codemod, since it's a straight rename with no merge/conflict cases to handle (unlike the `styleClass`-to-`class` migrations elsewhere in this library).

- **Removed**: `$pcOverlayBadge` property (dead — nothing in the library read it; it only exposed a parent `OverlayBadge` injected through the private `OVERLAYBADGE_INSTANCE` token, which was removed with it).

  **Before**
  ```ts
  const parent = overlayBadge.$pcOverlayBadge;
  ```

  **After**

  Delete the usage; `OverlayBadge` no longer exposes its parent overlay badge and there is no direct replacement. A component or directive placed inside an `OverlayBadge` that needs the instance can inject `PARENT_INSTANCE` from `@openng/optimus-ui/basecomponent` (without `skipSelf`), but this is not an equivalent of `$pcOverlayBadge`, which pointed at an overlay badge enclosing another overlay badge. Usages are rare and need manual judgment, so this is not suited to an automated codemod.

- **Changed**: `styleClass`, `style`, `badgeSize`, `severity`, `value` and `badgeDisabled` are now signal inputs. Template bindings (`[value]="x"`, `value="x"`) are unchanged, but reading them from code now requires a call, including inside `pt` callbacks that receive `instance`.

  **Before**
  ```ts
  pt = { root: ({ instance }) => ({ class: instance.badgeDisabled ? 'is-disabled' : '' }) };
  const value = overlayBadge.value;
  ```

  **After**
  ```ts
  pt = { root: ({ instance }) => ({ class: instance.badgeDisabled() ? 'is-disabled' : '' }) };
  const value = overlayBadge.value();
  ```

  Reads on an `OverlayBadge` instance (`.value` → `.value()`) are a candidate for a `ts-morph` codemod, but the receiver's type must be resolved first, so a plain text search-and-replace is unsafe.
