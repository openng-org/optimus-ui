import { Code } from '@/domain/code';
import { Component } from '@angular/core';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { AppCode } from '@/components/doc/app.code';

@Component({
    selector: 'update-major-versions-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCode],
    template: `
        <app-docsectiontext>
            <p>Each Optimus UI major targets a single Angular major.</p>
            <table class="doc-table">
                <thead>
                    <tr>
                        <th>Optimus UI</th>
                        <th>Angular</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>v2</td>
                        <td>v22</td>
                    </tr>
                    <tr>
                        <td>v1</td>
                        <td>v21</td>
                    </tr>
                </tbody>
            </table>
            <p>
                To move to a new major, update Angular first — the <a href="https://angular.dev/update-guide" target="_blank" rel="noopener noreferrer">Angular update guide</a> covers that step — then update Optimus UI to the matching major by
                passing the target version. For example, from v1 on Angular v21:
            </p>
            <app-code [code]="code" [hideToggleCode]="true"></app-code>
            <p>Review the release notes of the target version for breaking changes before you start.</p>
        </app-docsectiontext>
    `
})
export class MajorVersionsDoc {
    code: Code = {
        command: `ng update @angular/core@22 @angular/cli@22
ng update @openng/optimus-ui@2`
    };
}
