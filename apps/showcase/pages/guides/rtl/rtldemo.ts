import { PROJECT_NAME } from '@/utils/constants';
import { ConfigurationDoc } from '@/doc/guides/rtl/configuration-doc';
import { LimitationsDoc } from '@/doc/guides/rtl/limitations-doc';
import { Component } from '@angular/core';
import { AppDoc } from '@/components/doc/app.doc';

@Component({
    selector: 'rtl-demo',
    standalone: true,
    imports: [AppDoc],
    template: `<app-doc title="RTL Support" header="RTL Support" description="Right-to-left direction support of {{ PROJECT_NAME }}." [docs]="docs" docType="page"></app-doc>`
})
export class RTLDemoComponent {
    PROJECT_NAME = PROJECT_NAME;

    docs = [
        {
            id: 'configuration',
            label: 'Configuration',
            component: ConfigurationDoc
        },
        {
            id: 'limitations',
            label: 'Limitations',
            component: LimitationsDoc
        }
    ];
}
