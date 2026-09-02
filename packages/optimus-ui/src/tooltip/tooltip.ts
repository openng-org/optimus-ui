import { isPlatformBrowser } from '@angular/common';
import { afterNextRender, booleanAttribute, computed, Directive, effect, ElementRef, inject, input, NgModule, NgZone, numberAttribute, TemplateRef, untracked, ViewContainerRef } from '@angular/core';
import { appendChild, createElement, fadeIn, findSingle, getOuterHeight, getOuterWidth, getViewport, getWindowScrollLeft, getWindowScrollTop, hasClass, removeChild, uuid } from '@openng/optimus-ui-utils';
import { TooltipOptions } from '@openng/optimus-ui/api';
import { BaseComponent, PARENT_INSTANCE } from '@openng/optimus-ui/basecomponent';
import { BindModule } from '@openng/optimus-ui/bind';
import { ConnectedOverlayScrollHandler } from '@openng/optimus-ui/dom';
import { Nullable } from '@openng/optimus-ui/ts-helpers';
import { TooltipPassThroughOptions } from '@openng/optimus-ui/types/tooltip';
import { ZIndexUtils } from '@openng/optimus-ui/utils';
import { TooltipStyle } from './style/tooltipstyle';
import type { TooltipPassThrough } from '@openng/optimus-ui/types/tooltip';

/**
 * Tooltip directive provides advisory information for a component.
 * @group Components
 */
@Directive({
    selector: '[pTooltip]',
    standalone: true,
    providers: [TooltipStyle, { provide: PARENT_INSTANCE, useExisting: Tooltip }]
})
export class Tooltip extends BaseComponent<TooltipPassThroughOptions> {
    zone = inject(NgZone);

    private viewContainer = inject(ViewContainerRef);

    _componentStyle = inject(TooltipStyle);

    /**
     * Position of the tooltip.
     * @group Props
     */
    readonly tooltipPosition = input<'right' | 'left' | 'top' | 'bottom' | string>();

    /**
     * Event to show the tooltip.
     * @group Props
     */
    readonly tooltipEvent = input<'hover' | 'focus' | 'both'>('hover');

    /**
     * Type of CSS position.
     * @group Props
     */
    readonly positionStyle = input<string>();

    /**
     * Style class of the tooltip.
     * @group Props
     */
    readonly tooltipStyleClass = input<string>();

    /**
     * Whether the z-index should be managed automatically to always go on top or have a fixed value.
     * @group Props
     */
    readonly tooltipZIndex = input<string>();

    /**
     * By default the tooltip contents are rendered as text. Set to false to support html tags in the content.
     * @group Props
     */
    readonly escape = input<boolean, unknown>(true, { transform: booleanAttribute });

    /**
     * Delay to show the tooltip in milliseconds.
     * @group Props
     */
    readonly showDelay = input<number | undefined, unknown>(undefined, { transform: numberAttribute });

    /**
     * Delay to hide the tooltip in milliseconds.
     * @group Props
     */
    readonly hideDelay = input<number | undefined, unknown>(undefined, { transform: numberAttribute });

    /**
     * Time to wait in milliseconds to hide the tooltip even it is active.
     * @group Props
     */
    readonly life = input<number | undefined, unknown>(undefined, { transform: numberAttribute });

    /**
     * Specifies the additional vertical offset of the tooltip from its default position.
     * @group Props
     */
    readonly positionTop = input<number | undefined, unknown>(undefined, { transform: numberAttribute });

    /**
     * Specifies the additional horizontal offset of the tooltip from its default position.
     * @group Props
     */
    readonly positionLeft = input<number | undefined, unknown>(undefined, { transform: numberAttribute });

    /**
     * Whether to hide tooltip when hovering over tooltip content.
     * @group Props
     */
    readonly autoHide = input<boolean, unknown>(true, { transform: booleanAttribute });

    /**
     * Automatically adjusts the element position when there is not enough space on the selected position.
     * @group Props
     */
    readonly fitContent = input<boolean, unknown>(true, { transform: booleanAttribute });

    /**
     * Whether to hide tooltip on escape key press.
     * @group Props
     */
    readonly hideOnEscape = input<boolean, unknown>(true, { transform: booleanAttribute });

