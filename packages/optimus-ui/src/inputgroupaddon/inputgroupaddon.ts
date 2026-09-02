import { afterEveryRender, ChangeDetectionStrategy, Component, inject, NgModule } from '@angular/core';
import { SharedModule } from '@openng/optimus-ui/api';
import { BaseComponent, PARENT_INSTANCE } from '@openng/optimus-ui/basecomponent';
import { Bind, BindModule } from '@openng/optimus-ui/bind';
import { InputGroupAddonPassThrough } from '@openng/optimus-ui/types/inputgroupaddon';
import { InputGroupAddonStyle } from './style/inputgroupaddonstyle';

/**
 * InputGroupAddon displays text, icon, buttons and other content can be grouped next to an input.
 * @group Components
 */
@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'p-inputgroup-addon, p-inputGroupAddon',
    template: ` <ng-content></ng-content> `,
    standalone: true,
    imports: [BindModule],
    host: {
        '[class]': "cx('root')"
    },
    providers: [InputGroupAddonStyle, { provide: PARENT_INSTANCE, useExisting: InputGroupAddon }],
    hostDirectives: [Bind]
})
export class InputGroupAddon extends BaseComponent<InputGroupAddonPassThrough> {
    _componentStyle = inject(InputGroupAddonStyle);

    bindDirectiveInstance = inject(Bind, { self: true });

    componentName = 'InputGroupAddon';

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
    imports: [InputGroupAddon, SharedModule],
    exports: [InputGroupAddon, SharedModule]
})
export class InputGroupAddonModule {}
