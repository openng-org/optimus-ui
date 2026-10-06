import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Component } from '@angular/core';
import { ButtonModule } from '@openng/optimus-ui/button';

@Component({
    selector: 'designtools-doc',
    standalone: true,
    imports: [AppDocSectionText, ButtonModule],
    template: `
        <app-docsectiontext>
            <p>
                The design tokens of each preset are published as a <a href="https://penpot.app" target="_blank" rel="noopener noreferrer" class="doc-link">Penpot</a> token file, generated from the same source as the themes, so designs use the exact
                values the components render with. In Penpot, open the <i>Tokens</i> panel and import the file of your preset.
            </p>
            <p>
                Each file has a token set per layer (<i>primitive</i>, <i>semantic</i> and <i>component</i>) plus light and dark sets for the color scheme, and a <i>Color scheme</i> theme group to switch between them. Token names match the CSS
                variables: <i>button.primary.background</i> is <i>--p-button-primary-background</i>, and references such as <i>{{ '{' }}primary.color{{ '}' }}</i> are kept.
            </p>
            <p>
                Penpot works in pixels, so <i>rem</i> values are converted at 16px. Tokens without a Penpot equivalent, such as transition durations, CSS keywords and padding shorthands, are left out. The files follow the
                <a href="https://www.designtokens.org" target="_blank" rel="noopener noreferrer" class="doc-link">Design Tokens</a> JSON format, so other tools that read it can import them too.
            </p>
            <div class="flex flex-wrap gap-2">
                @for (preset of presets; track preset) {
                    <a [href]="'/design-tokens/optimus-ui-' + preset + '.tokens.json'" download>
                        <p-button [label]="preset" icon="pi pi-download" severity="secondary" [outlined]="true" />
                    </a>
                }
            </div>
        </app-docsectiontext>
    `
})
export class DesignToolsDoc {
    presets = ['aura', 'lara', 'material', 'nora'];
}
