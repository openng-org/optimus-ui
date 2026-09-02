import { CommonModule } from '@angular/common';
import {
    afterEveryRender,
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    ElementRef,
    HostListener,
    inject,
    input,
    NgModule,
    signal,
    TemplateRef,
    ViewEncapsulation,
    viewChild,
    contentChild,
    contentChildren,
    output
} from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { MotionEvent, MotionOptions } from '@openng/optimus-ui-motion';
import { appendChild, focus } from '@openng/optimus-ui-utils';
import { PrimeTemplate, SharedModule } from '@openng/optimus-ui/api';
import { BaseComponent, PARENT_INSTANCE } from '@openng/optimus-ui/basecomponent';
import { Bind, BindModule } from '@openng/optimus-ui/bind';
import { blockBodyScroll, unblockBodyScroll } from '@openng/optimus-ui/dom';
import { FocusTrap } from '@openng/optimus-ui/focustrap';
import { EyeIcon, RefreshIcon, SearchMinusIcon, SearchPlusIcon, TimesIcon, UndoIcon } from '@openng/optimus-ui/icons';
import { MotionModule } from '@openng/optimus-ui/motion';
import { Nullable } from '@openng/optimus-ui/ts-helpers';
import { ImageImageTemplateContext, ImagePassThrough, ImagePreviewTemplateContext } from '@openng/optimus-ui/types/image';
import { ZIndexUtils } from '@openng/optimus-ui/utils';
import { ImageStyle } from './style/imagestyle';

/**
 * Displays an image with preview and tranformation options. For multiple image, see Galleria.
 * @group Components
 */
