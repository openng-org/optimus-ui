import { PROJECT_NAME } from '@/utils/constants';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'llmstxt-doc',
    standalone: true,
    imports: [AppDocSectionText, ButtonModule],
    changeDetection: ChangeDetectionStrategy.Eager,
    template: `
        <app-docsectiontext>
            <p>
                The <a href="https://llmstxt.org/" target="_blank" rel="noopener noreferrer">llms.txt</a> file is an industry standard that helps AI models better understand and navigate the {{ PROJECT_NAME }} documentation. It lists key pages in a
                structured format, making it easier for LLMs to retrieve relevant information.
            </p>
            <a href="/llms/llms.txt" target="_blank">
                <p-button label="Open llms.txt" />
            </a>
        </app-docsectiontext>
    `
})
export class LlmsTxtDoc {
    PROJECT_NAME = PROJECT_NAME;
}
