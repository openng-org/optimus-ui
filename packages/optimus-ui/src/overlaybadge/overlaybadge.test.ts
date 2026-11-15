import { ChangeDetectionStrategy, Component, provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { OverlayBadge, OverlayBadgeModule } from './overlaybadge';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [OverlayBadge],
    template: `
        <p-overlay-badge [styleClass]="styleClass()" [style]="style()" [badgeSize]="badgeSize()" [severity]="severity()" [value]="value()" [badgeDisabled]="badgeDisabled()" [size]="size()">
            <span class="target">Target</span>
        </p-overlay-badge>
    `
})
class TestOverlayBadgeComponent {
    styleClass = signal<string | undefined>(undefined);
    style = signal<{ [klass: string]: any } | null | undefined>(undefined);
    badgeSize = signal<'small' | 'large' | 'xlarge' | null | undefined>(undefined);
    severity = signal<'success' | 'info' | 'warn' | 'danger' | null | undefined>(undefined);
    value = signal<string | number | null | undefined>(undefined);
    badgeDisabled = signal<boolean | undefined>(false);
    size = signal<'large' | 'xlarge' | 'small' | undefined | null>(undefined);
}

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [OverlayBadgeModule],
    template: `
        <p-overlayBadge class="alias-camel"></p-overlayBadge>
        <p-overlaybadge class="alias-lower"></p-overlaybadge>
    `
})
class TestOverlayBadgeAliasesComponent {}

describe('OverlayBadge', () => {
    let fixture: ComponentFixture<TestOverlayBadgeComponent>;
    let host: TestOverlayBadgeComponent;
    let overlayBadge: OverlayBadge;
    let element: HTMLElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestOverlayBadgeComponent, TestOverlayBadgeAliasesComponent],
            providers: [provideZonelessChangeDetection()]
        }).compileComponents();

        fixture = TestBed.createComponent(TestOverlayBadgeComponent);
        host = fixture.componentInstance;
        fixture.detectChanges();
        await fixture.whenStable();

        const debugElement = fixture.debugElement.query(By.directive(OverlayBadge));
        overlayBadge = debugElement.componentInstance;
        element = debugElement.nativeElement;
    });

    async function update(changes: {
        styleClass?: string;
        style?: { [klass: string]: any } | null;
        badgeSize?: 'small' | 'large' | 'xlarge' | null;
        severity?: 'success' | 'info' | 'warn' | 'danger' | null;
        value?: string | number | null;
        badgeDisabled?: boolean;
        size?: 'large' | 'xlarge' | 'small' | null;
    }) {
        if ('styleClass' in changes) host.styleClass.set(changes.styleClass);
        if ('style' in changes) host.style.set(changes.style);
        if ('badgeSize' in changes) host.badgeSize.set(changes.badgeSize);
        if ('severity' in changes) host.severity.set(changes.severity);
        if ('value' in changes) host.value.set(changes.value);
        if ('badgeDisabled' in changes) host.badgeDisabled.set(changes.badgeDisabled);
        if ('size' in changes) host.size.set(changes.size);
        fixture.detectChanges();
        await fixture.whenStable();
    }

    it('should create', () => {
        expect(overlayBadge).toBeTruthy();
    });

    it('should have default input values', () => {
        expect(overlayBadge.styleClass()).toBeUndefined();
        expect(overlayBadge.style()).toBeUndefined();
        expect(overlayBadge.badgeSize()).toBeUndefined();
        expect(overlayBadge.severity()).toBeUndefined();
        expect(overlayBadge.value()).toBeUndefined();
        expect(overlayBadge.badgeDisabled()).toBe(false);
        expect(overlayBadge.size()).toBeUndefined();
    });

    it('should render the root class on the inner wrapper', () => {
        expect(element.querySelector('div')?.classList.contains('p-overlaybadge')).toBe(true);
    });

    it('should project content', () => {
        expect(element.querySelector('.target')).toBeTruthy();
    });

    it('should render a nested p-badge', () => {
        expect(element.querySelector('p-badge')).toBeTruthy();
    });

    it('should forward styleClass to the inner badge', async () => {
        await update({ styleClass: 'custom-class' });

        const badge = element.querySelector('p-badge');
        expect(badge?.classList.contains('custom-class')).toBe(true);
    });

    it('should forward value and severity to the inner badge', async () => {
        await update({ value: '2', severity: 'danger' });

        const badge = element.querySelector('p-badge');
        expect(badge?.textContent).toContain('2');
        expect(badge?.classList.contains('p-badge-danger')).toBe(true);
    });

    it('should forward badgeSize to the inner badge', async () => {
        await update({ badgeSize: 'large' });

        const badge = element.querySelector('p-badge');
        expect(badge?.classList.contains('p-badge-lg')).toBe(true);
    });

    it('should forward badgeDisabled to the inner badge', async () => {
        await update({ badgeDisabled: true });

        const badge = element.querySelector('p-badge') as HTMLElement;
        expect(badge.style.display).toBe('none');
    });

    it('should log a deprecation warning when size is used without badgeSize', async () => {
        const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

        await update({ size: 'large' });

        expect(logSpy).toHaveBeenCalledWith('size property is deprecated and will removed in v18, use badgeSize instead.');
    });

    it('should not log a deprecation warning when badgeSize is set', async () => {
        const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

        await update({ size: 'large', badgeSize: 'large' });

        expect(logSpy).not.toHaveBeenCalled();
    });

    it('should render through every selector alias', async () => {
        const aliasFixture = TestBed.createComponent(TestOverlayBadgeAliasesComponent);
        aliasFixture.detectChanges();
        await aliasFixture.whenStable();

        const badges = aliasFixture.debugElement.queryAll(By.directive(OverlayBadge));

        expect(badges.length).toBe(2);
        badges.forEach((badge) => expect(badge.nativeElement.querySelector('div')?.classList.contains('p-overlaybadge')).toBe(true));
    });
});
