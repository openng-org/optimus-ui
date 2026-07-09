import { AppDocPtViewer, getPTOptions } from '@/components/doc/app.docptviewer';
import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MessageModule } from 'primeng/message';

@Component({
    selector: 'message-pt-viewer',
    standalone: true,
    imports: [CommonModule, AppDocPtViewer, MessageModule],
    changeDetection: ChangeDetectionStrategy.Eager,
    template: `
        <app-docptviewer [docs]="docs">
            <p-message [closable]="true" severity="info" icon="pi pi-send">Info Message</p-message>
        </app-docptviewer>
    `
})
export class PTViewer {
    docs = [
        {
            data: getPTOptions('Message'),
            key: 'Message'
        }
    ];
}
