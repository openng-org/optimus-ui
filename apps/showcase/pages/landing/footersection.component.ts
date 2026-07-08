import { DISCORD_URL, GITHUB_DISCUSSIONS_URL, GITHUB_REPO_URL } from '@/utils/constants';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'footer-section',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
        <section class="landing-footer pt-18 px-7 lg:px-20">
            <div class="landing-footer-container">
                <div class="flex flex-wrap z-10">
                    <div class="w-6/12 lg:w-3/12 flex">
                        <ul class="list-none p-0 m-0">
                            <li class="text-sm font-bold mb-7">Support</li>
                            <li class="mb-4">
                                <a [href]="GITHUB_DISCUSSIONS_URL" target="_blank" rel="noopener noreferrer" class="text-sm text-surface-500 dark:text-surface-400 font-medium hover:text-primary rounded-sm transition-all duration-300"
                                    >GitHub Discussions</a
                                >
                            </li>
                            <li class="mb-4">
                                <a [href]="DISCORD_URL" target="_blank" rel="noopener noreferrer" class="text-sm text-surface-500 dark:text-surface-400 font-medium hover:text-primary rounded-sm transition-all duration-300">Discord</a>
                            </li>
                        </ul>
                    </div>
                    <div class="w-6/12 lg:w-3/12 flex">
                        <ul class="list-none p-0 m-0">
                            <li class="text-sm font-bold mt-7 lg:mt-0 mb-7">Theming</li>
                            <li class="mb-4">
                                <a [routerLink]="'/theming'" class="text-sm text-surface-500 dark:text-surface-400 font-medium hover:text-primary rounded-sm transition-all duration-300">Styled Mode</a>
                            </li>
                        </ul>
                    </div>
                    <div class="w-6/12 lg:w-3/12 flex">
                        <ul class="list-none p-0 m-0">
                            <li class="text-sm font-bold mt-7 lg:mt-0 mb-7">Resources</li>
                            <li class="mb-4">
                                <a [href]="GITHUB_REPO_URL" target="_blank" rel="noopener noreferrer" class="text-sm text-surface-500 dark:text-surface-400 font-medium hover:text-primary rounded-sm transition-all duration-300">Source Code</a>
                            </li>
                            <li class="mb-4">
                                <a href="mailto:contact@openng.org" target="_blank" rel="noopener noreferrer" class="text-sm text-surface-500 dark:text-surface-400 font-medium hover:text-primary rounded-sm transition-all duration-300">Contact Us</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <hr class="section-divider" />

                <div class="flex flex-wrap justify-end py-10 gap-7">
                    <div class="flex items-center gap-2">
                        <a href="https://www.linkedin.com/company/openng" target="_blank" rel="noopener noreferrer" class="linkbox linkbox-icon">
                            <i class="pi pi-linkedin"></i>
                        </a>
                        <a [href]="GITHUB_REPO_URL" target="_blank" rel="noopener noreferrer" class="linkbox linkbox-icon">
                            <i class="pi pi-github"></i>
                        </a>
                        <a [href]="DISCORD_URL" target="_blank" rel="noopener noreferrer" class="linkbox linkbox-icon">
                            <i class="pi pi-discord"></i>
                        </a>
                        <a [href]="GITHUB_DISCUSSIONS_URL" class="linkbox linkbox-icon">
                            <i class="pi pi-comments"></i>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    `
})
export class FooterSectionComponent {
    DISCORD_URL = DISCORD_URL;
    GITHUB_DISCUSSIONS_URL = GITHUB_DISCUSSIONS_URL;
    GITHUB_REPO_URL = GITHUB_REPO_URL;
}
