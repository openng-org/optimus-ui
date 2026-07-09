import { Code } from '@/domain/code';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AppCode } from '@/components/doc/app.code';

@Component({
    selector: 'usage-doc',
    standalone: true,
    imports: [AppCode],
    changeDetection: ChangeDetectionStrategy.Eager,
    template: `
        <app-code [code]="importCode" [hideToggleCode]="true"></app-code>
        <app-code [code]="usageCode" [hideToggleCode]="true"></app-code>
    `
})
export class UsageDoc {
    importCode: Code = {
        typescript: `import { FilterService } from 'primeng/api';`
    };

    usageCode: Code = {
        typescript: `export class MyComponent {
    constructor(private filterService: FilterService) {}
}`
    };
}
