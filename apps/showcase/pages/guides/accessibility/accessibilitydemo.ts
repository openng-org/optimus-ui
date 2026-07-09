import { PROJECT_NAME } from '@/utils/constants';
import { AppDoc } from '@/components/doc/app.doc';
import { ColorsDoc } from '@/doc/guides/accessibility/colors-doc';
import { FormControlsDoc } from '@/doc/guides/accessibility/formcontrols-doc';
import { IntroductionDoc } from '@/doc/guides/accessibility/introduction-doc';
import { SemanticHTMLDoc } from '@/doc/guides/accessibility/semantichtml-doc';
import { WAIARIADoc } from '@/doc/guides/accessibility/waiaria-doc';
import { WCAGDoc } from '@/doc/guides/accessibility/wcag-doc';
import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'accessibility',
    standalone: true,
    imports: [AppDoc],
    changeDetection: ChangeDetectionStrategy.Eager,
    template: `<app-doc
        docTitle="Accessibility - {{ PROJECT_NAME }}"
        header="Accessibility"
        description="{{ PROJECT_NAME }} targets AA level compliance on WCAG specification, refer to the accessibility documentation of each component for detailed information."
        [docs]="docs"
        docType="page"
    ></app-doc>`
})
export class AccessibilityDemoComponent {
    PROJECT_NAME = PROJECT_NAME;

    docs = [
        {
            id: 'introduction',
            label: 'Introduction',
            component: IntroductionDoc
        },
        {
            id: 'wcag',
            label: 'WCAG',
            component: WCAGDoc
        },
        {
            id: 'form-controls',
            label: 'Form Controls',
            component: FormControlsDoc
        },
        {
            id: 'semantic-html',
            label: 'Semantic HTML',
            component: SemanticHTMLDoc
        },
        {
            id: 'wai-aria',
            label: 'WAI-ARIA',
            component: WAIARIADoc
        },
        {
            id: 'colors',
            label: 'Colors',
            component: ColorsDoc
        }
    ];
}
