import { CommonModule, isPlatformBrowser } from '@angular/common';
import { afterEveryRender, ChangeDetectionStrategy, Component, computed, contentChild, contentChildren, inject, input, NgModule, numberAttribute, signal, TemplateRef, ViewEncapsulation } from '@angular/core';
import { MotionEvent, MotionOptions } from '@openng/optimus-ui-motion';
import { getWindowScrollTop } from '@openng/optimus-ui-utils';
import { PrimeTemplate, SharedModule } from '@openng/optimus-ui/api';
import { BaseComponent, PARENT_INSTANCE } from '@openng/optimus-ui/basecomponent';
import { Bind } from '@openng/optimus-ui/bind';
import { Button, ButtonProps } from '@openng/optimus-ui/button';
import { ChevronUpIcon } from '@openng/optimus-ui/icons';
import { MotionDirective } from '@openng/optimus-ui/motion';
import { ScrollTopIconTemplateContext, ScrollTopPassThrough } from '@openng/optimus-ui/types/scrolltop';
import { ZIndexUtils } from '@openng/optimus-ui/utils';
import { ScrollTopStyle } from './style/scrolltopstyle';

/**
 * ScrollTop gets displayed after a certain scroll position and used to navigates to the top of the page quickly.
 * @group Components
 */
@Component({
    selector: 'p-scrollTop, p-scrolltop, p-scroll-top',
    standalone: true,
    imports: [CommonModule, ChevronUpIcon, Button, SharedModule, MotionDirective],
    template: `
        @if (render()) {
            <p-button
                [pMotion]="visible()"
                [pMotionAppear]="true"
                [pMotionName]="'p-scrolltop'"
                [pMotionOptions]="computedMotionOptions()"
                (pMotionOnBeforeEnter)="onBeforeEnter($event)"
                (pMotionOnBeforeLeave)="onBeforeLeave()"
                (pMotionOnAfterLeave)="onAfterLeave()"
                [attr.aria-label]="buttonAriaLabel()"
                (click)="onClick()"
                [pt]="ptm('pcButton')"
                [styleClass]="cn(cx('root'), styleClass())"
                [ngStyle]="style()"
                type="button"
                [buttonProps]="buttonProps()"
                [unstyled]="unstyled()"
            >
                <ng-template #icon>
                    @if (!$iconTemplate()) {
                        @if (this.icon()) {
                            <span [class]="cn(cx('icon'), this.icon())"></span>
                        }
                        @if (!this.icon()) {
                            <svg data-p-icon="chevron-up" [class]="cx('icon')" />
                        }
                    } @else {
                        <ng-template *ngTemplateOutlet="$iconTemplate(); context: { styleClass: cx('icon') }"></ng-template>
                    }
                </ng-template>
            </p-button>
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [ScrollTopStyle, { provide: PARENT_INSTANCE, useExisting: ScrollTop }],
    hostDirectives: [Bind]
})
export class ScrollTop extends BaseComponent<ScrollTopPassThrough> {
    bindDirectiveInstance = inject(Bind, { self: true });

    _componentStyle = inject(ScrollTopStyle);

    /**
     * Class of the element (forwarded to the inner button).
     * @group Props
     */
    readonly styleClass = input<string>();

    /**
     * Inline style of the element.
     * @group Props
     */
    readonly style = input<{ [klass: string]: any } | null>();

    /**
     * Target of the ScrollTop.
     * @group Props
     */
    readonly target = input<'window' | 'parent' | undefined>('window');

    /**
     * Defines the threshold value of the vertical scroll position of the target to toggle the visibility.
     * @group Props
     */
    readonly threshold = input<number, unknown>(400, { transform: numberAttribute });

    /**
     * Name of the icon or JSX.Element for icon.
     * @group Props
     */
    readonly icon = input<string>();

    /**
     * Defines the scrolling behavior, "smooth" adds an animation and "auto" scrolls with a jump.
     * @group Props
     */
    readonly behavior = input<'auto' | 'smooth' | undefined>('smooth');

    /**
     * A string value used to determine the display transition options.
     * @group Props
     * @deprecated since v21.0.0. Use `motionOptions` instead.
     */
    readonly showTransitionOptions = input<string>('.15s');

    /**
     * A string value used to determine the hiding transition options.
     * @group Props
     * @deprecated since v21.0.0. Use `motionOptions` instead.
     */
    readonly hideTransitionOptions = input<string>('.15s');

    /**
     * The motion options.
     * @group Props
     */
    motionOptions = input<MotionOptions | undefined>(undefined);

    /**
     * Establishes a string value that labels the scroll-top button.
     * @group Props
     */
    readonly buttonAriaLabel = input<string>();

    /**
     * Used to pass all properties of the ButtonProps to the Button component.
     * @group Props
     */
    readonly buttonProps = input<ButtonProps>({ rounded: true });

    /**
     * Custom icon template.
     * @param {ScrollTopIconTemplateContext} context - icon context.
     * @see {@link ScrollTopIconTemplateContext}
     * @group Templates
     */
    readonly iconTemplate = contentChild<TemplateRef<ScrollTopIconTemplateContext>>('icon', { descendants: false });

    readonly templates = contentChildren(PrimeTemplate);

    componentName = 'ScrollTop';

    computedMotionOptions = computed<MotionOptions>(() => {
        return {
            ...this.ptm('motion'),
            ...this.motionOptions()
        };
    });

    /** Effective icon template: the \`#icon\` content child, or a legacy \`pTemplate="icon"\`. */
    readonly $iconTemplate = computed(() => this.iconTemplate() ?? (this.templates().find((item) => item.getType() === 'icon')?.template as TemplateRef<ScrollTopIconTemplateContext> | undefined));

    documentScrollListener: VoidFunction | null | undefined;

    parentScrollListener: VoidFunction | null | undefined;

    visible = signal<boolean>(false);

    render = signal<boolean>(false);

    overlay: any;

    constructor() {
        super();
        // Re-apply the host/root pass-through sections after each render (replaces the former
        // ngAfterViewChecked hook). Bind.setAttrs writes into a signal behind an equality check,
        // so unchanged PT resolutions are no-ops.
        afterEveryRender(() => {
            this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
        });
    }

    onInit() {
        if (this.target() === 'window') this.bindDocumentScrollListener();
        else if (this.target() === 'parent') this.bindParentScrollListener();
    }

    onDestroy() {
        if (this.target() === 'window') this.unbindDocumentScrollListener();
        else if (this.target() === 'parent') this.unbindParentScrollListener();

        if (this.overlay) {
            ZIndexUtils.clear(this.overlay);
            this.overlay = null;
        }
    }

    onClick() {
        let scrollElement = this.target() === 'window' ? this.document.defaultView : this.el.nativeElement.parentElement;
        scrollElement.scroll({
            top: 0,
            behavior: this.behavior()
        });
    }

    onBeforeEnter(event: MotionEvent) {
        this.overlay = event.element as HTMLElement;
        this.overlay.style.position = this.target() === 'parent' ? 'sticky' : 'fixed';
        ZIndexUtils.set('overlay', this.overlay, this.config.zIndex.overlay);
    }

    onBeforeLeave() {
        ZIndexUtils.clear(this.overlay);
        this.overlay = null;
    }

    onAfterLeave() {
        this.render.set(false);
    }

    checkVisibility(scrollY: number) {
        if (scrollY > this.threshold()) {
            this.visible.set(true);
            if (!this.render()) {
                this.render.set(true);
            }
        } else {
            this.visible.set(false);
        }
    }

    bindParentScrollListener() {
        if (isPlatformBrowser(this.platformId)) {
            this.parentScrollListener = this.renderer.listen(this.el.nativeElement.parentElement, 'scroll', () => {
                this.checkVisibility(this.el.nativeElement.parentElement.scrollTop);
            });
        }
    }

    bindDocumentScrollListener() {
        if (isPlatformBrowser(this.platformId)) {
            this.documentScrollListener = this.renderer.listen(this.document.defaultView, 'scroll', () => {
                this.checkVisibility(getWindowScrollTop());
            });
        }
    }

    unbindParentScrollListener() {
        if (this.parentScrollListener) {
            this.parentScrollListener();
            this.parentScrollListener = null;
        }
    }

    unbindDocumentScrollListener() {
        if (this.documentScrollListener) {
            this.documentScrollListener();
            this.documentScrollListener = null;
        }
    }
}

@NgModule({
    imports: [ScrollTop, SharedModule],
    exports: [ScrollTop, SharedModule]
})
export class ScrollTopModule {}
