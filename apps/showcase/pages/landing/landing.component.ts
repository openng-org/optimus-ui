import { AppTopBarComponent } from '@/components/layout/topbar/app.topbar.component';
import { AppConfigService } from '@/service/appconfigservice';
import { CommonModule } from '@angular/common';
import { Component, computed, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ButtonModule } from '@openng/optimus-ui/button';
import { Subscription } from 'rxjs';
import { FeaturesSectionComponent } from './featuressection.component';
import { FooterSectionComponent } from './footersection.component';
import { HeroSectionComponent } from './herosection.component';
import { ThemeSectionComponent } from './themesection.component';

@Component({
    selector: 'landing',
    standalone: true,
    templateUrl: './landing.component.html',
    imports: [CommonModule, AppTopBarComponent, ButtonModule, HeroSectionComponent, FeaturesSectionComponent, ThemeSectionComponent, FooterSectionComponent]
})
export class LandingComponent implements OnInit {
    subscription!: Subscription;

    isNewsActive = computed(() => this.configService.newsActive());

    isDarkMode = computed(() => this.configService.appState().darkTheme);

    landingClass = computed(() => {
        return {
            'layout-dark': this.isDarkMode(),
            'layout-light': !this.isDarkMode(),
            'layout-news-active': this.isNewsActive()
        };
    });

    constructor(
        private configService: AppConfigService,
        private metaService: Meta,
        private titleService: Title
    ) {}

    ngOnInit() {
        this.titleService.setTitle('PrimeNG - Angular UI Component Library');
        this.metaService.updateTag({
            name: 'description',
            content: 'The ultimate collection of design-agnostic, flexible and accessible Angular UI Components.'
        });
    }
}
