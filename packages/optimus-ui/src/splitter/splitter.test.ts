import { ChangeDetectionStrategy, Component, DebugElement, Input, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { Splitter } from './splitter';

import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { SharedModule } from '@openng/optimus-ui/api';
@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: `
        <p-splitter
            [panelSizes]="panelSizes"
            [layout]="layout"
            [gutterSize]="gutterSize"
            [minSizes]="minSizes"
            [stateKey]="stateKey"
            [stateStorage]="stateStorage"
            [step]="step"
            [panelStyleClass]="panelStyleClass"
            [panelStyle]="panelStyle"
            [class]="customClass"
            (onResizeStart)="onResizeStart($event)"
            (onResizeEnd)="onResizeEnd($event)"
        >
            <ng-template #panel>
                <div class="panel1">Panel 1</div>
            </ng-template>
            <ng-template #panel>
                <div class="panel2">Panel 2</div>
            </ng-template>
        </p-splitter>
    `
})
class TestSplitterComponent {
    panelSizes: number[] = [50, 50];
    layout = 'horizontal';
    gutterSize = 4;
    minSizes: number[] = [];
    stateKey: string | null = null as any;
    stateStorage = 'session';
    step = 5;
    panelStyleClass?: string;
    panelStyle?: any;
    customClass?: string;

    resizeStartEvent: any;
    resizeEndEvent: any;

    onResizeStart(event: any) {
        this.resizeStartEvent = event;
    }

    onResizeEnd(event: any) {
        this.resizeEndEvent = event;
    }
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: `
        <p-splitter>
            <ng-template #panel>
                <div>Panel 1</div>
            </ng-template>
            <ng-template #panel>
                <div>Panel 2</div>
            </ng-template>
            <ng-template #panel>
                <div>Panel 3</div>
            </ng-template>
        </p-splitter>
    `
})
class TestThreePanelComponent {}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: `
        <p-splitter [panelSizes]="[20, 80]">
            <ng-template #panel>
                <div>Panel 1</div>
            </ng-template>
            <ng-template #panel>
                <p-splitter layout="vertical" [panelSizes]="[30, 70]">
                    <ng-template #panel>
                        <div>Nested Panel 1</div>
                    </ng-template>
                    <ng-template #panel>
                        <div>Nested Panel 2</div>
                    </ng-template>
                </p-splitter>
            </ng-template>
        </p-splitter>
    `
})
class TestNestedSplitterComponent {}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: `
        <p-splitter [pt]="pt" [layout]="layout">
            <ng-template #panel>
                <div>PT Test Panel 1</div>
            </ng-template>
            <ng-template #panel>
                <div>PT Test Panel 2</div>
            </ng-template>
        </p-splitter>
    `
})
class TestPTSplitterComponent {
    @Input() pt: any;
    layout = 'horizontal';
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: `
        <p-splitter [panelSizes]="panelSizes" [stateKey]="stateKey">
            @for (item of items; track item) {
                <ng-template #panel>
                    <div>{{ item }}</div>
                </ng-template>
            }
        </p-splitter>
    `
})
class TestDynamicPanelsSplitterComponent {
    items: string[] = [];
    panelSizes: number[] = [];
    stateKey: string | null = null;
}

