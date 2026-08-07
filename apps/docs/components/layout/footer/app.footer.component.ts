import StableVersion from '@/assets/data/stable-version.json';
import { GITHUB_DISCUSSIONS_URL, GITHUB_REPO_URL } from '@/utils/constants';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-footer',
    standalone: true,
    imports: [RouterModule],
    template: `
        <div class="layout-footer">
            <div class="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
                <span>Optimus UI {{ version }} by <a [href]="openngUrl" target="_blank" rel="noopener noreferrer">OpenNG</a></span>
                <a [routerLink]="'/philosophy'">Philosophy</a>
                <a [routerLink]="'/faq'">FAQ</a>
                <a [routerLink]="'/contribution'">Contribute</a>
                <a [href]="githubRepoUrl" target="_blank" rel="noopener noreferrer">GitHub</a>
                <a [href]="githubDiscussionsUrl" target="_blank" rel="noopener noreferrer">Discussions</a>
                <a [href]="licenseUrl" target="_blank" rel="noopener noreferrer">MIT License</a>
            </div>
        </div>
    `
})
export class AppFooterComponent {
    readonly openngUrl = 'https://www.openng.org';

    readonly githubRepoUrl = GITHUB_REPO_URL;

    readonly githubDiscussionsUrl = GITHUB_DISCUSSIONS_URL;

    readonly licenseUrl = `${GITHUB_REPO_URL}/blob/main/LICENSE.md`;

    readonly version = StableVersion.version;
}
