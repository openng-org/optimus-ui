import { afterEveryRender, ChangeDetectionStrategy, Component, inject, input, NgModule, ViewEncapsulation } from '@angular/core';
import { SharedModule } from '@openng/optimus-ui/api';
import { BaseComponent, PARENT_INSTANCE } from '@openng/optimus-ui/basecomponent';
import { Bind, BindModule } from '@openng/optimus-ui/bind';
import { InputIconPassThrough } from '@openng/optimus-ui/types/inputicon';
import { InputIconStyle } from './style/inputiconstyle';

/**
 * InputIcon displays an icon.
 * @group Components
 */
@Component({
    selector: 'p-inputicon, p-inputIcon',
    imports: [SharedModule, BindModule],
    template: `<ng-content></ng-content>`,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [InputIconStyle, { provide: PARENT_INSTANCE, useExisting: InputIcon }],
    hostDirectives: [Bind],
    host: {
        '[class]': "cx('root')"
    }
})
export class InputIcon extends BaseComponent<InputIconPassThrough> {
    componentName = 'InputIcon';

    readonly hostName = input<any>('');

    _componentStyle = inject(InputIconStyle);

    bindDirectiveInstance = inject(Bind, { self: true });

    constructor() {
        super();

        afterEveryRender(() => {
            this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
        });
    }
}

@NgModule({
    imports: [InputIcon, SharedModule],
    exports: [InputIcon, SharedModule]
})
export class InputIconModule {}
