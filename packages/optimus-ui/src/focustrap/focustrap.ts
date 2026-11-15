import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { booleanAttribute, Directive, effect, inject, input, NgModule, PLATFORM_ID } from '@angular/core';
import { createElement, focus, getFirstFocusableElement, getLastFocusableElement } from '@openng/optimus-ui-utils';
import { BaseComponent } from '@openng/optimus-ui/basecomponent';

/**
 * Focus Trap keeps focus within a certain DOM element while tabbing.
 * @group Components
 */
@Directive({
    selector: '[pFocusTrap]'
})
export class FocusTrap extends BaseComponent {
    /**
     * When set as true, focus wouldn't be managed.
     * @group Props
     */
    readonly pFocusTrapDisabled = input(false, { transform: booleanAttribute });

    platformId = inject(PLATFORM_ID);

    document: Document = inject(DOCUMENT);

    firstHiddenFocusableElement!: HTMLElement;

    lastHiddenFocusableElement!: HTMLElement;

    constructor() {
        super();
        effect(() => {
            if (!isPlatformBrowser(this.platformId)) {
                return;
            }

            if (this.pFocusTrapDisabled()) {
                this.removeHiddenFocusableElements();
            } else {
                this.createHiddenFocusableElements();
            }
        });
    }

    removeHiddenFocusableElements() {
        if (this.firstHiddenFocusableElement && this.firstHiddenFocusableElement.parentNode) {
            this.firstHiddenFocusableElement.parentNode.removeChild(this.firstHiddenFocusableElement);
        }

        if (this.lastHiddenFocusableElement && this.lastHiddenFocusableElement.parentNode) {
            this.lastHiddenFocusableElement.parentNode.removeChild(this.lastHiddenFocusableElement);
        }
    }
    getComputedSelector(selector) {
        return `:not(.p-hidden-focusable):not([data-p-hidden-focusable="true"])${selector ?? ''}`;
    }

    createHiddenFocusableElements() {
        const tabindex = '0';

        const createFocusableElement = (onFocus) => {
            return createElement('span', {
                class: 'p-hidden-accessible p-hidden-focusable',
                tabindex,
                role: 'presentation',
                'aria-hidden': true,
                'data-p-hidden-accessible': true,
                'data-p-hidden-focusable': true,
                onFocus: onFocus?.bind(this)
            }) as HTMLElement;
        };

        this.firstHiddenFocusableElement = createFocusableElement(this.onFirstHiddenElementFocus);
        this.lastHiddenFocusableElement = createFocusableElement(this.onLastHiddenElementFocus);

        this.firstHiddenFocusableElement.setAttribute('data-pc-section', 'firstfocusableelement');
        this.lastHiddenFocusableElement.setAttribute('data-pc-section', 'lastfocusableelement');

        this.el.nativeElement.prepend(this.firstHiddenFocusableElement);
        this.el.nativeElement.append(this.lastHiddenFocusableElement);
    }

    onFirstHiddenElementFocus(event) {
        const { currentTarget, relatedTarget } = event;
        const focusableElement =
            relatedTarget === this.lastHiddenFocusableElement || !this.el.nativeElement?.contains(relatedTarget) ? getFirstFocusableElement(currentTarget.parentElement, ':not(.p-hidden-focusable)') : this.lastHiddenFocusableElement;

        focus(focusableElement as any);
    }

    onLastHiddenElementFocus(event) {
        const { currentTarget, relatedTarget } = event;
        const focusableElement =
            relatedTarget === this.firstHiddenFocusableElement || !this.el.nativeElement?.contains(relatedTarget) ? getLastFocusableElement(currentTarget.parentElement, ':not(.p-hidden-focusable)') : this.firstHiddenFocusableElement;

        focus(focusableElement as any);
    }
}

@NgModule({
    imports: [FocusTrap],
    exports: [FocusTrap]
})
export class FocusTrapModule {}
