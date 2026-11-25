## Breaking change: `BlockUI`

- **Removed**: `styleClass` input (deprecated, the host's own `[class]` binding already merges with a native `class`/`[class]` attribute on the element).

  **Before**
  ```html
  <p-blockui styleClass="my-blockui"></p-blockui>
  ```

  **After**
  ```html
  <p-blockui class="my-blockui"></p-blockui>
  ```

  This is a 1:1 attribute rename and is handled by the `styleclass-to-class` schematic, including the conflict case where an element already binds both `styleClass` and `class`/`[class]`.

- **Removed**: `$pcBlockUI` property (dead — nothing in the library read it; it only exposed a parent `BlockUI` injected through the private `BLOCKUI_INSTANCE` token, which was removed with it).

  **Before**
  ```ts
  const parent = blockUI.$pcBlockUI;
  ```

  **After**

  Delete the usage; `BlockUI` no longer exposes its parent block and there is no direct replacement. A component or directive placed inside a `BlockUI` that needs the instance can inject `PARENT_INSTANCE` from `@openng/optimus-ui/basecomponent` (without `skipSelf`), but this is not an equivalent of `$pcBlockUI`, which pointed at a block UI enclosing another block UI. Usages are rare and need manual judgment, so this is not suited to an automated codemod.

- **Changed**: `target`, `autoZIndex`, `baseZIndex`, and `blocked` are now signal inputs. Template bindings (`[blocked]="x"`, `blocked`) are unchanged, but reading them from code now requires a call, including inside `pt` callbacks that receive `instance`. `blocked` previously had a getter that returned the component's own internal blocked state rather than the raw bound value; that internal state is still readable, now as the separate `_blocked` signal.

  **Before**
  ```ts
  pt = { root: ({ instance }) => ({ class: instance.blocked ? 'is-blocked' : '' }) };
  const zIndex = blockUI.baseZIndex;
  ```

  **After**
  ```ts
  pt = { root: ({ instance }) => ({ class: instance.blocked() ? 'is-blocked' : '' }) };
  const zIndex = blockUI.baseZIndex();
  ```

  Reads on a `BlockUI` instance (`.baseZIndex` → `.baseZIndex()`) are a candidate for a `ts-morph` codemod, but the receiver's type must be resolved first, so a plain text search-and-replace is unsafe.
