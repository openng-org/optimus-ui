import { Component } from '@angular/core';
import { MessageService } from '@openng/optimus-ui/api';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { AppCode } from '@/components/doc/app.code';
import { ToastModule } from '@openng/optimus-ui/toast';
import { ButtonModule } from '@openng/optimus-ui/button';

@Component({
    selector: 'life-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCode, ToastModule, ButtonModule],
    template: `
        <app-docsectiontext>
            <p>A toast disappears after 3000ms by default, set the <i>life</i> option on either the message or toast to override this.</p>
        </app-docsectiontext>
        <div class="card flex justify-center gap-2">
            <p-toast [life]="10000" />
            <p-button (click)="showLife()" label="Show Life" />
            <p-button (click)="showLifeLong()" label="Show Life Long" />
        </div>
        <app-code></app-code>
    `,
    providers: [MessageService]
})
export class LifeDoc {
    constructor(private messageService: MessageService) {}

    showLife() {
        this.messageService.add({ severity: 'info', summary: 'Life', detail: 'I show for 10000ms' });
    }

    showLifeLong() {
        this.messageService.add({ severity: 'info', summary: 'Life', detail: 'I show for 20000ms', life: 20000 });
    }
}
