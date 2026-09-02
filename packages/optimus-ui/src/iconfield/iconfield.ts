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
    standalone: true,
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
    _componentStyle = inject(IconFieldStyle);

    bindDirectiveInstance = inject(Bind, { self: true });

    readonly hostName = input<any>('');

    /**
     * Position of the icon.
     * @group Props
     */
    readonly iconPosition = input<'right' | 'left'>('left');

    componentName = 'IconField';

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
    imports: [IconField],
    exports: [IconField]
})
export class IconFieldModule {}
