import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Component, signal } from '@angular/core';
import { ScrollerLazyLoadEvent } from '@openng/optimus-ui/scroller';
import { PickListModule, PickListMoveToSourceEvent, PickListMoveToTargetEvent } from '@openng/optimus-ui/picklist';

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
            <p>
                Entries that are not loaded yet should be disabled with <i>sourceOptionDisabled</i> so that they cannot be selected or moved. Since moved items are removed from the source array, keep the backing data source in sync via
                <i>onMoveToTarget</i> and <i>onMoveToSource</i>. The move all to target action is not available while <i>sourceLazy</i> is enabled.
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
                [sourceStyle]="{ height: '20rem' }"
                [targetStyle]="{ height: '20rem' }"
                [sourceOptionDisabled]="isUnloaded"
                (onSourceLazyLoad)="onSourceLazyLoad($event)"
                (onMoveToTarget)="onMoveToTarget($event)"
                (onMoveToSource)="onMoveToSource($event)"
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

    // imitates the remote dataset, kept in the same order as the source list
    remoteProducts: any[] = Array.from({ length: this.totalSourceCount }, (_, i) => ({ id: i, name: `Product #${i}` }));

    sourceProducts = signal<any[]>(Array.from({ length: this.totalSourceCount }, () => ({}) as any));

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

                for (let i = first; i < Math.min(last ?? first, products.length); i++) {
                    products[i] = this.remoteProducts[i];
                }

                this.sourceProducts.set(products);
            },
            Math.random() * 1000 + 250
        );
    }

    isUnloaded = (item: any) => item?.id === undefined;

    onMoveToTarget(event: PickListMoveToTargetEvent) {
        // the picklist removes moved items from the source, so remove them from the remote dataset as well to keep the indexes aligned
        const movedIds = new Set(event.items.map((item) => item.id));
        this.remoteProducts = this.remoteProducts.filter((product) => !movedIds.has(product.id));
    }

    onMoveToSource(event: PickListMoveToSourceEvent) {
        // the picklist appends moved items to the end of the source
        this.remoteProducts = [...this.remoteProducts, ...event.items];
    }
}
