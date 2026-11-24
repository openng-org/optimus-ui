import { CommonModule } from '@angular/common';
import { afterEveryRender, booleanAttribute, ChangeDetectionStrategy, Component, computed, inject, input, NgModule, numberAttribute, TemplateRef, ViewEncapsulation, contentChild, contentChildren } from '@angular/core';
import { PrimeTemplate, SharedModule } from '@openng/optimus-ui/api';
import { BaseComponent, PARENT_INSTANCE } from '@openng/optimus-ui/basecomponent';
import { Bind } from '@openng/optimus-ui/bind';
import { ProgressBarContentTemplateContext, ProgressBarPassThrough } from '@openng/optimus-ui/types/progressbar';
import { ProgressBarStyle } from './style/progressbarstyle';

/**
 * Like `numberAttribute`, but maps `null`, `undefined` and non-numeric values to `undefined`
 * instead of `NaN`, so no `NaN` ever reaches the DOM (aria-valuenow, label, width).
 */
function optionalNumberAttribute(value: unknown): number | undefined {
    const parsed = numberAttribute(value);
    return Number.isNaN(parsed) ? undefined : parsed;
}

/**
 * ProgressBar is a process status indicator.
 * @group Components
 */
@Component({
    selector: 'p-progressBar, p-progressbar, p-progress-bar',
    imports: [CommonModule, SharedModule, Bind],
    template: `
        @if (mode() === 'determinate') {
            <div [class]="cn(cx('value'), valueStyleClass())" [pBind]="ptm('value')" [style.width.%]="value()" [style.display]="'flex'" [style.background]="color()" [attr.data-p]="dataP()">
                <div [class]="cx('label')" [pBind]="ptm('label')" [attr.data-p]="dataP()">
                    @if (showValue() && !contentTemplate() && !_contentTemplate()) {
                        <div [style.display]="value() != null && value() !== 0 ? 'flex' : 'none'">{{ value() }}{{ unit() }}</div>
                    }
                    <ng-container *ngTemplateOutlet="contentTemplate() || _contentTemplate(); context: { $implicit: value() }"></ng-container>
                </div>
            </div>
        }
        @if (mode() === 'indeterminate') {
            <div [class]="cn(cx('value'), valueStyleClass())" [pBind]="ptm('value')" [style.background]="color()" [attr.data-p]="dataP()"></div>
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [ProgressBarStyle, { provide: PARENT_INSTANCE, useExisting: ProgressBar }],
    host: {
        role: 'progressbar',
        '[attr.aria-valuemin]': '0',
        '[attr.aria-valuenow]': 'ariaValueNow()',
        '[attr.aria-valuemax]': '100',
        '[attr.aria-valuetext]': 'valueText()',
        '[class]': "cx('root')",
        '[attr.data-p]': 'dataP()'
    },
    hostDirectives: [Bind]
})
export class ProgressBar extends BaseComponent<ProgressBarPassThrough> {
    componentName = 'ProgressBar';

    bindDirectiveInstance = inject(Bind, { self: true });

    /**
     * Current value of the progress.
     * @group Props
     */
    readonly value = input<number | undefined, unknown>(undefined, { transform: optionalNumberAttribute });
    /**
     * Whether to display the progress bar value.
     * @group Props
     */
    readonly showValue = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Style class of the value element.
     * @group Props
     */
    readonly valueStyleClass = input<string | undefined>(undefined);
    /**
     * Unit sign appended to the value.
     * @group Props
     */
    readonly unit = input<string>('%');
    /**
     * Defines the mode of the progress
     * @defaultValue 'determinate'
     * @group Props
     */
    readonly mode = input<'determinate' | 'indeterminate'>('determinate');
    /**
     * Color for the background of the progress.
     * @group Props
     */
    readonly color = input<string | undefined>(undefined);
    /**
     * Template of the content.
     * @param {ProgressBarContentTemplateContext} context - content context.
     * @see {@link ProgressBarContentTemplateContext}
     * @group Templates
     */
    readonly contentTemplate = contentChild<TemplateRef<ProgressBarContentTemplateContext>>('content', { descendants: false });

    constructor() {
        super();
        afterEveryRender(() => this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root'])));
    }

    _componentStyle = inject(ProgressBarStyle);

    readonly templates = contentChildren(PrimeTemplate);

    readonly _contentTemplate = computed<TemplateRef<ProgressBarContentTemplateContext> | undefined>(() => this.templates().at(-1)?.template);

    /**
     * Value exposed through aria-valuenow. Omitted in indeterminate mode, as WAI-ARIA requires,
     * and when no value is set.
     */
    readonly ariaValueNow = computed(() => (this.mode() === 'determinate' ? this.value() : undefined));

    /**
     * Human-readable value exposed through aria-valuetext, e.g. "50%" or "5 MB".
     * Omitted whenever aria-valuenow is, so assistive technologies don't announce a bogus value.
     */
    readonly valueText = computed(() => {
        const value = this.ariaValueNow();
        return value != null ? `${value}${this.unit()}` : undefined;
    });

    readonly dataP = computed(() =>
        this.cn({
            determinate: this.mode() === 'determinate',
            indeterminate: this.mode() === 'indeterminate'
        })
    );
}

@NgModule({
    imports: [ProgressBar, SharedModule],
    exports: [ProgressBar, SharedModule]
})
export class ProgressBarModule {}
