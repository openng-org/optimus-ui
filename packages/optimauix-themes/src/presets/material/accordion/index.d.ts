import type { StyleOptions } from '@primeuix/styled';
import type { AccordionTokenSections } from '@primeuix/themes/types/accordion';

export * from '@primeuix/themes/types/accordion';

declare const root: AccordionTokenSections.Root;
declare const panel: AccordionTokenSections.Panel;
declare const header: AccordionTokenSections.Header;
declare const content: AccordionTokenSections.Content;
declare const css: AccordionTokenSections.CSS;
declare const _default: {
    root: AccordionTokenSections.Root;
    panel: AccordionTokenSections.Panel;
    header: AccordionTokenSections.Header;
    content: AccordionTokenSections.Content;
    css: (options: StyleOptions) => string;
};

export { content, css, _default as default, header, panel, root };
