import { DISCORD_URL, GITHUB_DISCUSSIONS_URL } from '@/utils/constants';
import { Component } from '@angular/core';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'support-doc',
    standalone: true,
    imports: [AppDocSectionText],
    template: `<app-docsectiontext>
        <p>
            The community gathers on <a href="{{ GITHUB_DISCUSSIONS_URL }}/categories/figma-ui-kit" target="_blank" rel="noopener noreferrer">GitHub Discussions</a> and <a [href]="DISCORD_URL" target="_blank" rel="noopener noreferrer">Discord</a> to
            ask questions, share ideas, and discuss the technology. For direct inquiries or suggestions, feel free to contact us at <a href="mailto:contact@primetek.com.tr">contact&#64;primetek.com.tr</a>.
        </p>
    </app-docsectiontext>`
})
export class SupportDoc {
    DISCORD_URL = DISCORD_URL;
    GITHUB_DISCUSSIONS_URL = GITHUB_DISCUSSIONS_URL;
}
