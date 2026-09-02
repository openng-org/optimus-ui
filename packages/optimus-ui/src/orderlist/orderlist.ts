import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonModule, isPlatformBrowser } from '@angular/common';
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
    linkedSignal,
    NgModule,
    numberAttribute,
    TemplateRef,
    untracked,
    ViewEncapsulation,
    viewChild,
    contentChild,
    contentChildren,
    output
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { findIndexInList, setAttribute, uuid } from '@openng/optimus-ui-utils';
import { FilterService, PrimeTemplate, SharedModule } from '@openng/optimus-ui/api';
import { BaseComponent, PARENT_INSTANCE } from '@openng/optimus-ui/basecomponent';
import { Bind } from '@openng/optimus-ui/bind';
import { ButtonModule, ButtonProps } from '@openng/optimus-ui/button';
import { AngleDoubleDownIcon, AngleDoubleUpIcon, AngleDownIcon, AngleUpIcon } from '@openng/optimus-ui/icons';
import { Listbox, ListboxChangeEvent } from '@openng/optimus-ui/listbox';
import { Ripple } from '@openng/optimus-ui/ripple';
import { Nullable } from '@openng/optimus-ui/ts-helpers';
import { OrderListFilterEvent, OrderListFilterOptions, OrderListFilterTemplateContext, OrderListItemTemplateContext, OrderListPassThrough, OrderListSelectionChangeEvent } from '@openng/optimus-ui/types/orderlist';
import { OrderListStyle } from './style/orderliststyle';

/**
 * OrderList is used to manage the order of a collection.
 * @group Components
 */
