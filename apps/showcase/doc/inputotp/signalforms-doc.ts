import { Component, inject, signal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { form, FormField, minLength, required, type FieldTree } from '@angular/forms/signals';
import { InputOtpModule } from 'primeng/inputotp';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { AppCode } from '@/components/doc/app.code';
import { AppDemoWrapper } from '@/components/doc/app.demowrapper';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'signal-forms-doc',
    standalone: true,
    imports: [FormField, InputOtpModule, ButtonModule, ToastModule, MessageModule, AppCode, AppDemoWrapper, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>InputOtp can also be used with Angular Signal Forms. In this case, the <i>formField</i> directive is used to bind the component to a field.</p>
        </app-docsectiontext>
        <p-toast />
        <app-demo-wrapper>
            <div class="flex justify-center">
                <form (submit)="onSubmit($event)" class="flex flex-col gap-4">
                    <div class="flex flex-col gap-1">
                        <p-inputotp [formField]="exampleForm.value" />
                        @if (isInvalid(exampleForm.value)) {
                            @for (error of exampleForm.value().errors(); track error.kind) {
                                <p-message severity="error" size="small" variant="simple">{{ error.message }}</p-message>
                            }
                        }
                    </div>
                    <button pButton severity="secondary" type="submit"><span pButtonLabel>Submit</span></button>
                </form>
            </div>
            <app-code></app-code>
        </app-demo-wrapper>
    `
})
export class SignalFormsDoc {
    messageService = inject(MessageService);

    formSubmitted = signal(false);

    model = signal({ value: '' });

    exampleForm = form(this.model, (path) => {
        required(path.value, { message: 'Passcode is required.' });
        minLength(path.value, 4, { message: 'Passcode must be at least 4 characters.' });
    });

    onSubmit(event: Event) {
        event.preventDefault();
        this.formSubmitted.set(true);

        if (this.exampleForm().valid()) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form is submitted', life: 3000 });
            this.model.set({ value: '' });
            this.formSubmitted.set(false);
        }
    }

    isInvalid(field: FieldTree<string>) {
        const state = field();

        return state.invalid() && (state.touched() || this.formSubmitted());
    }
}
