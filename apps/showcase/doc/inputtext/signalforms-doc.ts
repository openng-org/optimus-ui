import { Component, inject, signal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { email, form, FormField, required, type FieldTree } from '@angular/forms/signals';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { AppCode } from '@/components/doc/app.code';
import { AppDemoWrapper } from '@/components/doc/app.demowrapper';

@Component({
    selector: 'signal-forms-doc',
    standalone: true,
    imports: [FormField, InputTextModule, ButtonModule, ToastModule, MessageModule, AppCode, AppDemoWrapper],
    template: `
        <p-toast />
        <app-demo-wrapper>
            <div class="flex justify-center">
                <form (submit)="onSubmit($event)" class="flex flex-col gap-4 w-full sm:w-56">
                    <div class="flex flex-col gap-1">
                        <input pInputText type="text" id="username" placeholder="Username" [formField]="exampleForm.username" />
                        @if (isInvalid(exampleForm.username)) {
                            @for (error of exampleForm.username().errors(); track error.kind) {
                                <p-message severity="error" size="small" variant="simple">{{ error.message }}</p-message>
                            }
                        }
                    </div>
                    <div class="flex flex-col gap-1">
                        <input pInputText type="email" id="email" placeholder="Email" [formField]="exampleForm.email" />
                        @if (isInvalid(exampleForm.email)) {
                            @for (error of exampleForm.email().errors(); track error.kind) {
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

    model = signal({ username: '', email: '' });

    exampleForm = form(this.model, (path) => {
        required(path.username, { message: 'Username is required.' });
        required(path.email, { message: 'Email is required.' });
        email(path.email, { message: 'Please enter a valid email.' });
    });

    onSubmit(event: Event) {
        event.preventDefault();
        this.formSubmitted.set(true);

        if (this.exampleForm().valid()) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form Submitted', life: 3000 });
            this.model.set({ username: '', email: '' });
            this.formSubmitted.set(false);
        }
    }

    isInvalid(field: FieldTree<string>) {
        const state = field();

        return state.invalid() && (state.touched() || this.formSubmitted());
    }
}
