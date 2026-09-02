import { CommonModule } from '@angular/common';
import {
    afterEveryRender,
    afterNextRender,
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    ElementRef,
    forwardRef,
    inject,
    InjectionToken,
    input,
    linkedSignal,
    NgModule,
    NgZone,
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
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { MotionOptions } from '@openng/optimus-ui-motion';
import { deepEquals, equals, findLastIndex, findSingle, focus, getFirstFocusableElement, getFocusableElements, getLastFocusableElement, isEmpty, isNotEmpty, isPrintableCharacter, resolveFieldData, scrollInView, uuid } from '@openng/optimus-ui-utils';
import { FilterService, OverlayOptions, PrimeTemplate, ScrollerOptions, SharedModule, TranslationKeys } from '@openng/optimus-ui/api';
import { AutoFocus } from '@openng/optimus-ui/autofocus';
import { BaseComponent, PARENT_INSTANCE } from '@openng/optimus-ui/basecomponent';
import { BaseInput } from '@openng/optimus-ui/baseinput';
import { Bind, BindModule } from '@openng/optimus-ui/bind';
import { unblockBodyScroll } from '@openng/optimus-ui/dom';
import { IconField } from '@openng/optimus-ui/iconfield';
import { BlankIcon, CheckIcon, ChevronDownIcon, SearchIcon, TimesIcon } from '@openng/optimus-ui/icons';
import { InputIcon } from '@openng/optimus-ui/inputicon';
import { InputText } from '@openng/optimus-ui/inputtext';
import { Overlay } from '@openng/optimus-ui/overlay';
import { Ripple } from '@openng/optimus-ui/ripple';
import { Scroller } from '@openng/optimus-ui/scroller';
import { Tooltip } from '@openng/optimus-ui/tooltip';
import { Nullable } from '@openng/optimus-ui/ts-helpers';
import {
    SelectChangeEvent,
    SelectFilterEvent,
    SelectFilterOptions,
    SelectFilterTemplateContext,
    SelectGroupTemplateContext,
    SelectIconTemplateContext,
    SelectItemTemplateContext,
    SelectLazyLoadEvent,
    SelectLoaderTemplateContext,
    SelectPassThrough,
    SelectSelectedItemTemplateContext
} from '@openng/optimus-ui/types/select';
import { SelectStyle } from './style/selectstyle';

const SELECT_INSTANCE = new InjectionToken<Select>('SELECT_INSTANCE');

export const SELECT_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => Select),
    multi: true
};

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'p-selectItem',
    standalone: true,
    imports: [CommonModule, SharedModule, Ripple, CheckIcon, BlankIcon, BindModule],
    template: `
        <li
            [id]="id()"
            [pBind]="getPTOptions()"
            (click)="onOptionClick($event)"
            (mouseenter)="onOptionMouseEnter($event)"
            role="option"
            pRipple
            [attr.aria-label]="label()"
            [attr.aria-setsize]="ariaSetSize()"
            [attr.aria-posinset]="ariaPosInset()"
            [attr.aria-selected]="selected()"
            [attr.data-p-focused]="focused()"
            [attr.data-p-highlight]="selected()"
            [attr.data-p-selected]="selected()"
            [attr.data-p-disabled]="disabled()"
            [ngStyle]="{ height: scrollerOptions()?.itemSize + 'px' }"
            [class]="cx('option')"
        >
            @if (checkmark()) {
                @if (selected()) {
                    <svg data-p-icon="check" [class]="cx('optionCheckIcon')" [pBind]="$pcSelect?.ptm('optionCheckIcon')" />
                }
                @if (!selected()) {
                    <svg data-p-icon="blank" [class]="cx('optionBlankIcon')" [pBind]="$pcSelect?.ptm('optionBlankIcon')" />
                }
            }
            @if (!template()) {
                <span [pBind]="$pcSelect?.ptm('optionLabel')">{{ label() ?? 'empty' }}</span>
            }
            <ng-container *ngTemplateOutlet="template(); context: { $implicit: option() }"></ng-container>
        </li>
    `,
    providers: [SelectStyle, { provide: PARENT_INSTANCE, useExisting: SelectItem }]
})
export class SelectItem extends BaseComponent {
    _componentStyle = inject(SelectStyle);

    readonly id = input<string>();

    readonly option = input<any>();

    readonly selected = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    readonly focused = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    readonly label = input<string>();

    readonly disabled = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    readonly ariaPosInset = input<string>();

    readonly ariaSetSize = input<string>();

    readonly template = input<TemplateRef<any>>();

    readonly checkmark = input<boolean, unknown>(undefined, { transform: booleanAttribute });

    readonly index = input<number | undefined, unknown>(undefined, { transform: numberAttribute });

    readonly scrollerOptions = input<any>();

    readonly onClick = output<any>();

    readonly onMouseEnter = output<any>();

    hostName = 'select';

