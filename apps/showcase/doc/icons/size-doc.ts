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
    selector: 'size-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCode, AppDemoWrapper, Check, Times, Search, User],
    template: `
        <app-docsectiontext>
            <p>Size of an icon is controlled with the <i>size</i> property that accepts a number in pixels or any CSS length value.</p>
        </app-docsectiontext>
        <app-demo-wrapper>
            <div class="flex justify-center items-center gap-4">
                <svg data-p-icon="check" [size]="16"></svg>
                <svg data-p-icon="times" [size]="24"></svg>
                <svg data-p-icon="search" [size]="32"></svg>
                <svg data-p-icon="user" [size]="40"></svg>
            </div>
            <app-code [code]="code" [hideToggleCode]="true"></app-code>
        </app-demo-wrapper>
    `
})
export class SizeDoc {
    code: Code = {
        html: `<svg data-p-icon="check" [size]="16"></svg>
<svg data-p-icon="times" [size]="24"></svg>
<svg data-p-icon="search" [size]="32"></svg>
<svg data-p-icon="user" [size]="40"></svg>`
    };
}
