import { GITHUB_REPO_URL } from '@/utils/constants';
import { Component } from '@angular/core';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'examples-doc',
    standalone: true,
    imports: [AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>An example starter with Angular CLI is available at <a href="{{ GITHUB_REPO_URL }}-examples">GitHub</a>.</p>
        </app-docsectiontext>
    `
})
export class ExamplesDoc {
    GITHUB_REPO_URL = GITHUB_REPO_URL;
}
