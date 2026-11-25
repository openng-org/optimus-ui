## Breaking change: `ToggleButton`

- **Removed**: `styleClass` input (deprecated since v20; the native `class` attribute replaces it, and Angular merges it with the component's host classes).

  **Before**
  ```html
  <p-togglebutton styleClass="my-toggle"></p-togglebutton>
  <p-togglebutton [styleClass]="myClass"></p-togglebutton>
  ```

  **After**
  ```html
  <p-togglebutton class="my-toggle"></p-togglebutton>
  <p-togglebutton [class]="myClass"></p-togglebutton>
  ```

  This is a 1:1 attribute rename and is automated by the `styleclass-to-class` migration (`ng update`), which now covers `p-togglebutton`, `p-toggleButton` and `p-toggle-button`. A tag that already has its own `[class]` binding next to `[styleClass]` is reported for manual review instead of being rewritten.

- **Removed**: `autofocus` and `inputId` inputs (dead — they were declared but never read: the button was never focused on load and never received an `id` from them).

  **Before**
  ```html
  <p-togglebutton autofocus inputId="notifications" [(ngModel)]="checked"></p-togglebutton>
  ```

  **After**
  ```html
  <p-togglebutton [(ngModel)]="checked"></p-togglebutton>
  ```

  Removing the `[autofocus]`/`[inputId]` bindings and a static `inputId` attribute changes nothing at runtime. A static `autofocus` attribute is also native HTML, so the browser may still have focused the (focusable) toggle button on load through it; if you rely on that, keep `autofocus` as a plain attribute after the migration (it no longer binds to an input, so it still compiles). This is automated by the `remove-dead-inputs` migration (`ng update`) for all three selectors. Programmatic usages are not reported, since both names are inputs on many other components; a remaining `toggleButton.autofocus`/`toggleButton.inputId` read fails to compile and can be deleted.

- **Removed**: `$pcToggleButton` property (dead — nothing in the library read it; it only exposed a parent `ToggleButton` injected through the private `TOGGLEBUTTON_INSTANCE` token, which was removed with it).

  **Before**
  ```ts
  const parent = toggleButton.$pcToggleButton;
  ```

  **After**

  Delete the usage; `ToggleButton` no longer exposes its parent toggle button and there is no direct replacement. Usages are rare and need manual judgment, so this is not suited to an automated codemod.

- **Removed**: `onBlur()` method (dead — nothing bound or called it; the control is marked as touched when it is toggled).

  **Before**
  ```ts
  toggleButton.onBlur();
  ```

  **After**

  Delete the call. To mark the bound form control as touched, call `markAsTouched()` on the control itself.

- **Changed**: `onLabel`, `offLabel`, `onIcon`, `offIcon`, `ariaLabel`, `ariaLabelledBy`, `tabindex`, `iconPos`, `size` and `allowEmpty` are now signal inputs. Template bindings (`[onLabel]="x"`, `onLabel="x"`) are unchanged, but reading them from code now requires a call, including inside `pt` callbacks that receive `instance`. `size` now also accepts `undefined` for the default size.

  **Before**
  ```ts
  pt = { root: ({ instance }) => ({ class: instance.checked ? 'is-on' : 'is-off' }) };
  const label = toggleButton.onLabel;
  ```

  **After**
  ```ts
  pt = { root: ({ instance }) => ({ class: instance.checked() ? 'is-on' : 'is-off' }) };
  const label = toggleButton.onLabel();
  ```

- **Changed**: `checked` is now a signal; `hasOnLabel`, `hasOffLabel`, `active` and `dataP` are now `computed()` (`toggleButton.checked` → `toggleButton.checked()`). The `onInit`, `onAfterContentInit` and `onAfterViewChecked` methods were removed; templates projected with `pTemplate` are read from the content query.

  Reads on a `ToggleButton` instance (`.checked` → `.checked()`) are a candidate for a `ts-morph` codemod, but the receiver's type must be resolved first, so a plain text search-and-replace is unsafe.
