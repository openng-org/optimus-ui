import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from '@openng/optimus-ui/api';
import { RatingModule } from '@openng/optimus-ui/rating';
import { ButtonModule } from '@openng/optimus-ui/button';
import { ToastModule } from '@openng/optimus-ui/toast';
import { MessageModule } from '@openng/optimus-ui/message';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'reactiveforms-doc',
    standalone: true,
    imports: [ReactiveFormsModule, RatingModule, ButtonModule, ToastModule, MessageModule, AppCode, AppDocSectionText, CommonModule],
    providers: [MessageService],
    template: `
        <app-docsectiontext>
            <p>Rating can also be used with reactive forms. In this case, the <i>formControlName</i> property is used to bind the component to a form control.</p>
        </app-docsectiontext>
        <p-toast />
        <div class="card flex justify-center">
            <form [formGroup]="exampleForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-4 w-40">
                <div class="flex flex-col items-center gap-2">
                    <p-rating formControlName="ratingValue" [invalid]="isInvalid('ratingValue')" />
                    @if (isInvalid('ratingValue')) {
                        <p-message severity="error" size="small" variant="simple">Value is required.</p-message>
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

    exampleForm: FormGroup | undefined;

    formSubmitted = false;

    constructor(private fb: FormBuilder) {
        this.exampleForm = this.fb.group({
            ratingValue: [undefined, Validators.required]
        });
    }

    onSubmit() {
        this.formSubmitted = true;
        if (this.exampleForm.valid) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form Submitted', life: 3000 });
            this.exampleForm.reset();
            this.formSubmitted = false;
        }
    }

    isInvalid(controlName: string) {
        const control = this.exampleForm.get(controlName);
        return control?.invalid && (control.touched || this.formSubmitted);
    }
}
