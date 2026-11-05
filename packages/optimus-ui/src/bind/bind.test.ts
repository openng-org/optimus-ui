import { afterEveryRender, ChangeDetectionStrategy, Component, provideZonelessChangeDetection, signal, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Bind } from './bind';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    selector: 'test-basic-bind',
    template: `<div [pBind]="attrs"></div>`
})
class TestBasicBindComponent {
    attrs: any = {};
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    selector: 'test-bind-attributes',
    template: `<div [pBind]="attrs"></div>`
})
class TestBindAttributesComponent {
    attrs = {
        id: 'test-id',
        'data-test': 'test-value',
        tabindex: 0
    };
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    selector: 'test-bind-classes',
    template: `<div [pBind]="attrs"></div>`
})
class TestBindClassesComponent {
    attrs = {
        class: 'test-class another-class'
    };
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    selector: 'test-bind-classes-array',
    template: `<div [pBind]="attrs"></div>`
})
class TestBindClassesArrayComponent {
    attrs = {
        class: ['test-class', 'another-class']
    };
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    selector: 'test-bind-classes-object',
    template: `<div [pBind]="attrs"></div>`
})
class TestBindClassesObjectComponent {
    attrs = {
        class: {
            'test-class': true,
            'another-class': false,
            'active-class': true
        }
    };
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    selector: 'test-bind-styles',
    template: `<div [pBind]="attrs"></div>`
})
class TestBindStylesComponent {
    attrs = {
        style: {
            color: 'red',
            fontSize: '16px'
        }
    };
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    selector: 'test-bind-listeners',
    template: `<div [pBind]="attrs"></div>`
})
class TestBindListenersComponent {
    clickHandler = vi.fn();
    hoverHandler = vi.fn();

    attrs = {
        onclick: this.clickHandler,
        onmouseover: this.hoverHandler
    };
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    selector: 'test-bind-mixed',
    template: `<div [pBind]="attrs" class="existing-class" style="margin: 10px;"></div>`
})
class TestBindMixedComponent {
    clickHandler = vi.fn();

    attrs = {
        id: 'mixed-id',
        class: 'bind-class',
        style: {
            color: 'blue',
            padding: '5px'
        },
        onclick: this.clickHandler
    };
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    selector: 'test-bind-dynamic',
    template: `<div [pBind]="attrs"></div>`
})
class TestBindDynamicComponent {
    attrs: any = {
        id: 'initial-id',
        class: 'initial-class'
    };

    updateAttrs() {
        this.attrs = {
            id: 'updated-id',
            class: 'updated-class',
            'data-updated': 'true'
        };
    }
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    selector: 'test-set-attrs',
    template: `<div [pBind]="undefined"></div>`
})
class TestSetAttrsComponent {}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    selector: 'test-set-attrs-after-render',
    template: `<div [pBind]="undefined"></div>`
})
class TestSetAttrsAfterRenderComponent {
    readonly bind = viewChild.required(Bind);

    clicks = 0;

    constructor() {
        // the PassThrough refresh of the Signals-migrated components: a function-form pt returns a new handler on every render
        afterEveryRender(() => this.bind().setAttrs({ id: 'after-render-id', onclick: () => this.clicks++ }));
    }
}

