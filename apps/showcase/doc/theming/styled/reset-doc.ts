import { PROJECT_NAME } from '@/utils/constants';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'reset-doc',
    standalone: true,
    imports: [AppCode, AppDocSectionText],
    changeDetection: ChangeDetectionStrategy.Eager,
    template: `
        <app-docsectiontext>
            <p>
                In case {{ PROJECT_NAME }} components have visual issues in your application, a Reset CSS may be the culprit. CSS layers would be an efficient solution that involves enabling the {{ PROJECT_NAME }} layer, wrapping the Reset CSS in
                another layer and defining the layer order. This way, your Reset CSS does not get in the way of {{ PROJECT_NAME }} components.
            </p>
        </app-docsectiontext>
        <app-code [code]="code" [hideToggleCode]="true"></app-code>
    `
})
export class ResetDoc {
    PROJECT_NAME = PROJECT_NAME;

    code = {
        typescript: `/* Order */
@layer reset, primeng;

/* Reset CSS */
@layer reset {
    button,
    input {
        /* CSS to Reset */
    }
}`
    };
}
