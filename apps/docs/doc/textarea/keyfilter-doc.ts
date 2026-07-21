import { Component } from '@angular/core';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { KeyFilterModule } from '@openng/optimus-ui/keyfilter';
import { TextareaModule } from '@openng/optimus-ui/textarea';

@Component({
    selector: 'keyfilter-doc',
    standalone: true,
    imports: [AppCode, AppDocSectionText, KeyFilterModule, TextareaModule],
    template: `
        <app-docsectiontext>
            <p>InputText has built-in key filtering support to block certain keys, refer to <a href="/keyfilter">keyfilter</a> page for more information.</p>
        </app-docsectiontext>
        <div class="card flex justify-center">
            <textarea pKeyFilter="int" rows="5" cols="30" pTextarea></textarea>
        </div>
        <app-code></app-code>
    `
})
export class KeyfilterDoc {}
