import { Component, inject, signal } from '@angular/core';
import { form, FormField, required, type FieldTree } from '@angular/forms/signals';
import { MessageService } from 'primeng/api';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { AppDemoWrapper } from '@/components/doc/app.demowrapper';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'signal-forms-doc',
    standalone: true,
    imports: [CommonModule, FormField, AppCode, AppDocSectionText, AppDemoWrapper, ButtonModule, MessageModule, TextareaModule, ToastModule],
    template: `
        <app-docsectiontext>
            <p>Textarea can also be used with Angular Signal Forms. In this case, the <i>formField</i> directive is used to bind the component to a field.</p>
        </app-docsectiontext>
        <p-toast />
        <app-demo-wrapper>
            <div class="flex justify-center">
                <form (submit)="onSubmit($event)" class="flex flex-col gap-4">
                    <div class="flex flex-col gap-1">
                        <textarea rows="5" cols="30" pTextarea [formField]="exampleForm.address"></textarea>
                        @if (isInvalid(exampleForm.address)) {
                            @for (error of exampleForm.address().errors(); track error.kind) {
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

    model = signal({ address: '' });

    exampleForm = form(this.model, (path) => {
        required(path.address, { message: 'Address is required.' });
    });

    onSubmit(event: Event) {
        event.preventDefault();
        this.formSubmitted.set(true);

        if (this.exampleForm().valid()) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form is submitted', life: 3000 });
            this.model.set({ address: '' });
            this.formSubmitted.set(false);
        }
    }

    isInvalid(field: FieldTree<string>) {
        const state = field();

        return state.invalid() && (state.touched() || this.formSubmitted());
    }
}
