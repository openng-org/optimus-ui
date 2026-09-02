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
    model,
    NgModule,
    numberAttribute,
    OutputEmitterRef,
    TemplateRef,
    untracked,
    ViewEncapsulation,
    viewChild,
    contentChild,
    contentChildren,
    output
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { find, findIndexInList, isEmpty, setAttribute, uuid } from '@openng/optimus-ui-utils';
import { FilterService, PrimeTemplate, SharedModule } from '@openng/optimus-ui/api';
import { BaseComponent, PARENT_INSTANCE } from '@openng/optimus-ui/basecomponent';
import { Bind, BindModule } from '@openng/optimus-ui/bind';
import { ButtonModule, ButtonProps } from '@openng/optimus-ui/button';
import { AngleDoubleDownIcon, AngleDoubleLeftIcon, AngleDoubleRightIcon, AngleDoubleUpIcon, AngleDownIcon, AngleLeftIcon, AngleRightIcon, AngleUpIcon } from '@openng/optimus-ui/icons';
import { Listbox, ListboxChangeEvent } from '@openng/optimus-ui/listbox';
import { Ripple } from '@openng/optimus-ui/ripple';
import { Nullable, VoidListener } from '@openng/optimus-ui/ts-helpers';
import {
    PickListFilterOptions,
    PickListFilterTemplateContext,
    PickListItemTemplateContext,
    PickListMoveAllToSourceEvent,
    PickListMoveAllToTargetEvent,
    PickListMoveToSourceEvent,
    PickListMoveToTargetEvent,
    PickListSourceFilterEvent,
    PickListSourceReorderEvent,
    PickListSourceSelectEvent,
    PickListTargetFilterEvent,
    PickListTargetReorderEvent,
    PickListTargetSelectEvent,
    PickListTransferIconTemplateContext
} from '@openng/optimus-ui/types/picklist';
import { PickListStyle } from './style/pickliststyle';

/**
 * PickList is used to reorder items between different lists.
 * @group Components
 */
