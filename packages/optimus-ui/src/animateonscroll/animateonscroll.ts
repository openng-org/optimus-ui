import { isPlatformBrowser } from '@angular/common';
import { afterNextRender, booleanAttribute, computed, Directive, input, NgModule, numberAttribute } from '@angular/core';
import { addClass, removeClass } from '@openng/optimus-ui-utils';
import { BaseComponent } from '@openng/optimus-ui/basecomponent';

interface AnimateOnScrollOptions {
    root?: HTMLElement | null;
    rootMargin?: string;
    threshold?: number;
}

/**
 * AnimateOnScroll is used to apply animations to elements when entering or leaving the viewport during scrolling.
 * @group Components
 */
@Directive({
    selector: '[pAnimateOnScroll]',
    standalone: true,
    host: {
        '[class.p-animateonscroll]': 'true'
    }
})
export class AnimateOnScroll extends BaseComponent {
    /**
     * Selector to define the CSS class for enter animation.
     * @group Props
     */
    readonly enterClass = input<string>();

    /**
     * Selector to define the CSS class for leave animation.
     * @group Props
     */
    readonly leaveClass = input<string>();

    /**
     * Specifies the root option of the IntersectionObserver API.
     * @group Props
     */
    readonly root = input<HTMLElement | null>();

    /**
     * Specifies the rootMargin option of the IntersectionObserver API.
     * @group Props
     */
    readonly rootMargin = input<string>();

    /**
     * Specifies the threshold option of the IntersectionObserver API
     * @group Props
     */
    readonly threshold = input<number | undefined, unknown>(0.5, { transform: numberAttribute });

    /**
     * Whether the scroll event listener should be removed after initial run.
     * @group Props
     */
    readonly once = input<boolean, unknown>(false, { transform: booleanAttribute });

    observer: IntersectionObserver | undefined;

    resetObserver: any;

    isObserverActive: boolean = false;

    animationState: any;

    animationEndListener: VoidFunction | null | undefined;

    readonly options = computed<AnimateOnScrollOptions>(() => ({
        root: this.root(),
        rootMargin: this.rootMargin(),
        threshold: this.threshold() || 0.5
    }));

    constructor() {
        super();
        // Bind the intersection observers once the element is rendered (replaces the former
        // ngAfterViewInit hook; afterNextRender only runs in the browser).
        afterNextRender(() => {
            this.bindIntersectionObserver();
        });
    }

    onInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.renderer.setStyle(this.el.nativeElement, 'opacity', this.enterClass() ? '0' : '');
        }
    }

    onDestroy() {
        this.unbindAnimationEvents();
        this.unbindIntersectionObserver();
    }

    bindIntersectionObserver() {
        this.observer = new IntersectionObserver(([entry]) => {
            if (this.isObserverActive) {
                if (entry.boundingClientRect.top > 0) {
                    entry.isIntersecting ? this.enter() : this.leave();
                }
            } else if (entry.isIntersecting) {
                this.enter();
            }

            this.isObserverActive = true;
        }, this.options());

        setTimeout(() => this.observer?.observe(this.el.nativeElement), 0);

        // Reset

        this.resetObserver = new IntersectionObserver(
            ([entry]) => {
                if (entry.boundingClientRect.top > 0 && !entry.isIntersecting) {
                    this.el.nativeElement.style.opacity = this.enterClass() ? '0' : '';
                    removeClass(this.el.nativeElement, [this.enterClass(), this.leaveClass()]);

                    this.resetObserver.unobserve(this.el.nativeElement);
                }

                this.animationState = undefined;
            },
            { ...this.options(), threshold: 0 }
        );
    }

    enter() {
        if (this.animationState !== 'enter' && this.enterClass()) {
            this.el.nativeElement.style.opacity = '';
            removeClass(this.el.nativeElement, this.leaveClass());
            addClass(this.el.nativeElement, this.enterClass());

            this.once() && this.unbindIntersectionObserver();

            this.bindAnimationEvents();
            this.animationState = 'enter';
        }
    }

    leave() {
        if (this.animationState !== 'leave' && this.leaveClass()) {
            this.el.nativeElement.style.opacity = this.enterClass() ? '0' : '';
            removeClass(this.el.nativeElement, this.enterClass());
            addClass(this.el.nativeElement, this.leaveClass());

            this.bindAnimationEvents();
            this.animationState = 'leave';
        }
    }

    bindAnimationEvents() {
        if (!this.animationEndListener) {
            this.animationEndListener = this.renderer.listen(this.el.nativeElement, 'animationend', () => {
                removeClass(this.el.nativeElement, [this.enterClass(), this.leaveClass()]);
                !this.once() && this.resetObserver.observe(this.el.nativeElement);
                this.unbindAnimationEvents();
            });
        }
    }

    unbindAnimationEvents() {
        if (this.animationEndListener) {
            this.animationEndListener();
            this.animationEndListener = null;
        }
    }

    unbindIntersectionObserver() {
        this.observer?.unobserve(this.el.nativeElement);
        this.resetObserver?.unobserve(this.el.nativeElement);
        this.isObserverActive = false;
    }
}

@NgModule({
    imports: [AnimateOnScroll],
    exports: [AnimateOnScroll]
})
export class AnimateOnScrollModule {}
