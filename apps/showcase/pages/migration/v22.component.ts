import { AppDoc } from '@/components/doc/app.doc';
import { BreakingDoc } from '@/doc/migration/v22/breakingdoc';
import { DeprecationsDoc } from '@/doc/migration/v22/deprecationsdoc';
import { WhatsNewDoc } from '@/doc/migration/v22/whatsnewdoc';
import { Component } from '@angular/core';

@Component({
    imports: [AppDoc],
    standalone: true,
    template: `<app-doc docTitle="Migration - PrimeNG v22" header="Migration to v22" description="Migration guide to PrimeNG v22." [docs]="docs" docType="page"></app-doc>`
})
export class v22MigrationDemoComponent {
    docs = [
        {
            id: 'whatsnew',
            label: "What's New",
            component: WhatsNewDoc
        },
        {
            id: 'breakingchanges',
            label: 'Breaking Changes',
            component: BreakingDoc
        },
        {
            id: 'deprecations',
            label: 'Deprecations',
            component: DeprecationsDoc
        }
    ];
}
