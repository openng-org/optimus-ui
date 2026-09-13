import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { ButtonModule } from '@openng/optimus-ui/button';
import { TooltipModule } from '@openng/optimus-ui/tooltip';

@Component({
    selector: 'custom-doc',
    standalone: true,
    imports: [CommonModule, AppCode, AppDocSectionText, ButtonModule, TooltipModule],
    template: `
        <app-docsectiontext>
            <p>Tooltip can use either a <i>string</i> or a <i>TemplateRef</i>.</p>
        </app-docsectiontext>
        <div class="card flex justify-center">
            <p-button [pTooltip]="tooltipContent" severity="secondary" tooltipPosition="bottom" label="Button" />
            <ng-template #tooltipContent>
                <div class="flex items-center">
                    <img src="https://optimus.openng.org/logo-icon.svg" alt="Optimus UI" width="32" height="32" class="mr-2" />
                    <span> <b>Optimus UI</b> rocks! </span>
                </div>
            </ng-template>
        </div>
        <app-code></app-code>
    `
})
export class CustomDoc {}
