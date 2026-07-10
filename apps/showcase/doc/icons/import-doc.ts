import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Code } from '@/domain/code';
import { Component } from '@angular/core';

@Component({
    selector: 'basic-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCode, AppCode],
    template: `
        <app-docsectiontext>
            <p>Each icon is a standalone Angular component. Import them individually for optimal tree-shaking, or use the named exports from the package root, then add them to the <i>imports</i> array of your standalone component.</p>
        </app-docsectiontext>
        <app-code [code]="code" [hideToggleCode]="true"></app-code>
    `
})
export class ImportDoc {
    code: Code = {
        typescript: `
// Tree-shakeable, per-icon imports (recommended)
import { Search } from '@primeicons/angular/search';
import { User } from '@primeicons/angular/user';

// Named imports from the package root
import { Search, User, Check } from '@primeicons/angular';
`
    };
}
