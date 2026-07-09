import { AfterViewInit, booleanAttribute, Directive, effect, ElementRef, inject, input, NgModule, OnDestroy, output, Renderer2 } from '@angular/core';
import { addClass, removeClass } from '@primeuix/utils';
import { DomHandler } from 'primeng/dom';
import { VoidListener } from 'primeng/ts-helpers';

/**
 * pDraggable directive apply draggable behavior to any element.
 * @group Components
 */
@Directive({
    selector: '[pDraggable]',
    standalone: true,
    host: {
        '(dragstart)': 'dragStart($event)',
        '(dragend)': 'dragEnd($event)'
    }
})
export class Draggable implements AfterViewInit, OnDestroy {
    scope = input<string | undefined>(undefined, { alias: 'pDraggable' });
    /**
     * Defines the cursor style.
     * @group Props
     */
    dragEffect = input<'none' | 'copy' | 'copyLink' | 'copyMove' | 'link' | 'linkMove' | 'move' | 'all' | 'uninitialized' | undefined>();
    /**
     * Selector to define the drag handle, by default anywhere on the target element is a drag handle to start dragging.
     * @group Props
     */
    dragHandle = input<string | undefined>();
    /**
     * Whether the element is draggable, useful for conditional cases.
     * @group Props
     */
    pDraggableDisabled = input(false, { transform: booleanAttribute });
    /**
     * Callback to invoke when drag begins.
     * @param {DragEvent} event - Drag event.
     * @group Emits
     */
    onDragStart = output<DragEvent>();
    /**
     * Callback to invoke when drag ends.
     * @param {DragEvent} event - Drag event.
     * @group Emits
     */
    onDragEnd = output<DragEvent>();
    /**
     * Callback to invoke on dragging.
     * @param {DragEvent} event - Drag event.
     * @group Emits
     */
    onDrag = output<DragEvent>();

    handle: any;

    dragListener: VoidListener;

    mouseDownListener: VoidListener;

    mouseUpListener: VoidListener;

    el = inject(ElementRef);

    private renderer = inject(Renderer2);

    constructor() {
        effect(() => {
            if (this.pDraggableDisabled()) {
                this.unbindMouseListeners();
            } else {
                this.el.nativeElement.draggable = true;
                this.bindMouseListeners();
            }
        });
    }

    ngAfterViewInit() {
        if (!this.pDraggableDisabled()) {
            this.el.nativeElement.draggable = true;
            this.bindMouseListeners();
        }
    }

    bindDragListener() {
        if (!this.dragListener) {
            this.dragListener = this.renderer.listen(this.el.nativeElement, 'drag', this.drag.bind(this));
        }
    }

    unbindDragListener() {
        if (this.dragListener) {
            this.dragListener();
            this.dragListener = null;
        }
    }

    bindMouseListeners() {
        if (!this.mouseDownListener && !this.mouseUpListener) {
            this.mouseDownListener = this.renderer.listen(this.el.nativeElement, 'mousedown', this.mousedown.bind(this));
            this.mouseUpListener = this.renderer.listen(this.el.nativeElement, 'mouseup', this.mouseup.bind(this));
        }
    }

    unbindMouseListeners() {
        if (this.mouseDownListener && this.mouseUpListener) {
            this.mouseDownListener();
            this.mouseUpListener();
            this.mouseDownListener = null;
            this.mouseUpListener = null;
        }
    }

    drag(event: DragEvent) {
        this.onDrag.emit(event);
    }

    dragStart(event: DragEvent) {
        if (this.allowDrag() && !this.pDraggableDisabled()) {
            const dragEffect = this.dragEffect();
            if (dragEffect) {
                (event.dataTransfer as DataTransfer).effectAllowed = dragEffect;
            }
            (event.dataTransfer as DataTransfer).setData('text', this.scope()!);

            this.onDragStart.emit(event);

            this.bindDragListener();
        } else {
            event.preventDefault();
        }
    }

    dragEnd(event: DragEvent) {
        this.onDragEnd.emit(event);
        this.unbindDragListener();
    }

