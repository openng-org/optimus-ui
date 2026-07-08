import { Doc } from '@/domain/doc';
import { CommonModule, DOCUMENT, isPlatformBrowser, Location } from '@angular/common';
import { AfterViewInit, Component, DestroyRef, ElementRef, inject, input, OnInit, PLATFORM_ID, signal, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DomHandler } from 'primeng/dom';
import { ObjectUtils } from 'primeng/utils';
import { fromEvent } from 'rxjs';

@Component({
    selector: 'app-docsection-nav',
    standalone: true,
    imports: [CommonModule, ButtonModule, RouterLink],
    template: `
        <div class="doc-section-nav-container">
            <span class="doc-section-nav-title">ON THIS PAGE</span>
            <ul #nav class="doc-section-nav">
                @for (doc of docs(); track doc.label) {
                    @if (!doc.isInterface) {
                        <li class="navbar-item" [ngClass]="{ 'active-navbar-item': activeId() === doc.id }">
                            <div class="navbar-item-content">
                                <button (click)="onButtonClick(doc)">{{ doc.label }}</button>
                            </div>
                            @if (doc.children) {
                                <ul>
                                    @for (child of doc.children; track child.label) {
                                        <li class="navbar-item" [ngClass]="{ 'active-navbar-item': activeId() === child.id }">
                                            <div class="navbar-item-content">
                                                <button (click)="onButtonClick(child)">
                                                    {{ child.label }}
                                                </button>
                                            </div>
                                            @if (child.children) {
                                                <ul>
                                                    @for (grandchild of child.children; track grandchild.label) {
                                                        <li class="navbar-item" [ngClass]="{ 'active-navbar-item': activeId() === grandchild.id }">
                                                            <div class="navbar-item-content">
                                                                <button (click)="onButtonClick(grandchild)">
                                                                    {{ grandchild.label }}
                                                                </button>
                                                            </div>
                                                        </li>
                                                    }
                                                </ul>
                                            }
                                        </li>
                                    }
                                </ul>
                            }
                        </li>
                    }
                }
            </ul>
        </div>
    `
})
export class AppDocSectionNav implements OnInit, AfterViewInit {
    docs = input.required<Doc[]>();

    activeId = signal<string | null>(null);

    isScrollBlocked: boolean = false;

    topbarHeight: number = 0;

    scrollEndTimer!: any;

    private readonly document = inject(DOCUMENT);
    private readonly platformId = inject(PLATFORM_ID);
    private readonly location = inject(Location);
    private readonly destroyRef = inject(DestroyRef);

    @ViewChild('nav') nav: ElementRef;

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.scrollCurrentUrl();

            fromEvent(this.document, 'scroll')
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe(() => this.onScroll());
        }
    }

    ngAfterViewInit() {
        if (isPlatformBrowser(this.platformId)) {
            setTimeout(() => this.updateIndicator(), 300);
        }
    }

    scrollCurrentUrl() {
        const hash = window.location.hash.substring(1);
        const hasHash = ObjectUtils.isNotEmpty(hash);
        const id = hasHash ? hash : (this.docs()[0] || {}).id;

        this.activeId.set(id);
        hasHash &&
            setTimeout(() => {
                this.scrollToLabelById(id);
            }, 250);
    }

    getLabels() {
        return [...Array.from(this.document.querySelectorAll(':is(h1,h2,h3,h4).doc-section-label'))].filter((el: any) => DomHandler.isVisible(el));
    }

    onScroll() {
        if (isPlatformBrowser(this.platformId)) {
            if (!this.isScrollBlocked) {
                if (typeof document !== 'undefined') {
                    const labels = this.getLabels();
                    const windowScrollTop = DomHandler.getWindowScrollTop();
                    labels.forEach((label) => {
                        const { top } = DomHandler.getOffset(label);
                        const threshold = this.getThreshold(label);

                        if (top - threshold <= windowScrollTop) {
                            const link = DomHandler.findSingle(label, 'a');
                            this.activeId.set(link.id);
                        }
                    });
                }
            }

            clearTimeout(this.scrollEndTimer);
            this.scrollEndTimer = setTimeout(() => {
                this.isScrollBlocked = false;

                const activeItem = DomHandler.findSingle(this.nav.nativeElement, '.active-navbar-item');
                if (activeItem) {
                    activeItem.scrollIntoView({ block: 'nearest', inline: 'start' });
                }
                this.updateIndicator();
            }, 50);
        }
    }

    onButtonClick(doc: Doc) {
        this.activeId.set(doc.id);
        setTimeout(() => {
            this.scrollToLabelById(doc.id);
            this.isScrollBlocked = true;
            this.updateIndicator();
        }, 1);
    }

    getThreshold(label: Element) {
        if (typeof document !== undefined) {
            if (!this.topbarHeight) {
                const topbar = DomHandler.findSingle(document.body, '.layout-topbar');

                this.topbarHeight = topbar ? DomHandler.getHeight(topbar) : 0;
            }
        }

        return this.topbarHeight + DomHandler.getHeight(label) * 3.5;
    }

    updateIndicator() {
        const navEl = this.nav?.nativeElement;
        if (!navEl) return;

        const activeItem = DomHandler.findSingle(navEl, '.active-navbar-item > .navbar-item-content');
        if (activeItem) {
            const top = activeItem.offsetTop;
            const height = activeItem.offsetHeight;
            navEl.style.setProperty('--indicator-top', `${top}px`);
            navEl.style.setProperty('--indicator-height', `${height}px`);
        }
    }

    scrollToLabelById(id: string) {
        if (typeof document !== undefined) {
            const label = document.getElementById(id);
            this.location.go(this.location.path().split('#')[0] + '#' + id);
            setTimeout(() => {
                label && label.parentElement.scrollIntoView({ block: 'start', behavior: 'smooth' });
            }, 1);
        }
    }
}
