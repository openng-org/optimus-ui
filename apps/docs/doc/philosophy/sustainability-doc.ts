import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'philosophy-sustainability-doc',
    standalone: true,
    imports: [AppDocSectionText, RouterModule],
    template: `
        <app-docsectiontext>
            <p>
                The honest answer to "how is this funded" is: it mostly is not. OpenNG covers the hosting and the domain; the work is volunteered. That is a fragile arrangement, and it is the main risk to this project — larger than any technical risk
                we can see today.
            </p>
            <p>The things that actually help, roughly in order of impact:</p>
            <ul class="leading-relaxed">
                <li>Reproducing and triaging issues. A bug with a minimal reproduction is several times more likely to get fixed.</li>
                <li>Sending pull requests, especially for issues labelled <i>help-needed</i>.</li>
                <li>Answering questions in discussions, so the same answer is not written five times.</li>
                <li>Improving this documentation. Every page has a source file and every fix is welcome.</li>
                <li>Telling your employer you depend on it. Sponsored maintenance time is worth more than any one-off donation.</li>
            </ul>
            <p>The <a [routerLink]="'/contribution'" class="doc-link">contribution guide</a> covers how to get started.</p>
        </app-docsectiontext>
    `
})
export class PhilosophySustainabilityDoc {}
