import { PROJECT_NAME } from '@/utils/constants';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Code } from '@/domain/code';
import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'configuration-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCode],
    changeDetection: ChangeDetectionStrategy.Eager,
    template: `
        <app-docsectiontext>
            <p>
                The {{ PROJECT_NAME }} components natively support Right-to-Left (RTL) text direction through a modern CSS implementation utilizing FlexBox and classes like <i>*-inline-start</i> and <i>*-block-end</i>. Consequently, no JavaScript
                configuration is necessary; setting the document's text direction to RTL is sufficient to enable this feature.
            </p>
            <p>The RTL setting can either be set using the <i>dir</i> attribute or with the <i>direction</i> style property.</p>
        </app-docsectiontext>

        <div class="doc-section-description font-bold mb-4">With Markup</div>
        <app-code [code]="markupCode" [hideToggleCode]="true"></app-code>

        <div class="doc-section-description my-4 font-bold">With CSS</div>
        <app-code [code]="cssCode" [hideToggleCode]="true"></app-code>
    `
})
export class ConfigurationDoc {
    PROJECT_NAME = PROJECT_NAME;

    markupCode: Code = {
        html: `<html dir="rtl">`
    };

    cssCode: Code = {
        scss: `html {
    direction: rtl
}`
    };
}
