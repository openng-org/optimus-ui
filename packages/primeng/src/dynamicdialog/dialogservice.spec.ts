import { Component, provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DialogService } from './dialogservice';
import { DynamicDialogConfig } from './dynamicdialog-config';
import { DynamicDialogRef } from './dynamicdialog-ref';

@Component({
    standalone: true,
    template: `<span class="child-content">{{ label }}</span>`
})
class ChildComponent {
    label = 'child';
}

@Component({
    standalone: true,
    template: `<span class="other-content">other</span>`
})
class OtherComponent {}

describe('DialogService', () => {
    let service: DialogService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [DialogService, provideZonelessChangeDetection()]
        });
        service = TestBed.inject(DialogService);
    });

    afterEach(() => {
        // Remove any dialog nodes that survived a test.
        document.querySelectorAll('p-dynamicdialog').forEach((el) => el.remove());
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('open', () => {
        it('should return a DynamicDialogRef', () => {
            const ref = service.open(ChildComponent, new DynamicDialogConfig());

            expect(ref).toBeInstanceOf(DynamicDialogRef);
        });

        it('should register the dialog in the component ref map', () => {
            const ref = service.open(ChildComponent, new DynamicDialogConfig())!;

            expect(service.dialogComponentRefMap.has(ref)).toBe(true);
        });

        it('should assign the child component type to the dialog instance', () => {
            const ref = service.open(ChildComponent, new DynamicDialogConfig())!;

            expect(service.getInstance(ref)!.childComponentType).toBe(ChildComponent);
        });

        it('should forward inputValues to the dialog instance', () => {
            const config = new DynamicDialogConfig();
            config.inputValues = { label: 'hello' };

            const ref = service.open(ChildComponent, config)!;

            expect(service.getInstance(ref)!.inputValues).toEqual({ label: 'hello' });
        });

        it('should default inputValues and bindings to empty when not provided', () => {
            const ref = service.open(ChildComponent, new DynamicDialogConfig())!;
            const instance = service.getInstance(ref)!;

            expect(instance.inputValues).toEqual({});
            expect(instance.bindings).toEqual([]);
        });

        it('should append the dialog element to the document body by default', () => {
            const before = document.querySelectorAll('p-dynamicdialog').length;

            service.open(ChildComponent, new DynamicDialogConfig());

            expect(document.querySelectorAll('p-dynamicdialog').length).toBe(before + 1);
        });
    });

    describe('duplicate prevention', () => {
        it('should return null when opening the same component twice', () => {
            const first = service.open(ChildComponent, new DynamicDialogConfig());
            const second = service.open(ChildComponent, new DynamicDialogConfig());

            expect(first).toBeInstanceOf(DynamicDialogRef);
            expect(second).toBeNull();
        });

        it('should allow duplicates when config.duplicate is true', () => {
            const config = new DynamicDialogConfig();
            config.duplicate = true;

            const first = service.open(ChildComponent, config);
            const second = service.open(ChildComponent, config);

            expect(first).toBeInstanceOf(DynamicDialogRef);
            expect(second).toBeInstanceOf(DynamicDialogRef);
        });

        it('should allow different component types simultaneously', () => {
            const first = service.open(ChildComponent, new DynamicDialogConfig());
            const second = service.open(OtherComponent, new DynamicDialogConfig());

            expect(first).toBeInstanceOf(DynamicDialogRef);
            expect(second).toBeInstanceOf(DynamicDialogRef);
        });
    });

    describe('getInstance', () => {
        it('should return the dialog component instance for a ref', () => {
            const ref = service.open(ChildComponent, new DynamicDialogConfig())!;

            expect(service.getInstance(ref)).toBe(service.dialogComponentRefMap.get(ref)!.instance);
        });

        it('should return undefined for an unknown ref', () => {
            expect(service.getInstance(new DynamicDialogRef())).toBeUndefined();
        });
    });

    describe('lifecycle cleanup', () => {
        it('should close the dialog instance when onClose emits', () => {
            const ref = service.open(ChildComponent, new DynamicDialogConfig())!;
            const closeSpy = spyOn(service.getInstance(ref)!, 'close');

            ref.close();

            expect(closeSpy).toHaveBeenCalled();
        });

        it('should remove the dialog from the ref map when onDestroy emits', () => {
            const ref = service.open(ChildComponent, new DynamicDialogConfig())!;
            expect(service.dialogComponentRefMap.has(ref)).toBe(true);

            ref.destroy();

            expect(service.dialogComponentRefMap.has(ref)).toBe(false);
        });

        it('should remove the dialog element from the DOM when destroyed', () => {
            const before = document.querySelectorAll('p-dynamicdialog').length;
            const ref = service.open(ChildComponent, new DynamicDialogConfig())!;
            expect(document.querySelectorAll('p-dynamicdialog').length).toBe(before + 1);

            ref.destroy();

            expect(document.querySelectorAll('p-dynamicdialog').length).toBe(before);
        });
    });
});
