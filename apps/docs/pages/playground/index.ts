import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
    standalone: true,
    imports: [CommonModule],
    template: ` <div class="doc">
        <div class="doc-main">
            <div class="doc-intro">
                <h1>Playground</h1>
                <p>Experience Optimus UI right now with the interactive environment.</p>
            </div>
            <section class="py-6">
                <iframe class="w-full h-full" style="border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 2px; min-height: 800px" allowfullscreen src="https://stackblitz.com/edit/stackblitz-starters-mmltglkm?embed=1&file=src%2Fmain.ts"></iframe>
            </section>
        </div>
    </div>`
})
export class PlaygroundDemo implements OnInit {
    private titleService = inject(Title);

    private metaService = inject(Meta);

    ngOnInit() {
        this.titleService.setTitle('Playground - Optimus UI');
        this.metaService.updateTag({
            name: 'description',
            content: 'Try Optimus UI in an interactive playground without installing anything.'
        });
    }
}