@Component({
    selector: 'p-pickList, p-picklist, p-pick-list',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        Ripple,
        DragDropModule,
        AngleDoubleDownIcon,
        AngleDoubleLeftIcon,
        AngleDoubleRightIcon,
        AngleDoubleUpIcon,
        AngleDownIcon,
        AngleLeftIcon,
        AngleRightIcon,
        AngleUpIcon,
        Listbox,
        FormsModule,
        SharedModule,
        BindModule
    ],
    template: `
        <div [ngStyle]="style()" [class]="cn(cx('root'), styleClass())" cdkDropListGroup [pBind]="ptm('root')">
            <div [class]="cx('sourceControls')" *ngIf="showSourceControls()" [pBind]="ptm('sourceControls')" [attr.data-pc-group-section]="'controls'">
                <button
                    type="button"
                    [attr.aria-label]="moveUpAriaLabel"
                    pButton
                    pRipple
                    severity="secondary"
                    [disabled]="sourceMoveDisabled()"
                    (click)="moveUp(sourcelist, source(), selectedItemsSource, onSourceReorder, SOURCE_LIST)"
                    [buttonProps]="getButtonProps('moveup')"
                    [pt]="ptm('pcSourceMoveUpButton')"
                    [unstyled]="unstyled()"
                >
                    <svg data-p-icon="angle-up" *ngIf="!$moveUpIconTemplate()" [pt]="ptm('pcSourceMoveUpButton')['icon']" pButtonIcon />
                    <ng-template *ngTemplateOutlet="$moveUpIconTemplate()"></ng-template>
                </button>
                <button
                    type="button"
                    [attr.aria-label]="moveTopAriaLabel"
                    pButton
                    pRipple
                    severity="secondary"
                    [disabled]="sourceMoveDisabled()"
                    (click)="moveTop(sourcelist, source(), selectedItemsSource, onSourceReorder, SOURCE_LIST)"
                    [buttonProps]="getButtonProps('movetop')"
                    [pt]="ptm('pcSourceMoveTopButton')"
                    [unstyled]="unstyled()"
                >
                    <svg data-p-icon="angle-double-up" *ngIf="!$moveTopIconTemplate()" pButtonIcon [pt]="ptm('pcSourceMoveTopButton')['icon']" />
                    <ng-template *ngTemplateOutlet="$moveTopIconTemplate()"></ng-template>
                </button>
                <button
                    type="button"
                    [attr.aria-label]="moveDownAriaLabel"
                    pButton
                    pRipple
                    severity="secondary"
                    [disabled]="sourceMoveDisabled()"
                    (click)="moveDown(sourcelist, source(), selectedItemsSource, onSourceReorder, SOURCE_LIST)"
                    [buttonProps]="getButtonProps('movedown')"
                    [pt]="ptm('pcSourceMoveDownButton')"
                    [unstyled]="unstyled()"
                    hostName="picklist"
                >
                    <svg data-p-icon="angle-down" *ngIf="!$moveDownIconTemplate()" pButtonIcon [pt]="ptm('pcSourceMoveDownButton')['icon']" />
                    <ng-template *ngTemplateOutlet="$moveDownIconTemplate()"></ng-template>
                </button>
                <button
                    type="button"
                    [attr.aria-label]="moveBottomAriaLabel"
                    pButton
                    pRipple
                    severity="secondary"
                    [disabled]="sourceMoveDisabled()"
                    (click)="moveBottom(sourcelist, source(), selectedItemsSource, onSourceReorder, SOURCE_LIST)"
                    [buttonProps]="getButtonProps('movebottom')"
                    [pt]="ptm('pcSourceMoveBottomButton')"
                    [unstyled]="unstyled()"
                    hostName="picklist"
                >
                    <svg data-p-icon="angle-double-down" *ngIf="!$moveBottomIconTemplate()" pButtonIcon [pt]="ptm('pcSourceMoveBottomButton')['icon']" />
                    <ng-template *ngTemplateOutlet="$moveBottomIconTemplate()"></ng-template>
                </button>
            </div>
            <div [class]="cx('sourceListContainer')" [attr.data-pc-group-section]="'listcontainer'" [pBind]="ptm('sourceListContainer')">
                <p-listbox
                    #sourcelist
                    [ariaLabel]="sourceAriaLabel()"
                    [multiple]="true"
                    [options]="sourceOptions"
                    [(ngModel)]="selectedItemsSource"
                    [ngModelOptions]="{ standalone: true }"
                    [optionLabel]="dataKey() ?? 'name'"
                    [id]="idSource + '_list'"
                    [listStyle]="sourceStyle()"
                    [striped]="stripedRows()"
                    [tabindex]="tabindex()"
                    (onFocus)="onListFocus($event, SOURCE_LIST)"
                    (onBlur)="onListBlur($event, SOURCE_LIST)"
                    (onChange)="onChangeSelection($event, SOURCE_LIST)"
                    (onDblClick)="onSourceItemDblClick()"
                    [disabled]="disabled()"
                    [optionDisabled]="sourceOptionDisabled()"
                    [metaKeySelection]="metaKeySelection()"
                    [scrollHeight]="scrollHeight()"
                    [autoOptionFocus]="autoOptionFocus()"
                    [filter]="filterBy() && showSourceFilter()"
                    [filterBy]="filterBy()"
                    [filterLocale]="filterLocale()"
                    [filterMatchMode]="filterMatchMode()"
                    [filterPlaceHolder]="sourceFilterPlaceholder()"
                    [dragdrop]="dragdrop()"
                    [dropListData]="source()"
                    (onDrop)="onDrop($event, SOURCE_LIST)"
                    (onFilter)="onFilter($event.originalEvent, SOURCE_LIST)"
                    [pt]="ptm('pcListbox')"
                    hostName="picklist"
                    [attr.data-pc-group-section]="'list'"
                    [unstyled]="unstyled()"
                >
                    <ng-container *ngIf="$sourceHeaderTemplate() || sourceHeader()">
                        <ng-template #header>
                            <div *ngIf="!$sourceHeaderTemplate()">{{ sourceHeader() }}</div>
                            <ng-template *ngTemplateOutlet="$sourceHeaderTemplate()"></ng-template>
                        </ng-template>
                    </ng-container>
                    <ng-container *ngIf="$sourceFilterTemplate()">
                        <ng-template #filter>
                            <ng-template *ngTemplateOutlet="$sourceFilterTemplate(); context: { options: sourceFilterOptions }"></ng-template>
                        </ng-template>
                    </ng-container>
                    <ng-container *ngIf="$sourceFilterIconTemplate()">
                        <ng-container *ngTemplateOutlet="$sourceFilterIconTemplate()"></ng-container>
                    </ng-container>
                    <ng-container *ngIf="$itemTemplate()">
                        <ng-template #item let-item let-index="index" let-selected="selected" let-disabled="disabled">
                            <ng-container *ngTemplateOutlet="$itemTemplate(); context: { $implicit: item, index: index, selected: selected, disabled: disabled }"></ng-container>
                        </ng-template>
                    </ng-container>
                    <ng-container *ngIf="$emptyMessageSourceTemplate()">
                        <ng-template #empty>
                            <ng-container *ngTemplateOutlet="$emptyMessageSourceTemplate()"></ng-container>
                        </ng-template>
                    </ng-container>
                    <ng-container *ngIf="$emptyFilterMessageSourceTemplate()">
                        <ng-template #emptyfilter>
                            <ng-container *ngTemplateOutlet="$emptyFilterMessageSourceTemplate()"></ng-container>
                        </ng-template>
                    </ng-container>
                </p-listbox>
            </div>
            <div [class]="cx('transferControls')" [attr.data-pc-group-section]="'controls'" [pBind]="ptm('transferControls')">
                <button
                    type="button"
                    [attr.aria-label]="moveToTargetAriaLabel"
                    pButton
                    pRipple
                    severity="secondary"
                    [disabled]="moveRightDisabled()"
                    (click)="moveRight()"
                    [buttonProps]="getButtonProps('movetotarget')"
                    [pt]="ptm('pcMoveToTargetButton')"
                    hostName="picklist"
                    [unstyled]="unstyled()"
                >
                    <ng-container *ngIf="!$moveToTargetIconTemplate()">
                        <svg data-p-icon="angle-right" *ngIf="!viewChanged" pButtonIcon [pt]="ptm('pcMoveToTargetButton')['icon']" />
                        <svg data-p-icon="angle-down" *ngIf="viewChanged" pButtonIcon [pt]="ptm('pcMoveToTargetButton')['icon']" />
                    </ng-container>
                    <ng-template *ngTemplateOutlet="$moveToTargetIconTemplate(); context: { $implicit: viewChanged }"></ng-template>
                </button>
                <button
                    type="button"
                    [attr.aria-label]="moveAllToTargetAriaLabel"
                    pButton
                    pRipple
                    severity="secondary"
                    [disabled]="moveAllRightDisabled()"
                    (click)="moveAllRight()"
                    [buttonProps]="getButtonProps('movealltotarget')"
                    [pt]="ptm('pcMoveAllToTargetButton')"
                    [unstyled]="unstyled()"
                >
                    <ng-container *ngIf="!$moveAllToTargetIconTemplate()">
                        <svg data-p-icon="angle-double-right" *ngIf="!viewChanged" pButtonIcon [pt]="ptm('pcMoveAllToTargetButton')['icon']" />
                        <svg data-p-icon="angle-double-down" *ngIf="viewChanged" pButtonIcon [pt]="ptm('pcMoveAllToTargetButton')['icon']" />
                    </ng-container>
                    <ng-template *ngTemplateOutlet="$moveAllToTargetIconTemplate(); context: { $implicit: viewChanged }"></ng-template>
                </button>
                <button
                    type="button"
                    [attr.aria-label]="moveToSourceAriaLabel"
                    pButton
                    pRipple
                    severity="secondary"
                    [disabled]="moveLeftDisabled()"
                    (click)="moveLeft()"
                    [buttonProps]="getButtonProps('movetosource')"
                    [pt]="ptm('pcMoveToSourceButton')"
                    hostName="picklist"
                    [unstyled]="unstyled()"
                >
                    <ng-container *ngIf="!$moveToSourceIconTemplate()">
                        <svg data-p-icon="angle-left" *ngIf="!viewChanged" pButtonIcon [pt]="ptm('pcMoveToSourceButton')['icon']" />
                        <svg data-p-icon="angle-up" *ngIf="viewChanged" pButtonIcon [pt]="ptm('pcMoveToSourceButton')['icon']" />
                    </ng-container>
                    <ng-template *ngTemplateOutlet="$moveToSourceIconTemplate(); context: { $implicit: viewChanged }"></ng-template>
                </button>
                <button
                    type="button"
                    [attr.aria-label]="moveAllToSourceAriaLabel"
                    pButton
                    pRipple
                    severity="secondary"
                    [disabled]="moveAllLeftDisabled()"
                    (click)="moveAllLeft()"
                    [buttonProps]="getButtonProps('movealltosource')"
                    [pt]="ptm('pcMoveAllToSourceButton')"
                    hostName="picklist"
                    [unstyled]="unstyled()"
                >
                    <ng-container *ngIf="!$moveAllToSourceIconTemplate()">
                        <svg data-p-icon="angle-double-left" *ngIf="!viewChanged" pButtonIcon [pt]="ptm('pcMoveAllToSourceButton')['icon']" />
                        <svg data-p-icon="angle-double-up" *ngIf="viewChanged" pButtonIcon [pt]="ptm('pcMoveAllToSourceButton')['icon']" />
                    </ng-container>
                    <ng-template *ngTemplateOutlet="$moveAllToSourceIconTemplate(); context: { $implicit: viewChanged }"></ng-template>
                </button>
            </div>
            <div [class]="cx('targetListContainer')" [attr.data-pc-group-section]="'listcontainer'" [pBind]="ptm('targetListContainer')">
                <p-listbox
                    #targetlist
                    [ariaLabel]="targetAriaLabel()"
                    [multiple]="true"
                    [options]="targetOptions"
                    [(ngModel)]="selectedItemsTarget"
                    [ngModelOptions]="{ standalone: true }"
                    [optionLabel]="dataKey() ?? 'name'"
                    [id]="idTarget + '_list'"
                    [listStyle]="targetStyle()"
                    [striped]="stripedRows()"
                    [tabindex]="tabindex()"
                    (onFocus)="onListFocus($event, TARGET_LIST)"
                    (onBlur)="onListBlur($event, TARGET_LIST)"
                    (onChange)="onChangeSelection($event, TARGET_LIST)"
                    (onDblClick)="onTargetItemDblClick()"
                    [disabled]="disabled()"
                    [optionDisabled]="targetOptionDisabled()"
                    [metaKeySelection]="metaKeySelection()"
                    [scrollHeight]="scrollHeight()"
                    [autoOptionFocus]="autoOptionFocus()"
                    [filter]="filterBy() && showTargetFilter()"
                    [filterBy]="filterBy()"
                    [filterLocale]="filterLocale()"
                    [filterMatchMode]="filterMatchMode()"
                    [filterPlaceHolder]="targetFilterPlaceholder()"
                    [dragdrop]="dragdrop()"
                    [dropListData]="target()"
                    (onDrop)="onDrop($event, TARGET_LIST)"
                    (onFilter)="onFilter($event.originalEvent, TARGET_LIST)"
                    [pt]="ptm('pcListbox')"
                    [attr.data-pc-group-section]="'list'"
                    hostName="picklist"
                    [unstyled]="unstyled()"
                >
                    <ng-container *ngIf="$targetHeaderTemplate() || targetHeader()">
                        <ng-template #header>
                            <div *ngIf="!$targetHeaderTemplate()">{{ targetHeader() }}</div>
                            <ng-template *ngTemplateOutlet="$targetHeaderTemplate()"></ng-template>
                        </ng-template>
                    </ng-container>
                    <ng-container *ngIf="$targetFilterTemplate()">
                        <ng-template #filter>
                            <ng-template *ngTemplateOutlet="$targetFilterTemplate(); context: { options: targetFilterOptions }"></ng-template>
                        </ng-template>
                    </ng-container>
                    <ng-container *ngIf="$targetFilterIconTemplate()">
                        <ng-container *ngTemplateOutlet="$targetFilterIconTemplate()"></ng-container>
                    </ng-container>
                    <ng-container *ngIf="$itemTemplate()">
                        <ng-template #item let-item let-index="index" let-selected="selected" let-disabled="disabled">
                            <ng-container *ngTemplateOutlet="$itemTemplate(); context: { $implicit: item, index: index, selected: selected, disabled: disabled }"></ng-container>
                        </ng-template>
                    </ng-container>
                    <ng-container *ngIf="$emptyMessageTargetTemplate()">
                        <ng-template #empty>
                            <ng-container *ngTemplateOutlet="$emptyMessageTargetTemplate()"></ng-container>
                        </ng-template>
                    </ng-container>
                    <ng-container *ngIf="$emptyFilterMessageTargetTemplate()">
                        <ng-template #emptyfilter>
                            <ng-container *ngTemplateOutlet="$emptyFilterMessageTargetTemplate()"></ng-container>
                        </ng-template>
                    </ng-container>
                </p-listbox>
            </div>
            <div [class]="cx('targetControls')" *ngIf="showTargetControls()" [attr.data-pc-group-section]="'controls'" [pBind]="ptm('targetControls')">
                <button
                    type="button"
                    [attr.aria-label]="moveUpAriaLabel"
                    pButton
                    pRipple
                    severity="secondary"
                    [disabled]="targetMoveDisabled()"
                    (click)="moveUp(targetlist, target(), selectedItemsTarget, onTargetReorder, TARGET_LIST)"
                    [buttonProps]="getButtonProps('moveup')"
                    [pt]="ptm('pcTargetMoveUpButton')"
                    hostName="picklist"
                    [unstyled]="unstyled()"
                >
                    <svg data-p-icon="angle-up" *ngIf="!$moveUpIconTemplate()" pButtonIcon [pt]="ptm('pcTargetMoveUpButton')['icon']" />
                    <ng-template *ngTemplateOutlet="$moveUpIconTemplate()"></ng-template>
                </button>
                <button
                    type="button"
                    [attr.aria-label]="moveTopAriaLabel"
                    pButton
                    pRipple
                    severity="secondary"
                    [disabled]="targetMoveDisabled()"
                    (click)="moveTop(targetlist, target(), selectedItemsTarget, onTargetReorder, TARGET_LIST)"
                    [buttonProps]="getButtonProps('movetop')"
                    [pt]="ptm('pcTargetMoveTopButton')"
                    hostName="picklist"
                    [unstyled]="unstyled()"
                >
                    <svg data-p-icon="angle-double-up" *ngIf="!$moveTopIconTemplate()" pButtonIcon [pt]="ptm('pcTargetMoveTopButton')['icon']" />
                    <ng-template *ngTemplateOutlet="$moveTopIconTemplate()"></ng-template>
                </button>
                <button
                    type="button"
                    [attr.aria-label]="moveDownAriaLabel"
                    pButton
                    pRipple
                    severity="secondary"
                    [disabled]="targetMoveDisabled()"
                    (click)="moveDown(targetlist, target(), selectedItemsTarget, onTargetReorder, TARGET_LIST)"
                    [buttonProps]="getButtonProps('movedown')"
                    [pt]="ptm('pcTargetMoveDownButton')"
                    hostName="picklist"
                    [unstyled]="unstyled()"
                >
                    <svg data-p-icon="angle-down" *ngIf="!$moveDownIconTemplate()" pButtonIcon [pt]="ptm('pcTargetMoveDownButton')['icon']" />
                    <ng-template *ngTemplateOutlet="$moveDownIconTemplate()"></ng-template>
                </button>
                <button
                    type="button"
                    [attr.aria-label]="moveBottomAriaLabel"
                    pButton
                    pRipple
                    severity="secondary"
                    [disabled]="targetMoveDisabled()"
                    (click)="moveBottom(targetlist, target(), selectedItemsTarget, onTargetReorder, TARGET_LIST)"
                    [buttonProps]="getButtonProps('movebottom')"
                    [pt]="ptm('pcTargetMoveBottomButton')"
                    hostName="picklist"
                    [unstyled]="unstyled()"
                >
                    <svg data-p-icon="angle-double-down" *ngIf="!$moveBottomIconTemplate()" pButtonIcon [pt]="ptm('pcTargetMoveBottomButton')['icon']" />
                    <ng-template *ngTemplateOutlet="$moveBottomIconTemplate()"></ng-template>
                </button>
            </div>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [PickListStyle, { provide: PARENT_INSTANCE, useExisting: PickList }],
    hostDirectives: [Bind]
})
export class PickList extends BaseComponent {
    bindDirectiveInstance = inject(Bind, { self: true });

    _componentStyle = inject(PickListStyle);

    filterService = inject(FilterService);

    readonly hostName = input<any>('');

    /**
     * An array of objects for the source list.
     * @group Props
     */
    source = model<any[]>([]);

    /**
     * An array of objects for the target list.
     * @group Props
     */
    target = model<any[]>([]);

    /**
     * Name of the field that uniquely identifies the options.
     * @group Props
     */
    readonly dataKey = input<string>();

    /**
     * Text for the source list caption
     * @group Props
     */
    readonly sourceHeader = input<string>();

    /**
     * Index of the element in tabbing order.
     * @group Props
     */
    readonly tabindex = input<number | undefined, unknown>(0, { transform: numberAttribute });

    /**
     * Defines a string that labels the move to right button for accessibility.
     * @group Props
     */
    readonly rightButtonAriaLabel = input<string>();

    /**
     * Defines a string that labels the move to left button for accessibility.
     * @group Props
     */
    readonly leftButtonAriaLabel = input<string>();

    /**
     * Defines a string that labels the move to all right button for accessibility.
     * @group Props
     */
    readonly allRightButtonAriaLabel = input<string>();

    /**
     * Defines a string that labels the move to all left button for accessibility.
     * @group Props
     */
    readonly allLeftButtonAriaLabel = input<string>();

    /**
     * Defines a string that labels the move to up button for accessibility.
     * @group Props
     */
    readonly upButtonAriaLabel = input<string>();

    /**
     * Defines a string that labels the move to down button for accessibility.
     * @group Props
     */
    readonly downButtonAriaLabel = input<string>();

    /**
     * Defines a string that labels the move to top button for accessibility.
     * @group Props
     */
    readonly topButtonAriaLabel = input<string>();

    /**
     * Defines a string that labels the move to bottom button for accessibility.
     * @group Props
     */
    readonly bottomButtonAriaLabel = input<string>();

    /**
     * Defines a string that labels the source list.
     * @group Props
     */
    readonly sourceAriaLabel = input<string>();

    /**
     * Defines a string that labels the target list.
     * @group Props
     */
    readonly targetAriaLabel = input<string>();

    /**
     * Text for the target list caption
     * @group Props
     */
    readonly targetHeader = input<string>();

    /**
     * When enabled orderlist adjusts its controls based on screen size.
     * @group Props
     */
    readonly responsive = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    /**
     * When specified displays an input field to filter the items on keyup and decides which field to search (Accepts multiple fields with a comma).
     * @group Props
     */
    readonly filterBy = input<string>();

    /**
     * Locale to use in filtering. The default locale is the host environment's current locale.
     * @group Props
     */
    readonly filterLocale = input<string>();

    /**
     * Function to optimize the dom operations by delegating to ngForTrackBy, default algorithm checks for object identity. Use sourceTrackBy or targetTrackBy in case different algorithms are needed per list.
     * @group Props
     */
    readonly trackBy = input<Function>((index: number, item: any) => item);

    /**
     * Function to optimize the dom operations by delegating to ngForTrackBy in source list, default algorithm checks for object identity.
     * @group Props
     */
    readonly sourceTrackBy = input<Function>();

    /**
     * Function to optimize the dom operations by delegating to ngForTrackBy in target list, default algorithm checks for object identity.
     * @group Props
     */
    readonly targetTrackBy = input<Function>();

    /**
     * Whether to show filter input for source list when filterBy is enabled.
     * @group Props
     */
    readonly showSourceFilter = input<boolean, unknown>(true, { transform: booleanAttribute });

    /**
     * Whether to show filter input for target list when filterBy is enabled.
     * @group Props
     */
    readonly showTargetFilter = input<boolean, unknown>(true, { transform: booleanAttribute });

    /**
     * Defines how multiple items can be selected, when true metaKey needs to be pressed to select or unselect an item and when set to false selection of each item can be toggled individually. On touch enabled devices, metaKeySelection is turned off automatically.
     * @group Props
     */
    readonly metaKeySelection = input<boolean, unknown>(false, { transform: booleanAttribute });

    /**
     * Whether to enable dragdrop based reordering.
     * @group Props
     */
    readonly dragdrop = input<boolean, unknown>(false, { transform: booleanAttribute });

    /**
     * Inline style of the component.
     * @group Props
     */
    readonly style = input<{ [klass: string]: any } | null | undefined>();

    /**
     * Style class of the component.
     * @group Props
     */
    readonly styleClass = input<string>();

    /**
     * Inline style of the source list element.
     * @group Props
     */
    readonly sourceStyle = input<any>();

    /**
     * Inline style of the target list element.
     * @group Props
     */
    readonly targetStyle = input<any>();

    /**
     * Whether to show buttons of source list.
     * @group Props
     */
    readonly showSourceControls = input<boolean, unknown>(true, { transform: booleanAttribute });

    /**
     * Whether to show buttons of target list.
     * @group Props
     */
    readonly showTargetControls = input<boolean, unknown>(true, { transform: booleanAttribute });

    /**
     * Placeholder text on source filter input.
     * @group Props
     */
    readonly sourceFilterPlaceholder = input<string>();

    /**
     * Placeholder text on target filter input.
     * @group Props
     */
    readonly targetFilterPlaceholder = input<string>();

    /**
     * When present, it specifies that the component should be disabled.
     * @group Props
     */
    readonly disabled = input<boolean, unknown>(undefined, { transform: booleanAttribute });

    /**
     * Name of the disabled field of a target option or function to determine disabled state.
     * @group Props
     */
    readonly sourceOptionDisabled = input<string | ((item: any) => boolean)>();

    /**
     * Name of the disabled field of a target option or function to determine disabled state.
     * @group Props
     */
    readonly targetOptionDisabled = input<string | ((item: any) => boolean)>();

    /**
     * Defines a string that labels the filter input of source list.
     * @group Props
     */
    readonly ariaSourceFilterLabel = input<string>();

    /**
     * Defines a string that labels the filter input of target list.
     * @group Props
     */
    readonly ariaTargetFilterLabel = input<string>();

    /**
     * Defines how the items are filtered.
     * @group Props
     */
    readonly filterMatchMode = input<'contains' | 'startsWith' | 'endsWith' | 'equals' | 'notEquals' | 'in' | 'lt' | 'lte' | 'gt' | 'gte' | string>('contains');

    /**
     * Whether to displays rows with alternating colors.
     * @group Props
     */
    readonly stripedRows = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    /**
     * Keeps selection on the transfer list.
     * @group Props
     */
    readonly keepSelection = input<boolean, unknown>(false, { transform: booleanAttribute });

    /**
     * Height of the viewport, a scrollbar is defined if height of list exceeds this value.
     * @group Props
     */
    readonly scrollHeight = input<string>('14rem');

    /**
     * Whether to focus on the first visible or selected element.
     * @group Props
     */
    readonly autoOptionFocus = input<boolean, unknown>(true, { transform: booleanAttribute });

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
     * 	Used to pass all properties of the ButtonProps to the move top button inside the component.
     * @group Props
     */
    readonly moveTopButtonProps = input<ButtonProps>();

    /**
     * 	Used to pass all properties of the ButtonProps to the move down button inside the component.
     * @group Props
     */
    readonly moveDownButtonProps = input<ButtonProps>();

    /**
     * 	Used to pass all properties of the ButtonProps to the move bottom button inside the component.
     * @group Props
     */
    readonly moveBottomButtonProps = input<ButtonProps>();

    /**
     * 	Used to pass all properties of the ButtonProps to the move to target button inside the component.
     * @group Props
     */
    readonly moveToTargetProps = input<ButtonProps>();

    /**
     * 	Used to pass all properties of the ButtonProps to the move all to target button inside the component.
     * @group Props
     */
    readonly moveAllToTargetProps = input<ButtonProps>();

    /**
     *  Used to pass all properties of the ButtonProps to the move to source button inside the component.
     * @group Props
     */
    readonly moveToSourceProps = input<ButtonProps>();

    /**
     *  Used to pass all properties of the ButtonProps to the move all to source button inside the component.
     * @group Props
     */
    readonly moveAllToSourceProps = input<ButtonProps>();

    /**
     * Indicates the width of the screen at which the component should change its behavior.
     * @group Props
     */
    readonly breakpoint = input<string>('960px');

    /**
     * Callback to invoke when items are moved from target to source.
     * @param {PickListMoveToSourceEvent} event - Custom move to source event.
     * @group Emits
     */
    readonly onMoveToSource = output<PickListMoveToSourceEvent>();

    /**
     * Callback to invoke when all items are moved from target to source.
     * @param {PickListMoveAllToSourceEvent} event - Custom move all to source event.
     * @group Emits
     */
    readonly onMoveAllToSource = output<PickListMoveAllToSourceEvent>();

    /**
     * Callback to invoke when all items are moved from source to target.
     * @param {PickListMoveAllToTargetEvent} event - Custom move all to target event.
     * @group Emits
     */
    readonly onMoveAllToTarget = output<PickListMoveAllToTargetEvent>();

    /**
     * Callback to invoke when items are moved from source to target.
     * @param {PickListMoveToTargetEvent} event - Custom move to target event.
     * @group Emits
     */
    readonly onMoveToTarget = output<PickListMoveToTargetEvent>();

    /**
     * Callback to invoke when items are reordered within source list.
     * @param {PickListSourceReorderEvent} event - Custom source reorder event.
     * @group Emits
     */
    readonly onSourceReorder = output<PickListSourceReorderEvent>();

    /**
     * Callback to invoke when items are reordered within target list.
     * @param {PickListTargetReorderEvent} event - Custom target reorder event.
     * @group Emits
     */
    readonly onTargetReorder = output<PickListTargetReorderEvent>();

    /**
     * Callback to invoke when items are selected within source list.
     * @param {PickListSourceSelectEvent} event - Custom source select event.
     * @group Emits
     */
    readonly onSourceSelect = output<PickListSourceSelectEvent>();

    /**
     * Callback to invoke when items are selected within target list.
     * @param {PickListTargetSelectEvent} event - Custom target select event.
     * @group Emits
     */
    readonly onTargetSelect = output<PickListTargetSelectEvent>();

    /**
     * Callback to invoke when the source list is filtered
     * @param {PickListSourceFilterEvent} event - Custom source filter event.
     * @group Emits
     */
    readonly onSourceFilter = output<PickListSourceFilterEvent>();

    /**
     * Callback to invoke when the target list is filtered
     * @param {PickListTargetFilterEvent} event - Custom target filter event.
     * @group Emits
     */
    readonly onTargetFilter = output<PickListTargetFilterEvent>();

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

    readonly listViewSourceChild = viewChild.required<Listbox>('sourcelist');

    readonly listViewTargetChild = viewChild.required<Listbox>('targetlist');

    /**
     * Custom item template.
     * @param {PickListItemTemplateContext} context - item context.
     * @see {@link PickListItemTemplateContext}
     * @group Templates
     */
    readonly itemTemplate = contentChild<TemplateRef<PickListItemTemplateContext>>('item', { descendants: false });

    /**
     * Custom source header template.
     * @group Templates
     */
    readonly sourceHeaderTemplate = contentChild<TemplateRef<void>>('sourceHeader', { descendants: false });

    /**
     * Custom target header template.
     * @group Templates
     */
    readonly targetHeaderTemplate = contentChild<TemplateRef<void>>('targetHeader', { descendants: false });

    /**
     * Custom source filter template.
     * @param {PickListFilterTemplateContext} context - filter context.
     * @see {@link PickListFilterTemplateContext}
     * @group Templates
     */
    readonly sourceFilterTemplate = contentChild<TemplateRef<PickListFilterTemplateContext>>('sourceFilter', { descendants: false });

    /**
     * Custom target filter template.
     * @param {PickListFilterTemplateContext} context - filter context.
     * @see {@link PickListFilterTemplateContext}
     * @group Templates
     */
    readonly targetFilterTemplate = contentChild<TemplateRef<PickListFilterTemplateContext>>('targetFilter', { descendants: false });

    /**
     * Custom empty message when source is empty template.
     * @group Templates
     */
    readonly emptyMessageSourceTemplate = contentChild<TemplateRef<void>>('emptymessagesource', { descendants: false });

    /**
     * Custom empty filter message when source is empty template.
     * @group Templates
     */
    readonly emptyFilterMessageSourceTemplate = contentChild<TemplateRef<void>>('emptyfiltermessagesource', { descendants: false });

    /**
     * Custom empty message when target is empty template.
     * @group Templates
     */
    readonly emptyMessageTargetTemplate = contentChild<TemplateRef<void>>('emptymessagetarget', { descendants: false });

    /**
     * Custom empty filter message when target is empty template.
     * @group Templates
     */
    readonly emptyFilterMessageTargetTemplate = contentChild<TemplateRef<void>>('emptyfiltermessagetarget', { descendants: false });

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
     * Custom move to target icon template.
     * @param {PickListTransferIconTemplateContext} context - icon context.
     * @see {@link PickListTransferIconTemplateContext}
     * @group Templates
     */
    readonly moveToTargetIconTemplate = contentChild<TemplateRef<PickListTransferIconTemplateContext>>('movetotargeticon', { descendants: false });

    /**
     * Custom move all to target icon template.
     * @param {PickListTransferIconTemplateContext} context - icon context.
     * @see {@link PickListTransferIconTemplateContext}
     * @group Templates
     */
    readonly moveAllToTargetIconTemplate = contentChild<TemplateRef<PickListTransferIconTemplateContext>>('movealltotargeticon', { descendants: false });

    /**
     * Custom move to source icon template.
     * @param {PickListTransferIconTemplateContext} context - icon context.
     * @see {@link PickListTransferIconTemplateContext}
     * @group Templates
     */
    readonly moveToSourceIconTemplate = contentChild<TemplateRef<PickListTransferIconTemplateContext>>('movetosourceicon', { descendants: false });

    /**
     * Custom move all to source icon template.
     * @param {PickListTransferIconTemplateContext} context - icon context.
     * @see {@link PickListTransferIconTemplateContext}
     * @group Templates
     */
    readonly moveAllToSourceIconTemplate = contentChild<TemplateRef<PickListTransferIconTemplateContext>>('movealltosourceicon', { descendants: false });

    /**
     * Custom target filter icon template.
     * @group Templates
     */
    readonly targetFilterIconTemplate = contentChild<TemplateRef<void>>('targetfiltericon', { descendants: false });

    /**
     * Custom source filter icon template.
     * @group Templates
     */
    readonly sourceFilterIconTemplate = contentChild<TemplateRef<void>>('sourcefiltericon', { descendants: false });

    readonly templates = contentChildren(PrimeTemplate);

    componentName = 'PickList';

    private breakpointEffectFirstRun = true;

    /**
     * Replays the legacy `breakpoint` setter side effect on later input changes: rebinds the
     * media query listener. The first run is skipped — `onInit` applies the initial value
     * eagerly before `initMedia`/`createStyle` read it.
     */
    private readonly breakpointEffect = effect(() => {
        const value = this.breakpoint();

        if (this.breakpointEffectFirstRun) {
            this.breakpointEffectFirstRun = false;
            return;
        }

        untracked(() => {
            if (value !== this._breakpoint) {
                this._breakpoint = value;
                if (isPlatformBrowser(this.platformId)) {
                    this.destroyMedia();
                    this.initMedia();
                }
            }
        });
    });

    get targetOptions() {
        return [...(this.target() || [])];
    }

    get sourceOptions() {
        return [...(this.source() || [])];
    }

    get moveUpAriaLabel() {
        return this.upButtonAriaLabel() ? this.upButtonAriaLabel() : this.config.translation.aria ? this.config.translation.aria.moveUp : undefined;
    }

    get moveTopAriaLabel() {
        return this.topButtonAriaLabel() ? this.topButtonAriaLabel() : this.config.translation.aria ? this.config.translation.aria.moveTop : undefined;
    }

    get moveDownAriaLabel() {
        return this.downButtonAriaLabel() ? this.downButtonAriaLabel() : this.config.translation.aria ? this.config.translation.aria.moveDown : undefined;
    }

    get moveBottomAriaLabel() {
        return this.bottomButtonAriaLabel() ? this.bottomButtonAriaLabel() : this.config.translation.aria ? this.config.translation.aria.moveDown : undefined;
    }

    get moveToTargetAriaLabel() {
        return this.rightButtonAriaLabel() ? this.rightButtonAriaLabel() : this.config.translation.aria ? this.config.translation.aria.moveToTarget : undefined;
    }

    get moveAllToTargetAriaLabel() {
        return this.allRightButtonAriaLabel() ? this.allRightButtonAriaLabel() : this.config.translation.aria ? this.config.translation.aria.moveAllToTarget : undefined;
    }

    get moveToSourceAriaLabel() {
        return this.leftButtonAriaLabel() ? this.leftButtonAriaLabel() : this.config.translation.aria ? this.config.translation.aria.moveToSource : undefined;
    }

    get moveAllToSourceAriaLabel() {
        return this.allLeftButtonAriaLabel() ? this.allLeftButtonAriaLabel() : this.config.translation.aria ? this.config.translation.aria.moveAllToSource : undefined;
    }

    get idSource() {
        return this.id + '_source';
    }

    get idTarget() {
        return this.id + '_target';
    }

    _breakpoint: string = '960px';

    public visibleOptionsSource: any[] | undefined | null;

    public visibleOptionsTarget: any[] | undefined | null;

    selectedItemsSource: any[] = [];

    selectedItemsTarget: any[] = [];

    itemTouched: Nullable<boolean>;

    styleElement: any;

    id: string = uuid('pn_id_');

    filterValueSource: Nullable<string>;

    filterValueTarget: Nullable<string>;

    fromListType: Nullable<number>;

    sourceFilterOptions: Nullable<PickListFilterOptions>;

    targetFilterOptions: Nullable<PickListFilterOptions>;

    readonly SOURCE_LIST: number = -1;

    readonly TARGET_LIST: number = 1;

    window: Window;

    media: MediaQueryList | null | undefined;

    viewChanged: boolean | undefined;

    mediaChangeListener: VoidListener;

    /**
     * Effective item template: the `#item` content child or (legacy behavior) the last projected
     * pTemplate of type `item`, `option` or of an unknown type.
     */
    readonly $itemTemplate = computed(
        () =>
            this.itemTemplate() ??
            (this.templates()
                .filter(
                    (item) =>
                        ![
                            'sourceHeader',
                            'targetHeader',
                            'sourceFilter',
                            'targetFilter',
                            'emptymessagesource',
                            'emptyfiltermessagesource',
                            'emptymessagetarget',
                            'emptyfiltermessagetarget',
                            'moveupicon',
                            'movetopicon',
                            'movedownicon',
                            'movebottomicon',
                            'movetotargeticon',
                            'movealltotargeticon',
                            'movetosourceicon',
                            'movealltosourceicon',
                            'targetfiltericon',
                            'sourcefiltericon'
                        ].includes(item.getType())
                )
                .at(-1)?.template as TemplateRef<PickListItemTemplateContext> | undefined)
    );

    /** Effective source header template: the `#sourceHeader` content child or the `pTemplate="sourceHeader"`. */
    readonly $sourceHeaderTemplate = computed(
        () =>
            this.sourceHeaderTemplate() ??
            this.templates()
                .filter((item) => item.getType() === 'sourceHeader')
                .at(-1)?.template
    );

    /** Effective target header template: the `#targetHeader` content child or the `pTemplate="targetHeader"`. */
    readonly $targetHeaderTemplate = computed(
        () =>
            this.targetHeaderTemplate() ??
            this.templates()
                .filter((item) => item.getType() === 'targetHeader')
                .at(-1)?.template
    );

    /** Effective source filter template: the `#sourceFilter` content child or the `pTemplate="sourceFilter"`. */
    readonly $sourceFilterTemplate = computed(
        () =>
            this.sourceFilterTemplate() ??
            (this.templates()
                .filter((item) => item.getType() === 'sourceFilter')
                .at(-1)?.template as TemplateRef<PickListFilterTemplateContext> | undefined)
    );

    /** Effective target filter template: the `#targetFilter` content child or the `pTemplate="targetFilter"`. */
    readonly $targetFilterTemplate = computed(
        () =>
            this.targetFilterTemplate() ??
            (this.templates()
                .filter((item) => item.getType() === 'targetFilter')
                .at(-1)?.template as TemplateRef<PickListFilterTemplateContext> | undefined)
    );

    /** Effective source empty message template. */
    readonly $emptyMessageSourceTemplate = computed(
        () =>
            this.emptyMessageSourceTemplate() ??
            this.templates()
                .filter((item) => item.getType() === 'emptymessagesource')
                .at(-1)?.template
    );

    /** Effective source empty filter message template. */
    readonly $emptyFilterMessageSourceTemplate = computed(
        () =>
            this.emptyFilterMessageSourceTemplate() ??
            this.templates()
                .filter((item) => item.getType() === 'emptyfiltermessagesource')
                .at(-1)?.template
    );

    /** Effective target empty message template. */
    readonly $emptyMessageTargetTemplate = computed(
        () =>
            this.emptyMessageTargetTemplate() ??
            this.templates()
                .filter((item) => item.getType() === 'emptymessagetarget')
                .at(-1)?.template
    );

    /** Effective target empty filter message template. */
    readonly $emptyFilterMessageTargetTemplate = computed(
        () =>
            this.emptyFilterMessageTargetTemplate() ??
            this.templates()
                .filter((item) => item.getType() === 'emptyfiltermessagetarget')
                .at(-1)?.template
    );

    /** Effective move up icon template. */
    readonly $moveUpIconTemplate = computed(
        () =>
            this.moveUpIconTemplate() ??
            this.templates()
                .filter((item) => item.getType() === 'moveupicon')
                .at(-1)?.template
    );

    /** Effective move top icon template. */
    readonly $moveTopIconTemplate = computed(
        () =>
            this.moveTopIconTemplate() ??
            this.templates()
                .filter((item) => item.getType() === 'movetopicon')
                .at(-1)?.template
    );

    /** Effective move down icon template. */
    readonly $moveDownIconTemplate = computed(
        () =>
            this.moveDownIconTemplate() ??
            this.templates()
                .filter((item) => item.getType() === 'movedownicon')
                .at(-1)?.template
    );

    /** Effective move bottom icon template. */
    readonly $moveBottomIconTemplate = computed(
        () =>
            this.moveBottomIconTemplate() ??
            this.templates()
                .filter((item) => item.getType() === 'movebottomicon')
                .at(-1)?.template
    );

    /** Effective move to target icon template. */
    readonly $moveToTargetIconTemplate = computed(
        () =>
            this.moveToTargetIconTemplate() ??
            (this.templates()
                .filter((item) => item.getType() === 'movetotargeticon')
                .at(-1)?.template as TemplateRef<PickListTransferIconTemplateContext> | undefined)
    );

    /** Effective move all to target icon template. */
    readonly $moveAllToTargetIconTemplate = computed(
        () =>
            this.moveAllToTargetIconTemplate() ??
            (this.templates()
                .filter((item) => item.getType() === 'movealltotargeticon')
                .at(-1)?.template as TemplateRef<PickListTransferIconTemplateContext> | undefined)
    );

    /** Effective move to source icon template. */
    readonly $moveToSourceIconTemplate = computed(
        () =>
            this.moveToSourceIconTemplate() ??
            (this.templates()
                .filter((item) => item.getType() === 'movetosourceicon')
                .at(-1)?.template as TemplateRef<PickListTransferIconTemplateContext> | undefined)
    );

    /** Effective move all to source icon template. */
    readonly $moveAllToSourceIconTemplate = computed(
        () =>
            this.moveAllToSourceIconTemplate() ??
            (this.templates()
                .filter((item) => item.getType() === 'movealltosourceicon')
                .at(-1)?.template as TemplateRef<PickListTransferIconTemplateContext> | undefined)
    );

    /** Effective target filter icon template. */
    readonly $targetFilterIconTemplate = computed(
        () =>
            this.targetFilterIconTemplate() ??
            this.templates()
                .filter((item) => item.getType() === 'targetfiltericon')
                .at(-1)?.template
    );

    /** Effective source filter icon template. */
    readonly $sourceFilterIconTemplate = computed(
        () =>
            this.sourceFilterIconTemplate() ??
            this.templates()
                .filter((item) => item.getType() === 'sourcefiltericon')
                .at(-1)?.template
    );

    constructor() {
        super();
        // Re-apply the host pass-through section after each render (replaces the former
        // ngAfterViewChecked hook).
        afterEveryRender(() => {
            this.bindDirectiveInstance.setAttrs(this.ptm('host'));
        });
    }

    onInit() {
        // Apply the initial breakpoint eagerly — effects only flush after the first template
        // pass, but `createStyle`/`initMedia` read it here.
        this._breakpoint = this.breakpoint();

        if (this.responsive()) {
            this.createStyle();
            this.initMedia();
        }

        if (this.filterBy()) {
            this.sourceFilterOptions = {
                filter: (value) => this.filterSource(value),
                reset: () => this.resetSourceFilter()
            };

            this.targetFilterOptions = {
                filter: (value) => this.filterTarget(value),
                reset: () => this.resetTargetFilter()
            };
        }
    }

    onDestroy() {
        this.destroyStyle();
        this.destroyMedia();
    }

    getButtonProps(direction: string) {
        switch (direction) {
            case 'moveup':
                return { ...this.buttonProps(), ...this.moveUpButtonProps() };
            case 'movetop':
                return { ...this.buttonProps(), ...this.moveTopButtonProps() };
            case 'movedown':
                return { ...this.buttonProps(), ...this.moveDownButtonProps() };
            case 'movebottom':
                return { ...this.buttonProps(), ...this.moveBottomButtonProps() };
            case 'movetotarget':
                return { ...this.buttonProps(), ...this.moveToTargetProps() };
            case 'movealltotarget':
                return { ...this.buttonProps(), ...this.moveAllToTargetProps() };
            case 'movetosource':
                return { ...this.buttonProps(), ...this.moveToSourceProps() };
            case 'movealltosource':
                return { ...this.buttonProps(), ...this.moveAllToSourceProps() };
            default:
                return this.buttonProps();
        }
    }

    onChangeSelection(e: ListboxChangeEvent, listType: number) {
        this.setSelectionList(listType, e.value);
        const callback = listType === this.SOURCE_LIST ? this.onSourceSelect : this.onTargetSelect;

        callback.emit({ originalEvent: e.originalEvent, items: e.value });
    }

    onSourceItemDblClick() {
        if (this.disabled()) {
            return;
        }

        this.moveRight();
        this.triggerChangeDetection();
    }

    onTargetItemDblClick() {
        if (this.disabled()) {
            return;
        }

        this.moveLeft();
        this.triggerChangeDetection();
    }

    onFilter(event: KeyboardEvent, listType: number) {
        let query = (<HTMLInputElement>event.target).value;
        if (listType === this.SOURCE_LIST) this.filterSource(query);
        else if (listType === this.TARGET_LIST) this.filterTarget(query);
    }

    filterSource(value: any = '') {
        this.filterValueSource = value.trim().toLocaleLowerCase(this.filterLocale());
        this.filter(<any[]>this.source(), this.SOURCE_LIST);
        this.onSourceFilter.emit({ query: this.filterValueSource, value: this.visibleOptionsSource });
    }

    filterTarget(value: any = '') {
        this.filterValueTarget = value.trim().toLocaleLowerCase(this.filterLocale());
        this.filter(<any[]>this.target(), this.TARGET_LIST);
        this.onTargetFilter.emit({ query: this.filterValueTarget, value: this.visibleOptionsTarget });
    }

    filter(data: any[], listType: number) {
        let searchFields = (<string>this.filterBy()).split(',');

        if (listType === this.SOURCE_LIST) {
            this.visibleOptionsSource = this.filterService.filter(data, searchFields, this.filterValueSource, this.filterMatchMode(), this.filterLocale());
            this.onSourceFilter.emit({ query: this.filterValueSource, value: this.visibleOptionsSource });
        } else if (listType === this.TARGET_LIST) {
            this.visibleOptionsTarget = this.filterService.filter(data, searchFields, this.filterValueTarget, this.filterMatchMode(), this.filterLocale());
            this.onTargetFilter.emit({ query: this.filterValueTarget, value: this.visibleOptionsTarget });
        }
    }

    isItemVisible(item: any, listType: number): boolean | undefined {
        if (listType == this.SOURCE_LIST) return this.isVisibleInList(<any[]>this.visibleOptionsSource, item, <string>this.filterValueSource);
        else return this.isVisibleInList(<any[]>this.visibleOptionsTarget, item, <string>this.filterValueTarget);
    }

    isEmpty(listType: number) {
        if (listType == this.SOURCE_LIST) return this.filterValueSource ? !this.visibleOptionsSource || this.visibleOptionsSource.length === 0 : !this.source() || this.source().length === 0;
        else return this.filterValueTarget ? !this.visibleOptionsTarget || this.visibleOptionsTarget.length === 0 : !this.target() || this.target().length === 0;
    }

    isVisibleInList(data: any[], item: any, filterValue: string): boolean | undefined {
        if (filterValue && filterValue.trim().length) {
            for (let i = 0; i < data.length; i++) {
                if (item == data[i]) {
                    return true;
                }
            }
        } else {
            return true;
        }
    }

    onItemTouchEnd() {
        if (this.disabled()) {
            return;
        }

        this.itemTouched = true;
    }

    private sortByIndexInList(items: any[], list: any) {
        return items.sort((item1, item2) => findIndexInList(item1, list) - findIndexInList(item2, list));
    }

    triggerChangeDetection() {
        this.listViewTargetChild().cd.markForCheck();
        this.listViewSourceChild().cd.markForCheck();
    }

    moveUp(listElement: any, list: any[], selectedItems: any[], callback: OutputEmitterRef<any>, listType: number) {
        if (selectedItems && selectedItems.length) {
            selectedItems = this.sortByIndexInList(selectedItems, list);
            for (let i = 0; i < selectedItems.length; i++) {
                let selectedItem = selectedItems[i];
                let selectedItemIndex: number = findIndexInList(selectedItem, list);

                if (selectedItemIndex != 0) {
                    let movedItem = list[selectedItemIndex];
                    let temp = list[selectedItemIndex - 1];
                    list[selectedItemIndex - 1] = movedItem;
                    list[selectedItemIndex] = temp;
                } else {
                    break;
                }
            }

            if (this.dragdrop() && ((this.filterValueSource && listType === this.SOURCE_LIST) || (this.filterValueTarget && listType === this.TARGET_LIST))) this.filter(list, listType);

            callback.emit({ items: selectedItems });
            this.triggerChangeDetection();
        }
    }

    moveTop(listElement: any, list: any[], selectedItems: any[], callback: OutputEmitterRef<any>, listType: number) {
        if (selectedItems && selectedItems.length) {
            selectedItems = this.sortByIndexInList(selectedItems, list);
            for (let i = 0; i < selectedItems.length; i++) {
                let selectedItem = selectedItems[i];
                let selectedItemIndex: number = findIndexInList(selectedItem, list);

                if (selectedItemIndex != 0) {
                    let movedItem = list.splice(selectedItemIndex, 1)[0];
                    list.unshift(movedItem);
                } else {
                    break;
                }
            }

            if (this.dragdrop() && ((this.filterValueSource && listType === this.SOURCE_LIST) || (this.filterValueTarget && listType === this.TARGET_LIST))) this.filter(list, listType);

            listElement.scrollTop = 0;
            callback.emit({ items: selectedItems });
            this.triggerChangeDetection();
        }
    }

    moveDown(listElement: any, list: any[], selectedItems: any[], callback: OutputEmitterRef<any>, listType: number) {
        if (selectedItems && selectedItems.length) {
            selectedItems = this.sortByIndexInList(selectedItems, list);
            for (let i = selectedItems.length - 1; i >= 0; i--) {
                let selectedItem = selectedItems[i];
                let selectedItemIndex: number = findIndexInList(selectedItem, list);

                if (selectedItemIndex != list.length - 1) {
                    let movedItem = list[selectedItemIndex];
                    let temp = list[selectedItemIndex + 1];
                    list[selectedItemIndex + 1] = movedItem;
                    list[selectedItemIndex] = temp;
                } else {
                    break;
                }
            }

            if (this.dragdrop() && ((this.filterValueSource && listType === this.SOURCE_LIST) || (this.filterValueTarget && listType === this.TARGET_LIST))) this.filter(list, listType);

            callback.emit({ items: selectedItems });
            this.triggerChangeDetection();
        }
    }

    moveBottom(listElement: any, list: any[], selectedItems: any[], callback: OutputEmitterRef<any>, listType: number) {
        if (selectedItems && selectedItems.length) {
            selectedItems = this.sortByIndexInList(selectedItems, list);
            for (let i = selectedItems.length - 1; i >= 0; i--) {
                let selectedItem = selectedItems[i];
                let selectedItemIndex: number = findIndexInList(selectedItem, list);

                if (selectedItemIndex != list.length - 1) {
                    let movedItem = list.splice(selectedItemIndex, 1)[0];
                    list.push(movedItem);
                } else {
                    break;
                }
            }

            if (this.dragdrop() && ((this.filterValueSource && listType === this.SOURCE_LIST) || (this.filterValueTarget && listType === this.TARGET_LIST))) this.filter(list, listType);

            listElement.scrollTop = listElement.scrollHeight;
            callback.emit({ items: selectedItems });
            this.triggerChangeDetection();
        }
    }

    moveRight() {
        if (this.selectedItemsSource && this.selectedItemsSource.length) {
            let itemsToMove = [...this.selectedItemsSource];
            for (let i = 0; i < itemsToMove.length; i++) {
                let selectedItem = itemsToMove[i];
                if (findIndexInList(selectedItem, this.target() || []) == -1) {
                    this.target()?.push(this.source()?.splice(findIndexInList(selectedItem, this.source()), 1)[0]);

                    if (this.visibleOptionsSource?.includes(selectedItem)) {
                        this.visibleOptionsSource.splice(findIndexInList(selectedItem, this.visibleOptionsSource), 1);
                    }
                }
            }

            this.onMoveToTarget.emit({
                items: itemsToMove
            });

            if (this.keepSelection()) {
                this.selectedItemsTarget = [...this.selectedItemsTarget, ...itemsToMove];
            }

            itemsToMove = [];
            this.selectedItemsSource = [];

            if (this.filterValueTarget) {
                this.filter(<any[]>this.target(), this.TARGET_LIST);
            }
            this.triggerChangeDetection();
        }
    }

    moveAllRight() {
        if (this.source()) {
            let movedItems: any = [];

            for (let i = 0; i < this.source().length; i++) {
                if (this.isItemVisible(this.source()[i], this.SOURCE_LIST)) {
                    let removedItem = this.source().splice(i, 1)[0];
                    this.target().push(removedItem);

                    movedItems.push(removedItem);
                    i--;
                }
            }
            this.onMoveAllToTarget.emit({
                items: movedItems
            });
            if (this.keepSelection()) {
                this.selectedItemsTarget = [...this.selectedItemsTarget, ...this.selectedItemsSource];
            }
            this.selectedItemsSource = [];

            if (this.filterValueTarget) {
                this.filter(<any[]>this.target(), this.TARGET_LIST);
            }

            this.visibleOptionsSource = [];
            this.triggerChangeDetection();
        }
    }

    moveLeft() {
        if (this.selectedItemsTarget && this.selectedItemsTarget.length) {
            let itemsToMove = [...this.selectedItemsTarget];
            for (let i = 0; i < itemsToMove.length; i++) {
                let selectedItem = itemsToMove[i];
                if (findIndexInList(selectedItem, this.source() || []) == -1) {
                    this.source()?.push(this.target()?.splice(findIndexInList(selectedItem, this.target()), 1)[0]);

                    if (this.visibleOptionsTarget?.includes(selectedItem)) {
                        this.visibleOptionsTarget.splice(findIndexInList(selectedItem, this.visibleOptionsTarget), 1)[0];
                    }
                }
            }
            this.onMoveToSource.emit({
                items: itemsToMove
            });
            if (this.keepSelection()) {
                this.selectedItemsSource = [...this.selectedItemsSource, itemsToMove];
            }
            itemsToMove = [];
            this.selectedItemsTarget = [];

            if (this.filterValueSource) {
                this.filter(<any[]>this.source(), this.SOURCE_LIST);
            }
            this.triggerChangeDetection();
        }
    }

    moveAllLeft() {
        if (this.target()) {
            let movedItems: any = [];

            for (let i = 0; i < this.target().length; i++) {
                if (this.isItemVisible(this.target()[i], this.TARGET_LIST)) {
                    let removedItem = this.target().splice(i, 1)[0];
                    this.source().push(removedItem);
                    movedItems.push(removedItem);
                    i--;
                }
            }
            this.onMoveAllToSource.emit({
                items: movedItems
            });
            if (this.keepSelection()) {
                this.selectedItemsSource = [...this.selectedItemsSource, ...this.selectedItemsTarget];
            }
            this.selectedItemsTarget = [];

            if (this.filterValueSource) {
                this.filter(<any[]>this.source(), this.SOURCE_LIST);
            }

            this.visibleOptionsTarget = [];
            this.triggerChangeDetection();
        }
    }

    isSelected(item: any, selectedItems: any[]) {
        return this.findIndexInList(item, selectedItems) != -1;
    }

    findIndexInList(item: any, selectedItems: any[]): number {
        return findIndexInList(item, selectedItems);
    }

    onDrop(event: CdkDragDrop<string[]>, listType: number) {
        let isTransfer = event.previousContainer !== event.container;

        let dropIndexes = this.getDropIndexes(event.previousIndex, event.currentIndex, listType, isTransfer, event.item.data);

        if (listType === this.SOURCE_LIST) {
            if (isTransfer) {
                // Moving from target to source
                let itemsToMove: any[] = [];

                // Check if dragged item is in selected items
                if (this.selectedItemsTarget && this.selectedItemsTarget.length > 0 && findIndexInList(event.item.data, this.selectedItemsTarget) !== -1) {
                    // Move all selected items
                    itemsToMove = [...this.selectedItemsTarget];
                } else {
                    // Move only the dragged item
                    itemsToMove = [event.item.data];
                }

                // Sort items by their index in target (to maintain order)
                const sortedItems = this.sortByIndexInList(itemsToMove, this.target() || []);

                // Remove all items from target
                for (let item of sortedItems) {
                    const itemIndex = findIndexInList(item, this.target() || []);
                    if (itemIndex !== -1) {
                        this.target()?.splice(itemIndex, 1);
                    }
                }

                // Add all items to source at the drop position
                for (let i = 0; i < sortedItems.length; i++) {
                    this.source()?.splice(dropIndexes.currentIndex + i, 0, sortedItems[i]);
                }

                // Clear target selection
                this.selectedItemsTarget = [];

                if (this.keepSelection()) {
                    this.selectedItemsSource = [...this.selectedItemsSource, ...itemsToMove];
                }

                if (this.visibleOptionsTarget) {
                    // Update visible options
                    for (let item of itemsToMove) {
                        const visibleIndex = findIndexInList(item, this.visibleOptionsTarget);
                        if (visibleIndex !== -1) {
                            this.visibleOptionsTarget.splice(visibleIndex, 1);
                        }
                    }
                }

                this.onMoveToSource.emit({ items: itemsToMove });
            } else {
                if (this.source()) {
                    moveItemInArray(this.source(), dropIndexes.previousIndex, dropIndexes.currentIndex);
                }
                this.onSourceReorder.emit({ items: [event.item.data] });
            }

            if (this.filterValueSource) {
                this.filter(<any[]>this.source(), this.SOURCE_LIST);
            }
        } else {
            if (isTransfer) {
                // Moving from source to target
                let itemsToMove: any[] = [];

                // Check if dragged item is in selected items
                if (this.selectedItemsSource && this.selectedItemsSource.length > 0 && findIndexInList(event.item.data, this.selectedItemsSource) !== -1) {
                    // Move all selected items
                    itemsToMove = [...this.selectedItemsSource];
                } else {
                    // Move only the dragged item
                    itemsToMove = [event.item.data];
                }

                // Sort items by their index in source (to maintain order)
                const sortedItems = this.sortByIndexInList(itemsToMove, this.source() || []);

                // Remove all items from source
                for (let item of sortedItems) {
                    const itemIndex = findIndexInList(item, this.source() || []);
                    if (itemIndex !== -1) {
                        this.source()?.splice(itemIndex, 1);
                    }
                }

                // Add all items to target at the drop position
                for (let i = 0; i < sortedItems.length; i++) {
                    this.target()?.splice(dropIndexes.currentIndex + i, 0, sortedItems[i]);
                }

                // Clear source selection
                this.selectedItemsSource = [];

                if (this.keepSelection()) {
                    this.selectedItemsTarget = [...this.selectedItemsTarget, ...itemsToMove];
                }

                if (this.visibleOptionsSource) {
                    // Update visible options
                    for (let item of itemsToMove) {
                        const visibleIndex = findIndexInList(item, this.visibleOptionsSource);
                        if (visibleIndex !== -1) {
                            this.visibleOptionsSource.splice(visibleIndex, 1);
                        }
                    }
                }

                this.onMoveToTarget.emit({ items: itemsToMove });
            } else {
                if (this.target()) {
                    moveItemInArray(this.target(), dropIndexes.previousIndex, dropIndexes.currentIndex);
                }
                this.onTargetReorder.emit({ items: [event.item.data] });
            }

            if (this.filterValueTarget) {
                this.filter(<any[]>this.target(), this.TARGET_LIST);
            }
        }

        // Only trigger change detection for transfers, not reordering
        // Reordering modifies arrays in-place and triggerChangeDetection() would override changes
        if (isTransfer) {
            this.triggerChangeDetection();
        }
        this.cd.markForCheck();
    }

    onListFocus(event, listType) {
        this.onFocus.emit(event);
    }

    onListBlur(event, listType) {
        this.onBlur.emit(event);
    }

    getListElement(listType: number) {
        return listType === this.SOURCE_LIST ? this.listViewSourceChild().el.nativeElement : this.listViewTargetChild().el.nativeElement;
    }

    getListItems(listType: number) {
        let listElemet = this.getListElement(listType);

        return find(listElemet, 'li.p-picklist-item');
    }

    getLatestSelectedVisibleOptionIndex(visibleList: any[], selectedItems: any[]): number {
        const latestSelectedItem = [...selectedItems].reverse().find((item) => visibleList.includes(item));
        return latestSelectedItem !== undefined ? visibleList.indexOf(latestSelectedItem) : -1;
    }

    getVisibleList(listType: number) {
        if (listType === this.SOURCE_LIST) {
            return this.visibleOptionsSource && this.visibleOptionsSource.length > 0 ? this.visibleOptionsSource : this.source() && this.source().length > 0 ? this.source() : null;
        }

        return this.visibleOptionsTarget && this.visibleOptionsTarget.length > 0 ? this.visibleOptionsTarget : this.target() && this.target().length > 0 ? this.target() : null;
    }

    setSelectionList(listType: number, selectedItems: any[]) {
        if (listType === this.SOURCE_LIST) {
            this.selectedItemsSource = selectedItems;
        } else {
            this.selectedItemsTarget = selectedItems;
        }
    }

    getDropIndexes(fromIndex: number, toIndex: number, droppedList: number, isTransfer: boolean, data: any[] | any) {
        let previousIndex, currentIndex;

        if (droppedList === this.SOURCE_LIST) {
            previousIndex = isTransfer ? (this.filterValueTarget ? findIndexInList(data, this.target() || []) : fromIndex) : this.filterValueSource ? findIndexInList(data, this.source() || []) : fromIndex;
            currentIndex = this.filterValueSource ? this.findFilteredCurrentIndex(this.visibleOptionsSource || [], toIndex, this.source() || []) : toIndex;
        } else {
            previousIndex = isTransfer ? (this.filterValueSource ? findIndexInList(data, this.source() || []) : fromIndex) : this.filterValueTarget ? findIndexInList(data, this.target() || []) : fromIndex;
            currentIndex = this.filterValueTarget ? this.findFilteredCurrentIndex(this.visibleOptionsTarget || [], toIndex, this.target() || []) : toIndex;
        }

        return { previousIndex, currentIndex };
    }

    findFilteredCurrentIndex(visibleOptions: any[], index: number, options: any) {
        if (visibleOptions.length === index) {
            let toIndex = findIndexInList(visibleOptions[index - 1], options);

            return toIndex + 1;
        } else {
            return findIndexInList(visibleOptions[index], options);
        }
    }

    resetSourceFilter() {
        this.visibleOptionsSource = null;
        this.filterValueSource = null;
        this.listViewSourceChild().resetFilter();
    }

    resetTargetFilter() {
        this.visibleOptionsTarget = null;
        this.filterValueTarget = null;
        this.listViewTargetChild().resetFilter();
    }

    resetFilter() {
        this.resetSourceFilter();
        this.resetTargetFilter();
    }

    initMedia() {
        if (isPlatformBrowser(this.platformId)) {
            this.media = this.document.defaultView?.matchMedia(`(max-width: ${this._breakpoint})`) || null;
            this.viewChanged = this.media?.matches || false;
            this.bindMediaChangeListener();
        }
    }

    destroyMedia() {
        this.unbindMediaChangeListener();
    }

    bindMediaChangeListener() {
        if (this.media && !this.mediaChangeListener) {
            this.mediaChangeListener = this.renderer.listen(this.media, 'change', (event) => {
                this.viewChanged = event.matches;

                this.cd.markForCheck();
            });
        }
    }

    unbindMediaChangeListener() {
        if (this.mediaChangeListener) {
            this.mediaChangeListener();
            this.mediaChangeListener = null;
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
                @media screen and (max-width: ${this._breakpoint}) {
                    .p-picklist[${this.id}] {
                        flex-direction: column;
                    }

                    .p-picklist[${this.id}] .p-picklist-controls {
                        flex-direction: row;
                    }
                }`;

                this.renderer.setProperty(this.styleElement, 'innerHTML', innerHTML);
                setAttribute(this.styleElement, 'nonce', this.config?.csp()?.nonce);
            }
        }
    }

    sourceMoveDisabled() {
        if (this.disabled() || !this.selectedItemsSource.length) {
            return true;
        }
    }

    targetMoveDisabled() {
        if (this.disabled() || !this.selectedItemsTarget.length) {
            return true;
        }
    }

    moveRightDisabled() {
        return this.disabled() || isEmpty(this.selectedItemsSource);
    }

    moveLeftDisabled() {
        return this.disabled() || isEmpty(this.selectedItemsTarget);
    }

    moveAllRightDisabled() {
        return this.disabled() || isEmpty(this.source());
    }

    moveAllLeftDisabled() {
        return this.disabled() || isEmpty(this.target());
    }

    destroyStyle() {
        if (this.styleElement) {
            this.renderer.removeChild(this.document.head, this.styleElement);
            this.styleElement = null;
            ``;
        }
    }
}

@NgModule({
    imports: [PickList, SharedModule],
    exports: [PickList, SharedModule]
})
export class PickListModule {}
