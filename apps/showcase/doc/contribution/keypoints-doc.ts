import { PROJECT_NAME } from '@/utils/constants';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'keypoints-doc',
    standalone: true,
    imports: [AppDocSectionText],
    changeDetection: ChangeDetectionStrategy.Eager,
    template: `
        <app-docsectiontext>
            <p>
                {{ PROJECT_NAME }} has several add-ons such as UI Kit, Premium Templates, and Blocks that rely on design tokens and styling. Any core structural changes, such as adding new props, events, or updating design tokens, should be
                communicated with the core team to ensure consistency and compatibility.
            </p>
        </app-docsectiontext>
    `
})
export class KeyPointsDoc {
    PROJECT_NAME = PROJECT_NAME;
}
