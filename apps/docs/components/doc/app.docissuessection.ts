import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'app-docissuessection',
    standalone: true,
    template: ` <div class="doc-main">
        <div class="doc-intro">
            <h1 class="m-0">Known Issues</h1>
            <p>
                There are currently <strong>{{ count }}</strong> open issues related to the <strong>{{ componentName }}</strong> component.
            </p>
        </div>

        <div class="doc-notification">
            <p>
                <strong>Open Source Contribution:</strong>
                Optimus UI is a community-driven project. If you have encountered any of these issues or want to help improve the component, we highly encourage you to contribute!
            </p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <a
                    [href]="githubUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex flex-col bg-surface-0 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 p-4 rounded-xl hover:border-primary-500 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors"
                    style="text-decoration: none;"
                >
                    <div class="flex items-center gap-2 mb-2">
                        <i class="pi pi-github text-xl text-primary-500"></i>
                        <span class="font-semibold text-lg text-surface-900 dark:text-surface-0">Open Issues</span>
                    </div>
                    <p class="m-0 text-surface-600 dark:text-surface-400 text-sm">Browse currently known open issues for the {{ componentName }} component.</p>
                </a>

                <a
                    href="https://github.com/openng-org/optimus-ui/blob/main/CONTRIBUTING.md"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex flex-col bg-surface-0 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 p-4 rounded-xl hover:border-primary-500 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors"
                    style="text-decoration: none;"
                >
                    <div class="flex items-center gap-2 mb-2">
                        <i class="pi pi-book text-xl text-primary-500"></i>
                        <span class="font-semibold text-lg text-surface-900 dark:text-surface-0">Contribution Guide</span>
                    </div>
                    <p class="m-0 text-surface-600 dark:text-surface-400 text-sm">Read the guide on how to help improve Optimus UI.</p>
                </a>

                <a
                    [href]="'https://github.com/openng-org/optimus-ui/issues/new?labels=bug&title=Bug:+[' + componentName + ']'"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex flex-col bg-surface-0 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 p-4 rounded-xl hover:border-primary-500 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors"
                    style="text-decoration: none;"
                >
                    <div class="flex items-center gap-2 mb-2">
                        <i class="pi pi-times text-xl text-primary-500"></i>
                        <span class="font-semibold text-lg text-surface-900 dark:text-surface-0">Report a Bug</span>
                    </div>
                    <p class="m-0 text-surface-600 dark:text-surface-400 text-sm">Found a new bug? Let us know so we can fix it.</p>
                </a>

                <a
                    [href]="'https://github.com/openng-org/optimus-ui/issues/new?labels=enhancement&title=Feature:+[' + componentName + ']'"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex flex-col bg-surface-0 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 p-4 rounded-xl hover:border-primary-500 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors"
                    style="text-decoration: none;"
                >
                    <div class="flex items-center gap-2 mb-2">
                        <i class="pi pi-lightbulb text-xl text-primary-500"></i>
                        <span class="font-semibold text-lg text-surface-900 dark:text-surface-0">Feature Request</span>
                    </div>
                    <p class="m-0 text-surface-600 dark:text-surface-400 text-sm">Have a great idea? Share it with the community.</p>
                </a>
            </div>
        </div>
    </div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        '[class.doc-tabpanel]': 'true'
    }
})
export class AppDocIssuesSection {
    @Input() count: number = 0;

    @Input() componentName: string = '';

    @Input() githubUrl: string | null = null;
}
