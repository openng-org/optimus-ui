import { Component, inject, OnInit } from '@angular/core';
import { ButtonModule } from '@openng/optimus-ui/button';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

@Component({
    standalone: true,
    imports: [CommonModule, ButtonModule, RouterModule],
    template: ` <div class="flex min-h-screen items-center justify-center">
        <div class="flex card flex-col items-center gap-8 sm:p-20">
            <div class="text-primary font-bold text-9xl">404</div>
            <div class="font-bold text-center text-4xl border-t border-surface pt-8">Page Not Found</div>
            <p-button label="GO TO HOMEPAGE" routerLink="/" />
        </div>
    </div>`
})
export class NotFoundDemo implements OnInit {
    private titleService = inject(Title);

    private metaService = inject(Meta);

    ngOnInit() {
        this.titleService.setTitle('Page Not Found - Optimus UI');
        this.metaService.updateTag({ name: 'robots', content: 'noindex' });
    }
}
