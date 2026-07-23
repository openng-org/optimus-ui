import { AutomatedDoc } from '@/doc/migration/primeng/automated-doc';
import { ManualDoc } from '@/doc/migration/primeng/manual-doc';
import { OverviewDoc } from '@/doc/migration/primeng/overview-doc';
import { PrerequisitesDoc } from '@/doc/migration/primeng/prerequisites-doc';
import { SchematicDetailsDoc } from '@/doc/migration/primeng/schematic-details-doc';
import { VerifyDoc } from '@/doc/migration/primeng/verify-doc';
import { Component } from '@angular/core';
import { AppDoc } from '@/components/doc/app.doc';

@Component({
    standalone: true,
    imports: [AppDoc],
    template: `<app-doc docTitle="Migrate from PrimeNG - Optimus UI" header="Migrate from PrimeNG" description="Moving a PrimeNG v21 application to Optimus UI." [docs]="docs" docType="page"></app-doc>`
})
export class MigrationPrimengDemo {
    docs = [
        {
            id: 'overview',
            label: 'Overview',
            component: OverviewDoc
        },
        {
            id: 'prerequisites',
            label: 'Prerequisites',
            component: PrerequisitesDoc
        },
        {
            id: 'automated',
            label: 'Automated Migration',
            component: AutomatedDoc
        },
        {
            id: 'schematic',
            label: 'What the Schematic Does',
            component: SchematicDetailsDoc
        },
        {
            id: 'manual',
            label: 'Manual Migration',
            component: ManualDoc
        },
        {
            id: 'verify',
            label: 'Verify',
            component: VerifyDoc
        }
    ];
}
