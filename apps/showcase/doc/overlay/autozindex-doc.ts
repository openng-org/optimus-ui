import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'auto-z-index-doc',
    standalone: true,
    imports: [AppDocSectionText],
    changeDetection: ChangeDetectionStrategy.Eager,
    template: ` <app-docsectiontext>
        <p>The <i>autoZIndex</i> determines whether to automatically manage layering. Its default value is 'false'.</p>
    </app-docsectiontext>`
})
export class AutoZIndexDoc {}
