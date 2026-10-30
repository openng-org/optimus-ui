import { afterEveryRender, ChangeDetectionStrategy, Component, computed, inject, input, NgModule, ViewEncapsulation } from '@angular/core';
import { SharedModule } from '@openng/optimus-ui/api';
import { BaseComponent, PARENT_INSTANCE } from '@openng/optimus-ui/basecomponent';
import { Bind, BindModule } from '@openng/optimus-ui/bind';
import { DividerStyle } from './style/dividerstyle';
import { DividerPassThrough } from '@openng/optimus-ui/types/divider';

/**
 * Divider is used to separate contents.
 * @group Components
 */
@Component({
    selector: 'p-divider',
    imports: [SharedModule, BindModule],
    template: `
        <div [pBind]="ptm('content')" [class]="cx('content')">
            <ng-content></ng-content>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        '[attr.aria-orientation]': 'layout()',
        role: 'separator',
        '[class]': "cx('root')",
        '[style]': "sx('root')",
        '[attr.data-p]': 'dataP()'
    },
    providers: [DividerStyle, { provide: PARENT_INSTANCE, useExisting: Divider }],
    hostDirectives: [Bind]
})
export class Divider extends BaseComponent<DividerPassThrough> {
    componentName = 'Divider';

    bindDirectiveInstance = inject(Bind, { self: true });

    constructor() {
        super();
        afterEveryRender(() => this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root'])));
    }
    /**
     * Specifies the orientation.
     * @group Props
     */
    readonly layout = input<'horizontal' | 'vertical' | undefined>('horizontal');
    /**
     * Border style type.
     * @group Props
     */
    readonly type = input<'solid' | 'dashed' | 'dotted' | undefined>('solid');
    /**
     * Alignment of the content.
     * @group Props
     */
    readonly align = input<'left' | 'center' | 'right' | 'top' | 'bottom' | undefined>();

    _componentStyle = inject(DividerStyle);

    readonly dataP = computed(() => {
        return this.cn({
            [this.align() as string]: this.align(),
            [this.layout() as string]: this.layout(),
            [this.type() as string]: this.type()
        });
    });
}

@NgModule({
    imports: [Divider, BindModule],
    exports: [Divider, BindModule]
})
export class DividerModule {}
