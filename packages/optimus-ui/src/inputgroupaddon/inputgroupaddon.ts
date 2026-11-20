import { afterEveryRender, ChangeDetectionStrategy, Component, inject, input, NgModule } from '@angular/core';
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
    imports: [BindModule],
    host: {
        '[class]': "cn(cx('root'), styleClass())",
        '[style]': 'style()'
    },
    providers: [InputGroupAddonStyle, { provide: PARENT_INSTANCE, useExisting: InputGroupAddon }],
    hostDirectives: [Bind]
})
export class InputGroupAddon extends BaseComponent<InputGroupAddonPassThrough> {
    componentName = 'InputGroupAddon';

    _componentStyle = inject(InputGroupAddonStyle);

    bindDirectiveInstance = inject(Bind, { self: true });

    constructor() {
        super();
        afterEveryRender(() => this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root'])));
    }

    /**
     * Inline style of the element.
     * @group Props
     */
    readonly style = input<{ [klass: string]: any } | null | undefined>();
    /**
     * Class of the element.
     * @group Props
     */
    readonly styleClass = input<string | undefined>();
}

@NgModule({
    imports: [InputGroupAddon, SharedModule],
    exports: [InputGroupAddon, SharedModule]
})
export class InputGroupAddonModule {}
