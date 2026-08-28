import { ChangeDetectionStrategy, Component, HostBinding, inject, InjectionToken, Input, NgModule, ViewEncapsulation } from '@angular/core';
import { SharedModule } from '@openng/optimus-ui/api';
import { BaseComponent, PARENT_INSTANCE } from '@openng/optimus-ui/basecomponent';
import { Bind } from '@openng/optimus-ui/bind';
import { AvatarGroupPassThrough } from '@openng/optimus-ui/types/avatargroup';
import { AvatarGroupStyle } from './style/avatargroupstyle';

const AVATARGROUP_INSTANCE = new InjectionToken<AvatarGroup>('AVATARGROUP_INSTANCE');

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
    providers: [AvatarGroupStyle, { provide: AVATARGROUP_INSTANCE, useExisting: AvatarGroup }, { provide: PARENT_INSTANCE, useExisting: AvatarGroup }],
    host: {
        '[class]': "cn(cx('root'), styleClass)"
    },
    hostDirectives: [Bind]
})
export class AvatarGroup extends BaseComponent<AvatarGroupPassThrough> {
    componentName = 'AvatarGroup';

    $pcAvatarGroup: AvatarGroup | undefined = inject(AVATARGROUP_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    bindDirectiveInstance = inject(Bind, { self: true });

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
    }

    /**
     * Style class of the component
     * @group Props
     */
    @Input() styleClass: string | undefined;
    /**
     * Inline style of the component.
     * @group Props
     */
    @Input() style: { [klass: string]: any } | null | undefined;

    @HostBinding('style') get hostStyle() {
        return this.style;
    }

    _componentStyle = inject(AvatarGroupStyle);
}

@NgModule({
    imports: [AvatarGroup, SharedModule],
    exports: [AvatarGroup, SharedModule]
})
export class AvatarGroupModule {}
