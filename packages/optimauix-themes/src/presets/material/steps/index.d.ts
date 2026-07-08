import type { StepsTokenSections } from '@primeuix/themes/types/steps';

export * from '@primeuix/themes/types/steps';

declare const root: StepsTokenSections.Root;
declare const separator: StepsTokenSections.Separator;
declare const itemLink: StepsTokenSections.ItemLink;
declare const itemLabel: StepsTokenSections.ItemLabel;
declare const itemNumber: StepsTokenSections.ItemNumber;
declare const css: StepsTokenSections.CSS;
declare const _default: {
    root: StepsTokenSections.Root;
    separator: StepsTokenSections.Separator;
    itemLink: StepsTokenSections.ItemLink;
    itemLabel: StepsTokenSections.ItemLabel;
    itemNumber: StepsTokenSections.ItemNumber;
    css: string;
};

export { css, _default as default, itemLabel, itemLink, itemNumber, root, separator };
