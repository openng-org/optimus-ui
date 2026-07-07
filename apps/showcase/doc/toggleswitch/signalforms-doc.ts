import { Component, inject, signal } from '@angular/core';
import { form, FormField, required, type FieldTree } from '@angular/forms/signals';
import { MessageService } from 'primeng/api';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { ButtonModule } from 'primeng/button';
import { AppCode } from '@/components/doc/app.code';
import { AppDemoWrapper } from '@/components/doc/app.demowrapper';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'signal-forms-doc',
    standalone: true,
    imports: [FormField, ToggleSwitchModule, ToastModule, MessageModule, ButtonModule, AppCode, AppDemoWrapper, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>ToggleSwitch can also be used with Angular Signal Forms. In this case, the <i>formField</i> property is used to bind the component to a field of the form.</p>
        </app-docsectiontext>
        <p-toast />
        <app-demo-wrapper>
            <div class="flex justify-center">
                <form (submit)="onSubmit($event)" class="flex flex-col gap-4 w-48">
                    <div class="flex flex-col items-center gap-2">
                        <p-toggleswitch name="activation" [formField]="exampleForm.activation" />
                        @if (isInvalid(exampleForm.activation)) {
                            @for (error of exampleForm.activation().errors(); track error.kind) {
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

    model = signal({ activation: false });

    exampleForm = form(this.model, (path) => {
        required(path.activation, { message: 'Activation is required.' });
    });

    onSubmit(event: Event) {
        event.preventDefault();
        this.formSubmitted.set(true);

        if (this.exampleForm().valid()) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form Submitted', life: 3000 });
            this.model.set({ activation: false });
            this.formSubmitted.set(false);
        }
    }

    isInvalid(field: FieldTree<boolean>) {
        const state = field();

        return state.invalid() && (state.touched() || this.formSubmitted());
    }
}
