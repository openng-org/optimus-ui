import { OPTIMUS_UI_DESIGN_URL } from '@/utils/constants';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'visualtooling-doc',
    standalone: true,
    imports: [AppDocSectionText, RouterModule],
    template: `
        <app-docsectiontext>
            <p>
                Optimus UI does not ship a visual theme designer: presets are written in code with <i>definePreset</i>. If you would rather start from something you can see, the community-built
                <a [href]="designUrl" target="_blank" rel="noopener noreferrer">Optimus UI Design Marketplace</a> lets you design a theme visually, fork existing designs and share your own, then bring the result back as a preset.
            </p>
            <p>It is a community project, not maintained by OpenNG. More projects like it are listed under <a [routerLink]="'/ecosystem'" class="doc-link">Community Projects</a>.</p>
        </app-docsectiontext>
    `
})
export class VisualToolingDoc {
    readonly designUrl = OPTIMUS_UI_DESIGN_URL;
}
