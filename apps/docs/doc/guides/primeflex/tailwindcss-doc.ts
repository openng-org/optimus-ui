import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'tailwindcss-doc',
    standalone: true,
    imports: [AppDocSectionText, RouterModule],
    template: `
        <app-docsectiontext>
            <p>
                Tailwind CSS is the replacement we suggest. This documentation site is itself built with it, and we publish <i>&#64;openng/optimus-ui-tailwindcss</i> for first-class integration — a plugin that teaches Tailwind about the theme's
                design tokens and puts the component styles in a cascade layer you can override cleanly.
            </p>
            <p>See the <a [routerLink]="'/tailwind'" class="doc-link">Tailwind CSS guide</a> for setup with either Tailwind v3 or v4, and the next section for converting existing PrimeFlex classes.</p>
        </app-docsectiontext>
    `
})
export class TailwindCSSDoc {}
