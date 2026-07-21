import { AppDocPtViewer, getPTOptions } from '@/components/doc/app.docptviewer';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from '@openng/optimus-ui/button';
import { IconFieldModule } from '@openng/optimus-ui/iconfield';
import { InputIconModule } from '@openng/optimus-ui/inputicon';
import { InputTextModule } from '@openng/optimus-ui/inputtext';
import { ToolbarModule } from '@openng/optimus-ui/toolbar';

@Component({
    selector: 'toolbar-pt-viewer',
    standalone: true,
    imports: [CommonModule, AppDocPtViewer, ToolbarModule, ButtonModule, InputTextModule, IconFieldModule, InputIconModule],
    template: `
        <app-docptviewer [docs]="docs">
            <p-toolbar class="w-full">
                <ng-template #start>
                    <p-button icon="pi pi-plus" class="mr-2" text severity="secondary" />
                    <p-button icon="pi pi-print" class="mr-2" text severity="secondary" />
                    <p-button icon="pi pi-upload" text severity="secondary" />
                </ng-template>
                <ng-template #center>
                    <p-iconfield iconPosition="left">
                        <p-inputicon class="pi pi-search" />
                        <input type="text" pInputText placeholder="Search" />
                    </p-iconfield>
                </ng-template>
                <ng-template #end>
                    <p-button label="Save" />
                </ng-template>
            </p-toolbar>
        </app-docptviewer>
    `
})
export class PTViewer {
    docs = [
        {
            data: getPTOptions('Toolbar'),
            key: 'Toolbar'
        }
    ];
}
