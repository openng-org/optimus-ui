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
    imports: [BadgeModule, SharedModule, Bind],
    template: `
        <div [class]="cx('root')" [pBind]="ptm('root')">
            <ng-content></ng-content>
            <p-badge [pt]="ptm('pcBadge')" [styleClass]="styleClass()" [style]="style()" [badgeSize]="badgeSize()" [severity]="severity()" [value]="value()" [badgeDisabled]="badgeDisabled()" />
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [OverlayBadgeStyle, { provide: PARENT_INSTANCE, useExisting: OverlayBadge }],
    hostDirectives: [Bind]
})
export class OverlayBadge extends BaseComponent<OverlayBadgePassThrough> {
    componentName = 'OverlayBadge';

    bindDirectiveInstance = inject(Bind, { self: true });

    /**
     * Class of the element.
     * @group Props
     */
    readonly styleClass = input<string | undefined>();
    /**
     * Inline style of the element.
     * @group Props
     */
    readonly style = input<{ [klass: string]: any } | null | undefined>();
    /**
     * Size of the badge, valid options are "large" and "xlarge".
     * @group Props
     */
    readonly badgeSize = input<'small' | 'large' | 'xlarge' | null | undefined>();
    /**
     * Severity type of the badge.
     * @group Props
     */
    readonly severity = input<BadgeSeverity | null | undefined>();
    /**
     * Value to display inside the badge.
     * @group Props
     */
    readonly value = input<string | number | null | undefined>();
    /**
     * When specified, disables the component.
     * @group Props
     */
    readonly badgeDisabled = input(false, { transform: booleanAttribute });

    constructor() {
        super();
        afterEveryRender(() => this.bindDirectiveInstance.setAttrs(this.ptm('host')));
    }

    _componentStyle = inject(OverlayBadgeStyle);
}

@NgModule({
    imports: [OverlayBadge, SharedModule],
    exports: [OverlayBadge, SharedModule]
})
export class OverlayBadgeModule {}