    $pcSelect: Select | undefined = inject(SELECT_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    onOptionClick(event: Event) {
        this.onClick.emit(event);
    }

    onOptionMouseEnter(event: Event) {
        this.onMouseEnter.emit(event);
    }

    getPTOptions() {
        return (
            this.$pcSelect?.getPTItemOptions?.(this.option(), this.scrollerOptions(), this.index() ?? 0, 'option') ??
            this.$pcSelect?.ptm('option', {
                context: {
                    option: this.option(),
                    selected: this.selected(),
                    focused: this.focused(),
                    disabled: this.disabled()
                }
            })
        );
    }
}

/**
 * Select is used to choose an item from a collection of options.
 * @group Components
 */

@Component({
    selector: 'p-select',
    standalone: true,
    imports: [CommonModule, SelectItem, Overlay, Tooltip, AutoFocus, TimesIcon, ChevronDownIcon, SearchIcon, InputText, IconField, InputIcon, Scroller, SharedModule, BindModule],
    template: `
        <span
            #focusInput
            [class]="cx('label')"
            *ngIf="!editable()"
            [pBind]="ptm('label')"
            [pTooltip]="tooltip()"
            [pTooltipUnstyled]="unstyled()"
            [tooltipPosition]="tooltipPosition()"
            [positionStyle]="tooltipPositionStyle()"
            [tooltipStyleClass]="tooltipStyleClass()"
            [attr.aria-disabled]="$disabled()"
            [attr.id]="inputId()"
            role="combobox"
            [attr.aria-label]="ariaLabel() || (label() === 'p-emptylabel' ? undefined : label())"
            [attr.aria-labelledby]="ariaLabelledBy()"
            [attr.aria-haspopup]="'listbox'"
            [attr.aria-expanded]="overlayVisible() ?? false"
            [attr.aria-controls]="overlayVisible() ? $id() + '_list' : null"
            [attr.tabindex]="!$disabled() ? tabindex() : -1"
            [pAutoFocus]="autofocus()"
            [attr.aria-activedescendant]="focused() ? focusedOptionId() : undefined"
            (focus)="onInputFocus($event)"
            (blur)="onInputBlur($event)"
            (keydown)="onKeyDown($event)"
            [attr.aria-required]="required()"
            [attr.required]="required() ? '' : undefined"
            [attr.disabled]="$disabled() ? '' : undefined"
            [attr.data-p]="labelDataP()"
        >
            <ng-container *ngIf="!$selectedItemTemplate(); else defaultPlaceholder">{{ label() === 'p-emptylabel' ? '&nbsp;' : label() }}</ng-container>
            <ng-container *ngIf="$selectedItemTemplate() && !isSelectedOptionEmpty()" [ngTemplateOutlet]="$selectedItemTemplate()" [ngTemplateOutletContext]="{ $implicit: selectedOption() }"></ng-container>
            <ng-template #defaultPlaceholder>
                <span *ngIf="isSelectedOptionEmpty()">{{ label() === 'p-emptylabel' ? '&nbsp;' : label() }}</span>
            </ng-template>
        </span>
        <input
            *ngIf="editable()"
            #editableInput
            type="text"
            [attr.id]="inputId()"
            [class]="cx('label')"
            [pBind]="ptm('label')"
            [attr.aria-haspopup]="'listbox'"
            [attr.placeholder]="modelValue() === undefined || modelValue() === null ? _placeholder() : undefined"
            [attr.aria-label]="ariaLabel() || (label() === 'p-emptylabel' ? undefined : label())"
            (input)="onEditableInput($event)"
            (keydown)="onKeyDown($event)"
            [pAutoFocus]="autofocus()"
            [attr.aria-activedescendant]="focused() ? focusedOptionId() : undefined"
            (focus)="onInputFocus($event)"
            (blur)="onInputBlur($event)"
            [attr.name]="name()"
            [attr.minlength]="minlength()"
            [attr.min]="min()"
            [attr.max]="max()"
            [attr.pattern]="pattern()"
            [attr.size]="inputSize()"
            [attr.maxlength]="maxlength()"
            [attr.required]="required() ? '' : undefined"
            [attr.readonly]="readonly() ? '' : undefined"
            [attr.disabled]="$disabled() ? '' : undefined"
            [attr.data-p]="labelDataP()"
        />
        <ng-container *ngIf="isVisibleClearIcon()">
            <svg data-p-icon="times" [class]="cx('clearIcon')" [pBind]="ptm('clearIcon')" (click)="clear($event)" *ngIf="!$clearIconTemplate()" [attr.data-pc-section]="'clearicon'" />
            <span [class]="cx('clearIcon')" [pBind]="ptm('clearIcon')" (click)="clear($event)" *ngIf="$clearIconTemplate()" [attr.data-pc-section]="'clearicon'">
                <ng-template *ngTemplateOutlet="$clearIconTemplate(); context: { class: cx('clearIcon') }"></ng-template>
            </span>
        </ng-container>

        <div [class]="cx('dropdown')" [pBind]="ptm('dropdown')" role="button" aria-label="dropdown trigger" aria-haspopup="listbox" [attr.aria-expanded]="overlayVisible() ?? false" [attr.data-pc-section]="'trigger'">
            <ng-container *ngIf="loading(); else elseBlock">
                <ng-container *ngIf="$loadingIconTemplate()">
                    <ng-container *ngTemplateOutlet="$loadingIconTemplate()"></ng-container>
                </ng-container>
                <ng-container *ngIf="!$loadingIconTemplate()">
                    <span *ngIf="loadingIcon()" [class]="cn(cx('loadingIcon'), 'pi-spin' + loadingIcon())" [pBind]="ptm('loadingIcon')" aria-hidden="true"></span>
                    <span *ngIf="!loadingIcon()" [class]="cn(cx('loadingIcon'), 'pi pi-spinner pi-spin')" [pBind]="ptm('loadingIcon')" aria-hidden="true"></span>
                </ng-container>
            </ng-container>

            <ng-template #elseBlock>
                <ng-container *ngIf="!$dropdownIconTemplate()">
                    <span [class]="cn(cx('dropdownIcon'), dropdownIcon())" [pBind]="ptm('dropdownIcon')" *ngIf="dropdownIcon()"></span>
                    <svg data-p-icon="chevron-down" *ngIf="!dropdownIcon()" [class]="cx('dropdownIcon')" [pBind]="ptm('dropdownIcon')" />
                </ng-container>
                <span *ngIf="$dropdownIconTemplate()" [class]="cx('dropdownIcon')" [pBind]="ptm('dropdownIcon')">
                    <ng-template *ngTemplateOutlet="$dropdownIconTemplate(); context: { class: cx('dropdownIcon') }"></ng-template>
                </span>
            </ng-template>
        </div>

        <p-overlay
            #overlay
            [hostAttrSelector]="$attrSelector"
            [(visible)]="overlayVisible"
            [options]="overlayOptions()"
            [target]="'@parent'"
            [appendTo]="$appendTo()"
            [unstyled]="unstyled()"
            [pt]="ptm('pcOverlay')"
            [motionOptions]="motionOptions()"
            (onBeforeEnter)="onOverlayBeforeEnter($event)"
            (onAfterLeave)="onOverlayAfterLeave($event)"
            (onHide)="hide()"
        >
            <ng-template #content>
                <div [class]="cn(cx('overlay'), panelStyleClass())" [ngStyle]="panelStyle()" [pBind]="ptm('overlay')" [attr.data-p]="overlayDataP()">
                    <span
                        #firstHiddenFocusableEl
                        role="presentation"
                        class="p-hidden-accessible p-hidden-focusable"
                        [attr.tabindex]="0"
                        (focus)="onFirstHiddenFocus($event)"
                        [attr.data-p-hidden-accessible]="true"
                        [attr.data-p-hidden-focusable]="true"
                        [pBind]="ptm('hiddenFirstFocusableEl')"
                    >
                    </span>
                    <ng-container *ngTemplateOutlet="$headerTemplate()"></ng-container>
                    <div [class]="cx('header')" *ngIf="filter()" (click)="$event.stopPropagation()" [pBind]="ptm('header')">
                        <ng-container *ngIf="$filterTemplate(); else builtInFilterElement">
                            <ng-container *ngTemplateOutlet="$filterTemplate(); context: { options: filterOptions }"></ng-container>
                        </ng-container>
                        <ng-template #builtInFilterElement>
                            <p-iconfield [pt]="ptm('pcFilterContainer')" [unstyled]="unstyled()">
                                <input
                                    #filter
                                    pInputText
                                    [pSize]="size()"
                                    type="text"
                                    role="searchbox"
                                    autocomplete="off"
                                    [value]="_filterValue() || ''"
                                    [class]="cx('pcFilter')"
                                    [variant]="$variant()"
                                    [attr.placeholder]="filterPlaceholder()"
                                    [attr.aria-owns]="$id() + '_list'"
                                    (input)="onFilterInputChange($event)"
                                    [attr.aria-label]="ariaFilterLabel()"
                                    [attr.aria-activedescendant]="focusedOptionId()"
                                    (keydown)="onFilterKeyDown($event)"
                                    (blur)="onFilterBlur($event)"
                                    [pt]="ptm('pcFilter')"
                                    [unstyled]="unstyled()"
                                />
                                <p-inputicon [pt]="ptm('pcFilterIconContainer')" [unstyled]="unstyled()">
                                    <svg data-p-icon="search" *ngIf="!$filterIconTemplate()" [pBind]="ptm('filterIcon')" />
                                    <span *ngIf="$filterIconTemplate()" [pBind]="ptm('filterIcon')">
                                        <ng-template *ngTemplateOutlet="$filterIconTemplate()"></ng-template>
                                    </span>
                                </p-inputicon>
                            </p-iconfield>
                        </ng-template>
                    </div>
                    <div [class]="cx('listContainer')" [style.max-height]="virtualScroll() ? 'auto' : scrollHeight() || 'auto'" [pBind]="ptm('listContainer')">
                        <p-scroller
                            *ngIf="virtualScroll()"
                            hostName="select"
                            #scroller
                            [items]="visibleOptions()"
                            [style]="{ height: scrollHeight() }"
                            [itemSize]="virtualScrollItemSize()"
                            [autoSize]="true"
                            [lazy]="lazy()"
                            (onLazyLoad)="onLazyLoad.emit($event)"
                            [options]="virtualScrollOptions()"
                            [pt]="ptm('virtualScroller')"
                        >
                            <ng-template #content let-items let-scrollerOptions="options">
                                <ng-container *ngTemplateOutlet="buildInItems; context: { $implicit: items, options: scrollerOptions }"></ng-container>
                            </ng-template>
                            <ng-container *ngIf="$loaderTemplate()">
                                <ng-template #loader let-scrollerOptions="options">
                                    <ng-container *ngTemplateOutlet="$loaderTemplate(); context: { options: scrollerOptions }"></ng-container>
                                </ng-template>
                            </ng-container>
                        </p-scroller>
                        <ng-container *ngIf="!virtualScroll()">
                            <ng-container *ngTemplateOutlet="buildInItems; context: { $implicit: visibleOptions(), options: {} }"></ng-container>
                        </ng-container>

                        <ng-template #buildInItems let-items let-scrollerOptions="options">
                            <ul #items [attr.id]="$id() + '_list'" [attr.aria-label]="listLabel()" [class]="cn(cx('list'), scrollerOptions.contentStyleClass)" [style]="scrollerOptions.contentStyle" role="listbox" [pBind]="ptm('list')">
                                <ng-template ngFor let-option [ngForOf]="items" let-i="index">
                                    <ng-container *ngIf="isOptionGroup(option)">
                                        <li [class]="cx('optionGroup')" [attr.id]="$id() + '_' + getOptionIndex(i, scrollerOptions)" [ngStyle]="{ height: scrollerOptions.itemSize + 'px' }" role="option" [pBind]="ptm('optionGroup')">
                                            <span *ngIf="!$groupTemplate()" [class]="cx('optionGroupLabel')" [pBind]="ptm('optionGroupLabel')">{{ getOptionGroupLabel(option.optionGroup) }}</span>
                                            <ng-container *ngTemplateOutlet="$groupTemplate(); context: { $implicit: option.optionGroup }"></ng-container>
                                        </li>
                                    </ng-container>
                                    <ng-container *ngIf="!isOptionGroup(option)">
                                        <p-selectItem
                                            [id]="$id() + '_' + getOptionIndex(i, scrollerOptions)"
                                            [option]="option"
                                            [checkmark]="checkmark()"
                                            [selected]="isSelected(option)"
                                            [label]="getOptionLabel(option)"
                                            [disabled]="isOptionDisabled(option)"
                                            [template]="$itemTemplate()"
                                            [focused]="focusedOptionIndex() === getOptionIndex(i, scrollerOptions)"
                                            [ariaPosInset]="getAriaPosInset(getOptionIndex(i, scrollerOptions))"
                                            [ariaSetSize]="ariaSetSize()"
                                            [index]="i"
                                            [unstyled]="unstyled()"
                                            [scrollerOptions]="scrollerOptions"
                                            (onClick)="onOptionSelect($event, option)"
                                            (onMouseEnter)="onOptionMouseEnter($event, getOptionIndex(i, scrollerOptions))"
                                        ></p-selectItem>
                                    </ng-container>
                                </ng-template>
                                <li *ngIf="_filterValue() && isEmpty()" [class]="cx('emptyMessage')" [ngStyle]="{ height: scrollerOptions.itemSize + 'px' }" role="option" [pBind]="ptm('emptyMessage')">
                                    @if (!$emptyFilterTemplate() && !emptyTemplate()) {
                                        {{ emptyFilterMessageLabel() }}
                                    } @else {
                                        <ng-container #emptyFilter *ngTemplateOutlet="$emptyFilterTemplate() || $emptyTemplate()"></ng-container>
                                    }
                                </li>
                                <li *ngIf="!_filterValue() && isEmpty()" [class]="cx('emptyMessage')" [ngStyle]="{ height: scrollerOptions.itemSize + 'px' }" role="option" [pBind]="ptm('emptyMessage')">
                                    @if (!$emptyTemplate()) {
                                        {{ emptyMessageLabel() || emptyFilterMessageLabel() }}
                                    } @else {
                                        <ng-container #empty *ngTemplateOutlet="$emptyTemplate()"></ng-container>
                                    }
                                </li>
                            </ul>
                        </ng-template>
                    </div>
                    <ng-container *ngTemplateOutlet="$footerTemplate()"></ng-container>
                    <span
                        #lastHiddenFocusableEl
                        role="presentation"
                        class="p-hidden-accessible p-hidden-focusable"
                        [pBind]="ptm('hiddenLastFocusableEl')"
                        [attr.tabindex]="0"
                        (focus)="onLastHiddenFocus($event)"
                        [attr.data-p-hidden-accessible]="true"
                        [attr.data-p-hidden-focusable]="true"
                    ></span>
                </div>
            </ng-template>
        </p-overlay>
    `,
    host: {
        '[class]': "cx('root')",
        '[attr.id]': '$id()',
        '[attr.data-p]': 'containerDataP()',
        '(click)': 'onContainerClick($event)'
    },
    providers: [SELECT_VALUE_ACCESSOR, SelectStyle, { provide: SELECT_INSTANCE, useExisting: Select }, { provide: PARENT_INSTANCE, useExisting: Select }],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    hostDirectives: [Bind]
})
export class Select extends BaseInput<SelectPassThrough> {
    zone = inject(NgZone);

