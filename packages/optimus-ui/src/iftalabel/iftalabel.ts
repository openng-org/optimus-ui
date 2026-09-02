import { afterEveryRender, ChangeDetectionStrategy, Component, inject, NgModule, ViewEncapsulation } from '@angular/core';
import { SharedModule } from '@openng/optimus-ui/api';
import { BaseComponent, PARENT_INSTANCE } from '@openng/optimus-ui/basecomponent';
import { Bind, BindModule } from '@openng/optimus-ui/bind';
import { IftaLabelPassThrough } from '@openng/optimus-ui/types/iftalabel';
import { IftaLabelStyle } from './style/iftalabelstyle';

/**
 * IftaLabel is used to create infield top aligned labels.
 * @group Components
 */
@Component({
    selector: 'p-iftalabel, p-iftaLabel, p-ifta-label',
    standalone: true,
    imports: [BindModule],
    template: ` <ng-content></ng-content> `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [IftaLabelStyle, { provide: PARENT_INSTANCE, useExisting: IftaLabel }],
    hostDirectives: [Bind],
    host: {
        '[class]': "cx('root')"
    }
})
export class IftaLabel extends BaseComponent<IftaLabelPassThrough> {
    _componentStyle = inject(IftaLabelStyle);

    bindDirectiveInstance = inject(Bind, { self: true });

    componentName = 'IftaLabel';

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
    imports: [IftaLabel, SharedModule],
    exports: [IftaLabel, SharedModule]
})
export class IftaLabelModule {}
