import { Component } from '@angular/core';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'schematic-details-doc',
    standalone: true,
    imports: [AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>The schematic performs the following steps across the whole workspace, skipping build output and dependency folders.</p>
            <ul class="leading-relaxed">
                <li>Swaps the PrimeNG package family for the Optimus UI equivalents in every <i>package.json</i>.</li>
                <li>Rewrites import specifiers and renamed identifiers, such as <i>providePrimeNG</i>, in all <i>.ts</i> and <i>.mts</i> source files.</li>
                <li>Updates asset references, such as the PrimeIcons stylesheet, in stylesheets and in <i>angular.json</i> / <i>project.json</i>.</li>
                <li>Prints a report of leftover references that require manual review.</li>
                <li>Schedules a package install, unless <i>--skip-install</i> is set.</li>
            </ul>
        </app-docsectiontext>
    `
})
export class SchematicDetailsDoc {}
