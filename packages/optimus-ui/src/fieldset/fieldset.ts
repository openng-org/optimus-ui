import { CommonModule } from '@angular/common';
import { afterEveryRender, booleanAttribute, ChangeDetectionStrategy, Component, computed, ElementRef, inject, input, model, NgModule, TemplateRef, ViewEncapsulation, viewChild, contentChild, contentChildren, output } from '@angular/core';
import { MotionEvent, MotionOptions } from '@openng/optimus-ui-motion';
import { uuid } from '@openng/optimus-ui-utils';
import { BlockableUI, PrimeTemplate, SharedModule } from '@openng/optimus-ui/api';
import { BaseComponent, PARENT_INSTANCE } from '@openng/optimus-ui/basecomponent';
import { Bind, BindModule } from '@openng/optimus-ui/bind';
import { MinusIcon, PlusIcon } from '@openng/optimus-ui/icons';
import { MotionModule } from '@openng/optimus-ui/motion';
import type { FieldsetAfterToggleEvent, FieldsetBeforeToggleEvent, FieldsetPassThrough } from '@openng/optimus-ui/types/fieldset';
import { FieldsetStyle } from './style/fieldsetstyle';

/**
 * Fieldset is a grouping component with the optional content toggle feature.
 * @group Components
 */
@Component({
    selector: 'p-fieldset',
    standalone: true,
    imports: [CommonModule, MinusIcon, PlusIcon, SharedModule, BindModule, MotionModule],
    template: `
        <fieldset [attr.id]="id" [ngStyle]="style()" [class]="cn(cx('root'), styleClass())" [pBind]="ptm('root')" [attr.data-p]="dataP()">
            <legend [class]="cx('legend')" [pBind]="ptm('legend')" [attr.data-p]="dataP()">
                @if (toggleable()) {
                    <button
                        [attr.id]="id + '_header'"
                        tabindex="0"
                        role="button"
                        [attr.aria-controls]="id + '_content'"
                        [attr.aria-expanded]="!collapsed()"
                        [attr.aria-label]="buttonAriaLabel"
                        (click)="toggle($event)"
                        (keydown)="onKeyDown($event)"
                        [class]="cx('toggleButton')"
                        [pBind]="ptm('toggleButton')"
                    >
                        @if (collapsed()) {
                            @if (!$expandIconTemplate()) {
                                <svg data-p-icon="plus" [class]="cx('toggleIcon')" [pBind]="ptm('toggleIcon')" />
                            }
                            @if ($expandIconTemplate()) {
                                <span [class]="cx('toggleIcon')" [pBind]="ptm('toggleIcon')">
                                    <ng-container *ngTemplateOutlet="$expandIconTemplate()"></ng-container>
                                </span>
                            }
                        }
                        @if (!collapsed()) {
                            @if (!$collapseIconTemplate()) {
                                <svg data-p-icon="minus" [class]="cx('toggleIcon')" [attr.aria-hidden]="true" [pBind]="ptm('toggleIcon')" />
                            }
                            @if ($collapseIconTemplate()) {
                                <span [class]="cx('toggleIcon')" [pBind]="ptm('toggleIcon')">
                                    <ng-container *ngTemplateOutlet="$collapseIconTemplate()"></ng-container>
                                </span>
                            }
                        }
                        <ng-container *ngTemplateOutlet="legendContent"></ng-container>
                    </button>
                } @else {
                    <span [class]="cx('legendLabel')" [pBind]="ptm('legendLabel')">{{ legend() }}</span>
                    <ng-content select="p-header"></ng-content>
                    <ng-container *ngTemplateOutlet="$headerTemplate()"></ng-container>
                }
                <ng-template #legendContent>
                    <span [class]="cx('legendLabel')" [pBind]="ptm('legendLabel')">{{ legend() }}</span>
                    <ng-content select="p-header"></ng-content>
                    <ng-container *ngTemplateOutlet="$headerTemplate()"></ng-container>
                </ng-template>
            </legend>
            <div
                [pBind]="ptm('contentContainer')"
                [pMotion]="!toggleable() || (toggleable() && !collapsed())"
                pMotionName="p-collapsible"
                [pMotionOptions]="computedMotionOptions()"
                [class]="cx('contentContainer')"
                [id]="id + '_content'"
                role="region"
                [attr.aria-labelledby]="id + '_header'"
                [attr.aria-hidden]="collapsed()"
                [attr.tabindex]="collapsed() ? '-1' : undefined"
                (pMotionOnAfterEnter)="onToggleDone($event)"
                (pMotionOnAfterLeave)="onToggleDone($event)"
            >
                <div [pBind]="ptm('contentWrapper')" [class]="cx('contentWrapper')">
                    <div [class]="cx('content')" [pBind]="ptm('content')" #contentWrapper>
                        <ng-content></ng-content>
                        <ng-container *ngTemplateOutlet="$contentTemplate()"></ng-container>
                    </div>
                </div>
            </div>
        </fieldset>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [FieldsetStyle, { provide: PARENT_INSTANCE, useExisting: Fieldset }],
    hostDirectives: [Bind]
})
export class Fieldset extends BaseComponent<FieldsetPassThrough> implements BlockableUI {
    _componentStyle = inject(FieldsetStyle);

    bindDirectiveInstance = inject(Bind, { self: true });

    /**
     * Header text of the fieldset.
     * @group Props
     */
    readonly legend = input<string>();

    /**
     * When specified, content can toggled by clicking the legend.
     * @group Props
     * @defaultValue false
     */
    readonly toggleable = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    /**
     * Inline style of the component.
     * @group Props
     */
    readonly style = input<{ [klass: string]: any } | null>();

    /**
     * Style class of the component.
     * @group Props
     */
    readonly styleClass = input<string>();

    /**
     * Transition options of the panel animation.
     * @group Props
     * @deprecated since v21.0.0, use `motionOptions` instead.
     */
    readonly transitionOptions = input<string>('400ms cubic-bezier(0.86, 0, 0.07, 1)');

    /**
     * The motion options.
     * @group Props
     */
    motionOptions = input<MotionOptions | undefined>(undefined);

    /**
     * Defines the initial state of content, supports one or two-way binding as well.
     * @group Props
     */
    readonly collapsed = model<boolean | undefined>();

    /**
     * Callback to invoke before panel toggle.
     * @param {PanelBeforeToggleEvent} event - Custom toggle event
     * @group Emits
     */
    readonly onBeforeToggle = output<FieldsetBeforeToggleEvent>();

    /**
     * Callback to invoke after panel toggle.
     * @param {PanelAfterToggleEvent} event - Custom toggle event
     * @group Emits
     */
    readonly onAfterToggle = output<FieldsetAfterToggleEvent>();

    readonly contentWrapperViewChild = viewChild.required<ElementRef>('contentWrapper');

    /**
     * Custom header template.
     * @group Templates
     */
    readonly headerTemplate = contentChild<TemplateRef<void>>('header', { descendants: false });

    /**
     * Custom expand icon template.
     * @group Templates
     */
    readonly expandIconTemplate = contentChild<TemplateRef<void>>('expandicon', { descendants: false });

    /**
     * Custom collapse icon template.
     * @group Templates
     */
    readonly collapseIconTemplate = contentChild<TemplateRef<void>>('collapseicon', { descendants: false });

    /**
     * Custom content template.
     * @group Templates
     */
    readonly contentTemplate = contentChild<TemplateRef<void>>('content', { descendants: false });

    readonly templates = contentChildren(PrimeTemplate);

    componentName = 'Fieldset';

    readonly dataP = computed(() =>
        this.cn({
            toggleable: this.toggleable()
        })
    );

    computedMotionOptions = computed<MotionOptions>(() => {
        return {
            ...this.ptm('motion'),
            ...this.motionOptions()
        };
    });

    private _id: string = uuid('pn_id_');

    get id() {
        return this._id;
    }

    get buttonAriaLabel() {
        return this.legend();
    }

    /** Effective header template: the \`#header\` content child, or a legacy \`pTemplate="header"\`. */
    readonly $headerTemplate = computed(() => this.headerTemplate() ?? this.templates().find((item) => item.getType() === 'header')?.template);

    /** Effective expand icon template: the \`#expandicon\` content child, or a legacy \`pTemplate="expandicon"\`. */
    readonly $expandIconTemplate = computed(() => this.expandIconTemplate() ?? this.templates().find((item) => item.getType() === 'expandicon')?.template);

    /** Effective collapse icon template: the \`#collapseicon\` content child, or a legacy \`pTemplate="collapseicon"\`. */
    readonly $collapseIconTemplate = computed(() => this.collapseIconTemplate() ?? this.templates().find((item) => item.getType() === 'collapseicon')?.template);

    /** Effective content template: the \`#content\` content child, or a legacy \`pTemplate="content"\`. */
    readonly $contentTemplate = computed(() => this.contentTemplate() ?? this.templates().find((item) => item.getType() === 'content')?.template);

    constructor() {
        super();
        // Re-apply the host pass-through section after each render (replaces the former
        // ngAfterViewChecked hook). Bind.setAttrs writes into a signal behind an equality check,
        // so unchanged PT resolutions are no-ops.
        afterEveryRender(() => {
            this.bindDirectiveInstance.setAttrs(this.ptm('host'));
        });
    }

    toggle(event: MouseEvent) {
        this.onBeforeToggle.emit({ originalEvent: event, collapsed: this.collapsed() });

        if (this.collapsed()) this.expand();
        else this.collapse();

        event.preventDefault();
    }

    onKeyDown(event) {
        if (event.code === 'Enter' || event.code === 'Space') {
            this.toggle(event);
            event.preventDefault();
        }
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
        return this.el.nativeElement.children[0];
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

    onToggleDone(event: MotionEvent) {
        this.onAfterToggle.emit({ originalEvent: event as any, collapsed: this.collapsed() });
    }
}

@NgModule({
    imports: [Fieldset, SharedModule, BindModule],
    exports: [Fieldset, SharedModule, BindModule]
})
export class FieldsetModule {}
