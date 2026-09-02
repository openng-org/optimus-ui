import { CommonModule, isPlatformBrowser } from '@angular/common';
import { afterEveryRender, ChangeDetectionStrategy, Component, computed, contentChild, contentChildren, inject, input, NgModule, signal, TemplateRef, ViewEncapsulation } from '@angular/core';
import { PrimeTemplate, SharedModule } from '@openng/optimus-ui/api';
import { BaseComponent, PARENT_INSTANCE } from '@openng/optimus-ui/basecomponent';
import { Bind, BindModule } from '@openng/optimus-ui/bind';
import { ImageComparePassThrough } from '@openng/optimus-ui/types/imagecompare';
import { ImageCompareStyle } from './style/imagecomparestyle';

/**
 * Compare two images side by side with a slider.
 * @group Components
 */
@Component({
    selector: 'p-imageCompare, p-imagecompare, p-image-compare',
    standalone: true,
    imports: [CommonModule, SharedModule, BindModule],
    template: `
        <ng-template *ngTemplateOutlet="$leftTemplate()"></ng-template>
        <ng-template *ngTemplateOutlet="$rightTemplate()"></ng-template>

        <input type="range" min="0" max="100" value="50" (input)="onSlide($event)" [class]="cx('slider')" [pBind]="ptm('slider')" />
    `,
    host: {
        '[class]': "cx('root')",
        '[attr.tabindex]': 'tabindex()',
        '[attr.aria-labelledby]': 'ariaLabelledby()',
        '[attr.aria-label]': 'ariaLabel()'
    },
    hostDirectives: [Bind],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [ImageCompareStyle, { provide: PARENT_INSTANCE, useExisting: ImageCompare }]
})
export class ImageCompare extends BaseComponent<ImageComparePassThrough> {
    bindDirectiveInstance = inject(Bind, { self: true });

    _componentStyle = inject(ImageCompareStyle);

    /**
     * Index of the element in tabbing order.
     * @defaultValue 0
     * @group Props
     */
    readonly tabindex = input<number>();

    /**
     * Defines a string value that labels an interactive element.
     * @group Props
     */
    readonly ariaLabelledby = input<string>();

    /**
     * Identifier of the underlying input element.
     * @group Props
     */
    readonly ariaLabel = input<string>();

    /**
     * Custom left side template.
     * @group Templates
     */
    readonly leftTemplate = contentChild<TemplateRef<void>>('left', { descendants: false });

    /**
     * Custom right side template.
     * @group Templates
     */
    readonly rightTemplate = contentChild<TemplateRef<void>>('right', { descendants: false });

    readonly templates = contentChildren(PrimeTemplate);

    componentName = 'ImageCompare';

    /** Effective left template: the \`#left\` content child, or a legacy \`pTemplate="left"\`. */
    readonly $leftTemplate = computed(() => this.leftTemplate() ?? this.templates().find((item) => item.getType() === 'left')?.template);

    /** Effective right template: the \`#right\` content child, or a legacy \`pTemplate="right"\`. */
    readonly $rightTemplate = computed(() => this.rightTemplate() ?? this.templates().find((item) => item.getType() === 'right')?.template);

    mutationObserver: MutationObserver;

    readonly isRTL = signal(false);

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
        this.updateDirection();
        this.observeDirectionChanges();
    }

    onDestroy() {
        if (this.mutationObserver) {
            this.mutationObserver.disconnect();
        }
    }

    onSlide(event) {
        const value = event.target.value;
        const image = event.target.previousElementSibling;

        if (this.isRTL()) {
            image.style.clipPath = `polygon(${100 - value}% 0, 100% 0, 100% 100%, ${100 - value}% 100%)`;
        } else {
            image.style.clipPath = `polygon(0 0, ${value}% 0, ${value}% 100%, 0 100%)`;
        }
    }

    updateDirection() {
        this.isRTL.set(!!this.el.nativeElement.closest('[dir="rtl"]'));
    }

    observeDirectionChanges() {
        if (isPlatformBrowser(this.platformId)) {
            const targetNode = document?.documentElement;
            const config = { attributes: true, attributeFilter: ['dir'] };

            this.mutationObserver = new MutationObserver(() => {
                this.updateDirection();
            });

            this.mutationObserver.observe(targetNode, config);
        }
    }
}

@NgModule({
    imports: [ImageCompare, SharedModule],
    exports: [ImageCompare, SharedModule]
})
export class ImageCompareModule {}
