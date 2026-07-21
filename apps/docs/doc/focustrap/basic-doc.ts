import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { AutoFocusModule } from '@openng/optimus-ui/autofocus';
import { ButtonModule } from '@openng/optimus-ui/button';
import { CheckboxModule } from '@openng/optimus-ui/checkbox';
import { FocusTrapModule } from '@openng/optimus-ui/focustrap';
import { IconFieldModule } from '@openng/optimus-ui/iconfield';
import { InputIconModule } from '@openng/optimus-ui/inputicon';
import { InputTextModule } from '@openng/optimus-ui/inputtext';

@Component({
    selector: 'basic-doc',
    standalone: true,
    imports: [FormsModule, AppCode, AppDocSectionText, AutoFocusModule, ButtonModule, CheckboxModule, FocusTrapModule, IconFieldModule, InputIconModule, InputTextModule],
    template: `
        <app-docsectiontext>
            <p>FocusTrap is applied to a container element with the <i>pFocusTrap</i> directive.</p>
        </app-docsectiontext>
        <div class="card flex justify-center">
            <div pFocusTrap class="w-full sm:w-80 flex flex-col gap-6">
                <p-iconfield>
                    <p-inputicon>
                        <i class="pi pi-user"></i>
                    </p-inputicon>
                    <input type="text" pInputText id="input" [(ngModel)]="name" type="text" placeholder="Name" [pAutoFocus]="true" [fluid]="true" />
                </p-iconfield>

                <p-iconfield>
                    <p-inputicon>
                        <i class="pi pi-envelope"> </i>
                    </p-inputicon>
                    <input type="text" pInputText id="email" [(ngModel)]="email" type="email" placeholder="Email" [fluid]="true" />
                </p-iconfield>

                <div class="flex items-center gap-2">
                    <p-checkbox id="accept" [(ngModel)]="accept" name="accept" value="Accept" />
                    <label for="accept">I agree to the terms and conditions.</label>
                </div>

                <p-button type="submit" label="Submit" class="mt-2" styleClass="w-full" />
            </div>
        </div>
        <app-code></app-code>
    `
})
export class BasicDoc {
    name: string = '';

    email: string = '';

    accept: boolean = false;
}
