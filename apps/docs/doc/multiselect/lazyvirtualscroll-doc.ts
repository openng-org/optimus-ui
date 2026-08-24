import { AppCodeModule } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectItem } from '@openng/optimus-ui/api';
import { MultiSelectModule } from '@openng/optimus-ui/multiselect';
import { MultiSelectLazyLoadEvent } from '@openng/optimus-ui/types/multiselect';

@Component({
    selector: 'lazyvirtualscroll-doc',
    standalone: true,
    imports: [FormsModule, MultiSelectModule, AppCodeModule, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                Enabling <i>lazy</i> on top of <i>virtualScroll</i> loads the options from a backend as they are scrolled into view. The <i>onLazyLoad</i> event carries the requested range along with the current <i>filter</i>, so filtering can be
                delegated to the backend as well. Options behind the current selection that the backend has not returned yet are supplied through <i>lazySelectedOptions</i>, which is what keeps their labels resolvable.
            </p>
        </app-docsectiontext>
        <div class="card flex justify-center">
            <p-multiselect
                [options]="items()"
                [(ngModel)]="selectedItems"
                optionLabel="label"
                optionValue="value"
                [lazySelectedOptions]="lazySelectedOptions"
                [filter]="true"
                [virtualScroll]="true"
                [virtualScrollItemSize]="43"
                [lazy]="true"
                (onLazyLoad)="onLazyLoad($event)"
                [loading]="loading()"
                placeholder="Select Items"
                [maxSelectedLabels]="3"
                class="w-full md:w-80"
            />
        </div>
        <app-code></app-code>
    `
})
export class LazyVirtualScrollDoc {
    // Simulates backend database
    backendItems: SelectItem[] = Array.from({ length: 10000 }, (_, i) => ({ label: `Item #${i}`, value: i }));

    // The selection is deliberately outside the first page, so its options have to be handed over upfront
    selectedItems: number[] = [5000, 7000];

    lazySelectedOptions: SelectItem[] = [this.backendItems[5000], this.backendItems[7000]];

    items = signal<SelectItem[] | null>(null);

    loading = signal<boolean>(false);

    loadLazyTimeout = null;

    currentFilter: string | null = null;

    onLazyLoad(event: MultiSelectLazyLoadEvent) {
        this.loading.set(true);

        if (this.loadLazyTimeout) {
            clearTimeout(this.loadLazyTimeout);
        }

        //imitate delay of a backend call
        this.loadLazyTimeout = setTimeout(
            () => {
                const { first, last, filter } = event;

                // Start over whenever the filter changes
                if (filter !== this.currentFilter) {
                    this.currentFilter = filter;
                    this.items.set(null);
                }

                // Simulate backend filtering
                const filteredBackendItems = filter ? this.backendItems.filter((item) => item.label.toLowerCase().includes(filter.toLowerCase())) : this.backendItems;

                // Create a sparse array of the total size if there is none yet, otherwise copy the existing one
                const items = this.items() ? [...this.items()] : (Array.from({ length: filteredBackendItems.length }) as SelectItem[]);

                // Populate only the requested range
                const slice = filteredBackendItems.slice(first, last);
                for (let i = 0; i < slice.length; i++) {
                    items[first + i] = slice[i];
                }

                this.items.set(items);
                this.loading.set(false);
            },
            Math.random() * 1000 + 250
        );
    }
}
