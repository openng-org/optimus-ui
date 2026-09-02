import { CommonModule } from '@angular/common';
import {
    afterEveryRender,
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    ElementRef,
    inject,
    input,
    NgModule,
    numberAttribute,
    signal,
    TemplateRef,
    untracked,
    ViewEncapsulation,
    viewChild,
    contentChild,
    contentChildren,
    output
} from '@angular/core';
import { MotionOptions } from '@openng/optimus-ui-motion';
import { uuid } from '@openng/optimus-ui-utils';
import { MenuItem, PrimeTemplate, SharedModule, TooltipOptions } from '@openng/optimus-ui/api';
import { AutoFocus } from '@openng/optimus-ui/autofocus';
import { BaseComponent, PARENT_INSTANCE } from '@openng/optimus-ui/basecomponent';
import { Bind } from '@openng/optimus-ui/bind';
import { ButtonDirective } from '@openng/optimus-ui/button';
import { ChevronDownIcon } from '@openng/optimus-ui/icons';
import { Ripple } from '@openng/optimus-ui/ripple';
import { TieredMenu } from '@openng/optimus-ui/tieredmenu';
import { TooltipModule } from '@openng/optimus-ui/tooltip';
import type { ButtonSeverity } from '@openng/optimus-ui/types/button';
import { ButtonProps, MenuButtonProps, SplitButtonPassThrough } from '@openng/optimus-ui/types/splitbutton';
import { SplitButtonStyle } from './style/splitbuttonstyle';

type SplitButtonIconPosition = 'left' | 'right';
/**
 * SplitButton groups a set of commands in an overlay with a default command.
 * @group Components
 */
