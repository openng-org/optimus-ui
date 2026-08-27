import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'faq-project-doc',
    standalone: true,
    imports: [AppDocSectionText, RouterModule],
    template: `
        <app-docsectiontext>
            <h3>Is Optimus UI free? Will it stay free?</h3>
            <p>
                Yes, and yes. Every package is MIT licensed, and the code we forked was MIT too, so relicensing it is not something we could do even if we wanted to. There is no paid tier and none is planned. The
                <a [routerLink]="'/philosophy'" class="doc-link">philosophy page</a> goes into what that does and does not buy you.
            </p>

            <h3>Is this an official PrimeNG fork? Are you affiliated with PrimeTek?</h3>
            <p>
                No. Optimus UI is an independent community fork, not affiliated with, endorsed by, or sponsored by PrimeTek. It is a separate repository seeded with PrimeNG's MIT licensed code and history, not a fork of the archived
                <i>primefaces/primeng</i> repository.
            </p>

            <h3>Which PrimeNG version is this forked from?</h3>
            <p>PrimeNG v21, the last version published under the MIT license. Optimus UI v1 is that codebase, rebranded, with the fixes that have landed since.</p>

            <h3>Who maintains it, and how is it funded?</h3>
            <p>
                A small group of volunteers, with OpenNG covering hosting and the domain. We are deliberate about not implying more than that — see
                <a [routerLink]="'/philosophy'" class="doc-link">sustainability</a> for the honest version and the ways that can change.
            </p>

            <h3>Why did the name change?</h3>
            <p>
                Trademark. PrimeNG, PrimeFaces and PrimeFlex are PrimeTek's marks, so the packages, the CSS cascade layer and the icon library all needed new names. That is also why the rename is handled by a schematic rather than by asking you to
                rewrite imports by hand.
            </p>
        </app-docsectiontext>
    `
})
export class FaqProjectDoc {}
