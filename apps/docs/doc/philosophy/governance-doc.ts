import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'philosophy-governance-doc',
    standalone: true,
    imports: [AppDocSectionText, RouterModule],
    template: `
        <app-docsectiontext>
            <p>
                Everything happens in the open, in the <a href="https://github.com/openng-org/optimus-ui" target="_blank" rel="noopener noreferrer">repository</a>. There is no private roadmap and no internal issue tracker. What you see in the issues,
                the discussions and the <a [routerLink]="'/roadmap'" class="doc-link">roadmap</a> is the whole plan.
            </p>
            <p>
                Contributors earn commit access by contributing — the <a [routerLink]="'/contribution'" class="doc-link">contribution guide</a> describes the Contributor and Committer roles and roughly what it takes to reach them. We would rather
                grow the number of people who can merge a fix than route everything through one person.
            </p>
            <p>
                Breaking changes are avoided within a major and documented when a major requires them. Where we inherited a name that no longer fits — the CSS cascade layer, the package scope, the icon library — we changed it once, at v1, with a
                migration schematic, rather than dripping renames across releases.
            </p>
        </app-docsectiontext>
    `
})
export class PhilosophyGovernanceDoc {}
