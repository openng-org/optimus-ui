import { afterEveryRender, ChangeDetectionStrategy, Component, inject, NgModule, ViewEncapsulation } from '@angular/core';
import { BaseComponent, PARENT_INSTANCE } from '@openng/optimus-ui/basecomponent';
import { Bind } from '@openng/optimus-ui/bind';
import { FluidPassThrough } from '@openng/optimus-ui/types/fluid';
import { FluidStyle } from './style/fluidstyle';

/**
 * Fluid is a layout component to make descendant components span full width of their container.
 * @group Components
 */
@Component({
    selector: 'p-fluid',
    template: ` <ng-content></ng-content> `,
    standalone: true,
    imports: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [FluidStyle, { provide: PARENT_INSTANCE, useExisting: Fluid }],
    host: {
        '[class]': "cx('root')"
    },
    hostDirectives: [Bind]
})
export class Fluid extends BaseComponent<FluidPassThrough> {
    bindDirectiveInstance = inject(Bind, { self: true });

    _componentStyle = inject(FluidStyle);

    componentName = 'Fluid';

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
    imports: [Fluid],
    exports: [Fluid]
})
export class FluidModule {}
