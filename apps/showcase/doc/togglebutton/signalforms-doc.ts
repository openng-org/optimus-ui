import { Component, inject, signal } from '@angular/core';
import { form, FormField, required, type FieldTree } from '@angular/forms/signals';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { AppCode } from '@/components/doc/app.code';
import { AppDemoWrapper } from '@/components/doc/app.demowrapper';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'signal-forms-doc',
    standalone: true,
    imports: [FormField, ToggleButtonModule, ToastModule, MessageModule, ButtonModule, AppCode, AppDemoWrapper, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>ToggleButton can also be used with Angular Signal Forms. In this case, the <i>formField</i> property is used to bind the component to a field of the form.</p>
        </app-docsectiontext>
        <p-toast />
        <app-demo-wrapper>
            <div class="flex justify-center">
                <form (submit)="onSubmit($event)" class="flex flex-col items-center gap-4">
                    <div class="flex flex-col items-center gap-1">
                        <p-togglebutton name="consent" [formField]="exampleForm.checked" onLabel="Accept All" offLabel="Reject All" class="min-w-40" />
                        @if (isInvalid(exampleForm.checked)) {
                            @for (error of exampleForm.checked().errors(); track error.kind) {
                                <p-message severity="error" size="small" variant="simple">{{ error.message }}</p-message>
                            }
                        }
                    </div>
                    <button pButton type="submit"><span pButtonLabel>Submit</span></button>
                </form>
            </div>
            <app-code></app-code>
        </app-demo-wrapper>
    `
})
export class SignalFormsDoc {
    messageService = inject(MessageService);

    formSubmitted = signal(false);

    model = signal({ checked: false });

    exampleForm = form(this.model, (path) => {
        required(path.checked, { message: 'Consent is mandatory.' });
    });

    onSubmit(event: Event) {
        event.preventDefault();
        this.formSubmitted.set(true);

        if (this.exampleForm().valid()) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form Submitted', life: 3000 });
            this.model.set({ checked: false });
            this.formSubmitted.set(false);
        }
    }

    isInvalid(field: FieldTree<boolean>) {
        const state = field();

        return state.invalid() && (state.touched() || this.formSubmitted());
    }
}
