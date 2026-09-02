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
    standalone: true,
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
    bindDirectiveInstance = inject(Bind, { self: true });

    _componentStyle = inject(DividerStyle);

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

    componentName = 'Divider';

    readonly dataP = computed(() =>
        this.cn({
            [this.align() as string]: this.align(),
            [this.layout() as string]: this.layout(),
            [this.type() as string]: this.type()
        })
    );

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
    imports: [Divider, BindModule],
    exports: [Divider, BindModule]
})
export class DividerModule {}
