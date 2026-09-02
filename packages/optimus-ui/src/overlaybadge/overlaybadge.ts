import { afterEveryRender, booleanAttribute, ChangeDetectionStrategy, Component, inject, input, NgModule, ViewEncapsulation } from '@angular/core';
import { SharedModule } from '@openng/optimus-ui/api';
import { BadgeModule } from '@openng/optimus-ui/badge';
import { BaseComponent, PARENT_INSTANCE } from '@openng/optimus-ui/basecomponent';
import { Bind } from '@openng/optimus-ui/bind';
import type { BadgeSeverity } from '@openng/optimus-ui/types/badge';
import { OverlayBadgePassThrough } from '@openng/optimus-ui/types/overlaybadge';
import { OverlayBadgeStyle } from './style/overlaybadgestyle';

/**
 * OverlayPanel is a container component positioned as connected to its target.
 * @group Components
 */
@Component({
    selector: 'p-overlayBadge, p-overlay-badge, p-overlaybadge',
    standalone: true,
    imports: [BadgeModule, SharedModule, Bind],
    template: `
        <div [class]="cx('root')" [pBind]="ptm('root')">
            <ng-content></ng-content>
            <p-badge [pt]="ptm('pcBadge')" [class]="styleClass()" [style]="style()" [badgeSize]="badgeSize()" [severity]="severity()" [value]="value()" [badgeDisabled]="badgeDisabled()" />
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [OverlayBadgeStyle, { provide: PARENT_INSTANCE, useExisting: OverlayBadge }],
    hostDirectives: [Bind]
})
export class OverlayBadge extends BaseComponent<OverlayBadgePassThrough> {
    bindDirectiveInstance = inject(Bind, { self: true });

    _componentStyle = inject(OverlayBadgeStyle);

    /**
     * Class of the element.
     * @group Props
     */
    readonly styleClass = input<string>();

    /**
     * Inline style of the element.
     * @group Props
     */
    readonly style = input<{ [klass: string]: any } | null>();

    /**
     * Size of the badge, valid options are "large" and "xlarge".
     * @group Props
     */
    readonly badgeSize = input<'small' | 'large' | 'xlarge' | null>();

    /**
     * Severity type of the badge.
     * @group Props
     */
    readonly severity = input<BadgeSeverity | null>();

    /**
     * Value to display inside the badge.
     * @group Props
     */
    readonly value = input<string | number | null>();

    /**
     * When specified, disables the component.
     * @group Props
     */
    readonly badgeDisabled = input<boolean, unknown>(false, { transform: booleanAttribute });

    componentName = 'OverlayBadge';

    constructor() {
        super();
        // Re-apply the host pass-through section after each render (replaces the former
        // ngAfterViewChecked hook). Bind.setAttrs writes into a signal behind an equality check,
        // so unchanged PT resolutions are no-ops.
        afterEveryRender(() => {
            this.bindDirectiveInstance.setAttrs(this.ptm('host'));
        });
    }
}

@NgModule({
    imports: [OverlayBadge, SharedModule],
    exports: [OverlayBadge, SharedModule]
})
export class OverlayBadgeModule {}
