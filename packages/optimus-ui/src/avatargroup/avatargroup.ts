import { afterEveryRender, ChangeDetectionStrategy, Component, inject, NgModule, ViewEncapsulation } from '@angular/core';
import { SharedModule } from '@openng/optimus-ui/api';
import { BaseComponent, PARENT_INSTANCE } from '@openng/optimus-ui/basecomponent';
import { Bind } from '@openng/optimus-ui/bind';
import { AvatarGroupPassThrough } from '@openng/optimus-ui/types/avatargroup';
import { AvatarGroupStyle } from './style/avatargroupstyle';

/**
 * AvatarGroup is a helper component for Avatar.
 * @group Components
 */
@Component({
    selector: 'p-avatarGroup, p-avatar-group, p-avatargroup',
    standalone: true,
    imports: [SharedModule],
    template: ` <ng-content></ng-content> `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [AvatarGroupStyle, { provide: PARENT_INSTANCE, useExisting: AvatarGroup }],
    host: {
        '[class]': "cx('root')"
    },
    hostDirectives: [Bind]
})
export class AvatarGroup extends BaseComponent<AvatarGroupPassThrough> {
    bindDirectiveInstance = inject(Bind, { self: true });

    _componentStyle = inject(AvatarGroupStyle);

    componentName = 'AvatarGroup';

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
    imports: [AvatarGroup, SharedModule],
    exports: [AvatarGroup, SharedModule]
})
export class AvatarGroupModule {}