@Component({
    selector: 'p-image',
    standalone: true,
    imports: [CommonModule, RefreshIcon, EyeIcon, UndoIcon, SearchMinusIcon, SearchPlusIcon, TimesIcon, FocusTrap, SharedModule, BindModule, MotionModule],
    template: `
        @if (!$imageTemplate()) {
            <img
                [attr.src]="src()"
                [attr.srcset]="srcSet()"
                [attr.sizes]="sizes()"
                [attr.alt]="alt()"
                [attr.width]="width()"
                [attr.height]="height()"
                [attr.loading]="loading()"
                [ngStyle]="imageStyle()"
                [class]="imageClass()"
                (error)="imageError($event)"
                [pBind]="ptm('image')"
            />
        }

        <ng-container *ngTemplateOutlet="$imageTemplate(); context: { errorCallback: imageError.bind(this) }"></ng-container>

        @if (preview()) {
            <button [attr.aria-label]="zoomImageAriaLabel" type="button" [class]="cx('previewMask')" (click)="onImageClick()" #previewButton [ngStyle]="{ height: height() + 'px', width: width() + 'px' }" [pBind]="ptm('previewMask')">
                @if ($indicatorTemplate()) {
                    <ng-container *ngTemplateOutlet="$indicatorTemplate()"></ng-container>
                } @else {
                    <svg data-p-icon="eye" [class]="cx('previewIcon')" [pBind]="ptm('previewIcon')" />
                }
            </button>
        }
        @if (renderMask()) {
            <div
                #mask
                [class]="cx('mask')"
                [attr.aria-modal]="maskVisible()"
                role="dialog"
                (click)="onMaskClick()"
                (keydown)="onMaskKeydown($event)"
                pFocusTrap
                [pBind]="ptm('mask')"
                [pMotion]="maskVisible()"
                [pMotionAppear]="true"
                [pMotionEnterActiveClass]="'p-overlay-mask-enter-active'"
                [pMotionLeaveActiveClass]="'p-overlay-mask-leave-active'"
                [pMotionOptions]="computedMaskMotionOptions()"
                (pMotionOnAfterLeave)="onMaskAfterLeave()"
            >
                <div [class]="cx('toolbar')" (click)="handleToolbarClick($event)" [pBind]="ptm('toolbar')">
                    <button [class]="cx('rotateRightButton')" (click)="rotateRight()" type="button" [attr.aria-label]="rightAriaLabel()" [pBind]="ptm('rotateRightButton')">
                        @if (!$rotateRightIconTemplate()) {
                            <svg data-p-icon="refresh" />
                        }
                        <ng-template *ngTemplateOutlet="$rotateRightIconTemplate()"></ng-template>
                    </button>
                    <button [class]="cx('rotateLeftButton')" (click)="rotateLeft()" type="button" [attr.aria-label]="leftAriaLabel()" [pBind]="ptm('rotateLeftButton')">
                        @if (!$rotateLeftIconTemplate()) {
                            <svg data-p-icon="undo" />
                        }
                        <ng-template *ngTemplateOutlet="$rotateLeftIconTemplate()"></ng-template>
                    </button>
                    <button [class]="cx('zoomOutButton')" (click)="zoomOut()" type="button" [disabled]="isZoomOutDisabled()" [attr.aria-label]="zoomOutAriaLabel()" [pBind]="ptm('zoomOutButton')">
                        @if (!$zoomOutIconTemplate()) {
                            <svg data-p-icon="search-minus" />
                        }
                        <ng-template *ngTemplateOutlet="$zoomOutIconTemplate()"></ng-template>
                    </button>
                    <button [class]="cx('zoomInButton')" (click)="zoomIn()" type="button" [disabled]="isZoomInDisabled()" [attr.aria-label]="zoomInAriaLabel()" [pBind]="ptm('zoomInButton')">
                        @if (!$zoomInIconTemplate()) {
                            <svg data-p-icon="search-plus" />
                        }
                        <ng-template *ngTemplateOutlet="$zoomInIconTemplate()"></ng-template>
                    </button>
                    <button [class]="cx('closeButton')" type="button" (click)="closePreview()" [attr.aria-label]="closeAriaLabel()" #closeButton [pBind]="ptm('closeButton')">
                        @if (!$closeIconTemplate()) {
                            <svg data-p-icon="times" />
                        }
                        <ng-template *ngTemplateOutlet="$closeIconTemplate()"></ng-template>
                    </button>
                </div>
                @if (renderPreview()) {
                    <p-motion
                        [visible]="previewVisible()"
                        name="p-image-original"
                        [appear]="true"
                        [options]="computedMotionOptions()"
                        (onBeforeEnter)="onAnimationStart($event)"
                        (onBeforeLeave)="onBeforeLeave()"
                        (onAfterLeave)="onAnimationEnd($event)"
                    >
                        @if (!$previewTemplate()) {
                            <img
                                [attr.src]="previewImageSrc() ? previewImageSrc() : src()"
                                [attr.srcset]="previewImageSrcSet()"
                                [attr.sizes]="previewImageSizes()"
                                [class]="cx('original')"
                                [ngStyle]="imagePreviewStyle()"
                                (click)="onPreviewImageClick()"
                                [pBind]="ptm('original')"
                            />
                        }
                        <ng-container
                            *ngTemplateOutlet="
                                $previewTemplate();
                                context: {
                                    class: cx('original'),
                                    style: imagePreviewStyle(),
                                    previewCallback: onPreviewImageClick.bind(this)
                                }
                            "
                        >
                        </ng-container>
                    </p-motion>
                }
            </div>
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [ImageStyle, { provide: PARENT_INSTANCE, useExisting: Image }],
    host: {
        '[class]': "cx('root')"
    },
    hostDirectives: [Bind]
})
export class Image extends BaseComponent<ImagePassThrough> {
    bindDirectiveInstance = inject(Bind, { self: true });

    _componentStyle = inject(ImageStyle);

    /**
     * Style class of the image element.
     * @group Props
     */
    readonly imageClass = input<string>();

    /**
     * Inline style of the image element.
     * @group Props
     */
    readonly imageStyle = input<{ [klass: string]: any } | null>();

    /**
     * The source path for the main image.
     * @group Props
     */
    readonly src = input<string | SafeUrl>();

    /**
     * The srcset definition for the main image.
     * @group Props
     */
    readonly srcSet = input<string | SafeUrl>();

    /**
     * The sizes definition for the main image.
     * @group Props
     */
    readonly sizes = input<string>();

    /**
     * The source path for the preview image.
     * @group Props
     */
    readonly previewImageSrc = input<string | SafeUrl>();

    /**
     * The srcset definition for the preview image.
     * @group Props
     */
    readonly previewImageSrcSet = input<string | SafeUrl>();

    /**
     * The sizes definition for the preview image.
     * @group Props
     */
    readonly previewImageSizes = input<string>();

    /**
     * Attribute of the preview image element.
     * @group Props
     */
    readonly alt = input<string>();

    /**
     * Attribute of the image element.
     * @group Props
     */
    readonly width = input<string>();

    /**
     * Attribute of the image element.
     * @group Props
     */
    readonly height = input<string>();

    /**
     * Attribute of the image element.
     * @group Props
     */
    readonly loading = input<'lazy' | 'eager'>();

    /**
     * Controls the preview functionality.
     * @group Props
     */
    readonly preview = input<boolean, unknown>(false, { transform: booleanAttribute });

    /**
     * Transition options of the show animation
     * @group Props
     * @deprecated since v21.0.0. Use `motionOptions` instead.
     */
    readonly showTransitionOptions = input<string>('150ms cubic-bezier(0, 0, 0.2, 1)');

    /**
     * Transition options of the hide animation
     * @group Props
     * @deprecated since v21.0.0. Use `motionOptions` instead.
     */
    readonly hideTransitionOptions = input<string>('150ms cubic-bezier(0, 0, 0.2, 1)');

    /**
     * Enter animation class name of modal.
     * @defaultValue 'p-modal-enter'
     * @group Props
     */
    modalEnterAnimation = input<string | null | undefined>('p-modal-enter');

    /**
     * Leave animation class name of modal.
     * @defaultValue 'p-modal-leave'
     * @group Props
     */
    modalLeaveAnimation = input<string | null | undefined>('p-modal-leave');

    /**
     * Target element to attach the overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name).
     * @defaultValue 'self'
     * @group Props
     */
    appendTo = input<HTMLElement | ElementRef | TemplateRef<any> | 'self' | 'body' | null | undefined | any>(undefined);

    /**
     * The motion options for the mask.
     * @group Props
     */
    maskMotionOptions = input<MotionOptions | undefined>(undefined);

    /**
     * The motion options.
     * @group Props
     */
    motionOptions = input<MotionOptions | undefined>(undefined);

    /**
     * Triggered when the preview overlay is shown.
     * @group Emits
     */
    readonly onShow = output<any>();

    /**
     * Triggered when the preview overlay is hidden.
     * @group Emits
     */
    readonly onHide = output<any>();

    /**
     * This event is triggered if an error occurs while loading an image file.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    readonly onImageError = output<Event>();

    readonly previewButton = viewChild<ElementRef>('previewButton');

    readonly closeButton = viewChild<ElementRef>('closeButton');

    /**
     * Custom indicator template.
     * @group Templates
     */
    readonly indicatorTemplate = contentChild<TemplateRef<void>>('indicator', { descendants: false });

    /**
     * Custom rotate right icon template.
     * @group Templates
     */
    readonly rotateRightIconTemplate = contentChild<TemplateRef<void>>('rotaterighticon', { descendants: false });

    /**
     * Custom rotate left icon template.
     * @group Templates
     */
    readonly rotateLeftIconTemplate = contentChild<TemplateRef<void>>('rotatelefticon', { descendants: false });

    /**
     * Custom zoom out icon template.
     * @group Templates
     */
    readonly zoomOutIconTemplate = contentChild<TemplateRef<void>>('zoomouticon', { descendants: false });

    /**
     * Custom zoom in icon template.
     * @group Templates
     */
    readonly zoomInIconTemplate = contentChild<TemplateRef<void>>('zoominicon', { descendants: false });

    /**
     * Custom close icon template.
     * @group Templates
     */
    readonly closeIconTemplate = contentChild<TemplateRef<void>>('closeicon', { descendants: false });

    /**
     * Custom preview template.
     * @group Templates
     */
    readonly previewTemplate = contentChild<TemplateRef<ImagePreviewTemplateContext>>('preview', { descendants: false });

    /**
     * Custom image template.
     * @group Templates
     */
    readonly imageTemplate = contentChild<TemplateRef<ImageImageTemplateContext>>('image', { descendants: false });

    readonly templates = contentChildren(PrimeTemplate);

    componentName = 'Image';

    computedMaskMotionOptions = computed<MotionOptions>(() => {
        return {
            ...this.ptm('maskMotion'),
            ...this.maskMotionOptions()
        };
    });

    computedMotionOptions = computed<MotionOptions>(() => {
        return {
            ...this.ptm('motion'),
            ...this.motionOptions()
        };
    });

    renderMask = signal<boolean>(false);

    renderPreview = signal<boolean>(false);

    readonly maskVisible = signal<boolean>(false);

    readonly previewVisible = signal<boolean>(false);

    readonly rotate = signal<number>(0);

    readonly scale = signal<number>(1);

    previewClick: boolean = false;

    container: Nullable<HTMLElement>;

    wrapper: Nullable<HTMLElement>;

    $appendTo = computed(() => this.appendTo() || this.config.overlayAppendTo());

    /** Whether zooming out any further would drop below the minimum scale. */
    readonly isZoomOutDisabled = computed<boolean>(() => this.scale() - this.zoomSettings.step <= this.zoomSettings.min);

    /** Whether zooming in any further would exceed the maximum scale. */
    readonly isZoomInDisabled = computed<boolean>(() => this.scale() + this.zoomSettings.step >= this.zoomSettings.max);

    private zoomSettings = {
        default: 1,
        step: 0.1,
        max: 1.5,
        min: 0.5
    };

    private static readonly KNOWN_TEMPLATE_TYPES = ['indicator', 'rotaterighticon', 'rotatelefticon', 'zoomouticon', 'zoominicon', 'closeicon', 'image', 'preview'];

    /**
     * Effective indicator template: the `#indicator` content child, a legacy
     * `pTemplate="indicator"`, or (legacy behavior) the last `pTemplate` with an unrecognized type.
     */
    readonly $indicatorTemplate = computed(() => {
        const indicatorTemplate = this.indicatorTemplate();
        if (indicatorTemplate) {
            return indicatorTemplate;
        }
        return [...this.templates()].reverse().find((item) => item.getType() === 'indicator' || !Image.KNOWN_TEMPLATE_TYPES.includes(item.getType()))?.template;
    });

    /** Effective rotate right icon template: the `#rotaterighticon` content child, or a legacy `pTemplate="rotaterighticon"`. */
    readonly $rotateRightIconTemplate = computed(() => this.rotateRightIconTemplate() ?? this.templates().find((item) => item.getType() === 'rotaterighticon')?.template);

    /** Effective rotate left icon template: the `#rotatelefticon` content child, or a legacy `pTemplate="rotatelefticon"`. */
    readonly $rotateLeftIconTemplate = computed(() => this.rotateLeftIconTemplate() ?? this.templates().find((item) => item.getType() === 'rotatelefticon')?.template);

    /** Effective zoom out icon template: the `#zoomouticon` content child, or a legacy `pTemplate="zoomouticon"`. */
    readonly $zoomOutIconTemplate = computed(() => this.zoomOutIconTemplate() ?? this.templates().find((item) => item.getType() === 'zoomouticon')?.template);

    /** Effective zoom in icon template: the `#zoominicon` content child, or a legacy `pTemplate="zoominicon"`. */
    readonly $zoomInIconTemplate = computed(() => this.zoomInIconTemplate() ?? this.templates().find((item) => item.getType() === 'zoominicon')?.template);

    /** Effective close icon template: the `#closeicon` content child, or a legacy `pTemplate="closeicon"`. */
    readonly $closeIconTemplate = computed(() => this.closeIconTemplate() ?? this.templates().find((item) => item.getType() === 'closeicon')?.template);

    /** Effective image template: the `#image` content child, or a legacy `pTemplate="image"`. */
    readonly $imageTemplate = computed(() => this.imageTemplate() ?? (this.templates().find((item) => item.getType() === 'image')?.template as TemplateRef<ImageImageTemplateContext> | undefined));

    /** Effective preview template: the `#preview` content child, or a legacy `pTemplate="preview"`. */
    readonly $previewTemplate = computed(() => this.previewTemplate() ?? (this.templates().find((item) => item.getType() === 'preview')?.template as TemplateRef<ImagePreviewTemplateContext> | undefined));

    /** Inline transform style of the preview image, derived from the rotation and scale. */
    readonly imagePreviewStyle = computed(() => ({ transform: 'rotate(' + this.rotate() + 'deg) scale(' + this.scale() + ')' }));

    get zoomImageAriaLabel() {
        return this.config.translation.aria ? this.config.translation.aria.zoomImage : undefined;
    }

    constructor() {
        super();
        // Re-apply the host/root pass-through sections after each render (replaces the former
        // ngAfterViewChecked hook). Bind.setAttrs writes into a signal behind an equality check,
        // so unchanged PT resolutions are no-ops.
        afterEveryRender(() => {
            this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
        });
    }

    onImageClick() {
        if (this.preview()) {
            this.maskVisible.set(true);
            this.previewVisible.set(true);
            this.renderMask.set(true);
            this.renderPreview.set(true);
            blockBodyScroll();
        }
    }

    onMaskClick() {
        if (!this.previewClick) {
            this.closePreview();
        }

        this.previewClick = false;
    }

    onMaskKeydown(event: KeyboardEvent) {
        switch (event.code) {
            case 'Escape':
                this.onMaskClick();
                setTimeout(() => {
                    focus(this.previewButton()?.nativeElement);
                }, 25);
                event.preventDefault();

                break;

            default:
                break;
        }
    }

    onPreviewImageClick() {
        this.previewClick = true;
    }

    rotateRight() {
        this.rotate.update((rotate) => rotate + 90);
        this.previewClick = true;
    }

    rotateLeft() {
        this.rotate.update((rotate) => rotate - 90);
        this.previewClick = true;
    }

    zoomIn() {
        this.scale.update((scale) => scale + this.zoomSettings.step);
        this.previewClick = true;
    }

    zoomOut() {
        this.scale.update((scale) => scale - this.zoomSettings.step);
        this.previewClick = true;
    }

    onAnimationStart(event: MotionEvent) {
        this.container = event.element as HTMLDivElement;
        this.wrapper = this.container?.parentElement;
        this.$attrSelector && this.wrapper?.setAttribute(this.$attrSelector, '');
        this.appendContainer();
        this.moveOnTop();
        this.onShow.emit({});
        setTimeout(() => {
            focus(this.closeButton()?.nativeElement);
        }, 25);
    }

    onBeforeLeave() {
        this.maskVisible.set(false);
    }

    onAnimationEnd() {
        this.renderPreview.set(false);
    }

    onMaskAfterLeave() {
        if (!this.renderPreview()) {
            this.renderMask.set(false);
        }
        ZIndexUtils.clear(this.wrapper);
        this.container = null;
        this.wrapper = null;
        this.rotate.set(0);
        this.scale.set(this.zoomSettings.default);
        unblockBodyScroll();
        this.onHide.emit({});
        this.cd.markForCheck();
    }

    moveOnTop() {
        ZIndexUtils.set('modal', this.wrapper, this.config.zIndex.modal);
    }

    appendContainer() {
        if (this.$appendTo() && this.$appendTo() !== 'self') {
            if (this.$appendTo() === 'body' && this.wrapper) {
                this.document.body.appendChild(this.wrapper as HTMLElement);
            } else if (this.wrapper) {
                appendChild(this.$appendTo(), this.wrapper);
            }
        }
    }

    handleToolbarClick(event: MouseEvent): void {
        event.stopPropagation();
    }

    closePreview(): void {
        this.previewVisible.set(false);
    }

    imageError(event: Event) {
        this.onImageError.emit(event);
    }

    rightAriaLabel() {
        return this.config.translation.aria ? this.config.translation.aria.rotateRight : undefined;
    }

    leftAriaLabel() {
        return this.config.translation.aria ? this.config.translation.aria.rotateLeft : undefined;
    }

    zoomInAriaLabel() {
        return this.config.translation.aria ? this.config.translation.aria.zoomIn : undefined;
    }

    zoomOutAriaLabel() {
        return this.config.translation.aria ? this.config.translation.aria.zoomOut : undefined;
    }

    closeAriaLabel() {
        return this.config.translation.aria ? this.config.translation.aria.close : undefined;
    }

    @HostListener('document:keydown.escape') onKeydownHandler() {
        if (this.previewVisible()) {
            this.closePreview();
        }
    }
}

@NgModule({
    imports: [Image, SharedModule],
    exports: [Image, SharedModule]
})
export class ImageModule {}
