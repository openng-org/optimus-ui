import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Code } from '@/domain/code';
import { Component } from '@angular/core';

@Component({
    selector: 'accessibility-doc',
    standalone: true,
    imports: [AppCode, AppDocSectionText],
    template: ` <div>
        <app-docsectiontext>
            <h3>Screen Reader</h3>
            <p>
                ProgressBar components uses <i>progressbar</i> role along with <i>aria-valuemin</i>, <i>aria-valuemax</i> and <i>aria-valuenow</i> attributes. The value combined with the <i>unit</i> (e.g. "50%") is exposed through
                <i>aria-valuetext</i>. In indeterminate mode, or when no value is set, <i>aria-valuenow</i> and <i>aria-valuetext</i> are omitted. Value to describe the component can be defined using <i>aria-labelledby</i> and
                <i>aria-label</i> props.
            </p>
        </app-docsectiontext>

        <app-code [code]="code" [hideToggleCode]="true"></app-code>

        <h3>Keyboard Support</h3>
        <p>Not applicable.</p>
    </div>`
})
export class AccessibilityDoc {
    code: Code = {
        html: `<span id="label_status">Status</span>
<p-progressbar aria-labelledby="label_status" />

<p-progressbar aria-label="Status" />`
    };
}
