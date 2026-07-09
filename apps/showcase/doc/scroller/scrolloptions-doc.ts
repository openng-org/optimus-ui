import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'scroll-options-doc',
    standalone: true,
    imports: [AppCode, AppDocSectionText],
    changeDetection: ChangeDetectionStrategy.Eager,
    template: `
        <app-docsectiontext>
            <p>The properties of scroller component can be used like an object in it.</p>
        </app-docsectiontext>
        <app-code [hideToggleCode]="true"></app-code>
    `
})
export class ScrollOptionsDoc {}
