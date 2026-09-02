import { CommonModule } from '@angular/common';
import { afterEveryRender, booleanAttribute, ChangeDetectionStrategy, Component, NgModule, TemplateRef, ViewEncapsulation, computed, contentChild, contentChildren, inject, input } from '@angular/core';
import { PrimeTemplate, SharedModule } from '@openng/optimus-ui/api';
import { BaseComponent, PARENT_INSTANCE } from '@openng/optimus-ui/basecomponent';
import { Bind } from '@openng/optimus-ui/bind';
import type { BadgeSeverity } from '@openng/optimus-ui/types/badge';
import { TagPassThrough } from '@openng/optimus-ui/types/tag';
import { TagStyle } from './style/tagstyle';

/**
 * Tag component is used to categorize content.
 * @group Components
 */
@Component({
    selector: 'p-tag',
    standalone: true,
    imports: [CommonModule, SharedModule, Bind],
    template: `
        <ng-content></ng-content>
        @if ($iconTemplate(); as iconTemplate) {
            <span [class]="cx('icon')" [pBind]="ptm('icon')">
                <ng-template *ngTemplateOutlet="iconTemplate"></ng-template>
            </span>
        } @else if (icon()) {
            <span [class]="cx('icon')" [ngClass]="icon()" [pBind]="ptm('icon')"></span>
        }
        <span [class]="cx('label')" [pBind]="ptm('label')">{{ value() }}</span>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [TagStyle, { provide: PARENT_INSTANCE, useExisting: Tag }],
    host: {
        '[class]': "cx('root')",
        '[attr.data-p]': 'dataP()'
    },
    hostDirectives: [Bind]
})
export class Tag extends BaseComponent<TagPassThrough> {
    bindDirectiveInstance = inject(Bind, { self: true });

    _componentStyle = inject(TagStyle);

    /**
     * Severity type of the tag.
     * @group Props
     */
    readonly severity = input<BadgeSeverity | undefined | null>();

    /**
     * Value to display inside the tag.
     * @group Props
     */
    readonly value = input<string>();

    /**
     * Icon of the tag to display next to the value.
     * @group Props
     */
    readonly icon = input<string>();

    /**
     * Whether the corners of the tag are rounded.
     * @group Props
     */
    readonly rounded = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    /**
     * Custom icon template.
     * @group Templates
     */
    readonly iconTemplate = contentChild<TemplateRef<void>>('icon', { descendants: false });

    readonly templates = contentChildren(PrimeTemplate);

    componentName = 'Tag';

    /** Effective icon template: the \`#icon\` content child, or a legacy \`pTemplate="icon"\`. */
    readonly $iconTemplate = computed(() => this.iconTemplate() ?? this.templates().find((item) => item.getType() === 'icon')?.template);

    readonly dataP = computed(() =>
        this.cn({
            rounded: this.rounded(),
            [this.severity() as string]: this.severity()
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
}

@NgModule({
    imports: [Tag, SharedModule],
    exports: [Tag, SharedModule]
})
export class TagModule {}