    /**
     * Whether to show the tooltip only when the target text overflows (e.g., ellipsis is active).
     * @group Props
     */
    readonly showOnEllipsis = input<boolean, unknown>(false, { transform: booleanAttribute });

    /**
     * Content of the tooltip.
     * @group Props
     */
    readonly content = input<string | TemplateRef<HTMLElement> | undefined>(undefined, { alias: 'pTooltip' });

    /**
     * When present, it specifies that the component should be disabled.
     * @defaultValue false
     * @group Props
     */
    readonly disabled = input<boolean | undefined>(undefined, { alias: 'tooltipDisabled' });

    /**
     * Specifies the tooltip configuration options for the component.
     * @group Props
     */
    readonly tooltipOptions = input<TooltipOptions>();

    /**
     * Target element to attach the overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name).
     * @defaultValue 'self'
     * @group Props
     */
    appendTo = input<HTMLElement | ElementRef | TemplateRef<any> | 'self' | 'body' | null | undefined | any>(undefined);

    /**
     * Used to pass attributes to DOM elements inside the Tooltip component.
     * @defaultValue undefined
     * @deprecated use pTooltipPT instead.
     * @group Props
     */
    ptTooltip = input<TooltipPassThrough | undefined>();

    /**
     * Used to pass attributes to DOM elements inside the Tooltip component.
     * @defaultValue undefined
     * @group Props
     */
    pTooltipPT = input<TooltipPassThrough | undefined>();

    /**
     * Indicates whether the component should be rendered without styles.
     * @defaultValue undefined
     * @group Props
     */
    pTooltipUnstyled = input<boolean | undefined>();

    componentName = 'Tooltip';

    $appendTo = computed(() => this.appendTo() || this.config.overlayAppendTo());

    _tooltipOptions: Record<string, any> = {
        tooltipLabel: null,
        tooltipPosition: 'right',
        tooltipEvent: 'hover',
        appendTo: 'body',
        positionStyle: null,
        tooltipStyleClass: null,
        tooltipZIndex: 'auto',
        escape: true,
        disabled: null,
        showDelay: null,
        hideDelay: null,
        positionTop: null,
        positionLeft: null,
        life: null,
        autoHide: true,
        hideOnEscape: true,
        showOnEllipsis: false,
        id: uuid('pn_id_') + '_tooltip'
    };

    container: any;

    tooltipText: any;

    showTimeout: any;

    hideTimeout: any;

    active: boolean | undefined;

    mouseEnterListener: Nullable<Function>;

    mouseLeaveListener: Nullable<Function>;

    containerMouseleaveListener: Nullable<Function>;

    clickListener: Nullable<Function>;

    focusListener: Nullable<Function>;

    blurListener: Nullable<Function>;

    touchStartListener: Nullable<Function>;

    touchEndListener: Nullable<Function>;

    documentTouchListener: Nullable<Function>;

    documentEscapeListener: Nullable<Function>;

    scrollHandler: any;

    resizeListener: any;

    interactionInProgress = false;

    pointerInside = false;

    /**
     * Per-input effects patching the merged `_tooltipOptions` store (replace the former
     * ngOnChanges hook). Each effect skips while its input is unbound/undefined so the store
     * defaults survive, and the `tooltipOptions` effect is declared LAST so a bound options
     * object keeps winning over the individual inputs within the same change, exactly like the
     * legacy ngOnChanges ordering.
     */
    private readonly tooltipPositionEffect = effect(() => {
        const value = this.tooltipPosition();
        if (value !== undefined) untracked(() => this.setOption({ tooltipPosition: value }));
    });

    private readonly tooltipEventEffect = effect(() => {
        const value = this.tooltipEvent();
        if (value !== undefined) untracked(() => this.setOption({ tooltipEvent: value }));
    });

    private readonly appendToEffect = effect(() => {
        const value = this.appendTo();
        if (value !== undefined) untracked(() => this.setOption({ appendTo: value }));
    });

    private readonly positionStyleEffect = effect(() => {
        const value = this.positionStyle();
        if (value !== undefined) untracked(() => this.setOption({ positionStyle: value }));
    });

