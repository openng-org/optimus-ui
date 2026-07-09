import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'ci-pipeline-doc',
    standalone: true,
    imports: [AppDocSectionText, RouterLink],
    changeDetection: ChangeDetectionStrategy.Eager,
    template: `<app-docsectiontext>
        <p>
            Theme Designer offers an API that can be utilized to implement continuos integration pipelines to automate figma to theme code generation whenever you push updates to the repository from Figma. Visit the
            <a routerLink="/designer/ci">CI Pipeline</a> documentation for comprehensive information.
        </p>
    </app-docsectiontext>`
})
export class CIPipelineDoc {}
