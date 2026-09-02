import { CommonModule } from '@angular/common';
import { afterEveryRender, booleanAttribute, ChangeDetectionStrategy, Component, computed, contentChild, contentChildren, inject, input, model, NgModule, TemplateRef, ViewEncapsulation, output } from '@angular/core';
import { PrimeTemplate, SharedModule } from '@openng/optimus-ui/api';
import { BaseComponent, PARENT_INSTANCE } from '@openng/optimus-ui/basecomponent';
import { Bind } from '@openng/optimus-ui/bind';
import { ButtonModule } from '@openng/optimus-ui/button';
import { TimesIcon } from '@openng/optimus-ui/icons';
import { Ripple } from '@openng/optimus-ui/ripple';
import { InplaceContentTemplateContext, InplacePassThrough } from '@openng/optimus-ui/types/inplace';
import { InplaceStyle } from './style/inplacestyle';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'p-inplacedisplay, p-inplaceDisplay',
    standalone: true,
    imports: [],
    template: '<ng-content></ng-content>'
})
export class InplaceDisplay extends BaseComponent {}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'p-inplacecontent, p-inplaceContent',
    standalone: true,
    imports: [],
    template: '<ng-content></ng-content>'
})
export class InplaceContent extends BaseComponent {}
/**
 * Inplace provides an easy to do editing and display at the same time where clicking the output displays the actual content.
 * @group Components
 */
@Component({
    selector: 'p-inplace',
    standalone: true,
    imports: [CommonModule, ButtonModule, TimesIcon, SharedModule, Ripple, Bind],
    template: `
        @if (!active()) {
            <div [class]="cx('display')" [pBind]="ptm('display')" (click)="onActivateClick($event)" tabindex="0" role="button" (keydown)="onKeydown($event)" [attr.data-p-disabled]="disabled()">
                <ng-content select="[pInplaceDisplay]"></ng-content>
                <ng-container *ngTemplateOutlet="$displayTemplate()"></ng-container>
            </div>
        }
        @if (active()) {
            <div [class]="cx('content')" [pBind]="ptm('content')">
                <ng-content select="[pInplaceContent]"></ng-content>
                <ng-container *ngTemplateOutlet="$contentTemplate(); context: { closeCallback: onDeactivateClick.bind(this) }"></ng-container>
                @if (closable()) {
                    @if (closeIcon()) {
                        <p-button [pt]="ptm('pcButton')" type="button" [icon]="closeIcon()" pRipple (click)="onDeactivateClick($event)" [attr.aria-label]="closeAriaLabel()"></p-button>
                    }
                    @if (!closeIcon()) {
                        <p-button [pt]="ptm('pcButton')" type="button" pRipple (click)="onDeactivateClick($event)" [attr.aria-label]="closeAriaLabel()">
                            <ng-template #icon>
                                @if (!$closeIconTemplate()) {
                                    <svg data-p-icon="times" />
                                }
                            </ng-template>
                            <ng-template *ngTemplateOutlet="$closeIconTemplate()"></ng-template>
                        </p-button>
                    }
                }
            </div>
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [InplaceStyle, { provide: PARENT_INSTANCE, useExisting: Inplace }],
    host: {
        '[attr.aria-live]': "'polite'",
        '[class]': "cx('root')"
    },
    hostDirectives: [Bind]
})
export class Inplace extends BaseComponent<InplacePassThrough> {
    bindDirectiveInstance = inject(Bind, { self: true });

    _componentStyle = inject(InplaceStyle);

    /**
     * Whether the content is displayed or not.
     * @group Props
     */
    readonly active = model<boolean | undefined>(false);

    /**
     * Displays a button to switch back to display mode.
     * @deprecated since v20.0.0, use `closeCallback` within content template.
     * @group Props
     */
    readonly closable = input<boolean | undefined, unknown>(false, { transform: booleanAttribute });

    /**
     * When present, it specifies that the element should be disabled.
     * @group Props
     */
    readonly disabled = input<boolean | undefined, unknown>(false, { transform: booleanAttribute });

    /**
     * Allows to prevent clicking.
     * @group Props
     */
    readonly preventClick = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    /**
     * Icon to display in the close button.
     * @deprecated since v20.0.0, use `class` instead.
     * @group Props
     */
    readonly closeIcon = input<string>();

    /**
     * Establishes a string value that labels the close button.
     * @group Props
     */
    readonly closeAriaLabel = input<string>();

    /**
     * Callback to invoke when inplace is opened.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    readonly onActivate = output<Event | undefined>();

    /**
     * Callback to invoke when inplace is closed.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    readonly onDeactivate = output<Event | undefined>();

    /**
     * Custom display template.
     * @group Templates
     */
    readonly displayTemplate = contentChild<TemplateRef<void>>('display', { descendants: false });

    /**
     * Custom content template.
     * @group Templates
     */
    readonly contentTemplate = contentChild<TemplateRef<InplaceContentTemplateContext>>('content', { descendants: false });

    /**
     * Custom close icon template.
     * @group Templates
     */
    readonly closeIconTemplate = contentChild<TemplateRef<void>>('closeicon', { descendants: false });

    readonly templates = contentChildren(PrimeTemplate);

    componentName = 'Inplace';

    /** Effective display template: the \`#display\` content child, or a legacy \`pTemplate="display"\`. */
    readonly $displayTemplate = computed(() => this.displayTemplate() ?? this.templates().find((item) => item.getType() === 'display')?.template);

    /** Effective content template: the \`#content\` content child, or a legacy \`pTemplate="content"\`. */
    readonly $contentTemplate = computed(() => this.contentTemplate() ?? (this.templates().find((item) => item.getType() === 'content')?.template as TemplateRef<InplaceContentTemplateContext> | undefined));

    /** Effective close icon template: the \`#closeicon\` content child, or a legacy \`pTemplate="closeicon"\`. */
    readonly $closeIconTemplate = computed(() => this.closeIconTemplate() ?? this.templates().find((item) => item.getType() === 'closeicon')?.template);

    constructor() {
        super();
        // Re-apply the host/root pass-through sections after each render (replaces the former
        // ngAfterViewChecked hook). Bind.setAttrs writes into a signal behind an equality check,
        // so unchanged PT resolutions are no-ops.
        afterEveryRender(() => {
            this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
        });
    }

    onActivateClick(event: MouseEvent) {
        if (!this.preventClick()) this.activate(event);
    }

    onDeactivateClick(event: MouseEvent) {
        if (!this.preventClick()) this.deactivate(event);
    }

    /**
     * Activates the content.
     * @param {Event} event - Browser event.
     * @group Method
     */
    activate(event?: Event) {
        if (!this.disabled()) {
            this.active.set(true);
            this.onActivate.emit(event);
        }
    }

    /**
     * Deactivates the content.
     * @param {Event} event - Browser event.
     * @group Method
     */
    deactivate(event?: Event) {
        if (!this.disabled()) {
            this.active.set(false);
            this.onDeactivate.emit(event);
        }
    }

    onKeydown(event: KeyboardEvent) {
        if (event.code === 'Enter') {
            this.activate(event);
            event.preventDefault();
        }
    }
}

@NgModule({
    imports: [Inplace, InplaceContent, InplaceDisplay, SharedModule],
    exports: [Inplace, InplaceContent, InplaceDisplay, SharedModule]
})
export class InplaceModule {}
