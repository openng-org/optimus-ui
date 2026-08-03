import { default as MenuData } from '@/assets/data/menu.json';
import { default as Versions } from '@/assets/data/versions.json';
import { AppConfiguratorComponent } from '@/components/layout/configurator/app.configurator.component';
import { AppConfigService } from '@/service/appconfigservice';
import { DISCORD_URL, GITHUB_DISCUSSIONS_URL, GITHUB_REPO_URL } from '@/utils/constants';
import { CommonModule } from '@angular/common';
import { afterNextRender, Component, computed, ElementRef, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { AutoComplete } from '@openng/optimus-ui/autocomplete';
import { DomHandler } from '@openng/optimus-ui/dom';
import { SelectModule } from '@openng/optimus-ui/select';
import { StyleClass } from '@openng/optimus-ui/styleclass';
import { Subscription } from 'rxjs';
import { AppMenuItemComponent } from './app.menuitem.component';

export interface MenuItem {
    name?: string;
    icon?: string;
    children?: MenuItem[];
    routerLink?: string;
    href?: string;
}

@Component({
    selector: 'app-menu',
    template: ` <aside>
        <ul class="topbar-items drawer-quickactions">
            <li>
                <a [href]="githubRepoUrl" target="_blank" rel="noopener noreferrer" class="topbar-item">
                    <i class="pi pi-github text-surface-700 dark:text-surface-100"></i>
                </a>
            </li>
            <li>
                <a [href]="discordUrl" target="_blank" rel="noopener noreferrer" class="topbar-item" aria-label="Angular community Discord" title="Angular community Discord">
                    <i class="pi pi-discord text-surface-700 dark:text-surface-100"></i>
                </a>
            </li>
            <li>
                <a [href]="githubDiscussionsUrl" target="_blank" rel="noopener noreferrer" class="topbar-item">
                    <i class="pi pi-comments text-surface-700 dark:text-surface-100"></i>
                </a>
            </li>
            <li>
                <button type="button" class="topbar-item" (click)="toggleDarkMode()" aria-label="Toggle dark mode">
                    <i class="pi" [ngClass]="{ 'pi-moon': isDarkMode(), 'pi-sun': !isDarkMode() }"></i>
                </button>
            </li>
            <li class="relative">
                <button
                    type="button"
                    class="topbar-item config-item"
                    enterActiveClass="px-overlay-enter-active"
                    enterFromClass="hidden"
                    leaveActiveClass="px-overlay-leave-active"
                    leaveToClass="hidden"
                    pStyleClass="@next"
                    [hideOnOutsideClick]="true"
                    aria-label="Customize theme"
                >
                    <i class="pi pi-palette"></i>
                </button>
                <app-configurator />
            </li>
            <li class="drawer-version-select">
                <p-select
                    [(ngModel)]="selectedVersion"
                    [options]="versions"
                    [group]="true"
                    (onChange)="onVersionChange($event)"
                    [pt]="{
                        optionGroup: {
                            class: 'version-group'
                        }
                    }"
                >
                </p-select>
            </li>
        </ul>
        <nav>
            <ol class="layout-menu">
                <li *ngFor="let item of menu; let i = index" app-menuitem [item]="item" [root]="true"></li>
            </ol>
        </nav>
    </aside>`,
    host: {
        class: 'layout-sidebar',
        '[class.active]': 'isActive()'
    },
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, SelectModule, StyleClass, AppConfiguratorComponent, AppMenuItemComponent]
})
export class AppMenuComponent implements OnDestroy {
    menu!: MenuItem[];

    readonly githubRepoUrl = GITHUB_REPO_URL;
    readonly githubDiscussionsUrl = GITHUB_DISCUSSIONS_URL;
    readonly discordUrl = DISCORD_URL;

    versions: any[] = Versions;
    selectedVersion = this.versions[0].items[0].value;

    private routerSubscription: Subscription;

    isActive = computed(() => this.configService.appState().menuActive);

    isDarkMode = computed(() => this.configService.appState().darkTheme);

    constructor(
        private configService: AppConfigService,
        private el: ElementRef,
        private router: Router
    ) {
        this.menu = MenuData.data;

        afterNextRender(() => {
            setTimeout(() => {
                this.scrollToActiveItem();
            }, 1);

            this.routerSubscription = this.router.events.subscribe((event) => {
                if (event instanceof NavigationEnd && this.isActive()) {
                    this.configService.hideMenu();
                    DomHandler.unblockBodyScroll('blocked-scroll');
                }
            });
        });
    }

    toggleDarkMode() {
        this.configService.appState.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }

    onVersionChange(event: any) {
        if (event?.value && event.value.startsWith('http')) {
            window.location.href = event.value;
        }
    }

    scrollToActiveItem() {
        let activeItem = DomHandler.findSingle(this.el.nativeElement, '.router-link-active');
        if (activeItem && !this.isInViewport(activeItem)) {
            activeItem.scrollIntoView({ block: 'center' });
        }
    }

    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return rect.top >= 0 && rect.left >= 0 && rect.bottom <= (window.innerHeight || (document.documentElement.clientHeight && rect.right <= (window.innerWidth || document.documentElement.clientWidth)));
    }

    ngOnDestroy() {
        if (this.routerSubscription) {
            this.routerSubscription.unsubscribe();
            this.routerSubscription = null;
        }
    }
}
