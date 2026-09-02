import { CommonModule } from '@angular/common';
import { afterEveryRender, afterNextRender, ChangeDetectionStrategy, Component, computed, forwardRef, inject, input, NgModule, numberAttribute, TemplateRef, ViewEncapsulation, contentChild, contentChildren } from '@angular/core';
import { getOuterHeight } from '@openng/optimus-ui-utils';
import { PrimeTemplate, SharedModule } from '@openng/optimus-ui/api';
import { BaseComponent, PARENT_INSTANCE } from '@openng/optimus-ui/basecomponent';
import { Bind } from '@openng/optimus-ui/bind';
import { MeterGroupIconTemplateContext, MeterGroupLabelTemplateContext, MeterGroupMeterTemplateContext, MeterGroupPassThrough, MeterItem } from '@openng/optimus-ui/types/metergroup';
import { MeterGroupStyle } from './style/metergroupstyle';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'p-meterGroupLabel, p-metergrouplabel',
    standalone: true,
    imports: [CommonModule, SharedModule, Bind],
    template: `
        <ol [class]="cx('labelList')" [pBind]="ptm('labelList')" [attr.data-p]="dataP()">
            @for (labelItem of value(); track parentInstance.trackByFn(index); let index = $index) {
                <li [class]="cx('label')" [pBind]="ptm('label')">
                    @if (!iconTemplate()) {
                        @if (labelItem.icon) {
                            <i [class]="labelItem.icon" [ngClass]="cx('labelIcon')" [pBind]="ptm('labelIcon')" [ngStyle]="{ color: labelItem.color }"></i>
                        }
                        @if (!labelItem.icon) {
                            <span [class]="cx('labelMarker')" [pBind]="ptm('labelMarker')" [ngStyle]="{ backgroundColor: labelItem.color }"></span>
                        }
                    }
                    <ng-container *ngTemplateOutlet="iconTemplate(); context: { $implicit: labelItem, icon: labelItem.icon }"></ng-container>
                    <span [class]="cx('labelText')" [pBind]="ptm('labelText')">{{ labelItem.label }} ({{ parentInstance.percentValue(labelItem.value) }})</span>
                </li>
            }
        </ol>
    `
})
export class MeterGroupLabel extends BaseComponent<MeterGroupPassThrough> {
    parentInstance: MeterGroup = inject(forwardRef(() => MeterGroup));

    _componentStyle = inject(MeterGroupStyle);

    readonly value = input<any[]>([]);

    readonly labelPosition = input<'start' | 'end'>('end');

    readonly labelOrientation = input<'horizontal' | 'vertical'>('horizontal');

    readonly min = input<number>();

    readonly max = input<number>();

    readonly iconTemplate = input<TemplateRef<MeterGroupIconTemplateContext>>();

    readonly dataP = computed(() =>
        this.cn({
            [this.labelOrientation()]: this.labelOrientation()
        })
    );
}
/**
 * MeterGroup displays scalar measurements within a known range.
 * @group Components
 */
