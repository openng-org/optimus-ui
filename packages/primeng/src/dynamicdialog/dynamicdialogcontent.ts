import { Directive, inject, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[pDynamicDialogContent]',
    standalone: true
})
export class DynamicDialogContent {
    viewContainerRef = inject(ViewContainerRef);
}