describe('Bind', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [Bind],
            declarations: [
                TestBasicBindComponent,
                TestBindAttributesComponent,
                TestBindClassesComponent,
                TestBindClassesArrayComponent,
                TestBindClassesObjectComponent,
                TestBindStylesComponent,
                TestBindListenersComponent,
                TestBindMixedComponent,
                TestBindDynamicComponent,
                TestSetAttrsComponent,
                TestSetAttrsAfterRenderComponent
            ],
            providers: [provideZonelessChangeDetection()]
        });
    });

    describe('Directive Initialization', () => {
        it('should create the directive', async () => {
            const fixture = TestBed.createComponent(TestBasicBindComponent);
            await fixture.whenStable();

            const directive = fixture.debugElement.query(By.directive(Bind)).injector.get(Bind);

            expect(directive).toBeTruthy();
        });
    });

    describe('Attribute Binding', () => {
        it('should bind attributes to host element', async () => {
            const fixture = TestBed.createComponent(TestBindAttributesComponent);
            await fixture.whenStable();

            const element = fixture.debugElement.query(By.directive(Bind)).nativeElement;

            expect(element.getAttribute('id')).toBe('test-id');
            expect(element.getAttribute('data-test')).toBe('test-value');
            expect(element.getAttribute('tabindex')).toBe('0');
        });

        it('should handle null and undefined attribute values', async () => {
            const fixture = TestBed.createComponent(TestBasicBindComponent);
            const component = fixture.componentInstance;

            component.attrs = {
                id: 'test-id',
                'data-test': null,
                'data-value': undefined
            };
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            const element = fixture.debugElement.query(By.directive(Bind)).nativeElement;

            expect(element.getAttribute('id')).toBe('test-id');
            expect(element.hasAttribute('data-test')).toBe(false);
            expect(element.hasAttribute('data-value')).toBe(false);
        });
    });

    describe('Class Binding', () => {
        it('should handle string classes', async () => {
            const fixture = TestBed.createComponent(TestBindClassesComponent);
            await fixture.whenStable();

            const element = fixture.debugElement.query(By.directive(Bind)).nativeElement;

            expect(element.className).toContain('test-class');
            expect(element.className).toContain('another-class');
        });

        it('should handle array classes', async () => {
            const fixture = TestBed.createComponent(TestBindClassesArrayComponent);
            await fixture.whenStable();

            const element = fixture.debugElement.query(By.directive(Bind)).nativeElement;

            expect(element.className).toContain('test-class');
            expect(element.className).toContain('another-class');
        });

        it('should handle object classes', async () => {
            const fixture = TestBed.createComponent(TestBindClassesObjectComponent);
            await fixture.whenStable();

            const element = fixture.debugElement.query(By.directive(Bind)).nativeElement;

            expect(element.className).toContain('test-class');
            expect(element.className).toContain('active-class');
            expect(element.className).not.toContain('another-class');
        });

        it('should merge with existing classes', async () => {
            const fixture = TestBed.createComponent(TestBindMixedComponent);
            await fixture.whenStable();

            const element = fixture.debugElement.query(By.directive(Bind)).nativeElement;

            expect(element.className).toContain('bind-class');
            expect(element.className).toContain('existing-class');
        });
    });

    describe('Style Binding', () => {
        it('should bind styles from attrs', async () => {
            const fixture = TestBed.createComponent(TestBindStylesComponent);
            await fixture.whenStable();

            const element = fixture.debugElement.query(By.directive(Bind)).nativeElement;

            expect(element.style.color).toBe('red');
            expect(element.style.fontSize).toBe('16px');
        });

        it('should merge with existing styles', async () => {
            const fixture = TestBed.createComponent(TestBindMixedComponent);
            await fixture.whenStable();

            const element = fixture.debugElement.query(By.directive(Bind)).nativeElement;

            expect(element.style.color).toBe('blue');
            expect(element.style.padding).toBe('5px');
            expect(element.style.margin).toBe('10px');
        });
    });

    describe('Event Listener Binding', () => {
        it('should bind event listeners', async () => {
            const fixture = TestBed.createComponent(TestBindListenersComponent);
            const component = fixture.componentInstance;
            await fixture.whenStable();

            const element = fixture.debugElement.query(By.directive(Bind)).nativeElement;

            element.dispatchEvent(new Event('click'));
            element.dispatchEvent(new Event('mouseover'));

            expect(component.clickHandler).toHaveBeenCalled();
            expect(component.hoverHandler).toHaveBeenCalled();
        });
        it('should cleanup old listeners when attrs change', async () => {
            const fixture = TestBed.createComponent(TestBindDynamicComponent);
            const component = fixture.componentInstance;

            const firstHandler = vi.fn();
            const secondHandler = vi.fn();

            component.attrs = { onclick: firstHandler };
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            const element = fixture.debugElement.query(By.directive(Bind)).nativeElement;

            // Test first handler
            element.dispatchEvent(new Event('click'));
            expect(firstHandler).toHaveBeenCalledTimes(1);

            // Update to second handler
            component.attrs = { onclick: secondHandler };
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            // Test that first handler is no longer called
            element.dispatchEvent(new Event('click'));
            expect(firstHandler).toHaveBeenCalledTimes(1); // Still 1, not called again
            expect(secondHandler).toHaveBeenCalledTimes(1);

            // Remove the handler
            component.attrs = {};
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            element.dispatchEvent(new Event('click'));
            expect(firstHandler).toHaveBeenCalledTimes(1);
            expect(secondHandler).toHaveBeenCalledTimes(1);
        });
    });

    describe('Mixed Content', () => {
        it('should handle mixed attributes, classes, styles, and listeners', async () => {
            const fixture = TestBed.createComponent(TestBindMixedComponent);
            const component = fixture.componentInstance;
            await fixture.whenStable();

            const element = fixture.debugElement.query(By.directive(Bind)).nativeElement;

            // Test attributes
            expect(element.getAttribute('id')).toBe('mixed-id');

            // Test classes
            expect(element.className).toContain('bind-class');
            expect(element.className).toContain('existing-class');

            // Test styles
            expect(element.style.color).toBe('blue');
            expect(element.style.padding).toBe('5px');

            // Test event listener
            element.dispatchEvent(new Event('click'));
            expect(component.clickHandler).toHaveBeenCalled();
        });
    });

    describe('Dynamic Updates', () => {
        it('should update attributes when attrs changes', async () => {
            const fixture = TestBed.createComponent(TestBindDynamicComponent);
            const component = fixture.componentInstance;
            await fixture.whenStable();

            const element = fixture.debugElement.query(By.directive(Bind)).nativeElement;

            // Initial state
            expect(element.getAttribute('id')).toBe('initial-id');
            expect(element.className).toContain('initial-class');

            // Update attrs
            component.updateAttrs();
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            // Updated state
            expect(element.getAttribute('id')).toBe('updated-id');
            expect(element.className).toContain('updated-class');
            expect(element.getAttribute('data-updated')).toBe('true');
        });

        it('should remove attributes when set to null or undefined', async () => {
            const fixture = TestBed.createComponent(TestBindDynamicComponent);
            const component = fixture.componentInstance;

            component.attrs = {
                id: 'test-id',
                'data-test': 'test-value'
            };
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            const element = fixture.debugElement.query(By.directive(Bind)).nativeElement;

            expect(element.getAttribute('data-test')).toBe('test-value');

            // Update with null to remove attribute
            component.attrs = {
                id: 'test-id',
                'data-test': null
            };
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(element.hasAttribute('data-test')).toBe(false);
            expect(element.getAttribute('id')).toBe('test-id');
        });
    });

    describe('setAttrs Method', () => {
        it('should update attrs via setAttrs method', async () => {
            const fixture = TestBed.createComponent(TestSetAttrsComponent);
            await fixture.whenStable();

            const directive = fixture.debugElement.query(By.directive(Bind)).injector.get(Bind);
            const element = fixture.debugElement.query(By.directive(Bind)).nativeElement;

            directive.setAttrs({
                id: 'set-id',
                class: 'set-class',
                'data-test': 'test-value'
            });
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(element.getAttribute('id')).toBe('set-id');
            expect(element.className).toContain('set-class');
            expect(element.getAttribute('data-test')).toBe('test-value');
        });

        it('should prioritize setAttrs over pBind input', async () => {
            const fixture = TestBed.createComponent(TestBasicBindComponent);
            const component = fixture.componentInstance;

            component.attrs = {
                id: 'input-id',
                class: 'input-class'
            };
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            const directive = fixture.debugElement.query(By.directive(Bind)).injector.get(Bind);
            const element = fixture.debugElement.query(By.directive(Bind)).nativeElement;

            directive.setAttrs({
                id: 'set-id',
                class: 'set-class'
            });
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(element.getAttribute('id')).toBe('set-id');
            expect(element.className).toContain('set-class');
        });

        it('should not loop when setAttrs is called after every render with a new handler', () => {
            const fixture = TestBed.createComponent(TestSetAttrsAfterRenderComponent);
            const component = fixture.componentInstance;

            // NG0103 (infinite change detection) if a new handler reference counts as a change
            fixture.detectChanges();

            const element = fixture.debugElement.query(By.directive(Bind)).nativeElement;

            expect(element.getAttribute('id')).toBe('after-render-id');

            element.dispatchEvent(new Event('click'));
            expect(component.clicks).toBe(1);
        });

        it('should call the latest handler when setAttrs is called twice before the effect runs', async () => {
            const fixture = TestBed.createComponent(TestSetAttrsComponent);
            await fixture.whenStable();

            const directive = fixture.debugElement.query(By.directive(Bind)).injector.get(Bind);
            const element = fixture.debugElement.query(By.directive(Bind)).nativeElement;
            const firstHandler = vi.fn();
            const secondHandler = vi.fn();

            directive.setAttrs({ onclick: firstHandler });
            directive.setAttrs({ onclick: secondHandler });
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            element.dispatchEvent(new Event('click'));
            expect(firstHandler).not.toHaveBeenCalled();
            expect(secondHandler).toHaveBeenCalledTimes(1);
        });

        it('should remove the listener of an event that leaves the attrs set through setAttrs', async () => {
            const fixture = TestBed.createComponent(TestSetAttrsComponent);
            await fixture.whenStable();

            const directive = fixture.debugElement.query(By.directive(Bind)).injector.get(Bind);
            const element = fixture.debugElement.query(By.directive(Bind)).nativeElement;
            const handler = vi.fn();

            directive.setAttrs({ onclick: handler });
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            element.dispatchEvent(new Event('click'));
            expect(handler).toHaveBeenCalledTimes(1);

            directive.setAttrs({});
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            element.dispatchEvent(new Event('click'));
            expect(handler).toHaveBeenCalledTimes(1);
        });

        it('should prevent the default action when a handler returns false', async () => {
            const fixture = TestBed.createComponent(TestSetAttrsComponent);
            await fixture.whenStable();

            const directive = fixture.debugElement.query(By.directive(Bind)).injector.get(Bind);
            const element = fixture.debugElement.query(By.directive(Bind)).nativeElement;

            directive.setAttrs({ onclick: () => false });
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            const event = new Event('click', { cancelable: true });
            element.dispatchEvent(event);
            expect(event.defaultPrevented).toBe(true);
        });
    });

    describe('Edge Cases', () => {
        it('should handle empty or undefined attrs', async () => {
            const fixture = TestBed.createComponent(TestBasicBindComponent);
            const component = fixture.componentInstance;

            component.attrs = undefined;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            const element = fixture.debugElement.query(By.directive(Bind)).nativeElement;

            expect(element).toBeTruthy();
        });

        it('should handle attrs without class property', async () => {
            const fixture = TestBed.createComponent(TestBasicBindComponent);
            const component = fixture.componentInstance;

            component.attrs = {
                id: 'test-id'
            };
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            const element = fixture.debugElement.query(By.directive(Bind)).nativeElement;

            expect(element.getAttribute('id')).toBe('test-id');
        });

        it('should handle attrs without style property', async () => {
            const fixture = TestBed.createComponent(TestBasicBindComponent);
            const component = fixture.componentInstance;

            component.attrs = {
                id: 'test-id'
            };
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            const element = fixture.debugElement.query(By.directive(Bind)).nativeElement;

            expect(element.getAttribute('id')).toBe('test-id');
        });
    });

    describe('Duplicate Prevention', () => {
        it('should not duplicate classes in DOM on multiple updates', async () => {
            const fixture = TestBed.createComponent(TestBindDynamicComponent);
            const component = fixture.componentInstance;
            await fixture.whenStable();

            const element = fixture.debugElement.query(By.directive(Bind)).nativeElement;

            // Update multiple times with same classes
            component.attrs = { class: 'test-class another-class' };
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            component.attrs = { class: 'test-class another-class' };
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            component.attrs = { class: 'test-class another-class' };
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            // Check that each class appears only once
            const classes = element.className.split(' ').filter((c: string) => c);
            const uniqueClasses = [...new Set(classes)];

            expect(classes.length).toBe(uniqueClasses.length);
            expect(classes.filter((c: string) => c === 'test-class').length).toBe(1);
            expect(classes.filter((c: string) => c === 'another-class').length).toBe(1);
        });

        it('should not accumulate event listeners on multiple updates', async () => {
            const fixture = TestBed.createComponent(TestBindDynamicComponent);
            const component = fixture.componentInstance;
            await fixture.whenStable();

            const element = fixture.debugElement.query(By.directive(Bind)).nativeElement;

            let clickCount = 0;
            const clickHandler = () => clickCount++;

            // Update multiple times with same event listener
            component.attrs = { onclick: clickHandler };
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            component.attrs = { onclick: clickHandler };
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            component.attrs = { onclick: clickHandler };
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            // Trigger click event
            element.dispatchEvent(new Event('click'));

            // Should be called only once, not multiple times
            expect(clickCount).toBe(1);
        });

        it('should handle rapid toggling without duplication', async () => {
            const fixture = TestBed.createComponent(TestBindDynamicComponent);
            const component = fixture.componentInstance;
            const isActive = signal(false);
            await fixture.whenStable();

            const element = fixture.debugElement.query(By.directive(Bind)).nativeElement;

            // Rapidly toggle 10 times
            for (let i = 0; i < 10; i++) {
                isActive.set(!isActive());
                component.attrs = {
                    class: isActive() ? 'active' : 'inactive'
                };
                fixture.changeDetectorRef.markForCheck();
                await fixture.whenStable();
            }

            const classes = element.className.split(' ').filter((c: string) => c);

            // Should have either active or inactive, not both
            const hasActive = classes.includes('active');
            const hasInactive = classes.includes('inactive');
            expect(hasActive !== hasInactive).toBe(true);
        });
    });
});
