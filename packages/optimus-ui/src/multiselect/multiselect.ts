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
    input,
    linkedSignal,
    NgModule,
    NgZone,
    numberAttribute,
    signal,
    TemplateRef,
    ViewEncapsulation,
    viewChild,
    contentChild,
    contentChildren,
    output
} from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MotionOptions } from '@openng/optimus-ui-motion';
import { deepEquals, equals, findLastIndex, findSingle, focus, getFirstFocusableElement, getFocusableElements, getLastFocusableElement, isArray, isNotEmpty, isPrintableCharacter, resolveFieldData, uuid } from '@openng/optimus-ui-utils';
import { FilterService, Footer, OverlayOptions, OverlayService, PrimeTemplate, ScrollerOptions, SharedModule, TranslationKeys } from '@openng/optimus-ui/api';
import { AutoFocus } from '@openng/optimus-ui/autofocus';
import { BaseComponent, PARENT_INSTANCE } from '@openng/optimus-ui/basecomponent';
import { BaseEditableHolder } from '@openng/optimus-ui/baseeditableholder';
import { Bind, BindModule } from '@openng/optimus-ui/bind';
import { Checkbox } from '@openng/optimus-ui/checkbox';
import { Chip } from '@openng/optimus-ui/chip';
import { DomHandler, unblockBodyScroll } from '@openng/optimus-ui/dom';
import { Fluid } from '@openng/optimus-ui/fluid';
import { IconField } from '@openng/optimus-ui/iconfield';
import { CheckIcon, ChevronDownIcon, SearchIcon, TimesIcon } from '@openng/optimus-ui/icons';
import { InputIcon } from '@openng/optimus-ui/inputicon';
import { InputText } from '@openng/optimus-ui/inputtext';
import { Overlay } from '@openng/optimus-ui/overlay';
import { Scroller } from '@openng/optimus-ui/scroller';
import { Tooltip } from '@openng/optimus-ui/tooltip';
import { Nullable } from '@openng/optimus-ui/ts-helpers';
import {
    MultiSelectBlurEvent,
    MultiSelectChangeEvent,
    MultiSelectChipIconTemplateContext,
    MultiSelectDropdownIconTemplateContext,
    MultiSelectFilterEvent,
    MultiSelectFilterOptions,
    MultiSelectFilterTemplateContext,
    MultiSelectFocusEvent,
    MultiSelectGroupTemplateContext,
    MultiSelectHeaderCheckboxIconTemplateContext,
    MultiSelectItemCheckboxIconTemplateContext,
    MultiSelectItemTemplateContext,
    MultiSelectLazyLoadEvent,
    MultiSelectLoaderTemplateContext,
    MultiSelectPassThrough,
    MultiSelectRemoveEvent,
    MultiSelectSelectAllChangeEvent,
    MultiSelectSelectedItemsTemplateContext
} from '@openng/optimus-ui/types/multiselect';
import { ObjectUtils } from '@openng/optimus-ui/utils';
import { MultiSelectStyle } from './style/multiselectstyle';

export const MULTISELECT_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MultiSelect),
    multi: true
};

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'li[pMultiSelectItem]',
    standalone: true,
    imports: [CommonModule, Checkbox, FormsModule, SharedModule],
    template: `
        <p-checkbox [ngModel]="selected()" [ngModelOptions]="{ standalone: true }" [binary]="true" [tabindex]="-1" [variant]="variant()" [ariaLabel]="label()" [pt]="getPTOptions('pcOptionCheckbox')" [unstyled]="unstyled()">
            @if (itemCheckboxIconTemplate()) {
                <ng-template #icon let-klass="class">
                    <ng-template *ngTemplateOutlet="itemCheckboxIconTemplate(); context: { checked: selected(), class: klass }"></ng-template>
                </ng-template>
            }
        </p-checkbox>
        @if (!template()) {
            <span>{{ label() ?? 'empty' }}</span>
        }
        <ng-container *ngTemplateOutlet="template(); context: { $implicit: option() }"></ng-container>
    `,
    encapsulation: ViewEncapsulation.None,
    providers: [MultiSelectStyle],
    host: {
        '[style.height.px]': 'itemSize()',
        '[attr.aria-label]': 'label()',
        role: 'option',
        '[attr.aria-setsize]': 'ariaSetSize()',
        '[attr.aria-posinset]': 'ariaPosInset()',
        '[attr.aria-selected]': 'selected()',
        '[attr.data-p-selected]': 'selected()',
        '[attr.data-p-focused]': 'focused()',
        '[attr.data-p-highlight]': 'selected()',
        '[attr.data-p-disabled]': 'disabled()',
        '[attr.aria-checked]': 'selected()',
        '(click)': 'onOptionClick($event)',
        '(mouseenter)': 'onOptionMouseEnter($event)',
        '[class]': "cx('option')"
    }
})
export class MultiSelectItem extends BaseComponent {
    _componentStyle = inject(MultiSelectStyle);

    readonly option = input<any>();

    readonly selected = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    readonly label = input<string>();

    readonly disabled = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    readonly itemSize = input<number | undefined, unknown>(undefined, { transform: numberAttribute });

    readonly focused = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    readonly ariaPosInset = input<string>();

    readonly ariaSetSize = input<string>();

    readonly variant = input<'outlined' | 'filled'>();

    readonly template = input<TemplateRef<MultiSelectItemTemplateContext>>();

    readonly itemCheckboxIconTemplate = input<TemplateRef<MultiSelectItemCheckboxIconTemplateContext>>();

    readonly highlightOnSelect = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    readonly onClick = output<any>();

    readonly onMouseEnter = output<any>();

    hostName = 'MultiSelect';

    getPTOptions(key) {
        return this.ptm(key, {
            context: {
                selected: this.selected(),
                focused: this.focused(),
                disabled: this.disabled()
            }
        });
    }

    onOptionClick(event: Event) {
        this.onClick.emit({
            originalEvent: event,
            option: this.option(),
            selected: this.selected()
        });
        event.stopPropagation();
        event.preventDefault();
    }

    onOptionMouseEnter(event: Event) {
        this.onMouseEnter.emit({
            originalEvent: event,
            option: this.option(),
            selected: this.selected()
        });
    }
}

/**
 * MultiSelect is used to select multiple items from a collection.
 * @group Components
 */
