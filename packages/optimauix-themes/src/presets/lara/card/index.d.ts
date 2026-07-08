import type { CardTokenSections } from '@primeuix/themes/types/card';

export * from '@primeuix/themes/types/card';

declare const root: CardTokenSections.Root;
declare const body: CardTokenSections.Body;
declare const caption: CardTokenSections.Caption;
declare const title: CardTokenSections.Title;
declare const subtitle: CardTokenSections.Subtitle;
declare const _default: {
    root: CardTokenSections.Root;
    body: CardTokenSections.Body;
    caption: CardTokenSections.Caption;
    title: CardTokenSections.Title;
    subtitle: CardTokenSections.Subtitle;
};

export { body, caption, _default as default, root, subtitle, title };
