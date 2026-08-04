import { PROJECT_NAME } from '@/utils/constants';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Component } from '@angular/core';

@Component({
    selector: 'locale-doc',
    standalone: true,
    imports: [AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                Locale for different languages and formats is defined globally, refer to the
                <a href="/configuration/#locale">{{ PROJECT_NAME }} Locale</a> configuration for more information.
            </p>
        </app-docsectiontext>
    `
})
export class LocaleDoc {
    PROJECT_NAME = PROJECT_NAME;
}
