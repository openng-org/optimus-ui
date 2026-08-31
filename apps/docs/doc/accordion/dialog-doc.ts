import { Component } from '@angular/core';
import { AccordionModule } from '@openng/optimus-ui/accordion';
import { ButtonModule } from '@openng/optimus-ui/button';
import { DialogModule } from '@openng/optimus-ui/dialog';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'dialog-doc',
    standalone: true,
    imports: [AccordionModule, ButtonModule, DialogModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>Accordion can be placed inside a Dialog component.</p>
        </app-docsectiontext>
        <div class="card flex justify-center">
            <p-button (click)="showDialog()" label="Show Accordion Dialog" />
            <p-dialog header="Accordion in Dialog" [modal]="true" [(visible)]="visible" [style]="{ width: '50rem' }">
                <p-accordion value="0">
                    <p-accordion-panel value="0">
                        <p-accordion-header>Header I</p-accordion-header>
                        <p-accordion-content>
                            <p class="m-0">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                                commodo consequat.
                            </p>
                        </p-accordion-content>
                    </p-accordion-panel>

                    <p-accordion-panel value="1">
                        <p-accordion-header>Header II</p-accordion-header>
                        <p-accordion-content>
                            <p class="m-0">
                                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                            </p>
                        </p-accordion-content>
                    </p-accordion-panel>
                </p-accordion>
            </p-dialog>
        </div>
        <app-code></app-code>
    `
})
export class DialogDoc {
    visible: boolean = false;

    showDialog() {
        this.visible = true;
    }
}