    private readonly tooltipStyleClassEffect = effect(() => {
        const value = this.tooltipStyleClass();
        if (value !== undefined) untracked(() => this.setOption({ tooltipStyleClass: value }));
    });

    private readonly tooltipZIndexEffect = effect(() => {
        const value = this.tooltipZIndex();
        if (value !== undefined) untracked(() => this.setOption({ tooltipZIndex: value }));
    });

    private readonly escapeEffect = effect(() => {
        const value = this.escape();
        if (value !== undefined) untracked(() => this.setOption({ escape: value }));
    });

    private readonly showDelayEffect = effect(() => {
        const value = this.showDelay();
        if (value !== undefined) untracked(() => this.setOption({ showDelay: value }));
    });

    private readonly hideDelayEffect = effect(() => {
        const value = this.hideDelay();
        if (value !== undefined) untracked(() => this.setOption({ hideDelay: value }));
    });

    private readonly lifeEffect = effect(() => {
        const value = this.life();
        if (value !== undefined) untracked(() => this.setOption({ life: value }));
    });

    private readonly positionTopEffect = effect(() => {
        const value = this.positionTop();
        if (value !== undefined) untracked(() => this.setOption({ positionTop: value }));
    });

    private readonly positionLeftEffect = effect(() => {
        const value = this.positionLeft();
        if (value !== undefined) untracked(() => this.setOption({ positionLeft: value }));
    });

    private readonly hideOnEscapeEffect = effect(() => {
        const value = this.hideOnEscape();
        if (value !== undefined) untracked(() => this.setOption({ hideOnEscape: value }));
    });

    private readonly disabledEffect = effect(() => {
        const value = this.disabled();
        if (value === undefined) return;
        untracked(() => {
            this.setOption({ disabled: value });
            // The legacy `tooltipDisabled` setter deactivated the tooltip on every write.
            this.deactivate();
        });
    });

    private readonly contentEffect = effect(() => {
        const content = this.content();
        if (content === undefined) return;
        untracked(() => {
            this.setOption({ tooltipLabel: content });

            if (this.active) {
                if (content) {
                    if (this.container && this.container.offsetParent) {
                        this.updateText();
                        this.align();
                    } else {
                        this.show();
                    }
                } else {
                    this.hide();
                }
            }
        });
    });

    private readonly autoHideEffect = effect(() => {
        const value = this.autoHide();
        if (value !== undefined) untracked(() => this.setOption({ autoHide: value }));
    });

    private readonly showOnEllipsisEffect = effect(() => {
        const value = this.showOnEllipsis();
        if (value !== undefined) untracked(() => this.setOption({ showOnEllipsis: value }));
    });

    private readonly tooltipOptionsEffect = effect(() => {
        const options = this.tooltipOptions();
        if (options === undefined) return;
        untracked(() => {
            this._tooltipOptions = { ...this._tooltipOptions, ...options };
            this.deactivate();

            if (this.active) {
                if (this.getOption('tooltipLabel')) {
                    if (this.container && this.container.offsetParent) {
                        this.updateText();
                        this.align();
                    } else {
                        this.show();
                    }
                } else {
                    this.hide();
                }
            }
        });
    });

    private get activeElement(): HTMLElement {
        return this.el.nativeElement.nodeName.startsWith('P-') ? (findSingle(this.el.nativeElement, '.p-component') as HTMLElement) : this.el.nativeElement;
    }

    constructor() {
        super();
        effect(() => {
            const pt = this.ptTooltip() || this.pTooltipPT();
            pt && this.directivePT.set(pt);
        });

        effect(() => {
            this.pTooltipUnstyled() && this.directiveUnstyled.set(this.pTooltipUnstyled());
        });

        // Bind the trigger listeners once after the first render (replaces the former
        // ngAfterViewInit hook). The option effects above/below have already patched
        // _tooltipOptions by the time this runs.
        afterNextRender(() => {
            this.bindTriggerEvents();
        });
    }

    onDestroy() {
        this.unbindEvents();

        if (this.container) {
            ZIndexUtils.clear(this.container);
        }

        this.remove();

        if (this.scrollHandler) {
            this.scrollHandler.destroy();
            this.scrollHandler = null;
        }

        if (this.documentEscapeListener) {
            this.documentEscapeListener();
        }
    }

