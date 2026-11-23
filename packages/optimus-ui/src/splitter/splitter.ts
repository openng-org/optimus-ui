import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
    afterEveryRender,
    afterRenderEffect,
    ChangeDetectionStrategy,
    Component,
    computed,
    contentChild,
    ElementRef,
    forwardRef,
    inject,
    input,
    linkedSignal,
    NgModule,
    numberAttribute,
    signal,
    untracked,
    ViewEncapsulation,
    contentChildren,
    output
} from '@angular/core';
import { addClass, getHeight, getOuterHeight, getOuterWidth, getWidth, isRTL, removeClass } from '@openng/optimus-ui-utils';
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
    componentName = 'Splitter';

    bindDirectiveInstance = inject(Bind, { self: true });

    constructor() {
        super();
        afterEveryRender(() => this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root'])));
        afterRenderEffect(() => {
            this.configuredPanelSizes();
            this.gutterSize();
            const panels = this.panels();

            untracked(() => {
                if (!panels.length) {
                    return;
                }

                if (!this.panelSizesInitialized()) {
                    this.panelSizesInitialized.set(true);

                    if (this.isStateful()) {
                        this.restoreState();
                    }
                }

                const configuredPanelSizes = this.configuredPanelSizes();
                const panelSizesSource = this.panelSizesSource();
                const rebuild = panelSizesSource?.configuredPanelSizes !== configuredPanelSizes || panelSizesSource.panelCount !== panels.length;
                const _panelSizes = rebuild ? this.normalizePanelSizes(configuredPanelSizes, panels.length) : this._panelSizes();

                this.panelSizesSource.set({ configuredPanelSizes, panelCount: panels.length });
                this._panelSizes.set(_panelSizes);
                this.applyPanelSizes(_panelSizes);
                this.prevSize.set(_panelSizes[0].toFixed(4));
            });
        });
    }
    /**
     * Style class of the panel.
     * @group Props
     */
    readonly panelStyleClass = input<string | undefined>();
    /**
     * Inline style of the panel.
     * @group Props
     */
    readonly panelStyle = input<{ [klass: string]: any } | null | undefined>();
    /**
     * Defines where a stateful splitter keeps its state, valid values are 'session' for sessionStorage and 'local' for localStorage.
     * @group Props
     */
    readonly stateStorage = input<string | undefined>('session');
    /**
     * Storage identifier of a stateful Splitter.
     * @group Props
     */
    readonly stateKey = input<string | undefined | null>(null);
    /**
     * Orientation of the panels. Valid values are 'horizontal' and 'vertical'.
     * @group Props
     */
    readonly layout = input<string | undefined>('horizontal');
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

    readonly templates = contentChildren(PrimeTemplate);

    readonly panelChildren = contentChildren<ElementRef>('panel');

    splitter = contentChild(forwardRef(() => Splitter));

    nestedState = computed(() => this.splitter());

    panels = computed<any[]>(() => [...this.templates().map((item) => item.template), ...this.panelChildren()]);

    dragging = signal<boolean>(false);

    mouseMoveListener = signal<VoidListener>(undefined);

    mouseUpListener = signal<VoidListener>(undefined);

    touchMoveListener = signal<VoidListener>(undefined);

    touchEndListener = signal<VoidListener>(undefined);

    size = signal<Nullable<number>>(undefined);

    gutterElement = signal<Nullable<ElementRef | HTMLElement>>(undefined);

    startPos = signal<Nullable<number>>(undefined);

    prevPanelElement = signal<Nullable<ElementRef | HTMLElement>>(undefined);

    nextPanelElement = signal<Nullable<ElementRef | HTMLElement>>(undefined);

    nextPanelSize = signal<Nullable<number>>(undefined);

    prevPanelSize = signal<Nullable<number>>(undefined);

    _panelSizes = linkedSignal<number[]>(() => this.panelSizes());

    private configuredPanelSizes = linkedSignal<{ sizes: number[]; restored: boolean }>(() => ({ sizes: this.panelSizes(), restored: false }));

    private panelSizesSource = signal<{ configuredPanelSizes: { sizes: number[]; restored: boolean }; panelCount: number } | undefined>(undefined);

    private panelSizesInitialized = signal<boolean>(false);

    prevPanelIndex = signal<Nullable<number>>(undefined);

    timer = signal<any>(undefined);

    prevSize = signal<any>(undefined);

    _componentStyle = inject(SplitterStyle);

    resizeStart(event: TouchEvent | MouseEvent, index: number, isKeyDown?: boolean) {
        const gutterElement = ((event.currentTarget as HTMLElement) || (event.target as HTMLElement).parentElement) as HTMLElement;
        this.gutterElement.set(gutterElement);
        const size = this.horizontal() ? getWidth((this.el as ElementRef).nativeElement) : getHeight((this.el as ElementRef).nativeElement);
        this.size.set(size);

        if (!isKeyDown) {
            this.dragging.set(true);
            this.startPos.set(this.horizontal() ? (event instanceof MouseEvent ? event.pageX : event.changedTouches[0].pageX) : event instanceof MouseEvent ? event.pageY : event.changedTouches[0].pageY);
        }

        const prevPanelElement = gutterElement.previousElementSibling as HTMLElement;
        const nextPanelElement = gutterElement.nextElementSibling as HTMLElement;
        this.prevPanelElement.set(prevPanelElement);
        this.nextPanelElement.set(nextPanelElement);

        if (isKeyDown) {
            this.prevPanelSize.set(this.horizontal() ? getOuterWidth(prevPanelElement, true) : getOuterHeight(prevPanelElement, true));
            this.nextPanelSize.set(this.horizontal() ? getOuterWidth(nextPanelElement, true) : getOuterHeight(nextPanelElement, true));
        } else {
            this.prevPanelSize.set((100 * (this.horizontal() ? getOuterWidth(prevPanelElement, true) : getOuterHeight(prevPanelElement, true))) / size);
            this.nextPanelSize.set((100 * (this.horizontal() ? getOuterWidth(nextPanelElement, true) : getOuterHeight(nextPanelElement, true))) / size);
        }

        this.prevPanelIndex.set(index);
        addClass(gutterElement, 'p-splitter-gutter-resizing');
        gutterElement.setAttribute('data-p-gutter-resizing', 'true');
        addClass((this.el as ElementRef).nativeElement, 'p-splitter-resizing');
        this.el.nativeElement.setAttribute('data-p-resizing', 'true');
        this.onResizeStart.emit({ originalEvent: event, sizes: this._panelSizes() });
    }

    onResize(event: MouseEvent, step?: number, isKeyDown?: boolean) {
        let newPos, newPrevPanelSize, newNextPanelSize;

        if (isKeyDown) {
            if (this.horizontal()) {
                newPrevPanelSize = (100 * ((this.prevPanelSize() ?? 0) + (step ?? 0))) / (this.size() ?? 1);
                newNextPanelSize = (100 * ((this.nextPanelSize() ?? 0) - (step ?? 0))) / (this.size() ?? 1);
            } else {
                newPrevPanelSize = (100 * ((this.prevPanelSize() ?? 0) - (step ?? 0))) / (this.size() ?? 1);
                newNextPanelSize = (100 * ((this.nextPanelSize() ?? 0) + (step ?? 0))) / (this.size() ?? 1);
            }
        } else {
            if (this.horizontal()) {
                if (isRTL(this.el.nativeElement)) {
                    newPos = (((this.startPos() ?? 0) - event.pageX) * 100) / (this.size() ?? 1);
                } else {
                    newPos = ((event.pageX - (this.startPos() ?? 0)) * 100) / (this.size() ?? 1);
                }
            } else {
                newPos = ((event.pageY - (this.startPos() ?? 0)) * 100) / (this.size() ?? 1);
            }

            newPrevPanelSize = (this.prevPanelSize() as number) + newPos;
            newNextPanelSize = (this.nextPanelSize() as number) - newPos;
        }

        this.prevSize.set(parseFloat(newPrevPanelSize).toFixed(4));

        if (this.validateResize(newPrevPanelSize, newNextPanelSize)) {
            (this.prevPanelElement() as HTMLElement).style.flexBasis = this.panelFlexBasis(newPrevPanelSize);
            (this.nextPanelElement() as HTMLElement).style.flexBasis = this.panelFlexBasis(newNextPanelSize);
            this._panelSizes.update((panelSizes) => {
                const _panelSizes = [...panelSizes];
                _panelSizes[this.prevPanelIndex() as number] = newPrevPanelSize;
                _panelSizes[(this.prevPanelIndex() as number) + 1] = newNextPanelSize;
                return _panelSizes;
            });
        }
    }

    resizeEnd(event: MouseEvent | TouchEvent) {
        if (this.isStateful()) {
            this.saveState();
        }

        this.onResizeEnd.emit({ originalEvent: event, sizes: this._panelSizes() });
        removeClass(this.gutterElement() as any, 'p-splitter-gutter-resizing');
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
        this.timer.set(
            setTimeout(() => {
                this.repeat(event, index, step);
            }, 40)
        );
    }

    clearTimer() {
        if (this.timer()) {
            clearTimeout(this.timer());
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
        if (!this.mouseMoveListener()) {
            this.mouseMoveListener.set(
                this.renderer.listen(this.document, 'mousemove', (event) => {
                    this.onResize(event);
                })
            );
        }

        if (!this.mouseUpListener()) {
            this.mouseUpListener.set(
                this.renderer.listen(this.document, 'mouseup', (event) => {
                    this.resizeEnd(event);
                    this.unbindMouseListeners();
                })
            );
        }
    }

    bindTouchListeners() {
        if (!this.touchMoveListener()) {
            this.touchMoveListener.set(
                this.renderer.listen(this.document, 'touchmove', (event) => {
                    this.onResize(event.changedTouches[0]);
                })
            );
        }

        if (!this.touchEndListener()) {
            this.touchEndListener.set(
                this.renderer.listen(this.document, 'touchend', (event) => {
                    this.resizeEnd(event);
                    this.unbindTouchListeners();
                })
            );
        }
    }

    unbindMouseListeners() {
        if (this.mouseMoveListener()) {
            this.mouseMoveListener()!();
            this.mouseMoveListener.set(null);
        }

        if (this.mouseUpListener()) {
            this.mouseUpListener()!();
            this.mouseUpListener.set(null);
        }
    }

    unbindTouchListeners() {
        if (this.touchMoveListener()) {
            this.touchMoveListener()!();
            this.touchMoveListener.set(null);
        }

        if (this.touchEndListener()) {
            this.touchEndListener()!();
            this.touchEndListener.set(null);
        }
    }

    onDestroy() {
        this.unbindMouseListeners();
        this.unbindTouchListeners();
        this.clearTimer();
    }

    clear() {
        this.dragging.set(false);
        this.size.set(null);
        this.startPos.set(null);
        this.prevPanelElement.set(null);
        this.nextPanelElement.set(null);
        this.prevPanelSize.set(null);
        this.nextPanelSize.set(null);
        this.gutterElement.set(null);
        this.prevPanelIndex.set(null);
    }

    isStateful = computed(() => this.stateKey() != null);

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
        this.getStorage()?.setItem(this.stateKey() as string, JSON.stringify(this._panelSizes()));
    }

    restoreState() {
        const storage = this.getStorage();
        const stateString = storage?.getItem(this.stateKey() as string);

        if (stateString) {
            this.configuredPanelSizes.set({ sizes: JSON.parse(stateString), restored: true });
            this._panelSizes.set(this.configuredPanelSizes().sizes);
            this.applyPanelSizes(this._panelSizes());

            return true;
        }

        return false;
    }

    private applyPanelSizes(panelSizes: number[]) {
        let children = [...(this.el as ElementRef).nativeElement.children].filter((child) => child.getAttribute('data-pc-section') === 'panel');
        children.forEach((child, i) => {
            child.style.flexBasis = this.panelFlexBasis(panelSizes[i]);
        });
    }

    private normalizePanelSizes({ sizes, restored }: { sizes: number[]; restored: boolean }, panelCount: number): number[] {
        const renderedSizes: Nullable<number>[] = Array.from({ length: panelCount }, (_, i) => sizes[i]);
        const missing = renderedSizes.filter((size) => size == null).length;
        const knownTotal = renderedSizes.reduce<number>((total, size) => total + (size ?? 0), 0);
        const missingSize = !missing ? 0 : !restored && knownTotal < 100 ? (100 - knownTotal) / missing : 100 / panelCount;
        const scale = knownTotal > 0 ? (100 - missingSize * missing) / knownTotal : 1;

        return renderedSizes.map((size) => (size == null ? missingSize : size * scale));
    }

    private panelFlexBasis(panelSize: number) {
        return 'calc(' + panelSize + '% - ' + (this.panels().length - 1) * this.gutterSize() + 'px)';
    }

    gutterStyle = computed(() => {
        if (this.horizontal()) return { width: this.gutterSize() + 'px' };
        else return { height: this.gutterSize() + 'px' };
    });

    horizontal = computed(() => this.layout() === 'horizontal');

    dataP = computed(() =>
        this.cn({
            [this.layout() as string]: this.layout(),
            nested: this.nestedState() != null
        })
    );
}

@NgModule({
    imports: [Splitter, SharedModule, BindModule],
    exports: [Splitter, SharedModule, BindModule]
})
export class SplitterModule {}
