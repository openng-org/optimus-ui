import { GITHUB_DISCUSSIONS_URL } from '@/utils/constants';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Component } from '@angular/core';

@Component({
    selector: 'ecosystem-submit-doc',
    standalone: true,
    imports: [AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                Built something for Optimus UI — a tool, a theme collection, a library or an app worth learning from? Share it in the
                <a [href]="showAndTellUrl" target="_blank" rel="noopener noreferrer">Show and tell</a> category of GitHub Discussions. Projects that are open source, work with the current major version and are actively maintained can be listed here.
            </p>
        </app-docsectiontext>
    `
})
export class EcosystemSubmitDoc {
    readonly showAndTellUrl = `${GITHUB_DISCUSSIONS_URL}/categories/show-and-tell`;
}
