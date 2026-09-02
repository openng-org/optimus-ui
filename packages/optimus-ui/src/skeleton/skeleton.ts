import { afterEveryRender, ChangeDetectionStrategy, Component, computed, inject, input, NgModule, ViewEncapsulation } from '@angular/core';
import { SharedModule } from '@openng/optimus-ui/api';
import { BaseComponent, PARENT_INSTANCE } from '@openng/optimus-ui/basecomponent';
import { Bind } from '@openng/optimus-ui/bind';
import { SkeletonPassThrough } from '@openng/optimus-ui/types/skeleton';
import { SkeletonStyle } from './style/skeletonstyle';

/**
 * Skeleton is a placeholder to display instead of the actual content.
 * @group Components
 */
@Component({
    selector: 'p-skeleton',
    standalone: true,
    imports: [SharedModule],
    template: ``,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [SkeletonStyle, { provide: PARENT_INSTANCE, useExisting: Skeleton }],
    host: {
        '[attr.aria-hidden]': 'true',
        '[class]': "cx('root')",
        '[style]': 'containerStyle()',
        '[attr.data-p]': 'dataP()'
    },
    hostDirectives: [Bind]
})
export class Skeleton extends BaseComponent<SkeletonPassThrough> {
    bindDirectiveInstance = inject(Bind, { self: true });

    _componentStyle = inject(SkeletonStyle);

    /**
     * Shape of the element.
     * @group Props
     */
    readonly shape = input<string>('rectangle');

    /**
     * Type of the animation.
     * @group Props
     */
    readonly animation = input<string>('wave');

    /**
     * Border radius of the element, defaults to value from theme.
     * @group Props
     */
    readonly borderRadius = input<string>();

    /**
     * Size of the skeleton.
     * @group Props
     */
    readonly size = input<string>();

    /**
     * Width of the element.
     * @group Props
     */
    readonly width = input<string>('100%');

    /**
     * Height of the element.
     * @group Props
     */
    readonly height = input<string>('1rem');

    componentName = 'Skeleton';

    readonly containerStyle = computed(() => {
        const inlineStyles = this._componentStyle?.inlineStyles['root'];
        let style;
        if (!this.$unstyled()) {
            const size = this.size();
            if (size) style = { ...inlineStyles, width: size, height: size, borderRadius: this.borderRadius() };
            else style = { ...inlineStyles, width: this.width(), height: this.height(), borderRadius: this.borderRadius() };
        }

        return style;
    });

    readonly dataP = computed(() =>
        this.cn({
            [this.shape()]: this.shape()
        })
    );

    constructor() {
        super();
        // Re-apply the host/root pass-through sections after each render (replaces the former
        // ngAfterViewChecked hook). Bind.setAttrs writes into a signal behind an equality check,
        // so unchanged PT resolutions are no-ops.
        afterEveryRender(() => {
            this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
        });
    }
}

@NgModule({
    imports: [Skeleton, SharedModule],
    exports: [Skeleton, SharedModule]
})
export class SkeletonModule {}
