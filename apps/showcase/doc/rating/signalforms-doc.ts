import { AppCode } from '@/components/doc/app.code';
import { AppDemoWrapper } from '@/components/doc/app.demowrapper';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Component, inject, signal } from '@angular/core';
import { form, FormField, required, type FieldTree } from '@angular/forms/signals';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'signal-forms-doc',
    standalone: true,
    imports: [FormField, RatingModule, ButtonModule, MessageModule, ToastModule, AppCode, AppDemoWrapper, AppDocSectionText],
    providers: [MessageService],
    template: `
        <app-docsectiontext>
            <p>Rating can also be used with Angular Signal Forms. In this case, the <i>[formField]</i> directive is used to bind the component to a field of the form.</p>
        </app-docsectiontext>
        <p-toast />
        <app-demo-wrapper>
            <div class="flex justify-center">
                <form (submit)="onSubmit($event)" class="flex flex-col gap-4 w-40">
                    <div class="flex flex-col items-center gap-2">
                        <p-rating [formField]="exampleForm.ratingValue" />
                        @if (isInvalid(exampleForm.ratingValue)) {
                            @for (error of exampleForm.ratingValue().errors(); track error.kind) {
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

    model = signal<{ ratingValue: number | null }>({ ratingValue: null });

    exampleForm = form(this.model, (path) => {
        required(path.ratingValue, { message: 'Value is required.' });
    });

    onSubmit(event: Event) {
        event.preventDefault();
        this.formSubmitted.set(true);

        if (this.exampleForm().valid()) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form Submitted', life: 3000 });
            this.model.set({ ratingValue: null });
            this.formSubmitted.set(false);
        }
    }

    isInvalid(field: FieldTree<number | null>) {
        const state = field();

        return state.invalid() && (state.touched() || this.formSubmitted());
    }
}
