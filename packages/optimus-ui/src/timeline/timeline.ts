import { CommonModule } from '@angular/common';
import { afterEveryRender, ChangeDetectionStrategy, Component, computed, inject, input, NgModule, TemplateRef, ViewEncapsulation, contentChild, contentChildren } from '@angular/core';
import { BlockableUI, PrimeTemplate, SharedModule } from '@openng/optimus-ui/api';
import { BaseComponent, PARENT_INSTANCE } from '@openng/optimus-ui/basecomponent';
import { Bind } from '@openng/optimus-ui/bind';
import { Nullable } from '@openng/optimus-ui/ts-helpers';
import { TimelineItemTemplateContext, TimelinePassThrough } from '@openng/optimus-ui/types/timeline';
import { TimelineStyle } from './style/timelinestyle';

/**
 * Timeline visualizes a series of chained events.
 * @group Components
 */
@Component({
    selector: 'p-timeline',
    imports: [CommonModule, SharedModule, Bind],
    template: `
        @for (event of value(); track event; let last = $last) {
            <div [pBind]="ptm('event')" [class]="cx('event')" [attr.data-p]="dataP()">
                <div [pBind]="ptm('eventOpposite')" [class]="cx('eventOpposite')" [attr.data-p]="dataP()">
                    <ng-container *ngTemplateOutlet="oppositeTemplate() || _oppositeTemplate(); context: { $implicit: event }"></ng-container>
                </div>
                <div [pBind]="ptm('eventSeparator')" [class]="cx('eventSeparator')" [attr.data-p]="dataP()">
                    @if (markerTemplate() || _markerTemplate()) {
                        <ng-container *ngTemplateOutlet="markerTemplate() || _markerTemplate(); context: { $implicit: event }"></ng-container>
                    } @else {
                        <div [pBind]="ptm('eventMarker')" [class]="cx('eventMarker')" [attr.data-p]="dataP()"></div>
                    }
                    @if (!last) {
                        <div [pBind]="ptm('eventConnector')" [class]="cx('eventConnector')" [attr.data-p]="dataP()"></div>
                    }
                </div>
                <div [pBind]="ptm('eventContent')" [class]="cx('eventContent')" [attr.data-p]="dataP()">
                    <ng-container *ngTemplateOutlet="contentTemplate() || _contentTemplate(); context: { $implicit: event }"></ng-container>
                </div>
            </div>
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [TimelineStyle, { provide: PARENT_INSTANCE, useExisting: Timeline }],
    host: {
        '[class]': "cx('root')",
        '[attr.data-p]': 'dataP()'
    },
    hostDirectives: [Bind]
})
export class Timeline extends BaseComponent<TimelinePassThrough> implements BlockableUI {
    componentName = 'Timeline';

    bindDirectiveInstance = inject(Bind, { self: true });

    constructor() {
        super();
        afterEveryRender(() => this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root'])));
    }
    /**
     * An array of events to display.
     * @group Props
     */
    readonly value = input<any[] | undefined>();
    /**
     * Position of the timeline bar relative to the content. Valid values are "left", "right" for vertical layout and "top", "bottom" for horizontal layout.
     * @group Props
     */
    readonly align = input<string>('left');
    /**
     * Orientation of the timeline.
     * @group Props
     */
    readonly layout = input<'vertical' | 'horizontal'>('vertical');
    /**
     * Custom content template.
     * @param {TimelineItemTemplateContext} context - item context.
     * @see {@link TimelineItemTemplateContext}
     * @group Templates
     */
    readonly contentTemplate = contentChild<Nullable<TemplateRef<TimelineItemTemplateContext>>>('content', { descendants: false });

    /**
     * Custom opposite item template.
     * @param {TimelineItemTemplateContext} context - item context.
     * @see {@link TimelineItemTemplateContext}
     * @group Templates
     */
    readonly oppositeTemplate = contentChild<Nullable<TemplateRef<TimelineItemTemplateContext>>>('opposite', { descendants: false });

    /**
     * Custom marker template.
     * @param {TimelineItemTemplateContext} context - item context.
     * @see {@link TimelineItemTemplateContext}
     * @group Templates
     */
    readonly markerTemplate = contentChild<Nullable<TemplateRef<TimelineItemTemplateContext>>>('marker', { descendants: false });

    readonly templates = contentChildren(PrimeTemplate);

    readonly _contentTemplate = computed<TemplateRef<TimelineItemTemplateContext> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'content')
                .at(-1)?.template
    );

    readonly _oppositeTemplate = computed<TemplateRef<TimelineItemTemplateContext> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'opposite')
                .at(-1)?.template
    );

    readonly _markerTemplate = computed<TemplateRef<TimelineItemTemplateContext> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'marker')
                .at(-1)?.template
    );

    _componentStyle = inject(TimelineStyle);

    getBlockableElement(): HTMLElement {
        return this.el.nativeElement.children[0];
    }

    readonly dataP = computed(() => {
        return this.cn({
            [this.layout()]: this.layout(),
            [this.align()]: this.align()
        });
    });
}

@NgModule({
    imports: [Timeline, SharedModule],
    exports: [Timeline, SharedModule]
})
export class TimelineModule {}
