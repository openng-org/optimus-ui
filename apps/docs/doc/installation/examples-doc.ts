import { Component } from '@angular/core';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'examples-doc',
    standalone: true,
    imports: [AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                Every example in this documentation opens in StackBlitz from the code toolbar above each demo, already wired up with the current version. The
                <a href="https://github.com/openng-org/optimus-ui" target="_blank" rel="noopener noreferrer">source repository</a> is the reference for how the library itself is built and consumed.
            </p>
        </app-docsectiontext>
    `
})
export class ExamplesDoc {}
