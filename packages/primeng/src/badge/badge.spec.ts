import { Component, input, signal, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SharedModule } from 'primeng/api';
import { Badge, BadgeModule } from './badge';

@Component({
    standalone: true,
    imports: [BadgeModule],
    selector: 'test-basic-badge',
    template: `<p-badge></p-badge>`
})
class TestBasicBadgeComponent {}

@Component({
    standalone: true,
    imports: [BadgeModule],
    selector: 'test-value-badge',
    template: `<p-badge [value]="value()"></p-badge>`
})
class TestValueBadgeComponent {
    value = signal<string | number | null>('2');
}

@Component({
    standalone: true,
    imports: [BadgeModule],
    selector: 'test-size-badge',
    template: `<p-badge [badgeSize]="badgeSize()" value="1"></p-badge>`
})
class TestSizeBadgeComponent {
    badgeSize = signal<'small' | 'large' | 'xlarge' | null>(null as any);
}

@Component({
    standalone: true,
    imports: [BadgeModule],
    selector: 'test-severity-badge',
    template: `<p-badge [severity]="severity()" value="1"></p-badge>`
})
class TestSeverityBadgeComponent {
    severity = signal<'secondary' | 'info' | 'success' | 'warn' | 'danger' | 'contrast' | null>(null as any);
}

@Component({
    standalone: true,
    imports: [BadgeModule],
    selector: 'test-disabled-badge',
    template: `<p-badge [badgeDisabled]="disabled()" value="1"></p-badge>`
})
class TestDisabledBadgeComponent {
    disabled = signal(false);
}

@Component({
    standalone: true,
    imports: [BadgeModule],
    selector: 'test-dynamic-badge',
    template: ` <p-badge [value]="value()" [badgeSize]="badgeSize()" [severity]="severity()" [badgeDisabled]="disabled()"> </p-badge> `
})
class TestDynamicBadgeComponent {
    value = signal<string | number | null>('1');
    badgeSize = signal<'small' | 'large' | 'xlarge' | null>(null as any);
    severity = signal<'secondary' | 'info' | 'success' | 'warn' | 'danger' | 'contrast' | null>(null as any);
    disabled = signal(false);
}

