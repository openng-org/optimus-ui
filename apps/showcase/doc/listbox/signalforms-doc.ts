import { Component, inject, signal } from '@angular/core';
import { form, FormField, required, type FieldTree } from '@angular/forms/signals';
import { MessageService } from 'primeng/api';
import { ListboxModule } from 'primeng/listbox';
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
    imports: [FormField, ListboxModule, ButtonModule, ToastModule, MessageModule, AppCode, AppDemoWrapper, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>Listbox can also be used with signal forms. In this case, the <i>formField</i> directive is used to bind the component to a field of the form.</p>
        </app-docsectiontext>

        <p-toast />
        <app-demo-wrapper>
            <div class="flex justify-center">
                <form (submit)="onSubmit($event)" class="flex flex-col gap-4 sm:w-56">
                    <div class="flex flex-col gap-1">
                        <p-listbox [options]="cities" [formField]="exampleForm.selectedCity" optionLabel="name" class="w-full md:w-56" />
                        @if (isInvalid(exampleForm.selectedCity)) {
                            @for (error of exampleForm.selectedCity().errors(); track error.kind) {
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

    model = signal<{ selectedCity: City | null }>({ selectedCity: null });

    exampleForm = form(this.model, (path) => {
        required(path.selectedCity, { message: 'City is required.' });
    });

    onSubmit(event: Event) {
        event.preventDefault();
        this.formSubmitted.set(true);

        if (this.exampleForm().valid()) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form is submitted', life: 3000 });
            this.model.set({ selectedCity: null });
            this.formSubmitted.set(false);
        }
    }

    isInvalid(field: FieldTree<City | null>) {
        const state = field();

        return state.invalid() && (state.touched() || this.formSubmitted());
    }
}
