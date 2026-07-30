import { AppCode } from '@/components/doc/app.code';
import { AppDemoWrapper } from '@/components/doc/app.demowrapper';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Code } from '@/domain/code';
import { Component } from '@angular/core';
import { Cog, Spinner } from '@primeicons/angular';

@Component({
    selector: 'spin-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCode, AppDemoWrapper, Spinner, Cog],
    template: `
        <app-docsectiontext>
            <p>Use a spin animation utility like <i>animate-spin</i> from Tailwind apply rotation.</p>
        </app-docsectiontext>
        <app-demo-wrapper>
            <div class="flex justify-center gap-4">
                <svg data-p-icon="spinner" class="animate-spin" [size]="28"></svg>
                <svg data-p-icon="cog" class="animate-spin" [size]="28"></svg>
            </div>
            <app-code [code]="code" [hideToggleCode]="true"></app-code>
        </app-demo-wrapper>
    `
})
export class SpinDoc {
    code: Code = {
        html: `<svg data-p-icon="spinner" class="animate-spin" [size]="28"></svg>
<svg data-p-icon="cog" class="animate-spin" [size]="28"></svg>`
    };
}
