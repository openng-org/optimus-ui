import { afterEveryRender, afterNextRender, booleanAttribute, ChangeDetectionStrategy, Component, computed, Directive, effect, inject, input, NgModule, untracked, ViewEncapsulation } from '@angular/core';
import { addClass, createElement, hasClass, isNotEmpty, removeClass, uuid } from '@openng/optimus-ui-utils';
import { SharedModule } from '@openng/optimus-ui/api';
import { BaseComponent, PARENT_INSTANCE } from '@openng/optimus-ui/basecomponent';
import { Bind, BindModule } from '@openng/optimus-ui/bind';
import type { BadgePassThrough, BadgeSeverity } from '@openng/optimus-ui/types/badge';
import { BadgeStyle } from './style/badgestyle';

/**
 * Badge Directive is directive usage of badge component.
 * @group Components
 */
@Directive({
    selector: '[pBadge]',
    providers: [BadgeStyle, { provide: PARENT_INSTANCE, useExisting: BadgeDirective }],
    standalone: true
})
export class BadgeDirective extends BaseComponent {
    _componentStyle = inject(BadgeStyle);

    /**
     * Used to pass attributes to DOM elements inside the Badge component.
     * @defaultValue undefined
     * @deprecated use pBadgePT instead.
     * @group Props
     */
    ptBadgeDirective = input<BadgePassThrough | undefined>();

    /**
     * Used to pass attributes to DOM elements inside the Badge component.
     * @defaultValue undefined
     * @group Props
     */
    pBadgePT = input<BadgePassThrough | undefined>();

    /**
     * Indicates whether the component should be rendered without styles.
     * @defaultValue undefined
     * @group Props
     */
    pBadgeUnstyled = input<boolean | undefined>();

    /**
     * When specified, disables the component.
     * @group Props
     */
    readonly disabled = input<boolean>(false, { alias: 'badgeDisabled' });

    /**
     * Size of the badge, valid options are "large" and "xlarge".
     * @group Props
     */
    readonly badgeSize = input<'large' | 'xlarge' | 'small' | null>();

    /**
     * Size of the badge, valid options are "large" and "xlarge".
     * @group Props
     * @deprecated use badgeSize instead.
     */
    readonly size = input<'large' | 'xlarge' | 'small' | null>();

    /**
     * Severity type of the badge.
     * @group Props
     */
    readonly severity = input<BadgeSeverity | null>();

    /**
     * Value to display inside the badge.
     * @group Props
     */
    readonly value = input<string | number>();

    /**
     * Inline style of the element.
     * @group Props
     */
    readonly badgeStyle = input<{ [klass: string]: any } | null>();

    /**
     * Class of the element.
     * @group Props
     */
    readonly badgeStyleClass = input<string>();

    private id!: string;

    badgeEl: HTMLElement;

    private get activeElement(): HTMLElement {
        return this.el.nativeElement.nodeName.indexOf('-') != -1 ? this.el.nativeElement.firstChild : this.el.nativeElement;
    }

    private get canUpdateBadge(): boolean {
        return isNotEmpty(this.id) && !this.disabled();
    }

    constructor() {
        super();
        effect(() => {
            const pt = this.ptBadgeDirective() || this.pBadgePT();
            pt && this.directivePT.set(pt);
        });

        effect(() => {
            this.pBadgeUnstyled() && this.directiveUnstyled.set(this.pBadgeUnstyled());
        });

        // React to input changes on the rendered badge element (replaces the former ngOnChanges).
        // Before the badge element exists (id unset) every branch is a guarded no-op, matching the
        // original behavior where updates only applied after the initial render.
        effect(() => {
            this.disabled();
            untracked(() => this.toggleDisableState());
        });

        let previousSeverity: BadgeSeverity | null | undefined;
        effect(() => {
            const severity = this.severity();
            untracked(() => {
                if (this.canUpdateBadge) {
                    this.setSeverity(previousSeverity);
                }
                previousSeverity = severity;
            });
        });

        effect(() => {
            this.size();
            this.badgeSize();
            untracked(() => {
                if (this.canUpdateBadge) {
                    this.setSizeClasses();
                }
            });
        });

        effect(() => {
            this.value();
            untracked(() => {
                if (this.canUpdateBadge) {
                    this.setValue();
                }
            });
        });

        effect(() => {
            this.badgeStyle();
            this.badgeStyleClass();
            untracked(() => {
                if (this.canUpdateBadge) {
                    this.applyStyles();
                }
            });
        });

        // Initial badge rendering (replaces the former ngAfterViewInit hook).
        afterNextRender(() => {
            this.id = uuid('pn_id_') + '_badge';
            this.renderBadgeContent();
        });
    }

