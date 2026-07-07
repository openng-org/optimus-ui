import { AppCode } from '@/components/doc/app.code';
import { AppDemoWrapper } from '@/components/doc/app.demowrapper';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Component, inject, signal } from '@angular/core';
import { form, FormField, max, min, type FieldTree } from '@angular/forms/signals';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { KnobModule } from 'primeng/knob';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'signal-forms-doc',
    standalone: true,
    imports: [FormField, KnobModule, ButtonModule, MessageModule, ToastModule, AppCode, AppDemoWrapper, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>Knob can also be used with Angular Signal Forms. In this case, the <i>[formField]</i> directive is used to bind the component to a field of the form.</p>
        </app-docsectiontext>

        <p-toast />
        <app-demo-wrapper>
            <div class="flex justify-center">
                <form (submit)="onSubmit($event)" class="flex flex-col items-center gap-4">
                    <div class="flex flex-col items-center gap-1">
                        <p-knob [formField]="exampleForm.value" />
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

    model = signal({ value: 15 });

    exampleForm = form(this.model, (path) => {
        min(path.value, 25, { message: 'Value must be greater than 15.' });
        max(path.value, 75, { message: 'Must be less than 75.' });
    });

    onSubmit(event: Event) {
        event.preventDefault();
        this.formSubmitted.set(true);

        if (this.exampleForm().valid()) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form is submitted', life: 3000 });
            this.model.set({ value: 15 });
            this.formSubmitted.set(false);
        }
    }

    isInvalid(field: FieldTree<number>) {
        const state = field();

        return state.invalid() && (state.dirty() || this.formSubmitted());
    }
}
