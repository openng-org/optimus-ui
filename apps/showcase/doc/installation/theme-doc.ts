import { PROJECT_NAME } from '@/utils/constants';
import { Code } from '@/domain/code';
import { Component } from '@angular/core';

@Component({
    selector: 'theme-doc',
    template: `
        <app-docsectiontext>
            <p>Configure {{ PROJECT_NAME }} to use a theme like Aura.</p>
            <app-code [code]="code" [hideToggleCode]="true"></app-code>
        </app-docsectiontext>
    `
})
export class ThemeDoc {
    PROJECT_NAME = PROJECT_NAME;

    code: Code = {
        typescript: `import { ApplicationConfig } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';

export const appConfig: ApplicationConfig = {
    providers: [
        provideAnimationsAsync(),
        providePrimeNG({
            theme: Aura
        })
    ]
};`
    };
}
