import { AppDocPtViewer, getPTOptions } from '@/components/doc/app.docptviewer';
import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ImageModule } from 'primeng/image';

@Component({
    selector: 'image-pt-viewer',
    standalone: true,
    imports: [CommonModule, AppDocPtViewer, ImageModule],
    changeDetection: ChangeDetectionStrategy.Eager,
    template: `
        <app-docptviewer [docs]="docs">
            <p-image src="https://primefaces.org/cdn/primeng/images/galleria/galleria1.jpg" alt="Image" width="250" [preview]="true"></p-image>
        </app-docptviewer>
    `
})
export class PTViewer {
    docs = [
        {
            data: getPTOptions('Image'),
            key: 'Image'
        }
    ];
}
