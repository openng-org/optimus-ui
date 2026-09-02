import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
    afterEveryRender,
    afterNextRender,
    ChangeDetectionStrategy,
    Component,
    computed,
    contentChild,
    contentChildren,
    effect,
    ElementRef,
    forwardRef,
    inject,
    input,
    NgModule,
    numberAttribute,
    output,
    signal,
    untracked,
    ViewEncapsulation
} from '@angular/core';
import { addClass, getHeight, getOuterHeight, getOuterWidth, getWidth, hasClass, isRTL, removeClass } from '@openng/optimus-ui-utils';
import { PrimeTemplate, SharedModule } from '@openng/optimus-ui/api';
import { BaseComponent, PARENT_INSTANCE } from '@openng/optimus-ui/basecomponent';
import { Bind, BindModule } from '@openng/optimus-ui/bind';
import { Nullable, VoidListener } from '@openng/optimus-ui/ts-helpers';
import type { SplitterResizeEndEvent, SplitterResizeStartEvent } from '@openng/optimus-ui/types/splitter';
import { SplitterStyle } from './style/splitterstyle';
import { SplitterPassThrough } from '@openng/optimus-ui/types/splitter';

/**
 * Splitter is utilized to separate and resize panels.
 * @group Components
 */
@Component({
    selector: 'p-splitter',
    standalone: true,
    imports: [CommonModule, SharedModule, BindModule],
    template: `
        @for (panel of panels(); track panel; let i = $index) {
            <div [pBind]="ptm('panel')" [class]="cn(cx('panel'), panelStyleClass())" [ngStyle]="panelStyle()" tabindex="-1">
                <ng-container *ngTemplateOutlet="panel"></ng-container>
            </div>
            @if (i !== panels().length - 1) {
                <div
                    [pBind]="ptm('gutter')"
                    [class]="cx('gutter')"
                    role="separator"
                    tabindex="-1"
                    (mousedown)="onGutterMouseDown($event, i)"
                    (touchstart)="onGutterTouchStart($event, i)"
                    (touchmove)="onGutterTouchMove($event)"
                    (touchend)="onGutterTouchEnd($event)"
                    [attr.data-p-gutter-resizing]="false"
                    [attr.data-p]="dataP()"
                >
                    <div
                        [pBind]="ptm('gutterHandle')"
                        [class]="cx('gutterHandle')"
                        tabindex="0"
                        [ngStyle]="gutterStyle()"
                        [attr.aria-orientation]="layout()"
                        [attr.aria-valuenow]="prevSize()"
                        (keyup)="onGutterKeyUp($event)"
                        (keydown)="onGutterKeyDown($event, i)"
                    ></div>
                </div>
            }
        }
    `,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[class]': "cx('root')",
        '[attr.data-p-gutter-resizing]': 'false',
        '[attr.data-p]': 'dataP()'
    },
    providers: [SplitterStyle, { provide: PARENT_INSTANCE, useExisting: Splitter }],
    hostDirectives: [Bind]
})
export class Splitter extends BaseComponent<SplitterPassThrough> {
    bindDirectiveInstance = inject(Bind, { self: true });

    _componentStyle = inject(SplitterStyle);

    /**
     * Style class of the panel.
     * @group Props
     */
    readonly panelStyleClass = input<string>();

    /**
     * Inline style of the panel.
     * @group Props
     */
    readonly panelStyle = input<{ [klass: string]: any } | null>();

    /**
     * Defines where a stateful splitter keeps its state, valid values are 'session' for sessionStorage and 'local' for localStorage.
     * @group Props
     */
    readonly stateStorage = input<string>('session');

    /**
     * Storage identifier of a stateful Splitter.
     * @group Props
     */
    readonly stateKey = input<string | null>(null);

    /**
     * Orientation of the panels. Valid values are 'horizontal' and 'vertical'.
     * @group Props
     */
    readonly layout = input<string>('horizontal');

    /**
     * Size of the divider in pixels.
     * @group Props
     */
    readonly gutterSize = input<number, unknown>(4, { transform: numberAttribute });

    /**
     * Step factor to increment/decrement the size of the panels while pressing the arrow keys.
     * @group Props
     */
    readonly step = input<number, unknown>(5, { transform: numberAttribute });

    /**
     * Minimum size of the elements relative to 100%.
     * @group Props
     */
    readonly minSizes = input<number[]>([]);

    /**
     * Size of the elements relative to 100%.
     * @group Props
     */
    readonly panelSizes = input<number[]>([]);

    /**
     * Callback to invoke when resize ends.
     * @param {SplitterResizeEndEvent} event - Custom panel resize end event
     * @group Emits
     */
    readonly onResizeEnd = output<SplitterResizeEndEvent>();

