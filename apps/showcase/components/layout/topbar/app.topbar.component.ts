import Versions from '@/assets/data/versions.json';
import { AppConfiguratorComponent } from '@/components/layout/configurator/app.configurator.component';
import { AppConfigService } from '@/service/appconfigservice';
import { DISCORD_URL, GITHUB_DISCUSSIONS_URL, GITHUB_REPO_URL } from '@/utils/constants';
import { CommonModule, DOCUMENT } from '@angular/common';
import { afterNextRender, booleanAttribute, Component, computed, ElementRef, Inject, Input, OnDestroy, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import docsearch from '@docsearch/js';
import { DomHandler } from '@openng/optimus-ui/dom';
import { StyleClass } from '@openng/optimus-ui/styleclass';
import { SelectModule } from '@openng/optimus-ui/select';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [CommonModule, FormsModule, StyleClass, RouterModule, AppConfiguratorComponent, SelectModule],
    template: `<div class="layout-topbar">
        <div class="layout-topbar-inner">
            <div class="layout-topbar-logo-container">
                <a [routerLink]="['/']" class="layout-topbar-logo" aria-label="Optimus UI Logo">
                    <div class="h-[50px] w-[200px] bg-surface-950 dark:bg-surface-50 [mask:url('/logo.svg')_center/100%_100%_no-repeat] [-webkit-mask:url('/logo.svg')_center/100%_100%_no-repeat]"></div>
                </a>
                <a [routerLink]="['/']" class="layout-topbar-icon" aria-label="Optimus UI Logo">
                    <div class="h-[32px] w-[32px] bg-surface-950 dark:bg-surface-50 [mask:url('/logo-icon.svg')_center/100%_100%_no-repeat] [-webkit-mask:url('/logo-icon.svg')_center/100%_100%_no-repeat]"></div>
                </a>
            </div>

            <ul class="topbar-items">
                <li>
                    <div id="docsearch"></div>
                </li>
                <li>
                    <a [href]="githubRepoUrl" target="_blank" rel="noopener noreferrer" class="topbar-item">
                        <i class="pi pi-github text-surface-700 dark:text-surface-100"></i>
                    </a>
                </li>
                <li>
                    <a [href]="discordUrl" target="_blank" rel="noopener noreferrer" class="topbar-item">
                        <i class="pi pi-discord text-surface-700 dark:text-surface-100"></i>
                    </a>
                </li>
                <li>
                    <a [href]="githubDiscussionsUrl" target="_blank" rel="noopener noreferrer" class="topbar-item">
                        <i class="pi pi-comments text-surface-700 dark:text-surface-100"></i>
                    </a>
                </li>
                <li>
                    <button type="button" class="topbar-item" (click)="toggleDarkMode()">
                        <i class="pi" [ngClass]="{ 'pi-moon': isDarkMode(), 'pi-sun': !isDarkMode() }"></i>
                    </button>
                </li>
                <li *ngIf="showConfigurator" class="relative">
                    <button
                        type="button"
                        class="topbar-item config-item"
                        enterActiveClass="px-overlay-enter-active"
                        enterFromClass="hidden"
                        leaveActiveClass="px-overlay-leave-active"
                        leaveToClass="hidden"
                        pStyleClass="@next"
                        [hideOnOutsideClick]="true"
                    >
                        <i class="pi pi-palette"></i>
                    </button>
                    <app-configurator />
                </li>
                <li>
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
                <li *ngIf="showMenuButton" class="menu-button">
                    <button type="button" class="topbar-item menu-button" (click)="toggleMenu()" aria-label="Menu">
                        <i class="pi pi-bars"></i>
                    </button>
                </li>
            </ul>
        </div>
    </div>`
})
export class AppTopBarComponent implements OnDestroy {
    readonly githubRepoUrl = GITHUB_REPO_URL;
    readonly githubDiscussionsUrl = GITHUB_DISCUSSIONS_URL;
    readonly discordUrl = DISCORD_URL;

    @Input({ transform: booleanAttribute }) showConfigurator = true;

    @Input({ transform: booleanAttribute }) showMenuButton = true;

    versions: any[] = Versions;
    selectedVersion = this.versions[0].items[0].value;

    scrollListener: VoidFunction | null;

    private window: Window;

    constructor(
        @Inject(DOCUMENT) private document: Document,
        private el: ElementRef,
        private renderer: Renderer2,
        private configService: AppConfigService
    ) {
        this.window = this.document.defaultView as Window;

        afterNextRender(() => {
            this.bindScrollListener();
            this.initDocSearch();
        });
    }

    isDarkMode = computed(() => this.configService.appState().darkTheme);

    isMenuActive = computed(() => this.configService.appState().menuActive);

    toggleMenu() {
        if (this.isMenuActive()) {
            this.configService.hideMenu();
            DomHandler.unblockBodyScroll('blocked-scroll');
        } else {
            this.configService.showMenu();
            DomHandler.blockBodyScroll('blocked-scroll');
        }
    }

    toggleDarkMode() {
        this.configService.appState.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }

    initDocSearch() {
        docsearch({
            appId: 'XG1L2MUWT9',
            apiKey: '0c7d92ce7c38649263123110162ac181',
            indexName: 'primeng',
            container: '#docsearch'
        });
    }

    bindScrollListener() {
        if (!this.scrollListener) {
            this.scrollListener = this.renderer.listen(this.window, 'scroll', () => {
                if (this.window.scrollY > 0) {
                    this.el.nativeElement.children[0].classList.add('layout-topbar-sticky');
                } else {
                    this.el.nativeElement.children[0].classList.remove('layout-topbar-sticky');
                }
            });
        }
    }

    unbindScrollListener() {
        if (this.scrollListener) {
            this.scrollListener();
            this.scrollListener = null;
        }
    }

    ngOnDestroy() {
        this.unbindScrollListener();
    }

    onVersionChange(event: any) {
        if (event?.value && event.value.startsWith('http')) {
            window.location.href = event.value;
        }
    }
}
