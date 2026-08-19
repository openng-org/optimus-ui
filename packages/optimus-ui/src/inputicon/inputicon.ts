import { ChangeDetectionStrategy, Component, inject, InjectionToken, Input, NgModule, ViewEncapsulation } from '@angular/core';
import { SharedModule } from '@openng/optimus-ui/api';
import { BaseComponent, PARENT_INSTANCE } from '@openng/optimus-ui/basecomponent';
import { Bind, BindModule } from '@openng/optimus-ui/bind';
import { InputIconPassThrough } from '@openng/optimus-ui/types/inputicon';
import { InputIconStyle } from './style/inputiconstyle';

const INPUTICON_INSTANCE = new InjectionToken<InputIcon>('INPUTICON_INSTANCE');

/**
 * InputIcon displays an icon.
 * @group Components
 */
@Component({
    selector: 'p-inputicon, p-inputIcon',
    standalone: true,
    imports: [SharedModule, BindModule],
    template: `<ng-content></ng-content>`,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [InputIconStyle, { provide: INPUTICON_INSTANCE, useExisting: InputIcon }, { provide: PARENT_INSTANCE, useExisting: InputIcon }],
    hostDirectives: [Bind],
    host: {
        '[class]': "cn(cx('root'), styleClass)"
    }
})
export class InputIcon extends BaseComponent<InputIconPassThrough> {
    componentName = 'InputIcon';

    @Input() hostName: any = '';
    /**
     * Style class of the element.
     * @deprecated since v20.0.0, use `class` instead.
     * @group Props
     */
    @Input() styleClass: string | undefined;

    _componentStyle = inject(InputIconStyle);

    $pcInputIcon: InputIcon | undefined = inject(INPUTICON_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    bindDirectiveInstance = inject(Bind, { self: true });

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
    }
}

@NgModule({
    imports: [InputIcon, SharedModule],
    exports: [InputIcon, SharedModule]
})
export class InputIconModule {}
