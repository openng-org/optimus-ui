import { afterEveryRender, ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core';
import { BaseComponent, PARENT_INSTANCE } from '@openng/optimus-ui/basecomponent';
import { Bind, BindModule } from '@openng/optimus-ui/bind';
import { TabPanelsStyle } from './style/tabpanelsstyle';
import { TabPanelsPassThrough } from '@openng/optimus-ui/types/tabs';

/**
 * TabPanels is a helper component for Tabs component.
 * @group Components
 */
@Component({
    selector: 'p-tabpanels',
    standalone: true,
    imports: [BindModule],
    template: ` <ng-content></ng-content>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        '[class]': 'cx("root")',
        '[attr.role]': '"presentation"'
    },
    providers: [TabPanelsStyle, { provide: PARENT_INSTANCE, useExisting: TabPanels }],
    hostDirectives: [Bind]
})
export class TabPanels extends BaseComponent<TabPanelsPassThrough> {
    bindDirectiveInstance = inject(Bind, { self: true });

    _componentStyle = inject(TabPanelsStyle);

    componentName = 'TabPanels';

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
