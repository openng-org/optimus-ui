import { Component, ElementRef, TemplateRef, ViewChild, signal, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TooltipOptions } from 'primeng/api';
import { Tooltip } from './tooltip';

@Component({
    standalone: true,
    imports: [Tooltip],
    template: `
        <input
            #inputElement
            [pTooltip]="tooltipLabel()"
            [tooltipPosition]="tooltipPosition()"
            [tooltipEvent]="tooltipEvent()"
            [positionStyle]="positionStyle()"
            [tooltipStyleClass]="tooltipStyleClass()"
            [tooltipZIndex]="tooltipZIndex()"
            [escape]="escape()"
            [showDelay]="showDelay()"
            [hideDelay]="hideDelay()"
            [life]="life()"
            [positionTop]="positionTop()"
            [positionLeft]="positionLeft()"
            [autoHide]="autoHide()"
            [fitContent]="fitContent()"
            [hideOnEscape]="hideOnEscape()"
            [tooltipDisabled]="tooltipDisabled()"
            [tooltipOptions]="tooltipOptions()"
            type="text"
            placeholder="Hover me"
        />
    `
})
class TestBasicTooltipComponent {
    @ViewChild('inputElement', { read: ElementRef }) inputElement!: ElementRef;

    tooltipLabel = signal<string>('Default tooltip text');
    tooltipPosition = signal<'right' | 'left' | 'top' | 'bottom'>('right');
    tooltipEvent = signal<'hover' | 'focus' | 'both'>('hover');
    positionStyle = signal<string | undefined>(undefined);
    tooltipStyleClass = signal<string | undefined>(undefined);
    tooltipZIndex = signal<string | undefined>(undefined);
    escape = signal(true);
    showDelay = signal<number | undefined>(undefined);
    hideDelay = signal<number | undefined>(undefined);
    life = signal<number | undefined>(undefined);
    positionTop = signal<number | undefined>(undefined);
    positionLeft = signal<number | undefined>(undefined);
    autoHide = signal(true);
    fitContent = signal(true);
    hideOnEscape = signal(true);
    tooltipDisabled = signal(false);
    tooltipOptions = signal<TooltipOptions | undefined>(undefined);
}

@Component({
    standalone: true,
    imports: [Tooltip],
    template: `
        <input #templateElement [pTooltip]="tooltipTemplate" type="text" placeholder="Template tooltip" />
        <ng-template #tooltipTemplate>
            <div class="custom-tooltip">
                <strong>Custom Template</strong>
                <p>This is a custom tooltip template</p>
            </div>
        </ng-template>
    `
})
class TestTemplateTooltipComponent {
    @ViewChild('templateElement', { read: ElementRef }) templateElement!: ElementRef;
    @ViewChild('tooltipTemplate') tooltipTemplate!: TemplateRef<any>;
}

@Component({
    standalone: true,
    imports: [Tooltip],
    template: ` <button #buttonElement pTooltip="Button tooltip" [tooltipOptions]="options()" type="button">Click me</button> `
})
class TestTooltipOptionsComponent {
    @ViewChild('buttonElement', { read: ElementRef }) buttonElement!: ElementRef;

    options = signal<TooltipOptions>({
        tooltipLabel: 'Options tooltip',
        tooltipPosition: 'top',
        tooltipEvent: 'hover',
        showDelay: 100,
        hideDelay: 50,
        life: 2000,
        tooltipStyleClass: 'custom-options-tooltip'
    });
}

