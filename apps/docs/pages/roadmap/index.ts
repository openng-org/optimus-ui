import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { TimelineModule } from '@openng/optimus-ui/timeline';

@Component({
    standalone: true,
    imports: [CommonModule, TimelineModule],
    template: `
        <div>
            <div class="doc-intro">
                <h1>Roadmap</h1>
                <p>
                    This community fork is meant to provide a MIT sustainable version of the now closed-source PrimeNG library. Priorities are fixing bugs and providing new versions to match major angular version compatibility. Feature requests
                    will be triaged but implemented only with the help of community contributions.
                </p>
            </div>

            <div class="card mt-8">
                <p-timeline [value]="events" align="alternate" styleClass="customized-timeline">
                    <ng-template #content let-event>
                        <div class="p-4 mb-4 border rounded-xl shadow-sm bg-surface-0 dark:bg-surface-900 border-surface-200 dark:border-surface-800">
                            <h3 class="text-xl font-semibold mb-2 mt-0">{{ event.title }}</h3>
                            <p *ngIf="event.description" class="text-surface-600 dark:text-surface-400 m-0">{{ event.description }}</p>
                            <ul *ngIf="event.features" class="mt-2 mb-0 list-inside list-disc text-surface-600 dark:text-surface-400">
                                <li *ngFor="let feature of event.features" class="mb-1">{{ feature }}</li>
                            </ul>
                        </div>
                    </ng-template>
                </p-timeline>
            </div>
        </div>
    `
})
export class RoadmapDemo {
    events: any[];

    constructor(
        private titleService: Title,
        private metaService: Meta
    ) {
        this.titleService.setTitle('Roadmap - Optimus UI');
        this.metaService.updateTag({ name: 'description', content: 'Optimus UI Roadmap' });

        this.events = [
            {
                title: 'v1',
                features: ['Rebranded from Optimus UI', 'Angular v21 compatible', 'ng add support for seamless installation', 'Schematic to migrate from Optimus UI']
            },
            {
                title: 'v2',
                features: ['Angular v22 compatible']
            },
            {
                title: 'Catchup step',
                features: ['Triage and address existing 900+ open issues', 'Modernize the library to Angular modern APIs']
            },
            {
                title: 'Enhancement step',
                features: ['Feature requests', 'Libraries code modernization', 'Documentation code modernization']
            }
        ];
    }
}
