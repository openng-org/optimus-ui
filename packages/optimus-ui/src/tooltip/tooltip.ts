import { afterNextRender, booleanAttribute, computed, Directive, effect, ElementRef, inject, input, NgModule, NgZone, numberAttribute, signal, TemplateRef, untracked, ViewContainerRef } from '@angular/core';
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
    providers: [TooltipStyle, { provide: PARENT_INSTANCE, useExisting: Tooltip }]
})
export class Tooltip extends BaseComponent<TooltipPassThroughOptions> {
    zone = inject(NgZone);
    private viewContainer = inject(ViewContainerRef);

    componentName = 'Tooltip';

    /**
     * Position of the tooltip.
     * @group Props
     */
    tooltipPosition = input<'right' | 'left' | 'top' | 'bottom' | string | undefined>(undefined);
    /**
     * Event to show the tooltip.
     * @group Props
     */
    tooltipEvent = input<'hover' | 'focus' | 'both'>('hover');
    /**
     * Type of CSS position.
     * @group Props
     */
    positionStyle = input<string | undefined>(undefined);
    /**
     * Style class of the tooltip.
     * @group Props
     */
    tooltipStyleClass = input<string | undefined>(undefined);
    /**
     * Whether the z-index should be managed automatically to always go on top or have a fixed value.
     * @group Props
     */
    tooltipZIndex = input<string | undefined>(undefined);
    /**
     * By default the tooltip contents are rendered as text. Set to false to support html tags in the content.
     * @group Props
     */
    escape = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Delay to show the tooltip in milliseconds.
     * @group Props
     */
    showDelay = input<number | undefined, unknown>(undefined, { transform: numberAttribute });
    /**
     * Delay to hide the tooltip in milliseconds.
     * @group Props
     */
    hideDelay = input<number | undefined, unknown>(undefined, { transform: numberAttribute });
    /**
     * Time to wait in milliseconds to hide the tooltip even it is active.
     * @group Props
     */
    life = input<number | undefined, unknown>(undefined, { transform: numberAttribute });
    /**
     * Specifies the additional vertical offset of the tooltip from its default position.
     * @group Props
     */
    positionTop = input<number | undefined, unknown>(undefined, { transform: numberAttribute });
    /**
     * Specifies the additional horizontal offset of the tooltip from its default position.
     * @group Props
     */
    positionLeft = input<number | undefined, unknown>(undefined, { transform: numberAttribute });
    /**
     * Whether to hide tooltip when hovering over tooltip content.
     * @group Props
     */
    autoHide = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Automatically adjusts the element position when there is not enough space on the selected position.
     * @group Props
     */
    fitContent = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Whether to hide tooltip on escape key press.
     * @group Props
     */
    hideOnEscape = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Whether to show the tooltip only when the target text overflows (e.g., ellipsis is active).
     * @group Props
     */
    showOnEllipsis = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Content of the tooltip.
     * @group Props
     */
    content = input<string | TemplateRef<HTMLElement> | undefined>(undefined, { alias: 'pTooltip' });
    /**
     * When present, it specifies that the component should be disabled.
     * @defaultValue false
     * @group Props
     */
    disabled = input<boolean | undefined>(undefined, { alias: 'tooltipDisabled' });
    /**
     * Specifies the tooltip configuration options for the component.
     * @group Props
     */
    tooltipOptions = input<TooltipOptions | undefined>(undefined);
    /**
     * Target element to attach the overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name).
     * @defaultValue 'self'
     * @group Props
     */
    appendTo = input<HTMLElement | ElementRef | TemplateRef<any> | 'self' | 'body' | null | undefined | any>(undefined);

    _tooltipOptions = signal({
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
    });

    container = signal<any>(undefined);

    tooltipText = signal<any>(undefined);

    showTimeout = signal<any>(undefined);

    hideTimeout = signal<any>(undefined);

    active = signal<boolean | undefined>(undefined);

    mouseEnterListener = signal<Nullable<Function>>(undefined);

    mouseLeaveListener = signal<Nullable<Function>>(undefined);

    containerMouseleaveListener = signal<Nullable<Function>>(undefined);

    clickListener = signal<Nullable<Function>>(undefined);

    focusListener = signal<Nullable<Function>>(undefined);

    blurListener = signal<Nullable<Function>>(undefined);

    touchStartListener = signal<Nullable<Function>>(undefined);

    touchEndListener = signal<Nullable<Function>>(undefined);

    documentTouchListener = signal<Nullable<Function>>(undefined);

