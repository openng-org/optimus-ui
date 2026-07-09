import { PROJECT_NAME } from '@/utils/constants';
import { DownloadDoc } from '@/doc/installation/download-doc';
import { ExamplesDoc } from '@/doc/installation/examples-doc';
import { NextStepsDoc } from '@/doc/installation/nextsteps-doc';
import { ProviderDoc } from '@/doc/installation/provider-doc';
import { VerifyDoc } from '@/doc/installation/verify-doc';
import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AppDoc } from '@/components/doc/app.doc';

@Component({
    standalone: true,
    imports: [CommonModule, AppDoc],
    changeDetection: ChangeDetectionStrategy.Eager,
    template: `<app-doc docTitle="Getting Started - {{ PROJECT_NAME }}" header="Installation" description="Setting up {{ PROJECT_NAME }} in an Angular CLI project." [docs]="docs" docType="page"></app-doc>`
})
export class InstallationDemo {
    PROJECT_NAME = PROJECT_NAME;

    docs = [
        {
            id: 'download',
            label: 'Download',
            component: DownloadDoc
        },
        {
            id: 'provider',
            label: 'Provider',
            component: ProviderDoc
        },
        {
            id: 'verify',
            label: 'Verify',
            component: VerifyDoc
        },
        {
            id: 'examples',
            label: 'Example',
            component: ExamplesDoc
        },
        {
            id: 'nextsteps',
            label: 'Next Steps',
            component: NextStepsDoc
        } /*,
        {
            id: 'videos',
            label: 'Videos',
            component: VideosDoc,
        },*/
    ];
}
