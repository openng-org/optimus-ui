import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Component } from '@angular/core';

@Component({
    selector: 'philosophy-origin-doc',
    standalone: true,
    imports: [AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                In June 2026 PrimeTek archived the PrimeNG repository and moved future major versions, starting with v22, to a commercial license. They explained their reasoning in
                <a href="https://primeui.dev/nextchapter" target="_blank" rel="noopener noreferrer">their own announcement</a>, and it is worth reading. Maintaining a component library of this size for a decade, largely for free, is genuinely hard,
                and we do not think the decision was made lightly.
            </p>
            <p>It did, however, leave a lot of applications on a library with no further open source releases. Optimus UI exists for those applications. It is a community fork of the last MIT licensed version of PrimeNG, v21, and it stays MIT.</p>
            <p>This is not an official fork and it is not endorsed by PrimeTek. It is a separate repository, seeded with PrimeNG's code and history, maintained by people who depend on it.</p>
        </app-docsectiontext>
    `
})
export class PhilosophyOriginDoc {}