    bindTriggerEvents() {
        if (isPlatformBrowser(this.platformId)) {
            this.zone.runOutsideAngular(() => {
                const tooltipEvent = this.getOption('tooltipEvent');

                if (tooltipEvent === 'hover' || tooltipEvent === 'both') {
                    this.mouseEnterListener = this.onMouseEnter.bind(this);
                    this.mouseLeaveListener = this.onMouseLeave.bind(this);
                    this.clickListener = this.onInputClick.bind(this);
                    this.el.nativeElement.addEventListener('mouseenter', this.mouseEnterListener);
                    this.el.nativeElement.addEventListener('click', this.clickListener);
                    this.el.nativeElement.addEventListener('mouseleave', this.mouseLeaveListener);

                    // Touch support
                    this.touchStartListener = this.onTouchStart.bind(this);
                    this.touchEndListener = this.onTouchEnd.bind(this);
                    this.el.nativeElement.addEventListener('touchstart', this.touchStartListener, { passive: true });
                    this.el.nativeElement.addEventListener('touchend', this.touchEndListener, { passive: true });
                }
                if (tooltipEvent === 'focus' || tooltipEvent === 'both') {
                    this.focusListener = this.onFocus.bind(this);
                    this.blurListener = this.onBlur.bind(this);

                    let target = this.el.nativeElement.querySelector('.p-component');

                    if (!target) {
                        target = this.getTarget(this.el.nativeElement);
                    }

                    target.addEventListener('focus', this.focusListener);
                    target.addEventListener('blur', this.blurListener);
                }
            });
        }
    }

    isAutoHide(): boolean {
        return this.getOption('autoHide');
    }

    onMouseEnter(e: Event) {
        // Chrome re-dispatches mouseenter on the host when the element the pointer sits on is
        // detached (e.g. an overlay rendered inside the host closing on click), without the
        // pointer ever leaving. An enter without a preceding leave is not a new hover, so
        // ignore it - otherwise a tooltip dismissed by that very click comes straight back.
        if (this.pointerInside) {
            return;
        }

        this.pointerInside = true;

        if (!this.container && !this.showTimeout) {
            this.activate();
        }
    }

    onMouseLeave(e: MouseEvent) {
        this.pointerInside = false;

        if (!this.isAutoHide()) {
            const valid = hasClass(e.relatedTarget as any, 'p-tooltip') || hasClass(e.relatedTarget as any, 'p-tooltip-text') || hasClass(e.relatedTarget as any, 'p-tooltip-arrow');
            !valid && this.deactivate();
        } else {
            this.deactivate();
        }
    }

    onTouchStart(e: TouchEvent) {
        if (!this.container && !this.showTimeout) {
            this.activate();

            if (!this.isAutoHide()) {
                this.bindDocumentTouchListener();
            }
        }
    }

    onTouchEnd(e: TouchEvent) {
        if (this.isAutoHide()) {
            this.deactivate();
        }
    }

    bindDocumentTouchListener() {
        if (!this.documentTouchListener) {
            this.documentTouchListener = this.renderer.listen('document', 'touchstart', (e: TouchEvent) => {
                if (this.container && !this.container.contains(e.target) && !this.el.nativeElement.contains(e.target)) {
                    this.deactivate();
                    this.unbindDocumentTouchListener();
                }
            });
        }
    }

    unbindDocumentTouchListener() {
        if (this.documentTouchListener) {
            this.documentTouchListener();
            this.documentTouchListener = null;
        }
    }

    onFocus(e: Event) {
        this.activate();
    }

    onBlur(e: Event) {
        this.deactivate();
    }

    onInputClick(e: Event) {
        this.deactivate();
    }

    hasEllipsis(): boolean {
        const el = this.el.nativeElement;
        return el.offsetWidth < el.scrollWidth || el.offsetHeight < el.scrollHeight;
    }

