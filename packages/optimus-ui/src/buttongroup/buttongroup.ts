import { ChangeDetectionStrategy, Component, inject, NgModule, ViewEncapsulation } from '@angular/core';
import { BaseComponent } from '@openng/optimus-ui/basecomponent';
import { ButtonGroupStyle } from './style/buttongroupstyle';

@Component({
    selector: 'p-buttonGroup, p-buttongroup, p-button-group',
    standalone: true,
    imports: [],
    template: `
        <span class="p-buttongroup p-component" role="group">
            <ng-content></ng-content>
        </span>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [ButtonGroupStyle]
})
export class ButtonGroup extends BaseComponent {
    componentName = 'ButtonGroup';

    _componentStyle = inject(ButtonGroupStyle);
}

@NgModule({
    imports: [ButtonGroup],
    exports: [ButtonGroup]
})
export class ButtonGroupModule {}
