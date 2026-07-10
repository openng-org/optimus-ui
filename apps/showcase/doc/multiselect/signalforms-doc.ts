import { Component, inject, signal } from '@angular/core';
import { form, FormField, required, type FieldTree } from '@angular/forms/signals';
import { MessageService } from 'primeng/api';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { AppCode } from '@/components/doc/app.code';
import { AppDemoWrapper } from '@/components/doc/app.demowrapper';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

interface City {
    name: string;
    code: string;
}

@Component({
    selector: 'signal-forms-doc',
    standalone: true,
    imports: [FormField, MultiSelectModule, ButtonModule, ToastModule, MessageModule, AppCode, AppDemoWrapper, AppDocSectionText],
    providers: [MessageService],
    template: `
        <app-docsectiontext>
            <p>MultiSelect can also be used with signal forms. In this case, the <i>formField</i> directive is used to bind the component to a field of the form.</p>
        </app-docsectiontext>
        <p-toast />
        <app-demo-wrapper>
            <div class="flex justify-center">
                <form (submit)="onSubmit($event)" class="flex justify-center flex-col gap-4 w-full md:w-80">
                    <div class="flex flex-col gap-1">
                        <p-multiselect [options]="cities" [formField]="exampleForm.city" optionLabel="name" placeholder="Select Cities" [maxSelectedLabels]="3" [fluid]="true" />
                        @if (isInvalid(exampleForm.city)) {
                            @for (error of exampleForm.city().errors(); track error.kind) {
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

    cities: City[] = [
        { name: 'New York', code: 'NY' },
        { name: 'Rome', code: 'RM' },
        { name: 'London', code: 'LDN' },
        { name: 'Istanbul', code: 'IST' },
        { name: 'Paris', code: 'PRS' }
    ];

    model = signal<{ city: City[] | null }>({ city: null });

    exampleForm = form(this.model, (path) => {
        required(path.city, { message: 'City is required.' });
    });

    onSubmit(event: Event) {
        event.preventDefault();
        this.formSubmitted.set(true);

        if (this.exampleForm().valid()) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form Submitted', life: 3000 });
            this.model.set({ city: null });
            this.formSubmitted.set(false);
        }
    }

    isInvalid(field: FieldTree<City[] | null>) {
        const state = field();

        return state.invalid() && (state.touched() || this.formSubmitted());
    }
}
