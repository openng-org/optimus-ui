import { CommonModule } from '@angular/common';
import { afterEveryRender, booleanAttribute, ChangeDetectionStrategy, Component, computed, ElementRef, inject, input, model, NgModule, TemplateRef, ViewEncapsulation, contentChild, viewChild, contentChildren, output } from '@angular/core';
import { MotionEvent, MotionOptions } from '@openng/optimus-ui-motion';
import { uuid } from '@openng/optimus-ui-utils';
import { BlockableUI, Footer, PrimeTemplate, SharedModule } from '@openng/optimus-ui/api';
import { BaseComponent, PARENT_INSTANCE } from '@openng/optimus-ui/basecomponent';
import { Bind, BindModule } from '@openng/optimus-ui/bind';
import { ButtonModule } from '@openng/optimus-ui/button';
import { MinusIcon, PlusIcon } from '@openng/optimus-ui/icons';
import { MotionModule } from '@openng/optimus-ui/motion';
import { Nullable } from '@openng/optimus-ui/ts-helpers';
import type { PanelAfterToggleEvent, PanelBeforeToggleEvent, PanelHeaderIconsTemplateContext, PanelPassThrough } from '@openng/optimus-ui/types/panel';
import { PanelStyle } from './style/panelstyle';

/**
 * Panel is a container with the optional content toggle feature.
 * @group Components
 */
