import { Component } from '@angular/core';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'examples-doc',
    standalone: true,
    imports: [AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>An example starter with Angular CLI is available at <a href="https://github.com/openng-org/optimus-ui">GitHub</a>.</p>
        </app-docsectiontext>
    `
})
export class ExamplesDoc {}
