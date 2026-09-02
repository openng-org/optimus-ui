import { CommonModule } from '@angular/common';
import { afterEveryRender, ChangeDetectionStrategy, Component, computed, contentChild, contentChildren, inject, input, NgModule, TemplateRef, ViewEncapsulation } from '@angular/core';
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
    standalone: true,
    imports: [CommonModule, SharedModule, Bind],
    template: `
        @for (event of value(); track event; let last = $last) {
            <div [pBind]="ptm('event')" [class]="cx('event')" [attr.data-p]="dataP()">
                <div [pBind]="ptm('eventOpposite')" [class]="cx('eventOpposite')" [attr.data-p]="dataP()">
                    <ng-container *ngTemplateOutlet="$oppositeTemplate(); context: { $implicit: event }"></ng-container>
                </div>
                <div [pBind]="ptm('eventSeparator')" [class]="cx('eventSeparator')" [attr.data-p]="dataP()">
                    @if ($markerTemplate(); as markerTemplate) {
                        <ng-container *ngTemplateOutlet="markerTemplate; context: { $implicit: event }"></ng-container>
                    } @else {
                        <div [pBind]="ptm('eventMarker')" [class]="cx('eventMarker')" [attr.data-p]="dataP()"></div>
                    }
                    @if (!last) {
                        <div [pBind]="ptm('eventConnector')" [class]="cx('eventConnector')" [attr.data-p]="dataP()"></div>
                    }
                </div>
                <div [pBind]="ptm('eventContent')" [class]="cx('eventContent')" [attr.data-p]="dataP()">
                    <ng-container *ngTemplateOutlet="$contentTemplate(); context: { $implicit: event }"></ng-container>
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
    bindDirectiveInstance = inject(Bind, { self: true });

    _componentStyle = inject(TimelineStyle);

    /**
     * An array of events to display.
     * @group Props
     */
    readonly value = input<any[]>();

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

    componentName = 'Timeline';

    /** Effective content template: the \`#content\` content child, or a legacy \`pTemplate="content"\`. */
    readonly $contentTemplate = computed(() => this.contentTemplate() ?? this.templates().find((item) => item.getType() === 'content')?.template);

    /** Effective opposite template: the \`#opposite\` content child, or a legacy \`pTemplate="opposite"\`. */
    readonly $oppositeTemplate = computed(() => this.oppositeTemplate() ?? this.templates().find((item) => item.getType() === 'opposite')?.template);

    /** Effective marker template: the \`#marker\` content child, or a legacy \`pTemplate="marker"\`. */
    readonly $markerTemplate = computed(() => this.markerTemplate() ?? this.templates().find((item) => item.getType() === 'marker')?.template);

    readonly dataP = computed(() =>
        this.cn({
            [this.layout()]: this.layout(),
            [this.align()]: this.align()
        })
    );

    constructor() {
        super();
        // Re-apply the host/root pass-through sections after each render (replaces the former
        // ngAfterViewChecked hook). Bind.setAttrs writes into a signal behind an equality check,
        // so unchanged PT resolutions are no-ops.
        afterEveryRender(() => {
            this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
        });
    }

    getBlockableElement(): HTMLElement {
        return this.el.nativeElement.children[0];
    }
}

@NgModule({
    imports: [Timeline, SharedModule],
    exports: [Timeline, SharedModule]
})
export class TimelineModule {}
