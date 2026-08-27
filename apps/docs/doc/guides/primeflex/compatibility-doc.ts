import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Component } from '@angular/core';

@Component({
    selector: 'compatibility-doc',
    standalone: true,
    imports: [AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                If you are staying on PrimeFlex for now, Optimus UI v1 pairs with PrimeFlex v4 — the same combination that worked with PrimeNG v18 and newer, since the styling architecture is unchanged. PrimeFlex v3 targeted the older PrimeNG
                releases and is not a supported pairing here.
            </p>
            <p>Neither version is tested against Optimus UI releases, so treat this as "should work", not as a supported configuration. The migration below is the path we actually maintain.</p>
        </app-docsectiontext>
    `
})
export class CompatibilityDoc {}
