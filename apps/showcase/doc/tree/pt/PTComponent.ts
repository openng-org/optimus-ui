import { Component, ChangeDetectionStrategy } from '@angular/core';
import { PTViewer } from './PTViewer';

@Component({
    standalone: true,
    imports: [PTViewer],
    changeDetection: ChangeDetectionStrategy.Eager,
    template: ` <tree-pt-viewer /> `
})
export class PTComponent {}