    filterService = inject(FilterService);

    bindDirectiveInstance = inject(Bind, { self: true });

    _componentStyle = inject(SelectStyle);

    /**
     * Unique identifier of the component
     * @group Props
     */
    readonly id = input<string>();

    /**
     * Height of the viewport in pixels, a scrollbar is defined if height of list exceeds this value.
     * @group Props
     */
    readonly scrollHeight = input<string>('200px');

    /**
     * When specified, displays an input field to filter the items on keyup.
     * @group Props
     */
    readonly filter = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    /**
     * Inline style of the overlay panel element.
     * @group Props
     */
    readonly panelStyle = input<{ [klass: string]: any } | null>();

    /**
     * Style class of the overlay panel element.
     * @group Props
     */
    readonly panelStyleClass = input<string>();

    /**
     * When present, it specifies that the component cannot be edited.
     * @group Props
     */
    readonly readonly = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    /**
     * When present, custom value instead of predefined options can be entered using the editable input field.
     * @group Props
     */
    readonly editable = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    /**
     * Index of the element in tabbing order.
     * @group Props
     */
    readonly tabindex = input<number | undefined, unknown>(0, { transform: numberAttribute });

    /**
     * Default text to display when no option is selected.
     * @group Props
     */
    readonly placeholder = input<string>();

    /**
     * Icon to display in loading state.
     * @group Props
     */
    readonly loadingIcon = input<string>();

    /**
     * Placeholder text to show when filter input is empty.
     * @group Props
     */
    readonly filterPlaceholder = input<string>();

    /**
     * Locale to use in filtering. The default locale is the host environment's current locale.
     * @group Props
     */
    readonly filterLocale = input<string>();

    /**
     * Identifier of the accessible input element.
     * @group Props
     */
    readonly inputId = input<string>();

    /**
     * A property to uniquely identify a value in options.
     * @group Props
     */
    readonly dataKey = input<string>();

    /**
     * When filtering is enabled, filterBy decides which field or fields (comma separated) to search against.
     * @group Props
     */
    readonly filterBy = input<string>();

    /**
     * Fields used when filtering the options, defaults to optionLabel.
     * @group Props
     */
    readonly filterFields = input<any[]>();

    /**
     * When present, it specifies that the component should automatically get focus on load.
     * @group Props
     */
    readonly autofocus = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    /**
     * Clears the filter value when hiding the select.
     * @group Props
     */
    readonly resetFilterOnHide = input<boolean, unknown>(false, { transform: booleanAttribute });

    /**
     * Whether the selected option will be shown with a check mark.
     * @group Props
     */
    readonly checkmark = input<boolean, unknown>(false, { transform: booleanAttribute });

    /**
     * Icon class of the select icon.
     * @group Props
     */
    readonly dropdownIcon = input<string>();

    /**
     * Whether the select is in loading state.
     * @group Props
     */
    readonly loading = input<boolean | undefined, unknown>(false, { transform: booleanAttribute });

    /**
     * Name of the label field of an option.
     * @group Props
     */
    readonly optionLabel = input<string>();

    /**
     * Name of the value field of an option.
     * @group Props
     */
    readonly optionValue = input<string>();

    /**
     * Name of the disabled field of an option.
     * @group Props
     */
    readonly optionDisabled = input<string>();

    /**
     * Name of the label field of an option group.
     * @group Props
     */
    readonly optionGroupLabel = input<string | undefined>('label');

    /**
     * Name of the options field of an option group.
     * @group Props
     */
    readonly optionGroupChildren = input<string>('items');

    /**
     * Whether to display options as grouped when nested options are provided.
     * @group Props
     */
    readonly group = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    /**
     * When enabled, a clear icon is displayed to clear the value.
     * @group Props
     */
    readonly showClear = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    /**
     * Text to display when filtering does not return any results. Defaults to global value in i18n translation configuration.
     * @group Props
     */
    readonly emptyFilterMessage = input<string>('');

    /**
     * Text to display when there is no data. Defaults to global value in i18n translation configuration.
     * @group Props
     */
    readonly emptyMessage = input<string>('');

    /**
     * Defines if data is loaded and interacted with in lazy manner.
     * @group Props
     */
    readonly lazy = input<boolean, unknown>(false, { transform: booleanAttribute });

    /**
     * Whether the data should be loaded on demand during scroll.
     * @group Props
     */
    readonly virtualScroll = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    /**
     * Height of an item in the list for VirtualScrolling.
     * @group Props
     */
    readonly virtualScrollItemSize = input<number | undefined, unknown>(undefined, { transform: numberAttribute });

    /**
     * Whether to use the scroller feature. The properties of scroller component can be used like an object in it.
     * @group Props
     */
    readonly virtualScrollOptions = input<ScrollerOptions>();

    /**
     * Whether to use overlay API feature. The properties of overlay API can be used like an object in it.
     * @group Props
     */
    readonly overlayOptions = input<OverlayOptions>();

    /**
     * Defines a string that labels the filter input.
     * @group Props
     */
    readonly ariaFilterLabel = input<string>();

    /**
     * Used to define a aria label attribute the current element.
     * @group Props
     */
    readonly ariaLabel = input<string>();

    /**
     * Establishes relationships between the component and label(s) where its value should be one or more element IDs.
     * @group Props
     */
    readonly ariaLabelledBy = input<string>();

