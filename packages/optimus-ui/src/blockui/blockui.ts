import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
    afterEveryRender,
    afterNextRender,
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    effect,
    ElementRef,
    inject,
    input,
    NgModule,
    numberAttribute,
    signal,
    TemplateRef,
    ViewEncapsulation,
    contentChild,
    contentChildren
} from '@angular/core';
import { blockBodyScroll, unblockBodyScroll } from '@openng/optimus-ui-utils';
import { PrimeTemplate, SharedModule } from '@openng/optimus-ui/api';
import { BaseComponent, PARENT_INSTANCE } from '@openng/optimus-ui/basecomponent';
import { Bind } from '@openng/optimus-ui/bind';
import { BlockUIPassThrough } from '@openng/optimus-ui/types/blockui';
import { ZIndexUtils } from '@openng/optimus-ui/utils';
import { BlockUiStyle } from './style/blockuistyle';

/**
 * BlockUI can either block other components or the whole page.
 * @group Components
 */
@Component({
    selector: 'p-blockUI, p-blockui, p-block-ui',
    imports: [CommonModule, SharedModule],
    template: `
        <ng-content></ng-content>
        <ng-container *ngTemplateOutlet="contentTemplate() || _contentTemplate"></ng-container>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [BlockUiStyle, { provide: PARENT_INSTANCE, useExisting: BlockUI }],
    host: {
        '[attr.aria-busy]': '_blocked()',
        '[class]': "cx('root')"
    },
    hostDirectives: [Bind]
})
export class BlockUI extends BaseComponent<BlockUIPassThrough> {
    componentName = 'BlockUI';

    bindDirectiveInstance = inject(Bind, { self: true });

    /**
     * Name of the local ng-template variable referring to another component.
     * @group Props
     */
    readonly target = input<any>();
    /**
     * Whether to automatically manage layering.
     * @group Props
     */
    readonly autoZIndex = input(true, { transform: booleanAttribute });
    /**
     * Base zIndex value to use in layering.
     * @group Props
     */
    readonly baseZIndex = input(0, { transform: numberAttribute });
    /**
     * Current blocked state as a boolean.
     * @group Props
     */
    readonly blocked = input(false, { transform: booleanAttribute });
    /**
     * template of the content
     * @group Templates
     */
    readonly contentTemplate = contentChild<TemplateRef<any>>('content', { descendants: false });

    _blocked = signal(false);

    animationEndListener: VoidFunction | null | undefined;

    _componentStyle = inject(BlockUiStyle);

    constructor() {
        super();

        effect(() => {
            if (this.blocked()) {
                this.block();
            } else if (this._blocked()) {
                this.unblock();
            }
        });

        afterNextRender(() => {
            if (this._blocked()) this.block();

            if (this.target() && !this.target().getBlockableElement) {
                throw 'Target of BlockUI must implement BlockableUI interface';
            }
        });

        afterEveryRender(() => {
            this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
        });
    }

    _contentTemplate: TemplateRef<any> | undefined;

    readonly templates = contentChildren(PrimeTemplate);

    onAfterContentInit() {
        this.templates().forEach((item) => {
            switch (item.getType()) {
                case 'content':
                    this._contentTemplate = item.template;
                    break;

                default:
                    this._contentTemplate = item.template;
                    break;
            }
        });
    }

    block() {
        if (isPlatformBrowser(this.platformId)) {
            this._blocked.set(true);
            (this.el as ElementRef).nativeElement.style.display = 'flex';

            if (this.target()) {
                this.target()
                    .getBlockableElement()
                    .appendChild((this.el as ElementRef).nativeElement);
                this.target().getBlockableElement().style.position = 'relative';
            } else {
                this.renderer.appendChild(this.document.body, (this.el as ElementRef).nativeElement);
                //@ts-ignore
                blockBodyScroll();
            }

            if (this.autoZIndex()) {
                ZIndexUtils.set('modal', (this.el as ElementRef).nativeElement, this.baseZIndex() + this.config.zIndex.modal);
            }

            this.renderer.addClass(this.el.nativeElement, 'p-overlay-mask');
            this.renderer.addClass(this.el.nativeElement, 'p-overlay-mask-enter-active');
        }
    }

    unblock() {
        if (isPlatformBrowser(this.platformId) && this.el && this._blocked()) {
            this._blocked.set(false);
            if (!this.animationEndListener) {
                this.animationEndListener = this.renderer.listen(this.el.nativeElement, 'animationend', this.destroyModal.bind(this));
            }
            this.renderer.removeClass(this.el.nativeElement, 'p-overlay-mask-enter-active');
            this.renderer.addClass(this.el.nativeElement, 'p-overlay-mask-leave-active');
        }
    }

    destroyModal() {
        this._blocked.set(false);
        if (this.el && isPlatformBrowser(this.platformId)) {
            this.el.nativeElement.style.display = 'none';
            this.renderer.removeClass(this.el.nativeElement, 'p-overlay-mask');
            this.renderer.removeClass(this.el.nativeElement, 'p-overlay-mask-leave-active');
            ZIndexUtils.clear(this.el.nativeElement);

            if (!this.target()) {
                this.document.body.removeChild(this.el.nativeElement);
                //@ts-ignore
                unblockBodyScroll();
            }
        }
        this.unbindAnimationEndListener();
    }

    unbindAnimationEndListener() {
        if (this.animationEndListener && this.el) {
            this.animationEndListener();
            this.animationEndListener = null;
        }
    }

    onDestroy() {
        if (this._blocked()) {
            // Skip animation on destroy, just cleanup
            this._blocked.set(false);
            if (this.el && isPlatformBrowser(this.platformId)) {
                ZIndexUtils.clear(this.el.nativeElement);
                if (!this.target()) {
                    //@ts-ignore
                    unblockBodyScroll();
                }
            }
            this.unbindAnimationEndListener();
        }
    }
}

@NgModule({
    imports: [BlockUI, SharedModule],
    exports: [BlockUI, SharedModule]
})
export class BlockUIModule {}
