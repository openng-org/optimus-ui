import { AppDocPtViewer, getPTOptions } from '@/components/doc/app.docptviewer';
import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EditorModule } from 'primeng/editor';

@Component({
    selector: 'editor-pt-viewer',
    standalone: true,
    imports: [CommonModule, AppDocPtViewer, EditorModule, FormsModule],
    changeDetection: ChangeDetectionStrategy.Eager,
    template: `
        <app-docptviewer [docs]="docs">
            <p-editor [(ngModel)]="value" [style]="{ height: '320px' }"></p-editor>
        </app-docptviewer>
    `
})
export class PTViewer {
    value: any = '';
    docs = [{ data: getPTOptions('Editor'), key: 'Editor' }];
}
