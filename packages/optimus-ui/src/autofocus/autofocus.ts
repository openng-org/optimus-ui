import { isPlatformBrowser } from '@angular/common';
import { afterEveryRender, Directive, ElementRef, inject, input, NgModule, signal } from '@angular/core';
import { BaseComponent } from '@openng/optimus-ui/basecomponent';
import { DomHandler } from '@openng/optimus-ui/dom';

/**
 * AutoFocus manages focus on focusable element on load.
 * @group Components
 */
@Directive({
    selector: '[pAutoFocus]',
    host: {
        // This sets the `attr.autofocus` which is different than the Input `autofocus` attribute.
        '[attr.autofocus]': 'autofocus() === false ? null : true'
    }
})
export class AutoFocus extends BaseComponent {
    /**
     * When present, it specifies that the component should automatically get focus on load.
     * @group Props
     */
    autofocus = input<boolean>(false, { alias: 'pAutoFocus' });

    focused = signal(false);

    host: ElementRef = inject(ElementRef);

    constructor() {
        super();
        afterEveryRender(() => {
            if (!this.focused()) {
                this.autoFocus();
            }
        });
    }

    autoFocus() {
        if (isPlatformBrowser(this.platformId) && this.autofocus()) {
            setTimeout(() => {
                const focusableElements = DomHandler.getFocusableElements(this.host?.nativeElement);

                if (focusableElements.length === 0) {
                    this.host.nativeElement.focus();
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