@Component({
    selector: 'p-multiSelect, p-multiselect, p-multi-select',
    standalone: true,
    imports: [CommonModule, MultiSelectItem, Overlay, SharedModule, Tooltip, Scroller, AutoFocus, CheckIcon, SearchIcon, TimesIcon, ChevronDownIcon, IconField, InputIcon, InputText, Chip, Checkbox, FormsModule, BindModule],
    hostDirectives: [Bind],
    template: `
        <div class="p-hidden-accessible" [attr.data-p-hidden-accessible]="true" [pBind]="ptm('hiddenInputContainer')">
            <input
                #focusInput
                [pTooltip]="tooltip()"
                [pTooltipUnstyled]="unstyled()"
                [tooltipPosition]="tooltipPosition()"
                [positionStyle]="tooltipPositionStyle()"
                [tooltipStyleClass]="tooltipStyleClass()"
                [attr.aria-disabled]="$disabled()"
                [attr.id]="inputId()"
                role="combobox"
                [attr.aria-label]="ariaLabel()"
                [attr.aria-labelledby]="ariaLabelledBy()"
                [attr.aria-haspopup]="'listbox'"
                [attr.aria-expanded]="$overlayVisible() ?? false"
                [attr.aria-controls]="$overlayVisible() ? $id() + '_list' : null"
                [attr.tabindex]="!$disabled() ? tabindex() : -1"
                [attr.aria-activedescendant]="focused() ? focusedOptionId() : undefined"
                (focus)="onInputFocus($event)"
                (blur)="onInputBlur($event)"
                (keydown)="onKeyDown($event)"
                [pAutoFocus]="autofocus()"
                [attr.value]="modelValue()"
                [attr.name]="name()"
                [attr.required]="required() ? '' : undefined"
                [attr.disabled]="$disabled() ? '' : undefined"
                [pBind]="ptm('hiddenInput')"
            />
        </div>
        <div
            [pBind]="ptm('labelContainer')"
            [class]="cx('labelContainer')"
            [pTooltip]="tooltip()"
            [pTooltipUnstyled]="unstyled()"
            (mouseleave)="labelContainerMouseLeave()"
            [tooltipDisabled]="_disableTooltip()"
            [tooltipPosition]="tooltipPosition()"
            [positionStyle]="tooltipPositionStyle()"
            [tooltipStyleClass]="tooltipStyleClass()"
        >
            <div [pBind]="ptm('label')" [class]="cx('label')" [attr.data-p]="labelDataP()">
                <ng-container *ngIf="!$selectedItemsTemplate()">
                    <ng-container *ngIf="display() === 'comma'">{{ label() || 'empty' }}</ng-container>
                    <ng-container *ngIf="display() === 'chip'">
                        @if (chipSelectedItems() && chipSelectedItems().length === maxSelectedLabels()) {
                            {{ getSelectedItemsLabel() }}
                        } @else {
                            <div #token *ngFor="let item of chipSelectedItems(); let i = index" [pBind]="ptm('chipItem')" [class]="cx('chipItem')">
                                <p-chip [pt]="ptm('pcChip')" [unstyled]="unstyled()" [class]="cx('pcChip')" [label]="getLabelByValue(item)" [removable]="!$disabled() && !readonly()" (onRemove)="removeOption(item, $event)" [removeIcon]="chipIcon()">
                                    <ng-container *ngIf="$chipIconTemplate() || $removeTokenIconTemplate()">
                                        <ng-template #removeicon>
                                            <ng-container *ngIf="!$disabled() && !readonly()">
                                                <span [class]="cx('chipIcon')" *ngIf="$chipIconTemplate() || $removeTokenIconTemplate()" (click)="removeOption(item, $event)" [attr.aria-hidden]="true" [pBind]="ptm('chipIcon')">
                                                    <ng-container *ngTemplateOutlet="$chipIconTemplate() || $removeTokenIconTemplate(); context: { class: 'p-multiselect-chip-icon' }"></ng-container>
                                                </span>
                                            </ng-container>
                                        </ng-template>
                                    </ng-container>
                                </p-chip>
                            </div>
                        }
                        <ng-container *ngIf="!modelValue() || modelValue().length === 0">{{ _placeholder() || 'empty' }}</ng-container>
                    </ng-container>
                </ng-container>
                <ng-container *ngIf="$selectedItemsTemplate()">
                    <ng-container *ngTemplateOutlet="$selectedItemsTemplate(); context: { $implicit: selectedOptions(), removeChip: removeOption.bind(this) }"></ng-container>
                    <ng-container *ngIf="!modelValue() || modelValue().length === 0">{{ _placeholder() || 'empty' }}</ng-container>
                </ng-container>
            </div>
        </div>
        <ng-container *ngIf="isVisibleClearIcon()">
            <svg data-p-icon="times" *ngIf="!$clearIconTemplate()" [pBind]="ptm('clearIcon')" [class]="cx('clearIcon')" (click)="clear($event)" [attr.aria-hidden]="true" />
            <span *ngIf="$clearIconTemplate()" [pBind]="ptm('clearIcon')" [class]="cx('clearIcon')" (click)="clear($event)" [attr.aria-hidden]="true">
                <ng-template *ngTemplateOutlet="$clearIconTemplate()"></ng-template>
            </span>
        </ng-container>
        <div [pBind]="ptm('dropdown')" [class]="cx('dropdown')">
            <ng-container *ngIf="loading(); else elseBlock">
                <ng-container *ngIf="$loadingIconTemplate()">
                    <ng-container *ngTemplateOutlet="$loadingIconTemplate()"></ng-container>
                </ng-container>
                <ng-container *ngIf="!$loadingIconTemplate()">
                    <span *ngIf="loadingIcon()" [pBind]="ptm('loadingIcon')" [class]="cn(cx('loadingIcon'), 'pi-spin ' + loadingIcon())" [attr.aria-hidden]="true"></span>
                    <span *ngIf="!loadingIcon()" [pBind]="ptm('loadingIcon')" [class]="cn(cx('loadingIcon'), 'pi pi-spinner pi-spin')" [attr.aria-hidden]="true"></span>
                </ng-container>
            </ng-container>
            <ng-template #elseBlock>
                <ng-container *ngIf="!$dropdownIconTemplate()">
                    <span *ngIf="dropdownIcon()" [pBind]="ptm('dropdownIcon')" [class]="cx('dropdownIcon')" [ngClass]="dropdownIcon()" [attr.aria-hidden]="true" [attr.data-p]="dropdownIconDataP()"></span>
                    <svg data-p-icon="chevron-down" *ngIf="!dropdownIcon()" [pBind]="ptm('dropdownIcon')" [class]="cx('dropdownIcon')" [attr.aria-hidden]="true" [attr.data-p]="dropdownIconDataP()" />
                </ng-container>
                <span *ngIf="$dropdownIconTemplate()" [pBind]="ptm('dropdownIcon')" [class]="cx('dropdownIcon')" [attr.aria-hidden]="true">
                    <ng-template *ngTemplateOutlet="$dropdownIconTemplate(); context: { dataP: dropdownIconDataP() }"></ng-template>
                </span>
            </ng-template>
        </div>
        <p-overlay
            #overlay
            [hostAttrSelector]="$attrSelector"
            [(visible)]="$overlayVisible"
            [options]="overlayOptions()"
            [target]="'@parent'"
            [appendTo]="$appendTo()"
            [unstyled]="unstyled()"
            [pt]="ptm('pcOverlay')"
            [motionOptions]="motionOptions()"
            (onBeforeEnter)="onOverlayBeforeEnter($event)"
            (onAfterLeave)="onOverlayAfterLeave($event)"
            (onHide)="onOverlayHide($event)"
        >
            <ng-template #content>
                <div [pBind]="ptm('overlay')" [attr.data-p]="overlayDataP()" [attr.id]="$id() + '_list'" [class]="cn(cx('overlay'), panelStyleClass())" [ngStyle]="panelStyle()">
                    <span
                        #firstHiddenFocusableEl
                        role="presentation"
                        class="p-hidden-accessible p-hidden-focusable"
                        [attr.tabindex]="0"
                        (focus)="onFirstHiddenFocus($event)"
                        [attr.data-p-hidden-accessible]="true"
                        [attr.data-p-hidden-focusable]="true"
                        [pBind]="ptm('firstHiddenFocusableEl')"
                    >
                    </span>
                    <ng-container *ngTemplateOutlet="$headerTemplate()"></ng-container>
                    <div [pBind]="ptm('header')" [class]="cx('header')" *ngIf="showHeader()">
                        <ng-content select="p-header"></ng-content>
                        <ng-container *ngIf="$filterTemplate(); else builtInFilterElement">
                            <ng-container *ngTemplateOutlet="$filterTemplate(); context: { options: filterOptions }"></ng-container>
                        </ng-container>
                        <ng-template #builtInFilterElement>
                            <p-checkbox
                                [pt]="getHeaderCheckboxPTOptions('pcHeaderCheckbox')"
                                [ngModel]="allSelected()"
                                [ngModelOptions]="{ standalone: true }"
                                [ariaLabel]="toggleAllAriaLabel"
                                [binary]="true"
                                (onChange)="onToggleAll($event)"
                                *ngIf="showToggleAll() && !selectionLimit()"
                                [variant]="$variant()"
                                [disabled]="$disabled()"
                                [unstyled]="unstyled()"
                                #headerCheckbox
                            >
                                <ng-template #icon let-klass="class">
                                    <svg data-p-icon="check" *ngIf="!$headerCheckboxIconTemplate() && allSelected()" [class]="klass" [pBind]="getHeaderCheckboxPTOptions('pcHeaderCheckbox.icon')" />
                                    <ng-template
                                        *ngTemplateOutlet="
                                            $headerCheckboxIconTemplate();
                                            context: {
                                                checked: allSelected(),
                                                partialSelected: partialSelected(),
                                                class: klass
                                            }
                                        "
                                    ></ng-template>
                                </ng-template>
                            </p-checkbox>

                            <p-iconfield *ngIf="filter()" [pt]="ptm('pcFilterContainer')" [class]="cx('pcFilterContainer')" [unstyled]="unstyled()">
                                <input
                                    #filterInput
                                    pInputText
                                    [pt]="ptm('pcFilter')"
                                    [variant]="$variant()"
                                    type="text"
                                    [attr.autocomplete]="autocomplete()"
                                    role="searchbox"
                                    [attr.aria-owns]="$id() + '_list'"
                                    [attr.aria-activedescendant]="focusedOptionId()"
                                    [value]="_filterValue() || ''"
                                    (input)="onFilterInputChange($event)"
                                    (keydown)="onFilterKeyDown($event)"
                                    (click)="onInputClick($event)"
                                    (blur)="onFilterBlur($event)"
                                    [class]="cx('pcFilter')"
                                    [attr.disabled]="$disabled() ? '' : undefined"
                                    [attr.placeholder]="filterPlaceHolder()"
                                    [attr.aria-label]="ariaFilterLabel()"
                                    [unstyled]="unstyled()"
                                />
                                <p-inputicon [pt]="ptm('pcFilterIconContainer')" [unstyled]="unstyled()">
                                    <svg data-p-icon="search" *ngIf="!$filterIconTemplate()" [pBind]="ptm('filterIcon')" />
                                    <span *ngIf="$filterIconTemplate()" [pBind]="ptm('filterIcon')" class="p-multiselect-filter-icon">
                                        <ng-template *ngTemplateOutlet="$filterIconTemplate()"></ng-template>
                                    </span>
                                </p-inputicon>
                            </p-iconfield>
                        </ng-template>
                    </div>
                    <div [pBind]="ptm('listContainer')" [class]="cx('listContainer')" [style.max-height]="virtualScroll() ? 'auto' : scrollHeight() || 'auto'">
                        <p-scroller
                            *ngIf="virtualScroll()"
                            #scroller
                            [items]="visibleOptions()"
                            [style]="{ height: scrollHeight() }"
                            [itemSize]="virtualScrollItemSize()"
                            [autoSize]="true"
                            [tabindex]="-1"
                            [lazy]="lazy()"
                            (onLazyLoad)="onLazyLoad.emit($event)"
                            [options]="virtualScrollOptions()"
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
                            <ul #items [pBind]="ptm('list')" [class]="cn(cx('list'), scrollerOptions.contentStyleClass)" [style]="scrollerOptions.contentStyle" role="listbox" aria-multiselectable="true" [attr.aria-label]="listLabel()">
                                <ng-template ngFor let-option [ngForOf]="items" let-i="index">
                                    <ng-container *ngIf="isOptionGroup(option)">
                                        <li [pBind]="ptm('optionGroup')" [attr.id]="$id() + '_' + getOptionIndex(i, scrollerOptions)" [class]="cx('optionGroup')" [ngStyle]="{ height: scrollerOptions.itemSize + 'px' }" role="option">
                                            <span *ngIf="!groupTemplate() && option.optionGroup">{{ getOptionGroupLabel(option.optionGroup) }}</span>
                                            <ng-container *ngIf="option.optionGroup && groupTemplate()" [ngTemplateOutlet]="groupTemplate()" [ngTemplateOutletContext]="{ $implicit: option.optionGroup }"></ng-container>
                                        </li>
                                    </ng-container>
                                    <ng-container *ngIf="!isOptionGroup(option)">
                                        <li
                                            pMultiSelectItem
                                            pRipple
                                            [pBind]="getPTOptions(option, getItemOptions, i, 'option')"
                                            [id]="$id() + '_' + getOptionIndex(i, scrollerOptions)"
                                            [option]="option"
                                            [selected]="isSelected(option)"
                                            [label]="getOptionLabel(option)"
                                            [disabled]="isOptionDisabled(option)"
                                            [template]="$itemTemplate()"
                                            [itemCheckboxIconTemplate]="$itemCheckboxIconTemplate()"
                                            [itemSize]="scrollerOptions.itemSize"
                                            [focused]="focusedOptionIndex() === getOptionIndex(i, scrollerOptions)"
                                            [ariaPosInset]="getAriaPosInset(getOptionIndex(i, scrollerOptions))"
                                            [ariaSetSize]="ariaSetSize()"
                                            [variant]="$variant()"
                                            [highlightOnSelect]="highlightOnSelect()"
                                            (onClick)="onOptionSelect($event, false, getOptionIndex(i, scrollerOptions))"
                                            (onMouseEnter)="onOptionMouseEnter($event, getOptionIndex(i, scrollerOptions))"
                                            [pt]="pt"
                                            [unstyled]="unstyled()"
                                        ></li>
                                    </ng-container>
                                </ng-template>

                                <li *ngIf="hasFilter() && isEmpty()" [pBind]="ptm('emptyMessage')" [class]="cx('emptyMessage')" [ngStyle]="{ height: scrollerOptions.itemSize + 'px' }" role="option">
                                    @if (!$emptyFilterTemplate() && !$emptyTemplate()) {
                                        {{ emptyFilterMessageLabel() }}
                                    } @else {
                                        <ng-container *ngTemplateOutlet="$emptyFilterTemplate() || $emptyTemplate()"></ng-container>
                                    }
                                </li>
                                <li *ngIf="!hasFilter() && isEmpty()" [pBind]="ptm('emptyMessage')" [class]="cx('emptyMessage')" [ngStyle]="{ height: scrollerOptions.itemSize + 'px' }" role="option">
                                    @if (!$emptyTemplate()) {
                                        {{ emptyMessageLabel() }}
                                    } @else {
                                        <ng-container *ngTemplateOutlet="$emptyTemplate()"></ng-container>
                                    }
                                </li>
                            </ul>
                        </ng-template>
                    </div>
                    <div *ngIf="footerFacet() || $footerTemplate()">
                        <ng-content select="p-footer"></ng-content>
                        <ng-container *ngTemplateOutlet="$footerTemplate()"></ng-container>
                    </div>

                    <span
                        #lastHiddenFocusableEl
                        role="presentation"
                        class="p-hidden-accessible p-hidden-focusable"
                        [attr.tabindex]="0"
                        (focus)="onLastHiddenFocus($event)"
                        [attr.data-p-hidden-accessible]="true"
                        [attr.data-p-hidden-focusable]="true"
                        [pBind]="ptm('lastHiddenFocusableEl')"
                    ></span>
                </div>
            </ng-template>
        </p-overlay>
    `,
    providers: [MULTISELECT_VALUE_ACCESSOR, MultiSelectStyle, { provide: PARENT_INSTANCE, useExisting: MultiSelect }],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        '[attr.id]': '$id()',
        '[attr.data-p]': 'containerDataP()',
        '(click)': 'onContainerClick($event)',
        '[class]': "cx('root')",
        '[style]': "sx('root')"
    }
})
export class MultiSelect extends BaseEditableHolder<MultiSelectPassThrough> {
    private zone = inject(NgZone);

