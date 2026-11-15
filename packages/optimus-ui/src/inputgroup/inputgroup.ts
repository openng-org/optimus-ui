import { afterEveryRender, ChangeDetectionStrategy, Component, inject, NgModule } from '@angular/core';
import { SharedModule } from '@openng/optimus-ui/api';
import { BaseComponent, PARENT_INSTANCE } from '@openng/optimus-ui/basecomponent';
import { Bind, BindModule } from '@openng/optimus-ui/bind';
import { InputGroupPassThrough } from '@openng/optimus-ui/types/inputgroup';
import { InputGroupStyle } from './style/inputgroupstyle';

/**
 * InputGroup displays text, icon, buttons and other content can be grouped next to an input.
 * @group Components
 */
@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'p-inputgroup, p-inputGroup, p-input-group',
    imports: [BindModule],
    template: ` <ng-content></ng-content> `,
    providers: [InputGroupStyle, { provide: PARENT_INSTANCE, useExisting: InputGroup }],
    hostDirectives: [Bind],
    host: {
        '[class]': "cx('root')"
    }
})
export class InputGroup extends BaseComponent<InputGroupPassThrough> {
    componentName = 'InputGroup';

    _componentStyle = inject(InputGroupStyle);

    bindDirectiveInstance = inject(Bind, { self: true });

    constructor() {
        super();
        afterEveryRender(() => this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root'])));
    }
}

@NgModule({
    imports: [InputGroup, SharedModule],
    exports: [InputGroup, SharedModule]
})
export class InputGroupModule {}
