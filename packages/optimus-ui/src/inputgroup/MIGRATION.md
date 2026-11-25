## Breaking change: `InputGroup`

- **Removed**: `styleClass` input (deprecated since v20.0.0; the native `class` attribute replaces it, and Angular merges it with the component's host classes).

  **Before**
  ```html
  <p-inputgroup styleClass="my-group"></p-inputgroup>
  <p-inputgroup [styleClass]="myClass"></p-inputgroup>
  ```

  **After**
  ```html
  <p-inputgroup class="my-group"></p-inputgroup>
  <p-inputgroup [class]="myClass"></p-inputgroup>
  ```

  This is a 1:1 attribute rename and is automated by the `styleclass-to-class` migration (`ng update`), which now covers `p-inputgroup`/`p-inputGroup`/`p-input-group` (including the canonical `bind-styleClass` binding form). A tag that already has its own `[class]`/`bind-class` binding next to `[styleClass]`/`bind-styleClass` is reported for manual review instead of being rewritten.

- **Removed**: `$pcInputGroup` property (dead — nothing in the library read it; it only exposed a parent `InputGroup` injected through the private `INPUTGROUP_INSTANCE` token, which was removed with it).

  **Before**
  ```ts
  const parent = inputGroup.$pcInputGroup;
  ```

  **After**

  Delete the usage; `InputGroup` no longer exposes its parent input group and there is no direct replacement. A component or directive placed inside an `InputGroup` that needs the input group instance can inject `PARENT_INSTANCE` from `@openng/optimus-ui/basecomponent` (without `skipSelf`), but this is not an equivalent of `$pcInputGroup`, which pointed at an input group enclosing another input group. Usages are rare and need manual judgment, so this is not suited to an automated codemod.
