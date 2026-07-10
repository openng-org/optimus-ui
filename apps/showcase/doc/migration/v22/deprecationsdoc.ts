import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Component } from '@angular/core';

@Component({
    selector: 'v22-deprecations-doc',
    standalone: true,
    imports: [AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>The following APIs are deprecated in v22 and remain functional for backward compatibility. They are scheduled for removal in a future major version.</p>
            <ul class="leading-loose list-disc ml-6">
                <li>The lowercase <i>minlength</i> and <i>maxlength</i> inputs on form components are deprecated in favor of <i>minLength</i> and <i>maxLength</i>.</li>
            </ul>
        </app-docsectiontext>
    `
})
export class DeprecationsDoc {}