    activate() {
        if (!this.interactionInProgress) {
            if (this.getOption('showOnEllipsis') && !this.hasEllipsis()) {
                return;
            }
            this.active = true;
            this.clearHideTimeout();

            if (this.getOption('showDelay'))
                this.showTimeout = setTimeout(() => {
                    this.show();
                }, this.getOption('showDelay'));
            else this.show();

            if (this.getOption('life')) {
                let duration = this.getOption('showDelay') ? this.getOption('life') + this.getOption('showDelay') : this.getOption('life');
                this.hideTimeout = setTimeout(() => {
                    this.hide();
                }, duration);
            }

            if (this.getOption('hideOnEscape')) {
                this.documentEscapeListener = this.renderer.listen('document', 'keydown.escape', () => {
                    this.deactivate();
                    this.documentEscapeListener?.();
                });
            }
            this.interactionInProgress = true;
        }
    }

    deactivate() {
        this.interactionInProgress = false;
        this.active = false;
        this.clearShowTimeout();

        if (this.getOption('hideDelay')) {
            this.clearHideTimeout(); //life timeout
            this.hideTimeout = setTimeout(() => {
                this.hide();
            }, this.getOption('hideDelay'));
        } else {
            this.hide();
        }

        if (this.documentEscapeListener) {
            this.documentEscapeListener();
        }
    }

    create() {
        if (this.container) {
            this.clearHideTimeout();
            this.remove();
        }

        this.container = createElement('div', { class: this.cx('root'), 'p-bind': this.ptm('root'), 'data-pc-section': 'root' });
        this.container.setAttribute('role', 'tooltip');
        let tooltipArrow = createElement('div', { class: this.cx('arrow'), 'p-bind': this.ptm('arrow'), 'data-pc-section': 'arrow' });
        this.container.appendChild(tooltipArrow);
        this.tooltipText = createElement('div', { class: this.cx('text'), 'p-bind': this.ptm('text'), 'data-pc-section': 'text' });

        this.updateText();

        if (this.getOption('positionStyle')) {
            this.container.style.position = this.getOption('positionStyle');
        }

        this.container.appendChild(this.tooltipText);

        if (this.getOption('appendTo') === 'body') document.body.appendChild(this.container);
        else if (this.getOption('appendTo') === 'target') appendChild(this.container, this.el.nativeElement);
        else appendChild(this.getOption('appendTo'), this.container);

        this.container.style.display = 'none';

        if (this.fitContent()) {
            this.container.style.width = 'fit-content';
        }

        if (this.isAutoHide()) {
            this.container.style.pointerEvents = 'none';
        } else {
            this.container.style.pointerEvents = 'unset';
            this.bindContainerMouseleaveListener();
        }
    }

    bindContainerMouseleaveListener() {
        if (!this.containerMouseleaveListener) {
            const targetEl: any = this.container ?? this.container.nativeElement;

            this.containerMouseleaveListener = this.renderer.listen(targetEl, 'mouseleave', (e) => {
                this.deactivate();
            });
        }
    }

    unbindContainerMouseleaveListener() {
        if (this.containerMouseleaveListener) {
            this.bindContainerMouseleaveListener();
            this.containerMouseleaveListener = null;
        }
    }

    show() {
        if (!this.getOption('tooltipLabel') || this.getOption('disabled')) {
            return;
        }

        this.create();

        const nativeElement = this.el.nativeElement;
        const pDialogWrapper = nativeElement.closest('p-dialog');

        if (pDialogWrapper) {
            setTimeout(() => {
                this.container && (this.container.style.display = 'inline-block');
                this.container && this.align();
            }, 100);
        } else {
            this.container.style.display = 'inline-block';
            this.align();
        }

        fadeIn(this.container, 250);

        if (this.getOption('tooltipZIndex') === 'auto') ZIndexUtils.set('tooltip', this.container, this.config.zIndex.tooltip);
        else this.container.style.zIndex = this.getOption('tooltipZIndex');

        this.bindDocumentResizeListener();
        this.bindScrollListener();
    }

    hide() {
        if (this.getOption('tooltipZIndex') === 'auto') {
            ZIndexUtils.clear(this.container);
        }
        this.remove();
    }

