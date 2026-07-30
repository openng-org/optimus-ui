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
    selector: 'basic-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCode, AppDemoWrapper, Check, Times, Search, User],
    template: `
        <app-docsectiontext>
            <p>Each icon is a standalone Angular component rendered as an inline SVG, displayed by importing it from <i>@primeicons/angular</i> and using it with the <i>data-p-icon</i> attribute.</p>
        </app-docsectiontext>
        <app-demo-wrapper>
            <div class="flex justify-center gap-4">
                <svg data-p-icon="check"></svg>
                <svg data-p-icon="times"></svg>
                <svg data-p-icon="search"></svg>
                <svg data-p-icon="user"></svg>
            </div>
            <app-code [code]="code" [hideToggleCode]="true"></app-code>
        </app-demo-wrapper>
    `
})
export class BasicDoc {
    code: Code = {
        typescript: `import { Component } from '@angular/core';
import { Check } from '@primeicons/angular/check';
import { Times } from '@primeicons/angular/times';
import { Search } from '@primeicons/angular/search';
import { User } from '@primeicons/angular/user';

@Component({
    selector: 'icons-basic-demo',
    template: \`
        <div class="flex justify-center gap-4">
            <svg data-p-icon="check"></svg>
            <svg data-p-icon="times"></svg>
            <svg data-p-icon="search"></svg>
            <svg data-p-icon="user"></svg>
        </div>
    \`,
    imports: [Check, Times, Search, User]
})
export class IconsBasicDemo {}`
    };
}