    documentEscapeListener = signal<Nullable<Function>>(undefined);

    scrollHandler = signal<any>(undefined);

    resizeListener = signal<any>(undefined);

    _componentStyle = inject(TooltipStyle);

    interactionInProgress = signal(false);

    pointerInside = signal(false);

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

    constructor() {
        super();
        effect(() => {
            const pt = this.pTooltipPT();
            pt && this.directivePT.set(pt);
        });

        effect(() => {
            this.pTooltipUnstyled() && this.directiveUnstyled.set(this.pTooltipUnstyled());
        });

        let previous: Record<string, any> | undefined;

        effect(() => {
            const current: Record<string, any> = {
                tooltipPosition: this.tooltipPosition(),
                tooltipEvent: this.tooltipEvent(),
                appendTo: this.appendTo(),
                positionStyle: this.positionStyle(),
                tooltipStyleClass: this.tooltipStyleClass(),
                tooltipZIndex: this.tooltipZIndex(),
                escape: this.escape(),
                showDelay: this.showDelay(),
                hideDelay: this.hideDelay(),
                life: this.life(),
                positionTop: this.positionTop(),
                positionLeft: this.positionLeft(),
                disabled: this.disabled(),
                content: this.content(),
                autoHide: this.autoHide(),
                showOnEllipsis: this.showOnEllipsis(),
                tooltipOptions: this.tooltipOptions()
            };

            untracked(() => {
                // Record the snapshot before the side effects below, so a throwing show()/hide() does not make every later run re-apply all changes (matches ngOnChanges, which never retried).
                const last = previous;
                previous = current;
                const changed = (key: string) => (last ? !Object.is(last[key], current[key]) : current[key] !== undefined);

                if (changed('tooltipPosition')) {
                    this.setOption({ tooltipPosition: current.tooltipPosition });
                }

                if (changed('tooltipEvent')) {
                    this.setOption({ tooltipEvent: current.tooltipEvent });
                }

                if (changed('appendTo')) {
                    this.setOption({ appendTo: current.appendTo });
                }

                if (changed('positionStyle')) {
                    this.setOption({ positionStyle: current.positionStyle });
                }

                if (changed('tooltipStyleClass')) {
                    this.setOption({ tooltipStyleClass: current.tooltipStyleClass });
                }

                if (changed('tooltipZIndex')) {
                    this.setOption({ tooltipZIndex: current.tooltipZIndex });
                }

                if (changed('escape')) {
                    this.setOption({ escape: current.escape });
                }

                if (changed('showDelay')) {
                    this.setOption({ showDelay: current.showDelay });
                }

                if (changed('hideDelay')) {
                    this.setOption({ hideDelay: current.hideDelay });
                }

                if (changed('life')) {
                    this.setOption({ life: current.life });
                }

                if (changed('positionTop')) {
                    this.setOption({ positionTop: current.positionTop });
                }

                if (changed('positionLeft')) {
                    this.setOption({ positionLeft: current.positionLeft });
                }

                if (changed('disabled')) {
                    this.deactivate();
                    this.setOption({ disabled: current.disabled });
                }

                if (changed('content')) {
                    this.setOption({ tooltipLabel: current.content });

                    if (this.active()) {
                        if (current.content) {
                            if (this.container() && this.container().offsetParent) {
                                this.updateText();
                                this.align();
                            } else {
                                this.show();
                            }
                        } else {
                            this.hide();
                        }
                    }
                }

                if (changed('autoHide')) {
                    this.setOption({ autoHide: current.autoHide });
                }

                if (changed('showOnEllipsis')) {
                    this.setOption({ showOnEllipsis: current.showOnEllipsis });
                }

                if (changed('tooltipOptions')) {
                    this._tooltipOptions.update((options) => ({ ...options, ...current.tooltipOptions }));
                    this.deactivate();
                }
            });
        });

        afterNextRender(() => {
            this.zone.runOutsideAngular(() => {
                const tooltipEvent = this.getOption('tooltipEvent');

                if (tooltipEvent === 'hover' || tooltipEvent === 'both') {
                    this.mouseEnterListener.set(this.onMouseEnter.bind(this));
                    this.mouseLeaveListener.set(this.onMouseLeave.bind(this));
                    this.clickListener.set(this.onInputClick.bind(this));
                    this.el.nativeElement.addEventListener('mouseenter', this.mouseEnterListener());
                    this.el.nativeElement.addEventListener('click', this.clickListener());
                    this.el.nativeElement.addEventListener('mouseleave', this.mouseLeaveListener());

                    // Touch support
                    this.touchStartListener.set(this.onTouchStart.bind(this));
                    this.touchEndListener.set(this.onTouchEnd.bind(this));
                    this.el.nativeElement.addEventListener('touchstart', this.touchStartListener(), { passive: true });
                    this.el.nativeElement.addEventListener('touchend', this.touchEndListener(), { passive: true });
                }
                if (tooltipEvent === 'focus' || tooltipEvent === 'both') {
                    this.focusListener.set(this.onFocus.bind(this));
                    this.blurListener.set(this.onBlur.bind(this));

                    let target = this.el.nativeElement.querySelector('.p-component');

                    if (!target) {
                        target = this.getTarget(this.el.nativeElement);
                    }

                    target.addEventListener('focus', this.focusListener());
                    target.addEventListener('blur', this.blurListener());
                }
            });
        });
    }

