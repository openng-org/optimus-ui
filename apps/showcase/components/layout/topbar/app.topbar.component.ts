import Versions from '@/assets/data/versions.json';
import { AppConfiguratorComponent } from '@/components/layout/configurator/app.configurator.component';
import { AppConfigService } from '@/service/appconfigservice';
import { NgClass, DOCUMENT } from '@angular/common';
import { afterNextRender, booleanAttribute, Component, computed, DestroyRef, ElementRef, inject, input, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import docsearch from '@docsearch/js';
import { DomHandler } from 'primeng/dom';
import { StyleClass } from 'primeng/styleclass';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [NgClass, FormsModule, StyleClass, RouterModule, AppConfiguratorComponent],
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {
    readonly showConfigurator = input(true, { transform: booleanAttribute });

    readonly showMenuButton = input(true, { transform: booleanAttribute });

    readonly versions = Versions;

    readonly socialLinks = [
        { href: 'https://github.com/openng-foundation/open-prime', icon: 'pi-github' },
        // TODO: Invite to angular discord open-prime channel
        { href: 'https://discord.gg/gzKFYnpmCY', icon: 'pi-discord' },
        { href: 'https://github.com/openng-foundation/open-prime/discussions', icon: 'pi-comments' }
    ];

    scrollListener: VoidFunction | null;

    private readonly document = inject(DOCUMENT);

    private readonly el = inject(ElementRef);

    private readonly renderer = inject(Renderer2);

    private readonly configService = inject(AppConfigService);

    private readonly window = this.document.defaultView;

    constructor() {
        inject(DestroyRef).onDestroy(() => this.unbindScrollListener());

        afterNextRender(() => {
            this.bindScrollListener();
            this.initDocSearch();
        });
    }

    readonly isDarkMode = computed(() => this.configService.appState().darkTheme);

    readonly isMenuActive = computed(() => this.configService.appState().menuActive);

    readonly isDesignerActive = computed(() => this.configService.designerActive());

    toggleMenu() {
        if (this.isMenuActive()) {
            this.configService.hideMenu();
            DomHandler.unblockBodyScroll('blocked-scroll');
        } else {
            this.configService.showMenu();
            DomHandler.blockBodyScroll('blocked-scroll');
        }
    }

    toggleDesigner() {
        if (this.isDesignerActive()) {
            this.configService.hideDesigner();
        } else {
            this.configService.showDesigner();
        }
    }

    toggleDarkMode() {
        this.configService.appState.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }

    private initDocSearch() {
        docsearch({
            appId: 'XG1L2MUWT9',
            apiKey: '0c7d92ce7c38649263123110162ac181',
            indexName: 'primeng',
            container: '#docsearch'
        });
    }

    private bindScrollListener() {
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

    private unbindScrollListener() {
        if (this.scrollListener) {
            this.scrollListener();
            this.scrollListener = null;
        }
    }
}
