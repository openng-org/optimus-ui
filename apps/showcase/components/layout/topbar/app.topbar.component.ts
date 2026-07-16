import PrimeNGVersions from '@/assets/data/primeng_versions.json';
import OptimusUIVersions from '@/assets/data/optimusui_versions.json';
import { AppConfiguratorComponent } from '@/components/layout/configurator/app.configurator.component';
import { AppConfigService } from '@/service/appconfigservice';
import { CommonModule, DOCUMENT, NgOptimizedImage } from '@angular/common';
import { afterNextRender, booleanAttribute, Component, computed, ElementRef, Inject, Input, OnDestroy, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import docsearch from '@docsearch/js';
import { DomHandler } from '@openng/optimus-ui/dom';
import { StyleClass } from '@openng/optimus-ui/styleclass';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [CommonModule, FormsModule, StyleClass, RouterModule, AppConfiguratorComponent, NgOptimizedImage],
    template: `<div class="layout-topbar">
        <div class="layout-topbar-inner">
            <div class="layout-topbar-logo-container">
                <a [routerLink]="['/']" class="layout-topbar-logo" aria-label="PrimeNG Logo">
                    <img ngSrc="logo.svg" height="40" width="200" />
                </a>
                <a [routerLink]="['/']" class="layout-topbar-icon" aria-label="PrimeNG Logo">
                    <img ngSrc="logo-icon.svg" height="32" width="32" />
                </a>
            </div>

            <ul class="topbar-items">
                <li>
                    <div id="docsearch"></div>
                </li>
                <li>
                    <a href="https://github.com/primefaces/primeng" target="_blank" rel="noopener noreferrer" class="topbar-item">
                        <i class="pi pi-github text-surface-700 dark:text-surface-100"></i>
                    </a>
                </li>
                <li>
                    <a href="https://discord.gg/gzKFYnpmCY" target="_blank" rel="noopener noreferrer" class="topbar-item">
                        <i class="pi pi-discord text-surface-700 dark:text-surface-100"></i>
                    </a>
                </li>
                <li>
                    <a href="https://github.com/orgs/primefaces/discussions" target="_blank" rel="noopener noreferrer" class="topbar-item">
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
                    <button
                        pStyleClass="@next"
                        enterFromClass="hidden"
                        enterActiveClass="px-overlay-enter-active"
                        leaveToClass="hidden"
                        leaveActiveClass="px-overlay-leave-active"
                        [hideOnOutsideClick]="true"
                        type="button"
                        class="topbar-item version-item"
                    >
                        <span class="version-text">{{ optimusuiVersions ? optimusuiVersions[0].name : 'Latest' }}</span>
                        <span class="version-icon pi pi-angle-down"></span>
                    </button>
                    <div class="versions-panel hidden">
                        <ul>
                            <li class="version-tag">Optimus UI</li>
                            @for (v of optimusuiVersions; track v.version) {
                                <li role="none">
                                    <a [href]="v.url">
                                        <span>{{ v.version }}</span>
                                    </a>
                                </li>
                            }

                            <li class="version-tag">PrimeNG</li>
                            @for (v of primengVersions; track v.version) {
                                <li role="none">
                                    <a [href]="v.url">
                                        <span>{{ v.version }}</span>
                                    </a>
                                </li>
                            }
                        </ul>
                    </div>
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
class AppTopBarComponent implements OnDestroy {
    @Input({ transform: booleanAttribute }) showConfigurator = true;

    @Input({ transform: booleanAttribute }) showMenuButton = true;

    primengVersions: any[] = PrimeNGVersions;
    optimusuiVersions: any[] = OptimusUIVersions;

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
}
