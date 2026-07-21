import { Component } from '@angular/core';
import { BenefitsDoc } from '@/doc/contribution/benefits-doc';
import { IntroductionDoc } from '@/doc/contribution/introduction-doc';
import { HelpNeededDoc } from '@/doc/contribution/helpneeded-doc';
import { PathwayDoc } from '@/doc/contribution/pathway-doc';
import { AppDoc } from '@/components/doc/app.doc';

@Component({
    standalone: true,
    imports: [AppDoc],
    template: ` <app-doc docTitle="Contribution - Optimus UI" header="Contribution Guide" description="Welcome to the Optimus UI Contribution Guide and thank you for considering contributing." [docs]="docs"></app-doc> `
})
export class ContributionDemo {
    docs = [
        {
            id: 'introduction',
            label: 'Introduction',
            component: IntroductionDoc
        },
        {
            id: 'helpneeded',
            label: 'Help Needed',
            component: HelpNeededDoc
        },
        {
            id: 'pathway',
            label: 'Pathway',
            component: PathwayDoc
        },
        {
            id: 'benefits',
            label: 'Benefits',
            component: BenefitsDoc
        }
    ];
}
