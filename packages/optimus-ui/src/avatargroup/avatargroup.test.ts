import { ChangeDetectionStrategy, Component, provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Avatar } from '@openng/optimus-ui/avatar';
import { AvatarGroup, AvatarGroupModule } from './avatargroup';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [AvatarGroup, Avatar],
    template: `
        <p-avatar-group [styleClass]="styleClass()" [style]="style()" [pt]="pt()">
            <p-avatar label="A"></p-avatar>
            <p-avatar label="B"></p-avatar>
        </p-avatar-group>
    `
})
class TestAvatarGroupComponent {
    styleClass = signal<string | undefined>(undefined);
    style = signal<{ [klass: string]: any } | null | undefined>(undefined);
    pt = signal<any>(undefined);
}

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [AvatarGroupModule],
    template: `
        <p-avatarGroup class="alias-camel"></p-avatarGroup>
        <p-avatargroup class="alias-lower"></p-avatargroup>
    `
})
class TestAvatarGroupAliasesComponent {}

describe('AvatarGroup', () => {
    let fixture: ComponentFixture<TestAvatarGroupComponent>;
    let host: TestAvatarGroupComponent;
    let avatarGroup: AvatarGroup;
    let element: HTMLElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestAvatarGroupComponent, TestAvatarGroupAliasesComponent],
            providers: [provideZonelessChangeDetection()]
        }).compileComponents();

        fixture = TestBed.createComponent(TestAvatarGroupComponent);
        host = fixture.componentInstance;
        fixture.detectChanges();
        await fixture.whenStable();

        const debugElement = fixture.debugElement.query(By.directive(AvatarGroup));
        avatarGroup = debugElement.componentInstance;
        element = debugElement.nativeElement;
    });

    async function update(changes: { styleClass?: string; style?: { [klass: string]: any } | null; pt?: any }) {
        if ('styleClass' in changes) host.styleClass.set(changes.styleClass);
        if ('style' in changes) host.style.set(changes.style);
        if ('pt' in changes) host.pt.set(changes.pt);
        fixture.detectChanges();
        await fixture.whenStable();
    }

    it('should create', () => {
        expect(avatarGroup).toBeTruthy();
    });

    it('should have undefined input defaults', () => {
        expect(avatarGroup.styleClass()).toBeUndefined();
        expect(avatarGroup.style()).toBeUndefined();
    });

    it('should render the root classes on the host', () => {
        expect(element.classList.contains('p-avatar-group')).toBe(true);
        expect(element.classList.contains('p-component')).toBe(true);
    });

    it('should project the avatars', () => {
        const avatars = element.querySelectorAll('p-avatar');

        expect(avatars.length).toBe(2);
        expect(avatars[0].textContent).toContain('A');
        expect(avatars[1].textContent).toContain('B');
    });

    it('should apply and update styleClass on the host', async () => {
        await update({ styleClass: 'first-class' });

        expect(avatarGroup.styleClass()).toBe('first-class');
        expect(element.classList.contains('first-class')).toBe(true);
        expect(element.classList.contains('p-avatar-group')).toBe(true);

        await update({ styleClass: 'second-class' });

        expect(element.classList.contains('first-class')).toBe(false);
        expect(element.classList.contains('second-class')).toBe(true);
        expect(element.classList.contains('p-avatar-group')).toBe(true);
    });

    it('should apply and update the inline style on the host', async () => {
        await update({ style: { 'background-color': 'rgb(255, 0, 0)' } });

        expect(avatarGroup.style()).toEqual({ 'background-color': 'rgb(255, 0, 0)' });
        expect(element.style.backgroundColor).toBe('rgb(255, 0, 0)');

        await update({ style: { width: '120px' } });

        expect(element.style.backgroundColor).toBe('');
        expect(element.style.width).toBe('120px');

        await update({ style: null });

        expect(element.style.width).toBe('');
    });

    it('should apply pass-through attributes to the host', async () => {
        await update({ pt: { host: { 'data-test': 'pt-host' }, root: 'PT_ROOT_CLASS' } });

        expect(element.getAttribute('data-test')).toBe('pt-host');
        expect(element.classList.contains('PT_ROOT_CLASS')).toBe(true);
    });

    it('should render through every selector alias', async () => {
        const aliasFixture = TestBed.createComponent(TestAvatarGroupAliasesComponent);
        aliasFixture.detectChanges();
        await aliasFixture.whenStable();

        const groups = aliasFixture.debugElement.queryAll(By.directive(AvatarGroup));

        expect(groups.length).toBe(2);
        groups.forEach((group) => expect(group.nativeElement.classList.contains('p-avatar-group')).toBe(true));
    });
});
