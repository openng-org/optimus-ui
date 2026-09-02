import { NgTemplateOutlet } from '@angular/common';
import { afterEveryRender, booleanAttribute, ChangeDetectionStrategy, Component, computed, contentChild, forwardRef, inject, input, model, ViewEncapsulation } from '@angular/core';
import { equals } from '@openng/optimus-ui-utils';
import { BaseComponent, PARENT_INSTANCE } from '@openng/optimus-ui/basecomponent';
import { Bind, BindModule } from '@openng/optimus-ui/bind';
import { TabPanelStyle } from './style/tabpanelstyle';
import { Tabs } from './tabs';
import { TabPanelPassThrough } from '@openng/optimus-ui/types/tabs';

/**
 * TabPanel is a helper component for Tabs component.
 * @group Components
 */
@Component({
    selector: 'p-tabpanel',
    standalone: true,
    imports: [NgTemplateOutlet, BindModule],
    template: `
        <ng-template #defaultContent>
            <ng-content />
        </ng-template>

        @if (shouldRender()) {
            <ng-container *ngTemplateOutlet="content() ? content() : defaultContent" />
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [TabPanelStyle, { provide: PARENT_INSTANCE, useExisting: TabPanel }],
    host: {
        '[class]': 'cx("root")',
        '[attr.id]': 'id()',
        '[attr.role]': '"tabpanel"',
        '[attr.aria-labelledby]': 'ariaLabelledby()',
        '[attr.data-p-active]': 'active()',
        '[hidden]': '!active()'
    },
    hostDirectives: [Bind]
})
export class TabPanel extends BaseComponent<TabPanelPassThrough> {
    bindDirectiveInstance = inject(Bind, { self: true });

    pcTabs = inject<Tabs>(forwardRef(() => Tabs));

    _componentStyle = inject(TabPanelStyle);

    /**
     * When enabled, tab is not rendered until activation.
     * @type boolean
     * @defaultValue false
     * @group Props
     */
    lazy = input(false, { transform: booleanAttribute });

    /**
     * Value of the active tab.
     * @defaultValue undefined
     * @group Props
     */
    value = model<string | number | undefined>(undefined);

    /**
     * Template for initializing complex content when lazy is enabled.
     * @group Templates
     */
    content = contentChild('content');

    componentName = 'TabPanel';

    id = computed(() => `${this.pcTabs.id()}_tabpanel_${this.value()}`);

    ariaLabelledby = computed(() => `${this.pcTabs.id()}_tab_${this.value()}`);

    active = computed(() => equals(this.pcTabs.value(), this.value()));

    isLazyEnabled = computed(() => this.pcTabs.lazy() || this.lazy());

    private hasBeenRendered = false;

    shouldRender = computed(() => {
        if (!this.isLazyEnabled() || this.hasBeenRendered) {
            return true;
        }

        if (this.active()) {
            this.hasBeenRendered = true;
            return true;
        }

        return false;
    });

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
