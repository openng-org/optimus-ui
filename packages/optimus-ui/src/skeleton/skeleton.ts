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
    componentName = 'Skeleton';

    bindDirectiveInstance = inject(Bind, { self: true });

    constructor() {
        super();
        afterEveryRender(() => this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root'])));
    }

    /**
     * Shape of the element.
     * @group Props
     */
    shape = input<string>('rectangle');
    /**
     * Type of the animation.
     * @gruop Props
     */
    animation = input<string>('wave');
    /**
     * Border radius of the element, defaults to value from theme.
     * @group Props
     */
    borderRadius = input<string | undefined>();
    /**
     * Size of the skeleton.
     * @group Props
     */
    size = input<string | undefined>();
    /**
     * Width of the element.
     * @group Props
     */
    width = input<string>('100%');
    /**
     * Height of the element.
     * @group Props
     */
    height = input<string>('1rem');

    _componentStyle = inject(SkeletonStyle);

    containerStyle = computed(() => {
        const inlineStyles = this._componentStyle?.inlineStyles['root'];
        let style;
        if (!this.$unstyled()) {
            if (this.size()) style = { ...inlineStyles, width: this.size(), height: this.size(), borderRadius: this.borderRadius() };
            else style = { ...inlineStyles, width: this.width(), height: this.height(), borderRadius: this.borderRadius() };
        }

        return style;
    });

    dataP = computed(() => {
        return this.cn({
            [this.shape()]: this.shape()
        });
    });
}

@NgModule({
    imports: [Skeleton, SharedModule],
    exports: [Skeleton, SharedModule]
})
export class SkeletonModule {}