    isAutoHide = computed<boolean>(() => this.getOption('autoHide'));

    onMouseEnter(e: Event) {
        // Chrome re-dispatches mouseenter on the host when the element the pointer sits on is
        // detached (e.g. an overlay rendered inside the host closing on click), without the
        // pointer ever leaving. An enter without a preceding leave is not a new hover, so
        // ignore it - otherwise a tooltip dismissed by that very click comes straight back.
        if (this.pointerInside()) {
            return;
        }

        this.pointerInside.set(true);

        if (!this.container() && !this.showTimeout()) {
            this.activate();
        }
    }

    onMouseLeave(e: MouseEvent) {
        this.pointerInside.set(false);

        if (!this.isAutoHide()) {
            const valid = hasClass(e.relatedTarget as any, 'p-tooltip') || hasClass(e.relatedTarget as any, 'p-tooltip-text') || hasClass(e.relatedTarget as any, 'p-tooltip-arrow');
            !valid && this.deactivate();
        } else {
            this.deactivate();
        }
    }

    onTouchStart(e: TouchEvent) {
        if (!this.container() && !this.showTimeout()) {
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
        if (!this.documentTouchListener()) {
            this.documentTouchListener.set(
                this.renderer.listen('document', 'touchstart', (e: TouchEvent) => {
                    if (this.container() && !this.container().contains(e.target) && !this.el.nativeElement.contains(e.target)) {
                        this.deactivate();
                        this.unbindDocumentTouchListener();
                    }
                })
            );
        }
    }

    unbindDocumentTouchListener() {
        if (this.documentTouchListener()) {
            this.documentTouchListener()!();
            this.documentTouchListener.set(null);
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
        if (!this.interactionInProgress()) {
            if (this.getOption('showOnEllipsis') && !this.hasEllipsis()) {
                return;
            }
            this.active.set(true);
            this.clearHideTimeout();

            if (this.getOption('showDelay'))
                this.showTimeout.set(
                    setTimeout(() => {
                        this.show();
                    }, this.getOption('showDelay'))
                );
            else this.show();

            if (this.getOption('life')) {
                let duration = this.getOption('showDelay') ? this.getOption('life') + this.getOption('showDelay') : this.getOption('life');
                this.hideTimeout.set(
                    setTimeout(() => {
                        this.hide();
                    }, duration)
                );
            }

            if (this.getOption('hideOnEscape')) {
                this.documentEscapeListener.set(
                    this.renderer.listen('document', 'keydown.escape', () => {
                        this.deactivate();
                        this.documentEscapeListener()?.();
                    })
                );
            }
            this.interactionInProgress.set(true);
        }
    }

    deactivate() {
        this.interactionInProgress.set(false);
        this.active.set(false);
        this.clearShowTimeout();

        if (this.getOption('hideDelay')) {
            this.clearHideTimeout(); //life timeout
            this.hideTimeout.set(
                setTimeout(() => {
                    this.hide();
                }, this.getOption('hideDelay'))
            );
        } else {
            this.hide();
        }

        if (this.documentEscapeListener()) {
            this.documentEscapeListener()!();
        }
    }

    create() {
        if (this.container()) {
            this.clearHideTimeout();
            this.remove();
        }

        this.container.set(createElement('div', { class: this.cx('root'), 'p-bind': this.ptm('root'), 'data-pc-section': 'root' }));
        this.container().setAttribute('role', 'tooltip');
        let tooltipArrow = createElement('div', { class: this.cx('arrow'), 'p-bind': this.ptm('arrow'), 'data-pc-section': 'arrow' });
        this.container().appendChild(tooltipArrow);
        this.tooltipText.set(createElement('div', { class: this.cx('text'), 'p-bind': this.ptm('text'), 'data-pc-section': 'text' }));

        this.updateText();

        if (this.getOption('positionStyle')) {
            this.container().style.position = this.getOption('positionStyle');
        }

        this.container().appendChild(this.tooltipText());

        if (this.getOption('appendTo') === 'body') document.body.appendChild(this.container());
        else if (this.getOption('appendTo') === 'target') appendChild(this.container(), this.el.nativeElement);
        else appendChild(this.getOption('appendTo'), this.container());

        this.container().style.display = 'none';

        if (this.fitContent()) {
            this.container().style.width = 'fit-content';
        }

        if (this.isAutoHide()) {
            this.container().style.pointerEvents = 'none';
        } else {
            this.container().style.pointerEvents = 'unset';
            this.bindContainerMouseleaveListener();
        }
    }

    bindContainerMouseleaveListener() {
        if (!this.containerMouseleaveListener()) {
            const targetEl: any = this.container() ?? this.container().nativeElement;

            this.containerMouseleaveListener.set(
                this.renderer.listen(targetEl, 'mouseleave', (e) => {
                    this.deactivate();
                })
            );
        }
    }

    unbindContainerMouseleaveListener() {
        if (this.containerMouseleaveListener()) {
            this.bindContainerMouseleaveListener();
            this.containerMouseleaveListener.set(null);
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
                this.container() && (this.container().style.display = 'inline-block');
                this.container() && this.align();
            }, 100);
        } else {
            this.container().style.display = 'inline-block';
            this.align();
        }

        fadeIn(this.container(), 250);

        if (this.getOption('tooltipZIndex') === 'auto') ZIndexUtils.set('tooltip', this.container(), this.config.zIndex.tooltip);
        else this.container().style.zIndex = this.getOption('tooltipZIndex');

        this.bindDocumentResizeListener();
        this.bindScrollListener();
    }

