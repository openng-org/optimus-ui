import type { AccordionTokenSections } from '@primeuix/themes/types/accordion';

export * from '@primeuix/themes/types/accordion';

declare const root: AccordionTokenSections.Root;
declare const panel: AccordionTokenSections.Panel;
declare const header: AccordionTokenSections.Header;
declare const content: AccordionTokenSections.Content;
declare const _default: {
    root: AccordionTokenSections.Root;
    panel: AccordionTokenSections.Panel;
    header: AccordionTokenSections.Header;
    content: AccordionTokenSections.Content;
};

export { content, _default as default, header, panel, root };
