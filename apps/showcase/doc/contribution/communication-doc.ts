import { DISCORD_URL, PROJECT_NAME } from '@/utils/constants';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'communication-doc',
    standalone: true,
    imports: [AppDocSectionText],
    changeDetection: ChangeDetectionStrategy.Eager,
    template: `
        <app-docsectiontext>
            <p>
                Join the Contributors channel on the <a [href]="DISCORD_URL" target="_blank" rel="noopener noreferrer">PrimeLand Discord</a> server to connect with {{ PROJECT_NAME }} staff and fellow contributors. In this channel, you can discuss the
                areas you want to contribute to and receive feedback. This channel is open to everyone who'd like to contribute.
            </p>
        </app-docsectiontext>
    `
})
export class CommunicationDoc {
    DISCORD_URL = DISCORD_URL;
    PROJECT_NAME = PROJECT_NAME;
}
