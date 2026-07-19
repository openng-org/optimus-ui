import { Code } from '@/domain/code';
import { Component } from '@angular/core';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { AppCode } from '@/components/doc/app.code';

@Component({
    selector: 'download-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCode],
    template: `
        <app-docsectiontext>
            <p>Optimus UI is available for download on the <a href="https://www.npmjs.com/package/@openng/optimus-ui">npm registry</a>.</p>
        </app-docsectiontext>
        <app-code [code]="code" [hideToggleCode]="true"></app-code>
    `
})
export class DownloadDoc {
    code: Code = {
        command: `# Using npm
npm install @openng/optimus-ui @openng/optimus-ui-themes

# Using yarn
yarn add @openng/optimus-ui @openng/optimus-ui-themes

# Using pnpm
pnpm add @openng/optimus-ui @openng/optimus-ui-themes`
    };
}
