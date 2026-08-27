import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Component } from '@angular/core';

@Component({
    selector: 'philosophy-promises-doc',
    standalone: true,
    imports: [AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>Four commitments, in the order we would want to read them if we were choosing a dependency:</p>
            <h3>MIT, with no second tier</h3>
            <p>
                Every package we publish is MIT licensed. There is no paid edition, no enterprise build, no feature held back behind a subscription, and no plan to introduce one. If that ever changed, it would be a fork of this project rather than a
                relicensing of it, because the code we inherited is MIT and so is everything we add to it.
            </p>
            <h3>We track Angular</h3>
            <p>
                Our release cadence follows Angular's. When a new Angular major lands, the priority is a compatible Optimus UI major — before new features, before refactors. Staying upgradeable is the single most valuable thing a component library
                can do for the applications built on it.
            </p>
            <h3>Bugs before features</h3>
            <p>We inherited a large backlog along with the code. Fixing what is broken ranks above adding what is missing. Feature requests are triaged and welcome, but they generally ship when someone in the community implements them.</p>
            <h3>No surprises in your bundle</h3>
            <p>The library sends no telemetry, phones no home, and requires no account or key to use. What you install is what runs.</p>
        </app-docsectiontext>
    `
})
export class PhilosophyPromisesDoc {}
