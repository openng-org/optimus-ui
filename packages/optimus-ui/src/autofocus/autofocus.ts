import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { booleanAttribute, Directive, ElementRef, inject, Input, NgModule, PLATFORM_ID } from '@angular/core';
import { BaseComponent } from '@openng/optimus-ui/basecomponent';
import { DomHandler } from '@openng/optimus-ui/dom';

/**
 * AutoFocus manages focus on focusable element on load.
 * @group Components
 */
@Directive({
    selector: '[pAutoFocus]',
    standalone: true
})
export class AutoFocus extends BaseComponent {
    /**
     * When present, it specifies that the component should automatically get focus on load.
     * @group Props
     */
    @Input({ alias: 'pAutoFocus', transform: booleanAttribute }) autofocus: boolean = false;

    focused: boolean = false;

    platformId = inject(PLATFORM_ID);

    document: Document = inject(DOCUMENT);

    host: ElementRef = inject(ElementRef);

    onAfterContentChecked() {
        // This sets the `attr.autofocus` which is different than the Input `autofocus` attribute.
        // Components bind `undefined` when their `autofocus` input is not set, so only a truthy value may add it:
        // a native `autofocus` attribute makes the browser focus (and scroll to) the element when it is inserted.
        if (this.autofocus) {
            this.host.nativeElement.setAttribute('autofocus', true);
        } else {
            this.host.nativeElement.removeAttribute('autofocus');
        }

        if (!this.focused) {
            this.autoFocus();
        }
    }

    onAfterViewChecked() {
        if (!this.focused) {
            this.autoFocus();
        }
    }

    autoFocus() {
        if (isPlatformBrowser(this.platformId) && this.autofocus) {
            setTimeout(() => {
                const focusableElements = DomHandler.getFocusableElements(this.host?.nativeElement);

                if (focusableElements.length === 0) {
                    this.host.nativeElement.focus();
                }
                if (focusableElements.length > 0) {
                    focusableElements[0].focus();
                }

                this.focused = true;
            });
        }
    }
}

@NgModule({
    imports: [AutoFocus],
    exports: [AutoFocus]
})
export class AutoFocusModule {}
