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
                The recommended way to migrate is the <i>migrate-from-primeng</i> schematic. Install <i>&#64;openng/optimus-ui</i> first so the Angular CLI can resolve it, then run the schematic: packages are swapped, imports are rewritten and
                dependencies are installed.
            </p>
            <app-code [code]="migrateCode" [hideToggleCode]="true"></app-code>
            <p>
                The <i>&#64;1</i> pin matters: this repo's <i>latest</i> npm tag points at the current major, not this one, so an unpinned install resolves to the wrong Angular peer requirements.
            </p>
            <p>
                Note that <i>ng add</i> does not run the migration. It only sets up Optimus UI in a fresh project and makes no changes when <i>primeng</i> is detected. The schematic can be re-run at any time, for example after pulling in unmigrated
                code, and accepts a couple of flags. <i>--skip-install</i> skips the package install task and <i>--force</i> bypasses the PrimeNG v21 version check.
            </p>
            <app-code [code]="flagsCode" [hideToggleCode]="true"></app-code>
            <p>
                After rewriting, the schematic scans the workspace and prints a report of any remaining <i>primeng</i>, <i>primeicons</i> or <i>&#64;primeuix</i> references it could not migrate automatically, with file and line numbers. Review these
                manually using the tables in the manual migration section below.
            </p>
            <p>
                Files your <i>.gitignore</i> excludes are left alone, so coverage reports and build output are neither rewritten nor reported. The report itself is printed before the CLI lists the files it created and updated — that list only covers
                what the migration changed for you, so scroll back up to the warnings before you build.
            </p>
        </app-docsectiontext>
    `
})
export class AutomatedDoc {
    migrateCode: Code = {
        command: `npm install @openng/optimus-ui@1
ng generate @openng/optimus-ui@1:migrate-from-primeng`
    };

    flagsCode: Code = {
        command: `ng generate @openng/optimus-ui@1:migrate-from-primeng --skip-install
ng generate @openng/optimus-ui@1:migrate-from-primeng --force`
    };
}
