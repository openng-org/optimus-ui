import { DynamicDialogRef } from './dynamicdialog-ref';

describe('DynamicDialogRef', () => {
    let ref: DynamicDialogRef;

    beforeEach(() => {
        ref = new DynamicDialogRef();
    });

    describe('close', () => {
        it('should emit the result through onClose', () => {
            const spy = jasmine.createSpy('onClose');
            ref.onClose.subscribe(spy);

            ref.close('result-value');

            expect(spy).toHaveBeenCalledWith('result-value');
        });

        it('should emit undefined when no result is provided', () => {
            const spy = jasmine.createSpy('onClose');
            ref.onClose.subscribe(spy);

            ref.close();

            expect(spy).toHaveBeenCalledWith(undefined);
        });

        it('should complete onClose after the teardown delay', () => {
            jasmine.clock().install();
            try {
                const completeSpy = jasmine.createSpy('complete');
                ref.onClose.subscribe({ complete: completeSpy });

                ref.close('done');
                expect(completeSpy).not.toHaveBeenCalled();

                jasmine.clock().tick(1000);
                expect(completeSpy).toHaveBeenCalledTimes(1);
            } finally {
                jasmine.clock().uninstall();
            }
        });
    });

    describe('destroy', () => {
        it('should emit through onDestroy', () => {
            const spy = jasmine.createSpy('onDestroy');
            ref.onDestroy.subscribe(spy);

            ref.destroy();

            expect(spy).toHaveBeenCalledTimes(1);
        });
    });

    describe('drag, resize and maximize callbacks', () => {
        it('should forward dragStart events', () => {
            const spy = jasmine.createSpy('onDragStart');
            const event = new MouseEvent('mousedown');
            ref.onDragStart.subscribe(spy);

            ref.dragStart(event);

            expect(spy).toHaveBeenCalledWith(event);
        });

        it('should forward dragEnd events', () => {
            const spy = jasmine.createSpy('onDragEnd');
            const event = new MouseEvent('mouseup');
            ref.onDragEnd.subscribe(spy);

            ref.dragEnd(event);

            expect(spy).toHaveBeenCalledWith(event);
        });

        it('should forward resizeInit events', () => {
            const spy = jasmine.createSpy('onResizeInit');
            const event = new MouseEvent('mousedown');
            ref.onResizeInit.subscribe(spy);

            ref.resizeInit(event);

            expect(spy).toHaveBeenCalledWith(event);
        });

        it('should forward resizeEnd events', () => {
            const spy = jasmine.createSpy('onResizeEnd');
            const event = new MouseEvent('mouseup');
            ref.onResizeEnd.subscribe(spy);

            ref.resizeEnd(event);

            expect(spy).toHaveBeenCalledWith(event);
        });

        it('should forward the maximize value', () => {
            const spy = jasmine.createSpy('onMaximize');
            ref.onMaximize.subscribe(spy);

            ref.maximize({ maximized: true });

            expect(spy).toHaveBeenCalledWith({ maximized: true });
        });
    });

    describe('onChildComponentLoaded', () => {
        it('should expose a subject that emits the loaded instance', () => {
            const spy = jasmine.createSpy('childLoaded');
            const instance = { some: 'component' };
            ref.onChildComponentLoaded.subscribe(spy);

            ref.onChildComponentLoaded.next(instance);

            expect(spy).toHaveBeenCalledWith(instance);
        });
    });
});
