import { PROJECT_NAME } from '@/utils/constants';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'compatibility-doc',
    standalone: true,
    imports: [AppDocSectionText],
    changeDetection: ChangeDetectionStrategy.Eager,
    template: `
        <app-docsectiontext>
            <p>The compatible versions to choose the correct combination.</p>
            <div class="doc-tablewrapper">
                <table class="doc-table">
                    <tbody>
                        <tr>
                            <td>{{ PROJECT_NAME }} v18 and newer</td>
                            <td>PrimeFlex v4</td>
                        </tr>
                        <tr>
                            <td>{{ PROJECT_NAME }} v17 and older</td>
                            <td>PrimeFlex v3</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </app-docsectiontext>
    `
})
export class CompatibilityDoc {
    PROJECT_NAME = PROJECT_NAME;
}
