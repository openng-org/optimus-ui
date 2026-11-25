## Breaking change: `Tooltip`

- **Removed**: `ptTooltip` input (deprecated; `pTooltipPT` replaces it and takes the same value).

  **Before**
  ```html
  <button pTooltip="Save" [ptTooltip]="tooltipPt"></button>
  ```

  **After**
  ```html
  <button pTooltip="Save" [pTooltipPT]="tooltipPt"></button>
  ```

  This is a 1:1 attribute rename and a good candidate for a codemod. The existing `ng update` input migrations only match element selectors (`<p-xxx`), not attribute directives such as `[pTooltip]`, so it is not automated yet and has to be renamed by hand.

- **Removed**: `$pcTooltip` property (dead — nothing in the library read it; it only exposed a parent `Tooltip` injected through the private `TOOLTIP_INSTANCE` token, which was removed with it).

  **Before**
  ```ts
  const parent = tooltip.$pcTooltip;
  ```

  **After**

  Delete the usage; `Tooltip` no longer exposes its parent tooltip and there is no direct replacement. Usages are rare and need manual judgment, so this is not suited to an automated codemod.

- **Removed**: `$appendTo`, `styleClass` and `rootPTClasses` properties (dead — never read by the directive; the overlay target is still resolved from the `appendTo` input or `tooltipOptions.appendTo`, falling back to `'body'`).

  **Before**
  ```ts
  const target = tooltip.$appendTo();
  ```

  **After**
  ```ts
  const target = tooltip.getOption('appendTo');
  ```

- **Changed**: `tooltipPosition`, `tooltipEvent`, `positionStyle`, `tooltipStyleClass`, `tooltipZIndex`, `escape`, `showDelay`, `hideDelay`, `life`, `positionTop`, `positionLeft`, `autoHide`, `fitContent`, `hideOnEscape`, `showOnEllipsis`, `content` (`pTooltip`), `disabled` (`tooltipDisabled`) and `tooltipOptions` are now signal inputs. Template bindings (`pTooltip="x"`, `[tooltipOptions]="x"`, `showDelay="500"`) are unchanged, but reading them from code now requires a call, including inside `pt` callbacks that receive `instance`. `disabled` is no longer a getter/setter and is `undefined` until `tooltipDisabled` is bound.

  **Before**
  ```ts
  pt = { root: ({ instance }) => ({ class: instance.tooltipPosition === 'top' ? 'above' : '' }) };
  const label = tooltip.content;
  ```

  **After**
  ```ts
  pt = { root: ({ instance }) => ({ class: instance.tooltipPosition() === 'top' ? 'above' : '' }) };
  const label = tooltip.content();
  ```

- **Changed**: input changes reach the tooltip options at the next change detection flush instead of while the binding is written, so a `tooltipDisabled` or `pTooltip` change hides or updates an open tooltip at that point. Binding `undefined` to an input without a transform (`tooltipPosition`, `tooltipZIndex`, `positionStyle`, `tooltipStyleClass`, `appendTo`, `tooltipOptions`) on the first render no longer overwrites the option default, so `[tooltipZIndex]="undefined"` keeps `'auto'`. Boolean and number inputs bound to `undefined` still resolve to `false`/`NaN` through their transforms, as before.

- **Changed**: the internal state members `_tooltipOptions`, `container`, `tooltipText`, `showTimeout`, `hideTimeout`, `active`, `interactionInProgress`, `pointerInside`, `scrollHandler`, `resizeListener` and the `mouseEnterListener`/`mouseLeaveListener`/`containerMouseleaveListener`/`clickListener`/`focusListener`/`blurListener`/`touchStartListener`/`touchEndListener`/`documentTouchListener`/`documentEscapeListener` handles are now signals; `isAutoHide` is now a `computed()` (call syntax unchanged). `setOption()` and `getOption()` keep working as before. The `onChanges` and `onAfterViewInit` methods were removed; listeners are bound once after the first render.

  Reads on a `Tooltip` instance (`.container` → `.container()`) are a candidate for a `ts-morph` codemod, but the receiver's type must be resolved first, so a plain text search-and-replace is unsafe.
