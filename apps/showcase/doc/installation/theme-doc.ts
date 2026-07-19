import { Code } from '@/domain/code';
import { Component } from '@angular/core';

@Component({
    selector: 'theme-doc',
    template: `
        <app-docsectiontext>
            <p>Configure Optimus UI to use a theme like Aura.</p>
            <app-code [code]="code" [hideToggleCode]="true"></app-code>
        </app-docsectiontext>
    `
})
export class ThemeDoc {
    code: Code = {
        typescript: `import { ApplicationConfig } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideOptimus } from '@openng/optimus-ui/config';
import Aura from '@openng/optimus-ui-themes/aura';

export const appConfig: ApplicationConfig = {
    providers: [
        provideAnimationsAsync(),
        provideOptimus({
            theme: Aura
        })
    ]
};`
    };
}
