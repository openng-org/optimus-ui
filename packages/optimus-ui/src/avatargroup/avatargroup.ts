import { afterEveryRender, ChangeDetectionStrategy, Component, inject, input, NgModule, ViewEncapsulation } from '@angular/core';
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
    imports: [SharedModule],
    template: ` <ng-content></ng-content> `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [AvatarGroupStyle, { provide: PARENT_INSTANCE, useExisting: AvatarGroup }],
    host: {
        '[class]': "cn(cx('root'), styleClass())",
        '[style]': 'style()'
    },
    hostDirectives: [Bind]
})
export class AvatarGroup extends BaseComponent<AvatarGroupPassThrough> {
    componentName = 'AvatarGroup';

    bindDirectiveInstance = inject(Bind, { self: true });

    constructor() {
        super();
        afterEveryRender(() => this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root'])));
    }

    /**
     * Style class of the component
     * @group Props
     */
    readonly styleClass = input<string | undefined>();
    /**
     * Inline style of the component.
     * @group Props
     */
    readonly style = input<{ [klass: string]: any } | null | undefined>();

    _componentStyle = inject(AvatarGroupStyle);
}

@NgModule({
    imports: [AvatarGroup, SharedModule],
    exports: [AvatarGroup, SharedModule]
})
export class AvatarGroupModule {}
