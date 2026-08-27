import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

export const SITE_URL = 'https://optimus.openng.org';

/**
 * Keeps the canonical link and the URL/title-derived Open Graph tags in sync
 * with the active route.
 *
 * Page components set the title and description themselves (directly or via
 * app-doc); this service mirrors whatever they set into the og:/twitter: tags
 * so link previews match the page instead of always showing the site defaults.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
    private readonly document = inject(DOCUMENT);

    private readonly router = inject(Router);

    private readonly meta = inject(Meta);

    private readonly title = inject(Title);

    init() {
        this.router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd)).subscribe((event) => {
            // Let the routed component set its title/description first.
            queueMicrotask(() => this.update(event.urlAfterRedirects));
        });
    }

    private update(url: string) {
        const canonical = `${SITE_URL}${url.split('#')[0].split('?')[0]}`;

        this.setCanonical(canonical);
        this.meta.updateTag({ property: 'og:url', content: canonical });

        const title = this.title.getTitle();
        if (title) {
            this.meta.updateTag({ property: 'og:title', content: title });
            this.meta.updateTag({ name: 'twitter:title', content: title });
        }

        const description = this.meta.getTag('name="description"')?.content;
        if (description) {
            this.meta.updateTag({ property: 'og:description', content: description });
            this.meta.updateTag({ name: 'twitter:description', content: description });
        }
    }

    private setCanonical(href: string) {
        let link = this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

        if (!link) {
            link = this.document.createElement('link');
            link.setAttribute('rel', 'canonical');
            this.document.head.appendChild(link);
        }

        link.setAttribute('href', href);
    }
}
