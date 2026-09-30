import { DeferredDemo } from '@/components/demo/deferreddemo';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { NodeService } from '@/service/nodeservice';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TreeNode } from '@openng/optimus-ui/api';
import { InputTextModule } from '@openng/optimus-ui/inputtext';
import { TreeTableModule } from '@openng/optimus-ui/treetable';

interface Column {
    field: string;
    header: string;
}

@Component({
    selector: 'edit-doc',
    standalone: true,
    imports: [FormsModule, TreeTableModule, InputTextModule, DeferredDemo, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>Incell editing is enabled by defining input elements with <i>treeTableCellEditor</i>.</p>
        </app-docsectiontext>
        <div class="card">
            <p-deferred-demo (load)="loadDemoData()">
                <p-treetable [value]="files" [columns]="cols" [scrollable]="true" [tableStyle]="{ 'min-width': '50rem' }">
                    <ng-template #header let-columns>
                        <tr>
                            @for (col of columns; track col) {
                                <th>
                                    {{ col.header }}
                                </th>
                            }
                        </tr>
                    </ng-template>
                    <ng-template #body let-rowNode let-rowData="rowData" let-columns="columns">
                        <tr [ttRow]="rowNode">
                            @for (col of columns; let first = $first; track col) {
                                <td ttEditableColumn [ttEditableColumnDisabled]="first" [class.p-toggler-column]="first">
                                    @if (first) {
                                        <p-treetable-toggler [rowNode]="rowNode"></p-treetable-toggler>
                                    }
                                    <p-treetable-cell-editor>
                                        <ng-template pTemplate="input">
                                            <input pInputText type="text" [(ngModel)]="rowData[col.field]" />
                                        </ng-template>
                                        <ng-template pTemplate="output">{{ rowData[col.field] }}</ng-template>
                                    </p-treetable-cell-editor>
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
export class EditDoc {
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
}
