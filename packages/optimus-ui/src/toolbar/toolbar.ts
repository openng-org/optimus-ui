import { CommonModule } from '@angular/common';
import { afterEveryRender, ChangeDetectionStrategy, Component, computed, contentChild, contentChildren, inject, input, NgModule, TemplateRef, ViewEncapsulation } from '@angular/core';
import { BlockableUI, PrimeTemplate, SharedModule } from '@openng/optimus-ui/api';
import { BaseComponent, PARENT_INSTANCE } from '@openng/optimus-ui/basecomponent';
import { Bind, BindModule } from '@openng/optimus-ui/bind';
import { ToolbarStyle } from './style/toolbarstyle';
import { ToolbarPassThrough } from '@openng/optimus-ui/types/toolbar';

/**
 * Toolbar is a grouping component for buttons and other content.
 * @group Components
 */
@Component({
    selector: 'p-toolbar',
    standalone: true,
    imports: [CommonModule, SharedModule, BindModule],
    template: `
        <ng-content></ng-content>
        @if ($startTemplate(); as startTemplate) {
            <div [class]="cx('start')" [pBind]="ptm('start')">
                <ng-container *ngTemplateOutlet="startTemplate"></ng-container>
            </div>
        }
        @if ($centerTemplate(); as centerTemplate) {
            <div [class]="cx('center')" [pBind]="ptm('center')">
                <ng-container *ngTemplateOutlet="centerTemplate"></ng-container>
            </div>
        }
        @if ($endTemplate(); as endTemplate) {
            <div [class]="cx('end')" [pBind]="ptm('end')">
                <ng-container *ngTemplateOutlet="endTemplate"></ng-container>
            </div>
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [ToolbarStyle, { provide: PARENT_INSTANCE, useExisting: Toolbar }],
    host: {
        '[class]': 'cx("root")',
        role: 'toolbar',
        '[attr.aria-labelledby]': 'ariaLabelledBy()'
    },
    hostDirectives: [Bind]
})
export class Toolbar extends BaseComponent<ToolbarPassThrough> implements BlockableUI {
    bindDirectiveInstance = inject(Bind, { self: true });

    _componentStyle = inject(ToolbarStyle);

    /**
     * Defines a string value that labels an interactive element.
     * @group Props
     */
    readonly ariaLabelledBy = input<string>();

    /**
     * Custom start template.
     * @group Templates
     */
    readonly startTemplate = contentChild<TemplateRef<void>>('start', { descendants: false });

    /**
     * Custom end template.
     * @group Templates
     */
    readonly endTemplate = contentChild<TemplateRef<void>>('end', { descendants: false });

    /**
     * Custom center template.
     * @group Templates
     */
    readonly centerTemplate = contentChild<TemplateRef<void>>('center', { descendants: false });

    readonly templates = contentChildren(PrimeTemplate);

    componentName = 'Toolbar';

    /** Effective start template: the \`#start\` content child, or a legacy \`pTemplate="start"\`/\`"left"\`. */
    readonly $startTemplate = computed(() => this.startTemplate() ?? this.templates().find((item) => ['start', 'left'].includes(item.getType()))?.template);

    /** Effective center template: the \`#center\` content child, or a legacy \`pTemplate="center"\`. */
    readonly $centerTemplate = computed(() => this.centerTemplate() ?? this.templates().find((item) => item.getType() === 'center')?.template);

    /** Effective end template: the \`#end\` content child, or a legacy \`pTemplate="end"\`/\`"right"\`. */
    readonly $endTemplate = computed(() => this.endTemplate() ?? this.templates().find((item) => ['end', 'right'].includes(item.getType()))?.template);

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
        return this.el.nativeElement.children[0];
    }
}

@NgModule({
    imports: [Toolbar, SharedModule, BindModule],
    exports: [Toolbar, SharedModule, BindModule]
})
export class ToolbarModule {}
