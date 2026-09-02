import { CommonModule } from '@angular/common';
import { afterEveryRender, ChangeDetectionStrategy, Component, computed, contentChild, contentChildren, inject, input, NgModule, TemplateRef, ViewEncapsulation } from '@angular/core';
import { BlockableUI, Footer, Header, PrimeTemplate, SharedModule } from '@openng/optimus-ui/api';
import { BaseComponent, PARENT_INSTANCE } from '@openng/optimus-ui/basecomponent';
import { Bind, BindModule } from '@openng/optimus-ui/bind';
import { CardStyle } from './style/cardstyle';
import { CardPassThrough } from '@openng/optimus-ui/types/card';

/**
 * Card is a flexible container component.
 * @group Components
 */
@Component({
    selector: 'p-card',
    standalone: true,
    imports: [CommonModule, SharedModule, BindModule],
    template: `
        @if (headerFacet() || $headerTemplate()) {
            <div [pBind]="ptm('header')" [class]="cx('header')">
                <ng-content select="p-header"></ng-content>
                <ng-container *ngTemplateOutlet="$headerTemplate()"></ng-container>
            </div>
        }
        <div [pBind]="ptm('body')" [class]="cx('body')">
            @if (header() || $titleTemplate()) {
                <div [pBind]="ptm('title')" [class]="cx('title')">
                    @if (header() && !$titleTemplate()) {
                        {{ header() }}
                    }
                    <ng-container *ngTemplateOutlet="$titleTemplate()"></ng-container>
                </div>
            }
            @if (subheader() || $subtitleTemplate()) {
                <div [pBind]="ptm('subtitle')" [class]="cx('subtitle')">
                    @if (subheader() && !$subtitleTemplate()) {
                        {{ subheader() }}
                    }
                    <ng-container *ngTemplateOutlet="$subtitleTemplate()"></ng-container>
                </div>
            }
            <div [pBind]="ptm('content')" [class]="cx('content')">
                <ng-content></ng-content>
                <ng-container *ngTemplateOutlet="$contentTemplate()"></ng-container>
            </div>
            @if (footerFacet() || $footerTemplate()) {
                <div [pBind]="ptm('footer')" [class]="cx('footer')">
                    <ng-content select="p-footer"></ng-content>
                    <ng-container *ngTemplateOutlet="$footerTemplate()"></ng-container>
                </div>
            }
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [CardStyle, { provide: PARENT_INSTANCE, useExisting: Card }],
    host: {
        '[class]': "cx('root')",
        '[style]': 'style()'
    },
    hostDirectives: [Bind]
})
export class Card extends BaseComponent<CardPassThrough> implements BlockableUI {
    bindDirectiveInstance = inject(Bind, { self: true });

    _componentStyle = inject(CardStyle);

    /**
     * Header of the card.
     * @group Props
     */
    readonly header = input<string>();

    /**
     * Subheader of the card.
     * @group Props
     */
    readonly subheader = input<string>();

    /**
     * Inline style of the element.
     * @group Props
     */
    readonly style = input<{ [klass: string]: any } | null>();

    readonly headerFacet = contentChild(Header);

    readonly footerFacet = contentChild(Footer);

    /**
     * Custom header template.
     * @group Templates
     */
    readonly headerTemplate = contentChild<TemplateRef<void>>('header', { descendants: false });

    /**
     * Custom title template.
     * @group Templates
     */
    readonly titleTemplate = contentChild<TemplateRef<void>>('title', { descendants: false });

    /**
     * Custom subtitle template.
     * @group Templates
     */
    readonly subtitleTemplate = contentChild<TemplateRef<void>>('subtitle', { descendants: false });

    /**
     * Custom content template.
     * @group Templates
     */
    readonly contentTemplate = contentChild<TemplateRef<void>>('content', { descendants: false });

    /**
     * Custom footer template.
     * @group Templates
     */
    readonly footerTemplate = contentChild<TemplateRef<void>>('footer', { descendants: false });

    readonly templates = contentChildren(PrimeTemplate);

    componentName = 'Card';

    /** Effective header template: the \`#header\` content child, or a legacy \`pTemplate="header"\`. */
    readonly $headerTemplate = computed(() => this.headerTemplate() ?? this.templates().find((item) => item.getType() === 'header')?.template);

    /** Effective title template: the \`#title\` content child, or a legacy \`pTemplate="title"\`. */
    readonly $titleTemplate = computed(() => this.titleTemplate() ?? this.templates().find((item) => item.getType() === 'title')?.template);

    /** Effective subtitle template: the \`#subtitle\` content child, or a legacy \`pTemplate="subtitle"\`. */
    readonly $subtitleTemplate = computed(() => this.subtitleTemplate() ?? this.templates().find((item) => item.getType() === 'subtitle')?.template);

    /**
     * Effective content template: the \`#content\` content child, a legacy \`pTemplate="content"\`,
     * or (legacy behavior) the last \`pTemplate\` with an unrecognized type.
     */
    readonly $contentTemplate = computed(() => {
        const contentTemplate = this.contentTemplate();
        if (contentTemplate) {
            return contentTemplate;
        }
        const known = ['header', 'title', 'subtitle', 'footer'];
        return [...this.templates()].reverse().find((item) => !known.includes(item.getType()))?.template;
    });

    /** Effective footer template: the \`#footer\` content child, or a legacy \`pTemplate="footer"\`. */
    readonly $footerTemplate = computed(() => this.footerTemplate() ?? this.templates().find((item) => item.getType() === 'footer')?.template);

    constructor() {
        super();
        // Re-apply the host/root pass-through sections after each render (replaces the former
        // ngAfterViewChecked hook). Bind.setAttrs writes into a signal behind an equality check,
        // so unchanged PT resolutions are no-ops.
        afterEveryRender(() => {
            this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
        });
    }

    getBlockableElement(): HTMLElement {
        return this.el.nativeElement;
    }
}

@NgModule({
    imports: [Card, SharedModule, BindModule],
    exports: [Card, SharedModule, BindModule]
})
export class CardModule {}
