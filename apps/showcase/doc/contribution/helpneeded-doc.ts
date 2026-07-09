import { DISCORD_URL, GITHUB_DISCUSSIONS_URL, PROJECT_NAME } from '@/utils/constants';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'helpneeded-doc',
    standalone: true,
    imports: [AppDocSectionText],
    changeDetection: ChangeDetectionStrategy.Eager,
    template: `
        <app-docsectiontext>
            <p>{{ PROJECT_NAME }} is a community-driven project backed by the expertise and sponsorship of PrimeTek, and we appreciate any help you can provide. Here are some areas where you can contribute:</p>
            <h3>Issue Triage</h3>
            <p>Help us manage issues by;</p>
            <ul class="list-disc list-inside line-height-3 px-10 m-0">
                <li>Reproducing reported bugs</li>
                <li>Clarifying issue descriptions</li>
                <li>Tagging issues with appropriate labels</li>
            </ul>

            <h3>Sending Pull Requests</h3>
            <p>We encourage you to send pull requests, especially for issues tagged with the <i>help-needed</i> label.</p>

            <h3>Community Support</h3>
            <p>
                Assist other users by participating in the issue tracker, <a href="{{ GITHUB_DISCUSSIONS_URL }}/categories/primeng" target="_blank" rel="noopener noreferrer">GitHub discussions</a>, and the
                <a [href]="DISCORD_URL" target="_blank" rel="noopener noreferrer">PrimeLand Discord</a> server. Your expertise can help others solve problems and improve their experience with {{ PROJECT_NAME }}.
            </p>
        </app-docsectiontext>
    `
})
export class HelpNeededDoc {
    DISCORD_URL = DISCORD_URL;
    GITHUB_DISCUSSIONS_URL = GITHUB_DISCUSSIONS_URL;
    PROJECT_NAME = PROJECT_NAME;
}
