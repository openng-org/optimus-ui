import { Component } from '@angular/core';
import { MessageService } from '@openng/optimus-ui/api';
import { ProgressBarModule } from '@openng/optimus-ui/progressbar';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'indeterminate-doc',
    standalone: true,
    imports: [ProgressBarModule, AppCode, AppDocSectionText],
    providers: [MessageService],
    template: `
        <app-docsectiontext>
            <p>For progresses with no value to track, set the <i>mode</i> property to <i>indeterminate</i>.</p>
        </app-docsectiontext>
        <div class="card">
            <p-progressbar mode="indeterminate" [style]="{ height: '6px' }" />
        </div>
        <app-code></app-code>
    `
})
export class IndeterminateDoc {}
