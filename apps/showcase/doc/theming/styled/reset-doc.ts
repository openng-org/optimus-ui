import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Component } from '@angular/core';

@Component({
    selector: 'reset-doc',
    standalone: true,
    imports: [AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                In case Optimus UI components have visual issues in your application, a Reset CSS may be the culprit. CSS layers would be an efficient solution that involves enabling the Optimus UI layer, wrapping the Reset CSS in another layer and
                defining the layer order. This way, your Reset CSS does not get in the way of Optimus UI components.
            </p>
        </app-docsectiontext>
        <app-code [code]="code" [hideToggleCode]="true"></app-code>
    `
})
export class ResetDoc {
    code = {
        typescript: `/* Order */
@layer reset, optimus;

/* Reset CSS */
@layer reset {
    button,
    input {
        /* CSS to Reset */
    }
}`
    };
}
