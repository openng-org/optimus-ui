import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from '@openng/optimus-ui/api';
import { ButtonModule } from '@openng/optimus-ui/button';
import { ConfirmPopupModule } from '@openng/optimus-ui/confirmpopup';
import { ToastModule } from '@openng/optimus-ui/toast';

@Component({
    selector: 'headless-doc',
    standalone: true,
    imports: [CommonModule, ConfirmPopupModule, ToastModule, ButtonModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p><i>Headless</i> mode allows you to customize the entire user interface instead of the default elements.</p>
        </app-docsectiontext>
        <div class="card flex justify-center">
            <p-toast />
            <p-confirmpopup #cp>
                <ng-template #headless let-message>
                    <div class="rounded p-4">
                        <span>{{ message.message }}</span>
                        <div class="flex items-center gap-2 mt-4">
                            <p-button (onClick)="cp.onAccept()" label="Save" size="small" [autofocus]="true" />
                            <p-button (onClick)="cp.onReject()" label="Cancel" [text]="true" size="small" severity="secondary" />
                        </div>
                    </div>
                </ng-template>
            </p-confirmpopup>
            <p-button (onClick)="confirm($event)" label="Save" />
        </div>
        <app-code></app-code>
    `,
    providers: [ConfirmationService, MessageService]
})
export class HeadlessDoc {
    constructor(
        private confirmationService: ConfirmationService,
        private messageService: MessageService
    ) {}

    confirm(event: Event) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Save your current process?',
            accept: () => {
                this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
            },
            reject: () => {
                this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
            }
        });
    }
}
