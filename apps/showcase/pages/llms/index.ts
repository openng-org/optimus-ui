import { PROJECT_NAME } from '@/utils/constants';
import { LlmsTxtDoc } from '@/doc/llms/llmstxt-doc';
import { LlmsFullTxtDoc } from '@/doc/llms/llmsfulltxt-doc';
import { MarkdownExtensionDoc } from '@/doc/llms/markdownextension-doc';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AppDoc } from '@/components/doc/app.doc';

@Component({
    selector: 'llms-demo',
    standalone: true,
    imports: [AppDoc],
    changeDetection: ChangeDetectionStrategy.Eager,
    template: ` <app-doc docTitle="LLMs.txt - {{ PROJECT_NAME }}" header="LLMs.txt" description="LLM-optimized documentation endpoints for {{ PROJECT_NAME }} components." [docs]="docs" docType="page"></app-doc> `
})
export class LLMsDemo {
    PROJECT_NAME = PROJECT_NAME;

    docs = [
        {
            id: 'llmstxt',
            label: '/llms.txt',
            component: LlmsTxtDoc
        },
        {
            id: 'llmsfulltxt',
            label: '/llms-full.txt',
            component: LlmsFullTxtDoc
        },
        {
            id: 'markdown',
            label: '.md extension',
            component: MarkdownExtensionDoc
        }
    ];
}
