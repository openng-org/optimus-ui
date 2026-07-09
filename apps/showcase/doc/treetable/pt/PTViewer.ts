import { AppDocPtViewer, getPTOptions } from '@/components/doc/app.docptviewer';
import { NodeService } from '@/service/nodeservice';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ChangeDetectionStrategy } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { TreeTableModule } from 'primeng/treetable';

@Component({
    selector: 'treetable-pt-viewer',
    standalone: true,
    imports: [CommonModule, AppDocPtViewer, TreeTableModule],
    changeDetection: ChangeDetectionStrategy.Eager,
    template: `
        <app-docptviewer [docs]="docs">
            <p-treetable [value]="nodes">
                <ng-template #header>
                    <tr>
                        <th>Name</th>
                        <th>Size</th>
                        <th>Type</th>
                    </tr>
                </ng-template>
                <ng-template #body let-rowNode let-rowData="rowData">
                    <tr [ttRow]="rowNode">
                        <td>
                            <p-treetable-toggler [rowNode]="rowNode" />
                            {{ rowData.name }}
                        </td>
                        <td>{{ rowData.size }}</td>
                        <td>{{ rowData.type }}</td>
                    </tr>
                </ng-template>
            </p-treetable>
        </app-docptviewer>
    `
})
export class PTViewer {
    nodes!: TreeNode[];

    docs = [
        {
            data: getPTOptions('TreeTable'),
            key: 'TreeTable'
        }
    ];

    constructor(
        private nodeService: NodeService,
        private cd: ChangeDetectorRef
    ) {}

    ngOnInit() {
        this.nodeService.getFilesystem().then((data) => {
            this.nodes = data;
            this.cd.markForCheck();
        });
    }
}