    /**
     * Defines how the items are filtered.
     * @group Props
     */
    readonly filterMatchMode = input<'contains' | 'startsWith' | 'endsWith' | 'equals' | 'notEquals' | 'in' | 'lt' | 'lte' | 'gt' | 'gte'>('contains');

    /**
     * Advisory information to display in a tooltip on hover.
     * @group Props
     */
    readonly tooltip = input<string>('');

    /**
     * Position of the tooltip.
     * @group Props
     */
    readonly tooltipPosition = input<'top' | 'left' | 'right' | 'bottom'>('right');

    /**
     * Type of CSS position.
     * @group Props
     */
    readonly tooltipPositionStyle = input<string>('absolute');

    /**
     * Style class of the tooltip.
     * @group Props
     */
    readonly tooltipStyleClass = input<string>();

    /**
     * Fields used when filtering the options, defaults to optionLabel.
     * @group Props
     */
    readonly focusOnHover = input<boolean, unknown>(true, { transform: booleanAttribute });

    /**
     * Determines if the option will be selected on focus.
     * @group Props
     */
    readonly selectOnFocus = input<boolean, unknown>(false, { transform: booleanAttribute });

    /**
     * Whether to focus on the first visible or selected element when the overlay panel is shown.
     * @group Props
     */
    readonly autoOptionFocus = input<boolean, unknown>(false, { transform: booleanAttribute });

    /**
     * Applies focus to the filter element when the overlay is shown.
     * @group Props
     */
    readonly autofocusFilter = input<boolean, unknown>(true, { transform: booleanAttribute });

    /**
     * When specified, filter displays with this value.
     * @group Props
     */
    readonly filterValue = input<string | undefined | null>();

    /**
     * An array of objects to display as the available options.
     * @group Props
     */
    readonly options = input<any[] | null>();

    /**
     * Target element to attach the overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name).
     * @defaultValue 'self'
     * @group Props
     */
    appendTo = input<HTMLElement | ElementRef | TemplateRef<any> | 'self' | 'body' | null | undefined | any>(undefined);

    /**
     * The motion options.
     * @group Props
     */
    motionOptions = input<MotionOptions | undefined>(undefined);

    /**
     * Callback to invoke when value of select changes.
     * @param {SelectChangeEvent} event - custom change event.
     * @group Emits
     */
    readonly onChange = output<SelectChangeEvent>();

    /**
     * Callback to invoke when data is filtered.
     * @param {SelectFilterEvent} event - custom filter event.
     * @group Emits
     */
    readonly onFilter = output<SelectFilterEvent>();

    /**
     * Callback to invoke when select gets focus.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    readonly onFocus = output<Event>();

    /**
     * Callback to invoke when select loses focus.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    readonly onBlur = output<Event>();

    /**
     * Callback to invoke when component is clicked.
     * @param {MouseEvent} event - Mouse event.
     * @group Emits
     */
    readonly onClick = output<MouseEvent>();

    /**
     * Callback to invoke when select overlay gets visible.
     * @param {AnimationEvent} event - Animation event.
     * @group Emits
     */
    readonly onShow = output<AnimationEvent>();

    /**
     * Callback to invoke when select overlay gets hidden.
     * @param {AnimationEvent} event - Animation event.
     * @group Emits
     */
    readonly onHide = output<AnimationEvent>();

    /**
     * Callback to invoke when select clears the value.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    readonly onClear = output<Event | undefined>();

    /**
     * Callback to invoke in lazy mode to load new data.
     * @param {SelectLazyLoadEvent} event - Lazy load event.
     * @group Emits
     */
    readonly onLazyLoad = output<SelectLazyLoadEvent>();

    readonly filterViewChild = viewChild<Nullable<ElementRef>>('filter');

    readonly focusInputViewChild = viewChild<Nullable<ElementRef>>('focusInput');

    readonly editableInputViewChild = viewChild<Nullable<ElementRef>>('editableInput');

    readonly itemsViewChild = viewChild<Nullable<ElementRef>>('items');

    readonly scroller = viewChild<Nullable<Scroller>>('scroller');

    readonly overlayViewChild = viewChild.required<Overlay>('overlay');

    readonly firstHiddenFocusableElementOnOverlay = viewChild<Nullable<ElementRef>>('firstHiddenFocusableEl');

    readonly lastHiddenFocusableElementOnOverlay = viewChild<Nullable<ElementRef>>('lastHiddenFocusableEl');

    /**
     * Custom item template.
     * @group Templates
     */
    readonly itemTemplate = contentChild<Nullable<TemplateRef<SelectItemTemplateContext>>>('item', { descendants: false });

    /**
     * Custom group template.
     * @group Templates
     */
    readonly groupTemplate = contentChild<Nullable<TemplateRef<SelectGroupTemplateContext>>>('group', { descendants: false });

    /**
     * Custom loader template.
     * @group Templates
     */
    readonly loaderTemplate = contentChild<Nullable<TemplateRef<SelectLoaderTemplateContext>>>('loader', { descendants: false });

    /**
     * Custom selected item template.
     * @group Templates
     */
    readonly selectedItemTemplate = contentChild<Nullable<TemplateRef<SelectSelectedItemTemplateContext>>>('selectedItem', { descendants: false });

    /**
     * Custom header template.
     * @group Templates
     */
    readonly headerTemplate = contentChild<Nullable<TemplateRef<void>>>('header', { descendants: false });

    /**
     * Custom filter template.
     * @group Templates
     */
    readonly filterTemplate = contentChild<Nullable<TemplateRef<SelectFilterTemplateContext>>>('filter', { descendants: false });

    /**
     * Custom footer template.
     * @group Templates
     */
    readonly footerTemplate = contentChild<Nullable<TemplateRef<void>>>('footer', { descendants: false });

    /**
     * Custom empty filter template.
     * @group Templates
     */
    readonly emptyFilterTemplate = contentChild<Nullable<TemplateRef<void>>>('emptyfilter', { descendants: false });

    /**
     * Custom empty template.
     * @group Templates
     */
    readonly emptyTemplate = contentChild<Nullable<TemplateRef<void>>>('empty', { descendants: false });

    /**
     * Custom dropdown icon template.
     * @group Templates
     */
    readonly dropdownIconTemplate = contentChild<Nullable<TemplateRef<SelectIconTemplateContext>>>('dropdownicon', { descendants: false });

    /**
     * Custom loading icon template.
     * @group Templates
     */
    readonly loadingIconTemplate = contentChild<Nullable<TemplateRef<void>>>('loadingicon', { descendants: false });

    /**
     * Custom clear icon template.
     * @group Templates
     */
    readonly clearIconTemplate = contentChild<Nullable<TemplateRef<SelectIconTemplateContext>>>('clearicon', { descendants: false });

    /**
     * Custom filter icon template.
     * @group Templates
     */
    readonly filterIconTemplate = contentChild<Nullable<TemplateRef<void>>>('filtericon', { descendants: false });

    readonly templates = contentChildren(PrimeTemplate);

    componentName = 'Select';

    readonly $id = computed(() => this.id() || uuid('pn_id_'));

    private filterValueEffectFirstRun = true;

    /**
     * Reacts to `filterValue` input changes, replacing the legacy setter which deferred the
     * internal write with a `setTimeout`. The first run is skipped when the input is unbound so
     * the internal `_filterValue` keeps its legacy `null` initial value.
     */
    private readonly filterValueEffect = effect(() => {
        const val = this.filterValue();
        untracked(() => {
            if (this.filterValueEffectFirstRun) {
                this.filterValueEffectFirstRun = false;
                if (val === undefined) {
                    return;
                }
            }
            setTimeout(() => {
                this._filterValue.set(val);
            });
        });
    });

    itemsWrapper: Nullable<HTMLDivElement>;

    $appendTo = computed(() => this.appendTo() || this.config.overlayAppendTo());

    /**
     * Legacy `pTemplate` types with a dedicated slot. Any other `pTemplate` falls back to the
     * item template, matching the legacy `ngAfterContentInit` default case. Note: `cancelicon`,
     * `onicon` and `officon` are recognized (they do not fall back to the item slot) but were
     * never rendered by this component, matching legacy behavior.
     */
    private static readonly KNOWN_PTEMPLATE_TYPES = ['item', 'selectedItem', 'header', 'filter', 'footer', 'emptyfilter', 'empty', 'group', 'loader', 'dropdownicon', 'loadingicon', 'clearicon', 'filtericon', 'cancelicon', 'onicon', 'officon'];

    readonly $itemTemplate = computed(
        () =>
            this.itemTemplate() ??
            this.templates()
                .filter((item) => item.getType() === 'item' || !Select.KNOWN_PTEMPLATE_TYPES.includes(item.getType()))
                .at(-1)?.template
    );

