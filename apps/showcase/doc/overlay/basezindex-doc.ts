import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'base-z-index-doc',
    standalone: true,
    imports: [AppDocSectionText],
    changeDetection: ChangeDetectionStrategy.Eager,
    template: ` <app-docsectiontext>
        <p>The <i>baseZIndex</i> is base zIndex value to use in layering. Its default value is 0.</p>
    </app-docsectiontext>`
})
export class BaseZIndexDoc {}
