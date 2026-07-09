import { AppCode } from '@/components/doc/app.code';
import { AppDemoWrapper } from '@/components/doc/app.demowrapper';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Component, signal } from '@angular/core';
import { PickListModule } from 'primeng/picklist';

@Component({
    selector: 'virtual-scroll-doc',
    standalone: true,
    imports: [PickListModule, AppCode, AppDemoWrapper, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                VirtualScrolling is an efficient way of rendering the options by displaying a small subset of data in the viewport at any time. Enable the <i>virtualScroll</i> property and define <i>virtualScrollItemSize</i> to set the height of an
                item.
            </p>
        </app-docsectiontext>
        <app-demo-wrapper>
            <p-picklist [source]="sourceItems()" [target]="targetItems()" [dragdrop]="true" [virtualScroll]="true" [virtualScrollItemSize]="43" scrollHeight="250px" breakpoint="1400px">
                <ng-template let-item #item>
                    {{ item.label }}
                </ng-template>
            </p-picklist>
            <app-code></app-code>
        </app-demo-wrapper>
    `
})
export class VirtualScrollDoc {
    sourceItems = signal(Array.from({ length: 10000 }, (_, i) => ({ label: `Item #${i}`, value: i })));

    targetItems = signal<{ label: string; value: number }[]>([]);
}
