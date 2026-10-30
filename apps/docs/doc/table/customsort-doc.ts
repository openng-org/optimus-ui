import { DeferredDemo } from '@/components/demo/deferreddemo';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SortEvent } from '@openng/optimus-ui/api';
import { TableModule } from '@openng/optimus-ui/table';

interface FileInfo {
    name: string;
    type: string;
    size: string;
}

@Component({
    selector: 'customsort-doc',
    standalone: true,
    imports: [TableModule, AppDocSectionText, AppCode, DeferredDemo],
    template: `
        <app-docsectiontext>
            <p>
                Custom sorting is enabled by setting <i>customSort</i> to true and defining a <i>sortFunction</i> that receives the data to sort along with the active field and order. Once enabled, the handler is responsible for sorting every column.
            </p>
            <p>The <i>Size</i> column holds values in mixed units that a textual comparison cannot rank, so the handler converts them to bytes.</p>
        </app-docsectiontext>
        <p-deferred-demo (load)="loadDemoData()">
            <div class="card">
                <p-table [value]="files" [customSort]="true" (sortFunction)="customSort($event)" [tableStyle]="{ 'min-width': '50rem' }">
                    <ng-template #header>
                        <tr>
                            <th pSortableColumn="name" style="width:40%">
                                <div class="flex items-center gap-2">
                                    Name
                                    <p-sortIcon field="name" />
                                </div>
                            </th>
                            <th pSortableColumn="type" style="width:30%">
                                <div class="flex items-center gap-2">
                                    Type
                                    <p-sortIcon field="type" />
                                </div>
                            </th>
                            <th pSortableColumn="size" style="width:30%">
                                <div class="flex items-center gap-2">
                                    Size
                                    <p-sortIcon field="size" />
                                </div>
                            </th>
                        </tr>
                    </ng-template>
                    <ng-template #body let-file>
                        <tr>
                            <td>{{ file.name }}</td>
                            <td>{{ file.type }}</td>
                            <td>{{ file.size }}</td>
                        </tr>
                    </ng-template>
                </p-table>
            </div>
        </p-deferred-demo>
        <app-code></app-code>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomSortDoc {
    files!: FileInfo[];

    loadDemoData() {
        this.files = [
            { name: 'angular.app', type: 'Application', size: '10 MB' },
            { name: 'note-todo.txt', type: 'Text', size: '100 KB' },
            { name: 'backup.zip', type: 'Zip', size: '1.5 GB' },
            { name: 'resume.doc', type: 'Document', size: '25 KB' },
            { name: 'mobile.app', type: 'Application', size: '5 MB' }
        ];
    }

    customSort(event: SortEvent) {
        event.data?.sort((file1, file2) => {
            const value1 = file1[event.field!];
            const value2 = file2[event.field!];
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
