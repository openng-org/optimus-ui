import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'v22-breaking-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCode, RouterModule],
    template: `
        <app-docsectiontext>
            <p>PrimeNG v22 keeps the no-breaking-change policy for incremental updates where possible. The changes below are the exceptions to be aware of when upgrading from v21.</p>

            <h3>Inputs are now read-only signal inputs</h3>
            <p>
                As part of the migration to Angular's signal APIs, component and directive inputs are declared with <i>input()</i> and therefore return a read-only <i>InputSignal</i>. Setting an input <b>imperatively</b> from outside the component no
                longer works — you must bind the value through the template instead. This affects code that injected a PrimeNG component or directive (for example <i>BaseIcon</i>) and assigned to its input property directly.
            </p>
            <app-code [code]="importCode" [hideToggleCode]="true" [hideStackBlitz]="true"></app-code>
            <p>Bind the value from the template instead:</p>
            <app-code [code]="fixCode" [hideToggleCode]="true" [hideStackBlitz]="true"></app-code>
            <p>
                This also affects reading input values: properties like <i>PrimeTemplate.type</i> and <i>PrimeTemplate.name</i> are now signals, so code that queries templates with <i>&#64;ContentChildren(PrimeTemplate)</i> and compares
                <i>template.type === 'header'</i> must call the signal instead — <i>template.type() === 'header'</i> (or keep using <i>template.getType()</i>, which is unchanged). A plain property access compiles but silently compares against the
                signal function itself, never matching.
            </p>

            <h3>Form inputs</h3>
            <p>
                The lowercase <i>minlength</i>/<i>maxlength</i> inputs are deprecated in favor of <i>minLength</i>/<i>maxLength</i> (the names bound by the Signal Forms <i>[formField]</i> directive). The <i>pattern</i> input now accepts a string, a
                <i>RegExp</i> or an array of patterns and is normalized to <i>readonly RegExp[]</i> to match the Angular <i>FormValueControl</i> contract; reading <i>pattern()</i> returns a <i>RegExp</i> array rather than a string.
            </p>
            <p>
                Components that previously declared their own <i>readonly</i> input with a <i>false</i> default (Knob, Rating, InputOtp, Editor) now inherit it from <i>BaseEditableHolder</i>, whose default is <i>undefined</i>. Behavior is unchanged
                for bindings and truthiness checks, but code comparing strictly against <i>false</i> (<i>readonly() === false</i>) must be updated.
            </p>

            <p>Other than these cases, v22 should be a drop-in replacement on Angular 22. If you face any issues during the upgrade, please report an issue at GitHub.</p>
        </app-docsectiontext>
    `
})
export class BreakingDoc {
    importCode = {
        typescript: `// No longer works in v22 — inputs are read-only InputSignals
export class IconDirective implements OnInit {
    private readonly baseIcon = inject(BaseIcon);

    ngOnInit(): void {
        this.baseIcon.spin = true;        // ❌ cannot assign to an InputSignal
        this.baseIcon.spin.set(true);     // ❌ set() only exists on model(), not input()
    }
}`
    };

    fixCode = {
        html: `<svg data-p-icon="spinner" [spin]="isSpinning" />`
    };
}
