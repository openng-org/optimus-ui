import { ApplicationRef, Component, createComponent, createNgModule, EnvironmentInjector, Injectable, NgModule, provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DialogService } from './dialogservice';
import { DynamicDialog } from './dynamicdialog';
import { DynamicDialogConfig } from './dynamicdialog-config';

@Injectable()
class ReproScopedService {
    readonly value = 'provided by the feature module';
}

@Component({
    standalone: false,
    template: '',
    providers: [DialogService]
})
class ReproFeatureHostComponent {}

@Component({
    standalone: false,
    template: '<span>{{ scopedService.value }}</span>'
})
class ReproDialogContentComponent {
    constructor(public scopedService: ReproScopedService) {}
}

@NgModule({
    declarations: [ReproFeatureHostComponent, ReproDialogContentComponent],
    providers: [ReproScopedService]
})
class ReproFeatureModule {}

describe('DialogService issue #631 reproduction', () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DynamicDialog],
            providers: [provideZonelessChangeDetection()]
        }).compileComponents();
    });

    it('should create dialog content with the configured feature environment injector', () => {
        const appRef = TestBed.inject(ApplicationRef);
        const featureModule = createNgModule(ReproFeatureModule, TestBed.inject(EnvironmentInjector));
        const hostRef = createComponent(ReproFeatureHostComponent, { environmentInjector: featureModule.injector });
        let dialogRef: ReturnType<DialogService['open']> | undefined;

        appRef.attachView(hostRef.hostView);
        hostRef.changeDetectorRef.detectChanges();

        try {
            const dialogService = hostRef.injector.get(DialogService);
            const config = new DynamicDialogConfig();
            config.environmentInjector = featureModule.injector;
            dialogRef = dialogService.open(ReproDialogContentComponent, config);

            expect(dialogRef).toBeTruthy();
            expect(() => appRef.tick()).not.toThrow();

            const dialogInstance = dialogRef && dialogService.getInstance(dialogRef);
            expect(dialogInstance?.componentRef?.instance.scopedService.value).toBe('provided by the feature module');
        } finally {
            dialogRef?.destroy();
            hostRef.destroy();
            featureModule.destroy();
        }
    });
});
