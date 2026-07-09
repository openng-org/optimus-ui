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
        typescript: `import { BadgeModule } from 'primeng/badge';
import { OverlayBadgeModule } from 'primeng/overlaybadge';`
    };

    usageCode: Code = {
        html: `<p-badge />`
    };
}
