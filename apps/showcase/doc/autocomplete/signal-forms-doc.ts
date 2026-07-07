import { Component, inject, signal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { form, FormField, required, type FieldTree } from '@angular/forms/signals';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { ButtonModule } from 'primeng/button';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { AppDemoWrapper } from '@/components/doc/app.demowrapper';
import { AppCode } from '@/components/doc/app.code';

@Component({
    selector: 'signal-forms-doc',
    standalone: true,
    imports: [FormField, AutoCompleteModule, ToastModule, MessageModule, ButtonModule, AppDocSectionText, AppCode, AppDemoWrapper],
    template: ` <app-docsectiontext>
            <p>AutoComplete can also be used with signal forms. In this case, the <i>formField</i> directive is used to bind the component to a field.</p>
        </app-docsectiontext>
        <p-toast />
        <app-demo-wrapper>
            <div class="flex justify-center">
                <form (submit)="onSubmit($event)" class="flex justify-center flex-col gap-4 md:w-56">
                    <div class="flex flex-col gap-1">
                        <p-autocomplete [formField]="exampleForm.value" [suggestions]="items" (completeMethod)="search($event)" fluid />
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
        </app-demo-wrapper>`
})
export class SignalFormsDoc {
    messageService = inject(MessageService);

    items: string[] = [];

    formSubmitted = signal(false);

    model = signal({ value: '' });

    exampleForm = form(this.model, (path) => {
        required(path.value, { message: 'Value is required.' });
    });

    search(event: AutoCompleteCompleteEvent) {
        this.items = [...Array(10).keys()].map((item) => event.query + '-' + item);
    }

    onSubmit(event: Event) {
        event.preventDefault();
        this.formSubmitted.set(true);

        if (this.exampleForm().valid()) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form Submitted', life: 3000 });
            this.model.set({ value: '' });
            this.formSubmitted.set(false);
        }
    }

    isInvalid(field: FieldTree<string>) {
        const state = field();

        return state.invalid() && (state.touched() || this.formSubmitted());
    }
}