    filterService = inject(FilterService);

    overlayService = inject(OverlayService);

    _componentStyle = inject(MultiSelectStyle);

    bindDirectiveInstance = inject(Bind, { self: true });

    pcFluid: Fluid | null = inject(Fluid, { optional: true, host: true, skipSelf: true });

    /**
     * Unique identifier of the component
     * @group Props
     */
    readonly id = input<string>();

    /**
     * Defines a string that labels the input for accessibility.
     * @group Props
     */
    readonly ariaLabel = input<string>();

    /**
     * Inline style of the overlay panel.
     * @group Props
     */
    readonly panelStyle = input<any>();

    /**
     * Style class of the overlay panel element.
     * @group Props
     */
    readonly panelStyleClass = input<string>();

    /**
     * Identifier of the focus input to match a label defined for the component.
     * @group Props
     */
    readonly inputId = input<string>();

    /**
     * When present, it specifies that the component cannot be edited.
     * @group Props
     */
    readonly readonly = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    /**
     * Whether to display options as grouped when nested options are provided.
     * @group Props
     */
    readonly group = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    /**
     * When specified, displays an input field to filter the items on keyup.
     * @group Props
     */
    readonly filter = input<boolean, unknown>(true, { transform: booleanAttribute });

    /**
     * Defines placeholder of the filter input.
     * @group Props
     */
    readonly filterPlaceHolder = input<string>();

    /**
     * Locale to use in filtering. The default locale is the host environment's current locale.
     * @group Props
     */
    readonly filterLocale = input<string>();

    /**
     * Specifies the visibility of the options panel.
     * @group Props
     */
    readonly overlayVisible = input<boolean | undefined, unknown>(false, { transform: booleanAttribute });

    /**
     * Index of the element in tabbing order.
     * @group Props
     */
    readonly tabindex = input<number | undefined, unknown>(0, { transform: numberAttribute });

    /**
     * A property to uniquely identify a value in options.
     * @group Props
     */
    readonly dataKey = input<string>();

    /**
     * Establishes relationships between the component and label(s) where its value should be one or more element IDs.
     * @group Props
     */
    readonly ariaLabelledBy = input<string>();

    /**
     * Whether to show labels of selected item labels or use default label.
     * @group Props
     * @defaultValue true
     */
    readonly displaySelectedLabel = input<boolean>(true);

    /**
     * Decides how many selected item labels to show at most.
     * @group Props
     * @defaultValue 3
     */
    readonly maxSelectedLabels = input<number | null | undefined>(3);

    /**
     * Maximum number of selectable items.
     * @group Props
     */
    readonly selectionLimit = input<number | undefined, unknown>(undefined, { transform: numberAttribute });

    /**
     * Label to display after exceeding max selected labels e.g. ({0} items selected), defaults "ellipsis" keyword to indicate a text-overflow.
     * @group Props
     */
    readonly selectedItemsLabel = input<string>();

    /**
     * Whether to show the checkbox at header to toggle all items at once.
     * @group Props
     */
    readonly showToggleAll = input<boolean, unknown>(true, { transform: booleanAttribute });

    /**
     * Text to display when filtering does not return any results.
     * @group Props
     */
    readonly emptyFilterMessage = input<string>('');

    /**
     * Text to display when there is no data. Defaults to global value in i18n translation configuration.
     * @group Props
     */
    readonly emptyMessage = input<string>('');

    /**
     * Clears the filter value when hiding the dropdown.
     * @group Props
     */
    readonly resetFilterOnHide = input<boolean, unknown>(false, { transform: booleanAttribute });

