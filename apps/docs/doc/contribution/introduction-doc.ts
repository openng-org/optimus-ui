import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Code } from '@/domain/code';
import { Component } from '@angular/core';

@Component({
    selector: 'introduction-doc',
    standalone: true,
    imports: [AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>Optimus UI is a community-maintained Angular UI library, stewarded by OpenNG and dedicated to providing high-quality, versatile and accessible UI components that help developers build better applications faster.</p>
            <h3>Development Setup</h3>
            <p>To begin with, clone the Optimus UI repository from GitHub:</p>
            <app-code [code]="code1" [hideToggleCode]="true" [hideStackBlitz]="true"></app-code>
            <p style="margin-top: 1rem;">Then run the documentation app in your local environment at <i>http://localhost:4200/</i>.</p>
            <app-code [code]="code2" [hideToggleCode]="true" [hideStackBlitz]="true"></app-code>
            <h3>Project Structure</h3>
            <p>Optimus UI's project structure is organized as follows:</p>
            <app-code [code]="code3" [hideToggleCode]="true" [hideStackBlitz]="true"></app-code>
        </app-docsectiontext>
    `
})
export class IntroductionDoc {
    code1: Code = {
        typescript: `git clone https://github.com/openng-org/optimus-ui.git
cd optimus-ui`
    };
    code2: Code = {
        typescript: `pnpm install
pnpm run dev`
    };
    code3: Code = {
        typescript: `- apps
  - docs                       // this documentation website
  - tailwind-playgrounds       // Tailwind integration sandboxes
- packages
  - optimus-ui                 // components, directives and services
  - optimus-ui-themes          // built-in theme presets
  - optimus-ui-styled          // styled-mode theming engine
  - optimus-ui-styles          // base styles
  - optimus-ui-tailwindcss     // Tailwind CSS plugin
  - optimus-ui-locale          // i18n locales
  - optimus-ui-motion          // animation utilities
  - optimus-ui-utils           // shared helpers`
    };
}
