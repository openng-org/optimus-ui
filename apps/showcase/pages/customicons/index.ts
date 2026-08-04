import { PROJECT_NAME } from '@/utils/constants';
import { FontAwesomeDoc } from '@/doc/customicons/fontawesome-doc';
import { ImageDoc } from '@/doc/customicons/image-doc';
import { MaterialDoc } from '@/doc/customicons/material-doc';
import { SVGDoc } from '@/doc/customicons/svg-doc';
import { Component } from '@angular/core';
import { AppDoc } from '@/components/doc/app.doc';

@Component({
    standalone: true,
    imports: [AppDoc],
    template: ` <app-doc title="Custom Icons - {{ PROJECT_NAME }}" header="Custom Icons" description="{{ PROJECT_NAME }} components can be used with any icon library using the templating features." [docs]="docs" docType="page"></app-doc>`
})
export class CustomIconsDemo {
    PROJECT_NAME = PROJECT_NAME;

    docs = [
        {
            id: 'material',
            label: 'Material',
            component: MaterialDoc
        },
        {
            id: 'fontawesome',
            label: 'Font Awesome',
            component: FontAwesomeDoc
        },
        {
            id: 'svg',
            label: 'SVG',
            component: SVGDoc
        },
        {
            id: 'image',
            label: 'Image',
            component: ImageDoc
        }
    ];
}