@Component({
    selector: 'p-orderList, p-orderlist, p-order-list',
    standalone: true,
    imports: [CommonModule, ButtonModule, Ripple, DragDropModule, AngleDoubleDownIcon, AngleDoubleUpIcon, AngleUpIcon, AngleDownIcon, Listbox, FormsModule, SharedModule, Bind],
    template: `
        <div [pBind]="ptm('controls')" [class]="cx('controls')">
            <button [pt]="ptm('pcMoveUpButton')" type="button" [disabled]="moveDisabled()" pButton pRipple (click)="moveUp()" [attr.aria-label]="moveUpAriaLabel" [buttonProps]="getButtonProps('up')" hostName="orderlist" [unstyled]="unstyled()">
                @if (!$moveUpIconTemplate()) {
                    <svg data-p-icon="angle-up" pButtonIcon [pt]="ptm('pcMoveUpButton')['icon']" />
                }
                <ng-template *ngTemplateOutlet="$moveUpIconTemplate()"></ng-template>
            </button>
            <button [pt]="ptm('pcMoveTopButton')" type="button" [disabled]="moveDisabled()" pButton pRipple (click)="moveTop()" [attr.aria-label]="moveTopAriaLabel" [buttonProps]="getButtonProps('top')" hostName="orderlist" [unstyled]="unstyled()">
                @if (!$moveTopIconTemplate()) {
                    <svg data-p-icon="angle-double-up" pButtonIcon [pt]="ptm('pcMoveTopButton')['icon']" />
                }
                <ng-template *ngTemplateOutlet="$moveTopIconTemplate()"></ng-template>
            </button>
            <button
                [pt]="ptm('pcMoveDownButton')"
                type="button"
                [disabled]="moveDisabled()"
                pButton
                pRipple
                (click)="moveDown()"
                [attr.aria-label]="moveDownAriaLabel"
                [buttonProps]="getButtonProps('down')"
                hostName="orderlist"
                [unstyled]="unstyled()"
            >
                @if (!$moveDownIconTemplate()) {
                    <svg data-p-icon="angle-down" pButtonIcon [pt]="ptm('pcMoveDownButton')['icon']" />
                }
                <ng-template *ngTemplateOutlet="$moveDownIconTemplate()"></ng-template>
            </button>
            <button
                [pt]="ptm('pcMoveBottomButton')"
                type="button"
                [disabled]="moveDisabled()"
                pButton
                pRipple
                (click)="moveBottom()"
                [attr.aria-label]="moveBottomAriaLabel"
                [buttonProps]="getButtonProps('bottom')"
                hostName="orderlist"
                [unstyled]="unstyled()"
            >
                @if (!$moveBottomIconTemplate()) {
                    <svg data-p-icon="angle-double-down" pButtonIcon [pt]="ptm('pcMoveBottomButton')['icon']" />
                }
                <ng-template *ngTemplateOutlet="$moveBottomIconTemplate()"></ng-template>
            </button>
        </div>
        <p-listbox
            [pt]="ptm('pcListbox')"
            #listelement
            [multiple]="true"
            [options]="value()"
            [(ngModel)]="d_selection"
            [ngModelOptions]="{ standalone: true }"
            [optionLabel]="dataKey() ?? 'name'"
            [id]="id + '_list'"
            [listStyle]="listStyle()"
            [striped]="stripedRows()"
            [tabindex]="tabindex()"
            (onFocus)="onListFocus($event)"
            (onBlur)="onListBlur($event)"
            (onChange)="onChangeSelection($event)"
            [ariaLabel]="ariaLabel()"
            [disabled]="disabled()"
            [metaKeySelection]="metaKeySelection()"
            [scrollHeight]="scrollHeight()"
            [autoOptionFocus]="autoOptionFocus()"
            [filter]="filterBy()"
            [filterBy]="filterBy()"
            [filterLocale]="filterLocale()"
            [filterPlaceHolder]="filterPlaceholder()"
            [dragdrop]="dragdrop()"
            (onDrop)="onDrop($event)"
            hostName="orderlist"
            [unstyled]="unstyled()"
        >
            @if ($headerTemplate()) {
                <ng-template #header>
                    <ng-template *ngTemplateOutlet="$headerTemplate()"></ng-template>
                </ng-template>
            }
            @if ($itemTemplate()) {
                <ng-template #item let-option let-selected="selected" let-index="index">
                    <ng-template *ngTemplateOutlet="$itemTemplate(); context: { $implicit: option, selected: selected, index: index }"></ng-template>
                </ng-template>
            }
            @if ($emptyMessageTemplate()) {
                <ng-template #empty>
                    <ng-template *ngTemplateOutlet="$emptyMessageTemplate()"></ng-template>
                </ng-template>
            }
            @if ($emptyFilterMessageTemplate()) {
                <ng-template #emptyfilter>
                    <ng-template *ngTemplateOutlet="$emptyFilterMessageTemplate()"></ng-template>
                </ng-template>
            }
            @if ($filterIconTemplate()) {
                <ng-template #filtericon>
                    <ng-template *ngTemplateOutlet="$filterIconTemplate()"></ng-template>
                </ng-template>
            }
            @if ($filterTemplate()) {
                <ng-template #filter let-options="options">
                    <ng-template *ngTemplateOutlet="$filterTemplate(); context: { options: options }"></ng-template>
                </ng-template>
            }
        </p-listbox>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [OrderListStyle, { provide: PARENT_INSTANCE, useExisting: OrderList }],
    host: {
        '[class]': "cx('root')"
    },
    hostDirectives: [Bind]
})
export class OrderList extends BaseComponent<OrderListPassThrough> {
    bindDirectiveInstance = inject(Bind, { self: true });

    _componentStyle = inject(OrderListStyle);

    filterService = inject(FilterService);

    /**
     * Text for the caption.
     * @group Props
     */
    readonly header = input<string>();

    /**
     * Index of the element in tabbing order.
     * @group Props
     */
    readonly tabindex = input<number | undefined, unknown>(undefined, { transform: numberAttribute });

    /**
     * Defines a string that labels the input for accessibility.
     * @group Props
     */
    readonly ariaLabel = input<string>();

    /**
     * Specifies one or more IDs in the DOM that labels the input field.
     * @group Props
     */
    readonly ariaLabelledBy = input<string>();

    /**
     * Inline style of the list element.
     * @group Props
     */
    readonly listStyle = input<{ [klass: string]: any } | null | undefined>();

    /**
     * A boolean value that indicates whether the component should be responsive.
     * @group Props
     */
    readonly responsive = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    /**
     * When specified displays an input field to filter the items on keyup and decides which fields to search against.
     * @group Props
     */
    readonly filterBy = input<string>();

    /**
     * Placeholder of the filter input.
     * @group Props
     */
    readonly filterPlaceholder = input<string>();

    /**
     * Locale to use in filtering. The default locale is the host environment's current locale.
     * @group Props
     */
    readonly filterLocale = input<string>();

    /**
     * When true metaKey needs to be pressed to select or unselect an item and when set to false selection of each item can be toggled individually. On touch enabled devices, metaKeySelection is turned off automatically.
     * @group Props
     */
    readonly metaKeySelection = input<boolean, unknown>(false, { transform: booleanAttribute });

    /**
     * Whether to enable dragdrop based reordering.
     * @group Props
     */
    readonly dragdrop = input<boolean, unknown>(false, { transform: booleanAttribute });

    /**
     * Defines the location of the buttons with respect to the list.
     * @group Props
     */
    readonly controlsPosition = input<'left' | 'right'>('left');

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
     * Indicates the width of the screen at which the component should change its behavior.
     * @group Props
     */
    readonly breakpoint = input<string>('960px');

    /**
     * Whether to displays rows with alternating colors.
     * @group Props
     */
    readonly stripedRows = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    /**
     * When present, it specifies that the component should be disabled.
     * @group Props
     */
    readonly disabled = input<boolean, unknown>(undefined, { transform: booleanAttribute });

    /**
     * Function to optimize the dom operations by delegating to ngForTrackBy, default algorithm checks for object identity.
     * @group Props
     */
    readonly trackBy = input<Function>((index: number, item: any) => item);

    /**
     * Height of the viewport, a scrollbar is defined if height of list exceeds this value.
     * @group Props
     */
    readonly scrollHeight = input('14rem');

    /**
     * Whether to focus on the first visible or selected element.
     * @group Props
     */
    readonly autoOptionFocus = input<boolean, unknown>(true, { transform: booleanAttribute });

    /**
     * Name of the field that uniquely identifies the record in the data.
     * @group Props
     */
    readonly dataKey = input<string>();

    /**
     * A list of values that are currently selected.
     * @group Props
     */
    readonly selection = input<any[]>([]);

    /**
     * Array of values to be displayed in the component.
     * It represents the data source for the list of items.
     * @group Props
     */
    readonly value = input<any[] | undefined>();

    /**
     * Used to pass all properties of the ButtonProps to the Button component.
     * @group Props
     */
    readonly buttonProps = input<ButtonProps>({ severity: 'secondary' });

    /**
     * Used to pass all properties of the ButtonProps to the move up button inside the component.
     * @group Props
     */
    readonly moveUpButtonProps = input<ButtonProps>();

    /**
     * Used to pass all properties of the ButtonProps to the move top button inside the component.
     * @group Props
     */
    readonly moveTopButtonProps = input<ButtonProps>();

    /**
     * Used to pass all properties of the ButtonProps to the move down button inside the component.
     * @group Props
     */
    readonly moveDownButtonProps = input<ButtonProps>();

    /**
     * Used to pass all properties of the ButtonProps to the move bottom button inside the component.
     * @group Props
     */
    readonly moveBottomButtonProps = input<ButtonProps>();

    /**
     * Callback to invoke on selection change.
     * @param {*} any - selection instance.
     * @group Emits
     */
    readonly selectionChange = output<any>();

    /**
     * Callback to invoke when list is reordered.
     * @param {*} any - list instance.
     * @group Emits
     */
    readonly onReorder = output<any>();

    /**
     * Callback to invoke when selection changes.
     * @param {OrderListSelectionChangeEvent} event - Custom change event.
     * @group Emits
     */
    readonly onSelectionChange = output<OrderListSelectionChangeEvent>();

    /**
     * Callback to invoke when filtering occurs.
     * @param {OrderListFilterEvent} event - Custom filter event.
     * @group Emits
     */
    readonly onFilterEvent = output<OrderListFilterEvent>();

    /**
     * Callback to invoke when the list is focused
     * @param {Event} event - Browser event.
     * @group Emits
     */
    readonly onFocus = output<Event>();

    /**
     * Callback to invoke when the list is blurred
     * @param {Event} event - Browser event.
     * @group Emits
     */
    readonly onBlur = output<Event>();

    readonly listViewChild = viewChild.required<Listbox>('listelement');

    readonly filterViewChild = viewChild<Nullable<ElementRef>>('filter');

    /**
     * Custom item template.
     * @param {OrderListItemTemplateContext} context - item context.
     * @see {@link OrderListItemTemplateContext}
     * @group Templates
     */
    readonly itemTemplate = contentChild<TemplateRef<OrderListItemTemplateContext>>('item', { descendants: false });

    /**
     * Custom empty template.
     * @group Templates
     */
    readonly emptyMessageTemplate = contentChild<TemplateRef<void>>('empty', { descendants: false });

    /**
     * Custom empty filter template.
     * @group Templates
     */
    readonly emptyFilterMessageTemplate = contentChild<TemplateRef<void>>('emptyfilter', { descendants: false });

    /**
     * Custom filter template.
     * @param {OrderListFilterTemplateContext} context - filter context.
     * @see {@link OrderListFilterTemplateContext}
     * @group Templates
     */
    readonly filterTemplate = contentChild<TemplateRef<OrderListFilterTemplateContext>>('filter', { descendants: false });

    /**
     * Custom header template.
     * @group Templates
     */
    readonly headerTemplate = contentChild<TemplateRef<void>>('header', { descendants: false });

    /**
     * Custom move up icon template.
     * @group Templates
     */
    readonly moveUpIconTemplate = contentChild<TemplateRef<void>>('moveupicon', { descendants: false });

    /**
     * Custom move top icon template.
     * @group Templates
     */
    readonly moveTopIconTemplate = contentChild<TemplateRef<void>>('movetopicon', { descendants: false });

    /**
     * Custom move down icon template.
     * @group Templates
     */
    readonly moveDownIconTemplate = contentChild<TemplateRef<void>>('movedownicon', { descendants: false });

    /**
     * Custom move bottom icon template.
     * @group Templates
     */
    readonly moveBottomIconTemplate = contentChild<TemplateRef<void>>('movebottomicon', { descendants: false });

    /**
     * Custom filter icon template.
     * @group Templates
     */
    readonly filterIconTemplate = contentChild<TemplateRef<void>>('filtericon', { descendants: false });

    readonly templates = contentChildren(PrimeTemplate);

    componentName = 'OrderList';

    private valueEffectFirstRun = true;

    /**
     * Replays the legacy `value` setter side effect on later input changes: refresh the filtered
     * view, or resync `visibleOptions` for drag&drop. The first run is skipped — `onInit`
     * already initializes `visibleOptions` for drag&drop before the first render.
     */
    private readonly valueEffect = effect(() => {
        const val = this.value();

        if (this.valueEffectFirstRun) {
            this.valueEffectFirstRun = false;
            return;
        }

        untracked(() => {
            if (this.filterValue) {
                this.filter();
            } else if (this.dragdrop()) {
                // Initialize visibleOptions for drag&drop even when no filtering is active
                this.visibleOptions = [...(val || [])];
            }
        });
    });

    get moveUpAriaLabel() {
        return this.config.translation.aria ? this.config.translation.aria.moveUp : undefined;
    }

    get moveTopAriaLabel() {
        return this.config.translation.aria ? this.config.translation.aria.moveTop : undefined;
    }

    get moveDownAriaLabel() {
        return this.config.translation.aria ? this.config.translation.aria.moveDown : undefined;
    }

    get moveBottomAriaLabel() {
        return this.config.translation.aria ? this.config.translation.aria.moveBottom : undefined;
    }

    filterOptions: Nullable<OrderListFilterOptions>;

    /**
     * Working selection: follows the `selection` input and is overwritten by list interaction
     * (the legacy field was both an input and internally assigned — last write wins).
     */
    d_selection = linkedSignal<any[]>(() => this.selection());

    styleElement: any;

    id: string = uuid('pn_id_');

    public filterValue: Nullable<string>;

    public visibleOptions: Nullable<any[]>;

    /**
     * Effective item template: the `#item` content child or (legacy behavior) the last projected
     * pTemplate of type `item` or of an unknown type.
     */
    readonly $itemTemplate = computed(
        () =>
            this.itemTemplate() ??
            (this.templates()
                .filter((item) => !['empty', 'emptyfilter', 'filter', 'header', 'moveupicon', 'movetopicon', 'movedownicon', 'movebottomicon', 'filtericon'].includes(item.getType()))
                .at(-1)?.template as TemplateRef<OrderListItemTemplateContext> | undefined)
    );

    /** Effective empty message template: the `#empty` content child or the `pTemplate="empty"`. */
    readonly $emptyMessageTemplate = computed(
        () =>
            this.emptyMessageTemplate() ??
            this.templates()
                .filter((item) => item.getType() === 'empty')
                .at(-1)?.template
    );

    /** Effective empty filter message template: the `#emptyfilter` content child or the `pTemplate="emptyfilter"`. */
    readonly $emptyFilterMessageTemplate = computed(
        () =>
            this.emptyFilterMessageTemplate() ??
            this.templates()
                .filter((item) => item.getType() === 'emptyfilter')
                .at(-1)?.template
    );

    /** Effective filter template: the `#filter` content child or the `pTemplate="filter"`. */
    readonly $filterTemplate = computed(
        () =>
            this.filterTemplate() ??
            (this.templates()
                .filter((item) => item.getType() === 'filter')
                .at(-1)?.template as TemplateRef<OrderListFilterTemplateContext> | undefined)
    );

    /** Effective header template: the `#header` content child or the `pTemplate="header"`. */
    readonly $headerTemplate = computed(
        () =>
            this.headerTemplate() ??
            this.templates()
                .filter((item) => item.getType() === 'header')
                .at(-1)?.template
    );

    /** Effective move up icon template: the `#moveupicon` content child or the `pTemplate="moveupicon"`. */
    readonly $moveUpIconTemplate = computed(
        () =>
            this.moveUpIconTemplate() ??
            this.templates()
                .filter((item) => item.getType() === 'moveupicon')
                .at(-1)?.template
    );

    /** Effective move top icon template: the `#movetopicon` content child or the `pTemplate="movetopicon"`. */
    readonly $moveTopIconTemplate = computed(
        () =>
            this.moveTopIconTemplate() ??
            this.templates()
                .filter((item) => item.getType() === 'movetopicon')
                .at(-1)?.template
    );

    /** Effective move down icon template: the `#movedownicon` content child or the `pTemplate="movedownicon"`. */
    readonly $moveDownIconTemplate = computed(
        () =>
            this.moveDownIconTemplate() ??
            this.templates()
                .filter((item) => item.getType() === 'movedownicon')
                .at(-1)?.template
    );

    /** Effective move bottom icon template: the `#movebottomicon` content child or the `pTemplate="movebottomicon"`. */
    readonly $moveBottomIconTemplate = computed(
        () =>
            this.moveBottomIconTemplate() ??
            this.templates()
                .filter((item) => item.getType() === 'movebottomicon')
                .at(-1)?.template
    );

    /** Effective filter icon template: the `#filtericon` content child or the `pTemplate="filtericon"`. */
    readonly $filterIconTemplate = computed(
        () =>
            this.filterIconTemplate() ??
            this.templates()
                .filter((item) => item.getType() === 'filtericon')
                .at(-1)?.template
    );

    constructor() {
        super();
        // Re-apply the host/root pass-through sections after each render (replaces the former
        // ngAfterViewChecked hook).
        afterEveryRender(() => {
            this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
        });
    }

    onInit() {
        if (this.responsive()) {
            this.createStyle();
        }

        if (this.filterBy()) {
            this.filterOptions = {
                filter: (value) => this.onFilterKeyup(value),
                reset: () => this.resetFilter()
            };
        }

        // Initialize visibleOptions for drag&drop if enabled and value exists
        if (this.dragdrop() && this.value() && !this.visibleOptions) {
            this.visibleOptions = [...this.value()!];
        }
    }

    onDestroy() {
        this.destroyStyle();
    }

    getButtonProps(direction: string) {
        switch (direction) {
            case 'up':
                return { ...this.buttonProps(), ...this.moveUpButtonProps() };
            case 'top':
                return { ...this.buttonProps(), ...this.moveTopButtonProps() };
            case 'down':
                return { ...this.buttonProps(), ...this.moveDownButtonProps() };
            case 'bottom':
                return { ...this.buttonProps(), ...this.moveBottomButtonProps() };
            default:
                return this.buttonProps();
        }
    }

    onChangeSelection(e: ListboxChangeEvent) {
        this.d_selection.set(e.value);

        //binding
        this.selectionChange.emit(e.value);

        //event
        this.onSelectionChange.emit({ originalEvent: e.originalEvent, value: e.value });
    }

    onFilterKeyup(event: KeyboardEvent) {
        this.filterValue = ((<HTMLInputElement>event.target).value.trim() as any).toLocaleLowerCase(this.filterLocale());
        this.filter();

        this.onFilterEvent.emit({
            originalEvent: event,
            value: this.visibleOptions as any[]
        });
    }

    filter() {
        let searchFields: string[] = this.filterBy()!.split(',');
        this.visibleOptions = this.filterService.filter(this.value() as any[], searchFields, this.filterValue, this.filterMatchMode(), this.filterLocale());
    }

    /**
     * Callback to invoke on filter reset.
     * @group Method
     */
    public resetFilter() {
        this.filterValue = '';
        const filterViewChild = this.filterViewChild();
        filterViewChild && ((<HTMLInputElement>filterViewChild.nativeElement).value = '');
    }

    isItemVisible(item: any): boolean | undefined {
        if (this.filterValue && this.filterValue.trim().length) {
            for (let i = 0; i < (this.visibleOptions as any[]).length; i++) {
                if (item == (this.visibleOptions as any[])[i]) {
                    return true;
                }
            }
        } else {
            return true;
        }
    }

    isSelected(item: any) {
        return findIndexInList(item, this.d_selection()) !== -1;
    }

    isEmpty() {
        return this.filterValue ? !this.visibleOptions || this.visibleOptions.length === 0 : !this.value() || this.value()!.length === 0;
    }

    moveUp() {
        const value = this.value();
        if (this.d_selection() && value instanceof Array) {
            // Sort selection by their current index to process them from top to bottom
            const sortedSelection = this.sortByIndexInList(this.d_selection(), value);

            for (let selectedItem of sortedSelection) {
                let selectedItemIndex: number = findIndexInList(selectedItem, value);
                // Only move if not at top and there's a valid position above
                if (selectedItemIndex > 0) {
                    let movedItem = value[selectedItemIndex];
                    let temp = value[selectedItemIndex - 1];
                    value[selectedItemIndex - 1] = movedItem;
                    value[selectedItemIndex] = temp;
                }
                // Don't break - continue with other items even if one can't move
            }

            if (this.dragdrop()) {
                if (this.filterValue) {
                    this.filter();
                } else if (this.visibleOptions) {
                    // Update visibleOptions to match value when no filtering
                    this.visibleOptions = [...value];
                }
            }

            this.onReorder.emit(this.d_selection());
        }
        this.listViewChild().cd?.markForCheck();
    }

    moveTop() {
        const value = this.value();
        if (this.d_selection()) {
            for (let i = this.d_selection().length - 1; i >= 0; i--) {
                let selectedItem = this.d_selection()[i];
                let selectedItemIndex: number = findIndexInList(selectedItem, value || []);

                if (selectedItemIndex != 0 && value instanceof Array) {
                    let movedItem = value.splice(selectedItemIndex, 1)[0];
                    value.unshift(movedItem);
                } else {
                    break;
                }
            }

            if (this.dragdrop()) {
                if (this.filterValue) {
                    this.filter();
                } else if (this.visibleOptions) {
                    // Update visibleOptions to match value when no filtering
                    this.visibleOptions = [...(value || [])];
                }
            }

            this.onReorder.emit(this.d_selection());
            setTimeout(() => {
                this.listViewChild().scrollInView(0);
            });
        }
        this.listViewChild().cd?.markForCheck();
    }

    moveDown() {
        const value = this.value();
        if (this.d_selection() && value instanceof Array) {
            const sortedSelection = this.sortByIndexInList(this.d_selection(), value).reverse();

            for (let selectedItem of sortedSelection) {
                let selectedItemIndex: number = findIndexInList(selectedItem, value);
                if (selectedItemIndex < value.length - 1) {
                    let movedItem = value[selectedItemIndex];
                    let temp = value[selectedItemIndex + 1];
                    value[selectedItemIndex + 1] = movedItem;
                    value[selectedItemIndex] = temp;
                }
            }

            if (this.dragdrop()) {
                if (this.filterValue) {
                    this.filter();
                } else if (this.visibleOptions) {
                    this.visibleOptions = [...value];
                }
            }

            this.onReorder.emit(this.d_selection());
        }

        this.listViewChild().cd?.markForCheck();
    }

    moveBottom() {
        const value = this.value();
        if (this.d_selection()) {
            for (let i = 0; i < this.d_selection().length; i++) {
                let selectedItem = this.d_selection()[i];
                let selectedItemIndex: number = findIndexInList(selectedItem, value || []);

                if (value instanceof Array && selectedItemIndex != value.length - 1) {
                    let movedItem = value.splice(selectedItemIndex, 1)[0];
                    value.push(movedItem);
                } else {
                    break;
                }
            }

            if (this.dragdrop()) {
                if (this.filterValue) {
                    this.filter();
                } else if (this.visibleOptions) {
                    this.visibleOptions = [...(value || [])];
                }
            }

            this.onReorder.emit(this.d_selection());
            this.listViewChild().scrollInView(value?.length ? value.length - 1 : 0);
        }
        this.listViewChild().cd?.markForCheck();
    }

    onDrop(event: CdkDragDrop<string[]>) {
        let previousIndex = event.previousIndex;
        let currentIndex = event.currentIndex;

        // Store the original state before any modifications
        const value = this.value();
        const originalValue = [...(value || [])];
        const originalVisibleOptions = this.visibleOptions ? [...this.visibleOptions] : null;

        if (previousIndex !== currentIndex) {
            // Determine items to move
            let itemsToMove: any[] = [];

            // Check if dragged item is in selected items AND we have multiple selections
            if (this.d_selection() && this.d_selection().length > 1 && findIndexInList(event.item.data, this.d_selection()) !== -1) {
                // Multi-selection: Move all selected items
                itemsToMove = [...this.d_selection()];

                // For multi-selection, restore original state to undo Listbox's automatic reordering
                if (value) {
                    value.length = 0;
                    value.push(...originalValue);
                }
                if (originalVisibleOptions && this.visibleOptions) {
                    this.visibleOptions.length = 0;
                    this.visibleOptions.push(...originalVisibleOptions);
                }

                // Sort items by their index in the array to maintain relative order
                itemsToMove = this.sortByIndexInList(itemsToMove, value || []);

                // Calculate how many selected items are before the drop position
                let itemsBefore = 0;
                for (const item of itemsToMove) {
                    const itemIndex = findIndexInList(item, value || []);
                    if (itemIndex !== -1 && itemIndex < currentIndex) {
                        itemsBefore++;
                    }
                }

                // Remove all selected items (in reverse order to avoid index shifting)
                for (let i = itemsToMove.length - 1; i >= 0; i--) {
                    const itemIndex = findIndexInList(itemsToMove[i], value || []);
                    if (itemIndex !== -1) {
                        value?.splice(itemIndex, 1);
                    }
                }

                // Calculate the final target index
                // If we're dragging down, we need to subtract the number of items that were before the target
                const targetIndex = Math.max(0, currentIndex - itemsBefore);

                // Insert all selected items at the target position
                for (let i = 0; i < itemsToMove.length; i++) {
                    value?.splice(targetIndex + i, 0, itemsToMove[i]);
                }
                // Update visibleOptions to match value
                if (this.dragdrop()) {
                    if (this.filterValue) {
                        this.filter();
                    } else if (this.visibleOptions) {
                        this.visibleOptions = [...(value || [])];
                    }
                }

                // Ensure change detection runs
                this.cd?.markForCheck();

                this.onReorder.emit(itemsToMove);
            } else {
                // Single item: Move only the dragged item (let Listbox handle it)
                itemsToMove = [event.item.data];

                if (this.filterValue) {
                    previousIndex = findIndexInList(event.item.data, value || []);
                    currentIndex = findIndexInList(this.visibleOptions?.[currentIndex], value || []);
                }

                moveItemInArray(value as any[], previousIndex, currentIndex);

                // Sync visibleOptions for non-filtered case
                if (this.dragdrop() && this.visibleOptions && !this.filterValue) {
                    this.visibleOptions = [...(value || [])];
                }

                this.onReorder.emit([event.item.data]);
            }
        }
    }

    // Helper method to sort items by their index in a list
    private sortByIndexInList(items: any[], list: any[]): any[] {
        return items.sort((a, b) => {
            const indexA = findIndexInList(a, list);
            const indexB = findIndexInList(b, list);
            return indexA - indexB;
        });
    }

    onListFocus(event: any) {
        this.onFocus.emit(event);
    }

    onListBlur(event: any) {
        this.onBlur.emit(event);
    }

    getVisibleOptions() {
        return this.visibleOptions && this.visibleOptions.length > 0 ? this.visibleOptions : this.value() && this.value()!.length > 0 ? this.value()! : null;
    }

    moveDisabled() {
        if (this.disabled() || !this.d_selection().length) {
            return true;
        }
    }

    createStyle() {
        if (isPlatformBrowser(this.platformId)) {
            if (!this.styleElement) {
                this.renderer.setAttribute(this.el.nativeElement.children[0], this.id, '');
                this.styleElement = this.renderer.createElement('style');
                this.renderer.setAttribute(this.styleElement, 'type', 'text/css');
                setAttribute(this.styleElement, 'nonce', this.config?.csp()?.nonce);
                this.renderer.appendChild(this.document.head, this.styleElement);

                let innerHTML = `
                    @media screen and (max-width: ${this.breakpoint()}) {
                        .p-orderlist[${this.$attrSelector}] {
                            flex-direction: column;
                        }

                        .p-orderlist[${this.$attrSelector}] .p-orderlist-controls {
                            padding: var(--content-padding);
                            flex-direction: row;
                        }

                        .p-orderlist[${this.$attrSelector}] .p-orderlist-controls .p-button {
                            margin-right: var(--inline-spacing);
                            margin-bottom: 0;
                        }

                        .p-orderlist[${this.$attrSelector}] .p-orderlist-controls .p-button:last-child {
                            margin-right: 0;
                        }
                    }
                `;
                this.renderer.setProperty(this.styleElement, 'innerHTML', innerHTML);
                setAttribute(this.styleElement, 'nonce', this.config?.csp()?.nonce);
            }
        }
    }

    destroyStyle() {
        if (isPlatformBrowser(this.platformId)) {
            if (this.styleElement) {
                this.renderer.removeChild(this.document, this.styleElement);
                this.styleElement = null;
                ``;
            }
        }
    }
}

@NgModule({
    imports: [OrderList, SharedModule],
    exports: [OrderList, SharedModule]
})
export class OrderListModule {}