    updateText() {
        const content = this.getOption('tooltipLabel');
        if (content && typeof (content as TemplateRef<any>).createEmbeddedView === 'function') {
            const embeddedViewRef = this.viewContainer.createEmbeddedView(content);
            embeddedViewRef.detectChanges();
            embeddedViewRef.rootNodes.forEach((node) => this.tooltipText.appendChild(node));
        } else if (this.getOption('escape')) {
            this.tooltipText.textContent = '';
            this.tooltipText.appendChild(document.createTextNode(content));
        } else {
            this.tooltipText.innerHTML = content;
        }
    }

    align() {
        const position = this.getOption('tooltipPosition') as keyof typeof positionPriority;

        const positionPriority = {
            top: [this.alignTop, this.alignBottom, this.alignRight, this.alignLeft],
            bottom: [this.alignBottom, this.alignTop, this.alignRight, this.alignLeft],
            left: [this.alignLeft, this.alignRight, this.alignTop, this.alignBottom],
            right: [this.alignRight, this.alignLeft, this.alignTop, this.alignBottom]
        };

        const alignFns = positionPriority[position] || [];
        for (let [index, alignmentFn] of alignFns.entries()) {
            if (index === 0) alignmentFn.call(this);
            else if (this.isOutOfBounds()) alignmentFn.call(this);
            else break;
        }
    }

    getHostOffset() {
        if (this.getOption('appendTo') === 'body' || this.getOption('appendTo') === 'target') {
            let offset = this.el.nativeElement.getBoundingClientRect();
            let targetLeft = offset.left + getWindowScrollLeft();
            let targetTop = offset.top + getWindowScrollTop();

            return { left: targetLeft, top: targetTop };
        } else {
            return { left: 0, top: 0 };
        }
    }

    alignRight() {
        this.preAlign('right');
        const el = this.activeElement;
        const offsetLeft = getOuterWidth(el);
        const offsetTop = (getOuterHeight(el) - getOuterHeight(this.container)) / 2;
        this.alignTooltip(offsetLeft, offsetTop);
        let arrowElement = this.getArrowElement();

        arrowElement.style.top = '50%';
        arrowElement.style.right = null;
        arrowElement.style.bottom = null;
        arrowElement.style.left = '0';
    }

    alignLeft() {
        this.preAlign('left');
        let arrowElement = this.getArrowElement();
        let offsetLeft = getOuterWidth(this.container);
        let offsetTop = (getOuterHeight(this.el.nativeElement) - getOuterHeight(this.container)) / 2;
        this.alignTooltip(-offsetLeft, offsetTop);

        arrowElement.style.top = '50%';
        arrowElement.style.right = '0';
        arrowElement.style.bottom = null;
        arrowElement.style.left = null;
    }

    alignTop() {
        this.preAlign('top');
        let arrowElement = this.getArrowElement();
        let hostOffset = this.getHostOffset();
        let elementWidth = getOuterWidth(this.container);

        let offsetLeft = (getOuterWidth(this.el.nativeElement) - getOuterWidth(this.container)) / 2;
        let offsetTop = getOuterHeight(this.container);
        this.alignTooltip(offsetLeft, -offsetTop);

        let elementRelativeCenter = hostOffset.left - this.getHostOffset().left + elementWidth / 2;
        arrowElement.style.top = null;
        arrowElement.style.right = null;
        arrowElement.style.bottom = '0';
        arrowElement.style.left = elementRelativeCenter + 'px';
    }

    getArrowElement(): any {
        return findSingle(this.container, '[data-pc-section="arrow"]');
    }

    alignBottom() {
        this.preAlign('bottom');
        let arrowElement = this.getArrowElement();
        let elementWidth = getOuterWidth(this.container);
        let hostOffset = this.getHostOffset();
        let offsetLeft = (getOuterWidth(this.el.nativeElement) - getOuterWidth(this.container)) / 2;
        let offsetTop = getOuterHeight(this.el.nativeElement);
        this.alignTooltip(offsetLeft, offsetTop);

        let elementRelativeCenter = hostOffset.left - this.getHostOffset().left + elementWidth / 2;

        arrowElement.style.top = '0';
        arrowElement.style.right = null;
        arrowElement.style.bottom = null;
        arrowElement.style.left = elementRelativeCenter + 'px';
    }

