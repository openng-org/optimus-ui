import { AppCode } from '@/components/doc/app.code';
import { AppDemoWrapper } from '@/components/doc/app.demowrapper';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Code } from '@/domain/code';
import { Component, signal } from '@angular/core';
import { Check } from '@primeicons/angular/check';
import { Times } from '@primeicons/angular/times';
import { Search } from '@primeicons/angular/search';
import { User } from '@primeicons/angular/user';
import { PIcon } from '@primeicons/angular/p-icon';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'color-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCode, AppDemoWrapper, Check, Times, Search, User, PIcon, ButtonModule],
    template: `
        <app-docsectiontext>
            <p>An icon can be rendered programmatically by binding its name to the <i>pIcon</i> attribute, so the displayed icon can be changed at runtime from a variable.</p>
        </app-docsectiontext>
        <app-demo-wrapper>
            <div class="flex flex-col items-center gap-4">
                <svg [pIcon]="selectedIcon()" [size]="32"></svg>
                <div class="flex gap-2">
                    @for (icon of icons; track icon) {
                        <p-button [text]="selectedIcon() !== icon" severity="secondary" (onClick)="selectedIcon.set(icon)">
                            <svg [pIcon]="icon"></svg>
                        </p-button>
                    }
                </div>
            </div>
            <app-code [code]="code" [hideToggleCode]="true"></app-code>
        </app-demo-wrapper>
    `
})
export class ProgrammaticDoc {
    icons = ['home', 'star', 'heart', 'bell'];
    selectedIcon = signal<string>('home');

    code: Code = {
        typescript: `import { Component, signal } from '@angular/core';
import { PIcon } from '@primeicons/angular/p-icon';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'icons-programmatic-demo',
    template: \`
        <div class="flex flex-col items-center gap-4">
            <svg [pIcon]="selectedIcon()" [size]="32"></svg>
            <div class="flex gap-2">
                @for (icon of icons; track icon) {
                    <p-button [text]="selectedIcon() !== icon" severity="secondary" (onClick)="selectedIcon.set(icon)">
                        <svg [pIcon]="icon"></svg>
                    </p-button>
                }
            </div>
        </div>
    \`,
    imports: [PIcon, ButtonModule]
})
export class IconsProgrammaticDemo {
    icons = ['home', 'star', 'heart', 'bell'];

    selectedIcon = signal<string>('home');
}`
    };
}
