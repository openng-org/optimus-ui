import { Component } from '@angular/core';
import { DynamicDialogRef } from '@openng/optimus-ui/dynamicdialog';
import { ButtonModule } from '@openng/optimus-ui/button';

@Component({
    selector: 'footer',
    standalone: true,
    imports: [ButtonModule],
    template: `
        <div class="flex w-full justify-end mt-4">
            <p-button type="button" label="Cancel" icon="pi pi-times" (click)="closeDialog({ buttonType: 'Cancel', summary: 'No Product Selected' })"></p-button>
        </div>
    `
})
export class Footer {
    constructor(public ref: DynamicDialogRef) {}

    closeDialog(data) {
        this.ref.close(data);
    }
}
