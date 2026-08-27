import { AppDoc } from '@/components/doc/app.doc';
import { PhilosophyGovernanceDoc } from '@/doc/philosophy/governance-doc';
import { PhilosophyLimitsDoc } from '@/doc/philosophy/limits-doc';
import { PhilosophyOriginDoc } from '@/doc/philosophy/origin-doc';
import { PhilosophyPromisesDoc } from '@/doc/philosophy/promises-doc';
import { PhilosophySustainabilityDoc } from '@/doc/philosophy/sustainability-doc';
import { PhilosophyTrademarkDoc } from '@/doc/philosophy/trademark-doc';
import { Component } from '@angular/core';

@Component({
    standalone: true,
    imports: [AppDoc],
    template: `<app-doc docTitle="Philosophy - Optimus UI" header="Philosophy" description="Why Optimus UI exists, what it commits to, and where it stops." [docs]="docs" docType="page"></app-doc>`
})
export class PhilosophyDemo {
    docs = [
        {
            id: 'origin',
            label: 'Why This Fork Exists',
            component: PhilosophyOriginDoc
        },
        {
            id: 'promises',
            label: 'What We Commit To',
            component: PhilosophyPromisesDoc
        },
        {
            id: 'limits',
            label: 'What We Do Not Do',
            component: PhilosophyLimitsDoc
        },
        {
            id: 'governance',
            label: 'How Decisions Are Made',
            component: PhilosophyGovernanceDoc
        },
        {
            id: 'trademark',
            label: 'PrimeNG and PrimeTek',
            component: PhilosophyTrademarkDoc
        },
        {
            id: 'sustainability',
            label: 'Sustainability',
            component: PhilosophySustainabilityDoc
        }
    ];
}