    /**
     * Callback to invoke when resize starts.
     * @param {SplitterResizeStartEvent} event - Custom panel resize start event
     * @group Emits
     */
    readonly onResizeStart = output<SplitterResizeStartEvent>();

    splitter = contentChild(forwardRef(() => Splitter));

    readonly templates = contentChildren(PrimeTemplate);

    readonly panelChildren = contentChildren<ElementRef>('panel');

    componentName = 'Splitter';

    /** Re-applies the panel flex-basis values when the `panelSizes` input changes (legacy setter behavior). */
    private readonly panelSizesEffect = effect(() => {
        const panelSizes = this.panelSizes();
        untracked(() => {
            this._panelSizes = panelSizes;

            const panels = this.panels();
            if (this.el && this.el.nativeElement && panels.length > 0) {
                let children = [...this.el.nativeElement.children].filter((child) => child.getAttribute('data-pc-section') === 'panel');

                panels.map((panel, i) => {
                    let panelInitialSize = panelSizes.length - 1 >= i ? panelSizes[i] : null;
                    let panelSize = panelInitialSize || 100 / panels.length;

                    if (children[i]) {
                        children[i].style.flexBasis = 'calc(' + panelSize + '% - ' + (panels.length - 1) * this.gutterSize() + 'px)';
                    }
                });
            }
        });
    });

    nestedState = computed(() => this.splitter());

    /** The panel templates to render: projected `pTemplate` panels followed by `#panel` children. */
    readonly panels = computed<any[]>(() => [...this.templates().map((item) => item.template), ...this.panelChildren()]);

    dragging: boolean = false;

    mouseMoveListener: VoidListener;

    mouseUpListener: VoidListener;

    touchMoveListener: VoidListener;

    touchEndListener: VoidListener;

    size: Nullable<number>;

    gutterElement: Nullable<ElementRef | HTMLElement>;

    startPos: Nullable<number>;

    prevPanelElement: Nullable<ElementRef | HTMLElement>;

    nextPanelElement: Nullable<ElementRef | HTMLElement>;

    nextPanelSize: Nullable<number>;

    prevPanelSize: Nullable<number>;

    _panelSizes: number[] = [];

    prevPanelIndex: Nullable<number>;

    timer: any;

    readonly prevSize = signal<any>(undefined);

    /** Inline size style of a gutter, derived from the layout and gutter size. */
    readonly gutterStyle = computed(() => {
        if (this.horizontal()) return { width: this.gutterSize() + 'px' };
        else return { height: this.gutterSize() + 'px' };
    });

    /** Whether the splitter lays panels out horizontally. */
    readonly horizontal = computed(() => this.layout() === 'horizontal');

