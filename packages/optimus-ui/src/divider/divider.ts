import { ChangeDetectionStrategy, Component, inject, InjectionToken, Input, NgModule, ViewEncapsulation } from '@angular/core';
import { SharedModule } from '@openng/optimus-ui/api';
import { BaseComponent, PARENT_INSTANCE } from '@openng/optimus-ui/basecomponent';
import { Bind, BindModule } from '@openng/optimus-ui/bind';
import { DividerStyle } from './style/dividerstyle';
import { DividerPassThrough } from '@openng/optimus-ui/types/divider';

const DIVIDER_INSTANCE = new InjectionToken<Divider>('DIVIDER_INSTANCE');

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
        '[attr.aria-orientation]': 'layout',
        role: 'separator',
        '[class]': "cn(cx('root'), styleClass)",
        '[style]': "sx('root')",
        '[attr.data-p]': 'dataP'
    },
    providers: [DividerStyle, { provide: DIVIDER_INSTANCE, useExisting: Divider }, { provide: PARENT_INSTANCE, useExisting: Divider }],
    hostDirectives: [Bind]
})
export class Divider extends BaseComponent<DividerPassThrough> {
    componentName = 'Divider';

    $pcDivider: Divider | undefined = inject(DIVIDER_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    bindDirectiveInstance = inject(Bind, { self: true });

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
    }
    /**
     * Style class of the component.
     * @deprecated since v20.0.0, use `class` instead.
     * @group Props
     */
    @Input() styleClass: string | undefined;
    /**
     * Specifies the orientation.
     * @group Props
     */
    @Input() layout: 'horizontal' | 'vertical' | undefined = 'horizontal';
    /**
     * Border style type.
     * @group Props
     */
    @Input() type: 'solid' | 'dashed' | 'dotted' | undefined = 'solid';
    /**
     * Alignment of the content.
     * @group Props
     */
    @Input() align: 'left' | 'center' | 'right' | 'top' | 'bottom' | undefined;

    _componentStyle = inject(DividerStyle);

    get dataP() {
        return this.cn({
            [this.align as string]: this.align,
            [this.layout as string]: this.layout,
            [this.type as string]: this.type
        });
    }
}

@NgModule({
    imports: [Divider, BindModule],
    exports: [Divider, BindModule]
})
export class DividerModule {}
