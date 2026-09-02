import { afterEveryRender, booleanAttribute, ChangeDetectionStrategy, Component, inject, input, model, numberAttribute, signal, ViewEncapsulation } from '@angular/core';
import { uuid } from '@openng/optimus-ui-utils';
import { BaseComponent, PARENT_INSTANCE } from '@openng/optimus-ui/basecomponent';
import { Bind, BindModule } from '@openng/optimus-ui/bind';
import { TabsPassThrough } from '@openng/optimus-ui/types/tabs';
import { TabsStyle } from './style/tabsstyle';

/**
 * Tabs facilitates seamless switching between different views.
 * @group Components
 */
@Component({
    selector: 'p-tabs',
    standalone: true,
    imports: [BindModule],
    template: ` <ng-content></ng-content>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [TabsStyle, { provide: PARENT_INSTANCE, useExisting: Tabs }],
    host: {
        '[class]': 'cx("root")',
        '[attr.id]': 'id()'
    },
    hostDirectives: [Bind]
})
export class Tabs extends BaseComponent<TabsPassThrough> {
    bindDirectiveInstance = inject(Bind, { self: true });

    _componentStyle = inject(TabsStyle);

    /**
     * Value of the active tab.
     * @defaultValue undefined
     * @group Props
     */
    value = model<string | number | undefined>(undefined);

    /**
     * When specified, enables horizontal and/or vertical scrolling.
     * @type boolean
     * @defaultValue false
     * @group Props
     */
    scrollable = input(false, { transform: booleanAttribute });

    /**
     * When enabled, tabs are not rendered until activation.
     * @type boolean
     * @defaultValue false
     * @group Props
     */
    lazy = input(false, { transform: booleanAttribute });

    /**
     * When enabled, the focused tab is activated.
     * @type boolean
     * @defaultValue false
     * @group Props
     */
    selectOnFocus = input(false, { transform: booleanAttribute });

    /**
     * Whether to display navigation buttons in container when scrollable is enabled.
     * @type boolean
     * @defaultValue true
     * @group Props
     */
    showNavigators = input(true, { transform: booleanAttribute });

    /**
     * Tabindex of the tab buttons.
     * @type number
     * @defaultValue 0
     * @group Props
     */
    tabindex = input(0, { transform: numberAttribute });

    componentName = 'Tabs';

    id = signal<string>(uuid('pn_id_'));

    constructor() {
        super();
        // Re-apply the host/root pass-through sections after each render (replaces the former
        // ngAfterViewChecked hook). Bind.setAttrs writes into a signal behind an equality check,
        // so unchanged PT resolutions are no-ops.
        afterEveryRender(() => {
            this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
        });
    }

    updateValue(newValue) {
        this.value.update(() => newValue);
    }
}
