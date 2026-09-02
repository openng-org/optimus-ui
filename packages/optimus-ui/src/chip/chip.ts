import { CommonModule } from '@angular/common';
import { afterEveryRender, booleanAttribute, ChangeDetectionStrategy, Component, computed, contentChild, contentChildren, inject, input, NgModule, signal, TemplateRef, ViewEncapsulation, output } from '@angular/core';
import { PrimeTemplate, SharedModule, TranslationKeys } from '@openng/optimus-ui/api';
import { BaseComponent, PARENT_INSTANCE } from '@openng/optimus-ui/basecomponent';
import { Bind } from '@openng/optimus-ui/bind';
import { TimesCircleIcon } from '@openng/optimus-ui/icons';
import { ChipProps, ChipPassThrough } from '@openng/optimus-ui/types/chip';
import { ChipStyle } from './style/chipstyle';

/**
 * Chip represents people using icons, labels and images.
 * @group Components
 */
@Component({
    selector: 'p-chip',
    standalone: true,
    imports: [CommonModule, TimesCircleIcon, SharedModule, Bind],
    template: `
        <ng-content></ng-content>
        @if ($image()) {
            <img [pBind]="ptm('image')" [class]="cx('image')" [src]="$image()" (error)="imageError($event)" [alt]="$alt()" />
        } @else {
            @if ($icon()) {
                <span [pBind]="ptm('icon')" [class]="$icon()" [ngClass]="cx('icon')"></span>
            }
        }
        @if ($label()) {
            <div [pBind]="ptm('label')" [class]="cx('label')">{{ $label() }}</div>
        }
        @if ($removable()) {
            @if (!$removeIconTemplate()) {
                @if ($removeIcon()) {
                    <span
                        [pBind]="ptm('removeIcon')"
                        [class]="$removeIcon()"
                        [ngClass]="cx('removeIcon')"
                        (click)="close($event)"
                        (keydown)="onKeydown($event)"
                        [attr.tabindex]="disabled() ? -1 : 0"
                        [attr.aria-label]="removeAriaLabel"
                        role="button"
                    ></span>
                }
                @if (!$removeIcon()) {
                    <svg
                        [pBind]="ptm('removeIcon')"
                        data-p-icon="times-circle"
                        [class]="cx('removeIcon')"
                        (click)="close($event)"
                        (keydown)="onKeydown($event)"
                        [attr.tabindex]="disabled() ? -1 : 0"
                        [attr.aria-label]="removeAriaLabel"
                        role="button"
                    />
                }
            }
            @if ($removeIconTemplate()) {
                <span [pBind]="ptm('removeIcon')" [attr.tabindex]="disabled() ? -1 : 0" [class]="cx('removeIcon')" (click)="close($event)" (keydown)="onKeydown($event)" [attr.aria-label]="removeAriaLabel" role="button">
                    <ng-template *ngTemplateOutlet="$removeIconTemplate()"></ng-template>
                </span>
            }
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [ChipStyle, { provide: PARENT_INSTANCE, useExisting: Chip }],
    host: {
        '[class]': "cn(cx('root'), chipProps()?.styleClass)",
        '[style]': "sx('root')",
        '[attr.aria-label]': '$label()',
        '[attr.data-p]': 'dataP()'
    },
    hostDirectives: [Bind]
})
export class Chip extends BaseComponent<ChipPassThrough> {
    bindDirectiveInstance = inject(Bind, { self: true });

    _componentStyle = inject(ChipStyle);

    /**
     * Defines the text to display.
     * @group Props
     */
    readonly label = input<string>();

    /**
     * Defines the icon to display.
     * @group Props
     */
    readonly icon = input<string>();

    /**
     * Defines the image to display.
     * @group Props
     */
    readonly image = input<string>();

    /**
     * Alt attribute of the image.
     * @group Props
     */
    readonly alt = input<string>();

    /**
     * When present, it specifies that the element should be disabled.
     * @group Props
     */
    readonly disabled = input<boolean | undefined, unknown>(false, { transform: booleanAttribute });

    /**
     * Whether to display a remove icon.
     * @group Props
     */
    readonly removable = input<boolean | undefined, unknown>(false, { transform: booleanAttribute });

    /**
     * Icon of the remove element.
     * @group Props
     */
    readonly removeIcon = input<string>();

    /**
     * Used to pass all properties of the chipProps to the Chip component.
     * @group Props
     */
    readonly chipProps = input<ChipProps>();

    /**
     * Callback to invoke when a chip is removed.
     * @param {MouseEvent} event - Mouse event.
     * @group Emits
     */
    readonly onRemove = output<MouseEvent>();

    /**
     * This event is triggered if an error occurs while loading an image file.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    readonly onImageError = output<Event>();

    /**
     * Custom remove icon template.
     * @group Templates
     */
    readonly removeIconTemplate = contentChild<TemplateRef<void>>('removeicon', { descendants: false });

    readonly templates = contentChildren(PrimeTemplate);

    componentName = 'Chip';

    readonly visible = signal(true);

    get removeAriaLabel() {
        return this.config.getTranslation(TranslationKeys.ARIA)['removeLabel'];
    }

    // Effective values: chipProps entries override the individual inputs (replaces the former
    // setter/ngOnChanges synchronization).
    readonly $label = computed(() => this.chipProps()?.label ?? this.label());

    readonly $icon = computed(() => this.chipProps()?.icon ?? this.icon());

    readonly $image = computed(() => this.chipProps()?.image ?? this.image());

    readonly $alt = computed(() => this.chipProps()?.alt ?? this.alt());

    readonly $removable = computed(() => this.chipProps()?.removable ?? this.removable());

    readonly $removeIcon = computed(() => this.chipProps()?.removeIcon ?? this.removeIcon());

    /**
     * Effective remove icon template: the \`#removeicon\` content child, or (legacy behavior) the
     * last \`pTemplate\` regardless of type.
     */
    readonly $removeIconTemplate = computed(() => this.removeIconTemplate() ?? this.templates().at(-1)?.template);

    readonly dataP = computed(() =>
        this.cn({
            removable: this.$removable()
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

    close(event: MouseEvent) {
        this.visible.set(false);
        this.onRemove.emit(event);
    }

    onKeydown(event) {
        if (event.key === 'Enter' || event.key === 'Backspace') {
            this.close(event);
        }
    }

    imageError(event: Event) {
        this.onImageError.emit(event);
    }
}

@NgModule({
    imports: [Chip, SharedModule],
    exports: [Chip, SharedModule]
})
export class ChipModule {}
