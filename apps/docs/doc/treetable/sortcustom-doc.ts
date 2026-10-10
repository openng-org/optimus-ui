import { DeferredDemo } from '@/components/demo/deferreddemo';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { NodeService } from '@/service/nodeservice';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SortEvent, TreeNode } from '@openng/optimus-ui/api';
import { TreeTableModule } from '@openng/optimus-ui/treetable';

interface Column {
    field: string;
    header: string;
}

@Component({
    selector: 'sortcustom-doc',
    standalone: true,
    imports: [CommonModule, TreeTableModule, DeferredDemo, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                Custom sorting is enabled by setting <i>customSort</i> to true and defining a <i>sortFunction</i> that receives the nodes to sort along with the active field and order. Once enabled, the handler is responsible for sorting every
                column, and it is called once per level of the tree, so sorting the array it receives orders the whole hierarchy.
            </p>
            <p>The <i>Size</i> column holds values in mixed units that a textual comparison cannot rank, so the handler converts them to bytes.</p>
        </app-docsectiontext>
        <div class="card">
            <p-deferred-demo (load)="loadDemoData()">
                <p-treetable [value]="files" [columns]="cols" [customSort]="true" (sortFunction)="customSort($event)" [scrollable]="true" [tableStyle]="{ 'min-width': '50rem' }">
                    <ng-template #header let-columns>
                        <tr>
                            @for (col of columns; track col) {
                                <th [ttSortableColumn]="col.field">
                                    <div class="flex items-center gap-2">
                                        {{ col.header }}
                                        <p-treetable-sort-icon [field]="col.field" />
                                    </div>
                                </th>
                            }
                        </tr>
                    </ng-template>
                    <ng-template #body let-rowNode let-rowData="rowData" let-columns="columns">
                        <tr [ttRow]="rowNode">
                            @for (col of columns; let first = $first; track col) {
                                <td>
                                    @if (first) {
                                        <div class="flex items-center gap-2">
                                            <p-treetable-toggler [rowNode]="rowNode"></p-treetable-toggler>
                                            <span>{{ rowData[col.field] }}</span>
                                        </div>
                                    } @else {
                                        {{ rowData[col.field] }}
                                    }
                                </td>
                            }
                        </tr>
                    </ng-template>
                </p-treetable>
            </p-deferred-demo>
        </div>
        <app-code></app-code>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SortCustomDoc {
    files!: TreeNode[];

    cols!: Column[];

    constructor(private nodeService: NodeService) {}

    loadDemoData() {
        this.nodeService.getFilesystem().then((files) => (this.files = files));

        this.cols = [
            { field: 'name', header: 'Name' },
            { field: 'size', header: 'Size' },
            { field: 'type', header: 'Type' }
        ];
    }

    customSort(event: SortEvent) {
        event.data?.sort((node1: TreeNode, node2: TreeNode) => {
            const value1 = node1.data[event.field!];
            const value2 = node2.data[event.field!];
            const result = event.field === 'size' ? this.toBytes(value1) - this.toBytes(value2) : String(value1).localeCompare(String(value2));

            return (event.order ?? 1) * result;
        });
    }

    toBytes(size: string) {
        const units: { [unit: string]: number } = { b: 1, kb: 1e3, mb: 1e6, gb: 1e9 };
        const [, amount, unit] = /^(\d+(?:\.\d+)?)\s*(b|kb|mb|gb)$/i.exec(size) ?? [];

        return amount ? Number(amount) * units[unit.toLowerCase()] : 0;
    }
}
