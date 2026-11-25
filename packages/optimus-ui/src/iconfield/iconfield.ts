import { afterEveryRender, ChangeDetectionStrategy, Component, inject, input, NgModule, ViewEncapsulation } from '@angular/core';
import { BaseComponent, PARENT_INSTANCE } from '@openng/optimus-ui/basecomponent';
import { Bind, BindModule } from '@openng/optimus-ui/bind';
import { IconFieldPassThrough } from '@openng/optimus-ui/types/iconfield';
import { IconFieldStyle } from './style/iconfieldstyle';

/**
 * IconField wraps an input and an icon.
 * @group Components
 */
@Component({
    selector: 'p-iconfield, p-iconField, p-icon-field',
    imports: [BindModule],
    template: ` <ng-content></ng-content>`,
    providers: [IconFieldStyle, { provide: PARENT_INSTANCE, useExisting: IconField }],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[class]': "cx('root')"
    },
    hostDirectives: [Bind]
})
export class IconField extends BaseComponent<IconFieldPassThrough> {
    componentName = 'IconField';

    readonly hostName = input<any>('');

    _componentStyle = inject(IconFieldStyle);

    bindDirectiveInstance = inject(Bind, { self: true });

    constructor() {
        super();

        afterEveryRender(() => {
            this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
        });
    }

    /**
     * Position of the icon.
     * @group Props
     */
    readonly iconPosition = input<'right' | 'left'>('left');
}

@NgModule({
    imports: [IconField],
    exports: [IconField]
})
export class IconFieldModule {}