    /**
     * Icon class of the dropdown icon.
     * @group Props
     */
    readonly dropdownIcon = input<string>();

    /**
     * Icon class of the chip icon.
     * @group Props
     */
    readonly chipIcon = input<string>();

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
     * Whether to show the header.
     * @group Props
     */
    readonly showHeader = input<boolean, unknown>(true, { transform: booleanAttribute });

    /**
     * When filtering is enabled, filterBy decides which field or fields (comma separated) to search against.
     * @group Props
     */
    readonly filterBy = input<string>();

    /**
     * Height of the viewport in pixels, a scrollbar is defined if height of list exceeds this value.
     * @group Props
     */
    readonly scrollHeight = input<string>('200px');

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
     * Whether the multiselect is in loading state.
     * @group Props
     */
    readonly loading = input<boolean | undefined, unknown>(false, { transform: booleanAttribute });

    /**
     * Height of an item in the list for VirtualScrolling.
     * @group Props
     */
    readonly virtualScrollItemSize = input<number | undefined, unknown>(undefined, { transform: numberAttribute });

    /**
     * Icon to display in loading state.
     * @group Props
     */
    readonly loadingIcon = input<string>();

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
     * Applies focus to the filter element when the overlay is shown.
     * @group Props
     */
    readonly autofocusFilter = input<boolean, unknown>(false, { transform: booleanAttribute });

    /**
     * Defines how the selected items are displayed.
     * @group Props
     */
    readonly display = input<string | 'comma' | 'chip'>('comma');

    /**
     * Defines the autocomplete is active.
     * @group Props
     */
    readonly autocomplete = input<string>('off');

    /**
     * When enabled, a clear icon is displayed to clear the value.
     * @group Props
     */
    readonly showClear = input<boolean, unknown>(false, { transform: booleanAttribute });

    /**
     * When present, it specifies that the component should automatically get focus on load.
     * @group Props
     */
    readonly autofocus = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    /**
     * Label to display when there are no selections.
     * @group Props
     */
    readonly placeholder = input<string>();

    /**
     * An array of objects to display as the available options.
     * @group Props
     */
    readonly options = input<any[]>();

    /**
     * When specified, filter displays with this value.
     * @group Props
     */
    readonly filterValue = input<string | undefined | null>();

    /**
     * Whether all data is selected.
     * @group Props
     */
    readonly selectAll = input<boolean | undefined | null>(null);

    /**
     * Indicates whether to focus on options when hovering over them, defaults to optionLabel.
     * @group Props
     */
    readonly focusOnHover = input<boolean, unknown>(true, { transform: booleanAttribute });

    /**
     * Fields used when filtering the options, defaults to optionLabel.
     * @group Props
     */
    readonly filterFields = input<any[]>();

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
     * Whether the selected option will be add highlight class.
     * @group Props
     */
    readonly highlightOnSelect = input<boolean, unknown>(true, { transform: booleanAttribute });

    /**
     * Specifies the size of the component.
     * @defaultValue undefined
     * @group Props
     */
    size = input<'large' | 'small' | undefined>();

    /**
     * Specifies the input variant of the component.
     * @defaultValue undefined
     * @group Props
     */
    variant = input<'filled' | 'outlined' | undefined>();

    /**
     * Spans 100% width of the container when enabled.
     * @defaultValue undefined
     * @group Props
     */
    fluid = input(undefined, { transform: booleanAttribute });

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
     * Callback to invoke when value changes.
     * @param {MultiSelectChangeEvent} event - Custom change event.
     * @group Emits
     */
    readonly onChange = output<MultiSelectChangeEvent>();

    /**
     * Callback to invoke when data is filtered.
     * @param {MultiSelectFilterEvent} event - Custom filter event.
     * @group Emits
     */
    readonly onFilter = output<MultiSelectFilterEvent>();

    /**
     * Callback to invoke when multiselect receives focus.
     * @param {MultiSelectFocusEvent} event - Custom focus event.
     * @group Emits
     */
    readonly onFocus = output<MultiSelectFocusEvent>();

    /**
     * Callback to invoke when multiselect loses focus.
     * @param {MultiSelectBlurEvent} event - Custom blur event.
     * @group Emits
     */
    readonly onBlur = output<MultiSelectBlurEvent>();

    /**
     * Callback to invoke when component is clicked.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    readonly onClick = output<Event>();

    /**
     * Callback to invoke when input field is cleared.
     * @group Emits
     */
    readonly onClear = output<void>();

    /**
     * Callback to invoke when overlay panel becomes visible.
     * @param {AnimationEvent} event - Animation event.
     * @group Emits
     */
    readonly onPanelShow = output<AnimationEvent>();

    /**
     * Callback to invoke when overlay panel becomes hidden.
     * @param {AnimationEvent} event - Animation event.
     * @group Emits
     */
    readonly onPanelHide = output<AnimationEvent>();

    /**
     * Callback to invoke in lazy mode to load new data.
     * @param {MultiSelectLazyLoadEvent} event - Lazy load event.
     * @group Emits
     */
    readonly onLazyLoad = output<MultiSelectLazyLoadEvent>();

    /**
     * Callback to invoke in lazy mode to load new data.
     * @param {MultiSelectRemoveEvent} event - Remove event.
     * @group Emits
     */
    readonly onRemove = output<MultiSelectRemoveEvent>();

    /**
     * Callback to invoke when all data is selected.
     * @param {MultiSelectSelectAllChangeEvent} event - Custom select event.
     * @group Emits
     */
    readonly onSelectAllChange = output<MultiSelectSelectAllChangeEvent>();

    readonly overlayViewChild = viewChild.required<Overlay>('overlay');

    readonly filterInputChild = viewChild<Nullable<ElementRef>>('filterInput');

    readonly focusInputViewChild = viewChild.required<ElementRef>('focusInput');

    readonly itemsViewChild = viewChild<Nullable<ElementRef>>('items');

    readonly scroller = viewChild<Nullable<Scroller>>('scroller');

    readonly lastHiddenFocusableElementOnOverlay = viewChild<Nullable<ElementRef>>('lastHiddenFocusableEl');

    readonly firstHiddenFocusableElementOnOverlay = viewChild<Nullable<ElementRef>>('firstHiddenFocusableEl');

    readonly headerCheckboxViewChild = viewChild<Nullable<Checkbox>>('headerCheckbox');

    readonly footerFacet = contentChild(Footer);

    /**
     * Custom item template.
     * @group Templates
     */
    readonly itemTemplate = contentChild<TemplateRef<MultiSelectItemTemplateContext>>('item', { descendants: false });

    /**
     * Custom group template.
     * @group Templates
     */
    readonly groupTemplate = contentChild<TemplateRef<MultiSelectGroupTemplateContext>>('group', { descendants: false });

    /**
     * Custom loader template.
     * @group Templates
     */
    readonly loaderTemplate = contentChild<TemplateRef<MultiSelectLoaderTemplateContext>>('loader', { descendants: false });

    /**
     * Custom header template.
     * @group Templates
     */
    readonly headerTemplate = contentChild<TemplateRef<void>>('header', { descendants: false });

    /**
     * Custom filter template.
     * @group Templates
     */
    readonly filterTemplate = contentChild<TemplateRef<MultiSelectFilterTemplateContext>>('filter', { descendants: false });

    /**
     * Custom footer template.
     * @group Templates
     */
    readonly footerTemplate = contentChild<TemplateRef<void>>('footer', { descendants: false });

    /**
     * Custom empty filter template.
     * @group Templates
     */
    readonly emptyFilterTemplate = contentChild<TemplateRef<void>>('emptyfilter', { descendants: false });

    /**
     * Custom empty template.
     * @group Templates
     */
    readonly emptyTemplate = contentChild<TemplateRef<void>>('empty', { descendants: false });

    /**
     * Custom selected items template.
     * @group Templates
     */
    readonly selectedItemsTemplate = contentChild<TemplateRef<MultiSelectSelectedItemsTemplateContext>>('selecteditems', { descendants: false });

    /**
     * Custom loading icon template.
     * @group Templates
     */
    readonly loadingIconTemplate = contentChild<TemplateRef<void>>('loadingicon', { descendants: false });

    /**
     * Custom filter icon template.
     * @group Templates
     */
    readonly filterIconTemplate = contentChild<TemplateRef<void>>('filtericon', { descendants: false });

    /**
     * Custom remove token icon template.
     * @group Templates
     */
    readonly removeTokenIconTemplate = contentChild<TemplateRef<MultiSelectChipIconTemplateContext>>('removetokenicon', { descendants: false });

    /**
     * Custom chip icon template.
     * @group Templates
     */
    readonly chipIconTemplate = contentChild<TemplateRef<MultiSelectChipIconTemplateContext>>('chipicon', { descendants: false });

