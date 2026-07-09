import { PROJECT_NAME } from '@/utils/constants';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'scale-doc',
    standalone: true,
    imports: [AppCode, AppDocSectionText],
    changeDetection: ChangeDetectionStrategy.Eager,
    template: `
        <app-docsectiontext>
            <p>
                {{ PROJECT_NAME }} UI component use <i>rem</i> units, 1rem equals to the font size of the <i>html</i> element which is <i>16px</i> by default. Use the root font-size to adjust the size of the components globally. This website uses
                <i>14px</i> as the base so it may differ from your application if your base font size is different.
            </p>
        </app-docsectiontext>
        <app-code [code]="code" [hideToggleCode]="true"></app-code>
    `
})
export class ScaleDoc {
    PROJECT_NAME = PROJECT_NAME;

    code = {
        typescript: `html {
    font-size: 14px;
}`
    };
}
