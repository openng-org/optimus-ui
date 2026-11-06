import { CommonModule } from '@angular/common';
import { afterEveryRender, ChangeDetectionStrategy, Component, computed, inject, input, NgModule, TemplateRef, ViewEncapsulation, contentChild, contentChildren } from '@angular/core';
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
    imports: [CommonModule, SharedModule, BindModule],
    template: `
        @if (headerFacet() || headerTemplate() || _headerTemplate()) {
            <div [pBind]="ptm('header')" [class]="cx('header')">
                <ng-content select="p-header"></ng-content>
                <ng-container *ngTemplateOutlet="headerTemplate() || _headerTemplate()"></ng-container>
            </div>
        }
        <div [pBind]="ptm('body')" [class]="cx('body')">
            @if (header() || titleTemplate() || _titleTemplate()) {
                <div [pBind]="ptm('title')" [class]="cx('title')">
                    @if (header() && !_titleTemplate() && !titleTemplate()) {
                        {{ header() }}
                    }
                    <ng-container *ngTemplateOutlet="titleTemplate() || _titleTemplate()"></ng-container>
                </div>
            }
            @if (subheader() || subtitleTemplate() || _subtitleTemplate()) {
                <div [pBind]="ptm('subtitle')" [class]="cx('subtitle')">
                    @if (subheader() && !_subtitleTemplate() && !subtitleTemplate()) {
                        {{ subheader() }}
                    }
                    <ng-container *ngTemplateOutlet="subtitleTemplate() || _subtitleTemplate()"></ng-container>
                </div>
            }
            <div [pBind]="ptm('content')" [class]="cx('content')">
                <ng-content></ng-content>
                <ng-container *ngTemplateOutlet="contentTemplate() || _contentTemplate()"></ng-container>
            </div>
            @if (footerFacet() || footerTemplate() || _footerTemplate()) {
                <div [pBind]="ptm('footer')" [class]="cx('footer')">
                    <ng-content select="p-footer"></ng-content>
                    <ng-container *ngTemplateOutlet="footerTemplate() || _footerTemplate()"></ng-container>
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
    componentName = 'Card';

    bindDirectiveInstance = inject(Bind, { self: true });

    _componentStyle = inject(CardStyle);

    constructor() {
        super();
        afterEveryRender(() => this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root'])));
    }
    /**
     * Header of the card.
     * @group Props
     */
    readonly header = input<string | undefined>();
    /**
     * Subheader of the card.
     * @group Props
     */
    readonly subheader = input<string | undefined>();
    /**
     * Inline style of the element.
     * @group Props
     */
    readonly style = input<{ [klass: string]: any } | null | undefined>(null);

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

    readonly _headerTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'header')
                .at(-1)?.template
    );

    readonly _titleTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'title')
                .at(-1)?.template
    );

    readonly _subtitleTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'subtitle')
                .at(-1)?.template
    );

    readonly _contentTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => !['header', 'title', 'subtitle', 'footer'].includes(item.getType()))
                .at(-1)?.template
    );

    readonly _footerTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'footer')
                .at(-1)?.template
    );

    getBlockableElement(): HTMLElement {
        return this.el.nativeElement;
    }

    readonly templates = contentChildren(PrimeTemplate);
}

@NgModule({
    imports: [Card, SharedModule, BindModule],
    exports: [Card, SharedModule, BindModule]
})
export class CardModule {}
