import { Code } from '@/domain/code';
import { Component } from '@angular/core';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { AppCode } from '@/components/doc/app.code';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'verify-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCode, RouterModule],
    template: `
        <app-docsectiontext>
            <p>
                Build the application and run your test suite to confirm the migration. Searching the project for the old package names is a quick way to find anything left behind. The schematic scans for the same pattern when it prints its leftover
                report.
            </p>
            <app-code [code]="code" [hideToggleCode]="true"></app-code>
            <p>Once verified, see <a [routerLink]="'/migration/update'" class="doc-link">Updating Optimus UI</a> when you're ready to move to a newer major.</p>
        </app-docsectiontext>
    `
})
export class VerifyDoc {
    code: Code = {
        command: `ng build

grep -riEn "primeng|primeicons|@primeuix" src/`
    };
}
