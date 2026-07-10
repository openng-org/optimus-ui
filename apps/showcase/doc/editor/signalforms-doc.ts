import { AppCode } from '@/components/doc/app.code';
import { AppDemoWrapper } from '@/components/doc/app.demowrapper';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Component, inject, signal } from '@angular/core';
import { form, FormField, required, type FieldTree } from '@angular/forms/signals';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { EditorModule } from 'primeng/editor';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'signal-forms-doc',
    standalone: true,
    imports: [FormField, EditorModule, ButtonModule, MessageModule, ToastModule, AppCode, AppDemoWrapper, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>Editor can also be used with Angular Signal Forms. In this case, the <i>[formField]</i> directive is used to bind the component to a field of the form.</p>
        </app-docsectiontext>

        <p-toast />
        <app-demo-wrapper>
            <form (submit)="onSubmit($event)" class="flex flex-col gap-4">
                <div class="flex flex-col gap-1">
                    <p-editor [formField]="exampleForm.text" [style]="{ height: '320px' }" />
                    @if (isInvalid(exampleForm.text)) {
                        @for (error of exampleForm.text().errors(); track error.kind) {
                            <p-message severity="error" size="small" variant="simple">{{ error.message }}</p-message>
                        }
                    }
                </div>
                <button pButton severity="secondary" type="submit"><span pButtonLabel>Submit</span></button>
            </form>
            <app-code></app-code>
        </app-demo-wrapper>
    `
})
export class SignalFormsDoc {
    messageService = inject(MessageService);

    formSubmitted = signal(false);

    model = signal({ text: '' });

    exampleForm = form(this.model, (path) => {
        required(path.text, { message: 'Content is required.' });
    });

    onSubmit(event: Event) {
        event.preventDefault();
        this.formSubmitted.set(true);

        if (this.exampleForm().valid()) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form is submitted', life: 3000 });
            this.model.set({ text: '' });
            this.formSubmitted.set(false);
        }
    }

    isInvalid(field: FieldTree<string>) {
        const state = field();

        return state.invalid() && (state.touched() || this.formSubmitted());
    }
}
