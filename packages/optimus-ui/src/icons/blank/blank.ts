import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseIcon } from '@openng/optimus-ui/icons/baseicon';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: '[data-p-icon="blank"]',
    standalone: true,
    template: ` <svg:rect width="1" height="1" fill="currentColor" fill-opacity="0" /> `
})
export class BlankIcon extends BaseIcon {}