    readonly $selectedItemTemplate = computed(
        () =>
            this.selectedItemTemplate() ??
            this.templates()
                .filter((item) => item.getType() === 'selectedItem')
                .at(-1)?.template
    );

    readonly $headerTemplate = computed(
        () =>
            this.headerTemplate() ??
            this.templates()
                .filter((item) => item.getType() === 'header')
                .at(-1)?.template
    );

    readonly $filterTemplate = computed(
        () =>
            this.filterTemplate() ??
            this.templates()
                .filter((item) => item.getType() === 'filter')
                .at(-1)?.template
    );

    readonly $footerTemplate = computed(
        () =>
            this.footerTemplate() ??
            this.templates()
                .filter((item) => item.getType() === 'footer')
                .at(-1)?.template
    );

    readonly $emptyFilterTemplate = computed(
        () =>
            this.emptyFilterTemplate() ??
            this.templates()
                .filter((item) => item.getType() === 'emptyfilter')
                .at(-1)?.template
    );

    readonly $emptyTemplate = computed(
        () =>
            this.emptyTemplate() ??
            this.templates()
                .filter((item) => item.getType() === 'empty')
                .at(-1)?.template
    );

    readonly $groupTemplate = computed(
        () =>
            this.groupTemplate() ??
            this.templates()
                .filter((item) => item.getType() === 'group')
                .at(-1)?.template
    );

    readonly $loaderTemplate = computed(
        () =>
            this.loaderTemplate() ??
            this.templates()
                .filter((item) => item.getType() === 'loader')
                .at(-1)?.template
    );

    readonly $dropdownIconTemplate = computed(
        () =>
            this.dropdownIconTemplate() ??
            this.templates()
                .filter((item) => item.getType() === 'dropdownicon')
                .at(-1)?.template
    );

    readonly $loadingIconTemplate = computed(
        () =>
            this.loadingIconTemplate() ??
            this.templates()
                .filter((item) => item.getType() === 'loadingicon')
                .at(-1)?.template
    );

    readonly $clearIconTemplate = computed(
        () =>
            this.clearIconTemplate() ??
            this.templates()
                .filter((item) => item.getType() === 'clearicon')
                .at(-1)?.template
    );

    readonly $filterIconTemplate = computed(
        () =>
            this.filterIconTemplate() ??
            this.templates()
                .filter((item) => item.getType() === 'filtericon')
                .at(-1)?.template
    );

    filterOptions: SelectFilterOptions | undefined;

    /**
     * Internal options state. Preserves the legacy setter's `deepEquals` guard: when a new
     * `options` binding is deep-equal to the current value (e.g. a host binds a getter that
     * returns a fresh array on every change detection pass), the previous array reference is
     * kept so downstream computeds do not recompute and change detection converges.
     */
    readonly _options = linkedSignal<any[] | null | undefined, any[] | null | undefined>({
        source: this.options,
        computation: (val, previous) => (previous !== undefined && deepEquals(val, previous.value) ? previous.value : (val ?? null))
    });

    readonly _placeholder = linkedSignal(() => this.placeholder());

    value: any;

    readonly focused = signal<Nullable<boolean>>(undefined);

    readonly overlayVisible = signal<Nullable<boolean>>(undefined);

    selectedOptionUpdated: Nullable<boolean>;

    _filterValue = signal<any>(null);

    searchValue: Nullable<string>;

    searchTimeout: any;

    preventModelTouched: Nullable<boolean>;

    focusedOptionIndex = signal<number>(-1);

    clicked = signal<boolean>(false);

    readonly emptyMessageLabel = computed<string>(() => this.emptyMessage() || this.config.getTranslation(TranslationKeys.EMPTY_MESSAGE));

    readonly emptyFilterMessageLabel = computed<string>(() => this.emptyFilterMessage() || this.config.getTranslation(TranslationKeys.EMPTY_FILTER_MESSAGE));

    readonly isVisibleClearIcon = computed<boolean | undefined>(() => this.modelValue() != null && this.hasSelectedOption() && this.showClear() && !this.$disabled());

    readonly listLabel = computed<string>(() => this.config.getTranslation(TranslationKeys.ARIA)['listLabel']);

    readonly focusedOptionId = computed(() => (this.focusedOptionIndex() !== -1 ? `${this.$id()}_${this.focusedOptionIndex()}` : null));

    visibleOptions = computed(() => {
        const options = this.getAllVisibleAndNonVisibleOptions();

        if (this._filterValue()) {
            const _filterBy = this.filterBy() || this.optionLabel();

            const filteredOptions =
                !_filterBy && !this.filterFields() && !this.optionValue()
                    ? this._options()?.filter((option) => {
                          if (option.label) {
                              return option.label.toString().toLowerCase().indexOf(this._filterValue().toLowerCase().trim()) !== -1;
                          }
                          return option.toString().toLowerCase().indexOf(this._filterValue().toLowerCase().trim()) !== -1;
                      })
                    : this.filterService.filter(options, this.searchFields(), this._filterValue().trim(), this.filterMatchMode(), this.filterLocale());

            if (this.group()) {
                const optionGroups = this._options() || [];
                const filtered: any[] = [];

                optionGroups.forEach((group) => {
                    const groupChildren = this.getOptionGroupChildren(group);
                    const filteredItems = groupChildren.filter((item) => filteredOptions?.includes(item));

                    if (filteredItems.length > 0)
                        filtered.push({
                            ...group,
                            [typeof this.optionGroupChildren() === 'string' ? this.optionGroupChildren() : 'items']: [...filteredItems]
                        });
                });

                return this.flatOptions(filtered);
            }
            return filteredOptions;
        }

        return options;
    });

    label = computed(() => {
        // use  getAllVisibleAndNonVisibleOptions verses just visible options
        // this will find the selected option whether or not the user is currently filtering  because the filtered (i.e. visible) options, are a subset of all the options
        const options = this.getAllVisibleAndNonVisibleOptions();

        // use isOptionEqualsModelValue for the use case where the dropdown is initalized with a disabled option
        const selectedOptionIndex = options.findIndex((option) => {
            const isEqual = this.isOptionValueEqualsModelValue(option);
            return isEqual;
        });

        if (selectedOptionIndex !== -1) {
            const selectedOption = options[selectedOptionIndex];
            // Always show the label for selected options, even if disabled
            return this.getOptionLabel(selectedOption);
        }

        return this._placeholder() || 'p-emptylabel';
    });

    readonly selectedOption = signal<any>(undefined);

    readonly ariaSetSize = computed(() => this.visibleOptions().filter((option) => !this.isOptionGroup(option)).length);

    readonly virtualScrollerDisabled = computed(() => !this.virtualScroll());

    readonly containerDataP = computed(() =>
        this.cn({
            invalid: this.invalid(),
            disabled: this.$disabled(),
            focus: this.focused(),
            fluid: this.hasFluid,
            filled: this.$variant() === 'filled',
            [this.size() as string]: this.size()
        })
    );

    readonly labelDataP = computed(() =>
        this.cn({
            // NOTE: compares two function references and is therefore always false — this is the
            // legacy behavior ('placeholder' was never added to data-p) and is preserved as-is.
            placeholder: (this.label as unknown) === (this.placeholder as unknown),
            clearable: this.showClear(),
            disabled: this.$disabled(),
            [this.size() as string]: this.size(),
            empty: !this.editable() && !this.selectedItemTemplate() && (!this.label?.() || this.label() === 'p-emptylabel' || this.label()?.length === 0)
        })
    );

    readonly overlayDataP = computed(() =>
        this.cn({
            ['overlay-' + this.$appendTo()]: 'overlay-' + this.$appendTo()
        })
    );

