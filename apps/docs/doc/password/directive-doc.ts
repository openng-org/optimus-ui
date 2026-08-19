import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from '@openng/optimus-ui/password';

@Component({
    selector: 'directive-doc',
    standalone: true,
    imports: [FormsModule, PasswordModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                The <i>pPassword</i> directive adds strength meter feedback to any native <i>input</i> element. Applying it directly to an <i>input</i> is useful when you need full control over native attributes such as <i>autocomplete</i>. Setting
                <i>autocomplete</i> to <i>"new-password"</i> tells the browser this field expects a new password, preventing it from autofilling with saved credentials.
            </p>
        </app-docsectiontext>
        <div class="card flex justify-center">
            <input type="password" pPassword [(ngModel)]="value" autocomplete="new-password" placeholder="New password" />
        </div>
        <app-code></app-code>
    `
})
export class DirectiveDoc {
    value!: string;
}
