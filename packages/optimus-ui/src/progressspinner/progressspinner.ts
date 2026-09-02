import { afterEveryRender, ChangeDetectionStrategy, Component, inject, input, NgModule, ViewEncapsulation } from '@angular/core';
import { SharedModule } from '@openng/optimus-ui/api';
import { BaseComponent, PARENT_INSTANCE } from '@openng/optimus-ui/basecomponent';
import { Bind } from '@openng/optimus-ui/bind';
import { ProgressSpinnerPassThrough } from '@openng/optimus-ui/types/progressspinner';
import { ProgressSpinnerStyle } from './style/progressspinnerstyle';

/**
 * ProgressSpinner is a process status indicator.
 * @group Components
 */
@Component({
    selector: 'p-progressSpinner, p-progress-spinner, p-progressspinner',
    standalone: true,
    imports: [SharedModule, Bind],
    template: `
        <svg [class]="cx('spin')" [pBind]="ptm('spin')" viewBox="25 25 50 50" [style.animation-duration]="animationDuration()">
            <circle [class]="cx('circle')" [pBind]="ptm('circle')" cx="50" cy="50" r="20" [attr.fill]="fill()" [attr.stroke-width]="strokeWidth()" stroke-miterlimit="10" />
        </svg>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [ProgressSpinnerStyle, { provide: PARENT_INSTANCE, useExisting: ProgressSpinner }],
    host: {
        '[attr.aria-label]': 'ariaLabel()',
        '[attr.role]': "'progressbar'",
        '[attr.aria-busy]': 'true',
        '[class]': "cx('root')"
    },
    hostDirectives: [Bind]
})
export class ProgressSpinner extends BaseComponent<ProgressSpinnerPassThrough> {
    bindDirectiveInstance = inject(Bind, { self: true });

    _componentStyle = inject(ProgressSpinnerStyle);

    /**
     * Width of the circle stroke.
     * @group Props
     */
    readonly strokeWidth = input<string>('2');

    /**
     * Color for the background of the circle.
     * @group Props
     */
    readonly fill = input<string>('none');

    /**
     * Duration of the rotate animation.
     * @group Props
     */
    readonly animationDuration = input<string>('2s');

    /**
     * Used to define a aria label attribute the current element.
     * @group Props
     */
    readonly ariaLabel = input<string>();

    componentName = 'ProgressSpinner';

    constructor() {
        super();
        // Re-apply the host/root pass-through sections after each render (replaces the former
        // ngAfterViewChecked hook). Bind.setAttrs writes into a signal behind an equality check,
        // so unchanged PT resolutions are no-ops.
        afterEveryRender(() => {
            this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
        });
    }
}

@NgModule({
    imports: [ProgressSpinner, SharedModule],
    exports: [ProgressSpinner, SharedModule]
})
export class ProgressSpinnerModule {}
