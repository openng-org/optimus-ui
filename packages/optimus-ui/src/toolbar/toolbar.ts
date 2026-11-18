import { CommonModule } from '@angular/common';
import { afterEveryRender, ChangeDetectionStrategy, Component, computed, inject, input, NgModule, TemplateRef, ViewEncapsulation, contentChild, contentChildren } from '@angular/core';
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
    imports: [CommonModule, SharedModule, BindModule],
    template: `
        <ng-content></ng-content>
        @if (startTemplate() || _startTemplate()) {
            <div [class]="cx('start')" [pBind]="ptm('start')">
                <ng-container *ngTemplateOutlet="startTemplate() || _startTemplate()"></ng-container>
            </div>
        }
        @if (centerTemplate() || _centerTemplate()) {
            <div [class]="cx('center')" [pBind]="ptm('center')">
                <ng-container *ngTemplateOutlet="centerTemplate() || _centerTemplate()"></ng-container>
            </div>
        }
        @if (endTemplate() || _endTemplate()) {
            <div [class]="cx('end')" [pBind]="ptm('end')">
                <ng-container *ngTemplateOutlet="endTemplate() || _endTemplate()"></ng-container>
            </div>
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [ToolbarStyle, { provide: PARENT_INSTANCE, useExisting: Toolbar }],
    host: {
        '[class]': "cx('root')",
        role: 'toolbar',
        '[attr.aria-labelledby]': 'ariaLabelledBy()'
    },
    hostDirectives: [Bind]
})
export class Toolbar extends BaseComponent<ToolbarPassThrough> implements BlockableUI {
    componentName = 'Toolbar';

    bindDirectiveInstance = inject(Bind, { self: true });

    constructor() {
        super();
        afterEveryRender(() => this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root'])));
    }

    /**
     * Defines a string value that labels an interactive element.
     * @group Props
     */
    readonly ariaLabelledBy = input<string | undefined>();

    _componentStyle = inject(ToolbarStyle);

    getBlockableElement(): HTMLElement {
        return this.el.nativeElement.children[0];
    }
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

    readonly _startTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => ['start', 'left'].includes(item.getType()))
                .at(-1)?.template
    );

    readonly _endTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => ['end', 'right'].includes(item.getType()))
                .at(-1)?.template
    );

    readonly _centerTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'center')
                .at(-1)?.template
    );
}

@NgModule({
    imports: [Toolbar, SharedModule, BindModule],
    exports: [Toolbar, SharedModule, BindModule]
})
export class ToolbarModule {}
