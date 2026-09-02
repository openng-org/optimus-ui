import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
    afterEveryRender,
    afterNextRender,
    ChangeDetectionStrategy,
    Component,
    computed,
    contentChild,
    contentChildren,
    ElementRef,
    inject,
    input,
    NgModule,
    NgZone,
    numberAttribute,
    signal,
    TemplateRef,
    viewChild,
    ViewEncapsulation
} from '@angular/core';
import { addClass, getHeight, removeClass, uuid } from '@openng/optimus-ui-utils';
import { PrimeTemplate, SharedModule } from '@openng/optimus-ui/api';
import { BaseComponent, PARENT_INSTANCE } from '@openng/optimus-ui/basecomponent';
import { Bind, BindModule } from '@openng/optimus-ui/bind';
import { Nullable } from '@openng/optimus-ui/ts-helpers';
import { ScrollPanelPassThrough } from '@openng/optimus-ui/types/scrollpanel';
import { ScrollPanelStyle } from './style/scrollpanelstyle';

/**
 * ScrollPanel is a cross browser, lightweight and themable alternative to native browser scrollbar.
 * @group Components
 */
@Component({
    selector: 'p-scroll-panel, p-scrollPanel, p-scrollpanel',
    standalone: true,
    imports: [CommonModule, SharedModule, BindModule],
    template: `
        <div [pBind]="ptm('contentContainer')" [class]="cx('contentContainer')">
            <div #content [pBind]="ptm('content')" [class]="cx('content')" (mouseenter)="moveBar()" (scroll)="onScroll($event)">
                @if (!$contentTemplate()) {
                    <ng-content></ng-content>
                }
                <ng-container *ngTemplateOutlet="$contentTemplate()"></ng-container>
            </div>
        </div>
        <div
            #xBar
            [pBind]="ptm('barX')"
            [class]="cx('barX')"
            tabindex="0"
            role="scrollbar"
            [attr.aria-orientation]="'horizontal'"
            [attr.aria-valuenow]="lastScrollLeft()"
            [attr.aria-controls]="contentId"
            [attr.data-pc-group-section]="'bar'"
            (mousedown)="onXBarMouseDown($event)"
            (keydown)="onKeyDown($event)"
            (keyup)="onKeyUp()"
            (focus)="onFocus($event)"
            (blur)="onBlur()"
        ></div>
        <div
            #yBar
            [pBind]="ptm('barY')"
            [class]="cx('barY')"
            tabindex="0"
            role="scrollbar"
            [attr.aria-orientation]="'vertical'"
            [attr.aria-valuenow]="lastScrollTop()"
            [attr.aria-controls]="contentId"
            (mousedown)="onYBarMouseDown($event)"
            (keydown)="onKeyDown($event)"
            (keyup)="onKeyUp()"
            (focus)="onFocus($event)"
            [attr.data-pc-group-section]="'bar'"
        ></div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [ScrollPanelStyle, { provide: PARENT_INSTANCE, useExisting: ScrollPanel }],
    host: {
        '[class]': 'cx("root")'
    },
    hostDirectives: [Bind]
})
export class ScrollPanel extends BaseComponent<ScrollPanelPassThrough> {
    bindDirectiveInstance = inject(Bind, { self: true });

    _componentStyle = inject(ScrollPanelStyle);

    zone: NgZone = inject(NgZone);

    /**
     * Step factor to scroll the content while pressing the arrow keys.
     * @group Props
     */
    readonly step = input<number, unknown>(5, { transform: numberAttribute });

    readonly contentViewChild = viewChild.required<ElementRef>('content');

    readonly xBarViewChild = viewChild.required<ElementRef>('xBar');

    readonly yBarViewChild = viewChild.required<ElementRef>('yBar');

    /**
     * Custom content template.
     * @group Templates
     */
    readonly contentTemplate = contentChild<TemplateRef<void>>('content', { descendants: false });

    readonly templates = contentChildren(PrimeTemplate);

    componentName = 'ScrollPanel';

    /**
     * Effective content template: the `#content` content child, or (legacy behavior) the last
     * projected `pTemplate` of any type.
     */
    readonly $contentTemplate = computed(() => this.contentTemplate() ?? this.templates().at(-1)?.template);

    scrollYRatio: number | undefined;

    scrollXRatio: number | undefined;

    timeoutFrame: any = (fn: VoidFunction) => setTimeout(fn, 0);

    initialized: boolean = false;

    lastPageY: number | undefined;

    lastPageX: number | undefined;

    isXBarClicked: boolean = false;

    isYBarClicked: boolean = false;

    readonly lastScrollLeft = signal<number>(0);

    readonly lastScrollTop = signal<number>(0);

    readonly orientation = signal<string>('vertical');

    timer: any;

    contentId: string = uuid('pn_id_') + '_content';

    windowResizeListener: VoidFunction | null | undefined;

    contentScrollListener: VoidFunction | null | undefined;

    mouseEnterListener: VoidFunction | null | undefined;

    xBarMouseDownListener: VoidFunction | null | undefined;

    yBarMouseDownListener: VoidFunction | null | undefined;

    documentMouseMoveListener: Nullable<(event?: any) => void>;

    documentMouseUpListener: Nullable<(event?: any) => void>;

    constructor() {
        super();
        // Re-apply the host/root pass-through sections after each render (replaces the former
        // ngAfterViewChecked hook). Bind.setAttrs writes into a signal behind an equality check,
        // so unchanged PT resolutions are no-ops.
        afterEveryRender(() => {
            this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
        });
        afterNextRender(() => {
            if (isPlatformBrowser(this.platformId)) {
                this.zone.runOutsideAngular(() => {
                    this.moveBar();
                    this.moveBar = this.moveBar.bind(this);
                    this.onXBarMouseDown = this.onXBarMouseDown.bind(this);
                    this.onYBarMouseDown = this.onYBarMouseDown.bind(this);
                    this.onDocumentMouseMove = this.onDocumentMouseMove.bind(this);
                    this.onDocumentMouseUp = this.onDocumentMouseUp.bind(this);

                    this.windowResizeListener = this.renderer.listen(window, 'resize', this.moveBar);
                    this.contentScrollListener = this.renderer.listen((this.contentViewChild() as ElementRef).nativeElement, 'scroll', this.moveBar);
                    this.mouseEnterListener = this.renderer.listen((this.contentViewChild() as ElementRef).nativeElement, 'mouseenter', this.moveBar);
                    this.xBarMouseDownListener = this.renderer.listen((this.xBarViewChild() as ElementRef).nativeElement, 'mousedown', this.onXBarMouseDown);
                    this.yBarMouseDownListener = this.renderer.listen((this.yBarViewChild() as ElementRef).nativeElement, 'mousedown', this.onYBarMouseDown);
                    this.calculateContainerHeight();

                    this.initialized = true;
                });
            }
        });
    }

    onDestroy() {
        if (this.initialized) {
            this.unbindListeners();
        }
    }

    calculateContainerHeight() {
        let container = (this.el as ElementRef).nativeElement;
        let content = (this.contentViewChild() as ElementRef).nativeElement;
        let xBar = (this.xBarViewChild() as ElementRef).nativeElement;
        const window = this.document.defaultView as Window;

        let containerStyles: { [klass: string]: any } = window.getComputedStyle(container),
            xBarStyles = window.getComputedStyle(xBar),
            pureContainerHeight = getHeight(container) - parseInt(xBarStyles['height'], 10);

        if (containerStyles['max-height'] != 'none' && pureContainerHeight == 0) {
            if (content.offsetHeight + parseInt(xBarStyles['height'], 10) > parseInt(containerStyles['max-height'], 10)) {
                container.style.height = containerStyles['max-height'];
            } else {
                container.style.height = content.offsetHeight + parseFloat(containerStyles.paddingTop) + parseFloat(containerStyles.paddingBottom) + parseFloat(containerStyles.borderTopWidth) + parseFloat(containerStyles.borderBottomWidth) + 'px';
            }
        }
    }

    moveBar() {
        let container = (this.el as ElementRef).nativeElement;
        let content = (this.contentViewChild() as ElementRef).nativeElement;

        /* horizontal scroll */
        let xBar = (this.xBarViewChild() as ElementRef).nativeElement;
        let totalWidth = content.scrollWidth;
        let ownWidth = content.clientWidth;
        let bottom = (container.clientHeight - xBar.clientHeight) * -1;

        this.scrollXRatio = ownWidth / totalWidth;

        /* vertical scroll */
        let yBar = (this.yBarViewChild() as ElementRef).nativeElement;
        let totalHeight = content.scrollHeight;
        let ownHeight = content.clientHeight;
        let right = (container.clientWidth - yBar.clientWidth) * -1;

        this.scrollYRatio = ownHeight / totalHeight;

        this.requestAnimationFrame(() => {
            if ((this.scrollXRatio as number) >= 1) {
                xBar.setAttribute('data-p-scrollpanel-hidden', 'true');
                !this.$unstyled() && addClass(xBar, 'p-scrollpanel-hidden');
            } else {
                xBar.setAttribute('data-p-scrollpanel-hidden', 'false');
                !this.$unstyled() && removeClass(xBar, 'p-scrollpanel-hidden');
                const xBarWidth = Math.max((this.scrollXRatio as number) * 100, 10);
                const xBarLeft = Math.abs((content.scrollLeft * (100 - xBarWidth)) / (totalWidth - ownWidth));
                xBar.style.cssText = 'width:' + xBarWidth + '%; inset-inline-start:' + xBarLeft + '%;bottom:' + bottom + 'px;';
            }

            if ((this.scrollYRatio as number) >= 1) {
                yBar.setAttribute('data-p-scrollpanel-hidden', 'true');
                !this.$unstyled() && addClass(yBar, 'p-scrollpanel-hidden');
            } else {
                yBar.setAttribute('data-p-scrollpanel-hidden', 'false');
                !this.$unstyled() && removeClass(yBar, 'p-scrollpanel-hidden');
                const yBarHeight = Math.max((this.scrollYRatio as number) * 100, 10);
                const yBarTop = (content.scrollTop * (100 - yBarHeight)) / (totalHeight - ownHeight);
                yBar.style.cssText = 'height:' + yBarHeight + '%; top: calc(' + yBarTop + '% - ' + xBar.clientHeight + 'px); inset-inline-end:' + right + 'px;';
            }
        });
        this.cd.markForCheck();
    }

    onScroll(event) {
        if (this.lastScrollLeft() !== event.target.scrollLeft) {
            this.lastScrollLeft.set(event.target.scrollLeft);
            this.orientation.set('horizontal');
        } else if (this.lastScrollTop() !== event.target.scrollTop) {
            this.lastScrollTop.set(event.target.scrollTop);
            this.orientation.set('vertical');
        }

        this.moveBar();
    }

    onKeyDown(event) {
        if (this.orientation() === 'vertical') {
            switch (event.code) {
                case 'ArrowDown': {
                    this.setTimer('scrollTop', this.step());
                    event.preventDefault();
                    break;
                }

                case 'ArrowUp': {
                    this.setTimer('scrollTop', this.step() * -1);
                    event.preventDefault();
                    break;
                }

                case 'ArrowLeft':

                case 'ArrowRight': {
                    event.preventDefault();
                    break;
                }

                default:
                    //no op
                    break;
            }
        } else if (this.orientation() === 'horizontal') {
            switch (event.code) {
                case 'ArrowRight': {
                    this.setTimer('scrollLeft', this.step());
                    event.preventDefault();
                    break;
                }

                case 'ArrowLeft': {
                    this.setTimer('scrollLeft', this.step() * -1);
                    event.preventDefault();
                    break;
                }

                case 'ArrowDown':

                case 'ArrowUp': {
                    event.preventDefault();
                    break;
                }

                default:
                    //no op
                    break;
            }
        }
    }

    onKeyUp() {
        this.clearTimer();
    }

    repeat(bar, step) {
        const contentViewChild = this.contentViewChild();
        contentViewChild.nativeElement[bar] += step;
        this.moveBar();
    }

    setTimer(bar, step) {
        this.clearTimer();
        this.timer = setTimeout(() => {
            this.repeat(bar, step);
        }, 40);
    }

    clearTimer() {
        if (this.timer) {
            clearTimeout(this.timer);
        }
    }

    bindDocumentMouseListeners(): void {
        if (!this.documentMouseMoveListener) {
            this.documentMouseMoveListener = (e) => {
                this.onDocumentMouseMove(e);
            };
            this.document.addEventListener('mousemove', this.documentMouseMoveListener);
        }

        if (!this.documentMouseUpListener) {
            this.documentMouseUpListener = (e) => {
                this.onDocumentMouseUp(e);
            };
            this.document.addEventListener('mouseup', this.documentMouseUpListener);
        }
    }

    unbindDocumentMouseListeners(): void {
        if (this.documentMouseMoveListener) {
            this.document.removeEventListener('mousemove', this.documentMouseMoveListener);
            this.documentMouseMoveListener = null;
        }

        if (this.documentMouseUpListener) {
            document.removeEventListener('mouseup', this.documentMouseUpListener);
            this.documentMouseUpListener = null;
        }
    }

    onYBarMouseDown(e: MouseEvent) {
        this.isYBarClicked = true;
        const yBarViewChild = this.yBarViewChild();
        yBarViewChild.nativeElement.focus();
        this.lastPageY = e.pageY;

        yBarViewChild.nativeElement.setAttribute('data-p-scrollpanel-grabbed', 'true');
        !this.$unstyled() && addClass((yBarViewChild as ElementRef).nativeElement, 'p-scrollpanel-grabbed');

        this.document.body.setAttribute('data-p-scrollpanel-grabbed', 'true');
        !this.$unstyled() && addClass(this.document.body, 'p-scrollpanel-grabbed');
        this.bindDocumentMouseListeners();
        e.preventDefault();
    }

    onXBarMouseDown(e: MouseEvent) {
        this.isXBarClicked = true;
        const xBarViewChild = this.xBarViewChild();
        xBarViewChild.nativeElement.focus();
        this.lastPageX = e.pageX;

        xBarViewChild.nativeElement.setAttribute('data-p-scrollpanel-grabbed', 'false');
        !this.$unstyled() && addClass((xBarViewChild as ElementRef).nativeElement, 'p-scrollpanel-grabbed');

        this.document.body.setAttribute('data-p-scrollpanel-grabbed', 'false');
        !this.$unstyled() && addClass(this.document.body, 'p-scrollpanel-grabbed');

        this.bindDocumentMouseListeners();
        e.preventDefault();
    }

    onDocumentMouseMove(e: MouseEvent) {
        if (this.isXBarClicked) {
            this.onMouseMoveForXBar(e);
        } else if (this.isYBarClicked) {
            this.onMouseMoveForYBar(e);
        } else {
            this.onMouseMoveForXBar(e);
            this.onMouseMoveForYBar(e);
        }
    }

    onMouseMoveForXBar(e: MouseEvent) {
        let deltaX = e.pageX - (this.lastPageX as number);
        this.lastPageX = e.pageX;

        this.requestAnimationFrame(() => {
            (this.contentViewChild() as ElementRef).nativeElement.scrollLeft += deltaX / (this.scrollXRatio as number);
        });
    }

    onMouseMoveForYBar(e: MouseEvent) {
        let deltaY = e.pageY - (this.lastPageY as number);
        this.lastPageY = e.pageY;

        this.requestAnimationFrame(() => {
            (this.contentViewChild() as ElementRef).nativeElement.scrollTop += deltaY / (this.scrollYRatio as number);
        });
    }

    /**
     * Scrolls the top location to the given value.
     * @param scrollTop
     * @group Method
     */
    scrollTop(scrollTop: number) {
        let scrollableHeight = (this.contentViewChild() as ElementRef).nativeElement.scrollHeight - (this.contentViewChild() as ElementRef).nativeElement.clientHeight;
        scrollTop = scrollTop > scrollableHeight ? scrollableHeight : scrollTop > 0 ? scrollTop : 0;
        (this.contentViewChild() as ElementRef).nativeElement.scrollTop = scrollTop;
    }

    onFocus(event) {
        if (this.xBarViewChild().nativeElement?.isSameNode(event.target)) {
            this.orientation.set('horizontal');
        } else if (this.yBarViewChild().nativeElement?.isSameNode(event.target)) {
            this.orientation.set('vertical');
        }
    }

    onBlur() {
        if (this.orientation() === 'horizontal') {
            this.orientation.set('vertical');
        }
    }

    onDocumentMouseUp(e: Event) {
        const yBarViewChild = this.yBarViewChild();
        yBarViewChild.nativeElement.setAttribute('data-p-scrollpanel-grabbed', 'false');
        !this.$unstyled() && removeClass((yBarViewChild as ElementRef).nativeElement, 'p-scrollpanel-grabbed');
        const xBarViewChild = this.xBarViewChild();
        xBarViewChild.nativeElement.setAttribute('data-p-scrollpanel-grabbed', 'false');
        !this.$unstyled() && removeClass((xBarViewChild as ElementRef).nativeElement, 'p-scrollpanel-grabbed');
        this.document.body.setAttribute('data-p-scrollpanel-grabbed', 'false');
        !this.$unstyled() && removeClass(this.document.body, 'p-scrollpanel-grabbed');

        this.unbindDocumentMouseListeners();
        this.isXBarClicked = false;
        this.isYBarClicked = false;
    }

    requestAnimationFrame(f: VoidFunction) {
        let frame = window.requestAnimationFrame || this.timeoutFrame;
        frame(f);
    }

    unbindListeners() {
        if (this.windowResizeListener) {
            this.windowResizeListener();
            this.windowResizeListener = null;
        }

        if (this.contentScrollListener) {
            this.contentScrollListener();
            this.contentScrollListener = null;
        }

        if (this.mouseEnterListener) {
            this.mouseEnterListener();
            this.mouseEnterListener = null;
        }

        if (this.xBarMouseDownListener) {
            this.xBarMouseDownListener();
            this.xBarMouseDownListener = null;
        }

        if (this.yBarMouseDownListener) {
            this.yBarMouseDownListener();
            this.yBarMouseDownListener = null;
        }
    }

    /**
     * Refreshes the position and size of the scrollbar.
     * @group Method
     */
    refresh() {
        this.moveBar();
    }
}

@NgModule({
    imports: [ScrollPanel, SharedModule, BindModule],
    exports: [ScrollPanel, SharedModule, BindModule]
})
export class ScrollPanelModule {}
