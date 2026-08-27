import { AppDoc } from '@/components/doc/app.doc';
import { FaqEcosystemDoc } from '@/doc/faq/ecosystem-doc';
import { FaqMigrationDoc } from '@/doc/faq/migration-doc';
import { FaqProjectDoc } from '@/doc/faq/project-doc';
import { FaqSupportDoc } from '@/doc/faq/support-doc';
import { Component } from '@angular/core';

@Component({
    standalone: true,
    imports: [AppDoc],
    template: `<app-doc docTitle="FAQ - Optimus UI" header="Frequently Asked Questions" description="Licensing, migration from PrimeNG, the ecosystem, and how support works." [docs]="docs" docType="page"></app-doc>`
})
export class FaqDemo {
    docs = [
        {
            id: 'project',
            label: 'The Project',
            component: FaqProjectDoc
        },
        {
            id: 'migration',
            label: 'Compatibility & Migration',
            component: FaqMigrationDoc
        },
        {
            id: 'ecosystem',
            label: 'Themes, Icons & Ecosystem',
            component: FaqEcosystemDoc
        },
        {
            id: 'support',
            label: 'Support & Contributing',
            component: FaqSupportDoc
        }
    ];
}
