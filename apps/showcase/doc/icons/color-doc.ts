import { AppCode } from '@/components/doc/app.code';
import { AppDemoWrapper } from '@/components/doc/app.demowrapper';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Code } from '@/domain/code';
import { Component } from '@angular/core';
import { Check } from '@primeicons/angular/check';
import { Times } from '@primeicons/angular/times';
import { Search } from '@primeicons/angular/search';
import { User } from '@primeicons/angular/user';

@Component({
    selector: 'color-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCode, AppDemoWrapper, Check, Times, Search, User],
    template: `
        <app-docsectiontext>
            <p>Icon color is defined with the <i>color</i> property which is inherited from parent by default.</p>
        </app-docsectiontext>
        <app-demo-wrapper>
            <div class="flex justify-center gap-4">
                <svg data-p-icon="check" color="slateblue"></svg>
                <svg data-p-icon="times" color="green"></svg>
                <svg data-p-icon="search" color="var(--primary-color)"></svg>
                <svg data-p-icon="user" color="#708090"></svg>
            </div>
            <app-code [code]="code" [hideToggleCode]="true"></app-code>
        </app-demo-wrapper>
    `
})
export class ColorDoc {
    code: Code = {
        html: `<svg data-p-icon="check" color="slateblue"></svg>
<svg data-p-icon="times" color="green"></svg>
<svg data-p-icon="search" color="var(--primary-color)"></svg>
<svg data-p-icon="user" color="#708090"></svg>`
    };
}
