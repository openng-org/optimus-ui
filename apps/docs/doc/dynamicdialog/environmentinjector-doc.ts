import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Code } from '@/domain/code';
import { Component } from '@angular/core';

@Component({
    selector: 'environment-injector-doc',
    standalone: true,
    imports: [AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>When dialog content depends on providers from a feature or lazy-loaded environment, pass the caller's <i>EnvironmentInjector</i> in the dialog configuration.</p>
        </app-docsectiontext>
        <app-code [code]="code" [hideToggleCode]="true"></app-code>
    `
})
export class EnvironmentInjectorDoc {
    code: Code = {
        typescript: `
import { Component, EnvironmentInjector, inject } from '@angular/core';
import { DialogService } from '@openng/optimus-ui/dynamicdialog';
import { FeatureDialogComponent } from './feature-dialog.component';

@Component({
    template: \`<button (click)="openDialog()">Open</button>\`,
    providers: [DialogService]
})
export class FeaturePageComponent {
    private readonly dialogService = inject(DialogService);
    private readonly environmentInjector = inject(EnvironmentInjector);

    openDialog() {
        this.dialogService.open(FeatureDialogComponent, {
            environmentInjector: this.environmentInjector
        });
    }
}`
    };
}