    hide() {
        if (this.getOption('tooltipZIndex') === 'auto') {
            ZIndexUtils.clear(this.container());
        }
        this.remove();
    }

    updateText() {
        const content = this.getOption('tooltipLabel');
        if (content && typeof (content as TemplateRef<any>).createEmbeddedView === 'function') {
            const embeddedViewRef = this.viewContainer.createEmbeddedView(content);
            embeddedViewRef.detectChanges();
            embeddedViewRef.rootNodes.forEach((node) => this.tooltipText().appendChild(node));
        } else if (this.getOption('escape')) {
            this.tooltipText().textContent = '';
            this.tooltipText().appendChild(document.createTextNode(content));
        } else {
            this.tooltipText().innerHTML = content;
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

    private get activeElement(): HTMLElement {
        return this.el.nativeElement.nodeName.startsWith('P-') ? (findSingle(this.el.nativeElement, '.p-component') as HTMLElement) : this.el.nativeElement;
    }

    alignRight() {
        this.preAlign('right');
        const el = this.activeElement;
        const offsetLeft = getOuterWidth(el);
        const offsetTop = (getOuterHeight(el) - getOuterHeight(this.container())) / 2;
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
        let offsetLeft = getOuterWidth(this.container());
        let offsetTop = (getOuterHeight(this.el.nativeElement) - getOuterHeight(this.container())) / 2;
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
        let elementWidth = getOuterWidth(this.container());

        let offsetLeft = (getOuterWidth(this.el.nativeElement) - getOuterWidth(this.container())) / 2;
        let offsetTop = getOuterHeight(this.container());
        this.alignTooltip(offsetLeft, -offsetTop);

        let elementRelativeCenter = hostOffset.left - this.getHostOffset().left + elementWidth / 2;
        arrowElement.style.top = null;
        arrowElement.style.right = null;
        arrowElement.style.bottom = '0';
        arrowElement.style.left = elementRelativeCenter + 'px';
    }

    getArrowElement(): any {
        return findSingle(this.container(), '[data-pc-section="arrow"]');
    }

    alignBottom() {
        this.preAlign('bottom');
        let arrowElement = this.getArrowElement();
        let elementWidth = getOuterWidth(this.container());
        let hostOffset = this.getHostOffset();
        let offsetLeft = (getOuterWidth(this.el.nativeElement) - getOuterWidth(this.container())) / 2;
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
        this.container().style.left = left + this.getOption('positionLeft') + 'px';
        this.container().style.top = top + this.getOption('positionTop') + 'px';
    }

    setOption(option: any) {
        this._tooltipOptions.update((options) => ({ ...options, ...option }));
    }

    getOption(option: string): any {
        return this._tooltipOptions()[option as keyof TooltipOptions];
    }

    getTarget(el: Element) {
        return hasClass(el, 'p-inputwrapper') ? findSingle(el, 'input') : el;
    }

    preAlign(position: string) {
        this.container().style.left = -999 + 'px';
        this.container().style.top = -999 + 'px';
        this.container().className = this.cn(this.cx('root'), this.ptm('root')?.class, 'p-tooltip-' + position, this.getOption('tooltipStyleClass'));
    }

    isOutOfBounds(): boolean {
        let offset = this.container().getBoundingClientRect();
        let targetTop = offset.top;
        let targetLeft = offset.left;
        let width = getOuterWidth(this.container());
        let height = getOuterHeight(this.container());
        let viewport = getViewport();

        return targetLeft + width > viewport.width || targetLeft < 0 || targetTop < 0 || targetTop + height > viewport.height;
    }

    onWindowResize(e: Event) {
        this.hide();
    }

    bindDocumentResizeListener() {
        this.zone.runOutsideAngular(() => {
            this.resizeListener.set(this.onWindowResize.bind(this));
            window.addEventListener('resize', this.resizeListener());
        });
    }

    unbindDocumentResizeListener() {
        if (this.resizeListener()) {
            window.removeEventListener('resize', this.resizeListener());
            this.resizeListener.set(null);
        }
    }

    bindScrollListener() {
        if (!this.scrollHandler()) {
            this.scrollHandler.set(
                new ConnectedOverlayScrollHandler(this.el.nativeElement, () => {
                    if (this.container()) {
                        this.hide();
                    }
                })
            );
        }

        this.scrollHandler().bindScrollListener();
    }

    unbindScrollListener() {
        if (this.scrollHandler()) {
            this.scrollHandler().unbindScrollListener();
        }
    }

    unbindEvents() {
        const tooltipEvent = this.getOption('tooltipEvent');

        this.pointerInside.set(false);

        if (tooltipEvent === 'hover' || tooltipEvent === 'both') {
            this.el.nativeElement.removeEventListener('mouseenter', this.mouseEnterListener());
            this.el.nativeElement.removeEventListener('mouseleave', this.mouseLeaveListener());
            this.el.nativeElement.removeEventListener('click', this.clickListener());

            // Touch support
            this.el.nativeElement.removeEventListener('touchstart', this.touchStartListener());
            this.el.nativeElement.removeEventListener('touchend', this.touchEndListener());
            this.unbindDocumentTouchListener();
        }
        if (tooltipEvent === 'focus' || tooltipEvent === 'both') {
            let target = this.el.nativeElement.querySelector('.p-component');

            if (!target) {
                target = this.getTarget(this.el.nativeElement);
            }

            target.removeEventListener('focus', this.focusListener());
            target.removeEventListener('blur', this.blurListener());
        }
        this.unbindDocumentResizeListener();
    }

    remove() {
        if (this.container() && this.container().parentElement) {
            if (this.getOption('appendTo') === 'body') document.body.removeChild(this.container());
            else if (this.getOption('appendTo') === 'target') this.el.nativeElement.removeChild(this.container());
            else removeChild(this.getOption('appendTo'), this.container());
        }

        this.unbindDocumentResizeListener();
        this.unbindScrollListener();
        this.unbindContainerMouseleaveListener();
        this.unbindDocumentTouchListener();
        this.clearTimeouts();
        this.container.set(null);
        this.scrollHandler.set(null);
    }

    clearShowTimeout() {
        if (this.showTimeout()) {
            clearTimeout(this.showTimeout());
            this.showTimeout.set(null);
        }
    }

    clearHideTimeout() {
        if (this.hideTimeout()) {
            clearTimeout(this.hideTimeout());
            this.hideTimeout.set(null);
        }
    }

    clearTimeouts() {
        this.clearShowTimeout();
        this.clearHideTimeout();
    }

    onDestroy() {
        this.unbindEvents();

        if (this.container()) {
            ZIndexUtils.clear(this.container());
        }

        this.remove();

        if (this.scrollHandler()) {
            this.scrollHandler().destroy();
            this.scrollHandler.set(null);
        }

        if (this.documentEscapeListener()) {
            this.documentEscapeListener()!();
        }
    }
}

@NgModule({
    imports: [Tooltip, BindModule],
    exports: [Tooltip, BindModule]
})
export class TooltipModule {}
