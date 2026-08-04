import { PROJECT_NAME } from '@/utils/constants';
import { Component } from '@angular/core';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'videos-doc',
    standalone: true,
    imports: [AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p><a href="https://angular.io/cli">Angular CLI</a> is the recommended way to build Angular applications with {{ PROJECT_NAME }}.</p>
        </app-docsectiontext>
        <div class="video-container">
            <iframe width="560" height="315" src="https://www.youtube.com/embed/_Zel-Eapb9Y" frameborder="0" allowfullscreen></iframe>
        </div>
    `
})
export class VideosDoc {
    PROJECT_NAME = PROJECT_NAME;
}
