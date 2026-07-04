import { PROJECT_NAME } from '@/utils/constants';
import { BasicDoc } from '@/doc/icons/basic-doc';
import { ColorDoc } from '@/doc/icons/color-doc';
import { ConstantsDoc } from '@/doc/icons/constants-doc';
import { DownloadDoc } from '@/doc/icons/download-doc';
import { FigmaDoc } from '@/doc/icons/figma-doc';
import { ListDoc } from '@/doc/icons/list-doc';
import { SizeDoc } from '@/doc/icons/size-doc';
import { SpinDoc } from '@/doc/icons/spin-doc';
import { UsageDoc } from '@/doc/icons/usage-doc';
import { Component } from '@angular/core';
import { AppDoc } from '@/components/doc/app.doc';

@Component({
    standalone: true,
    imports: [AppDoc],
    template: `
        <app-doc
            title="Angular Icon Library - {{ PROJECT_NAME }}"
            header="Icons"
            description="PrimeIcons is the default icon library of {{ PROJECT_NAME }} with over 250 open source icons developed by PrimeTek. PrimeIcons library is optional as {{ PROJECT_NAME }} components can use any icon with templating."
            [docs]="docs"
            [heroDoc]="heroDoc"
            docType="page"
        ></app-doc>
    `,
    styleUrls: ['./iconsdemo.component.scss']
})
export class IconsDemo {
    PROJECT_NAME = PROJECT_NAME;

    heroDoc = BasicDoc;

    docs = [
        {
            id: 'usage',
            label: 'Usage',
            component: UsageDoc
        },
        {
            id: 'download',
            label: 'Download',
            component: DownloadDoc
        },
        {
            id: 'figma',
            label: 'Figma',
            component: FigmaDoc
        },
        {
            id: 'examples',
            label: 'Examples',
            children: [
                {
                    id: 'basic',
                    label: 'Basic',
                    component: BasicDoc
                },
                {
                    id: 'size',
                    label: 'Size',
                    component: SizeDoc
                },
                {
                    id: 'color',
                    label: 'Color',
                    component: ColorDoc
                },
                {
                    id: 'spin',
                    label: 'Spin',
                    component: SpinDoc
                },
                {
                    id: 'constants',
                    label: 'Constants',
                    component: ConstantsDoc
                }
            ]
        },
        {
            id: 'list',
            label: 'List',
            component: ListDoc
        }
    ];
}
