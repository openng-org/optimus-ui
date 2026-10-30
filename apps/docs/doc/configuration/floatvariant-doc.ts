import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Code } from '@/domain/code';
import { Component } from '@angular/core';

@Component({
    selector: 'floatvariant-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCode],
    template: `
        <app-docsectiontext>
            <p>Three float label styles are available for input fields, (<i>over</i>, <i>on</i>, and <i>in</i>). The name of each option specifies where the label element will float relative to its input's top border. The default is <i>over</i>.</p>
        </app-docsectiontext>
        <app-code [code]="code" [hideToggleCode]="true"></app-code>
    `
})
export class FloatVariantDoc {
    code: Code = {
        typescript: `provideOptimus({
    floatVariant: 'over' 
})`
    };
}