describe('Badge', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [BadgeModule, SharedModule, TestBasicBadgeComponent, TestValueBadgeComponent, TestSizeBadgeComponent, TestSeverityBadgeComponent, TestDisabledBadgeComponent, TestDynamicBadgeComponent],
            providers: [provideZonelessChangeDetection()]
        });
    });

    describe('Badge Component', () => {
        describe('Component Initialization', () => {
            let fixture: ComponentFixture<TestBasicBadgeComponent>;
            let component: Badge;
            let element: HTMLElement;

            beforeEach(async () => {
                fixture = TestBed.createComponent(TestBasicBadgeComponent);
                await fixture.whenStable();

                const badgeDebugElement = fixture.debugElement.query(By.directive(Badge));
                component = badgeDebugElement.componentInstance;
                element = badgeDebugElement.nativeElement;
            });

            it('should create the component', () => {
                expect(component).toBeTruthy();
            });

            it('should have default values', () => {
                expect(component.value()).toBeUndefined();
                expect(component.badgeSize()).toBeUndefined();
                expect(component.badgeSize()).toBeUndefined();
                expect(component.severity()).toBeUndefined();
                expect(component.badgeDisabled()).toBe(false);
            });

            it('should apply base CSS classes', () => {
                expect(element.classList.contains('p-badge')).toBe(true);
                expect(element.classList.contains('p-component')).toBe(true);
            });

            it('should display empty value by default', () => {
                expect(element.textContent?.trim()).toBe('' as any);
            });

            it('should apply dot class when value is empty', () => {
                expect(element.classList.contains('p-badge-dot')).toBe(true);
            });
        });

        describe('Value Display', () => {
            let fixture: ComponentFixture<TestValueBadgeComponent>;
            let component: TestValueBadgeComponent;
            let element: HTMLElement;

            beforeEach(async () => {
                fixture = TestBed.createComponent(TestValueBadgeComponent);
                component = fixture.componentInstance;
                await fixture.whenStable();

                element = fixture.debugElement.query(By.directive(Badge)).nativeElement;
            });

            it('should display string value', () => {
                expect(element.textContent?.trim()).toBe('2');
            });

            it('should display numeric value', async () => {
                component.value.set(10);
                await fixture.whenStable();

                expect(element.textContent?.trim()).toBe('10');
            });

            it('should apply circle class for single character', async () => {
                component.value.set('1');
                await fixture.whenStable();

                expect(element.classList.contains('p-badge-circle')).toBe(true);
                expect(element.classList.contains('p-badge-dot')).toBe(false);
            });

            it('should not apply circle class for multiple characters', async () => {
                component.value.set('10');
                await fixture.whenStable();

                expect(element.classList.contains('p-badge-circle')).toBe(false);
                expect(element.classList.contains('p-badge-dot')).toBe(false);
            });

            it('should apply dot class when value is null', async () => {
                component.value.set(null as any);
                await fixture.whenStable();

                expect(element.classList.contains('p-badge-dot')).toBe(true);
                expect(element.classList.contains('p-badge-circle')).toBe(false);
                expect(element.textContent?.trim()).toBe('' as any);
            });

            it('should handle zero value', async () => {
                component.value.set(0);
                await fixture.whenStable();

                expect(element.textContent?.trim()).toBe('0');
                expect(element.classList.contains('p-badge-circle')).toBe(true);
            });

            it('should handle empty string', async () => {
                component.value.set('');
                await fixture.whenStable();

                expect(element.textContent?.trim()).toBe('' as any);
                expect(element.classList.contains('p-badge-dot')).toBe(true);
            });
        });

        describe('Size Variants', () => {
            let fixture: ComponentFixture<TestSizeBadgeComponent>;
            let component: TestSizeBadgeComponent;
            let element: HTMLElement;

            beforeEach(async () => {
                fixture = TestBed.createComponent(TestSizeBadgeComponent);
                component = fixture.componentInstance;
                await fixture.whenStable();

                element = fixture.debugElement.query(By.directive(Badge)).nativeElement;
            });

            it('should apply small size class', async () => {
                component.badgeSize.set('small');
                await fixture.whenStable();

                expect(element.classList.contains('p-badge-sm')).toBe(true);
            });

            it('should apply large size class', async () => {
                component.badgeSize.set('large');
                await fixture.whenStable();

                expect(element.classList.contains('p-badge-lg')).toBe(true);
            });

            it('should apply xlarge size class', async () => {
                component.badgeSize.set('xlarge');
                await fixture.whenStable();

                expect(element.classList.contains('p-badge-xl')).toBe(true);
            });

            it('should change size dynamically', async () => {
                component.badgeSize.set('large');
                await fixture.whenStable();
                expect(element.classList.contains('p-badge-lg')).toBe(true);

                component.badgeSize.set('small');
                await fixture.whenStable();
                expect(element.classList.contains('p-badge-lg')).toBe(false);
                expect(element.classList.contains('p-badge-sm')).toBe(true);
            });
        });

        describe('Severity Variants', () => {
            let fixture: ComponentFixture<TestSeverityBadgeComponent>;
            let component: TestSeverityBadgeComponent;
            let element: HTMLElement;

            beforeEach(async () => {
                fixture = TestBed.createComponent(TestSeverityBadgeComponent);
                component = fixture.componentInstance;
                await fixture.whenStable();

                element = fixture.debugElement.query(By.directive(Badge)).nativeElement;
            });

            it('should apply info severity class', async () => {
                component.severity.set('info');
                await fixture.whenStable();

                expect(element.classList.contains('p-badge-info')).toBe(true);
            });

            it('should apply success severity class', async () => {
                component.severity.set('success');
                await fixture.whenStable();

                expect(element.classList.contains('p-badge-success')).toBe(true);
            });

            it('should apply warn severity class', async () => {
                component.severity.set('warn');
                await fixture.whenStable();

                expect(element.classList.contains('p-badge-warn')).toBe(true);
            });

            it('should apply danger severity class', async () => {
                component.severity.set('danger');
                await fixture.whenStable();

                expect(element.classList.contains('p-badge-danger')).toBe(true);
            });

            it('should apply secondary severity class', async () => {
                component.severity.set('secondary');
                await fixture.whenStable();

                expect(element.classList.contains('p-badge-secondary')).toBe(true);
            });

            it('should apply contrast severity class', async () => {
                component.severity.set('contrast');
                await fixture.whenStable();

                expect(element.classList.contains('p-badge-contrast')).toBe(true);
            });

            it('should change severity dynamically', async () => {
                component.severity.set('info');
                await fixture.whenStable();
                expect(element.classList.contains('p-badge-info')).toBe(true);

                component.severity.set('danger');
                await fixture.whenStable();
                expect(element.classList.contains('p-badge-info')).toBe(false);
                expect(element.classList.contains('p-badge-danger')).toBe(true);
            });
        });

        describe('Disabled State', () => {
            let fixture: ComponentFixture<TestDisabledBadgeComponent>;
            let component: TestDisabledBadgeComponent;
            let element: HTMLElement;

            beforeEach(async () => {
                fixture = TestBed.createComponent(TestDisabledBadgeComponent);
                component = fixture.componentInstance;
                await fixture.whenStable();

                element = fixture.debugElement.query(By.directive(Badge)).nativeElement;
            });

            it('should be visible when not disabled', () => {
                expect(element.style.display).toBe('' as any);
            });

            it('should be hidden when disabled', async () => {
                component.disabled.set(true);
                await fixture.whenStable();

                expect(element.style.display).toBe('none');
            });

            it('should toggle visibility dynamically', async () => {
                component.disabled.set(true);
                await fixture.whenStable();
                expect(element.style.display).toBe('none');

                component.disabled.set(false);
                await fixture.whenStable();
                expect(element.style.display).toBe('' as any);
            });
        });
    });

    describe('Dynamic Configuration', () => {
        let fixture: ComponentFixture<TestDynamicBadgeComponent>;
        let component: TestDynamicBadgeComponent;
        let element: HTMLElement;

        beforeEach(async () => {
            fixture = TestBed.createComponent(TestDynamicBadgeComponent);
            component = fixture.componentInstance;
            await fixture.whenStable();

            element = fixture.debugElement.query(By.directive(Badge)).nativeElement;
        });

        it('should handle combined property changes', async () => {
            component.value.set('99');
            component.badgeSize.set('large');
            component.severity.set('danger');
            await fixture.whenStable();

            expect(element.textContent?.trim()).toBe('99');
            expect(element.classList.contains('p-badge-lg')).toBe(true);
            expect(element.classList.contains('p-badge-danger')).toBe(true);
        });

        it('should handle transitions between different states', async () => {
            // Start with single character (circle)
            component.value.set('1');
            await fixture.whenStable();
            expect(element.classList.contains('p-badge-circle')).toBe(true);

            // Change to multiple characters (no circle)
            component.value.set('99');
            await fixture.whenStable();
            expect(element.classList.contains('p-badge-circle')).toBe(false);

            // Change to null (dot)
            component.value.set(null as any);
            await fixture.whenStable();
            expect(element.classList.contains('p-badge-dot')).toBe(true);
            expect(element.classList.contains('p-badge-circle')).toBe(false);
        });

        it('should handle severity transitions', async () => {
            component.severity.set('info');
            await fixture.whenStable();
            expect(element.classList.contains('p-badge-info')).toBe(true);

            component.severity.set('success');
            await fixture.whenStable();
            expect(element.classList.contains('p-badge-info')).toBe(false);
            expect(element.classList.contains('p-badge-success')).toBe(true);

            component.severity.set(null as any);
            await fixture.whenStable();
            expect(element.classList.contains('p-badge-success')).toBe(false);
        });

        it('should handle size transitions', async () => {
            component.badgeSize.set('large');
            await fixture.whenStable();
            expect(element.classList.contains('p-badge-lg')).toBe(true);

            component.badgeSize.set('xlarge');
            await fixture.whenStable();
            expect(element.classList.contains('p-badge-lg')).toBe(false);
            expect(element.classList.contains('p-badge-xl')).toBe(true);

            component.badgeSize.set(null as any);
            await fixture.whenStable();
            expect(element.classList.contains('p-badge-xl')).toBe(false);
            expect(element.classList.contains('p-badge-lg')).toBe(false);
        });
    });

    describe('Edge Cases', () => {
        it('should handle numeric zero value correctly', async () => {
            const fixture = TestBed.createComponent(TestValueBadgeComponent);
            const component = fixture.componentInstance;
            component.value.set(0);
            await fixture.whenStable();

            const element = fixture.debugElement.query(By.directive(Badge)).nativeElement;
            expect(element.textContent?.trim()).toBe('0');
            expect(element.classList.contains('p-badge-circle')).toBe(true);
            expect(element.classList.contains('p-badge-dot')).toBe(false);
        });

        it('should handle negative numbers', async () => {
            const fixture = TestBed.createComponent(TestValueBadgeComponent);
            const component = fixture.componentInstance;
            component.value.set(-5);
            await fixture.whenStable();

            const element = fixture.debugElement.query(By.directive(Badge)).nativeElement;
            expect(element.textContent?.trim()).toBe('-5');
            expect(element.classList.contains('p-badge-circle')).toBe(false);
        });

        it('should handle special characters in value', async () => {
            const fixture = TestBed.createComponent(TestValueBadgeComponent);
            const component = fixture.componentInstance;
            component.value.set('!');
            await fixture.whenStable();

            const element = fixture.debugElement.query(By.directive(Badge)).nativeElement;
            expect(element.textContent?.trim()).toBe('!');
            expect(element.classList.contains('p-badge-circle')).toBe(true);
        });

        it('should handle very long values', async () => {
            const fixture = TestBed.createComponent(TestValueBadgeComponent);
            const component = fixture.componentInstance;
            component.value.set('999999999');
            await fixture.whenStable();

            const element = fixture.debugElement.query(By.directive(Badge)).nativeElement;
            expect(element.textContent?.trim()).toBe('999999999');
            expect(element.classList.contains('p-badge-circle')).toBe(false);
            expect(element.classList.contains('p-badge-dot')).toBe(false);
        });

        it('should handle whitespace in value', async () => {
            const fixture = TestBed.createComponent(TestValueBadgeComponent);
            const component = fixture.componentInstance;
            component.value.set('  ');
            await fixture.whenStable();

            const element = fixture.debugElement.query(By.directive(Badge)).nativeElement;
            expect(element.textContent?.trim()).toBe('' as any);
            // Whitespace strings are treated as valid content, not empty
            expect(element.classList.contains('p-badge-dot')).toBe(false);
        });
    });

    describe('CSS Class Combinations', () => {
        let fixture: ComponentFixture<TestDynamicBadgeComponent>;
        let component: TestDynamicBadgeComponent;
        let element: HTMLElement;

        beforeEach(async () => {
            fixture = TestBed.createComponent(TestDynamicBadgeComponent);
            component = fixture.componentInstance;
            await fixture.whenStable();

            element = fixture.debugElement.query(By.directive(Badge)).nativeElement;
        });

        it('should maintain base classes with all variants', async () => {
            component.value.set('1');
            component.badgeSize.set('large');
            component.severity.set('danger');
            await fixture.whenStable();

            // Base classes
            expect(element.classList.contains('p-badge')).toBe(true);
            expect(element.classList.contains('p-component')).toBe(true);

            // State classes
            expect(element.classList.contains('p-badge-circle')).toBe(true);
            expect(element.classList.contains('p-badge-lg')).toBe(true);
            expect(element.classList.contains('p-badge-danger')).toBe(true);
        });

        it('should handle conflicting size classes correctly', async () => {
            component.badgeSize.set('small');
            await fixture.whenStable();
            expect(element.classList.contains('p-badge-sm')).toBe(true);

            component.badgeSize.set('large');
            await fixture.whenStable();
            expect(element.classList.contains('p-badge-sm')).toBe(false);
            expect(element.classList.contains('p-badge-lg')).toBe(true);

            component.badgeSize.set('xlarge');
            await fixture.whenStable();
            expect(element.classList.contains('p-badge-lg')).toBe(false);
            expect(element.classList.contains('p-badge-xl')).toBe(true);
        });

        it('should handle conflicting severity classes correctly', async () => {
            component.severity.set('info');
            await fixture.whenStable();
            expect(element.classList.contains('p-badge-info')).toBe(true);

            component.severity.set('success');
            await fixture.whenStable();
            expect(element.classList.contains('p-badge-info')).toBe(false);
            expect(element.classList.contains('p-badge-success')).toBe(true);

            component.severity.set('warn');
            await fixture.whenStable();
            expect(element.classList.contains('p-badge-success')).toBe(false);
            expect(element.classList.contains('p-badge-warn')).toBe(true);
        });
    });

    describe('PassThrough API', () => {
        @Component({
            standalone: true,
            imports: [Badge],
            template: `<p-badge [value]="value()" [badgeSize]="badgeSize()" [severity]="severity()" [pt]="pt()"></p-badge>`
        })
        class TestPTBadgeComponent {
            value = input<string | number | null>();
            badgeSize = input<'small' | 'large' | 'xlarge' | null>();
            severity = input<'secondary' | 'info' | 'success' | 'warn' | 'danger' | 'contrast' | null>();
            pt = input<any>();
        }

        describe('Case 1: Simple string classes', () => {
            let fixture: ComponentFixture<TestPTBadgeComponent>;
            let element: HTMLElement;

            beforeEach(async () => {
                fixture = TestBed.createComponent(TestPTBadgeComponent);
                await fixture.whenStable();
                element = fixture.debugElement.query(By.directive(Badge)).nativeElement;
            });

            it('should apply string class to host section', async () => {
                fixture.componentRef.setInput('pt', { host: 'HOST_CLASS' });
                await fixture.whenStable();

                expect(element.classList.contains('HOST_CLASS')).toBe(true);
            });

            it('should apply string class to root section', async () => {
                fixture.componentRef.setInput('pt', { root: 'ROOT_CLASS' });
                await fixture.whenStable();

                expect(element.classList.contains('ROOT_CLASS')).toBe(true);
            });
        });

        describe('Case 2: Objects', () => {
            let fixture: ComponentFixture<TestPTBadgeComponent>;
            let element: HTMLElement;

            beforeEach(async () => {
                fixture = TestBed.createComponent(TestPTBadgeComponent);
                await fixture.whenStable();
                element = fixture.debugElement.query(By.directive(Badge)).nativeElement;
            });

            it('should apply object with class, style, data and aria attributes to root', async () => {
                fixture.componentRef.setInput('pt', {
                    root: {
                        class: 'ROOT_OBJECT_CLASS',
                        style: { 'background-color': 'red' },
                        'data-p-test': true,
                        'aria-label': 'TEST_ARIA_LABEL'
                    }
                });
                await fixture.whenStable();

                expect(element.classList.contains('ROOT_OBJECT_CLASS')).toBe(true);
                expect(element.style.backgroundColor).toBe('red');
                expect(element.getAttribute('data-p-test')).toBe('true');
                expect(element.getAttribute('aria-label')).toBe('TEST_ARIA_LABEL');
            });

            it('should apply object with class, style, data and aria attributes to host', async () => {
                fixture.componentRef.setInput('pt', {
                    host: {
                        class: 'HOST_OBJECT_CLASS',
                        style: { color: 'blue' },
                        'data-p-host': 'test',
                        'aria-hidden': 'true'
                    }
                });
                await fixture.whenStable();

                expect(element.classList.contains('HOST_OBJECT_CLASS')).toBe(true);
                expect(element.style.color).toBe('blue');
                expect(element.getAttribute('data-p-host')).toBe('test');
                expect(element.getAttribute('aria-hidden')).toBe('true');
            });
        });

        describe('Case 3: Mixed object and string values', () => {
            let fixture: ComponentFixture<TestPTBadgeComponent>;
            let element: HTMLElement;

            beforeEach(async () => {
                fixture = TestBed.createComponent(TestPTBadgeComponent);
                await fixture.whenStable();
                element = fixture.debugElement.query(By.directive(Badge)).nativeElement;
            });

            it('should apply mixed pt with object and string values', async () => {
                fixture.componentRef.setInput('pt', {
                    root: {
                        class: 'ROOT_MIXED_CLASS'
                    },
                    host: 'HOST_MIXED_CLASS'
                });
                await fixture.whenStable();

                expect(element.classList.contains('ROOT_MIXED_CLASS')).toBe(true);
                expect(element.classList.contains('HOST_MIXED_CLASS')).toBe(true);
            });
        });

        describe('Case 4: Use variables from instance', () => {
            let fixture: ComponentFixture<TestPTBadgeComponent>;
            let element: HTMLElement;

            beforeEach(async () => {
                fixture = TestBed.createComponent(TestPTBadgeComponent);
                await fixture.whenStable();
                element = fixture.debugElement.query(By.directive(Badge)).nativeElement;
            });

            it('should use instance value in pt function for root', async () => {
                fixture.componentRef.setInput('value', '5');
                await fixture.whenStable();

                fixture.componentRef.setInput('pt', {
                    root: ({ instance }: any) => {
                        return {
                            class: instance?.value() ? 'HAS_VALUE' : 'NO_VALUE'
                        };
                    }
                });
                await fixture.whenStable();

                expect(element.classList.contains('HAS_VALUE')).toBe(true);
            });

            it('should use instance severity in pt function for root', async () => {
                fixture.componentRef.setInput('severity', 'success');
                await fixture.whenStable();

                fixture.componentRef.setInput('pt', {
                    root: ({ instance }: any) => {
                        return {
                            style: {
                                'border-color': instance?.severity() === 'success' ? 'green' : 'red'
                            }
                        };
                    }
                });
                await fixture.whenStable();

                expect(element.style.borderColor).toBe('green');
            });

            it('should use instance badgeSize in pt function for host', async () => {
                fixture.componentRef.setInput('badgeSize', 'large');
                await fixture.whenStable();

                fixture.componentRef.setInput('pt', {
                    host: ({ instance }: any) => {
                        return {
                            'data-size': instance?.badgeSize() || 'normal'
                        };
                    }
                });
                await fixture.whenStable();

                expect(element.getAttribute('data-size')).toBe('large');
            });
        });

        describe('Case 5: Event binding', () => {
            let fixture: ComponentFixture<TestPTBadgeComponent>;
            let element: HTMLElement;

            beforeEach(async () => {
                fixture = TestBed.createComponent(TestPTBadgeComponent);
                await fixture.whenStable();
                element = fixture.debugElement.query(By.directive(Badge)).nativeElement;
            });

            it('should bind onclick event to root through pt', async () => {
                let clickCount = 0;
                fixture.componentRef.setInput('pt', {
                    root: {
                        onclick: () => {
                            clickCount++;
                        }
                    }
                });
                await fixture.whenStable();

                element.click();
                element.click();

                expect(clickCount).toBe(2);
            });

            it('should bind onclick event to host through pt', async () => {
                let clicked = false;
                fixture.componentRef.setInput('pt', {
                    host: {
                        onclick: () => {
                            clicked = true;
                        }
                    }
                });
                await fixture.whenStable();

                element.click();

                expect(clicked).toBe(true);
            });
        });

        describe('Case 7: Inline test', () => {
            it('should apply inline pt with string class', async () => {
                const inlineFixture = TestBed.createComponent(TestPTBadgeComponent);
                inlineFixture.componentRef.setInput('pt', { root: 'INLINE_TEST_CLASS' });
                await inlineFixture.whenStable();

                const element = inlineFixture.debugElement.query(By.directive(Badge)).nativeElement;
                expect(element.classList.contains('INLINE_TEST_CLASS')).toBe(true);
            });

            it('should apply inline pt with object class', async () => {
                const inlineFixture = TestBed.createComponent(TestPTBadgeComponent);
                inlineFixture.componentRef.setInput('pt', { root: { class: 'INLINE_OBJECT_CLASS' } });
                await inlineFixture.whenStable();

                const element = inlineFixture.debugElement.query(By.directive(Badge)).nativeElement;
                expect(element.classList.contains('INLINE_OBJECT_CLASS')).toBe(true);
            });
        });

        describe('Case 8: Test hooks', () => {
            let fixture: ComponentFixture<TestPTBadgeComponent>;

            beforeEach(() => {
                fixture = TestBed.createComponent(TestPTBadgeComponent);
            });

            it('should call onAfterViewInit hook', async () => {
                let hookCalled = false;
                fixture.componentRef.setInput('pt', {
                    hooks: {
                        onAfterViewInit: () => {
                            hookCalled = true;
                        }
                    }
                });
                await fixture.whenStable();

                expect(hookCalled).toBe(true);
            });

            it('should call onAfterContentInit hook', async () => {
                let hookCalled = false;
                fixture.componentRef.setInput('pt', {
                    hooks: {
                        onAfterContentInit: () => {
                            hookCalled = true;
                        }
                    }
                });
                await fixture.whenStable();

                expect(hookCalled).toBe(true);
            });

            it('should call onAfterViewChecked hook', async () => {
                let checkCount = 0;
                fixture.componentRef.setInput('pt', {
                    hooks: {
                        onAfterViewChecked: () => {
                            checkCount++;
                        }
                    }
                });
                await fixture.whenStable();

                expect(checkCount).toBeGreaterThan(0);
            });

            it('should call onDestroy hook', async () => {
                let hookCalled = false;
                fixture.componentRef.setInput('pt', {
                    hooks: {
                        onDestroy: () => {
                            hookCalled = true;
                        }
                    }
                });
                await fixture.whenStable();
                fixture.destroy();

                expect(hookCalled).toBe(true);
            });
        });
    });
});
