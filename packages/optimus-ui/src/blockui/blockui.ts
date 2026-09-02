import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
    afterEveryRender,
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    contentChild,
    contentChildren,
    effect,
    ElementRef,
    inject,
    input,
    NgModule,
    numberAttribute,
    signal,
    TemplateRef,
    untracked,
    ViewEncapsulation
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
    standalone: true,
    imports: [CommonModule, SharedModule],
    template: `
        <ng-content></ng-content>
        <ng-container *ngTemplateOutlet="$contentTemplate()"></ng-container>
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
    bindDirectiveInstance = inject(Bind, { self: true });

    _componentStyle = inject(BlockUiStyle);

    /**
     * Name of the local ng-template variable referring to another component.
     * @group Props
     */
    readonly target = input<any>();

    /**
     * Whether to automatically manage layering.
     * @group Props
     */
    readonly autoZIndex = input<boolean, unknown>(true, { transform: booleanAttribute });

    /**
     * Base zIndex value to use in layering.
     * @group Props
     */
    readonly baseZIndex = input<number, unknown>(0, { transform: numberAttribute });

    /**
     * Current blocked state as a boolean.
     * @group Props
     */
    readonly blocked = input<boolean, unknown>(false, { transform: booleanAttribute });

    /**
     * template of the content
     * @group Templates
     */
    readonly contentTemplate = contentChild<TemplateRef<any>>('content', { descendants: false });

    readonly templates = contentChildren(PrimeTemplate);

    componentName = 'BlockUI';

    readonly _blocked = signal(false);

    animationEndListener: VoidFunction | null | undefined;

    /** Effective content template: the \`#content\` content child, or the last legacy \`pTemplate\`. */
    readonly $contentTemplate = computed(() => this.contentTemplate() ?? this.templates().at(-1)?.template);

    constructor() {
        super();
        // React to the `blocked` input (replaces the former setter-based @Input). The body runs
        // untracked so block()'s reads of target/autoZIndex/baseZIndex don't become dependencies.
        effect(() => {
            const blocked = this.blocked();
            untracked(() => {
                if (blocked) {
                    this.block();
                } else if (this._blocked()) {
                    this.unblock();
                }
            });
        });

        // Re-apply the host/root pass-through sections after each render (replaces the former
        // ngAfterViewChecked hook). Bind.setAttrs writes into a signal behind an equality check,
        // so unchanged PT resolutions are no-ops.
        afterEveryRender(() => {
            this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
        });
    }

    onInit() {
        // Validate the target during initialization (replaces the former ngAfterViewInit hook —
        // a synchronous throw so misconfiguration surfaces to the creating change detection pass).
        if (this.target() && !this.target().getBlockableElement) {
            throw 'Target of BlockUI must implement BlockableUI interface';
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

    block() {
        if (isPlatformBrowser(this.platformId)) {
            this._blocked.set(true);
            (this.el as ElementRef).nativeElement.style.display = 'flex';

            const target = this.target();
            if (target) {
                target.getBlockableElement().appendChild((this.el as ElementRef).nativeElement);
                target.getBlockableElement().style.position = 'relative';
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
        this.cd.markForCheck();
    }

    unbindAnimationEndListener() {
        if (this.animationEndListener && this.el) {
            this.animationEndListener();
            this.animationEndListener = null;
        }
    }
}

@NgModule({
    imports: [BlockUI, SharedModule],
    exports: [BlockUI, SharedModule]
})
export class BlockUIModule {}
