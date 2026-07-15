import { routes } from '@/router/app.routes';
import { DemoCodeService } from '@/service/democodeservice';
import Noir from '@/themes/app-theme';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { APP_INITIALIZER, ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { ConfirmationService, MessageService } from '@openng/optimus-ui/api';
import { provideOptimus } from '@openng/optimus-ui/config';

function initializeDemoCode(demoCodeService: DemoCodeService) {
    return () => demoCodeService.loadDemos();
}

export const appConfig: ApplicationConfig = {
    providers: [
        provideZonelessChangeDetection(),
        provideRouter(routes, withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' })), // withEnabledBlockingInitialNavigation()
        provideHttpClient(withFetch()),
        provideOptimus({
            theme: Noir,
            ripple: false
        }),
        MessageService,
        ConfirmationService,
        {
            provide: APP_INITIALIZER,
            useFactory: initializeDemoCode,
            deps: [DemoCodeService],
            multi: true
        }
    ]
};
