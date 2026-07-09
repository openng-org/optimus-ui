import { AppDocPtViewer, getPTOptions } from '@/components/doc/app.docptviewer';
import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { KnobModule } from 'primeng/knob';

@Component({
    selector: 'knob-pt-viewer',
    standalone: true,
    imports: [CommonModule, AppDocPtViewer, KnobModule, FormsModule],
    changeDetection: ChangeDetectionStrategy.Eager,
    template: `
        <app-docptviewer [docs]="docs">
            <p-knob [(ngModel)]="value"></p-knob>
        </app-docptviewer>
    `
})
export class PTViewer {
    value = 0;

    docs = [
        {
            data: getPTOptions('Knob'),
            key: 'Knob'
        }
    ];
}