@Component({
    selector: 'p-panel',
    standalone: true,
    imports: [CommonModule, PlusIcon, MinusIcon, ButtonModule, SharedModule, BindModule, MotionModule],
    template: `
        @if (showHeader()) {
            <div [pBind]="ptm('header')" [class]="cx('header')" (click)="onHeaderClick($event)" [attr.id]="id() + '-titlebar'" [attr.data-p]="dataP()">
                @if (_header()) {
                    <span [pBind]="ptm('title')" [class]="cx('title')" [attr.id]="id() + '_header'">{{ _header() }}</span>
                }
                <ng-content select="p-header"></ng-content>
                <ng-container *ngTemplateOutlet="$headerTemplate()"></ng-container>
                <div [pBind]="ptm('headerActions')" [class]="cx('headerActions')">
                    <ng-template *ngTemplateOutlet="$iconsTemplate()"></ng-template>
                    @if (toggleable()) {
                        <p-button
                            [attr.id]="id() + '_header'"
                            severity="secondary"
                            [text]="true"
                            [rounded]="true"
                            type="button"
                            role="button"
                            [styleClass]="cx('pcToggleButton')"
                            [attr.aria-label]="buttonAriaLabel"
                            [attr.aria-controls]="id() + '_content'"
                            [attr.aria-expanded]="!collapsed()"
                            (click)="onIconClick($event)"
                            (keydown)="onKeyDown($event)"
                            [buttonProps]="toggleButtonProps()"
                            [pt]="ptm('pcToggleButton')"
                            [unstyled]="unstyled()"
                        >
                            <ng-template #icon>
                                @if (!$headerIconsTemplate() && !toggleButtonProps()?.icon) {
                                    @if (!collapsed()) {
                                        <svg data-p-icon="minus" [pBind]="ptm('pcToggleButton.icon')" />
                                    }
                                    @if (collapsed()) {
                                        <svg data-p-icon="plus" [pBind]="ptm('pcToggleButton.icon')" />
                                    }
                                }
                                <ng-template *ngTemplateOutlet="$headerIconsTemplate(); context: { $implicit: collapsed() }"></ng-template>
                            </ng-template>
                        </p-button>
                    }
                </div>
            </div>
        }
        <div
            [pBind]="ptm('contentContainer')"
            [pMotion]="!toggleable() || (toggleable() && !collapsed())"
            pMotionName="p-collapsible"
            [pMotionOptions]="computedMotionOptions()"
            [class]="cx('contentContainer')"
            [id]="id() + '_content'"
            role="region"
            [attr.aria-labelledby]="id() + '_header'"
            [attr.aria-hidden]="collapsed()"
            [attr.tabindex]="collapsed() ? '-1' : undefined"
            (pMotionOnAfterEnter)="onToggleDone($event)"
        >
            <div [pBind]="ptm('contentWrapper')" [class]="cx('contentWrapper')">
                <div [pBind]="ptm('content')" [class]="cx('content')" #contentWrapper>
                    <ng-content></ng-content>
                    <ng-container *ngTemplateOutlet="$contentTemplate()"></ng-container>
                </div>

                @if (footerFacet() || $footerTemplate()) {
                    <div [pBind]="ptm('footer')" [class]="cx('footer')">
                        <ng-content select="p-footer"></ng-content>
                        <ng-container *ngTemplateOutlet="$footerTemplate()"></ng-container>
                    </div>
                }
            </div>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [PanelStyle, { provide: PARENT_INSTANCE, useExisting: Panel }],
    host: {
        '[id]': 'id()',
        '[class]': "cx('root')",
        '[attr.data-p]': 'dataP()'
    },
    hostDirectives: [Bind]
})
export class Panel extends BaseComponent<PanelPassThrough> implements BlockableUI {
    _componentStyle = inject(PanelStyle);

    bindDirectiveInstance = inject(Bind, { self: true });

    /**
     * Id of the component.
     */
    readonly id = input<string>(uuid('pn_id_'));

    /**
     * Defines if content of panel can be expanded and collapsed.
     * @group Props
     */
    readonly toggleable = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    /**
     * Header text of the panel.
     * @group Props
     */
    readonly _header = input<string>(undefined, { alias: 'header' });

    /**
     * Defines the initial state of panel content, supports one or two-way binding as well.
     * @group Props
     */
    readonly collapsed = model<boolean | undefined>();

    /**
     * Position of the icons.
     * @group Props
     */
    readonly iconPos = input<'start' | 'end' | 'center'>('end');

    /**
     * Specifies if header of panel cannot be displayed.
     * @group Props
     */
    readonly showHeader = input<boolean, unknown>(true, { transform: booleanAttribute });

    /**
     * Specifies the toggler element to toggle the panel content.
     * @group Props
     */
    readonly toggler = input<'icon' | 'header'>('icon');

    /**
     * Transition options of the animation.
     * @group Props
     * @deprecated since v21.0.0, use `motionOptions` instead.
     */
    readonly transitionOptions = input<string>('400ms cubic-bezier(0.86, 0, 0.07, 1)');

    /**
     * Used to pass all properties of the ButtonProps to the Button component.
     * @group Props
     */
    readonly toggleButtonProps = input<any>();

    /**
     * The motion options.
     * @group Props
     */
    motionOptions = input<MotionOptions | undefined>(undefined);

    /**
     * Callback to invoke before panel toggle.
     * @param {PanelBeforeToggleEvent} event - Custom panel toggle event
     * @group Emits
     */
    readonly onBeforeToggle = output<PanelBeforeToggleEvent>();

    /**
     * Callback to invoke after panel toggle.
     * @param {PanelAfterToggleEvent} event - Custom panel toggle event
     * @group Emits
     */
    readonly onAfterToggle = output<PanelAfterToggleEvent>();

    readonly contentWrapperViewChild = viewChild.required<ElementRef>('contentWrapper');

    readonly footerFacet = contentChild(Footer);

    /**
     * Defines template option for header.
     * @group Templates
     */
    readonly headerTemplate = contentChild<TemplateRef<void>>('header', { descendants: false });

    /**
     * Defines template option for icons.
     * @example
     * ```html
     * <ng-template #icons> </ng-template>
     * ```
     * @group Templates
     */
    readonly iconsTemplate = contentChild<TemplateRef<void>>('icons', { descendants: false });

    /**
     * Defines template option for content.
     * @example
     * ```html
     * <ng-template #content> </ng-template>
     * ```
     * @group Templates
     */
    readonly contentTemplate = contentChild<TemplateRef<void>>('content', { descendants: false });

    /**
     * Defines template option for footer.
     * @example
     * ```html
     * <ng-template #footer> </ng-template>
     * ```
     * @group Templates
     */
    readonly footerTemplate = contentChild<TemplateRef<void>>('footer', { descendants: false });

    /**
     * Defines template option for headerIcon.
     * @param {PanelHeaderIconsTemplateContext} context - context of the template.
     * @example
     * ```html
     * <ng-template #headericons let-collapsed> </ng-template>
     * ```
     * @see {@link PanelHeaderIconsTemplateContext}
     * @group Templates
     */
    readonly headerIconsTemplate = contentChild<TemplateRef<PanelHeaderIconsTemplateContext>>('headericons', { descendants: false });

    readonly templates = contentChildren(PrimeTemplate);

    componentName = 'Panel';

    computedMotionOptions = computed<MotionOptions>(() => {
        return {
            ...this.ptm('motion'),
            ...this.motionOptions()
        };
    });

    get buttonAriaLabel() {
        return this._header();
    }

    /** Effective header template: the \`#header\` content child, or a legacy \`pTemplate="header"\`. */
    readonly $headerTemplate = computed(() => this.headerTemplate() ?? this.templates().find((item) => item.getType() === 'header')?.template);

    /** Effective icons template: the \`#icons\` content child, or a legacy \`pTemplate="icons"\`. */
    readonly $iconsTemplate = computed(() => this.iconsTemplate() ?? this.templates().find((item) => item.getType() === 'icons')?.template);

    /**
     * Effective content template: the \`#content\` content child, a legacy \`pTemplate="content"\`,
     * or (legacy behavior) the last \`pTemplate\` with an unrecognized type.
     */
    readonly $contentTemplate = computed(() => {
        const contentTemplate = this.contentTemplate();
        if (contentTemplate) {
            return contentTemplate;
        }
        const known = ['header', 'footer', 'icons', 'headericons'];
        return [...this.templates()].reverse().find((item) => !known.includes(item.getType()))?.template;
    });

    /** Effective footer template: the \`#footer\` content child, or a legacy \`pTemplate="footer"\`. */
    readonly $footerTemplate = computed(() => this.footerTemplate() ?? this.templates().find((item) => item.getType() === 'footer')?.template);

    /** Effective header icons template: the \`#headericons\` content child, or a legacy \`pTemplate="headericons"\`. */
    readonly $headerIconsTemplate = computed(() => this.headerIconsTemplate() ?? (this.templates().find((item) => item.getType() === 'headericons')?.template as TemplateRef<PanelHeaderIconsTemplateContext> | undefined));

    readonly dataP = computed(() =>
        this.cn({
            toggleable: this.toggleable()
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

    onHeaderClick(event: MouseEvent) {
        if (this.toggler() === 'header') {
            this.toggle(event);
        }
    }

    onIconClick(event: MouseEvent) {
        if (this.toggler() === 'icon') {
            this.toggle(event);
        }
    }

    toggle(event: MouseEvent) {
        this.onBeforeToggle.emit({ originalEvent: event, collapsed: this.collapsed() });

        if (this.collapsed()) this.expand();
        else this.collapse();

        event.preventDefault();
    }

    expand() {
        this.collapsed.set(false);
        this.updateTabIndex();
    }

    collapse() {
        this.collapsed.set(true);
        this.updateTabIndex();
    }

    getBlockableElement(): HTMLElement {
        return this.el.nativeElement;
    }

    updateTabIndex() {
        const focusableElements = this.contentWrapperViewChild().nativeElement.querySelectorAll('input, button, select, a, textarea, [tabindex]');
        focusableElements.forEach((element: HTMLElement) => {
            if (this.collapsed()) {
                element.setAttribute('tabindex', '-1');
            } else {
                element.removeAttribute('tabindex');
            }
        });
    }

    onKeyDown(event: KeyboardEvent) {
        if (event.code === 'Enter' || event.code === 'Space') {
            this.toggle(event as any);
            event.preventDefault();
        }
    }

    onToggleDone(event: MotionEvent) {
        this.onAfterToggle.emit({ originalEvent: event as any, collapsed: this.collapsed() });
    }
}

@NgModule({
    imports: [Panel, SharedModule, BindModule],
    exports: [Panel, SharedModule, BindModule]
})
export class PanelModule {}
