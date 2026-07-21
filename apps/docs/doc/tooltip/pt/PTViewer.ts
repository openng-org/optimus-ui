import { AppDocPtViewer, getPTOptions } from '@/components/doc/app.docptviewer';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from '@openng/optimus-ui/button';
import { TooltipModule } from '@openng/optimus-ui/tooltip';

@Component({
    selector: 'tooltip-pt-viewer',
    standalone: true,
    imports: [CommonModule, AppDocPtViewer, ButtonModule, TooltipModule],
    template: `
        <app-docptviewer [docs]="docs">
            <p-button pTooltip="Confirm to proceed" [hideDelay]="300000" severity="secondary" label="Tooltip" />
        </app-docptviewer>
    `
})
export class PTViewer {
    docs = [
        {
            data: getPTOptions('Tooltip'),
            key: 'Tooltip'
        }
    ];
}