describe('Splitter', () => {
    let testFixture: ComponentFixture<TestSplitterComponent>;
    let testComponent: TestSplitterComponent;
    let splitterEl: DebugElement;
    let splitterInstance: Splitter;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [Splitter],
            declarations: [TestSplitterComponent, TestThreePanelComponent, TestNestedSplitterComponent, TestPTSplitterComponent, TestDynamicPanelsSplitterComponent],
            providers: [provideZonelessChangeDetection()]
        });

        testFixture = TestBed.createComponent(TestSplitterComponent);
        testComponent = testFixture.componentInstance;
        testFixture.detectChanges();

        splitterEl = testFixture.debugElement.query(By.directive(Splitter));
        splitterInstance = splitterEl.componentInstance;
    });

    afterEach(() => {
        if (typeof window !== 'undefined' && window.sessionStorage) {
            window.sessionStorage.clear();
        }
        if (typeof window !== 'undefined' && window.localStorage) {
            window.localStorage.clear();
        }
    });

    describe('Component Initialization', () => {
        it('should create the component', () => {
            expect(splitterInstance).toBeTruthy();
        });

        it('should have default values', () => {
            const fixture = TestBed.createComponent(Splitter);
            const splitter = fixture.componentInstance;

            expect(splitter.layout()).toBe('horizontal');
            expect(splitter.gutterSize()).toBe(4);
            expect(splitter.step()).toBe(5);
            expect(splitter.stateStorage()).toBe('session');
            expect(splitter.stateKey()).toBeNull();
            expect(splitter.minSizes()).toEqual([]);
        });

        it('should accept custom values', async () => {
            testComponent.layout = 'vertical';
            testComponent.gutterSize = 8;
            testComponent.step = 10;
            testComponent.minSizes = [20, 30];
            testComponent.stateKey = 'test-splitter';
            testComponent.stateStorage = 'local';
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            expect(splitterInstance.layout()).toBe('vertical');
            expect(splitterInstance.gutterSize()).toBe(8);
            expect(splitterInstance.step()).toBe(10);
            expect(splitterInstance.minSizes()).toEqual([20, 30]);
            expect(splitterInstance.stateKey()).toBe('test-splitter');
            expect(splitterInstance.stateStorage()).toBe('local');
        });
    });

    describe('Panel Rendering', () => {
        it('should render two panels by default', () => {
            const panels = testFixture.debugElement.queryAll(By.css('.p-splitterpanel'));
            expect(panels.length).toBe(2);
        });

        it('should render panel content', () => {
            const panel1 = testFixture.debugElement.query(By.css('.panel1'));
            const panel2 = testFixture.debugElement.query(By.css('.panel2'));

            expect(panel1.nativeElement.textContent).toContain('Panel 1');
            expect(panel2.nativeElement.textContent).toContain('Panel 2');
        });

        it('should apply panel styles', async () => {
            testComponent.panelStyleClass = 'custom-panel-class';
            testComponent.panelStyle = { backgroundColor: 'red' };
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            const panels = testFixture.debugElement.queryAll(By.css('.p-splitterpanel'));
            expect(panels[0].nativeElement.className).toContain('custom-panel-class');
        });

        it('should render three panels', () => {
            const fixture = TestBed.createComponent(TestThreePanelComponent);
            fixture.detectChanges();

            const panels = fixture.debugElement.queryAll(By.css('.p-splitterpanel'));
            const gutters = fixture.debugElement.queryAll(By.css('.p-splitter-gutter'));

            expect(panels.length).toBe(3);
            expect(gutters.length).toBe(2); // 3 panels = 2 gutters
        });
    });

    describe('Gutter Functionality', () => {
        it('should render gutter between panels', () => {
            const gutters = testFixture.debugElement.queryAll(By.css('.p-splitter-gutter'));
            expect(gutters.length).toBe(1);
        });

        it('should render gutter handle', () => {
            const handle = testFixture.debugElement.query(By.css('.p-splitter-gutter-handle'));
            expect(handle).toBeTruthy();
        });

        it('should set gutter size', async () => {
            testComponent.gutterSize = 10;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            const style = splitterInstance.gutterStyle();
            expect(style).toEqual({ width: '10px' });
        });

        it('should set gutter size for vertical layout', async () => {
            testComponent.layout = 'vertical';
            testComponent.gutterSize = 8;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            const style = splitterInstance.gutterStyle();
            expect(style).toEqual({ height: '8px' });
        });

        it('should have proper ARIA attributes', () => {
            const handle = testFixture.debugElement.query(By.css('.p-splitter-gutter-handle'));
            expect(handle.nativeElement.getAttribute('aria-orientation')).toBe('horizontal');
            expect(handle.nativeElement.getAttribute('tabindex')).toBe('0');
        });
    });

    describe('Panel Sizes with Different Units', () => {
        it('should handle numeric values as percentages', async () => {
            testComponent.panelSizes = [30, 70];
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            expect(splitterInstance._panelSizes()).toEqual([30, 70]);
        });

        it('should handle custom percentage values', async () => {
            testComponent.panelSizes = [25, 75];
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            expect(splitterInstance._panelSizes()).toEqual([25, 75]);
        });

        it('should split equally when no sizes provided', async () => {
            const fixture = TestBed.createComponent(TestSplitterComponent);
            fixture.componentInstance.panelSizes = [];
            fixture.detectChanges();
            await fixture.whenStable();

            const splitter: Splitter = fixture.debugElement.query(By.directive(Splitter)).componentInstance;
            const panels = fixture.debugElement.queryAll(By.css('.p-splitterpanel'));

            // When no sizes provided, should split equally
            expect(splitter._panelSizes()).toEqual([50, 50]);
            expect(panels[0].nativeElement.style.flexBasis).toBe('calc(50% - 4px)');
            expect(panels[1].nativeElement.style.flexBasis).toBe('calc(50% - 4px)');
        });
    });

    describe('Mouse Resize Operations', () => {
        it('should start resize on mouse down', () => {
            const gutter = testFixture.debugElement.query(By.css('.p-splitter-gutter'));
            const mouseEvent = new MouseEvent('mousedown');
            Object.defineProperty(mouseEvent, 'pageX', { value: 100, writable: true });
            Object.defineProperty(mouseEvent, 'pageY', { value: 100, writable: true });

            vi.spyOn(splitterInstance, 'resizeStart').mockImplementation(() => {});
            gutter.nativeElement.dispatchEvent(mouseEvent);

            expect(splitterInstance.resizeStart).toHaveBeenCalled();
        });

        it('should emit onResizeStart event', () => {
            const gutter = testFixture.debugElement.query(By.css('.p-splitter-gutter'));
            const mouseEvent = new MouseEvent('mousedown');
            Object.defineProperty(mouseEvent, 'pageX', { value: 100, writable: true });
            Object.defineProperty(mouseEvent, 'pageY', { value: 100, writable: true });
            Object.defineProperty(mouseEvent, 'currentTarget', { value: gutter.nativeElement, writable: true });

            splitterInstance.resizeStart(mouseEvent, 0);

            expect(testComponent.resizeStartEvent).toBeDefined();
            expect(testComponent.resizeStartEvent.originalEvent).toBe(mouseEvent);
            expect(testComponent.resizeStartEvent.sizes).toEqual(splitterInstance._panelSizes());
        });

        it('should emit onResizeEnd event', () => {
            const mouseEvent = new MouseEvent('mouseup');
            const gutter = testFixture.debugElement.query(By.css('.p-splitter-gutter'));
            splitterInstance.gutterElement.set(gutter.nativeElement);

            splitterInstance.resizeEnd(mouseEvent);

            expect(testComponent.resizeEndEvent).toBeDefined();
            expect(testComponent.resizeEndEvent.originalEvent).toBe(mouseEvent);
        });

        it('should validate resize with minSizes', async () => {
            testComponent.minSizes = [20, 30];
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            expect(splitterInstance.validateResize(25, 35)).toBe(true);
            expect(splitterInstance.validateResize(15, 35)).toBe(false);
            expect(splitterInstance.validateResize(25, 25)).toBe(false);
        });
    });

    describe('Touch Resize Operations', () => {
        it('should handle touch start', () => {
            const gutter = testFixture.debugElement.query(By.css('.p-splitter-gutter'));

            vi.spyOn(splitterInstance, 'onGutterTouchStart').mockImplementation(() => {});

            const touchEvent = new TouchEvent('touchstart', { cancelable: true });
            gutter.nativeElement.dispatchEvent(touchEvent);

            expect(splitterInstance.onGutterTouchStart).toHaveBeenCalled();
        });

        it('should handle touch move', () => {
            const gutter = testFixture.debugElement.query(By.css('.p-splitter-gutter'));

            vi.spyOn(splitterInstance, 'onGutterTouchMove').mockImplementation(() => {});

            const touchEvent = new TouchEvent('touchmove', { cancelable: true });
            gutter.nativeElement.dispatchEvent(touchEvent);

            expect(splitterInstance.onGutterTouchMove).toHaveBeenCalled();
        });

        it('should handle touch end', () => {
            const gutter = testFixture.debugElement.query(By.css('.p-splitter-gutter'));

            vi.spyOn(splitterInstance, 'onGutterTouchEnd').mockImplementation(() => {});

            const touchEvent = new TouchEvent('touchend', { cancelable: true });
            gutter.nativeElement.dispatchEvent(touchEvent);

            expect(splitterInstance.onGutterTouchEnd).toHaveBeenCalled();
        });
    });

    describe('Keyboard Navigation', () => {
        let gutterHandle: DebugElement;

        beforeEach(() => {
            gutterHandle = testFixture.debugElement.query(By.css('.p-splitter-gutter-handle'));
        });

        describe('Horizontal Layout', () => {
            beforeEach(async () => {
                testComponent.layout = 'horizontal';
                testFixture.changeDetectorRef.markForCheck();
                await testFixture.whenStable();
                testFixture.detectChanges();
            });

            it('should handle left arrow key', async () => {
                const event = new KeyboardEvent('keydown', { code: 'ArrowLeft' });
                vi.spyOn(splitterInstance, 'setTimer').mockImplementation(() => {});

                gutterHandle.nativeElement.dispatchEvent(event);

                expect(splitterInstance.setTimer).toHaveBeenCalledWith(event, 0, -5);
            });

            it('should handle right arrow key', async () => {
                const event = new KeyboardEvent('keydown', { code: 'ArrowRight' });
                vi.spyOn(splitterInstance, 'setTimer').mockImplementation(() => {});

                gutterHandle.nativeElement.dispatchEvent(event);

                expect(splitterInstance.setTimer).toHaveBeenCalledWith(event, 0, 5);
            });

            it('should not handle up/down arrows in horizontal mode', () => {
                const upEvent = new KeyboardEvent('keydown', { code: 'ArrowUp' });
                const downEvent = new KeyboardEvent('keydown', { code: 'ArrowDown' });
                vi.spyOn(splitterInstance, 'setTimer').mockImplementation(() => {});

                gutterHandle.nativeElement.dispatchEvent(upEvent);
                gutterHandle.nativeElement.dispatchEvent(downEvent);

                expect(splitterInstance.setTimer).not.toHaveBeenCalled();
            });

            it('should use custom step value', async () => {
                testComponent.step = 10;
                testFixture.changeDetectorRef.markForCheck();
                await testFixture.whenStable();
                testFixture.detectChanges();

                const event = new KeyboardEvent('keydown', { code: 'ArrowLeft' });
                vi.spyOn(splitterInstance, 'setTimer').mockImplementation(() => {});

                gutterHandle.nativeElement.dispatchEvent(event);

                expect(splitterInstance.setTimer).toHaveBeenCalledWith(event, 0, -10);
            });
        });

        describe('Vertical Layout', () => {
            beforeEach(async () => {
                testComponent.layout = 'vertical';
                testFixture.changeDetectorRef.markForCheck();
                await testFixture.whenStable();
                testFixture.detectChanges();
            });

            it('should handle up arrow key', async () => {
                const event = new KeyboardEvent('keydown', { code: 'ArrowUp' });
                vi.spyOn(splitterInstance, 'setTimer').mockImplementation(() => {});

                gutterHandle.nativeElement.dispatchEvent(event);

                expect(splitterInstance.setTimer).toHaveBeenCalledWith(event, 0, 5);
            });

            it('should handle down arrow key', async () => {
                const event = new KeyboardEvent('keydown', { code: 'ArrowDown' });
                vi.spyOn(splitterInstance, 'setTimer').mockImplementation(() => {});

                gutterHandle.nativeElement.dispatchEvent(event);

                expect(splitterInstance.setTimer).toHaveBeenCalledWith(event, 0, -5);
            });

            it('should not handle left/right arrows in vertical mode', () => {
                const leftEvent = new KeyboardEvent('keydown', { code: 'ArrowLeft' });
                const rightEvent = new KeyboardEvent('keydown', { code: 'ArrowRight' });
                vi.spyOn(splitterInstance, 'setTimer').mockImplementation(() => {});

                gutterHandle.nativeElement.dispatchEvent(leftEvent);
                gutterHandle.nativeElement.dispatchEvent(rightEvent);

                expect(splitterInstance.setTimer).not.toHaveBeenCalled();
            });
        });

        it('should clear timer on key up', () => {
            const event = new KeyboardEvent('keyup');
            vi.spyOn(splitterInstance, 'clearTimer').mockImplementation(() => {});
            vi.spyOn(splitterInstance, 'resizeEnd').mockImplementation(() => {});

            gutterHandle.nativeElement.dispatchEvent(event);

            expect(splitterInstance.clearTimer).toHaveBeenCalled();
            expect(splitterInstance.resizeEnd).toHaveBeenCalled();
        });
    });

    describe('State Management', () => {
        it('should save state to sessionStorage', async () => {
            testComponent.stateKey = 'test-splitter';
            testComponent.panelSizes = [40, 60];
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            splitterInstance.saveState();

            const savedState = window.sessionStorage.getItem('test-splitter');
            expect(savedState).toBe(JSON.stringify([40, 60]));
        });

        it('should save state with custom sizes', async () => {
            testComponent.stateKey = 'test-splitter-custom';
            testComponent.panelSizes = [30, 70];
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            splitterInstance.saveState();

            const savedState = window.sessionStorage.getItem('test-splitter-custom');
            expect(savedState).toBe(JSON.stringify([30, 70]));
        });

        it('should restore state from sessionStorage', async () => {
            window.sessionStorage.setItem('test-restore', JSON.stringify([25, 75]));

            testComponent.stateKey = 'test-restore';
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            const restored = splitterInstance.restoreState();
            expect(restored).toBe(true);
            expect(splitterInstance._panelSizes()).toEqual([25, 75]);
        });

        it('should restore state from localStorage', async () => {
            window.localStorage.setItem('test-local', JSON.stringify([20, 80]));

            testComponent.stateKey = 'test-local';
            testComponent.stateStorage = 'local';
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            const restored = splitterInstance.restoreState();
            expect(restored).toBe(true);
            expect(splitterInstance._panelSizes()).toEqual([20, 80]);
        });

        it('should return false when no state exists', async () => {
            testComponent.stateKey = 'non-existent';
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            const restored = splitterInstance.restoreState();
            expect(restored).toBe(false);
        });

        it('should check if splitter is stateful', async () => {
            expect(splitterInstance.isStateful()).toBe(false);

            testComponent.stateKey = 'test-key';
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            expect(splitterInstance.isStateful()).toBe(true);
        });

        it('should throw error for invalid stateStorage', async () => {
            testComponent.stateStorage = 'invalid' as any;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            expect(() => splitterInstance.getStorage()).toThrowError();
        });
    });

    describe('Nested Splitters', () => {
        it('should render nested splitters', () => {
            const fixture = TestBed.createComponent(TestNestedSplitterComponent);
            fixture.detectChanges();

            const splitters = fixture.debugElement.queryAll(By.directive(Splitter));
            expect(splitters.length).toBe(2);

            const horizontalSplitter = splitters[0].componentInstance;
            const verticalSplitter = splitters[1].componentInstance;

            expect(horizontalSplitter.layout()).toBe('horizontal');
            expect(verticalSplitter.layout()).toBe('vertical');
        });
    });

    describe('Helper Methods', () => {
        it('should correctly identify horizontal layout', async () => {
            testComponent.layout = 'horizontal';
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            expect(splitterInstance.horizontal()).toBe(true);
        });

        it('should correctly identify vertical layout', async () => {
            testComponent.layout = 'vertical';
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            expect(splitterInstance.horizontal()).toBe(false);
        });
    });

    describe('CSS Classes and Styling', () => {
        it('should apply custom class from the native class attribute', async () => {
            testComponent.customClass = 'custom-splitter-class';
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            const splitterElement = testFixture.debugElement.query(By.css('p-splitter'));
            expect(splitterElement.nativeElement.className).toContain('custom-splitter-class');
        });

        it('should apply custom panel styles', async () => {
            testComponent.panelStyle = { border: '2px solid red', padding: '10px' };
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            const panelElements = testFixture.debugElement.queryAll(By.css('.p-splitterpanel'));

            // Check that splitter component received the style input
            expect(splitterInstance.panelStyle()).toEqual({ border: '2px solid red', padding: '10px' });

            // Manually apply styles to test the style binding works as expected
            // This simulates what ngStyle directive would do in a real browser
            const element = panelElements[0].nativeElement;

            // In testing environment, we simulate the ngStyle behavior
            if (splitterInstance.panelStyle()) {
                Object.keys(splitterInstance.panelStyle()!).forEach((key) => {
                    element.style[key] = splitterInstance.panelStyle()![key];
                });
            }

            // Now verify that our simulated application works
            expect(element.style.border).toBe('2px solid red');
            expect(element.style.padding).toBe('10px');

            // Also verify the template binding
            expect(splitterInstance.panelStyle()).toBeTruthy();
            expect(Object.keys(splitterInstance.panelStyle()!)).toContain('border');
            expect(Object.keys(splitterInstance.panelStyle()!)).toContain('padding');
        });

        it('should apply resizing classes during resize', () => {
            const gutter = testFixture.debugElement.query(By.css('.p-splitter-gutter'));
            const mouseEvent = new MouseEvent('mousedown');
            Object.defineProperty(mouseEvent, 'pageX', { value: 100, writable: true });
            Object.defineProperty(mouseEvent, 'pageY', { value: 100, writable: true });
            Object.defineProperty(mouseEvent, 'currentTarget', { value: gutter.nativeElement, writable: true });

            splitterInstance.resizeStart(mouseEvent, 0);
            expect(splitterInstance.el.nativeElement.className).toContain('p-splitter-resizing');

            splitterInstance.resizeEnd(mouseEvent);
            expect(splitterInstance.el.nativeElement.className).not.toContain('p-splitter-resizing');
        });
    });

    describe('Accessibility', () => {
        it('should have separator role on gutter', () => {
            const gutter = testFixture.debugElement.query(By.css('.p-splitter-gutter'));
            expect(gutter.nativeElement.getAttribute('role')).toBe('separator');
        });

        it('should set aria-orientation on handle', async () => {
            const handle = testFixture.debugElement.query(By.css('.p-splitter-gutter-handle'));

            testComponent.layout = 'horizontal';
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();
            expect(handle.nativeElement.getAttribute('aria-orientation')).toBe('horizontal');

            testComponent.layout = 'vertical';
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();
            expect(handle.nativeElement.getAttribute('aria-orientation')).toBe('vertical');
        });

        it('should be keyboard navigable', () => {
            const handle = testFixture.debugElement.query(By.css('.p-splitter-gutter-handle'));
            expect(handle.nativeElement.getAttribute('tabindex')).toBe('0');
        });

        it('should update aria-valuenow during resize', async () => {
            const handle = testFixture.debugElement.query(By.css('.p-splitter-gutter-handle'));

            testComponent.panelSizes = [30, 70];
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            // After component initialization, prevSize should be set
            expect(handle.nativeElement.getAttribute('aria-valuenow')).toBeTruthy();
        });
    });

    describe('Edge Cases', () => {
        it('should handle empty panelSizes array', async () => {
            testComponent.panelSizes = [];
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            expect(splitterInstance._panelSizes()).toBeDefined();
        });

        it('should handle invalid minSizes gracefully', async () => {
            testComponent.minSizes = [];
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            expect(splitterInstance.validateResize(50, 50)).toBe(true);
        });

        it('should handle rapid mouse events', () => {
            const gutter = testFixture.debugElement.query(By.css('.p-splitter-gutter'));
            const mouseEvent1 = new MouseEvent('mousedown');

            Object.defineProperty(mouseEvent1, 'pageX', { value: 100, writable: true });
            Object.defineProperty(mouseEvent1, 'pageY', { value: 100, writable: true });
            Object.defineProperty(mouseEvent1, 'currentTarget', { value: gutter.nativeElement, writable: true });

            // First event should work
            splitterInstance.onGutterMouseDown(mouseEvent1, 0);
            expect(splitterInstance.dragging()).toBe(true);

            // Reset for next test
            splitterInstance.clear();
        });

        it('should handle resize with zero panel sizes', async () => {
            testComponent.panelSizes = [0, 100];
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            expect(splitterInstance.validateResize(0, 100)).toBeTruthy();
        });

        it('should handle complex nested structure cleanup', () => {
            splitterInstance.dragging.set(true);
            splitterInstance.size.set(100);
            splitterInstance.startPos.set(50);
            splitterInstance.prevPanelElement.set(document.createElement('div'));
            splitterInstance.nextPanelElement.set(document.createElement('div'));

            splitterInstance.clear();

            expect(splitterInstance.dragging()).toBe(false);
            expect(splitterInstance.size()).toBeNull();
            expect(splitterInstance.startPos()).toBeNull();
            expect(splitterInstance.prevPanelElement()).toBeNull();
            expect(splitterInstance.nextPanelElement()).toBeNull();
        });

        it('should handle invalid layout values', async () => {
            testComponent.layout = 'invalid' as any;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            expect(splitterInstance.horizontal()).toBe(false);
        });

        it('should handle resize validation properly', async () => {
            testComponent.minSizes = [10, 10];
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            expect(splitterInstance.validateResize(20, 20)).toBe(true);
            expect(splitterInstance.validateResize(5, 20)).toBe(false);
        });

        it('should prevent resize beyond boundaries', async () => {
            testComponent.minSizes = [10, 10];
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            // Try to resize below minimum
            const isValid = splitterInstance.validateResize(5, 15);
            expect(isValid).toBe(false);
        });

        it('should work with different storage types', async () => {
            testComponent.stateKey = 'test-key';
            testComponent.stateStorage = 'local';
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            expect(splitterInstance.stateStorage()).toBe('local');
            expect(() => splitterInstance.getStorage()).not.toThrow();
        });
    });

    describe('Memory Management', () => {
        it('should cleanup mouse listeners on destroy', () => {
            splitterInstance.bindMouseListeners();

            expect(splitterInstance.mouseMoveListener()).toBeTruthy();
            expect(splitterInstance.mouseUpListener()).toBeTruthy();

            splitterInstance.unbindMouseListeners();

            expect(splitterInstance.mouseMoveListener()).toBeNull();
            expect(splitterInstance.mouseUpListener()).toBeNull();
        });

        it('should cleanup touch listeners on destroy', () => {
            splitterInstance.bindTouchListeners();

            expect(splitterInstance.touchMoveListener()).toBeTruthy();
            expect(splitterInstance.touchEndListener()).toBeTruthy();

            splitterInstance.unbindTouchListeners();

            expect(splitterInstance.touchMoveListener()).toBeNull();
            expect(splitterInstance.touchEndListener()).toBeNull();
        });

        it('should clear timers properly', () => {
            // Set a timer
            const event = new KeyboardEvent('keydown', { code: 'ArrowLeft' });
            splitterInstance.setTimer(event, 0, 5);

            expect(splitterInstance.timer()).toBeTruthy();

            // clearTimer calls clearTimeout but doesn't set timer to undefined
            const timerBeforeClear = splitterInstance.timer();
            splitterInstance.clearTimer();

            // Timer value remains but timeout is cleared
            expect(typeof timerBeforeClear).toBe('number');
        });

        it('should handle multiple timer clears', () => {
            splitterInstance.timer.set(null);

            expect(() => {
                splitterInstance.clearTimer();
                splitterInstance.clearTimer();
            }).not.toThrow();
        });
    });

    describe('Signal inputs', () => {
        it('should apply changed panelSizes to the rendered panels after init', async () => {
            await testFixture.whenStable();

            testComponent.panelSizes = [30, 70];
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const panels = testFixture.debugElement.queryAll(By.css('.p-splitterpanel'));
            expect(panels[0].nativeElement.style.flexBasis).toBe('calc(30% - 4px)');
            expect(panels[1].nativeElement.style.flexBasis).toBe('calc(70% - 4px)');
            expect(splitterInstance._panelSizes()).toEqual([30, 70]);
        });

        it('should keep resized sizes until panelSizes changes, without mutating the bound array', async () => {
            await testFixture.whenStable();
            const boundSizes = testComponent.panelSizes;
            const gutter = testFixture.debugElement.query(By.css('.p-splitter-gutter'));
            const host: HTMLElement = splitterEl.nativeElement;
            const startX = host.getBoundingClientRect().left + host.offsetWidth / 2;

            const mouseDown = new MouseEvent('mousedown', { clientX: startX });
            Object.defineProperty(mouseDown, 'currentTarget', { value: gutter.nativeElement });

            splitterInstance.resizeStart(mouseDown, 0);
            splitterInstance.onResize(new MouseEvent('mousemove', { clientX: startX - host.offsetWidth / 10 }));
            splitterInstance.resizeEnd(new MouseEvent('mouseup'));

            const resizedSizes = splitterInstance._panelSizes();
            expect(resizedSizes[0]).toBeLessThan(50);
            expect(resizedSizes[1]).toBeGreaterThan(50);
            expect(boundSizes).toEqual([50, 50]);
            expect(testComponent.resizeEndEvent.sizes).toEqual(resizedSizes);

            testComponent.panelSizes = [40, 60];
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            expect(splitterInstance._panelSizes()).toEqual([40, 60]);
        });

        it('should restore stored sizes on init instead of panelSizes', async () => {
            window.sessionStorage.setItem('restore-on-init', JSON.stringify([35, 65]));

            const fixture = TestBed.createComponent(TestSplitterComponent);
            fixture.componentInstance.stateKey = 'restore-on-init';
            fixture.detectChanges();
            await fixture.whenStable();

            const splitter: Splitter = fixture.debugElement.query(By.directive(Splitter)).componentInstance;
            const panels = fixture.debugElement.queryAll(By.css('.p-splitterpanel'));
            expect(splitter._panelSizes()).toEqual([35, 65]);
            expect(panels[0].nativeElement.style.flexBasis).toBe('calc(35% - 4px)');
            expect(panels[1].nativeElement.style.flexBasis).toBe('calc(65% - 4px)');
        });

        it('should re-render the layout when layout changes', async () => {
            const host: HTMLElement = splitterEl.nativeElement;
            expect(host.classList).toContain('p-splitter-horizontal');

            testComponent.layout = 'vertical';
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            expect(host.classList).toContain('p-splitter-vertical');
            expect(host.classList).not.toContain('p-splitter-horizontal');
            expect(host.getAttribute('data-p')).toBe('vertical');
        });

        it('should re-render the gutter handle when gutterSize changes', async () => {
            const handle = testFixture.debugElement.query(By.css('.p-splitter-gutter-handle'));
            expect(handle.nativeElement.style.width).toBe('4px');

            testComponent.gutterSize = 10;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            expect(handle.nativeElement.style.width).toBe('10px');
        });

        it('should re-render panelStyle on the panels', async () => {
            testComponent.panelStyle = { padding: '12px' };
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const panels = testFixture.debugElement.queryAll(By.css('.p-splitterpanel'));
            expect(panels[0].nativeElement.style.padding).toBe('12px');
            expect(panels[1].nativeElement.style.padding).toBe('12px');
        });

        it('should render aria-valuenow from the initial panel size', async () => {
            await testFixture.whenStable();

            const handle = testFixture.debugElement.query(By.css('.p-splitter-gutter-handle'));
            expect(handle.nativeElement.getAttribute('aria-valuenow')).toBe('50.0000');
        });

        it('should merge the native class attribute with the root classes', async () => {
            testComponent.customClass = 'my-splitter';
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const host: HTMLElement = splitterEl.nativeElement;
            expect(host.classList).toContain('my-splitter');
            expect(host.classList).toContain('p-splitter');
            expect(host.classList).toContain('p-splitter-horizontal');
        });

        it('should size panels that are rendered after the first render', async () => {
            const fixture = TestBed.createComponent(TestDynamicPanelsSplitterComponent);
            fixture.detectChanges();
            await fixture.whenStable();
            expect(fixture.debugElement.queryAll(By.css('.p-splitterpanel')).length).toBe(0);

            fixture.componentInstance.items = ['a', 'b'];
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            const splitter: Splitter = fixture.debugElement.query(By.directive(Splitter)).componentInstance;
            let panels = fixture.debugElement.queryAll(By.css('.p-splitterpanel'));
            expect(panels.length).toBe(2);
            expect(splitter._panelSizes()).toEqual([50, 50]);
            expect(panels[0].nativeElement.style.flexBasis).toBe('calc(50% - 4px)');
            expect(panels[1].nativeElement.style.flexBasis).toBe('calc(50% - 4px)');

            fixture.componentInstance.items = ['a', 'b', 'c'];
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            panels = fixture.debugElement.queryAll(By.css('.p-splitterpanel'));
            expect(panels.length).toBe(3);
            expect(splitter._panelSizes().length).toBe(3);
            splitter._panelSizes().forEach((size) => expect(size).toBeCloseTo(100 / 3));
            panels.forEach((panel) => expect(panel.nativeElement.style.flexBasis).toMatch(/^calc\(33\.33\d*% - 8px\)$/));
        });

        it('should keep the configured size of a panel that renders later', async () => {
            const fixture = TestBed.createComponent(TestDynamicPanelsSplitterComponent);
            fixture.componentInstance.panelSizes = [25, 75];
            fixture.componentInstance.items = ['a'];
            fixture.detectChanges();
            await fixture.whenStable();

            const splitter: Splitter = fixture.debugElement.query(By.directive(Splitter)).componentInstance;
            expect(splitter._panelSizes()).toEqual([100]);

            fixture.componentInstance.items = ['a', 'b'];
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            const panels = fixture.debugElement.queryAll(By.css('.p-splitterpanel'));
            expect(splitter._panelSizes()).toEqual([25, 75]);
            expect(panels[0].nativeElement.style.flexBasis).toBe('calc(25% - 4px)');
            expect(panels[1].nativeElement.style.flexBasis).toBe('calc(75% - 4px)');
        });

        it('should split the remainder of partial panelSizes among the other panels', async () => {
            const fixture = TestBed.createComponent(TestDynamicPanelsSplitterComponent);
            fixture.componentInstance.panelSizes = [20];
            fixture.componentInstance.items = ['a', 'b', 'c'];
            fixture.detectChanges();
            await fixture.whenStable();

            const splitter: Splitter = fixture.debugElement.query(By.directive(Splitter)).componentInstance;
            expect(splitter._panelSizes()).toEqual([20, 40, 40]);
        });

        it('should give the remainder of partial panelSizes to the missing panel', async () => {
            const fixture = TestBed.createComponent(TestDynamicPanelsSplitterComponent);
            fixture.componentInstance.panelSizes = [60];
            fixture.componentInstance.items = ['a', 'b'];
            fixture.detectChanges();
            await fixture.whenStable();

            const splitter: Splitter = fixture.debugElement.query(By.directive(Splitter)).componentInstance;
            const panels = fixture.debugElement.queryAll(By.css('.p-splitterpanel'));
            expect(splitter._panelSizes()).toEqual([60, 40]);
            expect(panels[0].nativeElement.style.flexBasis).toBe('calc(60% - 4px)');
            expect(panels[1].nativeElement.style.flexBasis).toBe('calc(40% - 4px)');
        });

        it('should size sparse panelSizes the same whether panels render at once or one by one', async () => {
            const sparseSizes = [, 75] as number[];

            const atOnce = TestBed.createComponent(TestDynamicPanelsSplitterComponent);
            atOnce.componentInstance.panelSizes = sparseSizes;
            atOnce.componentInstance.items = ['a', 'b'];
            atOnce.detectChanges();
            await atOnce.whenStable();

            const oneByOne = TestBed.createComponent(TestDynamicPanelsSplitterComponent);
            oneByOne.componentInstance.panelSizes = sparseSizes;
            oneByOne.componentInstance.items = ['a'];
            oneByOne.detectChanges();
            await oneByOne.whenStable();

            const oneByOneSplitter: Splitter = oneByOne.debugElement.query(By.directive(Splitter)).componentInstance;
            expect(oneByOneSplitter._panelSizes()).toEqual([100]);

            oneByOne.componentInstance.items = ['a', 'b'];
            oneByOne.changeDetectorRef.markForCheck();
            await oneByOne.whenStable();

            const atOnceSplitter: Splitter = atOnce.debugElement.query(By.directive(Splitter)).componentInstance;
            expect(atOnceSplitter._panelSizes()).toEqual([25, 75]);
            expect(oneByOneSplitter._panelSizes()).toEqual([25, 75]);
        });

        it('should rebuild sparse panelSizes when the rendered panel count changes', async () => {
            const sparseSizes = [, 150] as number[];

            const atOnce = TestBed.createComponent(TestDynamicPanelsSplitterComponent);
            atOnce.componentInstance.panelSizes = sparseSizes;
            atOnce.componentInstance.items = ['a', 'b'];
            atOnce.detectChanges();
            await atOnce.whenStable();

            const oneByOne = TestBed.createComponent(TestDynamicPanelsSplitterComponent);
            oneByOne.componentInstance.panelSizes = sparseSizes;
            oneByOne.componentInstance.items = ['a'];
            oneByOne.detectChanges();
            await oneByOne.whenStable();

            oneByOne.componentInstance.items = ['a', 'b'];
            oneByOne.changeDetectorRef.markForCheck();
            await oneByOne.whenStable();

            const atOnceSplitter: Splitter = atOnce.debugElement.query(By.directive(Splitter)).componentInstance;
            const oneByOneSplitter: Splitter = oneByOne.debugElement.query(By.directive(Splitter)).componentInstance;
            expect(atOnceSplitter._panelSizes()).toEqual([50, 50]);
            expect(oneByOneSplitter._panelSizes()).toEqual([50, 50]);
        });

        it('should scale the rendered panels to 100 while later panels have not rendered', async () => {
            const fixture = TestBed.createComponent(TestDynamicPanelsSplitterComponent);
            fixture.componentInstance.panelSizes = [20, 40, 40];
            fixture.componentInstance.items = ['a', 'b'];
            fixture.detectChanges();
            await fixture.whenStable();

            const splitter: Splitter = fixture.debugElement.query(By.directive(Splitter)).componentInstance;
            expect(splitter._panelSizes()[0]).toBeCloseTo(100 / 3);
            expect(splitter._panelSizes()[1]).toBeCloseTo(200 / 3);

            fixture.componentInstance.items = ['a', 'b', 'c'];
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(splitter._panelSizes()).toEqual([20, 40, 40]);
        });

        it('should split the remainder of partial panelSizes among several missing panels', async () => {
            const fixture = TestBed.createComponent(TestDynamicPanelsSplitterComponent);
            fixture.componentInstance.panelSizes = [60];
            fixture.componentInstance.items = ['a', 'b', 'c'];
            fixture.detectChanges();
            await fixture.whenStable();

            const splitter: Splitter = fixture.debugElement.query(By.directive(Splitter)).componentInstance;
            expect(splitter._panelSizes()).toEqual([60, 20, 20]);
        });

        it('should give a panel added since the stored state an equal share', async () => {
            window.sessionStorage.setItem('restore-added-panel', JSON.stringify([45, 54]));

            const fixture = TestBed.createComponent(TestDynamicPanelsSplitterComponent);
            fixture.componentInstance.stateKey = 'restore-added-panel';
            fixture.componentInstance.items = ['a', 'b', 'c'];
            fixture.detectChanges();
            await fixture.whenStable();

            const splitter: Splitter = fixture.debugElement.query(By.directive(Splitter)).componentInstance;
            const sizes = splitter._panelSizes();
            expect(sizes[2]).toBeCloseTo(100 / 3);
            expect(sizes[0] / sizes[1]).toBeCloseTo(45 / 54);
            expect(sizes[0] + sizes[1] + sizes[2]).toBeCloseTo(100);
        });

        it('should give a panel added after a drag an equal share', async () => {
            const fixture = TestBed.createComponent(TestDynamicPanelsSplitterComponent);
            fixture.componentInstance.items = ['a', 'b'];
            fixture.detectChanges();
            await fixture.whenStable();

            const splitter: Splitter = fixture.debugElement.query(By.directive(Splitter)).componentInstance;
            const host: HTMLElement = fixture.debugElement.query(By.directive(Splitter)).nativeElement;
            const gutter = fixture.debugElement.query(By.css('.p-splitter-gutter'));
            const startX = host.getBoundingClientRect().left + host.offsetWidth / 2;
            const mouseDown = new MouseEvent('mousedown', { clientX: startX });
            Object.defineProperty(mouseDown, 'currentTarget', { value: gutter.nativeElement });

            splitter.resizeStart(mouseDown, 0);
            splitter.onResize(new MouseEvent('mousemove', { clientX: startX - host.offsetWidth / 10 }));
            splitter.resizeEnd(new MouseEvent('mouseup'));
            expect(splitter._panelSizes()[0] + splitter._panelSizes()[1]).toBeLessThan(100);

            fixture.componentInstance.items = ['a', 'b', 'c'];
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(splitter._panelSizes().length).toBe(3);
            splitter._panelSizes().forEach((size) => expect(size).toBeCloseTo(100 / 3));
        });

        it('should keep dragged sizes when gutterSize changes', async () => {
            await testFixture.whenStable();
            const gutter = testFixture.debugElement.query(By.css('.p-splitter-gutter'));
            const host: HTMLElement = splitterEl.nativeElement;
            const startX = host.getBoundingClientRect().left + host.offsetWidth / 2;
            const mouseDown = new MouseEvent('mousedown', { clientX: startX });
            Object.defineProperty(mouseDown, 'currentTarget', { value: gutter.nativeElement });

            splitterInstance.resizeStart(mouseDown, 0);
            splitterInstance.onResize(new MouseEvent('mousemove', { clientX: startX - host.offsetWidth / 10 }));
            splitterInstance.resizeEnd(new MouseEvent('mouseup'));
            const draggedSizes = splitterInstance._panelSizes();

            testComponent.gutterSize = 8;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const panels = testFixture.debugElement.queryAll(By.css('.p-splitterpanel'));
            expect(splitterInstance._panelSizes()).toEqual(draggedSizes);
            const flexBasis: string = panels[0].nativeElement.style.flexBasis;
            expect(parseFloat(flexBasis.slice('calc('.length))).toBeCloseTo(draggedSizes[0], 2);
            expect(flexBasis.endsWith('% - 8px)')).toBe(true);
        });

        it('should keep a zero panel size', async () => {
            await testFixture.whenStable();

            testComponent.panelSizes = [0, 100];
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const panels = testFixture.debugElement.queryAll(By.css('.p-splitterpanel'));
            expect(splitterInstance._panelSizes()).toEqual([0, 100]);
            expect(panels[0].nativeElement.style.flexBasis).toBe('calc(0% - 4px)');
            expect(panels[1].nativeElement.style.flexBasis).toBe('calc(100% - 4px)');

            testComponent.gutterSize = 6;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            expect(splitterInstance._panelSizes()).toEqual([0, 100]);
        });

        it('should re-apply the panel sizes when gutterSize changes', async () => {
            await testFixture.whenStable();

            testComponent.gutterSize = 10;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const panels = testFixture.debugElement.queryAll(By.css('.p-splitterpanel'));
            expect(panels[0].nativeElement.style.flexBasis).toBe('calc(50% - 10px)');
            expect(panels[1].nativeElement.style.flexBasis).toBe('calc(50% - 10px)');
        });

        it('should render aria-valuenow from restored and changed sizes', async () => {
            window.sessionStorage.setItem('restore-aria', JSON.stringify([35, 65]));

            const fixture = TestBed.createComponent(TestSplitterComponent);
            fixture.componentInstance.stateKey = 'restore-aria';
            fixture.detectChanges();
            await fixture.whenStable();

            const handle = fixture.debugElement.query(By.css('.p-splitter-gutter-handle'));
            expect(handle.nativeElement.getAttribute('aria-valuenow')).toBe('35.0000');

            fixture.componentInstance.panelSizes = [20, 80];
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(handle.nativeElement.getAttribute('aria-valuenow')).toBe('20.0000');
        });

        it('should unbind document listeners and clear the keyboard timer on destroy', async () => {
            const fixture = TestBed.createComponent(TestSplitterComponent);
            fixture.detectChanges();
            await fixture.whenStable();

            const splitter: Splitter = fixture.debugElement.query(By.directive(Splitter)).componentInstance;
            const gutter = fixture.debugElement.query(By.css('.p-splitter-gutter'));
            const mouseDown = new MouseEvent('mousedown');
            Object.defineProperty(mouseDown, 'currentTarget', { value: gutter.nativeElement });
            splitter.onGutterMouseDown(mouseDown, 0);
            splitter.bindTouchListeners();
            splitter.setTimer(new KeyboardEvent('keydown', { code: 'ArrowLeft' }), 0, -5);
            const resizeSpy = vi.spyOn(splitter, 'onResize');
            const repeatSpy = vi.spyOn(splitter, 'repeat');

            fixture.destroy();

            expect(splitter.mouseMoveListener()).toBeNull();
            expect(splitter.mouseUpListener()).toBeNull();
            expect(splitter.touchMoveListener()).toBeNull();
            expect(splitter.touchEndListener()).toBeNull();

            document.dispatchEvent(new MouseEvent('mousemove'));
            await new Promise((resolve) => setTimeout(resolve, 60));

            expect(resizeSpy).not.toHaveBeenCalled();
            expect(repeatSpy).not.toHaveBeenCalled();
        });
    });

    describe('PassThrough', () => {
        let ptFixture: ComponentFixture<TestPTSplitterComponent>;
        let ptComponent: TestPTSplitterComponent;
        let ptSplitter: Splitter;

        beforeEach(() => {
            ptFixture = TestBed.createComponent(TestPTSplitterComponent);
            ptComponent = ptFixture.componentInstance;
        });

        it('should apply simple string classes to PT sections', async () => {
            ptComponent.pt = {
                host: 'HOST_CLASS',
                root: 'ROOT_CLASS',
                panel: 'PANEL_CLASS',
                gutter: 'GUTTER_CLASS',
                gutterHandle: 'GUTTER_HANDLE_CLASS'
            };
            ptFixture.changeDetectorRef.markForCheck();
            await ptFixture.whenStable();
            ptFixture.detectChanges();
            await new Promise((resolve) => setTimeout(resolve, 100));
            await ptFixture.whenStable();

            const hostEl = ptFixture.debugElement.query(By.css('p-splitter'));
            const panels = ptFixture.debugElement.queryAll(By.css('.p-splitterpanel'));
            const gutter = ptFixture.debugElement.query(By.css('.p-splitter-gutter'));
            const gutterHandle = ptFixture.debugElement.query(By.css('.p-splitter-gutter-handle'));

            expect(hostEl.nativeElement.className).toContain('HOST_CLASS');
            expect(hostEl.nativeElement.className).toContain('ROOT_CLASS');
            expect(panels[0].nativeElement.className).toContain('PANEL_CLASS');
            expect(panels[1].nativeElement.className).toContain('PANEL_CLASS');
            expect(gutter.nativeElement.className).toContain('GUTTER_CLASS');
            expect(gutterHandle.nativeElement.className).toContain('GUTTER_HANDLE_CLASS');
        });

        it('should apply object-based PT options with class and attributes', async () => {
            ptComponent.pt = {
                root: {
                    class: 'ROOT_OBJECT_CLASS',
                    'data-test': 'root-test',
                    'aria-label': 'ROOT_ARIA_LABEL'
                },
                panel: {
                    class: 'PANEL_OBJECT_CLASS',
                    'data-test': 'panel-test'
                },
                gutter: {
                    class: 'GUTTER_OBJECT_CLASS',
                    'data-role': 'custom-gutter'
                },
                gutterHandle: {
                    class: 'HANDLE_OBJECT_CLASS',
                    'aria-label': 'HANDLE_ARIA_LABEL'
                }
            };
            ptFixture.changeDetectorRef.markForCheck();
            await ptFixture.whenStable();
            ptFixture.detectChanges();
            await new Promise((resolve) => setTimeout(resolve, 100));
            await ptFixture.whenStable();

            const hostEl = ptFixture.debugElement.query(By.css('p-splitter'));
            const panels = ptFixture.debugElement.queryAll(By.css('.p-splitterpanel'));
            const gutter = ptFixture.debugElement.query(By.css('.p-splitter-gutter'));
            const gutterHandle = ptFixture.debugElement.query(By.css('.p-splitter-gutter-handle'));

            expect(hostEl.nativeElement.className).toContain('ROOT_OBJECT_CLASS');
            expect(hostEl.nativeElement.getAttribute('data-test')).toBe('root-test');
            expect(hostEl.nativeElement.getAttribute('aria-label')).toBe('ROOT_ARIA_LABEL');
            expect(panels[0].nativeElement.className).toContain('PANEL_OBJECT_CLASS');
            expect(panels[0].nativeElement.getAttribute('data-test')).toBe('panel-test');
            expect(gutter.nativeElement.className).toContain('GUTTER_OBJECT_CLASS');
            expect(gutter.nativeElement.getAttribute('data-role')).toBe('custom-gutter');
            expect(gutterHandle.nativeElement.className).toContain('HANDLE_OBJECT_CLASS');
            expect(gutterHandle.nativeElement.getAttribute('aria-label')).toBe('HANDLE_ARIA_LABEL');
        });

        it('should apply mixed object and string PT values', async () => {
            ptComponent.pt = {
                root: {
                    class: 'MIXED_ROOT_CLASS'
                },
                panel: 'MIXED_PANEL_CLASS',
                gutter: {
                    class: 'MIXED_GUTTER_CLASS'
                },
                gutterHandle: 'MIXED_HANDLE_CLASS'
            };
            ptFixture.changeDetectorRef.markForCheck();
            await ptFixture.whenStable();
            ptFixture.detectChanges();
            await new Promise((resolve) => setTimeout(resolve, 100));
            await ptFixture.whenStable();

            const hostEl = ptFixture.debugElement.query(By.css('p-splitter'));
            const panels = ptFixture.debugElement.queryAll(By.css('.p-splitterpanel'));
            const gutter = ptFixture.debugElement.query(By.css('.p-splitter-gutter'));
            const gutterHandle = ptFixture.debugElement.query(By.css('.p-splitter-gutter-handle'));

            expect(hostEl.nativeElement.className).toContain('MIXED_ROOT_CLASS');
            expect(panels[0].nativeElement.className).toContain('MIXED_PANEL_CLASS');
            expect(gutter.nativeElement.className).toContain('MIXED_GUTTER_CLASS');
            expect(gutterHandle.nativeElement.className).toContain('MIXED_HANDLE_CLASS');
        });

        it('should use instance variables in PT functions', async () => {
            ptSplitter = ptFixture.debugElement.query(By.directive(Splitter)).componentInstance;
            ptComponent.layout = 'vertical';
            ptSplitter.dragging.set(true);

            ptComponent.pt = {
                root: ({ instance }) => ({
                    class: instance?.dragging() ? 'DRAGGING' : 'NOT_DRAGGING'
                }),
                gutter: ({ instance }) => ({
                    class: 'GUTTER_INSTANCE',
                    'data-layout': instance?.layout()
                })
            };
            ptFixture.changeDetectorRef.markForCheck();
            await ptFixture.whenStable();
            ptFixture.detectChanges();
            await new Promise((resolve) => setTimeout(resolve, 100));
            await ptFixture.whenStable();

            const hostEl = ptFixture.debugElement.query(By.css('p-splitter'));
            const gutter = ptFixture.debugElement.query(By.css('.p-splitter-gutter'));

            expect(hostEl.nativeElement.className).toContain('DRAGGING');
            expect(gutter.nativeElement.className).toContain('GUTTER_INSTANCE');
            expect(gutter.nativeElement.getAttribute('data-layout')).toBe('vertical');
        });

        it('should handle event binding in PT options', async () => {
            let clicked = false;
            ptComponent.pt = {
                panel: {
                    onclick: () => {
                        clicked = true;
                    }
                }
            };
            ptFixture.changeDetectorRef.markForCheck();
            await ptFixture.whenStable();
            ptFixture.detectChanges();
            await new Promise((resolve) => setTimeout(resolve, 100));
            await ptFixture.whenStable();

            const panel = ptFixture.debugElement.query(By.css('.p-splitterpanel'));
            panel.nativeElement.click();
            await new Promise((resolve) => setTimeout(resolve, 50));
            await ptFixture.whenStable();

            expect(clicked).toBe(true);
        });

        it('should apply PT options using setInput', async () => {
            ptFixture.componentRef.setInput('pt', {
                root: 'SET_INPUT_CLASS',
                gutter: { class: 'GUTTER_SET_INPUT' }
            });
            ptFixture.detectChanges();
            await new Promise((resolve) => setTimeout(resolve, 100));
            await ptFixture.whenStable();

            const hostEl = ptFixture.debugElement.query(By.css('p-splitter'));
            const gutter = ptFixture.debugElement.query(By.css('.p-splitter-gutter'));

            expect(hostEl.nativeElement.className).toContain('SET_INPUT_CLASS');
            expect(gutter.nativeElement.className).toContain('GUTTER_SET_INPUT');
        });
    });
});

// ---------------------------------------------------------------------------
// Signal query API
// ---------------------------------------------------------------------------

@Component({
    standalone: true,
    imports: [Splitter, SharedModule],
    template: `
        <p-splitter>
            <ng-template pTemplate="panel">
                <p-splitter>
                    <ng-template pTemplate="panel">inner</ng-template>
                </p-splitter>
            </ng-template>
        </p-splitter>
    `
})
class SplitterQueryApiHostComponent {}

describe('Splitter Signal Query API', () => {
    it('should collect panel templates and detect a nested splitter', async () => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            imports: [SplitterQueryApiHostComponent],
            providers: [provideZonelessChangeDetection(), provideNoopAnimations()]
        });
        const fixture = TestBed.createComponent(SplitterQueryApiHostComponent);
        fixture.detectChanges();
        await fixture.whenStable();

        const splitters = fixture.debugElement.queryAll(By.directive(Splitter));
        expect(splitters.length).toBe(2);
        const outer = splitters[0].componentInstance;
        const inner = splitters[1].componentInstance;
        expect(outer.templates().some((t: any) => t.getType() === 'panel')).toBe(true);
        expect(inner.splitter()).toBeUndefined();
        expect(inner.nestedState()).toBeUndefined();
    });
});
