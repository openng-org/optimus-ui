import { AppCode } from '@/components/doc/app.code';
import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'events-doc',
    standalone: true,
    imports: [AppCode],
    changeDetection: ChangeDetectionStrategy.Eager,
    template: ` <section class="py-6">
        <app-code [hideToggleCode]="true"></app-code>
    </section>`
})
export class EventsDoc {}
