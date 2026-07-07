import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { form, FormField, required, type FieldTree } from '@angular/forms/signals';
import { MessageService } from 'primeng/api';
import {
    InputColor,
    InputColorArea,
    InputColorAreaBackground,
    InputColorAreaThumb,
    InputColorSlider,
    InputColorSliderThumb,
    InputColorSliderTrack,
    InputColorSwatch,
    InputColorSwatchBackground,
    InputColorTransparencyGrid,
    InputColorInput
} from 'primeng/inputcolor';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { AppCode } from '@/components/doc/app.code';
import { AppDemoWrapper } from '@/components/doc/app.demowrapper';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'signal-forms-doc',
    standalone: true,
    imports: [
        CommonModule,
        FormField,
        InputColor,
        InputColorArea,
        InputColorAreaBackground,
        InputColorAreaThumb,
        InputColorSlider,
        InputColorSliderThumb,
        InputColorSliderTrack,
        InputColorSwatch,
        InputColorSwatchBackground,
        InputColorTransparencyGrid,
        InputColorInput,
        ButtonModule,
        MessageModule,
        ToastModule,
        AppCode,
        AppDemoWrapper,
        AppDocSectionText
    ],
    template: `
        <app-docsectiontext>
            <p>InputColor can also be used with Angular Signal Forms. In this case, the <i>formField</i> directive is used to bind the component to a field.</p>
        </app-docsectiontext>
        <p-toast />
        <app-demo-wrapper>
            <div class="flex justify-center">
                <form (submit)="onSubmit($event)" class="flex flex-col gap-4">
                    <div class="flex flex-col items-center gap-2">
                        <p-inputcolor [formField]="exampleForm.color" class="w-80 space-y-3">
                            <p-inputcolor-area>
                                <p-inputcolor-area-background />
                                <p-inputcolor-area-thumb />
                            </p-inputcolor-area>
                            <div class="flex items-center gap-2">
                                <div class="flex-1 space-y-1 mr-1">
                                    <p-inputcolor-slider>
                                        <p-inputcolor-transparency-grid />
                                        <p-inputcolor-slider-track />
                                        <p-inputcolor-slider-thumb />
                                    </p-inputcolor-slider>
                                </div>
                                <p-inputcolor-swatch class="shrink-0">
                                    <p-inputcolor-transparency-grid />
                                    <p-inputcolor-swatch-background />
                                </p-inputcolor-swatch>
                            </div>
                            <input pInputColorInput [fluid]="true" channel="hex" />
                        </p-inputcolor>
                        @if (isInvalid(exampleForm.color)) {
                            @for (error of exampleForm.color().errors(); track error.kind) {
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

    model = signal({ color: '' });

    exampleForm = form(this.model, (path) => {
        required(path.color, { message: 'Color is required.' });
    });

    onSubmit(event: Event) {
        event.preventDefault();
        this.formSubmitted.set(true);

        if (this.exampleForm().valid()) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form is submitted', life: 3000 });
            this.model.set({ color: '' });
            this.formSubmitted.set(false);
        }
    }

    isInvalid(field: FieldTree<string>) {
        const state = field();

        return state.invalid() && (state.touched() || this.formSubmitted());
    }
}