    alignTooltip(offsetLeft, offsetTop) {
        let hostOffset = this.getHostOffset();
        let left = hostOffset.left + offsetLeft;
        let top = hostOffset.top + offsetTop;
        this.container.style.left = left + this.getOption('positionLeft') + 'px';
        this.container.style.top = top + this.getOption('positionTop') + 'px';
    }

    setOption(option: any) {
        this._tooltipOptions = { ...this._tooltipOptions, ...option };
    }

    getOption(option: string): any {
        return (this._tooltipOptions as any)[option];
    }

    getTarget(el: Element) {
        return hasClass(el, 'p-inputwrapper') ? findSingle(el, 'input') : el;
    }

    preAlign(position: string) {
        this.container.style.left = -999 + 'px';
        this.container.style.top = -999 + 'px';
        this.container.className = this.cn(this.cx('root'), this.ptm('root')?.class, 'p-tooltip-' + position, this.getOption('tooltipStyleClass'));
    }

    isOutOfBounds(): boolean {
        let offset = this.container.getBoundingClientRect();
        let targetTop = offset.top;
        let targetLeft = offset.left;
        let width = getOuterWidth(this.container);
        let height = getOuterHeight(this.container);
        let viewport = getViewport();

        return targetLeft + width > viewport.width || targetLeft < 0 || targetTop < 0 || targetTop + height > viewport.height;
    }

    onWindowResize(e: Event) {
        this.hide();
    }

    bindDocumentResizeListener() {
        this.zone.runOutsideAngular(() => {
            this.resizeListener = this.onWindowResize.bind(this);
            window.addEventListener('resize', this.resizeListener);
        });
    }

    unbindDocumentResizeListener() {
        if (this.resizeListener) {
            window.removeEventListener('resize', this.resizeListener);
            this.resizeListener = null;
        }
    }

    bindScrollListener() {
        if (!this.scrollHandler) {
            this.scrollHandler = new ConnectedOverlayScrollHandler(this.el.nativeElement, () => {
                if (this.container) {
                    this.hide();
                }
            });
        }

        this.scrollHandler.bindScrollListener();
    }

    unbindScrollListener() {
        if (this.scrollHandler) {
            this.scrollHandler.unbindScrollListener();
        }
    }

    unbindEvents() {
        const tooltipEvent = this.getOption('tooltipEvent');

        this.pointerInside = false;

        if (tooltipEvent === 'hover' || tooltipEvent === 'both') {
            this.el.nativeElement.removeEventListener('mouseenter', this.mouseEnterListener);
            this.el.nativeElement.removeEventListener('mouseleave', this.mouseLeaveListener);
            this.el.nativeElement.removeEventListener('click', this.clickListener);

            // Touch support
            this.el.nativeElement.removeEventListener('touchstart', this.touchStartListener);
            this.el.nativeElement.removeEventListener('touchend', this.touchEndListener);
            this.unbindDocumentTouchListener();
        }
        if (tooltipEvent === 'focus' || tooltipEvent === 'both') {
            let target = this.el.nativeElement.querySelector('.p-component');

            if (!target) {
                target = this.getTarget(this.el.nativeElement);
            }

            target.removeEventListener('focus', this.focusListener);
            target.removeEventListener('blur', this.blurListener);
        }
        this.unbindDocumentResizeListener();
    }

    remove() {
        if (this.container && this.container.parentElement) {
            if (this.getOption('appendTo') === 'body') document.body.removeChild(this.container);
            else if (this.getOption('appendTo') === 'target') this.el.nativeElement.removeChild(this.container);
            else removeChild(this.getOption('appendTo'), this.container);
        }

        this.unbindDocumentResizeListener();
        this.unbindScrollListener();
        this.unbindContainerMouseleaveListener();
        this.unbindDocumentTouchListener();
        this.clearTimeouts();
        this.container = null;
        this.scrollHandler = null;
    }

    clearShowTimeout() {
        if (this.showTimeout) {
            clearTimeout(this.showTimeout);
            this.showTimeout = null;
        }
    }

    clearHideTimeout() {
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
            this.hideTimeout = null;
        }
    }

    clearTimeouts() {
        this.clearShowTimeout();
        this.clearHideTimeout();
    }
}

@NgModule({
    imports: [Tooltip, BindModule],
    exports: [Tooltip, BindModule]
})
export class TooltipModule {}
