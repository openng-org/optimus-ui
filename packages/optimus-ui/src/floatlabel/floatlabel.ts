import { afterEveryRender, ChangeDetectionStrategy, Component, inject, input, NgModule, ViewEncapsulation } from '@angular/core';
import { SharedModule } from '@openng/optimus-ui/api';
import { BaseComponent, PARENT_INSTANCE } from '@openng/optimus-ui/basecomponent';
import { Bind, BindModule } from '@openng/optimus-ui/bind';
import { FloatLabelPassThrough } from '@openng/optimus-ui/types/floatlabel';
import { FloatLabelStyle } from './style/floatlabelstyle';

/**
 * FloatLabel appears on top of the input field when focused.
 * @group Components
 */
@Component({
    selector: 'p-floatlabel, p-floatLabel, p-float-label',
    imports: [SharedModule, BindModule],
    template: ` <ng-content></ng-content> `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [FloatLabelStyle, { provide: PARENT_INSTANCE, useExisting: FloatLabel }],
    host: {
        '[class]': "cx('root')"
    },
    hostDirectives: [Bind]
})
export class FloatLabel extends BaseComponent<FloatLabelPassThrough> {
    componentName = 'FloatLabel';

    _componentStyle = inject(FloatLabelStyle);

    bindDirectiveInstance = inject(Bind, { self: true });

    constructor() {
        super();
        afterEveryRender(() => this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root'])));
    }

    /**
     * Defines the positioning of the label relative to the input.
     * @group Props
     */
    readonly variant = input<'in' | 'over' | 'on'>('over');
}

@NgModule({
    imports: [FloatLabel, SharedModule],
    exports: [FloatLabel, SharedModule]
})
export class FloatLabelModule {}
