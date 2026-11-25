import { AppDoc } from '@/components/doc/app.doc';
import { DesignMarketplaceDoc } from '@/doc/ecosystem/designmarketplace-doc';
import { EcosystemSubmitDoc } from '@/doc/ecosystem/submit-doc';
import { Component } from '@angular/core';

@Component({
    selector: 'ecosystem-demo',
    standalone: true,
    imports: [AppDoc],
    template: `
        <app-doc
            docTitle="Community Projects - Optimus UI"
            header="Community Projects"
            description="Tools and projects built around Optimus UI by the community. They are not maintained or reviewed by OpenNG — check each project's license and maintenance status before depending on it."
            [docs]="docs"
            docType="page"
        ></app-doc>
    `
})
export class EcosystemDemo {
    docs = [
        {
            id: 'design-marketplace',
            label: 'Design Marketplace',
            component: DesignMarketplaceDoc
        },
        {
            id: 'submit',
            label: 'Add Your Project',
            component: EcosystemSubmitDoc
        }
    ];
}
