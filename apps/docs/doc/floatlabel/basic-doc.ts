import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { FloatLabelModule } from '@openng/optimus-ui/floatlabel';
import { InputTextModule } from '@openng/optimus-ui/inputtext';

@Component({
    selector: 'basic-doc',
    standalone: true,
    imports: [FormsModule, AppCode, AppDocSectionText, FloatLabelModule, InputTextModule],
    template: `
        <app-docsectiontext>
            <p>FloatLabel is used by wrapping the input and its label.</p>
        </app-docsectiontext>
        <div class="card flex justify-center">
            <p-floatlabel>
                <input id="username" pInputText [(ngModel)]="value" autocomplete="off" />
                <label for="username">Username</label>
            </p-floatlabel>
        </div>
        <app-code></app-code>
    `
})
export class BasicDoc {
    value: string | undefined;
}
