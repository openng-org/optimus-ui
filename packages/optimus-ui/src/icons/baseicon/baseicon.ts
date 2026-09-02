import { booleanAttribute, ChangeDetectionStrategy, Component, inject, input, ViewEncapsulation } from '@angular/core';
import { cn } from '@openng/optimus-ui-utils';
import { BaseComponent } from '@openng/optimus-ui/basecomponent';
import { BaseIconStyle } from './style/baseiconstyle';

@Component({
    template: ` <ng-content></ng-content> `,
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [BaseIconStyle],
    host: {
        width: '14',
        height: '14',
        viewBox: '0 0 14 14',
        fill: 'none',
        xmlns: 'http://www.w3.org/2000/svg',
        '[class]': 'getClassNames()'
    }
})
export class BaseIcon extends BaseComponent {
    _componentStyle = inject(BaseIconStyle);

    readonly spin = input<boolean, unknown>(false, { transform: booleanAttribute });

    getClassNames() {
        return cn('p-icon', {
            'p-icon-spin': this.spin()
        });
    }
}
