import { Component, inject } from '@angular/core';
import { MessageService } from '@openng/optimus-ui/api';
import { AutoCompleteCompleteEvent } from '@openng/optimus-ui/autocomplete';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from '@openng/optimus-ui/autocomplete';
import { ToastModule } from '@openng/optimus-ui/toast';
import { MessageModule } from '@openng/optimus-ui/message';
import { ButtonModule } from '@openng/optimus-ui/button';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { AppCode } from '@/components/doc/app.code';

@Component({
    selector: 'template-driven-forms-doc',
    standalone: true,
    imports: [CommonModule, FormsModule, AutoCompleteModule, ToastModule, MessageModule, ButtonModule, AppDocSectionText, AppCode],
    template: `
        <app-docsectiontext> </app-docsectiontext>
        <p-toast />
        <div class="card flex justify-center">
            <form #exampleForm="ngForm" (ngSubmit)="onSubmit(exampleForm)" class="flex justify-center flex-col gap-4 md:w-56">
                <div class="flex flex-col gap-1">
                    <p-autocomplete #val="ngModel" [(ngModel)]="value" [suggestions]="items" [invalid]="val.invalid && (val.touched || exampleForm.submitted)" name="val" (completeMethod)="search($event)" required fluid />
                    @if (val.invalid && (val.touched || exampleForm.submitted)) {
                        <p-message severity="error" size="small" variant="simple">Value is required.</p-message>
                    }
                </div>
                <button pButton severity="secondary" type="submit"><span pButtonLabel>Submit</span></button>
            </form>
        </div>
        <app-code></app-code>
    `
})
export class TemplateDrivenFormsDoc {
    messageService = inject(MessageService);

    items: any[] = [];

    value: any;

    search(event: AutoCompleteCompleteEvent) {
        this.items = [...Array(10).keys()].map((item) => event.query + '-' + item);
    }

    onSubmit(form: any) {
        if (form.valid) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form Submitted', life: 3000 });
            form.resetForm();
        }
    }
}
