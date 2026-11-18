import { CommonModule } from '@angular/common';
import { afterEveryRender, booleanAttribute, ChangeDetectionStrategy, Component, computed, inject, input, NgModule, signal, TemplateRef, ViewEncapsulation, contentChild, contentChildren, output } from '@angular/core';
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
    imports: [CommonModule, TimesCircleIcon, SharedModule, Bind],
    template: `
        <ng-content></ng-content>
        @if (_image()) {
            <img [pBind]="ptm('image')" [class]="cx('image')" [src]="_image()" (error)="imageError($event)" [alt]="_alt()" />
        } @else {
            @if (_icon()) {
                <span [pBind]="ptm('icon')" [class]="_icon()" [ngClass]="cx('icon')"></span>
            }
        }
        @if (_label()) {
            <div [pBind]="ptm('label')" [class]="cx('label')">{{ _label() }}</div>
        }
        @if (_removable()) {
            @if (!removeIconTemplate() && !_removeIconTemplate()) {
                @if (_removeIcon()) {
                    <span
                        [pBind]="ptm('removeIcon')"
                        [class]="_removeIcon()"
                        [ngClass]="cx('removeIcon')"
                        (click)="close($event)"
                        (keydown)="onKeydown($event)"
                        [attr.tabindex]="disabled() ? -1 : 0"
                        [attr.aria-label]="removeAriaLabel"
                        role="button"
                    ></span>
                }
                @if (!_removeIcon()) {
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
            @if (removeIconTemplate() || _removeIconTemplate()) {
                <span [pBind]="ptm('removeIcon')" [attr.tabindex]="disabled() ? -1 : 0" [class]="cx('removeIcon')" (click)="close($event)" (keydown)="onKeydown($event)" [attr.aria-label]="removeAriaLabel" role="button">
                    <ng-template *ngTemplateOutlet="removeIconTemplate() || _removeIconTemplate()"></ng-template>
                </span>
            }
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [ChipStyle, { provide: PARENT_INSTANCE, useExisting: Chip }],
    host: {
        '[class]': "cn(cx('root'), chipProps()?.class)",
        '[style]': "sx('root')",
        '[attr.aria-label]': '_label()',
        '[attr.data-p]': 'dataP()'
    },
    hostDirectives: [Bind]
})
export class Chip extends BaseComponent<ChipPassThrough> {
    componentName = 'Chip';

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
     * Alt attribute of the image.
     * @group Props
     */
    readonly alt = input<string | undefined>();
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
    readonly removeIcon = input<string | undefined>();
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

    visible = signal<boolean>(true);

    get removeAriaLabel() {
        return this.config.getTranslation(TranslationKeys.ARIA)['removeLabel'];
    }
    /**
     * Used to pass all properties of the chipProps to the Chip component.
     * @group Props
     */
    readonly chipProps = input<ChipProps | undefined>();

    readonly _label = computed(() => this.chipProps()?.label ?? this.label());

    readonly _icon = computed(() => this.chipProps()?.icon ?? this.icon());

    readonly _image = computed(() => this.chipProps()?.image ?? this.image());

    readonly _alt = computed(() => this.chipProps()?.alt ?? this.alt());

    readonly _removable = computed(() => this.chipProps()?.removable ?? this.removable());

    readonly _removeIcon = computed(() => this.chipProps()?.removeIcon ?? this.removeIcon());

    _componentStyle = inject(ChipStyle);

    /**
     * Custom remove icon template.
     * @group Templates
     */
    readonly removeIconTemplate = contentChild<TemplateRef<void>>('removeicon', { descendants: false });

    readonly templates = contentChildren(PrimeTemplate);

    readonly _removeIconTemplate = computed<TemplateRef<void> | undefined>(() => this.templates().at(-1)?.template);

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

    readonly dataP = computed(() =>
        this.cn({
            removable: this._removable()
        })
    );
}

@NgModule({
    imports: [Chip, SharedModule],
    exports: [Chip, SharedModule]
})
export class ChipModule {}