    mousedown(event: MouseEvent) {
        this.handle = event.target;
    }

    mouseup(event: MouseEvent) {
        this.handle = null;
    }

    allowDrag(): boolean {
        const dragHandle = this.dragHandle();
        if (dragHandle && this.handle) return DomHandler.matches(this.handle, dragHandle);
        else return true;
    }

    ngOnDestroy() {
        this.unbindDragListener();
        this.unbindMouseListeners();
    }
}
/**
 * pDroppable directive apply droppable behavior to any element.
 * @group Components
 */
@Directive({
    selector: '[pDroppable]',
    standalone: true,
    host: {
        '(drop)': 'drop($event)',
        '(dragenter)': 'dragEnter($event)',
        '(dragleave)': 'dragLeave($event)'
    }
})
export class Droppable implements AfterViewInit, OnDestroy {
    scope = input<string | string[] | undefined>(undefined, { alias: 'pDroppable' });
    /**
     * Whether the element is droppable, useful for conditional cases.
     * @group Props
     */
    pDroppableDisabled = input(false, { transform: booleanAttribute });
    /**
     * Defines the cursor style, valid values are none, copy, move, link, copyMove, copyLink, linkMove and all.
     * @group Props
     */
    dropEffect = input<'none' | 'copy' | 'link' | 'move' | undefined>();
    /**
     * Callback to invoke when a draggable enters drop area.
     * @group Emits
     */
    onDragEnter = output<DragEvent>();
    /**
     * Callback to invoke when a draggable leave drop area.
     * @group Emits
     */
    onDragLeave = output<DragEvent>();
    /**
     * Callback to invoke when a draggable is dropped onto drop area.
     * @group Emits
     */
    onDrop = output<DragEvent>();

    el = inject(ElementRef);

    private renderer = inject(Renderer2);

    dragOverListener: VoidListener;

    constructor() {
        effect(() => {
            if (this.pDroppableDisabled()) {
                this.unbindDragOverListener();
            } else {
                this.bindDragOverListener();
            }
        });
    }

    ngAfterViewInit() {
        if (!this.pDroppableDisabled()) {
            this.bindDragOverListener();
        }
    }

    bindDragOverListener() {
        if (!this.dragOverListener) {
            this.dragOverListener = this.renderer.listen(this.el.nativeElement, 'dragover', this.dragOver.bind(this));
        }
    }

    unbindDragOverListener() {
        if (this.dragOverListener) {
            this.dragOverListener();
            this.dragOverListener = null;
        }
    }

    dragOver(event: DragEvent) {
        event.preventDefault();
    }

    drop(event: DragEvent) {
        if (this.allowDrop(event)) {
            removeClass(this.el.nativeElement, 'p-draggable-enter');
            event.preventDefault();
            this.onDrop.emit(event);
        }
    }

    dragEnter(event: DragEvent) {
        event.preventDefault();

        const dropEffect = this.dropEffect();
        if (dropEffect) {
            (event.dataTransfer as DataTransfer).dropEffect = dropEffect;
        }

        addClass(this.el.nativeElement, 'p-draggable-enter');
        this.onDragEnter.emit(event);
    }

    dragLeave(event: DragEvent) {
        event.preventDefault();

        if (!this.el.nativeElement.contains(event.relatedTarget)) {
            removeClass(this.el.nativeElement, 'p-draggable-enter');
            this.onDragLeave.emit(event);
        }
    }

    allowDrop(event: DragEvent): boolean {
        let dragScope = (event.dataTransfer as DataTransfer).getData('text');
        const scope = this.scope();
        if (typeof scope == 'string' && dragScope == scope) {
            return true;
        } else if (Array.isArray(scope)) {
            for (let j = 0; j < scope.length; j++) {
                if (dragScope == scope[j]) {
                    return true;
                }
            }
        }
        return false;
    }

    ngOnDestroy() {
        this.unbindDragOverListener();
    }
}

@NgModule({
    imports: [Draggable, Droppable],
    exports: [Draggable, Droppable]
})
export class DragDropModule {}
