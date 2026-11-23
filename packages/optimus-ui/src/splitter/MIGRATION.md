## Breaking change: `Splitter`

- **Removed**: `styleClass` input (deprecated since v20; the native `class` attribute replaces it, and Angular merges it with the component's host classes).

  **Before**
  ```html
  <p-splitter styleClass="my-splitter"></p-splitter>
  <p-splitter [styleClass]="myClass"></p-splitter>
  ```

  **After**
  ```html
  <p-splitter class="my-splitter"></p-splitter>
  <p-splitter [class]="myClass"></p-splitter>
  ```

  This is a 1:1 attribute rename and is automated by the `styleclass-to-class` migration (`ng update`), which now covers `p-splitter`. A tag that already has its own `[class]` binding next to `[styleClass]` is reported for manual review instead of being rewritten.

- **Removed**: `$pcSplitter` property (dead — nothing in the library read it; it only exposed a parent `Splitter` injected through the private `SPLITTER_INSTANCE` token, which was removed with it).

  **Before**
  ```ts
  const parent = splitter.$pcSplitter;
  ```

  **After**

  Delete the usage; `Splitter` no longer exposes its parent splitter and there is no direct replacement. Usages are rare and need manual judgment, so this is not suited to an automated codemod.

- **Changed**: `panelStyleClass`, `panelStyle`, `stateStorage`, `stateKey`, `layout`, `gutterSize`, `step`, `minSizes` and `panelSizes` are now signal inputs. Template bindings (`[layout]="x"`, `layout="x"`) are unchanged, but reading them from code now requires a call, including inside `pt` callbacks that receive `instance`. `panelSizes` is no longer a getter/setter: `splitter.panelSizes()` returns the bound value, not the current (possibly resized or restored) sizes. The sizes of the rendered panels are rebuilt from `panelSizes` (or the stored state) whenever it changes or the number of rendered panels changes, and always total 100. A `0` entry is now kept (it used to fall back to an equal share). Missing entries share the remainder: `[60]` with two panels becomes `[60, 40]`, and `[20]` with three panels becomes `[20, 40, 40]` (it used to be `[20, 33.3, 33.3]`). If the known sizes already total 100 or more, missing panels get an equal share and the others shrink proportionally, so a panel added to `[50, 50]` gives `[33.3, 33.3, 33.3]`. The same applies to a panel added since the state was stored. While fewer panels render than `panelSizes` lists, the rendered panels are scaled to total 100; the listed sizes apply once all panels render. Adding or removing a panel therefore resets a previous drag; a `gutterSize` change keeps the dragged sizes. Resizing no longer writes into the array bound to `[panelSizes]`; take the current sizes from the `sizes` of the `onResizeStart`/`onResizeEnd` events instead.

  **Before**
  ```ts
  pt = { root: ({ instance }) => ({ class: instance.layout === 'vertical' ? 'stacked' : '' }) };
  const sizes = splitter.panelSizes;
  ```

  **After**
  ```ts
  pt = { root: ({ instance }) => ({ class: instance.layout() === 'vertical' ? 'stacked' : '' }) };
  ```
  ```html
  <p-splitter [panelSizes]="[50, 50]" (onResizeEnd)="sizes = $event.sizes"></p-splitter>
  ```

- **Changed**: the internal state members `panels`, `dragging`, `size`, `gutterElement`, `startPos`, `prevPanelElement`, `nextPanelElement`, `prevPanelSize`, `nextPanelSize`, `prevPanelIndex`, `timer`, `prevSize` and the `mouseMoveListener`/`mouseUpListener`/`touchMoveListener`/`touchEndListener` handles are now signals; `horizontal`, `isStateful`, `gutterStyle` and `dataP` are now `computed()` (call syntax unchanged for the first three, `dataP` → `dataP()`). The `onAfterContentInit`, `onAfterViewInit` and `onAfterViewChecked` methods were removed; panels are derived from the content queries, and panel sizes are applied after render whenever the panels, `panelSizes` or `gutterSize` change (panels added later are now sized too).

  Reads on a `Splitter` instance (`.dragging` → `.dragging()`) are a candidate for a `ts-morph` codemod, but the receiver's type must be resolved first, so a plain text search-and-replace is unsafe.
