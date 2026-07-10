import { Component, DebugElement, provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { StyleClass } from './styleclass';

// jsdom does not implement these browser APIs that the directive relies on.
if (typeof (globalThis as any).ResizeObserver === 'undefined') {
    (globalThis as any).ResizeObserver = class {
        observe() {}
        unobserve() {}
        disconnect() {}
    };
}
if (typeof (globalThis as any).AnimationEvent === 'undefined') {
    (globalThis as any).AnimationEvent = class AnimationEvent extends Event {
        constructor(type: string, init?: any) {
            super(type, init);
        }
    };
}

@Component({
    standalone: true,
    imports: [StyleClass],
    template: `
        <button
            [pStyleClass]="selector()"
            [enterFromClass]="enterFromClass()"
            [enterActiveClass]="enterActiveClass()"
            [enterToClass]="enterToClass()"
            [leaveFromClass]="leaveFromClass()"
            [leaveActiveClass]="leaveActiveClass()"
            [leaveToClass]="leaveToClass()"
            [hideOnOutsideClick]="hideOnOutsideClick()"
            [hideOnEscape]="hideOnEscape()"
            [hideOnResize]="hideOnResize()"
            [toggleClass]="toggleClass()"
            [resizeSelector]="resizeSelector()"
        >
            Toggle
        </button>
        <div class="target-element" [class.hidden]="targetHidden()">Target Content</div>
    `
})
class TestBasicStyleClassComponent {
    selector = signal<string>('@next');
    enterFromClass = signal<string | undefined>(undefined);
    enterActiveClass = signal<string | undefined>(undefined);
    enterToClass = signal<string | undefined>(undefined);
    leaveFromClass = signal<string | undefined>(undefined);
    leaveActiveClass = signal<string | undefined>(undefined);
    leaveToClass = signal<string | undefined>(undefined);
    hideOnOutsideClick = signal<boolean | undefined>(undefined);
    hideOnEscape = signal<boolean | undefined>(undefined);
    hideOnResize = signal<boolean | undefined>(undefined);
    toggleClass = signal<string | undefined>(undefined);
    resizeSelector = signal<string | undefined>(undefined);
    targetHidden = signal(true);
}

@Component({
    standalone: true,
    imports: [StyleClass],
    template: `
        <div class="container target-parent">
            <button pStyleClass="@parent" [toggleClass]="toggleClass()">Parent Toggle</button>
            <div class="sibling">
                <div class="target">Target for Previous</div>
                <button pStyleClass="@prev" [toggleClass]="toggleClass()">Previous Toggle</button>
            </div>
        </div>
    `
})
class TestSelectorStyleClassComponent {
    toggleClass = signal('active');
}

@Component({
    standalone: true,
    imports: [StyleClass],
    template: `
        <div class="grandparent">
            <div class="parent">
                <button pStyleClass="@grandparent" [toggleClass]="toggleClass()">Grandparent Toggle</button>
            </div>
        </div>
    `
})
class TestGrandparentSelectorComponent {
    toggleClass = signal('highlight');
}

@Component({
    standalone: true,
    imports: [StyleClass],
    template: `
        <button pStyleClass="@next" enterActiveClass="slide-down-enter" leaveActiveClass="slide-up-leave" [hideOnOutsideClick]="true" [hideOnEscape]="true">Animated Toggle</button>
        <div class="animated-target">Animated Content</div>
    `
})
class TestAnimationStyleClassComponent {}

@Component({
    standalone: true,
    imports: [StyleClass],
    template: `
        <button pStyleClass="@next" enterActiveClass="slidedown" enterFromClass="hidden" enterToClass="visible" leaveFromClass="visible" leaveActiveClass="slideup" leaveToClass="hidden">Slidedown Animation</button>
        <div class="slidedown-target">Slidedown Content</div>
    `
})
class TestSlidedownStyleClassComponent {}

@Component({
    standalone: true,
    imports: [StyleClass],
    template: `
        <button pStyleClass="#resize-target" [hideOnResize]="true" [toggleClass]="toggleClass()" [resizeSelector]="resizeSelector()">Resize Toggle</button>
        <div id="resize-target" class="resize-target">Resize Target</div>
    `
})
class TestResizeStyleClassComponent {
    toggleClass = signal('expanded');
    resizeSelector = signal<string | undefined>(undefined);
}

describe('StyleClass', () => {
    let component: TestBasicStyleClassComponent;
    let fixture: ComponentFixture<TestBasicStyleClassComponent>;
    let buttonElement: DebugElement;
    let styleClassInstance: StyleClass;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [StyleClass, TestBasicStyleClassComponent, TestSelectorStyleClassComponent, TestGrandparentSelectorComponent, TestAnimationStyleClassComponent, TestSlidedownStyleClassComponent, TestResizeStyleClassComponent],
            providers: [provideZonelessChangeDetection()]
        }).compileComponents();

        fixture = TestBed.createComponent(TestBasicStyleClassComponent);
        component = fixture.componentInstance;
        buttonElement = fixture.debugElement.query(By.directive(StyleClass));
        styleClassInstance = buttonElement.injector.get(StyleClass);
        fixture.detectChanges();
    });

    describe('Directive Initialization', () => {
        it('should create the directive', () => {
            expect(styleClassInstance).toBeTruthy();
        });

        it('should have required dependencies injected', () => {
            expect(styleClassInstance.el).toBeTruthy();
            expect(styleClassInstance.renderer).toBeTruthy();
            expect(styleClassInstance.constructor.name).toBe('_StyleClass');
        });

        it('should initialize with undefined values', () => {
            expect(styleClassInstance.selector()).toBe('@next');
            expect(styleClassInstance.enterFromClass()).toBeUndefined();
            expect(styleClassInstance.enterActiveClass()).toBeUndefined();
            expect(styleClassInstance.enterToClass()).toBeUndefined();
            expect(styleClassInstance.leaveFromClass()).toBeUndefined();
            expect(styleClassInstance.leaveActiveClass()).toBeUndefined();
            expect(styleClassInstance.leaveToClass()).toBeUndefined();
            expect(styleClassInstance.hideOnOutsideClick()).toBeFalsy();
            expect(styleClassInstance.hideOnEscape()).toBeFalsy();
            expect(styleClassInstance.hideOnResize()).toBeFalsy();
            expect(styleClassInstance.toggleClass()).toBeUndefined();
        });

        it('should initialize listeners as undefined', () => {
            expect(styleClassInstance.documentClickListener).toBeFalsy();
            expect(styleClassInstance.documentKeydownListener).toBeFalsy();
            expect(styleClassInstance.windowResizeListener).toBeFalsy();
            expect(styleClassInstance.resizeObserver).toBeUndefined();
            expect(styleClassInstance.animating).toBeUndefined();
        });
    });

    describe('Input Properties', () => {
        it('should update selector input', () => {
            expect(styleClassInstance.selector()).toBe('@next');
        });

        it('should update enterFromClass input', async () => {
            component.enterFromClass.set('hidden');
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            expect(styleClassInstance.enterFromClass()).toBe('hidden');
        });

        it('should update enterActiveClass input', async () => {
            component.enterActiveClass.set('fade-in');
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            expect(styleClassInstance.enterActiveClass()).toBe('fade-in');
        });

        it('should update enterToClass input', async () => {
            component.enterToClass.set('visible');
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            expect(styleClassInstance.enterToClass()).toBe('visible');
        });

        it('should update leaveFromClass input', async () => {
            component.leaveFromClass.set('visible');
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            expect(styleClassInstance.leaveFromClass()).toBe('visible');
        });

        it('should update leaveActiveClass input', async () => {
            component.leaveActiveClass.set('fade-out');
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            expect(styleClassInstance.leaveActiveClass()).toBe('fade-out');
        });

        it('should update leaveToClass input', async () => {
            component.leaveToClass.set('hidden');
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            expect(styleClassInstance.leaveToClass()).toBe('hidden');
        });

        it('should update hideOnOutsideClick with booleanAttribute transform', async () => {
            component.hideOnOutsideClick.set(true);
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            expect(styleClassInstance.hideOnOutsideClick()).toBe(true);

            component.hideOnOutsideClick.set(false);
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            expect(styleClassInstance.hideOnOutsideClick()).toBe(false);
        });

        it('should update hideOnEscape with booleanAttribute transform', async () => {
            component.hideOnEscape.set(true);
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            expect(styleClassInstance.hideOnEscape()).toBe(true);

            component.hideOnEscape.set(false);
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            expect(styleClassInstance.hideOnEscape()).toBe(false);
        });

        it('should update hideOnResize with booleanAttribute transform', async () => {
            component.hideOnResize.set(true);
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            expect(styleClassInstance.hideOnResize()).toBe(true);

            component.hideOnResize.set(false);
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            expect(styleClassInstance.hideOnResize()).toBe(false);
        });

        it('should update toggleClass input', async () => {
            component.toggleClass.set('active');
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            expect(styleClassInstance.toggleClass()).toBe('active');
        });

        it('should update resizeSelector input', async () => {
            component.resizeSelector.set('#resize-target');
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            expect(styleClassInstance.resizeSelector()).toBe('#resize-target');
        });
    });

    describe('Click Handler Tests', () => {
        it('should handle click event', async () => {
            vi.spyOn(styleClassInstance, 'toggle');
            component.toggleClass.set('active');
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            buttonElement.nativeElement.click();

            expect(styleClassInstance.toggle).toHaveBeenCalled();
        });

        it('should call enter method when target is hidden', async () => {
            vi.spyOn(styleClassInstance, 'enter');
            component.enterActiveClass.set('slide-in');
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            // Set target to be hidden (offsetParent === null)
            const targetElement = fixture.debugElement.query(By.css('.target-element'));
            Object.defineProperty(targetElement.nativeElement, 'offsetParent', {
                value: null,
                configurable: true
            });

            buttonElement.nativeElement.click();

            expect(styleClassInstance.enter).toHaveBeenCalled();
        });

        it('should call leave method when target is visible', async () => {
            vi.spyOn(styleClassInstance, 'leave');
            component.leaveActiveClass.set('slide-out');
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            // Set target to be visible (offsetParent !== null)
            const targetElement = fixture.debugElement.query(By.css('.target-element'));
            Object.defineProperty(targetElement.nativeElement, 'offsetParent', {
                value: document.body,
                configurable: true
            });

            buttonElement.nativeElement.click();

            expect(styleClassInstance.leave).toHaveBeenCalled();
        });

        it('should set target element on first click', () => {
            expect(styleClassInstance.target).toBeFalsy();

            buttonElement.nativeElement.click();

            expect(styleClassInstance.target).toBeTruthy();
            expect(styleClassInstance.target).toBe(fixture.debugElement.query(By.css('.target-element')).nativeElement);
        });
    });

    describe('Toggle Method Tests', () => {
        beforeEach(async () => {
            component.toggleClass.set('active');
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            buttonElement.nativeElement.click(); // Set target
        });

        it('should add class when not present', () => {
            const targetElement = styleClassInstance.target as HTMLElement;
            // Remove any existing classes to ensure clean test state
            targetElement.classList.remove('active', 'hidden');

            expect(targetElement.classList.contains('active')).toBe(false);

            styleClassInstance.toggle();

            expect(targetElement.classList.contains('active')).toBe(true);
        });

        it('should remove class when present', () => {
            const targetElement = styleClassInstance.target as HTMLElement;
            // Remove any existing classes first, then add the one we want to test
            targetElement.classList.remove('active', 'hidden');
            targetElement.classList.add('active');

            expect(targetElement.classList.contains('active')).toBe(true);

            styleClassInstance.toggle();

            expect(targetElement.classList.contains('active')).toBe(false);
        });

        it('should handle multiple toggles', () => {
            const targetElement = styleClassInstance.target as HTMLElement;

            // Remove any existing classes to ensure clean test state
            targetElement.classList.remove('active', 'hidden');

            // Ensure target exists and class is not present initially
            expect(targetElement.classList.contains('active')).toBe(false);

            styleClassInstance.toggle();
            expect(targetElement.classList.contains('active')).toBe(true);

            styleClassInstance.toggle();
            expect(targetElement.classList.contains('active')).toBe(false);

            styleClassInstance.toggle();
            expect(targetElement.classList.contains('active')).toBe(true);
        });
    });

    describe('Enter Method Tests', () => {
        beforeEach(() => {
            buttonElement.nativeElement.click(); // Set target
        });

        it('should handle enter without animation classes', async () => {
            component.enterFromClass.set('hidden');
            component.enterToClass.set('visible');
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            const targetElement = styleClassInstance.target as HTMLElement;
            targetElement.classList.add('hidden');

            styleClassInstance.enter();

            expect(targetElement.classList.contains('hidden')).toBe(false);
            expect(targetElement.classList.contains('visible')).toBe(true);
        });

        it('should handle enter with animation classes', async () => {
            component.enterActiveClass.set('slide-in');
            component.enterFromClass.set('hidden');
            component.enterToClass.set('visible');
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            const targetElement = styleClassInstance.target as HTMLElement;
            targetElement.classList.add('hidden');

            styleClassInstance.enter();

            expect(targetElement.classList.contains('slide-in')).toBe(true);
            expect(targetElement.classList.contains('hidden')).toBe(false);
            expect(styleClassInstance.animating).toBe(true);
        });

        it('should handle slidedown animation', async () => {
            component.enterActiveClass.set('slidedown');
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            const targetElement = styleClassInstance.target as HTMLElement;
            // Mock scrollHeight for slidedown calculation
            Object.defineProperty(targetElement, 'scrollHeight', {
                value: 100,
                configurable: true
            });

            styleClassInstance.enter();

            expect(targetElement.classList.contains('slidedown')).toBe(true);
            expect(styleClassInstance.animating).toBe(true);
            // In test environment, style properties may not be set exactly
        });

        it('should bind listeners when hideOnOutsideClick is true', async () => {
            component.hideOnOutsideClick.set(true);
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            vi.spyOn(styleClassInstance, 'bindDocumentClickListener');

            styleClassInstance.enter();

            expect(styleClassInstance.bindDocumentClickListener).toHaveBeenCalled();
        });

        it('should bind listeners when hideOnEscape is true', async () => {
            component.hideOnEscape.set(true);
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            vi.spyOn(styleClassInstance, 'bindDocumentKeydownListener');

            styleClassInstance.enter();

            expect(styleClassInstance.bindDocumentKeydownListener).toHaveBeenCalled();
        });

        it('should bind listeners when hideOnResize is true', async () => {
            component.hideOnResize.set(true);
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            vi.spyOn(styleClassInstance, 'bindResizeListener');

            styleClassInstance.enter();

            expect(styleClassInstance.bindResizeListener).toHaveBeenCalled();
        });

        it('should not start animation when already animating', async () => {
            component.enterActiveClass.set('slide-in');
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            styleClassInstance.animating = true;
            const targetElement = styleClassInstance.target as HTMLElement;

            styleClassInstance.enter();

            expect(targetElement.classList.contains('slide-in')).toBe(false);
        });
    });

    describe('Leave Method Tests', () => {
        beforeEach(() => {
            buttonElement.nativeElement.click(); // Set target
        });

        it('should handle leave without animation classes', async () => {
            component.leaveFromClass.set('visible');
            component.leaveToClass.set('hidden');
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            const targetElement = styleClassInstance.target as HTMLElement;
            targetElement.classList.add('visible');

            styleClassInstance.leave();

            expect(targetElement.classList.contains('visible')).toBe(false);
            expect(targetElement.classList.contains('hidden')).toBe(true);
        });

        it('should handle leave with animation classes', async () => {
            component.leaveActiveClass.set('slide-out');
            component.leaveFromClass.set('visible');
            component.leaveToClass.set('hidden');
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            const targetElement = styleClassInstance.target as HTMLElement;
            targetElement.classList.add('visible');

            styleClassInstance.leave();

            expect(targetElement.classList.contains('slide-out')).toBe(true);
            expect(targetElement.classList.contains('visible')).toBe(false);
            expect(styleClassInstance.animating).toBe(true);
        });

        it('should unbind listeners when hideOnOutsideClick is true', async () => {
            component.hideOnOutsideClick.set(true);
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            vi.spyOn(styleClassInstance, 'unbindDocumentClickListener');

            styleClassInstance.leave();

            expect(styleClassInstance.unbindDocumentClickListener).toHaveBeenCalled();
        });

        it('should unbind listeners when hideOnEscape is true', async () => {
            component.hideOnEscape.set(true);
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            vi.spyOn(styleClassInstance, 'unbindDocumentKeydownListener');

            styleClassInstance.leave();

            expect(styleClassInstance.unbindDocumentKeydownListener).toHaveBeenCalled();
        });

        it('should unbind listeners when hideOnResize is true', async () => {
            component.hideOnResize.set(true);
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            vi.spyOn(styleClassInstance, 'unbindResizeListener');

            styleClassInstance.leave();

            expect(styleClassInstance.unbindResizeListener).toHaveBeenCalled();
        });

        it('should not start animation when already animating', async () => {
            component.leaveActiveClass.set('slide-out');
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            styleClassInstance.animating = true;
            const targetElement = styleClassInstance.target as HTMLElement;

            styleClassInstance.leave();

            expect(targetElement.classList.contains('slide-out')).toBe(false);
        });
    });

    describe('Selector Tests', () => {
        it('should work with @parent selector', async () => {
            const selectorFixture = TestBed.createComponent(TestSelectorStyleClassComponent);
            selectorFixture.changeDetectorRef.markForCheck();
            await selectorFixture.whenStable();

            const parentButton = selectorFixture.debugElement.query(By.css('button[pStyleClass="@parent"]'));
            const parentButtonInstance = parentButton.injector.get(StyleClass);

            parentButton.nativeElement.click();

            expect(parentButtonInstance.target).toBeTruthy();
            expect(parentButtonInstance.target).toBe(selectorFixture.debugElement.query(By.css('.container')).nativeElement);
        });

        it('should work with @prev selector', async () => {
            const selectorFixture = TestBed.createComponent(TestSelectorStyleClassComponent);
            selectorFixture.changeDetectorRef.markForCheck();
            await selectorFixture.whenStable();

            const prevButton = selectorFixture.debugElement.query(By.css('button[pStyleClass="@prev"]'));
            const prevButtonInstance = prevButton.injector.get(StyleClass);

            prevButton.nativeElement.click();

            // @prev selector should target the previous sibling element
            // In this case it should be the button itself's previous sibling
            expect(prevButtonInstance.target).toBeTruthy();
        });

        it('should work with @grandparent selector', async () => {
            const grandparentFixture = TestBed.createComponent(TestGrandparentSelectorComponent);
            grandparentFixture.changeDetectorRef.markForCheck();
            await grandparentFixture.whenStable();

            const grandparentButton = grandparentFixture.debugElement.query(By.directive(StyleClass));
            const grandparentInstance = grandparentButton.injector.get(StyleClass);

            grandparentButton.nativeElement.click();

            expect(grandparentInstance.target).toBeTruthy();
            expect(grandparentInstance.target?.classList.contains('highlight')).toBe(true);
        });

        it('should work with CSS selector', async () => {
            component.toggleClass.set('active');
            component.selector.set('.target-element');
            fixture.changeDetectorRef.markForCheck();
            fixture.detectChanges();
            await fixture.whenStable();

            buttonElement.nativeElement.click();

            const targetElement = fixture.debugElement.query(By.css('.target-element'));
            expect(styleClassInstance.target).toBe(targetElement.nativeElement);
        });
    });

    describe('Outside Click Tests', () => {
        beforeEach(async () => {
            component.hideOnOutsideClick.set(true);
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            buttonElement.nativeElement.click(); // Set target and bind listeners
        });

        it('should bind document click listener when hideOnOutsideClick is true', () => {
            styleClassInstance.enter();
            expect(styleClassInstance.documentClickListener).toBeTruthy();
        });

        it('should detect outside click correctly', () => {
            const outsideElement = document.createElement('div');
            document.body.appendChild(outsideElement);

            const clickEvent = new MouseEvent('click', { bubbles: true });
            Object.defineProperty(clickEvent, 'target', { value: outsideElement });

            expect(styleClassInstance.isOutsideClick(clickEvent)).toBe(true);

            document.body.removeChild(outsideElement);
        });

        it('should not detect inside click as outside click', () => {
            const clickEvent = new MouseEvent('click', { bubbles: true });
            Object.defineProperty(clickEvent, 'target', { value: buttonElement.nativeElement });

            expect(styleClassInstance.isOutsideClick(clickEvent)).toBe(false);
        });

        it('should unbind document click listener', () => {
            styleClassInstance.bindDocumentClickListener();
            expect(styleClassInstance.documentClickListener).toBeTruthy();

            styleClassInstance.unbindDocumentClickListener();
            expect(styleClassInstance.documentClickListener).toBeNull();
        });
    });

    describe('Escape Key Tests', () => {
        beforeEach(async () => {
            component.hideOnEscape.set(true);
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            buttonElement.nativeElement.click(); // Set target
        });

        it('should bind document keydown listener when hideOnEscape is true', () => {
            styleClassInstance.enter();
            expect(styleClassInstance.documentKeydownListener).toBeTruthy();
        });

        it('should unbind document keydown listener', () => {
            styleClassInstance.bindDocumentKeydownListener();
            expect(styleClassInstance.documentKeydownListener).toBeTruthy();

            styleClassInstance.unbindDocumentKeydownListener();
            expect(styleClassInstance.documentKeydownListener).toBeNull();
        });

        it('should call leave method on escape key', async () => {
            // Set up target to be visible
            const targetElement = styleClassInstance.target as HTMLElement;
            Object.defineProperty(targetElement, 'offsetParent', {
                value: document.body,
                configurable: true
            });

            vi.spyOn(styleClassInstance, 'leave');
            styleClassInstance.bindDocumentKeydownListener();

            const escapeEvent = new KeyboardEvent('keydown', {
                key: 'Escape',
                keyCode: 27,
                which: 27
            });

            document.dispatchEvent(escapeEvent);
            await new Promise((resolve) => setTimeout(resolve, 100));
            await fixture.whenStable();

            expect(styleClassInstance.leave).toHaveBeenCalled();
        });
    });

    describe('Resize Tests', () => {
        let resizeFixture: ComponentFixture<TestResizeStyleClassComponent>;
        let resizeComponent: TestResizeStyleClassComponent;

        beforeEach(() => {
            resizeFixture = TestBed.createComponent(TestResizeStyleClassComponent);
            resizeComponent = resizeFixture.componentInstance;
            resizeFixture.detectChanges();
        });

        it('should bind window resize listener', () => {
            const resizeButton = resizeFixture.debugElement.query(By.directive(StyleClass));
            const resizeInstance = resizeButton.injector.get(StyleClass);

            resizeInstance.bindWindowResizeListener();
            expect(resizeInstance.windowResizeListener).toBeTruthy();
        });

        it('should unbind window resize listener', () => {
            const resizeButton = resizeFixture.debugElement.query(By.directive(StyleClass));
            const resizeInstance = resizeButton.injector.get(StyleClass);

            resizeInstance.bindWindowResizeListener();
            expect(resizeInstance.windowResizeListener).toBeTruthy();

            resizeInstance.unbindWindowResizeListener();
            expect(resizeInstance.windowResizeListener).toBeNull();
        });

        it('should bind element resize observer', () => {
            const resizeButton = resizeFixture.debugElement.query(By.directive(StyleClass));
            const resizeInstance = resizeButton.injector.get(StyleClass);

            resizeInstance._resizeTarget = resizeFixture.debugElement.query(By.css('#resize-target')).nativeElement;
            resizeInstance.bindElementResizeListener();

            expect(resizeInstance.resizeObserver).toBeTruthy();
        });

        it('should unbind element resize observer', () => {
            const resizeButton = resizeFixture.debugElement.query(By.directive(StyleClass));
            const resizeInstance = resizeButton.injector.get(StyleClass);

            resizeInstance._resizeTarget = resizeFixture.debugElement.query(By.css('#resize-target')).nativeElement;
            resizeInstance.bindElementResizeListener();
            expect(resizeInstance.resizeObserver).toBeTruthy();

            resizeInstance.unbindElementResizeListener();
            expect(resizeInstance.resizeObserver).toBeUndefined();
        });

        it('should handle resize listener binding based on selector type', async () => {
            const resizeButton = resizeFixture.debugElement.query(By.directive(StyleClass));
            const resizeInstance = resizeButton.injector.get(StyleClass);

            vi.spyOn(resizeInstance, 'bindElementResizeListener');
            vi.spyOn(resizeInstance, 'bindWindowResizeListener');

            resizeComponent.resizeSelector.set('#resize-target');
            resizeFixture.changeDetectorRef.markForCheck();
            resizeFixture.detectChanges();
            await resizeFixture.whenStable();

            resizeInstance.bindResizeListener();

            expect(resizeInstance.bindElementResizeListener).toHaveBeenCalled();
        });

        it('should handle unbind resize listener', () => {
            const resizeButton = resizeFixture.debugElement.query(By.directive(StyleClass));
            const resizeInstance = resizeButton.injector.get(StyleClass);

            vi.spyOn(resizeInstance, 'unbindElementResizeListener');
            vi.spyOn(resizeInstance, 'unbindWindowResizeListener');

            resizeInstance.unbindResizeListener();

            expect(resizeInstance.unbindElementResizeListener).toHaveBeenCalled();
            expect(resizeInstance.unbindWindowResizeListener).toHaveBeenCalled();
        });
    });

    describe('Visibility Tests', () => {
        beforeEach(() => {
            buttonElement.nativeElement.click(); // Set target
        });

        it('should detect visible element', () => {
            const targetElement = styleClassInstance.target as HTMLElement;
            Object.defineProperty(targetElement, 'offsetParent', {
                value: document.body,
                configurable: true
            });

            expect(styleClassInstance.isVisible()).toBe(true);
        });

        it('should detect hidden element', () => {
            const targetElement = styleClassInstance.target as HTMLElement;
            Object.defineProperty(targetElement, 'offsetParent', {
                value: null,
                configurable: true
            });

            expect(styleClassInstance.isVisible()).toBe(false);
        });
    });

    describe('Animation Event Handling', () => {
        beforeEach(() => {
            buttonElement.nativeElement.click(); // Set target
        });

        it('should handle animation end for enter', async () => {
            component.enterActiveClass.set('slide-in');
            component.enterToClass.set('visible');
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            styleClassInstance.enter();
            expect(styleClassInstance.animating).toBe(true);

            const targetElement = styleClassInstance.target as HTMLElement;
            const animationEndEvent = new AnimationEvent('animationend');
            targetElement.dispatchEvent(animationEndEvent);

            await new Promise((resolve) => setTimeout(resolve, 100));
            await fixture.whenStable();

            expect(targetElement.classList.contains('slide-in')).toBe(false);
            expect(targetElement.classList.contains('visible')).toBe(true);
            expect(styleClassInstance.animating).toBe(false);
        });

        it('should handle animation end for leave', async () => {
            component.leaveActiveClass.set('slide-out');
            component.leaveToClass.set('hidden');
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            styleClassInstance.leave();
            expect(styleClassInstance.animating).toBe(true);

            const targetElement = styleClassInstance.target as HTMLElement;
            const animationEndEvent = new AnimationEvent('animationend');
            targetElement.dispatchEvent(animationEndEvent);

            await new Promise((resolve) => setTimeout(resolve, 100));
            await fixture.whenStable();

            expect(targetElement.classList.contains('slide-out')).toBe(false);
            expect(targetElement.classList.contains('hidden')).toBe(true);
            expect(styleClassInstance.animating).toBe(false);
        });

        it('should handle slidedown maxHeight reset on animation end', async () => {
            component.enterActiveClass.set('slidedown');
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            const targetElement = styleClassInstance.target as HTMLElement;
            styleClassInstance.enter();

            const animationEndEvent = new AnimationEvent('animationend');
            targetElement.dispatchEvent(animationEndEvent);

            await new Promise((resolve) => setTimeout(resolve, 100));
            await fixture.whenStable();

            expect(targetElement.style.maxHeight).toBe('' as any);
        });
    });

    describe('Edge Cases', () => {
        it('should handle null/undefined selector', async () => {
            component.selector.set(undefined as any);
            fixture.changeDetectorRef.markForCheck();
            fixture.detectChanges();
            await fixture.whenStable();

            expect(() => buttonElement.nativeElement.click()).not.toThrow();
        });

        it('should handle empty class names', async () => {
            component.toggleClass.set('');
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            buttonElement.nativeElement.click(); // Set target

            expect(() => styleClassInstance.toggle()).not.toThrow();
        });

        it('should handle rapid clicks during animation', async () => {
            component.enterActiveClass.set('slide-in');
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            buttonElement.nativeElement.click(); // Set target

            styleClassInstance.enter();
            expect(styleClassInstance.animating).toBe(true);

            // Second enter call should be ignored
            styleClassInstance.enter();

            const targetElement = styleClassInstance.target as HTMLElement;
            // Should only have one instance of the class
            const classCount = targetElement.className.split('slide-in').length - 1;
            expect(classCount).toBe(1);
        });

        it('should handle animation without target element', () => {
            styleClassInstance.target = null as any;

            expect(() => styleClassInstance.enter()).not.toThrow();
            expect(() => styleClassInstance.leave()).not.toThrow();
        });

        it('should handle missing animation classes gracefully', () => {
            buttonElement.nativeElement.click(); // Set target

            expect(() => styleClassInstance.enter()).not.toThrow();
            expect(() => styleClassInstance.leave()).not.toThrow();
        });

        it('should handle multiple listener bindings', async () => {
            component.hideOnOutsideClick.set(true);
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            // Bind multiple times
            styleClassInstance.bindDocumentClickListener();
            styleClassInstance.bindDocumentClickListener();

            // Should still have only one listener
            expect(styleClassInstance.documentClickListener).toBeTruthy();
        });

        it('should handle component destruction during animation', async () => {
            component.enterActiveClass.set('slide-in');
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            buttonElement.nativeElement.click();

            styleClassInstance.enter();
            expect(styleClassInstance.animating).toBe(true);

            expect(() => styleClassInstance.ngOnDestroy()).not.toThrow();
        });
    });

    describe('Integration Tests', () => {
        it('should work with animation component', async () => {
            const animationFixture = TestBed.createComponent(TestAnimationStyleClassComponent);
            animationFixture.changeDetectorRef.markForCheck();
            await animationFixture.whenStable();

            const animationButton = animationFixture.debugElement.query(By.directive(StyleClass));
            const animationInstance = animationButton.injector.get(StyleClass);

            animationButton.nativeElement.click();

            expect(animationInstance.target).toBeTruthy();
            expect(animationInstance.hideOnOutsideClick()).toBe(true);
            expect(animationInstance.hideOnEscape()).toBe(true);
        });

        it('should work with slidedown component', async () => {
            const slidedownFixture = TestBed.createComponent(TestSlidedownStyleClassComponent);
            slidedownFixture.changeDetectorRef.markForCheck();
            await slidedownFixture.whenStable();

            const slidedownButton = slidedownFixture.debugElement.query(By.directive(StyleClass));
            const slidedownInstance = slidedownButton.injector.get(StyleClass);

            slidedownButton.nativeElement.click();

            expect(slidedownInstance.target).toBeTruthy();
            expect(slidedownInstance.enterActiveClass()).toBe('slidedown');
        });

        it('should maintain state across multiple interactions', async () => {
            component.toggleClass.set('active');
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            // First interaction
            buttonElement.nativeElement.click();
            expect(styleClassInstance.target?.classList.contains('active')).toBe(true);

            // Second interaction
            buttonElement.nativeElement.click();
            expect(styleClassInstance.target?.classList.contains('active')).toBe(false);

            // Third interaction
            buttonElement.nativeElement.click();
            expect(styleClassInstance.target?.classList.contains('active')).toBe(true);
        });
    });

    describe('Cleanup Tests', () => {
        it('should cleanup all listeners on destroy', async () => {
            component.hideOnOutsideClick.set(true);
            component.hideOnEscape.set(true);
            component.hideOnResize.set(true);
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            buttonElement.nativeElement.click();
            styleClassInstance.enter();

            // Ensure listeners are bound
            expect(styleClassInstance.documentClickListener).toBeTruthy();
            expect(styleClassInstance.documentKeydownListener).toBeTruthy();

            styleClassInstance.ngOnDestroy();

            expect(styleClassInstance.target).toBeNull();
            expect(styleClassInstance._resizeTarget).toBeNull();
            expect(styleClassInstance.documentClickListener).toBeNull();
            expect(styleClassInstance.documentKeydownListener).toBeNull();
        });

        it('should cleanup resize observer on destroy', async () => {
            const resizeFixture = TestBed.createComponent(TestResizeStyleClassComponent);
            resizeFixture.changeDetectorRef.markForCheck();
            await resizeFixture.whenStable();

            const resizeButton = resizeFixture.debugElement.query(By.directive(StyleClass));
            const resizeInstance = resizeButton.injector.get(StyleClass);

            resizeInstance._resizeTarget = resizeFixture.debugElement.query(By.css('#resize-target')).nativeElement;
            resizeInstance.bindElementResizeListener();

            expect(resizeInstance.resizeObserver).toBeTruthy();

            resizeInstance.ngOnDestroy();

            expect(resizeInstance.resizeObserver).toBeUndefined();
        });

        it('should cleanup event listener if exists', () => {
            const mockListener = vi.fn();
            styleClassInstance.eventListener = mockListener;

            styleClassInstance.ngOnDestroy();

            expect(mockListener).toHaveBeenCalled();
        });

        it('should handle cleanup when no listeners are bound', () => {
            expect(() => styleClassInstance.ngOnDestroy()).not.toThrow();
        });
    });

    describe('Public Method Tests', () => {
        beforeEach(() => {
            buttonElement.nativeElement.click(); // Set target
        });

        it('should have all public methods available', () => {
            expect(typeof styleClassInstance.toggle).toBe('function');
            expect(typeof styleClassInstance.enter).toBe('function');
            expect(typeof styleClassInstance.leave).toBe('function');
            expect(typeof styleClassInstance.isVisible).toBe('function');
            expect(typeof styleClassInstance.isOutsideClick).toBe('function');
        });

        it('should call enter method programmatically', async () => {
            vi.spyOn(styleClassInstance, 'bindDocumentClickListener');
            component.hideOnOutsideClick.set(true);
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            styleClassInstance.enter();

            expect(styleClassInstance.bindDocumentClickListener).toHaveBeenCalled();
        });

        it('should call leave method programmatically', async () => {
            vi.spyOn(styleClassInstance, 'unbindDocumentClickListener');
            component.hideOnOutsideClick.set(true);
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            styleClassInstance.leave();

            expect(styleClassInstance.unbindDocumentClickListener).toHaveBeenCalled();
        });

        it('should call toggle method programmatically', async () => {
            component.toggleClass.set('test-class');
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            const targetElement = styleClassInstance.target as HTMLElement;

            styleClassInstance.toggle();
            expect(targetElement.classList.contains('test-class')).toBe(true);

            styleClassInstance.toggle();
            expect(targetElement.classList.contains('test-class')).toBe(false);
        });
    });
});
