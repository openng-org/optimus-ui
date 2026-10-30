import { DeferredDemo } from '@/components/demo/deferreddemo';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Product } from '@/domain/product';
import { ProductService } from '@/service/productservice';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TableModule } from '@openng/optimus-ui/table';

@Component({
    selector: 'removablesort-doc',
    standalone: true,
    imports: [TableModule, AppDocSectionText, AppCode, DeferredDemo],
    template: `
        <app-docsectiontext>
            <p>A third sort state that clears the sorting and restores the original data order is enabled by setting <i>removableSort</i> to true.</p>
        </app-docsectiontext>
        <p-deferred-demo (load)="loadDemoData()">
            <div class="card">
                <p-table [value]="products" [removableSort]="true">
                    <ng-template #header>
                        <tr>
                            <th pSortableColumn="code">
                                <div class="flex items-center gap-2">
                                    Code
                                    <p-sortIcon field="code" />
                                </div>
                            </th>
                            <th pSortableColumn="name">
                                <div class="flex items-center gap-2">
                                    Name
                                    <p-sortIcon field="name" />
                                </div>
                            </th>
                            <th pSortableColumn="category">
                                <div class="flex items-center gap-2">
                                    Category
                                    <p-sortIcon field="category" />
                                </div>
                            </th>
                            <th pSortableColumn="quantity">
                                <div class="flex items-center gap-2">
                                    Quantity
                                    <p-sortIcon field="quantity" />
                                </div>
                            </th>
                        </tr>
                    </ng-template>
                    <ng-template #body let-product>
                        <tr>
                            <td>{{ product.code }}</td>
                            <td>{{ product.name }}</td>
                            <td>{{ product.category }}</td>
                            <td>{{ product.quantity }}</td>
                        </tr>
                    </ng-template>
                </p-table>
            </div>
        </p-deferred-demo>
        <app-code [extFiles]="['Product']"></app-code>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RemovableSortDoc {
    products: Product[];

    constructor(private productService: ProductService) {}

    loadDemoData() {
        this.productService.getProductsMini().then((data) => {
            this.products = data;
        });
    }
}
