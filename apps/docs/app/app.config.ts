import { routes } from '@/router/app.routes';
import { DemoCodeService } from '@/service/democodeservice';
import Noir from '@/themes/app-theme';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig, inject, provideAppInitializer, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { ConfirmationService, MessageService } from '@openng/optimus-ui/api';
import { provideOptimus } from '@openng/optimus-ui/config';

export const appConfig: ApplicationConfig = {
    providers: [
        provideZonelessChangeDetection(),
        provideRouter(routes, withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' })), // withEnabledBlockingInitialNavigation()
        provideHttpClient(withFetch()),
        provideOptimus({
            theme: Noir,
            ripple: false
        }),
        provideAppInitializer(() => {
            const demoCodeService = inject(DemoCodeService);
            demoCodeService.loadDemos();
        }),
        MessageService,
        ConfirmationService
    ]
};