@Component({
    selector: 'p-splitbutton, p-splitButton, p-split-button',
    standalone: true,
    imports: [CommonModule, ButtonDirective, TieredMenu, AutoFocus, ChevronDownIcon, Ripple, TooltipModule, SharedModule],
    template: `
        @if ($contentTemplate()) {
            <button
                [class]="cx('pcButton')"
                type="button"
                pButton
                pRipple
                [severity]="severity()"
                [text]="text()"
                [outlined]="outlined()"
                [size]="size()"
                [icon]="icon()"
                [iconPos]="iconPos()"
                (click)="onDefaultButtonClick($event)"
                [disabled]="disabled()"
                [attr.tabindex]="tabindex()"
                [attr.aria-label]="buttonProps()?.['ariaLabel'] || label()"
                [pAutoFocus]="autofocus()"
                [pTooltip]="tooltip()"
                [pTooltipUnstyled]="unstyled()"
                [tooltipOptions]="tooltipOptions()"
                [pt]="ptm('pcButton')"
                [unstyled]="unstyled()"
            >
                <ng-container *ngTemplateOutlet="$contentTemplate()"></ng-container>
            </button>
        } @else {
            <button
                #defaultbtn
                [class]="cx('pcButton')"
                type="button"
                pButton
                pRipple
                [severity]="severity()"
                [text]="text()"
                [outlined]="outlined()"
                [size]="size()"
                [icon]="icon()"
                [iconPos]="iconPos()"
                [label]="label()"
                (click)="onDefaultButtonClick($event)"
                [disabled]="$buttonDisabled()"
                [attr.tabindex]="tabindex()"
                [attr.aria-label]="buttonProps()?.['ariaLabel']"
                [pAutoFocus]="autofocus()"
                [pTooltip]="tooltip()"
                [pTooltipUnstyled]="unstyled()"
                [tooltipOptions]="tooltipOptions()"
                [pt]="ptm('pcButton')"
                [unstyled]="unstyled()"
            ></button>
        }
        <button
            type="button"
            pButton
            pRipple
            [size]="size()"
            [severity]="severity()"
            [text]="text()"
            [outlined]="outlined()"
            [class]="cx('pcDropdown')"
            (click)="onDropdownButtonClick($event)"
            (keydown)="onDropdownButtonKeydown($event)"
            [disabled]="$menuButtonDisabled()"
            [attr.aria-label]="menuButtonProps()?.['ariaLabel'] || expandAriaLabel()"
            [attr.aria-haspopup]="menuButtonProps()?.['ariaHasPopup'] || true"
            [attr.aria-expanded]="menuButtonProps()?.['ariaExpanded'] || isExpanded()"
            [attr.aria-controls]="menuButtonProps()?.['ariaControls'] || ariaId"
            [pt]="ptm('pcDropdown')"
            [unstyled]="unstyled()"
        >
            @if (dropdownIcon()) {
                <span [class]="dropdownIcon()"></span>
            }
            @if (!dropdownIcon()) {
                @if (!$dropdownIconTemplate()) {
                    <svg data-p-icon="chevron-down" />
                }
                <ng-template *ngTemplateOutlet="$dropdownIconTemplate()"></ng-template>
            }
        </button>
        <p-tieredmenu
            [id]="ariaId"
            #menu
            [popup]="true"
            [model]="model()"
            [style]="menuStyle()"
            [styleClass]="menuStyleClass()"
            [appendTo]="$appendTo()"
            [motionOptions]="computedMotionOptions()"
            (onHide)="onHide()"
            (onShow)="onShow()"
            [pt]="ptm('pcMenu')"
            [unstyled]="unstyled()"
        ></p-tieredmenu>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [SplitButtonStyle, { provide: PARENT_INSTANCE, useExisting: SplitButton }],
    encapsulation: ViewEncapsulation.None,
    host: {
        '[class]': "cx('root')",
        '[attr.data-p-severity]': 'severity()'
    },
    hostDirectives: [Bind]
})
export class SplitButton extends BaseComponent<SplitButtonPassThrough> {
    bindDirectiveInstance = inject(Bind, { self: true });

    _componentStyle = inject(SplitButtonStyle);

    /**
     * MenuModel instance to define the overlay items.
     * @group Props
     */
    readonly model = input<MenuItem[]>();

    /**
     * Defines the style of the button.
     * @group Props
     */
    readonly severity = input<ButtonSeverity>();

    /**
     * Add a shadow to indicate elevation.
     * @group Props
     */
    readonly raised = input<boolean, unknown>(false, { transform: booleanAttribute });

    /**
     * Add a circular border radius to the button.
     * @group Props
     */
    readonly rounded = input<boolean, unknown>(false, { transform: booleanAttribute });

    /**
     * Add a textual class to the button without a background initially.
     * @group Props
     */
    readonly text = input<boolean, unknown>(false, { transform: booleanAttribute });

    /**
     * Add a border class without a background initially.
     * @group Props
     */
    readonly outlined = input<boolean, unknown>(false, { transform: booleanAttribute });

    /**
     * Defines the size of the button.
     * @group Props
     */
    readonly size = input<'small' | 'large' | undefined | null>(null);

    /**
     * Add a plain textual class to the button without a background initially.
     * @group Props
     */
    readonly plain = input<boolean, unknown>(false, { transform: booleanAttribute });

    /**
     * Name of the icon.
     * @group Props
     */
    readonly icon = input<string>();

    /**
     * Position of the icon.
     * @group Props
     */
    readonly iconPos = input<SplitButtonIconPosition>('left');

    /**
     * Text of the button.
     * @group Props
     */
    readonly label = input<string>();

    /**
     * Tooltip for the main button.
     * @group Props
     */
    readonly tooltip = input<string>();

    /**
     * Tooltip options for the main button.
     * @group Props
     */
    readonly tooltipOptions = input<TooltipOptions>();

    /**
     * Inline style of the overlay menu.
     * @group Props
     */
    readonly menuStyle = input<{ [klass: string]: any } | null>();

    /**
     * Style class of the overlay menu.
     * @group Props
     */
    readonly menuStyleClass = input<string>();

    /**
     * Name of the dropdown icon.
     * @group Props
     */
    readonly dropdownIcon = input<string>();

    /**
     * Target element to attach the overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name).
     * @defaultValue 'body'
     * @group Props
     */
    appendTo = input<HTMLElement | ElementRef | TemplateRef<any> | 'self' | 'body' | null | undefined | any>('body');

    /**
     * Defines a string that labels the expand button for accessibility.
     * @group Props
     */
    readonly expandAriaLabel = input<string>();

    /**
     * Transition options of the show animation.
     * @group Props
     * @deprecated since v21.0.0. Use `motionOptions` instead.
     */
    readonly showTransitionOptions = input<string>('.12s cubic-bezier(0, 0, 0.2, 1)');

    /**
     * Transition options of the hide animation.
     * @group Props
     * @deprecated since v21.0.0. Use `motionOptions` instead.
     */
    readonly hideTransitionOptions = input<string>('.1s linear');

    /**
     * The motion options.
     * @group Props
     */
    motionOptions = input<MotionOptions | undefined>(undefined);

    /**
     * Button Props
     */
    readonly buttonProps = input<ButtonProps>();

    /**
     * Menu Button Props
     */
    readonly menuButtonProps = input<MenuButtonProps>();

    /**
     * When present, it specifies that the component should automatically get focus on load.
     * @group Props
     */
    readonly autofocus = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    /**
     * When present, it specifies that the element should be disabled. Overrides
     * `buttonDisabled` and `menuButtonDisabled` while set.
     * @group Props
     */
    readonly disabled = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    /**
     * Index of the element in tabbing order.
     * @group Props
     */
    readonly tabindex = input<number | undefined, unknown>(undefined, { transform: numberAttribute });

    /**
     * When present, it specifies that the menu button element should be disabled.
     * @group Props
     */
    readonly menuButtonDisabled = input<boolean, unknown>(false, { transform: booleanAttribute });

    /**
     * When present, it specifies that the button element should be disabled.
     * @group Props
     */
    readonly buttonDisabled = input<boolean, unknown>(false, { transform: booleanAttribute });

    /**
     * Callback to invoke when default command button is clicked.
     * @param {MouseEvent} event - Mouse event.
     * @group Emits
     */
    readonly onClick = output<MouseEvent>();

    /**
     * Callback to invoke when overlay menu is hidden.
     * @group Emits
     */
    readonly onMenuHide = output<any>();

    /**
     * Callback to invoke when overlay menu is shown.
     * @group Emits
     */
    readonly onMenuShow = output<any>();

    /**
     * Callback to invoke when dropdown button is clicked.
     * @param {MouseEvent} event - Mouse event.
     * @group Emits
     */
    readonly onDropdownClick = output<MouseEvent | undefined>();

    readonly menu = viewChild.required<TieredMenu>('menu');

    /**
     * Custom content template.
     * @group Templates
     */
    readonly contentTemplate = contentChild<TemplateRef<void>>('content', { descendants: false });

    /**
     * Custom dropdown icon template.
     * @group Templates
     **/
    readonly dropdownIconTemplate = contentChild<TemplateRef<void>>('dropdownicon', { descendants: false });

    readonly templates = contentChildren(PrimeTemplate);

    componentName = 'SplitButton';

    computedMotionOptions = computed<MotionOptions>(() => {
        return {
            ...this.ptm('motion'),
            ...this.motionOptions()
        };
    });

    /**
     * Effective disabled state of the default button. The latest write to either `disabled`
     * or `buttonDisabled` wins, mirroring the legacy setter cascade.
     */
    readonly $buttonDisabled = signal(false);

    /**
     * Effective disabled state of the menu button. The latest write to either `disabled`
     * or `menuButtonDisabled` wins, mirroring the legacy setter cascade.
     */
    readonly $menuButtonDisabled = signal(false);

    /** Mirrors a `disabled` change into both effective disabled states. */
    private readonly syncDisabledEffect = effect(() => {
        const disabled = this.disabled();
        if (disabled !== undefined) {
            untracked(() => {
                this.$buttonDisabled.set(disabled);
                this.$menuButtonDisabled.set(disabled);
            });
        }
    });

    /** Mirrors a `buttonDisabled` change into the effective default-button state. */
    private readonly syncButtonDisabledEffect = effect(() => {
        const buttonDisabled = this.buttonDisabled();
        untracked(() => this.$buttonDisabled.set(buttonDisabled));
    });

    /** Mirrors a `menuButtonDisabled` change into the effective menu-button state. */
    private readonly syncMenuButtonDisabledEffect = effect(() => {
        const menuButtonDisabled = this.menuButtonDisabled();
        untracked(() => this.$menuButtonDisabled.set(menuButtonDisabled));
    });

    ariaId: string | undefined;

    isExpanded = signal<boolean>(false);

    /**
     * Effective content template: the `#content` content child, a legacy `pTemplate="content"`,
     * or (legacy behavior) the last `pTemplate` with an unrecognized type.
     */
    readonly $contentTemplate = computed(() => this.contentTemplate() ?? [...this.templates()].reverse().find((item) => item.getType() !== 'dropdownicon')?.template);

    /** Effective dropdown icon template: the `#dropdownicon` content child, or a legacy `pTemplate="dropdownicon"`. */
    readonly $dropdownIconTemplate = computed(() => this.dropdownIconTemplate() ?? this.templates().find((item) => item.getType() === 'dropdownicon')?.template);

    $appendTo = computed(() => this.appendTo() || this.config.overlayAppendTo());

    constructor() {
        super();
        // Re-apply the host/root pass-through sections after each render (replaces the former
        // ngAfterViewChecked hook). Bind.setAttrs writes into a signal behind an equality check,
        // so unchanged PT resolutions are no-ops.
        afterEveryRender(() => {
            this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
        });
    }

    onInit() {
        this.ariaId = uuid('pn_id_');
    }

    onDefaultButtonClick(event: MouseEvent) {
        this.onClick?.emit(event);
        this.menu().hide();
    }

    onDropdownButtonClick(event?: MouseEvent) {
        this.onDropdownClick.emit(event);
        this.menu().toggle({ currentTarget: this.el?.nativeElement, relativeAlign: this.$appendTo() == 'self' });
    }

    onDropdownButtonKeydown(event: KeyboardEvent) {
        if (event.code === 'ArrowDown' || event.code === 'ArrowUp') {
            this.onDropdownButtonClick();
            event.preventDefault();
        }
    }

    onHide() {
        this.isExpanded.set(false);
        this.onMenuHide.emit(undefined);
    }

    onShow() {
        this.isExpanded.set(true);
        this.onMenuShow.emit(undefined);
    }
}

@NgModule({
    imports: [SplitButton, SharedModule],
    exports: [SplitButton, SharedModule]
})
export class SplitButtonModule {}
