import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Component } from '@angular/core';

@Component({
    selector: 'philosophy-limits-doc',
    standalone: true,
    imports: [AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>Naming the limits is what makes the commitments above worth anything. Here is what Optimus UI is not.</p>
            <h3>There is no commercial support</h3>
            <p>
                No SLA, no support contract, no guaranteed response time. Issues and discussions are answered by volunteers when they have time. If your organisation needs contractual guarantees, this project cannot provide them and you should plan
                accordingly.
            </p>
            <h3>There are no premium templates, blocks or design tooling</h3>
            <p>
                PrimeTek's application templates, block library and visual theme designer are their commercial products. They are not part of what was MIT licensed, so they are not part of this fork and will not be reimplemented. Theming here means
                editing preset objects in code, which is documented in full.
            </p>
            <h3>We are not chasing feature parity with PrimeNG v22 and beyond</h3>
            <p>
                PrimeNG continues under its own license and its own roadmap. Optimus UI diverges from v21 forward. Some things they add, we will not have. Some things we fix, they will not. Treat the two as separate libraries that share an ancestor,
                not as a free copy of a paid product.
            </p>
            <h3>The bus factor is real</h3>
            <p>
                This is maintained by a small group of people in their own time. We would rather say that plainly than imply a larger organisation stands behind it. The best way to change that number is to
                <a href="https://github.com/openng-org/optimus-ui" target="_blank" rel="noopener noreferrer">contribute</a>.
            </p>
        </app-docsectiontext>
    `
})
export class PhilosophyLimitsDoc {}
