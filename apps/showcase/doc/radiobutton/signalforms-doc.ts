import { Component, inject, signal } from '@angular/core';
import { form, FormField, required, type FieldTree } from '@angular/forms/signals';
import { MessageService } from 'primeng/api';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { AppCode } from '@/components/doc/app.code';
import { AppDemoWrapper } from '@/components/doc/app.demowrapper';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'signal-forms-doc',
    standalone: true,
    imports: [FormField, RadioButtonModule, ButtonModule, ToastModule, MessageModule, AppCode, AppDemoWrapper, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>RadioButton can also be used with Angular Signal Forms. In this case, the <i>formField</i> property is used to bind the component to a field of the form.</p>
        </app-docsectiontext>

        <p-toast />
        <app-demo-wrapper>
            <div class="flex justify-center">
                <form (submit)="onSubmit($event)" class="flex flex-col gap-4">
                    <div class="flex flex-wrap gap-4">
                        @for (category of categories; track category.key) {
                            <div class="flex items-center gap-2">
                                <p-radiobutton [formField]="exampleForm.selectedCategory" name="selectedCategory" [inputId]="category.key" [value]="category.key" />
                                <label [for]="category.key" class="text-sm"> {{ category.name }} </label>
                            </div>
                        }
                    </div>
                    @if (isInvalid(exampleForm.selectedCategory)) {
                        @for (error of exampleForm.selectedCategory().errors(); track error.kind) {
                            <p-message severity="error" size="small" variant="simple">{{ error.message }}</p-message>
                        }
                    }
                    <button pButton severity="secondary" type="submit">
                        <span pButtonLabel>Submit</span>
                    </button>
                </form>
            </div>
            <app-code></app-code>
        </app-demo-wrapper>
    `
})
export class SignalFormsDoc {
    messageService = inject(MessageService);

    formSubmitted = signal(false);

    categories = [
        { name: 'Cheese', key: 'C' },
        { name: 'Mushroom', key: 'M' },
        { name: 'Pepper', key: 'P' },
        { name: 'Onion', key: 'O' }
    ];

    model = signal({ selectedCategory: '' });

    exampleForm = form(this.model, (path) => {
        required(path.selectedCategory, { message: 'At least one ingredient must be selected.' });
    });

    onSubmit(event: Event) {
        event.preventDefault();
        this.formSubmitted.set(true);

        if (this.exampleForm().valid()) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form Submitted', life: 3000 });
            this.model.set({ selectedCategory: '' });
            this.formSubmitted.set(false);
        }
    }

    isInvalid(field: FieldTree<string>) {
        const state = field();

        return state.invalid() && (state.touched() || this.formSubmitted());
    }
}
