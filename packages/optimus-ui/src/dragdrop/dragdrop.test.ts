import { ChangeDetectionStrategy, Component, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Draggable, Droppable } from './dragdrop';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: true,
    imports: [Draggable, Droppable],
    template: `
        <div class="drag-source" pDraggable="items" [dragEffect]="'move'" [pDraggableDisabled]="dragDisabled" (onDragStart)="dragStarted = true" (onDragEnd)="dragEnded = true">Drag me</div>
        <div class="drop-target" pDroppable="items" [pDroppableDisabled]="dropDisabled" (onDrop)="dropped = true" (onDragEnter)="entered = true" (onDragLeave)="left = true">Drop here</div>
    `
})
class TestDragDropComponent {
    dragDisabled = false;
    dropDisabled = false;
    dragStarted = false;
    dragEnded = false;
    dropped = false;
    entered = false;
    left = false;
}

function createDragEvent(type: string, data?: Record<string, string>): DragEvent {
    const event = new Event(type, { bubbles: true, cancelable: true }) as any;
    const store: Record<string, string> = { ...data };
    event.dataTransfer = {
        setData: (format: string, value: string) => (store[format] = value),
        getData: (format: string) => store[format] ?? '',
        effectAllowed: undefined,
        dropEffect: undefined
    };
    return event as DragEvent;
}

describe('DragDrop', () => {
    let fixture: ComponentFixture<TestDragDropComponent>;
    let component: TestDragDropComponent;
    let draggable: Draggable;
    let droppable: Droppable;
    let dragEl: HTMLElement;
    let dropEl: HTMLElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestDragDropComponent],
            providers: [provideZonelessChangeDetection()]
        }).compileComponents();

        fixture = TestBed.createComponent(TestDragDropComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        await fixture.whenStable();

        const dragDebug = fixture.debugElement.query(By.directive(Draggable));
        const dropDebug = fixture.debugElement.query(By.directive(Droppable));
        draggable = dragDebug.injector.get(Draggable);
        droppable = dropDebug.injector.get(Droppable);
        dragEl = dragDebug.nativeElement;
        dropEl = dropDebug.nativeElement;
    });

    it('should make the element draggable on init', () => {
        expect(draggable.scope()).toBe('items');
        expect(dragEl.draggable).toBe(true);
    });

    it('should emit onDragStart, set effectAllowed and scope data on dragstart', () => {
        const event = createDragEvent('dragstart');
        draggable.dragStart(event);

        expect(component.dragStarted).toBe(true);
        expect((event.dataTransfer as any).effectAllowed).toBe('move');
        expect((event.dataTransfer as DataTransfer).getData('text')).toBe('items');
    });

    it('should prevent dragstart when disabled', async () => {
        component.dragDisabled = true;
        fixture.changeDetectorRef.markForCheck();
        await fixture.whenStable();

        const event = createDragEvent('dragstart');
        draggable.dragStart(event);

        expect(component.dragStarted).toBe(false);
        expect(event.defaultPrevented).toBe(true);
    });

    it('should emit onDragEnd on dragend', () => {
        draggable.dragEnd(createDragEvent('dragend'));
        expect(component.dragEnded).toBe(true);
    });

    it('should accept a drop with a matching scope', () => {
        const event = createDragEvent('drop', { text: 'items' });
        droppable.drop(event);
        expect(component.dropped).toBe(true);
    });

    it('should reject a drop with a non-matching scope', () => {
        const event = createDragEvent('drop', { text: 'other' });
        droppable.drop(event);
        expect(component.dropped).toBe(false);
    });

    it('should match array scopes', () => {
        vi.spyOn(droppable, 'scope').mockReturnValue(['a', 'items']);
        const event = createDragEvent('drop', { text: 'items' });
        droppable.drop(event);
        expect(component.dropped).toBe(true);
    });

    it('should emit onDragEnter and set dropEffect on dragenter', () => {
        const event = createDragEvent('dragenter');
        droppable.dragEnter(event);

        expect(component.entered).toBe(true);
        expect(dropEl.classList.contains('p-draggable-enter')).toBe(true);
    });

    it('should emit onDragLeave when leaving the drop area', () => {
        droppable.dragEnter(createDragEvent('dragenter'));
        const leaveEvent = createDragEvent('dragleave');
        Object.defineProperty(leaveEvent, 'relatedTarget', { value: document.body });
        droppable.dragLeave(leaveEvent);

        expect(component.left).toBe(true);
        expect(dropEl.classList.contains('p-draggable-enter')).toBe(false);
    });
});