    /**
     * Custom clear icon template.
     * @group Templates
     */
    readonly clearIconTemplate = contentChild<TemplateRef<void>>('clearicon', { descendants: false });

    /**
     * Custom dropdown icon template.
     * @group Templates
     */
    readonly dropdownIconTemplate = contentChild<TemplateRef<MultiSelectDropdownIconTemplateContext>>('dropdownicon', { descendants: false });

    /**
     * Custom item checkbox icon template.
     * @group Templates
     */
    readonly itemCheckboxIconTemplate = contentChild<TemplateRef<MultiSelectItemCheckboxIconTemplateContext>>('itemcheckboxicon', { descendants: false });

    /**
     * Custom header checkbox icon template.
     * @group Templates
     */
    readonly headerCheckboxIconTemplate = contentChild<TemplateRef<MultiSelectHeaderCheckboxIconTemplateContext>>('headercheckboxicon', { descendants: false });

    readonly templates = contentChildren(PrimeTemplate);

    componentName = 'MultiSelect';

    readonly $id = computed(() => this.id() || uuid('pn_id_'));

    readonly $overlayVisible = linkedSignal(() => this.overlayVisible());

    searchValue: Nullable<string>;

    searchTimeout: any;

    readonly _placeholder = linkedSignal(() => this.placeholder());

    readonly _disableTooltip = signal<boolean>(false);

    value: any[];

    public filtered: boolean | undefined;

    /**
     * Legacy `pTemplate` types with a dedicated slot. Any other `pTemplate` falls back to the
     * item template, matching the legacy `ngAfterContentInit` default case.
     */
    private static readonly KNOWN_PTEMPLATE_TYPES = [
        'item',
        'group',
        'selectedItems',
        'selecteditems',
        'header',
        'filter',
        'emptyfilter',
        'empty',
        'footer',
        'loader',
        'headercheckboxicon',
        'loadingicon',
        'filtericon',
        'removetokenicon',
        'clearicon',
        'dropdownicon',
        'itemcheckboxicon',
        'chipicon'
    ];

