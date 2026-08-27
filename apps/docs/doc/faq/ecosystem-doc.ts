import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'faq-ecosystem-doc',
    standalone: true,
    imports: [AppDocSectionText, RouterModule],
    template: `
        <app-docsectiontext>
            <h3>Do the PrimeNG themes work?</h3>
            <p>
                The built-in presets do — Aura, Material, Lara and Nora ship in <i>&#64;openng/optimus-ui-themes</i> and are configured the same way. A preset you wrote yourself against PrimeNG v21 will work after the import paths are updated, which
                the migration schematic handles.
            </p>

            <h3>What about the Theme Designer, templates and blocks?</h3>
            <p>
                Those are PrimeTek's commercial products. They were never MIT licensed, so they are not part of this fork and we will not be reimplementing them. Theming in Optimus UI means editing preset objects in code, which is documented in full
                under <a [routerLink]="'/theming/styled'" class="doc-link">styled mode</a>.
            </p>

            <h3>What replaced PrimeIcons?</h3>
            <p>
                <a [routerLink]="'/icons'" class="doc-link">OpenNG Icons</a>, installed as <i>&#64;openng/icons</i>. The <i>pi pi-&#123;icon&#125;</i> class names are unchanged, so templates do not need editing — only the package name and the
                stylesheet import, both of which the migration schematic rewrites.
            </p>

            <h3>What about PrimeFlex?</h3>
            <p>
                PrimeFlex is not maintained here. We suggest Tailwind CSS instead, and ship <i>&#64;openng/optimus-ui-tailwindcss</i> for first-class integration — see the <a [routerLink]="'/tailwind'" class="doc-link">Tailwind guide</a>. The
                <a [routerLink]="'/guides/primeflex'" class="doc-link">PrimeFlex guide</a> covers moving across.
            </p>

            <h3>Does Optimus UI work with SSR?</h3>
            <p>This documentation site is itself an Angular SSR application built on Optimus UI, prerendered at build time. So yes, and any regression there tends to be noticed quickly.</p>
        </app-docsectiontext>
    `
})
export class FaqEcosystemDoc {}
