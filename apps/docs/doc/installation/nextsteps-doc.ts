import { Component } from '@angular/core';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'nextsteps-doc',
    standalone: true,
    imports: [AppDocSectionText, RouterModule],
    template: `
        <app-docsectiontext>
            <p>Once you have Optimus UI up and running, we recommend exploring the following resources to gain a deeper understanding of the library.</p>
            <ul class="leading-relaxed">
                <li><a [routerLink]="'/configuration'" class="doc-link">Global configuration</a></li>
                <li><a [routerLink]="'/theming/styled'" class="doc-link">Styled mode</a> and <a [routerLink]="'/theming/unstyled'" class="doc-link">unstyled mode</a></li>
                <li><a [routerLink]="'/tailwind'" class="doc-link">Tailwind CSS integration</a></li>
                <li><a [routerLink]="'/passthrough'" class="doc-link">Pass Through</a> for direct access to the underlying elements</li>
                <li><a [routerLink]="'/philosophy'" class="doc-link">Philosophy</a> — what this project promises, and what it does not</li>
                <li><a [routerLink]="'/faq'" class="doc-link">FAQ</a></li>
            </ul>
        </app-docsectiontext>
    `
})
export class NextStepsDoc {}
