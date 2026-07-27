import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Component, signal } from '@angular/core';
import { ScrollerLazyLoadEvent } from '@openng/optimus-ui/scroller';
import { PickListModule } from '@openng/optimus-ui/picklist';

@Component({
    selector: 'lazy-doc',
    standalone: true,
    imports: [PickListModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                When dealing with huge datasets, new chunks of data can be loaded on demand instead of all at once. Enable <i>sourceVirtualScroll</i> along with <i>sourceLazy</i> to render the source list with a <a href="/scroller">Scroller</a> and
                fetch data as the user scrolls, using the <i>onSourceLazyLoad</i> event to request the next chunk.
            </p>
        </app-docsectiontext>
        <div class="card">
            <p-picklist
                [source]="sourceProducts()"
                [target]="targetProducts()"
                [responsive]="true"
                breakpoint="1400px"
                [sourceLazy]="true"
                [sourceVirtualScroll]="true"
                [sourceVirtualScrollItemSize]="41"
                sourceStyle="height: 20rem"
                targetStyle="height: 20rem"
                (onSourceLazyLoad)="onSourceLazyLoad($event)"
            >
                <ng-template let-item #item>
                    {{ item?.name }}
                </ng-template>
            </p-picklist>
        </div>
        <app-code [extFiles]="['Product']"></app-code>
    `
})
export class LazyDoc {
    totalSourceCount = 10000;

    sourceProducts = signal<any[]>(Array.from({ length: this.totalSourceCount }, () => undefined));

    targetProducts = signal<any[]>([]);

    loadLazyTimeout: any = null;

    onSourceLazyLoad(event: ScrollerLazyLoadEvent) {
        if (this.loadLazyTimeout) {
            clearTimeout(this.loadLazyTimeout);
        }

        // imitate the delay of a backend fetch for the next chunk of source items
        this.loadLazyTimeout = setTimeout(
            () => {
                const { first, last } = event;
                const products = [...this.sourceProducts()];

                for (let i = first; i < (last ?? first); i++) {
                    products[i] = { id: i, name: `Product #${i}` };
                }

                this.sourceProducts.set(products);
            },
            Math.random() * 1000 + 250
        );
    }
}