    readonly dataP = computed(() =>
        this.cn({
            [this.layout() as string]: this.layout(),
            nested: this.nestedState() != null
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
        afterNextRender(() => {
            if (isPlatformBrowser(this.platformId)) {
                const panels = this.panels();
                if (panels && panels.length) {
                    let initialized = false;
                    if (this.isStateful()) {
                        initialized = this.restoreState();
                    }

                    if (!initialized) {
                        let children = [...this.el.nativeElement.children].filter((child) => child.getAttribute('data-pc-section') === 'panel');
                        let _panelSizes: any = [];

                        panels.map((panel, i) => {
                            let panelInitialSize = this.panelSizes().length - 1 >= i ? this.panelSizes()[i] : null;
                            let panelSize = panelInitialSize || 100 / panels.length;

                            _panelSizes[i] = panelSize;
                            children[i].style.flexBasis = 'calc(' + panelSize + '% - ' + (panels.length - 1) * this.gutterSize() + 'px)';
                        });

                        this._panelSizes = _panelSizes;

                        this.prevSize.set(parseFloat(_panelSizes[0]).toFixed(4));
                    }
                }
            }
        });
    }

    resizeStart(event: TouchEvent | MouseEvent, index: number, isKeyDown?: boolean) {
        this.gutterElement = (event.currentTarget as HTMLElement) || (event.target as HTMLElement).parentElement;
        this.size = this.horizontal() ? getWidth((this.el as ElementRef).nativeElement) : getHeight((this.el as ElementRef).nativeElement);

        if (!isKeyDown) {
            this.dragging = true;
            this.startPos = this.horizontal() ? (event instanceof MouseEvent ? event.pageX : event.changedTouches[0].pageX) : event instanceof MouseEvent ? event.pageY : event.changedTouches[0].pageY;
        }

        this.prevPanelElement = this.gutterElement.previousElementSibling as HTMLElement;
        this.nextPanelElement = this.gutterElement.nextElementSibling as HTMLElement;

        if (isKeyDown) {
            this.prevPanelSize = this.horizontal() ? getOuterWidth(this.prevPanelElement, true) : getOuterHeight(this.prevPanelElement, true);
            this.nextPanelSize = this.horizontal() ? getOuterWidth(this.nextPanelElement, true) : getOuterHeight(this.nextPanelElement, true);
        } else {
            this.prevPanelSize = (100 * (this.horizontal() ? getOuterWidth(this.prevPanelElement, true) : getOuterHeight(this.prevPanelElement, true))) / this.size;
            this.nextPanelSize = (100 * (this.horizontal() ? getOuterWidth(this.nextPanelElement, true) : getOuterHeight(this.nextPanelElement, true))) / this.size;
        }

        this.prevPanelIndex = index;
        addClass(this.gutterElement, 'p-splitter-gutter-resizing');
        this.gutterElement.setAttribute('data-p-gutter-resizing', 'true');
        addClass((this.el as ElementRef).nativeElement, 'p-splitter-resizing');
        this.el.nativeElement.setAttribute('data-p-resizing', 'true');
        this.onResizeStart.emit({ originalEvent: event, sizes: this._panelSizes as number[] });
    }

    onResize(event: MouseEvent, step?: number, isKeyDown?: boolean) {
        let newPos, newPrevPanelSize, newNextPanelSize;

        if (isKeyDown) {
            if (this.horizontal()) {
                newPrevPanelSize = (100 * ((this.prevPanelSize ?? 0) + (step ?? 0))) / (this.size ?? 1);
                newNextPanelSize = (100 * ((this.nextPanelSize ?? 0) - (step ?? 0))) / (this.size ?? 1);
            } else {
                newPrevPanelSize = (100 * ((this.prevPanelSize ?? 0) - (step ?? 0))) / (this.size ?? 1);
                newNextPanelSize = (100 * ((this.nextPanelSize ?? 0) + (step ?? 0))) / (this.size ?? 1);
            }
        } else {
            if (this.horizontal()) {
                if (isRTL(this.el.nativeElement)) {
                    newPos = (((this.startPos ?? 0) - event.pageX) * 100) / (this.size ?? 1);
                } else {
                    newPos = ((event.pageX - (this.startPos ?? 0)) * 100) / (this.size ?? 1);
                }
            } else {
                newPos = ((event.pageY - (this.startPos ?? 0)) * 100) / (this.size ?? 1);
            }

            newPrevPanelSize = (this.prevPanelSize as number) + newPos;
            newNextPanelSize = (this.nextPanelSize as number) - newPos;
        }

        this.prevSize.set(parseFloat(newPrevPanelSize).toFixed(4));

        if (this.validateResize(newPrevPanelSize, newNextPanelSize)) {
            (this.prevPanelElement as HTMLElement).style.flexBasis = 'calc(' + newPrevPanelSize + '% - ' + (this.panels().length - 1) * this.gutterSize() + 'px)';
            (this.nextPanelElement as HTMLElement).style.flexBasis = 'calc(' + newNextPanelSize + '% - ' + (this.panels().length - 1) * this.gutterSize() + 'px)';
            this._panelSizes[this.prevPanelIndex as number] = newPrevPanelSize;
            this._panelSizes[(this.prevPanelIndex as number) + 1] = newNextPanelSize;
        }
    }

    resizeEnd(event: MouseEvent | TouchEvent) {
        if (this.isStateful()) {
            this.saveState();
        }

        this.onResizeEnd.emit({ originalEvent: event, sizes: this._panelSizes });
        removeClass(this.gutterElement as any, 'p-splitter-gutter-resizing');
        removeClass((this.el as ElementRef).nativeElement, 'p-splitter-resizing');
        this.clear();
    }

    onGutterMouseDown(event: MouseEvent, index: number) {
        this.resizeStart(event, index);
        this.bindMouseListeners();
    }

    onGutterTouchStart(event: TouchEvent, index: number) {
        if (event.cancelable) {
            this.resizeStart(event, index);
            this.bindTouchListeners();

            event.preventDefault();
        }
    }

    onGutterTouchMove(event) {
        this.onResize(event);
        event.preventDefault();
    }

    onGutterTouchEnd(event: TouchEvent) {
        this.resizeEnd(event);
        this.unbindTouchListeners();

        if (event.cancelable) event.preventDefault();
    }

    repeat(event, index, step) {
        this.resizeStart(event, index, true);
        this.onResize(event, step, true);
    }

    setTimer(event, index, step) {
        this.clearTimer();
        this.timer = setTimeout(() => {
            this.repeat(event, index, step);
        }, 40);
    }

    clearTimer() {
        if (this.timer) {
            clearTimeout(this.timer);
        }
    }

    onGutterKeyUp(event) {
        this.clearTimer();
        this.resizeEnd(event);
    }

    onGutterKeyDown(event, index) {
        switch (event.code) {
            case 'ArrowLeft': {
                if (this.layout() === 'horizontal') {
                    this.setTimer(event, index, this.step() * -1);
                }

                event.preventDefault();
                break;
            }

            case 'ArrowRight': {
                if (this.layout() === 'horizontal') {
                    this.setTimer(event, index, this.step());
                }

                event.preventDefault();
                break;
            }

            case 'ArrowDown': {
                if (this.layout() === 'vertical') {
                    this.setTimer(event, index, this.step() * -1);
                }

                event.preventDefault();
                break;
            }

            case 'ArrowUp': {
                if (this.layout() === 'vertical') {
                    this.setTimer(event, index, this.step());
                }

                event.preventDefault();
                break;
            }

            default:
                //no op
                break;
        }
    }

    validateResize(newPrevPanelSize: number, newNextPanelSize: number) {
        const minSizes = this.minSizes();
        if (minSizes.length >= 1 && minSizes[0] && minSizes[0] > newPrevPanelSize) {
            return false;
        }

        if (minSizes.length > 1 && minSizes[1] && minSizes[1] > newNextPanelSize) {
            return false;
        }

        return true;
    }

    bindMouseListeners() {
        if (!this.mouseMoveListener) {
            this.mouseMoveListener = this.renderer.listen(this.document, 'mousemove', (event) => {
                this.onResize(event);
            });
        }

        if (!this.mouseUpListener) {
            this.mouseUpListener = this.renderer.listen(this.document, 'mouseup', (event) => {
                this.resizeEnd(event);
                this.unbindMouseListeners();
            });
        }
    }

    bindTouchListeners() {
        if (!this.touchMoveListener) {
            this.touchMoveListener = this.renderer.listen(this.document, 'touchmove', (event) => {
                this.onResize(event.changedTouches[0]);
            });
        }

        if (!this.touchEndListener) {
            this.touchEndListener = this.renderer.listen(this.document, 'touchend', (event) => {
                this.resizeEnd(event);
                this.unbindTouchListeners();
            });
        }
    }

    unbindMouseListeners() {
        if (this.mouseMoveListener) {
            this.mouseMoveListener();
            this.mouseMoveListener = null;
        }

        if (this.mouseUpListener) {
            this.mouseUpListener();
            this.mouseUpListener = null;
        }
    }

    unbindTouchListeners() {
        if (this.touchMoveListener) {
            this.touchMoveListener();
            this.touchMoveListener = null;
        }

        if (this.touchEndListener) {
            this.touchEndListener();
            this.touchEndListener = null;
        }
    }

    clear() {
        this.dragging = false;
        this.size = null;
        this.startPos = null;
        this.prevPanelElement = null;
        this.nextPanelElement = null;
        this.prevPanelSize = null;
        this.nextPanelSize = null;
        this.gutterElement = null;
        this.prevPanelIndex = null;
    }

    isStateful() {
        return this.stateKey() != null;
    }

    getStorage() {
        if (isPlatformBrowser(this.platformId)) {
            switch (this.stateStorage()) {
                case 'local':
                    return this.document.defaultView?.localStorage;

                case 'session':
                    return this.document.defaultView?.sessionStorage;

                default:
                    throw new Error(this.stateStorage() + ' is not a valid value for the state storage, supported values are "local" and "session".');
            }
        } else {
            throw new Error('Storage is not a available by default on the server.');
        }
    }

    saveState() {
        this.getStorage()?.setItem(this.stateKey() as string, JSON.stringify(this._panelSizes));
    }

    restoreState() {
        const storage = this.getStorage();
        const stateString = storage?.getItem(this.stateKey() as string);

        if (stateString) {
            this._panelSizes = JSON.parse(stateString);
            let children = [...(this.el as ElementRef).nativeElement.children].filter((child) => child.getAttribute('data-pc-section') === 'panel');
            children.forEach((child, i) => {
                child.style.flexBasis = 'calc(' + this._panelSizes[i] + '% - ' + (this.panels().length - 1) * this.gutterSize() + 'px)';
            });

            return true;
        }

        return false;
    }
}

@NgModule({
    imports: [Splitter, SharedModule, BindModule],
    exports: [Splitter, SharedModule, BindModule]
})
export class SplitterModule {}