    constructor() {
        super();
        effect(() => {
            // Track only the model value and the visible options, as the legacy effect did —
            // everything else (including the `selectedOption` signal written below) is untracked.
            const modelValue = this.modelValue();
            const visibleOptions = this.visibleOptions();

            untracked(() => {
                if (visibleOptions && isNotEmpty(visibleOptions)) {
                    const selectedOptionIndex = this.findSelectedOptionIndex();

                    if (selectedOptionIndex !== -1 || modelValue === undefined || (typeof modelValue === 'string' && modelValue.length === 0) || this.isModelValueNotSet() || this.editable()) {
                        this.selectedOption.set(visibleOptions[selectedOptionIndex]);
                    } else {
                        // If no valid selected option found but we have a model value,
                        // try to find the option including disabled ones for template display
                        const disabledSelectedIndex = visibleOptions.findIndex((option) => this.isSelected(option));
                        if (disabledSelectedIndex !== -1) {
                            this.selectedOption.set(visibleOptions[disabledSelectedIndex]);
                        }
                    }
                }

                if (isEmpty(visibleOptions) && (modelValue === undefined || this.isModelValueNotSet()) && isNotEmpty(this.selectedOption())) {
                    this.selectedOption.set(null);
                }

                if (modelValue !== undefined && this.editable()) {
                    this.updateEditableLabel();
                }
                this.cd.markForCheck();
            });
        });

        afterNextRender(() => {
            if (this.editable()) {
                this.updateEditableLabel();
            }
            this.updatePlaceHolderForFloatingLabel();
        });

        afterEveryRender(() => {
            this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));

            if (this.selectedOptionUpdated && this.itemsWrapper) {
                let selectedItem = <any>findSingle(this.overlayViewChild().overlayViewChild()?.nativeElement, 'li[data-p-selected="true"]');
                if (selectedItem) {
                    scrollInView(this.itemsWrapper, selectedItem);
                }
                this.selectedOptionUpdated = false;
            }
        });
    }

    onInit() {
        this.autoUpdateModel();

        if (this.filterBy()) {
            this.filterOptions = {
                filter: (value) => this.onFilterInputChange(value),
                reset: () => this.resetFilter()
            };
        }
    }

    private isModelValueNotSet(): boolean {
        return this.modelValue() === null && !this.isOptionValueEqualsModelValue(this.selectedOption());
    }

    private getAllVisibleAndNonVisibleOptions() {
        return this.group() ? this.flatOptions(this._options()) : this._options() || [];
    }

    flatOptions(options) {
        return (options || []).reduce((result, option, index) => {
            result.push({ optionGroup: option, group: true, index });

            const optionGroupChildren = this.getOptionGroupChildren(option);

            optionGroupChildren && optionGroupChildren.forEach((o) => result.push(o));

            return result;
        }, []);
    }

    autoUpdateModel() {
        if (this.selectOnFocus() && this.autoOptionFocus() && !this.hasSelectedOption()) {
            this.focusedOptionIndex.set(this.findFirstFocusedOptionIndex());
            this.onOptionSelect(null, this.visibleOptions()[this.focusedOptionIndex()], false);
        }
    }

    onOptionSelect(event, option, isHide = true, preventChange = false) {
        // Check if option is disabled before proceeding
        if (this.isOptionDisabled(option)) {
            return;
        }

        if (!this.isSelected(option)) {
            const value = this.getOptionValue(option);
            this.updateModel(value, event);
            this.focusedOptionIndex.set(this.findSelectedOptionIndex());
            preventChange === false && this.onChange.emit({ originalEvent: event, value: value });
        }
        if (isHide) {
            this.hide(true);
        }
    }

    onOptionMouseEnter(event, index) {
        if (this.focusOnHover()) {
            this.changeFocusedOptionIndex(event, index);
        }
    }

    updateModel(value, event?) {
        this.value = value;
        this.onModelChange(value);
        this.writeModelValue(value);
        this.selectedOptionUpdated = true;
    }

    allowModelChange() {
        const options = this._options();
        return !!this.modelValue() && !this._placeholder() && (this.modelValue() === undefined || this.modelValue() === null) && !this.editable() && options && options.length;
    }

    isSelected(option) {
        return this.isOptionValueEqualsModelValue(option);
    }

    private isOptionValueEqualsModelValue(option: any) {
        // Don't check isValidOption here since we need to match disabled options too
        return option !== undefined && option !== null && !this.isOptionGroup(option) && equals(this.modelValue(), this.getOptionValue(option), this.equalityKey());
    }

    updatePlaceHolderForFloatingLabel(): void {
        const parentElement = this.el.nativeElement.parentElement;
        const isInFloatingLabel = parentElement?.classList.contains('p-float-label');
        if (parentElement && isInFloatingLabel && !this.selectedOption()) {
            const label = parentElement.querySelector('label');
            if (label) {
                this._placeholder.set(label.textContent);
            }
        }
    }

    updateEditableLabel(): void {
        const editableInputViewChild = this.editableInputViewChild();
        if (editableInputViewChild) {
            editableInputViewChild.nativeElement.value = this.getOptionLabel(this.selectedOption()) || this.modelValue() || '';
        }
    }

    clearEditableLabel(): void {
        const editableInputViewChild = this.editableInputViewChild();
        if (editableInputViewChild) {
            editableInputViewChild.nativeElement.value = '';
        }
    }

    getOptionIndex(index, scrollerOptions) {
        return this.virtualScrollerDisabled() ? index : scrollerOptions && scrollerOptions.getItemOptions(index)['index'];
    }

    getOptionLabel(option: any) {
        return this.optionLabel() !== undefined && this.optionLabel() !== null ? resolveFieldData(option, this.optionLabel()) : option && option.label !== undefined ? option.label : option;
    }

    getOptionValue(option: any) {
        return this.optionValue() && this.optionValue() !== null ? resolveFieldData(option, this.optionValue()) : !this.optionLabel() && option && option.value !== undefined ? option.value : option;
    }

    getPTItemOptions(option: any, itemOptions: any, index: number, key: string) {
        return this.ptm(key, {
            context: {
                option,
                index,
                selected: this.isSelected(option),
                focused: this.focusedOptionIndex() === this.getOptionIndex(index, itemOptions),
                disabled: this.isOptionDisabled(option)
            }
        });
    }

    isSelectedOptionEmpty() {
        return isEmpty(this.selectedOption());
    }

    isOptionDisabled(option: any) {
        return this.optionDisabled() ? resolveFieldData(option, this.optionDisabled()) : option && option.disabled !== undefined ? option.disabled : false;
    }

    getOptionGroupLabel(optionGroup: any) {
        return this.optionGroupLabel() !== undefined && this.optionGroupLabel() !== null ? resolveFieldData(optionGroup, this.optionGroupLabel()) : optionGroup && optionGroup.label !== undefined ? optionGroup.label : optionGroup;
    }

    getOptionGroupChildren(optionGroup: any) {
        return this.optionGroupChildren() !== undefined && this.optionGroupChildren() !== null ? resolveFieldData(optionGroup, this.optionGroupChildren()) : optionGroup.items;
    }

    getAriaPosInset(index) {
        return (
            (this.optionGroupLabel()
                ? index -
                  this.visibleOptions()
                      .slice(0, index)
                      .filter((option) => this.isOptionGroup(option)).length
                : index) + 1
        );
    }

    /**
     * Callback to invoke on filter reset.
     * @group Method
     */
    public resetFilter(): void {
        this._filterValue.set(null);

        const filterViewChild = this.filterViewChild();
        if (filterViewChild && filterViewChild.nativeElement) {
            filterViewChild.nativeElement.value = '';
        }
    }

    onContainerClick(event: any) {
        if (this.$disabled() || this.readonly() || this.loading()) {
            return;
        }

        const overlayViewChild = this.overlayViewChild();
        if (event.target.tagName === 'INPUT' || event.target.getAttribute('data-pc-section') === 'clearicon' || event.target.closest('[data-pc-section="clearicon"]')) {
            return;
        } else if (!overlayViewChild.el.nativeElement.contains(event.target)) {
            this.overlayVisible() ? this.hide(true) : this.show(true);
        }

        this.focusInputViewChild()?.nativeElement.focus({ preventScroll: true });
        this.onClick.emit(event);
        this.clicked.set(true);
        this.cd.detectChanges();
    }

    isEmpty() {
        return !this._options() || (this.visibleOptions() && this.visibleOptions().length === 0);
    }

    onEditableInput(event: Event) {
        const value = (event.target as HTMLInputElement).value;
        this.searchValue = '';
        const matched = this.searchOptions(event, value);
        !matched && this.focusedOptionIndex.set(-1);

        this.onModelChange(value);
        this.updateModel(value || null, event);
        setTimeout(() => {
            this.onChange.emit({ originalEvent: event, value: value });
        }, 1);

        !this.overlayVisible() && isNotEmpty(value) && this.show();
    }

    /**
     * Displays the panel.
     * @group Method
     */
    public show(isFocus?) {
        this.overlayVisible.set(true);

        this.focusedOptionIndex.set(this.focusedOptionIndex() !== -1 ? this.focusedOptionIndex() : this.autoOptionFocus() ? this.findFirstFocusedOptionIndex() : this.editable() ? -1 : this.findSelectedOptionIndex());

        if (isFocus) {
            focus(this.focusInputViewChild()?.nativeElement);
        }

        this.cd.markForCheck();
    }

    onOverlayBeforeEnter(event: any) {
        this.itemsWrapper = <any>findSingle(this.overlayViewChild().overlayViewChild()?.nativeElement, this.virtualScroll() ? '[data-pc-name="virtualscroller"]' : '[data-pc-section="listcontainer"]');
        this.virtualScroll() && this.scroller()?.setContentEl(this.itemsViewChild()?.nativeElement);

        const options = this._options();
        if (options && options.length) {
            if (this.virtualScroll()) {
                const selectedIndex = this.modelValue() ? this.focusedOptionIndex() : -1;
                if (selectedIndex !== -1) {
                    setTimeout(() => {
                        this.scroller()?.scrollToIndex(selectedIndex);
                    }, 10);
                }
            } else {
                let selectedListItem = findSingle(this.itemsWrapper as HTMLElement, '[data-p-selected="true"]');
                if (selectedListItem) {
                    selectedListItem.scrollIntoView({ block: 'nearest', inline: 'nearest' });
                }
            }
        }

        const filterViewChild = this.filterViewChild();
        if (filterViewChild && filterViewChild.nativeElement) {
            this.preventModelTouched = true;

            if (this.autofocusFilter() && !this.editable()) {
                filterViewChild.nativeElement.focus();
            }
        }
        this.onShow.emit(event);
    }

    onOverlayAfterLeave(event: any) {
        this.itemsWrapper = null;
        this.onModelTouched();
        this.onHide.emit(event);
    }

    /**
     * Hides the panel.
     * @group Method
     */
    public hide(isFocus?) {
        this.overlayVisible.set(false);
        this.focusedOptionIndex.set(-1);
        this.clicked.set(false);
        this.searchValue = '';

        if (this.overlayOptions()?.mode === 'modal') {
            unblockBodyScroll();
        }
        if (this.filter() && this.resetFilterOnHide()) {
            this.resetFilter();
        }
        if (isFocus) {
            const focusInputViewChild = this.focusInputViewChild();
            if (focusInputViewChild) {
                focus(focusInputViewChild?.nativeElement);
            }
            const editableInputViewChild = this.editableInputViewChild();
            if (this.editable() && editableInputViewChild) {
                focus(editableInputViewChild?.nativeElement);
            }
        }
        this.cd.markForCheck();
    }

    onInputFocus(event: Event) {
        if (this.$disabled()) {
            // For ScreenReaders
            return;
        }

        this.focused.set(true);
        const focusedOptionIndex = this.focusedOptionIndex() !== -1 ? this.focusedOptionIndex() : this.overlayVisible() && this.autoOptionFocus() ? this.findFirstFocusedOptionIndex() : -1;
        this.focusedOptionIndex.set(focusedOptionIndex);
        this.overlayVisible() && this.scrollInView(this.focusedOptionIndex());

        this.onFocus.emit(event);
    }

    onInputBlur(event: Event) {
        this.focused.set(false);
        this.onBlur.emit(event);

        if (!this.preventModelTouched && !this.overlayVisible()) {
            this.onModelTouched();
        }
        this.preventModelTouched = false;
    }

    onKeyDown(event: KeyboardEvent, search: boolean = false) {
        if (this.$disabled() || this.readonly() || this.loading()) {
            return;
        }

        switch (event.code) {
            //down
            case 'ArrowDown':
                this.onArrowDownKey(event);
                break;

            //up
            case 'ArrowUp':
                this.onArrowUpKey(event, this.editable());
                break;

            case 'ArrowLeft':
            case 'ArrowRight':
                this.onArrowLeftKey(event, this.editable());
                break;

            case 'Delete':
                this.onDeleteKey(event);
                break;

            case 'Home':
                this.onHomeKey(event, this.editable());
                break;

            case 'End':
                this.onEndKey(event, this.editable());
                break;

            case 'PageDown':
                this.onPageDownKey(event);
                break;

            case 'PageUp':
                this.onPageUpKey(event);
                break;

            //space
            case 'Space':
                this.onSpaceKey(event, search);
                break;

            //enter
            case 'Enter':
            case 'NumpadEnter':
                this.onEnterKey(event);
                break;

            //escape and tab
            case 'Escape':
                this.onEscapeKey(event);
                break;

            case 'Tab':
                this.onTabKey(event);
                break;

            case 'Backspace':
                this.onBackspaceKey(event, this.editable());
                break;

            case 'ShiftLeft':
            case 'ShiftRight':
                //NOOP
                break;

            default:
                if (!event.metaKey && isPrintableCharacter(event.key)) {
                    !this.overlayVisible() && this.show();
                    !this.editable() && this.searchOptions(event, event.key);
                }

                break;
        }

        this.clicked.set(false);
    }

    onFilterKeyDown(event) {
        switch (event.code) {
            case 'ArrowDown':
                this.onArrowDownKey(event);
                break;

            case 'ArrowUp':
                this.onArrowUpKey(event, true);
                break;

            case 'ArrowLeft':
            case 'ArrowRight':
                this.onArrowLeftKey(event, true);
                break;

            case 'Home':
                this.onHomeKey(event, true);
                break;

            case 'End':
                this.onEndKey(event, true);
                break;

            case 'Enter':
            case 'NumpadEnter':
                this.onEnterKey(event, true);
                break;

            case 'Escape':
                this.onEscapeKey(event);
                break;

            case 'Tab':
                this.onTabKey(event, true);
                break;

            default:
                break;
        }
    }

    onFilterBlur(event) {
        this.focusedOptionIndex.set(-1);
    }

    onArrowDownKey(event: KeyboardEvent) {
        if (!this.overlayVisible()) {
            this.show();
            this.editable() && this.changeFocusedOptionIndex(event, this.findSelectedOptionIndex());
        } else {
            const optionIndex = this.focusedOptionIndex() !== -1 ? this.findNextOptionIndex(this.focusedOptionIndex()) : this.clicked() ? this.findFirstOptionIndex() : this.findFirstFocusedOptionIndex();

            this.changeFocusedOptionIndex(event, optionIndex);
        }
        // const optionIndex = this.focusedOptionIndex() !== -1 ? this.findNextOptionIndex(this.focusedOptionIndex()) : this.findFirstFocusedOptionIndex();
        // this.changeFocusedOptionIndex(event, optionIndex);

        // !this.overlayVisible() && this.show();
        event.preventDefault();
        event.stopPropagation();
    }

    changeFocusedOptionIndex(event, index) {
        if (this.focusedOptionIndex() !== index) {
            this.focusedOptionIndex.set(index);
            this.scrollInView();

            if (this.selectOnFocus()) {
                const option = this.visibleOptions()[index];
                this.onOptionSelect(event, option, false);
            }
        }
    }

    scrollInView(index = -1) {
        const id = index !== -1 ? `${this.$id()}_${index}` : this.focusedOptionId();

        const itemsViewChild = this.itemsViewChild();
        if (itemsViewChild && itemsViewChild.nativeElement) {
            const element = findSingle(itemsViewChild.nativeElement, `li[id="${id}"]`);
            if (element) {
                element.scrollIntoView && element.scrollIntoView({ block: 'nearest', inline: 'nearest' });
            } else if (!this.virtualScrollerDisabled()) {
                setTimeout(() => {
                    this.virtualScroll() && this.scroller()?.scrollToIndex(index !== -1 ? index : this.focusedOptionIndex());
                }, 0);
            }
        }
    }

    hasSelectedOption() {
        return this.modelValue() !== undefined;
    }

    isValidSelectedOption(option) {
        return this.isValidOption(option) && this.isSelected(option);
    }

    equalityKey() {
        return this.optionValue() ? undefined : this.dataKey();
    }

    findFirstFocusedOptionIndex() {
        const selectedIndex = this.findSelectedOptionIndex();
        return selectedIndex < 0 ? this.findFirstOptionIndex() : selectedIndex;
    }

    findFirstOptionIndex() {
        return this.visibleOptions().findIndex((option) => this.isValidOption(option));
    }

    findSelectedOptionIndex() {
        return this.hasSelectedOption() ? this.visibleOptions().findIndex((option) => this.isValidSelectedOption(option)) : -1;
    }

    findNextOptionIndex(index) {
        const matchedOptionIndex =
            index < this.visibleOptions().length - 1
                ? this.visibleOptions()
                      .slice(index + 1)
                      .findIndex((option) => this.isValidOption(option))
                : -1;
        return matchedOptionIndex > -1 ? matchedOptionIndex + index + 1 : index;
    }

    findPrevOptionIndex(index) {
        const matchedOptionIndex = index > 0 ? findLastIndex(this.visibleOptions().slice(0, index), (option) => this.isValidOption(option)) : -1;

        return matchedOptionIndex > -1 ? matchedOptionIndex : index;
    }

    findLastOptionIndex() {
        return findLastIndex(this.visibleOptions(), (option) => this.isValidOption(option));
    }

    findLastFocusedOptionIndex() {
        const selectedIndex = this.findSelectedOptionIndex();

        return selectedIndex < 0 ? this.findLastOptionIndex() : selectedIndex;
    }

    isValidOption(option) {
        return option !== undefined && option !== null && !(this.isOptionDisabled(option) || this.isOptionGroup(option));
    }

    isOptionGroup(option) {
        return this.optionGroupLabel() !== undefined && this.optionGroupLabel() !== null && option.optionGroup !== undefined && option.optionGroup !== null && option.group;
    }

    onArrowUpKey(event: KeyboardEvent, pressedInInputText: boolean = false) {
        if (event.altKey && !pressedInInputText) {
            if (this.focusedOptionIndex() !== -1) {
                const option = this.visibleOptions()[this.focusedOptionIndex()];
                this.onOptionSelect(event, option);
            }

            this.overlayVisible() && this.hide();
        } else {
            const optionIndex = this.focusedOptionIndex() !== -1 ? this.findPrevOptionIndex(this.focusedOptionIndex()) : this.clicked() ? this.findLastOptionIndex() : this.findLastFocusedOptionIndex();

            this.changeFocusedOptionIndex(event, optionIndex);

            !this.overlayVisible() && this.show();
        }
        event.preventDefault();
        event.stopPropagation();
    }

    onArrowLeftKey(event: KeyboardEvent, pressedInInputText: boolean = false) {
        pressedInInputText && this.focusedOptionIndex.set(-1);
    }

    onDeleteKey(event: KeyboardEvent) {
        if (this.showClear()) {
            this.clear(event);
            event.preventDefault();
        }
    }

    onHomeKey(event: any, pressedInInputText: boolean = false) {
        if (pressedInInputText && event.currentTarget && event.currentTarget.setSelectionRange) {
            const target = event.currentTarget;
            if (event.shiftKey) {
                target.setSelectionRange(0, target.value.length);
            } else {
                target.setSelectionRange(0, 0);
                this.focusedOptionIndex.set(-1);
            }
        } else {
            this.changeFocusedOptionIndex(event, this.findFirstOptionIndex());

            !this.overlayVisible() && this.show();
        }

        event.preventDefault();
    }

    onEndKey(event: any, pressedInInputText = false) {
        if (pressedInInputText && event.currentTarget && event.currentTarget.setSelectionRange) {
            const target = event.currentTarget;

            if (event.shiftKey) {
                target.setSelectionRange(0, target.value.length);
            } else {
                const len = target.value.length;

                target.setSelectionRange(len, len);
                this.focusedOptionIndex.set(-1);
            }
        } else {
            this.changeFocusedOptionIndex(event, this.findLastOptionIndex());

            !this.overlayVisible() && this.show();
        }

        event.preventDefault();
    }

    onPageDownKey(event: KeyboardEvent) {
        this.scrollInView(this.visibleOptions().length - 1);
        event.preventDefault();
    }

    onPageUpKey(event: KeyboardEvent) {
        this.scrollInView(0);
        event.preventDefault();
    }

    onSpaceKey(event: KeyboardEvent, pressedInInputText: boolean = false) {
        !this.editable() && !pressedInInputText && this.onEnterKey(event);
    }

    onEnterKey(event, pressedInInput = false) {
        if (!this.overlayVisible()) {
            this.focusedOptionIndex.set(-1);
            this.onArrowDownKey(event);
        } else {
            if (this.focusedOptionIndex() !== -1) {
                const option = this.visibleOptions()[this.focusedOptionIndex()];
                this.onOptionSelect(event, option);
            }

            !pressedInInput && this.hide();
        }

        event.preventDefault();
    }

    onEscapeKey(event: KeyboardEvent) {
        if (this.overlayVisible()) {
            this.hide(true);
            event.preventDefault();
            event.stopPropagation();
        }
    }

    onTabKey(event, pressedInInputText = false) {
        if (!pressedInInputText) {
            if (this.overlayVisible() && this.hasFocusableElements()) {
                focus(event.shiftKey ? this.lastHiddenFocusableElementOnOverlay()?.nativeElement : this.firstHiddenFocusableElementOnOverlay()?.nativeElement);
                event.preventDefault();
            } else {
                if (this.focusedOptionIndex() !== -1 && this.overlayVisible()) {
                    const option = this.visibleOptions()[this.focusedOptionIndex()];
                    this.onOptionSelect(event, option);
                }
                this.overlayVisible() && this.hide(this.filter());
            }
        }
        event.stopPropagation();
    }

    onFirstHiddenFocus(event) {
        const focusInputViewChild = this.focusInputViewChild();
        const focusableEl = event.relatedTarget === focusInputViewChild?.nativeElement ? getFirstFocusableElement(this.overlayViewChild().el?.nativeElement, ':not([data-p-hidden-focusable="true"])') : focusInputViewChild?.nativeElement;
        focus(focusableEl);
    }

    onLastHiddenFocus(event) {
        const focusInputViewChild = this.focusInputViewChild();
        const focusableEl =
            event.relatedTarget === focusInputViewChild?.nativeElement ? getLastFocusableElement(this.overlayViewChild().overlayViewChild()?.nativeElement, ':not([data-p-hidden-focusable="true"])') : focusInputViewChild?.nativeElement;

        focus(focusableEl);
    }

    hasFocusableElements() {
        return getFocusableElements(this.overlayViewChild().overlayViewChild()?.nativeElement, ':not([data-p-hidden-focusable="true"])').length > 0;
    }

    onBackspaceKey(event: KeyboardEvent, pressedInInputText = false) {
        if (pressedInInputText) {
            !this.overlayVisible() && this.show();
        }
    }

    searchFields() {
        return this.filterBy()?.split(',') || this.filterFields() || [this.optionLabel()];
    }

    searchOptions(event, char) {
        this.searchValue = (this.searchValue || '') + char;

        let optionIndex = -1;
        let matched = false;

        optionIndex = this.visibleOptions().findIndex((option) => this.isOptionMatched(option));

        if (optionIndex !== -1) {
            matched = true;
        }

        if (optionIndex === -1 && this.focusedOptionIndex() === -1) {
            optionIndex = this.findFirstFocusedOptionIndex();
        }

        if (optionIndex !== -1) {
            setTimeout(() => {
                this.changeFocusedOptionIndex(event, optionIndex);
            });
        }

        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }

        this.searchTimeout = setTimeout(() => {
            this.searchValue = '';
            this.searchTimeout = null;
        }, 500);

        return matched;
    }

    isOptionMatched(option) {
        return this.isValidOption(option) && this.getOptionLabel(option).toString().toLocaleLowerCase(this.filterLocale()).startsWith(this.searchValue?.toLocaleLowerCase(this.filterLocale()));
    }

    onFilterInputChange(event: Event | any): void {
        let value: string = (event.target as HTMLInputElement).value;
        this._filterValue.set(value);
        this.focusedOptionIndex.set(-1);
        this.onFilter.emit({ originalEvent: event, filter: this._filterValue() });
        !this.virtualScrollerDisabled() && this.scroller()?.scrollToIndex(0);
        setTimeout(() => {
            this.overlayViewChild().alignOverlay();
        });
        this.cd.markForCheck();
    }

    applyFocus(): void {
        if (this.editable()) (findSingle(this.el.nativeElement, '[data-pc-section="label"]') as any).focus();
        else focus(this.focusInputViewChild()?.nativeElement);
    }

    /**
     * Applies focus.
     * @group Method
     */
    public focus(): void {
        this.applyFocus();
    }

    /**
     * Clears the model.
     * @group Method
     */
    public clear(event?: Event) {
        this.updateModel(null, event);
        this.clearEditableLabel();
        this.onModelTouched();
        this.onChange.emit({ originalEvent: event, value: this.value });
        this.onClear.emit(event);
        this.resetFilter();
    }

    /**
     * @override
     *
     * @see {@link BaseEditableHolder.writeControlValue}
     * Writes the value to the control.
     */
    writeControlValue(value: any, setModelValue: (value: any) => void): void {
        if (this.filter()) {
            this.resetFilter();
        }

        this.value = value;
        this.allowModelChange() && this.onModelChange(value);
        setModelValue(this.value);
        this.updateEditableLabel();
        this.cd.markForCheck();
    }
}

@NgModule({
    imports: [Select, SharedModule],
    exports: [Select, SharedModule]
})
export class SelectModule {}
