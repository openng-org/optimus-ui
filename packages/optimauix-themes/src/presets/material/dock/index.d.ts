import type { DockTokenSections } from '@primeuix/themes/types/dock';

export * from '@primeuix/themes/types/dock';

declare const root: DockTokenSections.Root;
declare const item: DockTokenSections.Item;
declare const css: DockTokenSections.CSS;
declare const _default: {
    root: DockTokenSections.Root;
    item: DockTokenSections.Item;
    css: string;
};

export { css, _default as default, item, root };
