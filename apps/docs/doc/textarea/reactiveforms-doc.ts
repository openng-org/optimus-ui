import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from '@openng/optimus-ui/api';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { ButtonModule } from '@openng/optimus-ui/button';
import { MessageModule } from '@openng/optimus-ui/message';
import { TextareaModule } from '@openng/optimus-ui/textarea';
import { ToastModule } from '@openng/optimus-ui/toast';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'reactiveforms-doc',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, AppCode, AppDocSectionText, ButtonModule, MessageModule, TextareaModule, ToastModule],
    template: `
        <app-docsectiontext>
            <p>Textarea can also be used with reactive forms. In this case, the <i>formControlName</i> property is used to bind the component to a form control.</p>
        </app-docsectiontext>
        <p-toast />
        <div class="card flex justify-center">
            <form [formGroup]="exampleForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
                <div class="flex flex-col gap-1">
                    <textarea rows="5" cols="30" pTextarea formControlName="address" [invalid]="isInvalid('address')"></textarea>
                    @if (isInvalid('address')) {
                        <p-message severity="error" size="small" variant="simple">Address is required..</p-message>
                    }
                </div>
                <button pButton severity="secondary" type="submit"><span pButtonLabel>Submit</span></button>
            </form>
        </div>
        <app-code></app-code>
    `
})
export class ReactiveFormsDoc {
    messageService = inject(MessageService);

    items: any[] | undefined;

    exampleForm: FormGroup | undefined;

    formSubmitted: boolean = false;

    constructor(private fb: FormBuilder) {
        this.exampleForm = this.fb.group({
            address: ['', Validators.required]
        });
    }

    onSubmit() {
        this.formSubmitted = true;
        if (this.exampleForm.valid) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form is submitted', life: 3000 });
            this.exampleForm.reset();
            this.formSubmitted = false;
        }
    }

    isInvalid(controlName: string) {
        const control = this.exampleForm.get(controlName);
        return control?.invalid && (control.touched || this.formSubmitted);
    }
}
