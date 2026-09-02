import { isPlatformBrowser } from '@angular/common';
import { afterEveryRender, Directive, input, NgModule, signal } from '@angular/core';
import { BaseComponent } from '@openng/optimus-ui/basecomponent';
import { DomHandler } from '@openng/optimus-ui/dom';

/**
 * AutoFocus manages focus on focusable element on load.
 * @group Components
 */
@Directive({
    selector: '[pAutoFocus]',
    standalone: true,
    host: {
        // This sets the `attr.autofocus` which is different than the Input `autofocus` attribute.
        '[attr.autofocus]': 'autofocus() ? true : null'
    }
})
export class AutoFocus extends BaseComponent {
    /**
     * When present, it specifies that the component should automatically get focus on load.
     * @group Props
     */
    readonly autofocus = input<boolean>(false, { alias: 'pAutoFocus' });

    readonly focused = signal(false);

    constructor() {
        super();
        // Keep attempting to focus until it succeeds — content projected or rendered later
        // (dialogs, drawers) becomes focusable on a subsequent render (replaces the former
        // ngAfterContentChecked/ngAfterViewChecked hooks).
        afterEveryRender(() => {
            if (!this.focused()) {
                this.autoFocus();
            }
        });
    }

    autoFocus() {
        if (isPlatformBrowser(this.platformId) && this.autofocus()) {
            setTimeout(() => {
                const host = this.el?.nativeElement;
                if (!host) {
                    return;
                }
                const focusableElements = DomHandler.getFocusableElements(host);

                if (focusableElements.length === 0) {
                    host.focus?.();
                }
                if (focusableElements.length > 0) {
                    focusableElements[0].focus();
                }

                this.focused.set(true);
            });
        }
    }
}

@NgModule({
    imports: [AutoFocus],
    exports: [AutoFocus]
})
export class AutoFocusModule {}