@Component({
    selector: 'p-meterGroup, p-metergroup, p-meter-group',
    standalone: true,
    imports: [CommonModule, MeterGroupLabel, SharedModule, Bind],
    template: `
        @if (labelPosition() === 'start') {
            @if (!$labelTemplate()) {
                <p-meterGroupLabel [value]="value()" [labelPosition]="labelPosition()" [labelOrientation]="labelOrientation()" [min]="min()" [max]="max()" [iconTemplate]="$iconTemplate()" [pt]="pt" [unstyled]="unstyled()" />
            }
            <ng-container *ngTemplateOutlet="$labelTemplate(); context: { $implicit: value(), totalPercent: totalPercent(), percentages: percentages() }"></ng-container>
        }
        <ng-container *ngTemplateOutlet="$startTemplate(); context: { $implicit: value(), totalPercent: totalPercent(), percentages: percentages() }"></ng-container>
        <div [class]="cx('meters')" [pBind]="ptm('meters')" [attr.data-p]="dataP()">
            @for (meterItem of value(); track trackByFn(index); let index = $index) {
                <ng-container
                    *ngTemplateOutlet="
                        $meterTemplate();
                        context: {
                            $implicit: meterItem,
                            index: index,
                            orientation: this.orientation(),
                            class: cx('meter'),
                            size: percentValue(meterItem.value),
                            totalPercent: totalPercent(),
                            dataP: dataP()
                        }
                    "
                >
                </ng-container>
                @if (!$meterTemplate() && meterItem.value > 0) {
                    <span [class]="cx('meter')" [attr.data-p]="dataP()" [pBind]="ptm('meter')" [ngStyle]="meterStyle(meterItem)"></span>
                }
            }
        </div>
        <ng-container *ngTemplateOutlet="$endTemplate(); context: { $implicit: value(), totalPercent: totalPercent(), percentages: percentages() }"></ng-container>
        @if (labelPosition() === 'end') {
            @if (!$labelTemplate()) {
                <p-meterGroupLabel [value]="value()" [labelPosition]="labelPosition()" [labelOrientation]="labelOrientation()" [min]="min()" [max]="max()" [iconTemplate]="$iconTemplate()" [pt]="pt" [unstyled]="unstyled()" />
            }
            <ng-container *ngTemplateOutlet="$labelTemplate(); context: { $implicit: value(), totalPercent: totalPercent(), percentages: percentages() }"></ng-container>
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [MeterGroupStyle, { provide: PARENT_INSTANCE, useExisting: MeterGroup }],
    host: {
        '[attr.aria-valuemin]': 'min()',
        '[attr.role]': '"meter"',
        '[attr.aria-valuemax]': 'max()',
        '[attr.aria-valuenow]': 'totalPercent()',
        '[attr.data-p]': 'dataP()',
        '[class]': "cx('root')"
    },
    hostDirectives: [Bind]
})
export class MeterGroup extends BaseComponent<MeterGroupPassThrough> {
    bindDirectiveInstance = inject(Bind, { self: true });

    _componentStyle = inject(MeterGroupStyle);

    /**
     * Current value of the metergroup.
     * @group Props
     */
    readonly value = input<MeterItem[]>();

    /**
     * Mininum boundary value.
     * @group Props
     */
    readonly min = input<number, unknown>(0, { transform: numberAttribute });

    /**
     * Maximum boundary value.
     * @group Props
     */
    readonly max = input<number, unknown>(100, { transform: numberAttribute });

    /**
     * Specifies the layout of the component, valid values are 'horizontal' and 'vertical'.
     * @group Props
     */
    readonly orientation = input<'horizontal' | 'vertical'>('horizontal');

    /**
     * Specifies the label position of the component, valid values are 'start' and 'end'.
     * @group Props
     */
    readonly labelPosition = input<'start' | 'end'>('end');

    /**
     * Specifies the label orientation of the component, valid values are 'horizontal' and 'vertical'.
     * @group Props
     */
    readonly labelOrientation = input<'horizontal' | 'vertical'>('horizontal');

    /**
     * Custom label template.
     * @param {MeterGroupLabelTemplateContext} context - label context.
     * @see {@link MeterGroupLabelTemplateContext}
     * @group Templates
     */
    readonly labelTemplate = contentChild<TemplateRef<MeterGroupLabelTemplateContext>>('label', { descendants: false });

    /**
     * Custom meter template.
     * @param {MeterGroupMeterTemplateContext} context - meter context.
     * @see {@link MeterGroupMeterTemplateContext}
     * @group Templates
     */
    readonly meterTemplate = contentChild<TemplateRef<MeterGroupMeterTemplateContext>>('meter', { descendants: false });

    /**
     * Custom end template.
     * @param {MeterGroupLabelTemplateContext} context - end context.
     * @see {@link MeterGroupLabelTemplateContext}
     * @group Templates
     */
    readonly endTemplate = contentChild<TemplateRef<MeterGroupLabelTemplateContext>>('end', { descendants: false });

    /**
     * Custom start template.
     * @param {MeterGroupLabelTemplateContext} context - start context.
     * @see {@link MeterGroupLabelTemplateContext}
     * @group Templates
     */
    readonly startTemplate = contentChild<TemplateRef<MeterGroupLabelTemplateContext>>('start', { descendants: false });

    /**
     * Custom icon template.
     * @param {MeterGroupIconTemplateContext} context - icon context.
     * @see {@link MeterGroupIconTemplateContext}
     * @group Templates
     */
    readonly iconTemplate = contentChild<TemplateRef<MeterGroupIconTemplateContext>>('icon', { descendants: false });

    readonly templates = contentChildren(PrimeTemplate);

    componentName = 'MeterGroup';

    readonly vertical = computed<boolean>(() => this.orientation() === 'vertical');

    /** Effective label template: the \`#label\` content child, or a legacy \`pTemplate="label"\`. */
    readonly $labelTemplate = computed(() => this.labelTemplate() ?? (this.templates().find((item) => item.getType() === 'label')?.template as TemplateRef<MeterGroupLabelTemplateContext> | undefined));

    /** Effective meter template: the \`#meter\` content child, or a legacy \`pTemplate="meter"\`. */
    readonly $meterTemplate = computed(() => this.meterTemplate() ?? (this.templates().find((item) => item.getType() === 'meter')?.template as TemplateRef<MeterGroupMeterTemplateContext> | undefined));

    /** Effective icon template: the \`#icon\` content child, or a legacy \`pTemplate="icon"\`. */
    readonly $iconTemplate = computed(() => this.iconTemplate() ?? (this.templates().find((item) => item.getType() === 'icon')?.template as TemplateRef<MeterGroupIconTemplateContext> | undefined));

    /** Effective start template: the \`#start\` content child, or a legacy \`pTemplate="start"\`. */
    readonly $startTemplate = computed(() => this.startTemplate() ?? (this.templates().find((item) => item.getType() === 'start')?.template as TemplateRef<MeterGroupLabelTemplateContext> | undefined));

    /** Effective end template: the \`#end\` content child, or a legacy \`pTemplate="end"\`. */
    readonly $endTemplate = computed(() => this.endTemplate() ?? (this.templates().find((item) => item.getType() === 'end')?.template as TemplateRef<MeterGroupLabelTemplateContext> | undefined));

    readonly dataP = computed(() =>
        this.cn({
            [this.orientation()]: this.orientation()
        })
    );

    constructor() {
        super();
        // Fix the container height for vertical orientation once rendered (replaces the former
        // ngAfterViewInit hook).
        afterNextRender(() => {
            const _container = this.el.nativeElement;
            const height = getOuterHeight(_container);
            this.vertical() && (_container.style.height = height + 'px');
        });

        // Re-apply the host/root pass-through sections after each render (replaces the former
        // ngAfterViewChecked hook). Bind.setAttrs writes into a signal behind an equality check,
        // so unchanged PT resolutions are no-ops.
        afterEveryRender(() => {
            this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
        });
    }

    percent(meter = 0) {
        if (this.max() === this.min()) {
            return 100; // When min = max, any value should be 100%
        }
        const percentOfItem = ((meter - this.min()) / (this.max() - this.min())) * 100;

        return Math.round(Math.max(0, Math.min(100, percentOfItem)));
    }

    percentValue(meter: number) {
        return this.percent(meter) + '%';
    }

    meterStyle(val: MeterItem) {
        return {
            backgroundColor: val.color,
            width: this.orientation() === 'horizontal' && this.percentValue(val.value || 0),
            height: this.orientation() === 'vertical' && this.percentValue(val.value || 0)
        };
    }

    totalPercent() {
        const value = this.value();
        if (!value) {
            return 0;
        }
        return this.percent(value.reduce((total, val) => total + (val.value || 0), 0));
    }

    percentages() {
        const value = this.value();
        if (!value) {
            return [];
        }

        let sum = 0;
        const sumsArray: number[] = [];

        value.forEach((item) => {
            sum += item.value || 0;
            sumsArray.push(sum);
        });

        return sumsArray;
    }

    trackByFn(index: number): number {
        return index;
    }
}

@NgModule({
    imports: [MeterGroup, SharedModule],
    exports: [MeterGroup, SharedModule]
})
export class MeterGroupModule {}
