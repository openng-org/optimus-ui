import { Component } from '@angular/core';
import { AutoFocusModule } from '@openng/optimus-ui/autofocus';
import { InputTextModule } from '@openng/optimus-ui/inputtext';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'basic-doc',
    standalone: true,
    imports: [AutoFocusModule, InputTextModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>AutoFocus is applied to any focusable input element with the <i>pAutoFocus</i> directive.</p>
        </app-docsectiontext>
        <div class="card flex justify-center">
            <input type="text" pInputText [pAutoFocus]="true" placeholder="Automatically focused" />
        </div>
        <app-code></app-code>
    `
})
export class BasicDoc {}
