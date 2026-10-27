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
            <p style="margin-top: 1rem;">
                Install the dependencies, build the <i>optimus-ui-*</i> packages and generate the API and demo data used by the documentation app, then run it in your local environment at <i>http://localhost:4200/</i>. Run
                <i>pnpm run bootstrap</i> again after changing or pulling changes to a <i>packages/optimus-ui-*</i> package.
            </p>
            <app-code [code]="code2" [hideToggleCode]="true" [hideStackBlitz]="true"></app-code>
            <h3>Running Tests</h3>
            <p>Unit tests run with Vitest in headless Chromium through Playwright. Install the browser once, then run all unit tests or a single test file.</p>
            <app-code [code]="code4" [hideToggleCode]="true" [hideStackBlitz]="true"></app-code>
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
        typescript: `pnpm install          # install dependencies and git hooks
pnpm run bootstrap    # build the optimus-ui-* packages, generate API and demo data
pnpm run dev          # run the documentation app`
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
    code4: Code = {
        typescript: `# install the browser once
pnpm --filter @openng/optimus-ui exec playwright install chromium

# all unit tests
pnpm run test:unit

# a single test file
pnpm --filter @openng/optimus-ui test:unit --include=src/select/select.test.ts`
    };
}
