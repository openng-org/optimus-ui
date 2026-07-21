import { Code } from '@/domain/code';
import { Component } from '@angular/core';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { AppCode } from '@/components/doc/app.code';

@Component({
    selector: 'manual-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCode],
    template: `
        <app-docsectiontext>
            <p>If you prefer to migrate by hand, or need to finish references the schematic reported as leftovers, apply the renames below. Start by replacing the packages.</p>
            <app-code [code]="installCode" [hideToggleCode]="true"></app-code>
            <h3>Packages</h3>
            <p>Replace the packages in <i>package.json</i> and in every import path. Subpath imports keep their suffix, for example <i>primeng/button</i> becomes <i>&#64;openng/optimus-ui/button</i>.</p>
        </app-docsectiontext>
        <div class="doc-tablewrapper">
            <table class="doc-table">
                <thead>
                    <tr>
                        <th>PrimeNG</th>
                        <th>Optimus UI</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>primeng</td>
                        <td>&#64;openng/optimus-ui</td>
                    </tr>
                    <tr>
                        <td>primeicons</td>
                        <td>&#64;openng/icons</td>
                    </tr>
                    <tr>
                        <td>&#64;primeuix/themes</td>
                        <td>&#64;openng/optimus-ui-themes</td>
                    </tr>
                    <tr>
                        <td>&#64;primeuix/styled</td>
                        <td>&#64;openng/optimus-ui-styled</td>
                    </tr>
                    <tr>
                        <td>&#64;primeuix/styles</td>
                        <td>&#64;openng/optimus-ui-styles</td>
                    </tr>
                    <tr>
                        <td>&#64;primeuix/utils</td>
                        <td>&#64;openng/optimus-ui-utils</td>
                    </tr>
                    <tr>
                        <td>&#64;primeuix/motion</td>
                        <td>&#64;openng/optimus-ui-motion</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <app-docsectiontext>
            <h3>Identifiers</h3>
            <p>Rename the following exported identifiers. The <i>PrimeIcons</i> constants class still compiles through a deprecated alias, however <i>OpenngIcons</i> is the current API.</p>
        </app-docsectiontext>
        <div class="doc-tablewrapper">
            <table class="doc-table">
                <thead>
                    <tr>
                        <th>PrimeNG</th>
                        <th>Optimus UI</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>providePrimeNG</td>
                        <td>provideOptimus</td>
                    </tr>
                    <tr>
                        <td>PrimeNG</td>
                        <td>Optimus</td>
                    </tr>
                    <tr>
                        <td>PrimeNGConfigType</td>
                        <td>OptimusConfigType</td>
                    </tr>
                    <tr>
                        <td>PrimeIcons</td>
                        <td>OpenngIcons</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <app-docsectiontext>
            <h3>Assets</h3>
            <p>
                The PrimeIcons stylesheet moved along with the package rename. Update references in global stylesheets and in the <i>styles</i> arrays of <i>angular.json</i> or <i>project.json</i> from <i>primeicons/primeicons.css</i> to
                <i>&#64;openng/icons/openng-icons.css</i>.
            </p>
            <h3>Example</h3>
            <p>A typical <i>app.config.ts</i> and component before the migration.</p>
            <app-code [code]="beforeCode" [hideToggleCode]="true"></app-code>
            <p>The same code after the migration.</p>
            <app-code [code]="afterCode" [hideToggleCode]="true"></app-code>
        </app-docsectiontext>
    `
})
export class ManualDoc {
    installCode: Code = {
        command: `# Using npm
npm uninstall primeng primeicons @primeuix/themes
npm install @openng/optimus-ui @openng/optimus-ui-themes @openng/icons

# Using pnpm
pnpm remove primeng primeicons @primeuix/themes
pnpm add @openng/optimus-ui @openng/optimus-ui-themes @openng/icons`
    };

    beforeCode: Code = {
        typescript: `import { ApplicationConfig } from '@angular/core';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';

export const appConfig: ApplicationConfig = {
    providers: [
        providePrimeNG({
            theme: {
                preset: Aura
            }
        })
    ]
};

// component
import { ButtonModule } from 'primeng/button';`
    };

    afterCode: Code = {
        typescript: `import { ApplicationConfig } from '@angular/core';
import { provideOptimus } from '@openng/optimus-ui/config';
import Aura from '@openng/optimus-ui-themes/aura';

export const appConfig: ApplicationConfig = {
    providers: [
        provideOptimus({
            theme: {
                preset: Aura
            }
        })
    ]
};

// component
import { ButtonModule } from '@openng/optimus-ui/button';`
    };
}