    readonly $itemTemplate = computed(
        () =>
            this.itemTemplate() ??
            this.templates()
                .filter((item) => item.getType() === 'item' || !MultiSelect.KNOWN_PTEMPLATE_TYPES.includes(item.getType()))
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

    readonly $selectedItemsTemplate = computed(
        () =>
            this.selectedItemsTemplate() ??
            this.templates()
                .filter((item) => item.getType() === 'selectedItems' || item.getType() === 'selecteditems')
                .at(-1)?.template
    );

    readonly $loadingIconTemplate = computed(
        () =>
            this.loadingIconTemplate() ??
            this.templates()
                .filter((item) => item.getType() === 'loadingicon')
                .at(-1)?.template
    );

    readonly $filterIconTemplate = computed(
        () =>
            this.filterIconTemplate() ??
            this.templates()
                .filter((item) => item.getType() === 'filtericon')
                .at(-1)?.template
    );

    readonly $removeTokenIconTemplate = computed(
        () =>
            this.removeTokenIconTemplate() ??
            this.templates()
                .filter((item) => item.getType() === 'removetokenicon')
                .at(-1)?.template
    );

    readonly $chipIconTemplate = computed(
        () =>
            this.chipIconTemplate() ??
            this.templates()
                .filter((item) => item.getType() === 'chipicon')
                .at(-1)?.template
    );

    readonly $clearIconTemplate = computed(
        () =>
            this.clearIconTemplate() ??
            this.templates()
                .filter((item) => item.getType() === 'clearicon')
                .at(-1)?.template
    );

    readonly $dropdownIconTemplate = computed(
        () =>
            this.dropdownIconTemplate() ??
            this.templates()
                .filter((item) => item.getType() === 'dropdownicon')
                .at(-1)?.template
    );

    readonly $itemCheckboxIconTemplate = computed(
        () =>
            this.itemCheckboxIconTemplate() ??
            this.templates()
                .filter((item) => item.getType() === 'itemcheckboxicon')
                .at(-1)?.template
    );

    readonly $headerCheckboxIconTemplate = computed(
        () =>
            this.headerCheckboxIconTemplate() ??
            this.templates()
                .filter((item) => item.getType() === 'headercheckboxicon')
                .at(-1)?.template
    );

    $variant = computed(() => this.variant() || this.config.inputStyle() || this.config.inputVariant());

    $appendTo = computed(() => this.appendTo() || this.config.overlayAppendTo());

    readonly hasFluid = computed(() => this.fluid() ?? !!this.pcFluid);

    filterOptions: MultiSelectFilterOptions | undefined;

    preventModelTouched: boolean | undefined;

    readonly focused = signal<boolean>(false);

    itemsWrapper: any;

    modelValue = signal<any>(null);

    readonly _filterValue = linkedSignal<any>(() => this.filterValue() ?? null);

    /**
     * Internal options state. Preserves the legacy setter's `deepEquals` guard: when a new
     * `options` binding is deep-equal to the current value, the previous array reference is kept
     * so downstream computeds do not recompute and change detection converges.
     */
    readonly _options = linkedSignal<any[] | undefined, any[]>({
        source: this.options,
        computation: (val, previous) => (previous !== undefined && deepEquals(previous.value, val) ? previous.value : val || [])
    });

    startRangeIndex = signal<number>(-1);

    focusedOptionIndex = signal<number>(-1);

    readonly selectedOptions = signal<any>(undefined);

    clickInProgress: boolean = false;

    readonly emptyMessageLabel = computed<string>(() => this.emptyMessage() || this.config.getTranslation(TranslationKeys.EMPTY_MESSAGE));

    readonly emptyFilterMessageLabel = computed<string>(() => this.emptyFilterMessage() || this.config.getTranslation(TranslationKeys.EMPTY_FILTER_MESSAGE));

    readonly isVisibleClearIcon = computed<boolean | undefined>(() => this.modelValue() != null && this.modelValue() !== '' && isNotEmpty(this.modelValue()) && this.showClear() && !this.$disabled() && !this.readonly() && this.$filled());

    get toggleAllAriaLabel() {
        return this.config.translation.aria ? this.config.translation.aria[this.allSelected() ? 'selectAll' : 'unselectAll'] : undefined;
    }

    readonly listLabel = computed<string>(() => this.config.getTranslation(TranslationKeys.ARIA)['listLabel']);

    visibleOptions = computed(() => {
        const options = this.getAllVisibleAndNonVisibleOptions();
        const isArrayOfObjects = isArray(options) && ObjectUtils.isObject(options[0]);

        if (this._filterValue()) {
            let filteredOptions;

            if (isArrayOfObjects) {
                filteredOptions = this.filterService.filter(options, this.searchFields(), this._filterValue(), this.filterMatchMode(), this.filterLocale());
            } else {
                filteredOptions = options.filter((option) => option.toString().toLocaleLowerCase().includes(this._filterValue().toLocaleLowerCase()));
            }

            if (this.group()) {
                const optionGroups = this._options() || [];
                const filtered: any[] = [];

                optionGroups.forEach((group) => {
                    const groupChildren = this.getOptionGroupChildren(group);
                    const filteredItems = groupChildren.filter((item) => filteredOptions.includes(item));

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
        let label;
        const modelValue = this.modelValue();

        if (modelValue && modelValue?.length && this.displaySelectedLabel()) {
            if (isNotEmpty(this.maxSelectedLabels()) && modelValue?.length > (this.maxSelectedLabels() || 0)) {
                return this.getSelectedItemsLabel();
            } else {
                label = '';

                for (let i = 0; i < modelValue.length; i++) {
                    if (i !== 0) {
                        label += ', ';
                    }

                    label += this.getLabelByValue(modelValue[i]);
                }
            }
        } else {
            label = this._placeholder() || '';
        }
        return label;
    });

    chipSelectedItems = computed(() => {
        return isNotEmpty(this.maxSelectedLabels()) && this.modelValue() && this.modelValue()?.length > (this.maxSelectedLabels() || 0) ? this.modelValue()?.slice(0, this.maxSelectedLabels()) : this.modelValue();
    });

    readonly ariaSetSize = computed(() => this.visibleOptions().filter((option) => !this.isOptionGroup(option)).length);

    readonly virtualScrollerDisabled = computed(() => !this.virtualScroll());

    readonly focusedOptionId = computed(() => (this.focusedOptionIndex() !== -1 ? `${this.$id()}_${this.focusedOptionIndex()}` : null));

    readonly containerDataP = computed(() =>
        this.cn({
            invalid: this.invalid(),
            disabled: this.$disabled(),
            focus: this.focused(),
            fluid: this.hasFluid(),
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
            'has-chip': this.display() === 'chip' && this.value && this.value.length && (this.maxSelectedLabels() ? this.value.length <= this.maxSelectedLabels()! : true),
            // NOTE: `!this.$filled` negates a function reference and is therefore always false —
            // legacy behavior ('empty' was never added to data-p), preserved as-is.
            empty: !this._placeholder() && !this.$filled
        })
    );

    readonly dropdownIconDataP = computed(() =>
        this.cn({
            [this.size() as string]: this.size()
        })
    );

    readonly overlayDataP = computed(() =>
        this.cn({
            // NOTE: concatenates the `appendTo` input's function reference, matching the legacy
            // behavior where the raw signal function was stringified. Preserved as-is.
            ['overlay-' + this.appendTo]: 'overlay-' + this.appendTo
        })
    );

    constructor() {
        super();
        effect(() => {
            const modelValue = this.modelValue();

            const allVisibleAndNonVisibleOptions = this.getAllVisibleAndNonVisibleOptions();
            if (allVisibleAndNonVisibleOptions && isNotEmpty(allVisibleAndNonVisibleOptions)) {
                if (this.optionValue() && this.optionLabel() && modelValue) {
                    this.selectedOptions.set(allVisibleAndNonVisibleOptions.filter((option) => modelValue.includes(option[this.optionLabel()!]) || modelValue.includes(option[this.optionValue()!])));
                } else {
                    this.selectedOptions.set(modelValue);
                }
                this.cd.markForCheck();
            }
        });

        afterNextRender(() => {
            if (this.overlayVisible()) {
                this.show();
            }
        });

        afterEveryRender(() => {
            this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
            if (this.filtered) {
                this.zone.runOutsideAngular(() => {
                    setTimeout(() => {
                        this.overlayViewChild().alignOverlay();
                    }, 1);
                });
                this.filtered = false;
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

    private getAllVisibleAndNonVisibleOptions() {
        return this.group() ? this.flatOptions(this._options()) : this._options() || [];
    }

    maxSelectionLimitReached() {
        return this.selectionLimit() && this.modelValue() && this.modelValue().length === this.selectionLimit();
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
            const value = this.getOptionValue(this.visibleOptions()[this.focusedOptionIndex()]);
            this.onOptionSelect({ originalEvent: null, option: [value] });
        }
    }

    /**
     * Updates the model value.
     * @group Method
     */
    public updateModel(value, event?) {
        this.value = value;
        this.onModelChange(value);
        this.writeValue(value);
    }

    onInputClick(event) {
        event.stopPropagation();
        event.preventDefault();
        this.focusedOptionIndex.set(-1);
    }

    onOptionSelect(event, isFocus = false, index = -1) {
        const { originalEvent, option } = event;
        if (this.$disabled() || this.isOptionDisabled(option)) {
            return;
        }

        let selected = this.isSelected(option);
        let value: any[] = [];

        if (selected) {
            value = this.modelValue().filter((val) => !equals(val, this.getOptionValue(option), this.equalityKey() || ''));
        } else {
            value = [...(this.modelValue() || []), this.getOptionValue(option)];
        }

        this.updateModel(value, originalEvent);
        index !== -1 && this.focusedOptionIndex.set(index);

        isFocus && focus(this.focusInputViewChild().nativeElement);

        this.onChange.emit({
            originalEvent: event,
            value: value,
            itemValue: option
        });
    }

    findSelectedOptionIndex() {
        return this.hasSelectedOption() ? this.visibleOptions().findIndex((option) => this.isValidSelectedOption(option)) : -1;
    }

    onOptionSelectRange(event, start = -1, end = -1) {
        start === -1 && (start = this.findNearestSelectedOptionIndex(end, true));
        end === -1 && (end = this.findNearestSelectedOptionIndex(start));

        if (start !== -1 && end !== -1) {
            const rangeStart = Math.min(start, end);
            const rangeEnd = Math.max(start, end);
            const value = this.visibleOptions()
                .slice(rangeStart, rangeEnd + 1)
                .filter((option) => this.isValidOption(option))
                .map((option) => this.getOptionValue(option));

            this.updateModel(value, event);
        }
    }

    searchFields() {
        return (this.filterBy() || this.optionLabel() || 'label').split(',');
    }

    findNearestSelectedOptionIndex(index, firstCheckUp = false) {
        let matchedOptionIndex = -1;

        if (this.hasSelectedOption()) {
            if (firstCheckUp) {
                matchedOptionIndex = this.findPrevSelectedOptionIndex(index);
                matchedOptionIndex = matchedOptionIndex === -1 ? this.findNextSelectedOptionIndex(index) : matchedOptionIndex;
            } else {
                matchedOptionIndex = this.findNextSelectedOptionIndex(index);
                matchedOptionIndex = matchedOptionIndex === -1 ? this.findPrevSelectedOptionIndex(index) : matchedOptionIndex;
            }
        }

        return matchedOptionIndex > -1 ? matchedOptionIndex : index;
    }

    findPrevSelectedOptionIndex(index) {
        const matchedOptionIndex = this.hasSelectedOption() && index > 0 ? findLastIndex(this.visibleOptions().slice(0, index), (option) => this.isValidSelectedOption(option)) : -1;

        return matchedOptionIndex > -1 ? matchedOptionIndex : -1;
    }

    findFirstFocusedOptionIndex() {
        const selectedIndex = this.findFirstSelectedOptionIndex();

        return selectedIndex < 0 ? this.findFirstOptionIndex() : selectedIndex;
    }

    findFirstOptionIndex() {
        return this.visibleOptions().findIndex((option) => this.isValidOption(option));
    }

    findFirstSelectedOptionIndex() {
        return this.hasSelectedOption() ? this.visibleOptions().findIndex((option) => this.isValidSelectedOption(option)) : -1;
    }

    findNextSelectedOptionIndex(index) {
        const matchedOptionIndex =
            this.hasSelectedOption() && index < this.visibleOptions().length - 1
                ? this.visibleOptions()
                      .slice(index + 1)
                      .findIndex((option) => this.isValidSelectedOption(option))
                : -1;

        return matchedOptionIndex > -1 ? matchedOptionIndex + index + 1 : -1;
    }

    equalityKey() {
        return this.optionValue() ? null : this.dataKey();
    }

    hasSelectedOption() {
        return isNotEmpty(this.modelValue());
    }

    isValidSelectedOption(option) {
        return this.isValidOption(option) && this.isSelected(option);
    }

    isOptionGroup(option) {
        return option && (this.group() || this.optionGroupLabel()) && option.optionGroup && option.group;
    }

    isValidOption(option) {
        return option && !(this.isOptionDisabled(option) || this.isOptionGroup(option));
    }

    isOptionDisabled(option: any) {
        if (this.maxSelectionLimitReached() && !this.isSelected(option)) {
            return true;
        }
        return this.optionDisabled() ? resolveFieldData(option, this.optionDisabled()) : option && option.disabled !== undefined ? option.disabled : false;
    }

    isSelected(option) {
        const optionValue = this.getOptionValue(option);
        return (this.modelValue() || []).some((value) => equals(value, optionValue, this.equalityKey() || ''));
    }

    isOptionMatched(option) {
        return this.isValidOption(option) && this.getOptionLabel(option).toString().toLocaleLowerCase(this.filterLocale()).startsWith(this.searchValue?.toLocaleLowerCase(this.filterLocale()));
    }

    isEmpty() {
        return !this._options() || (this.visibleOptions() && this.visibleOptions().length === 0);
    }

    getOptionIndex(index, scrollerOptions) {
        return this.virtualScrollerDisabled() ? index : scrollerOptions && scrollerOptions.getItemOptions(index)['index'];
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

    getLabelByValue(value) {
        const options = this.group() ? this.flatOptions(this._options()) : this._options() || [];
        const matchedOption = options.find((option) => !this.isOptionGroup(option) && equals(this.getOptionValue(option), value, this.equalityKey() || ''));
        return matchedOption ? this.getOptionLabel(matchedOption) : null;
    }

    getSelectedItemsLabel() {
        let pattern = /{(.*?)}/;
        let message = this.selectedItemsLabel() ? this.selectedItemsLabel() : this.config.getTranslation(TranslationKeys.SELECTION_MESSAGE);

        if (pattern.test(message)) {
            return message.replace(message.match(pattern)[0], this.modelValue().length + '');
        }

        return message;
    }

    getOptionLabel(option: any) {
        return this.optionLabel() ? resolveFieldData(option, this.optionLabel()) : option && option.label != undefined ? option.label : option;
    }

    getOptionValue(option: any) {
        return this.optionValue() ? resolveFieldData(option, this.optionValue()) : !this.optionLabel() && option && option.value !== undefined ? option.value : option;
    }

    getOptionGroupLabel(optionGroup: any) {
        return this.optionGroupLabel() ? resolveFieldData(optionGroup, this.optionGroupLabel()) : optionGroup && optionGroup.label != undefined ? optionGroup.label : optionGroup;
    }

    getOptionGroupChildren(optionGroup: any) {
        return optionGroup ? (this.optionGroupChildren() ? resolveFieldData(optionGroup, this.optionGroupChildren()) : optionGroup.items) : [];
    }

    onKeyDown(event: KeyboardEvent) {
        if (this.$disabled()) {
            event.preventDefault();
            return;
        }

        const metaKey = event.metaKey || event.ctrlKey;

        switch (event.code) {
            case 'ArrowDown':
                this.onArrowDownKey(event);
                break;

            case 'ArrowUp':
                this.onArrowUpKey(event);
                break;

            case 'Home':
                this.onHomeKey(event);
                break;

            case 'End':
                this.onEndKey(event);
                break;

            case 'PageDown':
                this.onPageDownKey(event);
                break;

            case 'PageUp':
                this.onPageUpKey(event);
                break;

            case 'Enter':
            case 'Space':
                this.onEnterKey(event);
                break;

            case 'Escape':
                this.onEscapeKey(event);
                break;

            case 'Tab':
                this.onTabKey(event);
                break;

            case 'ShiftLeft':
            case 'ShiftRight':
                this.onShiftKey();
                break;

            default:
                if (event.code === 'KeyA' && metaKey) {
                    const value = this.visibleOptions()
                        .filter((option) => this.isValidOption(option))
                        .map((option) => this.getOptionValue(option));

                    this.updateModel(value, event);

                    event.preventDefault();
                    break;
                }

                if (!metaKey && isPrintableCharacter(event.key)) {
                    !this.$overlayVisible() && this.show();
                    this.searchOptions(event, event.key);
                    event.preventDefault();
                }

                break;
        }
    }

    onFilterKeyDown(event: KeyboardEvent) {
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
                this.onEnterKey(event);
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

    onArrowLeftKey(event: KeyboardEvent, pressedInInputText: boolean = false) {
        pressedInInputText && this.focusedOptionIndex.set(-1);
    }

    onArrowDownKey(event) {
        const optionIndex = this.focusedOptionIndex() !== -1 ? this.findNextOptionIndex(this.focusedOptionIndex()) : this.findFirstFocusedOptionIndex();

        if (event.shiftKey) {
            this.onOptionSelectRange(event, this.startRangeIndex(), optionIndex);
        }

        this.changeFocusedOptionIndex(event, optionIndex);
        !this.$overlayVisible() && this.show();
        event.preventDefault();
        event.stopPropagation();
    }

    onArrowUpKey(event, pressedInInputText = false) {
        if (event.altKey && !pressedInInputText) {
            if (this.focusedOptionIndex() !== -1) {
                this.onOptionSelect(event, this.visibleOptions()[this.focusedOptionIndex()]);
            }

            this.$overlayVisible() && this.hide();
            event.preventDefault();
        } else {
            const optionIndex = this.focusedOptionIndex() !== -1 ? this.findPrevOptionIndex(this.focusedOptionIndex()) : this.findLastFocusedOptionIndex();

            if (event.shiftKey) {
                this.onOptionSelectRange(event, optionIndex, this.startRangeIndex());
            }

            this.changeFocusedOptionIndex(event, optionIndex);

            !this.$overlayVisible() && this.show();
            event.preventDefault();
        }
        event.stopPropagation();
    }

    onHomeKey(event, pressedInInputText = false) {
        const { currentTarget } = event;

        if (pressedInInputText) {
            const len = currentTarget.value.length;

            currentTarget.setSelectionRange(0, event.shiftKey ? len : 0);
            this.focusedOptionIndex.set(-1);
        } else {
            let metaKey = event.metaKey || event.ctrlKey;
            let optionIndex = this.findFirstOptionIndex();

            if (event.shiftKey && metaKey) {
                this.onOptionSelectRange(event, optionIndex, this.startRangeIndex());
            }

            this.changeFocusedOptionIndex(event, optionIndex);

            !this.$overlayVisible() && this.show();
        }

        event.preventDefault();
    }

    onEndKey(event, pressedInInputText = false) {
        const { currentTarget } = event;

        if (pressedInInputText) {
            const len = currentTarget.value.length;
            currentTarget.setSelectionRange(event.shiftKey ? 0 : len, len);
            this.focusedOptionIndex.set(-1);
        } else {
            let metaKey = event.metaKey || event.ctrlKey;
            let optionIndex = this.findLastFocusedOptionIndex();

            if (event.shiftKey && metaKey) {
                this.onOptionSelectRange(event, this.startRangeIndex(), optionIndex);
            }

            this.changeFocusedOptionIndex(event, optionIndex);

            !this.$overlayVisible() && this.show();
        }

        event.preventDefault();
    }

    onPageDownKey(event) {
        this.scrollInView(this.visibleOptions().length - 1);
        event.preventDefault();
    }

    onPageUpKey(event) {
        this.scrollInView(0);
        event.preventDefault();
    }

    onEnterKey(event) {
        if (!this.$overlayVisible()) {
            this.onArrowDownKey(event);
        } else {
            if (this.focusedOptionIndex() !== -1) {
                if (event.shiftKey) {
                    this.onOptionSelectRange(event, this.focusedOptionIndex());
                } else {
                    this.onOptionSelect({ originalEvent: event, option: this.visibleOptions()[this.focusedOptionIndex()] });
                }
            }
        }

        event.preventDefault();
    }

    onEscapeKey(event: KeyboardEvent) {
        if (this.$overlayVisible()) {
            this.hide(true);
            event.stopPropagation();
            event.preventDefault();
        }
    }

    onTabKey(event: KeyboardEvent, pressedInInputText = false) {
        if (!pressedInInputText) {
            if (this.$overlayVisible() && this.hasFocusableElements()) {
                focus(event.shiftKey ? this.lastHiddenFocusableElementOnOverlay()?.nativeElement : this.firstHiddenFocusableElementOnOverlay()?.nativeElement);

                event.preventDefault();
            } else {
                this.$overlayVisible() && this.hide(this.filter());
            }
        }
    }

    onShiftKey() {
        this.startRangeIndex.set(this.focusedOptionIndex());
    }

    onContainerClick(event: any) {
        const focusInputViewChild = this.focusInputViewChild();
        if (this.$disabled() || this.loading() || this.readonly() || event.target?.isSameNode?.(focusInputViewChild.nativeElement)) {
            return;
        }

        const overlayViewChild = this.overlayViewChild();
        if (!overlayViewChild.el.nativeElement.contains(event.target)) {
            if (this.clickInProgress) {
                return;
            }

            this.clickInProgress = true;

            setTimeout(() => {
                this.clickInProgress = false;
            }, 150);

            this.$overlayVisible() ? this.hide(true) : this.show(true);
        }
        focusInputViewChild.nativeElement.focus({ preventScroll: true });
        this.onClick.emit(event);
        this.cd.detectChanges();
    }

    onFirstHiddenFocus(event) {
        const focusInputViewChild = this.focusInputViewChild();
        const focusableEl = event.relatedTarget === focusInputViewChild.nativeElement ? getFirstFocusableElement(this.overlayViewChild().overlayViewChild()?.nativeElement, ':not([data-p-hidden-focusable="true"])') : focusInputViewChild.nativeElement;

        focus(focusableEl);
    }

    onInputFocus(event: Event) {
        this.focused.set(true);
        const focusedOptionIndex = this.focusedOptionIndex() !== -1 ? this.focusedOptionIndex() : this.$overlayVisible() && this.autoOptionFocus() ? this.findFirstFocusedOptionIndex() : -1;
        this.focusedOptionIndex.set(focusedOptionIndex);
        this.$overlayVisible() && this.scrollInView(this.focusedOptionIndex());
        this.onFocus.emit({ originalEvent: event });
    }

    onInputBlur(event: Event) {
        this.focused.set(false);
        this.onBlur.emit({ originalEvent: event });

        if (!this.preventModelTouched) {
            this.onModelTouched();
        }
        this.preventModelTouched = false;
    }

    onFilterInputChange(event: Event) {
        let value: string = (event.target as HTMLInputElement).value;
        this._filterValue.set(value);
        this.focusedOptionIndex.set(-1);
        this.onFilter.emit({ originalEvent: event, filter: this._filterValue() });

        !this.virtualScrollerDisabled() && this.scroller()?.scrollToIndex(0);
        setTimeout(() => {
            this.overlayViewChild().alignOverlay();
        });
    }

    onLastHiddenFocus(event) {
        const focusInputViewChild = this.focusInputViewChild();
        const focusableEl = event.relatedTarget === focusInputViewChild.nativeElement ? getLastFocusableElement(this.overlayViewChild().overlayViewChild()?.nativeElement, ':not([data-p-hidden-focusable="true"])') : focusInputViewChild.nativeElement;

        focus(focusableEl);
    }

    onOptionMouseEnter(event, index) {
        if (this.focusOnHover()) {
            this.changeFocusedOptionIndex(event, index);
        }
    }

    onFilterBlur(event) {
        this.focusedOptionIndex.set(-1);
    }

    onToggleAll(event) {
        if (this.$disabled() || this.readonly()) {
            return;
        }

        if (this.selectAll() != null) {
            this.onSelectAllChange.emit({
                originalEvent: event,
                checked: !this.allSelected()
            });
        } else {
            // pre-selected disabled options should always be selected.
            const selectedDisabledOptions = this.getAllVisibleAndNonVisibleOptions().filter(
                (option) => this.isSelected(option) && (this.optionDisabled() ? resolveFieldData(option, this.optionDisabled()) : option && option.disabled !== undefined ? option.disabled : false)
            );

            const visibleOptions = this.allSelected()
                ? this.visibleOptions().filter((option) => !this.isValidOption(option) && this.isSelected(option))
                : this.visibleOptions().filter((option) => this.isSelected(option) || this.isValidOption(option));

            const selectedOptionsBeforeSearch = this.filter() && !this.allSelected() ? this.getAllVisibleAndNonVisibleOptions().filter((option) => this.isSelected(option) && this.isValidOption(option)) : [];

            const optionValues = [...selectedOptionsBeforeSearch, ...selectedDisabledOptions, ...visibleOptions].map((option) => this.getOptionValue(option));
            const value = [...new Set(optionValues)];

            this.updateModel(value, event);

            // because onToggleAll could have been called during filtering, this additional test needs to be performed before calling onSelectAllChange.emit
            if (!value.length || value.length === this.getAllVisibleAndNonVisibleOptions().length) {
                this.onSelectAllChange.emit({
                    originalEvent: event,
                    checked: !!value.length
                });
            }
        }

        if (this.partialSelected()) {
            this.selectedOptions.set([]);
            this.cd.markForCheck();
        }

        this.onChange.emit({ originalEvent: event, value: this.value });
        DomHandler.focus(this.headerCheckboxViewChild()?.inputViewChild()?.nativeElement);

        event.originalEvent.preventDefault();
        event.originalEvent.stopPropagation();
    }

    changeFocusedOptionIndex(event, index) {
        if (this.focusedOptionIndex() !== index) {
            this.focusedOptionIndex.set(index);
            this.scrollInView();
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

    allSelected() {
        return this.selectAll() !== null ? this.selectAll() : isNotEmpty(this.visibleOptions()) && this.visibleOptions().every((option) => this.isOptionGroup(option) || this.isOptionDisabled(option) || this.isSelected(option));
    }

    partialSelected() {
        const selectedOptions = this.selectedOptions();
        return selectedOptions && selectedOptions.length > 0 && selectedOptions.length < (this._options()?.length || 0);
    }

    /**
     * Displays the panel.
     * @group Method
     */
    public show(isFocus?) {
        this.$overlayVisible.set(true);

        const focusedOptionIndex = this.focusedOptionIndex() !== -1 ? this.focusedOptionIndex() : this.autoOptionFocus() ? this.findFirstFocusedOptionIndex() : this.findSelectedOptionIndex();
        this.focusedOptionIndex.set(focusedOptionIndex);

        if (isFocus) {
            focus(this.focusInputViewChild().nativeElement);
        }

        this.cd.markForCheck();
    }

    /**
     * Hides the panel.
     * @group Method
     */
    public hide(isFocus?) {
        this.$overlayVisible.set(false);
        this.focusedOptionIndex.set(-1);

        if (this.filter() && this.resetFilterOnHide()) {
            this.resetFilter();
        }
        if (this.overlayOptions()?.mode === 'modal') {
            unblockBodyScroll();
        }

        isFocus && focus(this.focusInputViewChild().nativeElement);
        this.cd.markForCheck();
    }

    onOverlayBeforeEnter(event: any) {
        this.itemsWrapper = <any>findSingle(this.overlayViewChild().overlayViewChild()?.nativeElement, this.virtualScroll() ? '[data-pc-name="virtualscroller"]' : '[data-pc-section="listcontainer"]');
        this.virtualScroll() && this.scroller()?.setContentEl(this.itemsViewChild()?.nativeElement);

        if (this.options && this.options.length) {
            if (this.virtualScroll()) {
                const selectedIndex = this.modelValue() ? this.focusedOptionIndex() : -1;
                if (selectedIndex !== -1) {
                    this.scroller()?.scrollToIndex(selectedIndex);
                }
            } else {
                let selectedListItem = findSingle(this.itemsWrapper, '[data-pc-section="option"][data-p-selected="true"]');

                if (selectedListItem) {
                    selectedListItem.scrollIntoView({ block: 'nearest', inline: 'nearest' });
                }
            }
        }

        const filterInputChild = this.filterInputChild();
        if (filterInputChild && filterInputChild.nativeElement) {
            this.preventModelTouched = true;

            if (this.autofocusFilter()) {
                filterInputChild.nativeElement.focus();
            }
        }

        this.onPanelShow.emit(event);
    }

    onOverlayAfterLeave(event: any) {
        this.itemsWrapper = null;
        this.onModelTouched();
        this.onPanelHide.emit(event);
    }

    resetFilter() {
        const filterInputChild = this.filterInputChild();
        if (filterInputChild && filterInputChild.nativeElement) {
            filterInputChild.nativeElement.value = '';
        }

        this._filterValue.set(null);
    }

    onOverlayHide(event: any) {
        // Called when overlay completes its hide animation
        // Don't call hide() again to avoid recursive calls
        this.focusedOptionIndex.set(-1);
        if (this.filter() && this.resetFilterOnHide()) {
            this.resetFilter();
        }
    }

    close(event: Event) {
        this.hide();
        event.preventDefault();
        event.stopPropagation();
    }

    clear(event: Event) {
        this.value = [];
        this.updateModel(null, event);
        this.selectedOptions.set([]);
        this.onClear.emit();
        this._disableTooltip.set(true);

        event.stopPropagation();
    }

    labelContainerMouseLeave() {
        if (this._disableTooltip()) this._disableTooltip.set(false);
    }

    removeOption(optionValue, event) {
        let value = this.modelValue().filter((val) => !equals(val, optionValue, this.equalityKey() || ''));

        this.updateModel(value, event);
        this.onChange.emit({
            originalEvent: event,
            value: value,
            itemValue: optionValue
        });
        this.onRemove.emit({
            newValue: value,
            removed: optionValue
        });

        event && event.stopPropagation();
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

    findLastSelectedOptionIndex() {
        return this.hasSelectedOption() ? findLastIndex(this.visibleOptions(), (option) => this.isValidSelectedOption(option)) : -1;
    }

    findLastFocusedOptionIndex() {
        const selectedIndex = this.findLastSelectedOptionIndex();

        return selectedIndex < 0 ? this.findLastOptionIndex() : selectedIndex;
    }

    findLastOptionIndex() {
        return findLastIndex(this.visibleOptions(), (option) => this.isValidOption(option));
    }

    searchOptions(event, char) {
        this.searchValue = (this.searchValue || '') + char;

        let optionIndex = -1;
        let matched = false;

        if (this.focusedOptionIndex() !== -1) {
            optionIndex = this.visibleOptions()
                .slice(this.focusedOptionIndex())
                .findIndex((option) => this.isOptionMatched(option));
            optionIndex =
                optionIndex === -1
                    ? this.visibleOptions()
                          .slice(0, this.focusedOptionIndex())
                          .findIndex((option) => this.isOptionMatched(option))
                    : optionIndex + this.focusedOptionIndex();
        } else {
            optionIndex = this.visibleOptions().findIndex((option) => this.isOptionMatched(option));
        }

        if (optionIndex !== -1) {
            matched = true;
        }

        if (optionIndex === -1 && this.focusedOptionIndex() === -1) {
            optionIndex = this.findFirstFocusedOptionIndex();
        }

        if (optionIndex !== -1) {
            this.changeFocusedOptionIndex(event, optionIndex);
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

    hasFocusableElements() {
        return getFocusableElements(this.overlayViewChild().overlayViewChild()?.nativeElement, ':not([data-p-hidden-focusable="true"])').length > 0;
    }

    hasFilter() {
        return this._filterValue() && this._filterValue().trim().length > 0;
    }

    /**
     * @override
     *
     * @see {@link BaseEditableHolder.writeControlValue}
     * Writes the value to the control.
     */
    writeControlValue(value: any, setModelValue: (value: any) => void): void {
        this.value = value;
        setModelValue(value);
        this.cd.markForCheck();
    }

    getHeaderCheckboxPTOptions(key: string) {
        return this.ptm(key, {
            context: {
                selected: this.allSelected()
            }
        });
    }

    getPTOptions(option, itemOptions, index, key) {
        return this.ptm(key, {
            context: {
                selected: this.isSelected(option),
                focused: this.focusedOptionIndex() === this.getOptionIndex(index, itemOptions),
                disabled: this.isOptionDisabled(option)
            }
        });
    }
}

@NgModule({
    imports: [MultiSelect, SharedModule],
    exports: [MultiSelect, SharedModule]
})
export class MultiSelectModule {}
