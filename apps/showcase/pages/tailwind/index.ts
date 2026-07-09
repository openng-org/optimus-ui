import { PROJECT_NAME } from '@/utils/constants';
import { AnimationsDoc } from '@/doc/tailwind/animations-doc';
import { ColorPaletteDoc } from '@/doc/tailwind/colorpalette-doc';
import { ExtensionsDoc } from '@/doc/tailwind/extensions-doc';
import { FormDoc } from '@/doc/tailwind/form-doc';
import { HeadlessDoc } from '@/doc/tailwind/headless-doc';
import { OverrideDoc } from '@/doc/tailwind/override-doc';
import { OverviewDoc } from '@/doc/tailwind/overview-doc';
import { PluginDoc } from '@/doc/tailwind/plugin-doc';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { DarkModeDoc } from '@/doc/tailwind/darkmode-doc';
import { AppDoc } from '@/components/doc/app.doc';

@Component({
    template: `<app-doc docTitle="Tailwind CSS - {{ PROJECT_NAME }}" header="Tailwind CSS" description="Integration between {{ PROJECT_NAME }} and Tailwind CSS." [docs]="docs" docType="page"></app-doc>`,
    standalone: true,
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [AppDoc]
})
export class TailwindDemo {
    PROJECT_NAME = PROJECT_NAME;

    docs = [
        {
            id: 'overview',
            label: 'Overview',
            component: OverviewDoc
        },
        {
            id: 'plugin',
            label: 'Plugin',
            component: PluginDoc
        },
        {
            id: 'extensions',
            label: 'Extensions',
            component: ExtensionsDoc
        },
        {
            id: 'darkmode',
            label: 'Dark Mode',
            component: DarkModeDoc
        },
        {
            id: 'override',
            label: 'Override',
            component: OverrideDoc
        },
        {
            id: 'samples',
            label: 'Samples',
            description: 'Example uses cases with PrimeNG and Tailwind CSS.',
            children: [
                {
                    id: 'color-palette',
                    label: 'Color Palette',
                    component: ColorPaletteDoc
                },
                {
                    id: 'form',
                    label: 'Form',
                    component: FormDoc
                },
                {
                    id: 'headless',
                    label: 'Headless',
                    component: HeadlessDoc
                },
                {
                    id: 'animations',
                    label: 'Animations',
                    component: AnimationsDoc
                }
            ]
        }
    ];
}
