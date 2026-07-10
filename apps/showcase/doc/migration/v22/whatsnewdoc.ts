import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'v22-whatsnew-doc',
    standalone: true,
    imports: [AppDocSectionText, RouterModule],
    template: `
        <app-docsectiontext>
            <p>PrimeNG v22 targets Angular 22 and focuses on first-class support for Angular's new Signal Forms while continuing the migration to modern signal-based APIs.</p>
            <ul class="leading-loose list-disc ml-6">
                <li>
                    <b>Signal Forms support.</b> Form components integrate with the new <i>[formField]</i> directive from <i>&#64;angular/forms/signals</i>, while remaining fully compatible with template-driven (<i>ngModel</i>) and reactive
                    (<i>formControl</i>) forms through the same <i>ControlValueAccessor</i>. The three form paradigms can be used interchangeably.
                </li>
                <li>
                    Form components automatically bind the field state exposed by the <i>[formField]</i> directive: <i>readonly</i>, <i>touched</i>, <i>errors</i>, <i>required</i>, <i>invalid</i>, <i>minLength</i>, <i>maxLength</i> and
                    <i>pattern</i>.
                </li>
                <li>
                    The <i>pattern</i> input now accepts a string, a <i>RegExp</i> or an array of patterns and is normalized to <i>readonly RegExp[]</i>, matching the Angular <i>FormValueControl</i> contract. New <i>minLength</i>/<i>maxLength</i>
                    inputs replace the lowercase <i>minlength</i>/<i>maxlength</i>.
                </li>
                <li>DatePicker honors the Signal Forms <i>min</i>/<i>max</i> constraints as its selectable date range.</li>
                <li>Continued migration to signal-based APIs (<i>input()</i>, <i>output()</i>, <i>viewChild()</i>, <i>model()</i>), <i>host</i> metadata bindings and built-in control flow (<i>&#64;if</i>/<i>&#64;for</i>).</li>
            </ul>
        </app-docsectiontext>
    `
})
export class WhatsNewDoc {}
