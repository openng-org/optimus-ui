import { Component, inject } from '@angular/core';
import { MessageService } from '@openng/optimus-ui/api';
import { FormsModule } from '@angular/forms';
import { SliderModule } from '@openng/optimus-ui/slider';
import { ToastModule } from '@openng/optimus-ui/toast';
import { MessageModule } from '@openng/optimus-ui/message';
import { ButtonModule } from '@openng/optimus-ui/button';
import { CommonModule } from '@angular/common';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { AppCode } from '@/components/doc/app.code';

@Component({
    selector: 'templatedrivenforms-doc',
    standalone: true,
    imports: [CommonModule, FormsModule, SliderModule, ToastModule, MessageModule, ButtonModule, AppDocSectionText, AppCode],
    template: `
        <app-docsectiontext> </app-docsectiontext>
        <p-toast />
        <div class="card flex justify-center">
            <form #exampleForm="ngForm" (ngSubmit)="onSubmit(exampleForm)" class="flex justify-center flex-col gap-4">
                <div class="flex flex-col gap-4">
                    <p-slider #model="ngModel" [(ngModel)]="value" class="w-56" required [invalid]="model.invalid && (model.touched || exampleForm.submitted)" name="slider" />
                    @if (model.invalid && (model.touched || exampleForm.submitted)) {
                        <p-message severity="error" size="small" variant="simple">Must be greater than 25.</p-message>
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

    value: any;

    onSubmit(form: any) {
        if (form.valid) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form Submitted', life: 3000 });
            form.resetForm();
        }
    }
}
