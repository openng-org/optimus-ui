import { CommonModule } from '@angular/common';
import { afterEveryRender, ChangeDetectionStrategy, Component, computed, inject, input, NgModule, ViewEncapsulation, output } from '@angular/core';
import { SharedModule } from '@openng/optimus-ui/api';
import { BaseComponent, PARENT_INSTANCE } from '@openng/optimus-ui/basecomponent';
import { Bind } from '@openng/optimus-ui/bind';
import { AvatarPassThrough } from '@openng/optimus-ui/types/avatar';
import { AvatarStyle } from './style/avatarstyle';

/**
 * Avatar represents people using icons, labels and images.
 * @group Components
 */
@Component({
    selector: 'p-avatar',
    imports: [CommonModule, SharedModule, Bind],
    template: `
        <ng-content></ng-content>
        @if (label(); as label) {
            <span [pBind]="ptm('label')" [class]="cx('label')" [attr.data-p]="dataP()">{{ label }}</span>
        } @else {
            @if (icon(); as icon) {
                <span [pBind]="ptm('icon')" [class]="icon" [ngClass]="cx('icon')" [attr.data-p]="dataP()"></span>
            } @else {
                @if (image(); as image) {
                    <img [pBind]="ptm('image')" [src]="image" (error)="imageError($event)" [attr.aria-label]="ariaLabel()" [attr.data-p]="dataP()" />
                }
            }
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        '[class]': "cx('root')",
        '[attr.aria-label]': 'ariaLabel()',
        '[attr.aria-labelledby]': 'ariaLabelledBy()',
        '[attr.data-p]': 'dataP()'
    },
    providers: [AvatarStyle, { provide: PARENT_INSTANCE, useExisting: Avatar }],
    hostDirectives: [Bind]
})
export class Avatar extends BaseComponent<AvatarPassThrough> {
    componentName = 'Avatar';

    bindDirectiveInstance = inject(Bind, { self: true });

    constructor() {
        super();
        afterEveryRender(() => this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root'])));
    }

    /**
     * Defines the text to display.
     * @group Props
     */
    readonly label = input<string | undefined>();
    /**
     * Defines the icon to display.
     * @group Props
     */
    readonly icon = input<string | undefined>();
    /**
     * Defines the image to display.
     * @group Props
     */
    readonly image = input<string | undefined>();
    /**
     * Size of the element.
     * @group Props
     */
    readonly size = input<'normal' | 'large' | 'xlarge' | undefined>('normal');
    /**
     * Shape of the element.
     * @group Props
     */
    readonly shape = input<'square' | 'circle' | undefined>('square');
    /**
     * Establishes a string value that labels the component.
     * @group Props
     */
    readonly ariaLabel = input<string | undefined>();
    /**
     * Establishes relationships between the component and label(s) where its value should be one or more element IDs.
     * @group Props
     */
    readonly ariaLabelledBy = input<string | undefined>();
    /**
     * This event is triggered if an error occurs while loading an image file.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    readonly onImageError = output<Event>();

    _componentStyle = inject(AvatarStyle);

    imageError(event: Event) {
        this.onImageError.emit(event);
    }

    readonly dataP = computed(() => {
        return this.cn({
            [this.shape() as string]: this.shape(),
            [this.size() as string]: this.size()
        });
    });
}

@NgModule({
    imports: [Avatar, SharedModule],
    exports: [Avatar, SharedModule]
})
export class AvatarModule {}
