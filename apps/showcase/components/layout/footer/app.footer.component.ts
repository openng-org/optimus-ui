import { PROJECT_NAME } from '@/utils/constants';
import { Component } from '@angular/core';

@Component({
    selector: 'app-footer',
    standalone: true,
    template: `
        <div class="layout-footer">
            <div>
                <span>{{ PROJECT_NAME }} {{ version }} by </span>
                <a href="https://www.primetek.com.tr">PrimeTek</a>
            </div>
        </div>
    `
})
export class AppFooterComponent {
    PROJECT_NAME = PROJECT_NAME;

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    version = require('package.json') && require('package.json').version;
}
