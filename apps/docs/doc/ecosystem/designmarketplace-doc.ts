import { OPTIMUS_UI_DESIGN_REPO_URL, OPTIMUS_UI_DESIGN_URL } from '@/utils/constants';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from '@openng/optimus-ui/button';

@Component({
    selector: 'design-marketplace-doc',
    standalone: true,
    imports: [AppDocSectionText, ButtonModule, RouterModule],
    template: `
        <app-docsectiontext>
            <p>
                <a [href]="designUrl" target="_blank" rel="noopener noreferrer">Optimus UI Design Marketplace</a> is a community-built site where you can design an Optimus UI theme visually, fork someone else's design and share your own. It is the
                closest thing to a visual theme designer for Optimus UI — something the core project does not ship.
            </p>
            <p>
                Use it to explore a look before committing to it, then carry the result into your app as a preset. For how presets are applied and customized in code, see
                <a [routerLink]="'/theming/styled'" fragment="definepreset" class="doc-link">definePreset</a>.
            </p>
            <p>Built and maintained by <a href="https://github.com/vis-iks" target="_blank" rel="noopener noreferrer">vis-iks</a>.</p>
            <div class="flex flex-wrap gap-2 mt-4">
                <a pButton label="Open the Marketplace" icon="pi pi-external-link" [href]="designUrl" target="_blank" rel="noopener noreferrer"></a>
                <a pButton label="Source Code" icon="pi pi-github" severity="secondary" [outlined]="true" [href]="designRepoUrl" target="_blank" rel="noopener noreferrer"></a>
            </div>
        </app-docsectiontext>
    `
})
export class DesignMarketplaceDoc {
    readonly designUrl = OPTIMUS_UI_DESIGN_URL;

    readonly designRepoUrl = OPTIMUS_UI_DESIGN_REPO_URL;
}
