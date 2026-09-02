import { CommonModule } from '@angular/common';
import { afterEveryRender, booleanAttribute, ChangeDetectionStrategy, Component, computed, inject, input, NgModule, numberAttribute, signal, TemplateRef, ViewEncapsulation, contentChild, contentChildren, output } from '@angular/core';
import { MotionOptions } from '@openng/optimus-ui-motion';
import { PrimeTemplate, SharedModule } from '@openng/optimus-ui/api';
import { BaseComponent, PARENT_INSTANCE } from '@openng/optimus-ui/basecomponent';
import { Bind } from '@openng/optimus-ui/bind';
import { TimesIcon } from '@openng/optimus-ui/icons';
import { MotionModule } from '@openng/optimus-ui/motion';
import { Ripple } from '@openng/optimus-ui/ripple';
import { MessageContainerTemplateContext, MessagePassThrough, MessageSeverity } from '@openng/optimus-ui/types/message';
import { MessageStyle } from './style/messagestyle';

/**
 * Message groups a collection of contents in tabs.
 * @group Components
 */
@Component({
    selector: 'p-message',
    standalone: true,
    imports: [CommonModule, TimesIcon, Ripple, SharedModule, Bind, MotionModule],
    template: `
        <div [pBind]="ptm('contentWrapper')" [class]="cx('contentWrapper')" [attr.data-p]="dataP()">
            <div [pBind]="ptm('content')" [class]="cx('content')" [attr.data-p]="dataP()">
                @if ($iconTemplate()) {
                    <ng-container *ngTemplateOutlet="$iconTemplate()"></ng-container>
                }
                @if (icon()) {
                    <i [pBind]="ptm('icon')" [class]="cn(cx('icon'), icon())" [attr.data-p]="dataP()"></i>
                }

                @if ($containerTemplate()) {
                    <ng-container *ngTemplateOutlet="$containerTemplate(); context: { closeCallback: closeCallback }"></ng-container>
                } @else {
                    @if (!escape()) {
                        <div>
                            @if (!escape()) {
                                <span [pBind]="ptm('text')" [ngClass]="cx('text')" [innerHTML]="text()" [attr.data-p]="dataP()"></span>
                            }
                        </div>
                    } @else {
                        @if (escape() && text()) {
                            <span [pBind]="ptm('text')" [ngClass]="cx('text')" [attr.data-p]="dataP()">{{ text() }}</span>
                        }
                    }

                    <span [pBind]="ptm('text')" [ngClass]="cx('text')" [attr.data-p]="dataP()">
                        <ng-content></ng-content>
                    </span>
                }
                @if (closable()) {
                    <button [pBind]="ptm('closeButton')" pRipple type="button" [class]="cx('closeButton')" (click)="close($event)" [attr.aria-label]="closeAriaLabel" [attr.data-p]="dataP()">
                        @if (closeIcon()) {
                            <i [pBind]="ptm('closeIcon')" [class]="cn(cx('closeIcon'), closeIcon())" [ngClass]="closeIcon()" [attr.data-p]="dataP()"></i>
                        }
                        @if ($closeIconTemplate()) {
                            <ng-container *ngTemplateOutlet="$closeIconTemplate()"></ng-container>
                        }
                        @if (!$closeIconTemplate() && !closeIcon()) {
                            <svg [pBind]="ptm('closeIcon')" data-p-icon="times" [class]="cx('closeIcon')" [attr.data-p]="dataP()" />
                        }
                    </button>
                }
            </div>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [MessageStyle, { provide: PARENT_INSTANCE, useExisting: Message }],
    hostDirectives: [Bind],
    host: {
        '[attr.data-p]': 'dataP()',
        role: 'alert',
        'aria-live': 'polite',
        '[class]': 'cn(cx("root"), styleClass())',
        '[animate.enter]': '"p-message-enter-active"',
        '[animate.leave]': '"p-message-leave-active"',
        '[class.p-message-leave-active]': '!visible()'
    }
})
export class Message extends BaseComponent<MessagePassThrough> {
    _componentStyle = inject(MessageStyle);

    bindDirectiveInstance = inject(Bind, { self: true });

    /**
     * Severity level of the message.
     * @defaultValue 'info'
     * @group Props
     */
    readonly severity = input<MessageSeverity | undefined | null>('info');

    /**
     * Text content.
     * @deprecated since v20.0.0. Use content projection instead '<p-message>Content</p-message>'.
     * @group Props
     */
    readonly text = input<string>();

    /**
     * Whether displaying messages would be escaped or not.
     * @deprecated since v20.0.0. Use content projection instead '<p-message>Content</p-message>'.
     * @group Props
     */
    readonly escape = input<boolean, unknown>(true, { transform: booleanAttribute });

    /**
     * Style class of the component.
     * @group Props
     */
    readonly styleClass = input<string>();

    /**
     * Whether the message can be closed manually using the close icon.
     * @group Props
     * @defaultValue false
     */
    readonly closable = input<boolean, unknown>(false, { transform: booleanAttribute });

    /**
     * Icon to display in the message.
     * @group Props
     * @defaultValue undefined
     */
    readonly icon = input<string>();

    /**
     * Icon to display in the message close button.
     * @group Props
     * @defaultValue undefined
     */
    readonly closeIcon = input<string>();

    /**
     * Delay in milliseconds to close the message automatically.
     * @defaultValue undefined
     */
    readonly life = input<number | undefined, unknown>(undefined, { transform: numberAttribute });

    /**
     * Transition options of the show animation.
     * @defaultValue '300ms ease-out'
     * @group Props
     * @deprecated since v21.0.0, use `motionOptions` instead.
     */
    readonly showTransitionOptions = input<string>('300ms ease-out');

    /**
     * Transition options of the hide animation.
     * @defaultValue '200ms cubic-bezier(0.86, 0, 0.07, 1)'
     * @group Props
     * @deprecated since v21.0.0, use `motionOptions` instead.
     */
    readonly hideTransitionOptions = input<string>('200ms cubic-bezier(0.86, 0, 0.07, 1)');

    /**
     * Defines the size of the component.
     * @group Props
     */
    readonly size = input<'large' | 'small'>();

    /**
     * Specifies the input variant of the component.
     * @group Props
     */
    readonly variant = input<'outlined' | 'text' | 'simple'>();

    /**
     * The motion options.
     * @group Props
     */
    motionOptions = input<MotionOptions | undefined>(undefined);

    /**
     * Emits when the message is closed.
     * @param {{ originalEvent: Event }} event - The event object containing the original event.
     * @group Emits
     */
    readonly onClose = output<{
        originalEvent: Event;
    }>();

    /**
     * Custom template of the message container.
     * @param {MessageContainerTemplateContext} context - container context.
     * @see {@link MessageContainerTemplateContext}
     * @group Templates
     */
    readonly containerTemplate = contentChild<TemplateRef<MessageContainerTemplateContext>>('container', { descendants: false });

    /**
     * Custom template of the message icon.
     * @group Templates
     */
    readonly iconTemplate = contentChild<TemplateRef<void>>('icon', { descendants: false });

    /**
     * Custom template of the close icon.
     * @group Templates
     */
    readonly closeIconTemplate = contentChild<TemplateRef<void>>('closeicon', { descendants: false });

    readonly templates = contentChildren(PrimeTemplate);

    componentName = 'Message';

    computedMotionOptions = computed<MotionOptions>(() => {
        return {
            ...this.ptm('motion'),
            ...this.motionOptions()
        };
    });

    get closeAriaLabel() {
        return this.config.translation.aria ? this.config.translation.aria.close : undefined;
    }

    visible = signal<boolean>(true);

    /** Effective container template: the \`#container\` content child, or a legacy \`pTemplate="container"\`. */
    readonly $containerTemplate = computed(() => this.containerTemplate() ?? (this.templates().find((item) => item.getType() === 'container')?.template as TemplateRef<MessageContainerTemplateContext> | undefined));

    /** Effective icon template: the \`#icon\` content child, or a legacy \`pTemplate="icon"\`. */
    readonly $iconTemplate = computed(() => this.iconTemplate() ?? this.templates().find((item) => item.getType() === 'icon')?.template);

    /** Effective close icon template: the \`#closeicon\` content child, or a legacy \`pTemplate="closeicon"\`. */
    readonly $closeIconTemplate = computed(() => this.closeIconTemplate() ?? this.templates().find((item) => item.getType() === 'closeicon')?.template);

    closeCallback = (event: Event) => {
        this.close(event);
    };

    readonly dataP = computed(() =>
        this.cn({
            outlined: this.variant() === 'outlined',
            simple: this.variant() === 'simple',
            [this.severity() as string]: this.severity(),
            [this.size() as string]: this.size()
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

    onInit() {
        if (this.life()) {
            setTimeout(() => {
                this.visible.set(false);
            }, this.life());
        }
    }

    /**
     * Closes the message.
     * @param {Event} event - Browser event.
     * @group Method
     */
    public close(event: Event) {
        this.visible.set(false);
        this.onClose.emit({ originalEvent: event });
    }
}

@NgModule({
    imports: [Message, SharedModule],
    exports: [Message, SharedModule]
})
export class MessageModule {}
