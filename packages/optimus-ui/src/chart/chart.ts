import { isPlatformBrowser } from '@angular/common';
import { afterEveryRender, afterNextRender, booleanAttribute, ChangeDetectionStrategy, Component, effect, inject, input, NgModule, NgZone, untracked, ViewEncapsulation, output } from '@angular/core';
import Chart from 'chart.js/auto';
import { SharedModule } from '@openng/optimus-ui/api';
import { BaseComponent } from '@openng/optimus-ui/basecomponent';
import { ChartStyle } from './style/chartstyle';
import { Bind, BindModule } from '@openng/optimus-ui/bind';
import type { ChartPassThrough } from '@openng/optimus-ui/types/chart';

/**
 * Chart groups a collection of contents in tabs.
 * @group Components
 */
@Component({
    selector: 'p-chart',
    standalone: true,
    imports: [SharedModule, BindModule],
    template: `
        <canvas
            role="img"
            [attr.aria-label]="ariaLabel()"
            [attr.aria-labelledby]="ariaLabelledBy()"
            [attr.width]="responsive() && !width() ? null : width()"
            [attr.height]="responsive() && !height() ? null : height()"
            (click)="onCanvasClick($event)"
            [pBind]="ptm('canvas')"
        ></canvas>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        '[class]': "cx('root')",
        '[style]': "sx('root')"
    },
    providers: [ChartStyle],
    hostDirectives: [Bind]
})
export class UIChart extends BaseComponent<ChartPassThrough> {
    private zone = inject(NgZone);

    bindDirectiveInstance = inject(Bind, { self: true });

    _componentStyle = inject(ChartStyle);

    /**
     * Type of the chart.
     * @group Props
     */
    readonly type = input<'bar' | 'line' | 'scatter' | 'bubble' | 'pie' | 'doughnut' | 'polarArea' | 'radar'>();

    /**
     * Array of per-chart plugins to customize the chart behaviour.
     * @group Props
     */
    readonly plugins = input<any[]>([]);

    /**
     * Width of the chart.
     * @group Props
     */
    readonly width = input<string>();

    /**
     * Height of the chart.
     * @group Props
     */
    readonly height = input<string>();

    /**
     * Whether the chart is redrawn on screen size change.
     * @group Props
     */
    readonly responsive = input<boolean, unknown>(true, { transform: booleanAttribute });

    /**
     * Used to define a string that autocomplete attribute the current element.
     * @group Props
     */
    readonly ariaLabel = input<string>();

    /**
     * Establishes relationships between the component and label(s) where its value should be one or more element IDs.
     * @group Props
     */
    readonly ariaLabelledBy = input<string>();

    /**
     * Data to display.
     * @group Props
     */
    readonly data = input<any>();

    /**
     * Options to customize the chart.
     * @group Props
     */
    readonly options = input<any>({});

    /**
     * Callback to execute when an element on chart is clicked.
     * @group Emits
     */
    readonly onDataSelect = output<any>();

    componentName = 'Chart';

    initialized: boolean | undefined;

    chart: any;

    constructor() {
        super();
        // Recreate the chart when data or options change (replaces the former setter-based
        // @Inputs). The body runs untracked so initChart's other input reads don't become
        // dependencies of this effect.
        effect(() => {
            this.data();
            this.options();
            untracked(() => this.reinit());
        });

        // Initial chart creation once the canvas is rendered (replaces the former ngAfterViewInit hook).
        afterNextRender(() => {
            this.initChart();
            this.initialized = true;
        });

        // Re-apply the host/root pass-through sections after each render (replaces the former
        // ngAfterViewChecked hook). Bind.setAttrs writes into a signal behind an equality check,
        // so unchanged PT resolutions are no-ops.
        afterEveryRender(() => {
            this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
        });
    }

    onDestroy() {
        if (this.chart) {
            this.chart.destroy();
            this.initialized = false;
            this.chart = null;
        }
    }

    onCanvasClick(event: Event) {
        if (this.chart) {
            const element = this.chart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, false);
            const dataset = this.chart.getElementsAtEventForMode(event, 'dataset', { intersect: true }, false);

            if (element && element[0] && dataset) {
                this.onDataSelect.emit({ originalEvent: event, element: element[0], dataset: dataset });
            }
        }
    }

    initChart() {
        if (isPlatformBrowser(this.platformId)) {
            let opts = this.options() || {};
            opts.responsive = this.responsive();

            // allows chart to resize in responsive mode
            if (opts.responsive && (this.height() || this.width())) {
                opts.maintainAspectRatio = false;
            }

            this.zone.runOutsideAngular(() => {
                this.chart = new Chart(this.el.nativeElement.children[0], {
                    type: this.type(),
                    data: this.data(),
                    options: this.options(),
                    plugins: this.plugins()
                });
            });
        }
    }

    getCanvas() {
        return this.el.nativeElement.children[0];
    }

    getBase64Image() {
        return this.chart.toBase64Image();
    }

    generateLegend() {
        if (this.chart) {
            return this.chart.generateLegend();
        }
    }

    refresh() {
        if (this.chart) {
            this.chart.update();
        }
    }

    reinit() {
        if (this.chart) {
            this.chart.destroy();
            this.initChart();
        }
    }
}

@NgModule({
    imports: [UIChart, SharedModule],
    exports: [UIChart, SharedModule]
})
export class ChartModule {}
