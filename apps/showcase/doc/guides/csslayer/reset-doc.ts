import { PROJECT_NAME } from '@/utils/constants';
import { Component } from '@angular/core';
import { AppCodeModule } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'reset-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCodeModule],
    template: `
        <app-docsectiontext>
            <p>
                Ease of customization may present an issue if you have global styles on HTML elements like inputs and buttons that are also utilized by {{ PROJECT_NAME }} because global styles with a broader scope e.g. <i>button &#123; &#125;</i> and
                no layer always override the {{ PROJECT_NAME }} components leading to unexpected results. A common use case for global styles applying to standard HTML elements is CSS reset utilities to remove the default styling of the browsers. In
                this case, best practice is wrapping your CSS in a layer like <i>reset</i> and make sure <i>primeNG</i> comes after your layer since layers defined after has higher precedence. This way, your Reset CSS does not get in the way of
                {{ PROJECT_NAME }} components.
            </p>
            <app-code [hideToggleCode]="true" [hideCodeSandbox]="true" [hideStackBlitz]="true"></app-code>
        </app-docsectiontext>
    `
})
export class ResetDoc {
    PROJECT_NAME = PROJECT_NAME;
}
