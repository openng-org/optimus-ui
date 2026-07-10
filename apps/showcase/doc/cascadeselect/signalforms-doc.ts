import { Component, inject, signal } from '@angular/core';
import { form, FormField, required, type FieldTree } from '@angular/forms/signals';
import { MessageService } from 'primeng/api';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { ButtonModule } from 'primeng/button';
import { AppCode } from '@/components/doc/app.code';
import { AppDemoWrapper } from '@/components/doc/app.demowrapper';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

interface City {
    cname: string;
    code: string;
}

@Component({
    selector: 'signal-forms-doc',
    standalone: true,
    imports: [FormField, CascadeSelectModule, ToastModule, MessageModule, ButtonModule, AppCode, AppDemoWrapper, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>CascadeSelect can also be used with signal forms. In this case, the <i>formField</i> directive is used to bind the component to a field of the form.</p>
        </app-docsectiontext>

        <p-toast />
        <app-demo-wrapper>
            <div class="flex justify-center">
                <form (submit)="onSubmit($event)" class="flex flex-col gap-4">
                    <div class="flex flex-col gap-1">
                        <p-cascadeselect
                            [formField]="exampleForm.selectedCity"
                            [options]="countries"
                            optionLabel="cname"
                            optionGroupLabel="name"
                            [optionGroupChildren]="['states', 'cities']"
                            [style]="{ minWidth: '14rem' }"
                            placeholder="Select a City"
                        />

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

    countries: any[] = [
        {
            name: 'Australia',
            code: 'AU',
            states: [
                {
                    name: 'New South Wales',
                    cities: [
                        { cname: 'Sydney', code: 'A-SY' },
                        { cname: 'Newcastle', code: 'A-NE' },
                        { cname: 'Wollongong', code: 'A-WO' }
                    ]
                },
                {
                    name: 'Queensland',
                    cities: [
                        { cname: 'Brisbane', code: 'A-BR' },
                        { cname: 'Townsville', code: 'A-TO' }
                    ]
                }
            ]
        },
        {
            name: 'Canada',
            code: 'CA',
            states: [
                {
                    name: 'Quebec',
                    cities: [
                        { cname: 'Montreal', code: 'C-MO' },
                        { cname: 'Quebec City', code: 'C-QU' }
                    ]
                },
                {
                    name: 'Ontario',
                    cities: [
                        { cname: 'Ottawa', code: 'C-OT' },
                        { cname: 'Toronto', code: 'C-TO' }
                    ]
                }
            ]
        },
        {
            name: 'United States',
            code: 'US',
            states: [
                {
                    name: 'California',
                    cities: [
                        { cname: 'Los Angeles', code: 'US-LA' },
                        { cname: 'San Diego', code: 'US-SD' },
                        { cname: 'San Francisco', code: 'US-SF' }
                    ]
                },
                {
                    name: 'Florida',
                    cities: [
                        { cname: 'Jacksonville', code: 'US-JA' },
                        { cname: 'Miami', code: 'US-MI' },
                        { cname: 'Tampa', code: 'US-TA' },
                        { cname: 'Orlando', code: 'US-OR' }
                    ]
                },
                {
                    name: 'Texas',
                    cities: [
                        { cname: 'Austin', code: 'US-AU' },
                        { cname: 'Dallas', code: 'US-DA' },
                        { cname: 'Houston', code: 'US-HO' }
                    ]
                }
            ]
        }
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
