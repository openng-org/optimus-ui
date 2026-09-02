import { ChangeDetectionStrategy, Component, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Badge } from '@openng/optimus-ui/badge';
import { OverlayBadge } from './overlaybadge';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: true,
    imports: [OverlayBadge],
    template: `
        <p-overlayBadge [value]="value" [severity]="severity" [badgeSize]="badgeSize" [badgeDisabled]="badgeDisabled">
            <i class="pi pi-bell"></i>
        </p-overlayBadge>
    `
})
class TestBasicOverlayBadgeComponent {
    value: string | number | null = '2';
    severity: 'success' | 'danger' | null = 'danger';
    badgeSize: 'small' | 'large' | 'xlarge' | null = null;
    badgeDisabled = false;
}

describe('OverlayBadge', () => {
    let component: TestBasicOverlayBadgeComponent;
    let fixture: ComponentFixture<TestBasicOverlayBadgeComponent>;
    let overlayBadgeInstance: OverlayBadge;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestBasicOverlayBadgeComponent],
            providers: [provideZonelessChangeDetection()]
        }).compileComponents();

        fixture = TestBed.createComponent(TestBasicOverlayBadgeComponent);
        component = fixture.componentInstance;
        overlayBadgeInstance = fixture.debugElement.query(By.directive(OverlayBadge)).componentInstance;
        fixture.detectChanges();
    });

    it('should create and project content', () => {
        expect(overlayBadgeInstance).toBeTruthy();
        expect(fixture.debugElement.query(By.css('i.pi-bell'))).toBeTruthy();
    });

    it('should forward its inputs to the inner badge', () => {
        const badgeInstance: Badge = fixture.debugElement.query(By.directive(Badge)).componentInstance;

        expect(overlayBadgeInstance.value()).toBe('2');
        expect(overlayBadgeInstance.severity()).toBe('danger');
        expect(badgeInstance.value()).toBe('2');
        expect(badgeInstance.severity()).toBe('danger');
    });

    it('should update the forwarded value dynamically', async () => {
        component.value = '9+';
        fixture.changeDetectorRef.markForCheck();
        await fixture.whenStable();

        const badgeElement = fixture.debugElement.query(By.directive(Badge));
        expect(overlayBadgeInstance.value()).toBe('9+');
        expect(badgeElement.nativeElement.textContent.trim()).toBe('9+');
    });

    it('should transform badgeDisabled as a boolean attribute', async () => {
        expect(overlayBadgeInstance.badgeDisabled()).toBe(false);

        component.badgeDisabled = true;
        fixture.changeDetectorRef.markForCheck();
        await fixture.whenStable();

        expect(overlayBadgeInstance.badgeDisabled()).toBe(true);
    });

    it('should apply PT sections', () => {
        const ptFixture = TestBed.createComponent(OverlayBadge);
        ptFixture.componentRef.setInput('pt', { host: 'HOST_CLASS', root: 'ROOT_CLASS' });
        ptFixture.detectChanges();

        const hostElement: HTMLElement = ptFixture.nativeElement;
        expect(hostElement.classList.contains('HOST_CLASS')).toBe(true);
        // root is the inner wrapper div
        expect(hostElement.querySelector('div')?.classList.contains('ROOT_CLASS')).toBe(true);
    });
});