describe('Tooltip', () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Tooltip, TestBasicTooltipComponent, TestTemplateTooltipComponent, TestTooltipOptionsComponent],
            providers: [provideZonelessChangeDetection()]
        }).compileComponents();
    });

    describe('Directive Initialization', () => {
        let fixture: ComponentFixture<TestBasicTooltipComponent>;
        let component: TestBasicTooltipComponent;
        let tooltipDirective: Tooltip;
        let inputElement: HTMLElement;

        beforeEach(() => {
            fixture = TestBed.createComponent(TestBasicTooltipComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();

            const debugElement = fixture.debugElement.query(By.directive(Tooltip));
            tooltipDirective = debugElement.injector.get(Tooltip);
            inputElement = component.inputElement.nativeElement;
        });

        it('should create the directive', () => {
            expect(tooltipDirective).toBeTruthy();
        });

        it('should have default values', () => {
            expect(tooltipDirective.getOption('tooltipPosition')).toBe('right');
            expect(tooltipDirective.getOption('tooltipEvent')).toBe('hover');
            expect(tooltipDirective.escape()).toBe(true);
            expect(tooltipDirective.autoHide()).toBe(true);
            expect(tooltipDirective.fitContent()).toBe(true);
            expect(tooltipDirective.hideOnEscape()).toBe(true);
            expect(tooltipDirective.content()).toBe('Default tooltip text');
            expect(tooltipDirective.tooltipDisabled()).toBeFalsy();
        });

        it('should accept custom values', async () => {
            component.tooltipPosition.set('top');
            component.tooltipEvent.set('focus');
            component.escape.set(false);
            component.showDelay.set(500);
            component.hideDelay.set(300);
            component.life.set(2000);
            component.autoHide.set(false);
            component.tooltipStyleClass.set('custom-tooltip');
            await fixture.whenStable();

            expect(tooltipDirective.tooltipPosition()).toBe('top');
            expect(tooltipDirective.tooltipEvent()).toBe('focus');
            expect(tooltipDirective.escape()).toBe(false);
            expect(tooltipDirective.showDelay()).toBe(500);
            expect(tooltipDirective.hideDelay()).toBe(300);
            expect(tooltipDirective.life()).toBe(2000);
            expect(tooltipDirective.autoHide()).toBe(false);
            expect(tooltipDirective.tooltipStyleClass()).toBe('custom-tooltip');
        });

        it('should disable tooltip when disabled is true', async () => {
            component.tooltipDisabled.set(true);
            await fixture.whenStable();

            expect(tooltipDirective.tooltipDisabled()).toBe(true);
        });
    });

    describe('Tooltip Display and Hide Behavior', () => {
        let fixture: ComponentFixture<TestBasicTooltipComponent>;
        let component: TestBasicTooltipComponent;
        let tooltipDirective: Tooltip;

        beforeEach(() => {
            fixture = TestBed.createComponent(TestBasicTooltipComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();

            const debugElement = fixture.debugElement.query(By.directive(Tooltip));
            tooltipDirective = debugElement.injector.get(Tooltip);
        });

        it('should show tooltip on activation', () => {
            vi.spyOn(tooltipDirective, 'show');

            tooltipDirective.activate();

            expect(tooltipDirective.show).toHaveBeenCalled();
            expect(tooltipDirective.active).toBe(true);
        });

        it('should hide tooltip on deactivation', () => {
            vi.spyOn(tooltipDirective, 'hide');

            tooltipDirective.activate();
            tooltipDirective.deactivate();

            expect(tooltipDirective.hide).toHaveBeenCalled();
            expect(tooltipDirective.active).toBe(false);
        });

        it('should not show tooltip when disabled', async () => {
            component.tooltipDisabled.set(true);
            await fixture.whenStable();

            tooltipDirective.activate();
            await new Promise((resolve) => setTimeout(resolve, 100));
            await fixture.whenStable();

            expect(tooltipDirective.container).toBeFalsy();
        });

        it('should not show tooltip when content is empty', async () => {
            component.tooltipLabel.set('');
            await fixture.whenStable();

            tooltipDirective.activate();
            await new Promise((resolve) => setTimeout(resolve, 100));
            await fixture.whenStable();

            expect(tooltipDirective.container).toBeFalsy();
        });
    });

    describe('Event Handling', () => {
        let fixture: ComponentFixture<TestBasicTooltipComponent>;
        let component: TestBasicTooltipComponent;
        let tooltipDirective: Tooltip;
        let inputElement: HTMLElement;

        beforeEach(() => {
            fixture = TestBed.createComponent(TestBasicTooltipComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();

            const debugElement = fixture.debugElement.query(By.directive(Tooltip));
            tooltipDirective = debugElement.injector.get(Tooltip);
            inputElement = component.inputElement.nativeElement;
        });

        it('should activate on mouse enter for hover event', () => {
            vi.spyOn(tooltipDirective, 'activate');

            tooltipDirective.onMouseEnter(new MouseEvent('mouseenter'));

            expect(tooltipDirective.activate).toHaveBeenCalled();
        });

        it('should deactivate on mouse leave for hover event', () => {
            vi.spyOn(tooltipDirective, 'deactivate');

            tooltipDirective.onMouseLeave(new MouseEvent('mouseleave') as any);

            expect(tooltipDirective.deactivate).toHaveBeenCalled();
        });

        it('should activate on focus for focus event', () => {
            vi.spyOn(tooltipDirective, 'activate');

            tooltipDirective.onFocus(new FocusEvent('focus'));

            expect(tooltipDirective.activate).toHaveBeenCalled();
        });

        it('should deactivate on blur for focus event', () => {
            vi.spyOn(tooltipDirective, 'deactivate');

            tooltipDirective.onBlur(new FocusEvent('blur'));

            expect(tooltipDirective.deactivate).toHaveBeenCalled();
        });

        it('should deactivate on input click', () => {
            vi.spyOn(tooltipDirective, 'deactivate');

            tooltipDirective.onInputClick(new MouseEvent('click'));

            expect(tooltipDirective.deactivate).toHaveBeenCalled();
        });
    });

    describe('Positioning', () => {
        let fixture: ComponentFixture<TestBasicTooltipComponent>;
        let component: TestBasicTooltipComponent;
        let tooltipDirective: Tooltip;

        beforeEach(() => {
            fixture = TestBed.createComponent(TestBasicTooltipComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();

            const debugElement = fixture.debugElement.query(By.directive(Tooltip));
            tooltipDirective = debugElement.injector.get(Tooltip);
        });

        it('should get option values correctly', async () => {
            component.tooltipPosition.set('top');
            component.showDelay.set(500);
            await fixture.whenStable();

            expect(tooltipDirective.getOption('tooltipPosition')).toBe('top');
            expect(tooltipDirective.getOption('showDelay')).toBe(500);
        });

        it('should handle position changes', async () => {
            component.tooltipPosition.set('left');
            await fixture.whenStable();

            expect(tooltipDirective.tooltipPosition()).toBe('left');
        });

        it('should handle out of bounds check', () => {
            // Create a mock container for bounds testing
            const mockContainer = document.createElement('div');
            mockContainer.getBoundingClientRect = () =>
                ({
                    top: -100,
                    left: -100,
                    width: 200,
                    height: 50,
                    right: 100,
                    bottom: -50
                }) as any;

            tooltipDirective.container = mockContainer;

            expect(tooltipDirective.isOutOfBounds()).toBe(true);
        });
    });

    describe('Delay and Life Timeout', () => {
        let fixture: ComponentFixture<TestBasicTooltipComponent>;
        let component: TestBasicTooltipComponent;
        let tooltipDirective: Tooltip;

        beforeEach(() => {
            fixture = TestBed.createComponent(TestBasicTooltipComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();

            const debugElement = fixture.debugElement.query(By.directive(Tooltip));
            tooltipDirective = debugElement.injector.get(Tooltip);
        });

        it('should show tooltip after show delay', async () => {
            component.showDelay.set(500);
            await fixture.whenStable();

            vi.spyOn(tooltipDirective, 'show');

            tooltipDirective.activate();
            await new Promise((resolve) => setTimeout(resolve, 300));
            await fixture.whenStable();
            expect(tooltipDirective.show).not.toHaveBeenCalled();

            await new Promise((resolve) => setTimeout(resolve, 200));
            await fixture.whenStable();
            expect(tooltipDirective.show).toHaveBeenCalled();
        });

        it('should hide tooltip after hide delay', async () => {
            component.hideDelay.set(300);
            await fixture.whenStable();

            tooltipDirective.activate();

            vi.spyOn(tooltipDirective, 'hide');
            tooltipDirective.deactivate();

            await new Promise((resolve) => setTimeout(resolve, 200));
            await fixture.whenStable();
            expect(tooltipDirective.hide).not.toHaveBeenCalled();

            await new Promise((resolve) => setTimeout(resolve, 100));
            await fixture.whenStable();
            expect(tooltipDirective.hide).toHaveBeenCalled();
        });

        it('should clear timeouts correctly', () => {
            tooltipDirective.showTimeout = setTimeout(() => {}, 1000);
            tooltipDirective.hideTimeout = setTimeout(() => {}, 1000);

            tooltipDirective.clearTimeouts();

            expect(tooltipDirective.showTimeout).toBeNull();
            expect(tooltipDirective.hideTimeout).toBeNull();
        });
    });

    describe('Accessibility and Keyboard Navigation', () => {
        let fixture: ComponentFixture<TestBasicTooltipComponent>;
        let component: TestBasicTooltipComponent;
        let tooltipDirective: Tooltip;

        beforeEach(() => {
            fixture = TestBed.createComponent(TestBasicTooltipComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();

            const debugElement = fixture.debugElement.query(By.directive(Tooltip));
            tooltipDirective = debugElement.injector.get(Tooltip);
        });

        it('should handle escape key when hideOnEscape is true', async () => {
            vi.spyOn(tooltipDirective, 'deactivate');
            component.hideOnEscape.set(true);
            await fixture.whenStable();

            // Simulate document escape listener setup
            tooltipDirective.activate();

            expect(tooltipDirective.deactivate).not.toHaveBeenCalled();
        });

        it('should find correct target element', () => {
            const mockElement = document.createElement('div');
            mockElement.classList.add('p-inputwrapper');
            const input = document.createElement('input');
            mockElement.appendChild(input);

            const target = tooltipDirective.getTarget(mockElement);
            expect(target!.tagName.toLowerCase()).toBe('input');
        });

        it('should return element itself if not p-inputwrapper', () => {
            const mockElement = document.createElement('button');

            const target = tooltipDirective.getTarget(mockElement);
            expect(target).toBe(mockElement);
        });
    });

    describe('Styling and Custom Options', () => {
        let fixture: ComponentFixture<TestBasicTooltipComponent>;
        let component: TestBasicTooltipComponent;
        let tooltipDirective: Tooltip;

        beforeEach(() => {
            fixture = TestBed.createComponent(TestBasicTooltipComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();

            const debugElement = fixture.debugElement.query(By.directive(Tooltip));
            tooltipDirective = debugElement.injector.get(Tooltip);
        });

        it('should handle autoHide option correctly', async () => {
            component.autoHide.set(false);
            await fixture.whenStable();
            expect(tooltipDirective.isAutoHide()).toBe(false);

            component.autoHide.set(true);
            await fixture.whenStable();
            expect(tooltipDirective.isAutoHide()).toBe(true);
        });

        it('should update text content correctly', async () => {
            tooltipDirective.tooltipText = document.createElement('div');
            component.escape.set(true);
            await fixture.whenStable();

            vi.spyOn(document, 'createTextNode');

            component.tooltipLabel.set('Test content');
            await fixture.whenStable();

            tooltipDirective.updateText();

            expect(document.createTextNode).toHaveBeenCalledWith('Test content');
        });

        it('should handle HTML content when escape is false', async () => {
            tooltipDirective.tooltipText = document.createElement('div');
            component.escape.set(false);
            component.tooltipLabel.set('<strong>Bold</strong>');
            await fixture.whenStable();

            tooltipDirective.updateText();

            expect(tooltipDirective.tooltipText.innerHTML).toBe('<strong>Bold</strong>');
        });
    });

    describe('Template Content', () => {
        let fixture: ComponentFixture<TestTemplateTooltipComponent>;
        let component: TestTemplateTooltipComponent;
        let tooltipDirective: Tooltip;

        beforeEach(() => {
            fixture = TestBed.createComponent(TestTemplateTooltipComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();

            const debugElement = fixture.debugElement.query(By.directive(Tooltip));
            tooltipDirective = debugElement.injector.get(Tooltip);
        });

        it('should handle template content', () => {
            expect(tooltipDirective.content()).toEqual(component.tooltipTemplate);
        });
    });

    describe('Tooltip Options', () => {
        let fixture: ComponentFixture<TestTooltipOptionsComponent>;
        let component: TestTooltipOptionsComponent;
        let tooltipDirective: Tooltip;

        beforeEach(() => {
            fixture = TestBed.createComponent(TestTooltipOptionsComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();

            const debugElement = fixture.debugElement.query(By.directive(Tooltip));
            tooltipDirective = debugElement.injector.get(Tooltip);
        });

        it('should apply tooltip options configuration', () => {
            expect(tooltipDirective.getOption('tooltipLabel')).toBe('Options tooltip');
            expect(tooltipDirective.getOption('tooltipPosition')).toBe('top');
            expect(tooltipDirective.getOption('showDelay')).toBe(100);
            expect(tooltipDirective.getOption('hideDelay')).toBe(50);
            expect(tooltipDirective.getOption('life')).toBe(2000);
            expect(tooltipDirective.getOption('tooltipStyleClass')).toBe('custom-options-tooltip');
        });

        it('should update options when tooltipOptions changes', async () => {
            component.options.set({
                ...component.options,
                tooltipLabel: 'Updated tooltip',
                tooltipPosition: 'bottom'
            });
            await fixture.whenStable();

            expect(tooltipDirective.getOption('tooltipLabel')).toBe('Updated tooltip');
            expect(tooltipDirective.getOption('tooltipPosition')).toBe('bottom');
        });
    });

    describe('Edge Cases and Cleanup', () => {
        let fixture: ComponentFixture<TestBasicTooltipComponent>;
        let component: TestBasicTooltipComponent;
        let tooltipDirective: Tooltip;

        beforeEach(() => {
            fixture = TestBed.createComponent(TestBasicTooltipComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();

            const debugElement = fixture.debugElement.query(By.directive(Tooltip));
            tooltipDirective = debugElement.injector.get(Tooltip);
        });

        it('should prevent multiple activations during interaction', () => {
            vi.spyOn(tooltipDirective, 'show');

            tooltipDirective.activate();
            tooltipDirective.activate(); // Second activation should be ignored

            expect(tooltipDirective.show).toHaveBeenCalledTimes(1);
        });

        it('should handle container removal safely', () => {
            expect(() => {
                tooltipDirective.remove();
            }).not.toThrow();
        });

        it('should handle window resize events', () => {
            vi.spyOn(tooltipDirective, 'hide');

            tooltipDirective.onWindowResize(new Event('resize'));

            expect(tooltipDirective.hide).toHaveBeenCalled();
        });

        it('should unbind all event listeners on destroy', () => {
            vi.spyOn(tooltipDirective, 'unbindEvents');

            tooltipDirective.ngOnDestroy();

            expect(tooltipDirective.unbindEvents).toHaveBeenCalled();
        });

        it('should clear all timeouts on destroy', () => {
            tooltipDirective.showTimeout = setTimeout(() => {}, 500);

            vi.spyOn(tooltipDirective, 'clearTimeouts');
            tooltipDirective.ngOnDestroy();

            expect(tooltipDirective.clearTimeouts).toHaveBeenCalled();
        });

        it('should handle mouseenter without existing container', () => {
            vi.spyOn(tooltipDirective, 'activate');

            tooltipDirective.container = null as any;
            tooltipDirective.showTimeout = null as any;

            tooltipDirective.onMouseEnter(new MouseEvent('mouseenter'));

            expect(tooltipDirective.activate).toHaveBeenCalled();
        });

        it('should handle mouseleave with non-autoHide tooltip', () => {
            vi.spyOn(tooltipDirective, 'deactivate');

            const mouseLeaveEvent = new MouseEvent('mouseleave', {
                relatedTarget: document.createElement('div')
            });

            tooltipDirective.onMouseLeave(mouseLeaveEvent as any);

            expect(tooltipDirective.deactivate).toHaveBeenCalled();
        });

        it('should handle options updates correctly', async () => {
            const initialLabel = tooltipDirective.getOption('tooltipLabel');

            component.tooltipLabel.set('New label');
            await fixture.whenStable();

            expect(tooltipDirective.getOption('tooltipLabel')).toBe('New label');
            expect(tooltipDirective.getOption('tooltipLabel')).not.toEqual(initialLabel);
        });
    });

    describe('PassThrough', () => {
        @Component({
            standalone: true,
            imports: [Tooltip],
            template: ` <input #inputElement pTooltip="PT Test Tooltip" [pt]="pt()" type="text" /> `
        })
        class TestPTTooltipComponent {
            @ViewChild('inputElement', { read: ElementRef }) inputElement!: ElementRef;
            testValue = false;
            pt = signal<any>({});
        }

        let fixture: ComponentFixture<TestPTTooltipComponent>;
        let component: TestPTTooltipComponent;
        let tooltipDirective: Tooltip;
        let inputEl: HTMLElement;

        beforeEach(async () => {
            await TestBed.configureTestingModule({
                imports: [Tooltip, TestPTTooltipComponent],
                providers: [provideZonelessChangeDetection()]
            }).compileComponents();

            fixture = TestBed.createComponent(TestPTTooltipComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();

            const debugElement = fixture.debugElement.query(By.directive(Tooltip));
            tooltipDirective = debugElement.injector.get(Tooltip);
            inputEl = component.inputElement.nativeElement;
        });

        // Case 1: Simple string classes
        it('should apply simple string classes via PT', async () => {
            component.pt.set({
                root: 'ROOT_CLASS'
            });
            await fixture.whenStable();

            tooltipDirective.activate();
            await new Promise((resolve) => setTimeout(resolve, 100));
            await fixture.whenStable();

            const tooltipContainer = document.querySelector('.p-tooltip');
            expect(tooltipContainer?.classList.contains('ROOT_CLASS')).toBeTruthy();

            tooltipDirective.deactivate();
        });

        it('should apply PT classes to dynamically created elements', async () => {
            component.pt.set({
                root: 'ROOT_CLASS',
                arrow: 'ARROW_CLASS',
                text: 'TEXT_CLASS'
            });
            await fixture.whenStable();

            tooltipDirective.activate();
            await new Promise((resolve) => setTimeout(resolve, 100));
            await fixture.whenStable();

            const tooltipContainer = document.querySelector('.p-tooltip');
            const tooltipArrow = document.querySelector('.p-tooltip-arrow');
            const tooltipText = document.querySelector('.p-tooltip-text');

            expect(tooltipContainer?.classList.contains('ROOT_CLASS')).toBeTruthy();
            expect(tooltipArrow?.classList.contains('ARROW_CLASS')).toBeTruthy();
            expect(tooltipText?.classList.contains('TEXT_CLASS')).toBeTruthy();

            tooltipDirective.deactivate();
        });

        // Case 2: Objects with class, style, data attributes
        it('should apply PT object attributes', async () => {
            component.pt.set({
                root: {
                    class: 'PT_ROOT_CLASS',
                    style: { 'background-color': 'yellow' },
                    'data-test-id': 'host-test',
                    'aria-label': 'Host Aria Label'
                }
            });
            await fixture.whenStable();

            tooltipDirective.activate();
            await new Promise((resolve) => setTimeout(resolve, 100));
            await fixture.whenStable();

            const tooltipContainer = document.querySelector('.p-tooltip') as HTMLElement;

            expect(tooltipContainer?.classList.contains('PT_ROOT_CLASS')).toBeTruthy();
            expect(tooltipContainer?.style.backgroundColor).toBe('yellow');
            expect(tooltipContainer?.getAttribute('data-test-id')).toBe('host-test');
            expect(tooltipContainer?.getAttribute('aria-label')).toBe('Host Aria Label');

            tooltipDirective.deactivate();
        });

        it('should apply PT object to dynamic elements', async () => {
            component.pt.set({
                root: {
                    class: 'ROOT_PT_CLASS',
                    style: { border: '2px solid blue' },
                    'data-root-id': 'root-test'
                },
                text: {
                    class: 'TEXT_PT_CLASS',
                    'aria-label': 'Tooltip Text'
                }
            });
            await fixture.whenStable();

            tooltipDirective.activate();
            await new Promise((resolve) => setTimeout(resolve, 100));
            await fixture.whenStable();

            const tooltipContainer = document.querySelector('.p-tooltip') as HTMLElement;
            const tooltipText = document.querySelector('.p-tooltip-text') as HTMLElement;

            expect(tooltipContainer?.classList.contains('ROOT_PT_CLASS')).toBeTruthy();
            expect(tooltipContainer?.style.border).toBe('2px solid blue');
            expect(tooltipContainer?.getAttribute('data-root-id')).toBe('root-test');
            expect(tooltipText?.classList.contains('TEXT_PT_CLASS')).toBeTruthy();
            expect(tooltipText?.getAttribute('aria-label')).toBe('Tooltip Text');

            tooltipDirective.deactivate();
        });

        // Case 3: Mixed object and string values
        it('should handle mixed PT values', async () => {
            component.pt.set({
                root: 'SIMPLE_ROOT_CLASS',
                arrow: {
                    class: 'OBJECT_ARROW_CLASS'
                }
            });
            await fixture.whenStable();

            tooltipDirective.activate();
            await new Promise((resolve) => setTimeout(resolve, 100));
            await fixture.whenStable();

            const tooltipContainer = document.querySelector('.p-tooltip');
            const tooltipArrow = document.querySelector('.p-tooltip-arrow');

            expect(tooltipContainer?.classList.contains('SIMPLE_ROOT_CLASS')).toBeTruthy();
            expect(tooltipArrow?.classList.contains('OBJECT_ARROW_CLASS')).toBeTruthy();

            tooltipDirective.deactivate();
        });

        // Case 5: Event binding
        it('should handle PT event bindings', async () => {
            let clicked = false;
            component.pt.set({
                root: {
                    onclick: () => {
                        clicked = true;
                    }
                }
            });
            await fixture.whenStable();

            tooltipDirective.activate();
            await new Promise((resolve) => setTimeout(resolve, 100));
            await fixture.whenStable();

            const tooltipContainer = document.querySelector('.p-tooltip') as HTMLElement;
            tooltipContainer.click();
            expect(clicked).toBeTruthy();

            tooltipDirective.deactivate();
        });

        // Additional test: PT on all tooltip sections
        it('should apply PT to all tooltip sections', async () => {
            component.pt.set({
                root: 'ROOT_PT',
                arrow: 'ARROW_PT',
                text: 'TEXT_PT'
            });
            await fixture.whenStable();
            await new Promise((resolve) => setTimeout(resolve, 100));
            await fixture.whenStable();

            tooltipDirective.activate();
            await new Promise((resolve) => setTimeout(resolve, 100));
            await fixture.whenStable();

            const container = document.querySelector('.p-tooltip');
            const arrow = document.querySelector('.p-tooltip-arrow');
            const text = document.querySelector('.p-tooltip-text');

            expect(container?.classList.contains('ROOT_PT')).toBeTruthy();
            expect(arrow?.classList.contains('ARROW_PT')).toBeTruthy();
            expect(text?.classList.contains('TEXT_PT')).toBeTruthy();

            tooltipDirective.deactivate();
        });

        // Test PT attribute removal
        it('should remove attributes when PT value is null', async () => {
            const container = document.querySelector('.p-tooltip');
            component.pt.set({
                root: {
                    'data-test': null
                }
            });
            await fixture.whenStable();
            await new Promise((resolve) => setTimeout(resolve, 100));
            await fixture.whenStable();

            expect(container?.hasAttribute('data-test')).toBeFalsy();
        });
    });
});
