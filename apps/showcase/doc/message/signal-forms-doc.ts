import { AppCode } from '@/components/doc/app.code';
import { AppDemoWrapper } from '@/components/doc/app.demowrapper';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Component, signal } from '@angular/core';
import { form, FormField, required, type FieldTree } from '@angular/forms/signals';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';

@Component({
    selector: 'signal-forms-doc',
    standalone: true,
    imports: [FormField, MessageModule, InputTextModule, InputMaskModule, AppCode, AppDemoWrapper, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>Validation errors sourced from a signal forms field are displayed with the <i>error</i> severity.</p>
        </app-docsectiontext>
        <app-demo-wrapper>
            <div class="flex justify-center">
                <div class="flex flex-col gap-4">
                    <p-message severity="error" icon="pi pi-times-circle" class="mb-2">Validation Failed</p-message>
                    <div class="flex flex-col gap-1">
                        <input pInputText placeholder="Username" aria-label="username" [formField]="exampleForm.username" />
                        @if (isInvalid(exampleForm.username)) {
                            @for (error of exampleForm.username().errors(); track error.kind) {
                                <p-message severity="error" variant="simple" size="small">{{ error.message }}</p-message>
                            }
                        }
                    </div>
                    <div class="flex flex-col gap-1">
                        <p-inputmask mask="(999) 999-9999" placeholder="Phone" [formField]="exampleForm.phone" />
                        @if (isInvalid(exampleForm.phone)) {
                            @for (error of exampleForm.phone().errors(); track error.kind) {
                                <p-message severity="error" variant="simple" size="small">{{ error.message }}</p-message>
                            }
                        }
                    </div>
                </div>
            </div>
            <app-code></app-code>
        </app-demo-wrapper>
    `
})
export class SignalFormsDoc {
    model = signal({ username: '', phone: '' });

    exampleForm = form(this.model, (path) => {
        required(path.username, { message: 'Username is required' });
        required(path.phone, { message: 'Phone number is required' });
    });

    isInvalid(field: FieldTree<string>) {
        return field().invalid();
    }
}
