import { PROJECT_NAME, GITHUB_REPO_URL } from '@/utils/constants';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Code } from '@/domain/code';
import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'introduction-doc',
    standalone: true,
    imports: [AppCode, AppDocSectionText],
    changeDetection: ChangeDetectionStrategy.Eager,
    template: `
        <app-docsectiontext>
            <p>
                {{ PROJECT_NAME }} is a popular Angular UI library maintained by PrimeTek, a company renowned for its comprehensive set of UI components for various frameworks. PrimeTek is dedicated to providing high-quality, versatile, and
                accessible UI components that help developers build better applications faster.
            </p>
            <h3>Development Setup</h3>
            <p>To begin with, clone the {{ PROJECT_NAME }} repository from GitHub:</p>
            <app-code [code]="code1" [hideToggleCode]="true" [hideStackBlitz]="true"></app-code>
            <p style="margin-top: 1rem;">Then run the showcase in your local environment at <i>http://localhost:3000/</i>.</p>
            <app-code [code]="code2" [hideToggleCode]="true" [hideStackBlitz]="true"></app-code>
            <h3>Project Structure</h3>
            <p>{{ PROJECT_NAME }}'s project structure is organized as follows:</p>
            <app-code [code]="code3" [hideToggleCode]="true" [hideStackBlitz]="true"></app-code>
        </app-docsectiontext>
    `
})
export class IntroductionDoc {
    PROJECT_NAME = PROJECT_NAME;
    GITHUB_REPO_URL = GITHUB_REPO_URL;

    code1: Code = {
        typescript: `git clone {{ GITHUB_REPO_URL }}
cd primeng`
    };
    code2: Code = {
        typescript: `pnpm run setup
pnpm run dev`
    };
    code3: Code = {
        typescript: `- app
  - showcase                // website
  - components              // main directory of components and directives`
    };
}
