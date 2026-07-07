import { Component, inject, signal } from '@angular/core';
import { form, FormField, validate } from '@angular/forms/signals';
import { MessageService } from 'primeng/api';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { AppCode } from '@/components/doc/app.code';
import { AppDemoWrapper } from '@/components/doc/app.demowrapper';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'signal-forms-doc',
    standalone: true,
    imports: [FormField, CheckboxModule, ButtonModule, ToastModule, MessageModule, AppCode, AppDemoWrapper, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>Checkbox can also be used with Angular Signal Forms. In this case, the <i>formField</i> property is used to bind the component to a field of the form.</p>
        </app-docsectiontext>

        <p-toast />
        <app-demo-wrapper>
            <div class="flex justify-center">
                <form (submit)="onSubmit($event)" class="flex flex-col gap-4">
                    <div class="flex flex-wrap gap-4">
                        <div class="flex items-center gap-2">
                            <p-checkbox [formField]="exampleForm.cheese" [binary]="true" inputId="cheese" />
                            <label for="cheese" class="text-sm">Cheese</label>
                        </div>
                        <div class="flex items-center gap-2">
                            <p-checkbox [formField]="exampleForm.mushroom" [binary]="true" inputId="mushroom" />
                            <label for="mushroom" class="text-sm">Mushroom</label>
                        </div>
                        <div class="flex items-center gap-2">
                            <p-checkbox [formField]="exampleForm.pepper" [binary]="true" inputId="pepper" />
                            <label for="pepper" class="text-sm">Pepper</label>
                        </div>
                        <div class="flex items-center gap-2">
                            <p-checkbox [formField]="exampleForm.onion" [binary]="true" inputId="onion" />
                            <label for="onion" class="text-sm">Onion</label>
                        </div>
                    </div>
                    @if (isInvalid()) {
                        @for (error of exampleForm().errors(); track error.kind) {
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

    model = signal({ cheese: false, mushroom: false, pepper: false, onion: false });

    exampleForm = form(this.model, (path) => {
        validate(path, ({ value }) => {
            const anySelected = Object.values(value()).some((selected) => selected === true);

            return anySelected ? undefined : { kind: 'atLeastOneRequired', message: 'At least one ingredient must be selected.' };
        });
    });

    onSubmit(event: Event) {
        event.preventDefault();
        this.formSubmitted.set(true);

        if (this.exampleForm().valid()) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form Submitted', life: 3000 });
            this.model.set({ cheese: false, mushroom: false, pepper: false, onion: false });
            this.formSubmitted.set(false);
        }
    }

    isInvalid() {
        const state = this.exampleForm();

        return state.invalid() && this.formSubmitted();
    }
}
