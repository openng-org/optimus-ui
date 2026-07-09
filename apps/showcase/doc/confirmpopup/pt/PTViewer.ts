import { AppDocPtViewer, getPTOptions } from '@/components/doc/app.docptviewer';
import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmPopupModule } from 'primeng/confirmpopup';

@Component({
    selector: 'confirmpopup-pt-viewer',
    standalone: true,
    imports: [CommonModule, AppDocPtViewer, ConfirmPopupModule, ButtonModule],
    providers: [ConfirmationService],
    changeDetection: ChangeDetectionStrategy.Eager,
    template: `
        <app-docptviewer [docs]="docs">
            <p-confirmpopup />
            <p-button (onClick)="confirm($event)" label="Open Popup" outlined></p-button>
        </app-docptviewer>
    `
})
export class PTViewer {
    constructor(private confirmationService: ConfirmationService) {}

    confirm(event: Event) {
        this.confirmationService.confirm({
            target: event.currentTarget as EventTarget,
            message: 'Are you sure you want to proceed?',
            icon: 'pi pi-exclamation-triangle',
            rejectButtonProps: {
                label: 'Cancel',
                severity: 'secondary',
                outlined: true
            },

            acceptButtonProps: {
                label: 'Save'
            }
        });
    }

    docs = [
        {
            data: getPTOptions('ConfirmPopup'),
            key: 'ConfirmPopup'
        }
    ];
}
