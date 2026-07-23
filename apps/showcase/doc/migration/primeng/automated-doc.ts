import { Code } from '@/domain/code';
import { Component } from '@angular/core';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { AppCode } from '@/components/doc/app.code';

@Component({
    selector: 'automated-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCode],
    template: `
        <app-docsectiontext>
            <p>
                The recommended way to migrate is a single command. When <i>ng add</i> detects an existing <i>primeng</i> dependency, it runs the full migration instead of a fresh install: packages are swapped, imports are rewritten and dependencies
                are installed.
            </p>
            <app-code [code]="ngAddCode" [hideToggleCode]="true"></app-code>
            <p>
                The migration can also be executed directly, for example to re-run it after pulling in unmigrated code, or together with its flags. <i>--skip-install</i> skips the package install task and <i>--force</i> bypasses the PrimeNG v21
                version check.
            </p>
            <app-code [code]="schematicCode" [hideToggleCode]="true"></app-code>
            <p>
                After rewriting, the schematic scans the workspace and prints a report of any remaining <i>primeng</i>, <i>primeicons</i> or <i>&#64;primeuix</i> references it could not migrate automatically, with file and line numbers. Review these
                manually using the tables in the manual migration section below.
            </p>
        </app-docsectiontext>
    `
})
export class AutomatedDoc {
    ngAddCode: Code = {
        command: `ng add @openng/optimus-ui`
    };

    schematicCode: Code = {
        command: `ng generate @openng/optimus-ui:migrate-from-primeng

# Available flags
ng generate @openng/optimus-ui:migrate-from-primeng --skip-install
ng generate @openng/optimus-ui:migrate-from-primeng --force`
    };
}
