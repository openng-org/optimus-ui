import { PROJECT_NAME } from '@/utils/constants';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'v20-breaking-doc',
    standalone: true,
    imports: [AppDocSectionText],
    changeDetection: ChangeDetectionStrategy.Eager,
    template: `
        <app-docsectiontext>
            <p>Our team has put in great deal of effort while updating {{ PROJECT_NAME }}, and there are no filed breaking changes in v20.</p>
        </app-docsectiontext>
    `
})
export class BreakingDoc {
    PROJECT_NAME = PROJECT_NAME;
}
