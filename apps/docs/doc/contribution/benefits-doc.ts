import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'benefits-doc',
    standalone: true,
    imports: [RouterModule, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                Contributing to Optimus UI comes with several benefits. Being part of an open-source project will enhance your career and open up exciting opportunities. You'll gain significant visibility in the developer community while improving
                yourself as a professional.
            </p>
        </app-docsectiontext>
    `
})
export class BenefitsDoc {}