    private setValue(element?: HTMLElement): void {
        const badge = element ?? this.document.getElementById(this.id);

        if (!badge) {
            return;
        }

        if (this.value() != null) {
            if (hasClass(badge, 'p-badge-dot')) {
                removeClass(badge, 'p-badge-dot');
            }

            if (this.value() != null && String(this.value()).length === 1) {
                addClass(badge, 'p-badge-circle');
            } else {
                removeClass(badge, 'p-badge-circle');
            }
        } else {
            if (!hasClass(badge, 'p-badge-dot')) {
                addClass(badge, 'p-badge-dot');
            }

            removeClass(badge, 'p-badge-circle');
        }

        badge.textContent = '';
        const badgeValue = this.value() != null ? String(this.value()) : '';
        this.renderer.appendChild(badge, this.document.createTextNode(badgeValue));
    }

    private setSizeClasses(element?: HTMLElement): void {
        const badge = element ?? this.document.getElementById(this.id);

        if (!badge) {
            return;
        }

        if (this.badgeSize()) {
            if (this.badgeSize() === 'large') {
                addClass(badge, 'p-badge-lg');
                removeClass(badge, 'p-badge-xl');
            }

            if (this.badgeSize() === 'xlarge') {
                addClass(badge, 'p-badge-xl');
                removeClass(badge, 'p-badge-lg');
            }
        } else if (this.size() && !this.badgeSize()) {
            if (this.size() === 'large') {
                addClass(badge, 'p-badge-lg');
                removeClass(badge, 'p-badge-xl');
            }

            if (this.size() === 'xlarge') {
                addClass(badge, 'p-badge-xl');
                removeClass(badge, 'p-badge-lg');
            }
        } else {
            removeClass(badge, 'p-badge-lg');
            removeClass(badge, 'p-badge-xl');
        }
    }

    private renderBadgeContent(): void {
        if (this.disabled()) {
            return;
        }

        const el = this.activeElement;
        const badge = <HTMLElement>createElement('span', { class: this.cx('root'), id: this.id, 'p-bind': this.ptm('root') });
        this.setSeverity(null, badge);
        this.setSizeClasses(badge);
        this.setValue(badge);
        addClass(el, 'p-overlay-badge');
        this.renderer.appendChild(el, badge);
        this.badgeEl = badge;
        this.applyStyles();
    }

    private applyStyles(): void {
        if (this.badgeEl && this.badgeStyle() && typeof this.badgeStyle() === 'object') {
            for (const [key, value] of Object.entries(this.badgeStyle()!)) {
                this.renderer.setStyle(this.badgeEl, key, value);
            }
        }
        if (this.badgeEl && this.badgeStyleClass()) {
            this.badgeEl.classList.add(...this.badgeStyleClass()!.split(' '));
        }
    }

    private setSeverity(oldSeverity?: BadgeSeverity | null, element?: HTMLElement): void {
        const badge = element ?? this.document.getElementById(this.id);

        if (!badge) {
            return;
        }

        if (this.severity()) {
            addClass(badge, `p-badge-${this.severity()}`);
        }

        if (oldSeverity) {
            removeClass(badge, `p-badge-${oldSeverity}`);
        }
    }

    private toggleDisableState(): void {
        if (!this.id) {
            return;
        }

        if (this.disabled()) {
            const badge = this.activeElement?.querySelector(`#${this.id}`);

            if (badge) {
                this.renderer.removeChild(this.activeElement, badge);
            }
        } else {
            this.renderBadgeContent();
        }
    }
}
/**
 * Badge is a small status indicator for another element.
 * @group Components
 */
@Component({
    selector: 'p-badge',
    template: `{{ value() }}`,
    standalone: true,
    imports: [SharedModule, BindModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [BadgeStyle, { provide: PARENT_INSTANCE, useExisting: Badge }],
    host: {
        '[class]': "cx('root')",
        '[style.display]': 'badgeDisabled() ? "none" : null',
        '[attr.data-p]': 'dataP()'
    },
    hostDirectives: [Bind]
})
export class Badge extends BaseComponent<BadgePassThrough> {
    bindDirectiveInstance = inject(Bind, { self: true });

    _componentStyle = inject(BadgeStyle);

    /**
     * Size of the badge, valid options are "large" and "xlarge".
     * @group Props
     */
    badgeSize = input<'small' | 'large' | 'xlarge' | null>();

    /**
     * Size of the badge, valid options are "large" and "xlarge".
     * @group Props
     */
    size = input<'small' | 'large' | 'xlarge' | null>();

    /**
     * Severity type of the badge.
     * @group Props
     */
    severity = input<BadgeSeverity | null>();

    /**
     * Value to display inside the badge.
     * @group Props
     */
    value = input<string | number | null>();

    /**
     * When specified, disables the component.
     * @group Props
     */
    badgeDisabled = input<boolean, boolean>(false, { transform: booleanAttribute });

    componentName = 'Badge';

    readonly dataP = computed(() =>
        this.cn({
            circle: this.value() != null && String(this.value()).length === 1,
            empty: this.value() == null,
            disabled: this.badgeDisabled(),
            [this.severity() as string]: this.severity(),
            [this.size() as string]: this.size()
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
    imports: [Badge, BadgeDirective, SharedModule],
    exports: [Badge, BadgeDirective, SharedModule]
})
export class BadgeModule {}
