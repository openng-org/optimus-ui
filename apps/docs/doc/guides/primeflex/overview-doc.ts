import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Component } from '@angular/core';

@Component({
    selector: 'overview-doc',
    standalone: true,
    imports: [AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                <a href="https://primeflex.org" target="_blank" rel="noopener noreferrer">PrimeFlex</a> was PrimeTek's lightweight CSS utility library, designed to accompany PrimeNG. PrimeTek stopped maintaining it before the relicensing, on the
                grounds that most applications already bring their own utility layer — Tailwind, Bootstrap or something in-house — and a second one only overlaps with it.
            </p>
            <p>
                Optimus UI does not maintain PrimeFlex either, and for the same reason. Nothing in this library depends on it, and no component requires it. If your application already uses PrimeFlex it will keep working, but it will not receive
                updates from us, and we suggest moving to Tailwind CSS.
            </p>
        </app-docsectiontext>
    `
})
export class OverviewDoc {}
