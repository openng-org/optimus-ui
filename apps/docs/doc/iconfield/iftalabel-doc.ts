import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IftaLabelModule } from '@openng/optimus-ui/iftalabel';
import { IconFieldModule } from '@openng/optimus-ui/iconfield';
import { InputIconModule } from '@openng/optimus-ui/inputicon';
import { InputTextModule } from '@openng/optimus-ui/inputtext';
import { AppCodeModule } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'iftalabel-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCodeModule, RouterModule, FormsModule, IftaLabelModule, IconFieldModule, InputIconModule, InputTextModule],
    template: `
        <app-docsectiontext>
            <p>IftaLabel is used to create infield top aligned labels. Visit <a routerLink="/iftalabel">IftaLabel</a> documentation for more information.</p>
        </app-docsectiontext>
        <div class="card flex justify-center">
            <p-iftalabel>
                <p-iconfield>
                    <p-inputicon class="pi pi-user" />
                    <input pInputText id="username" [(ngModel)]="value" autocomplete="off" />
                </p-iconfield>
                <label for="username">Username</label>
            </p-iftalabel>
        </div>
        <app-code></app-code>
    `
})
export class IftaLabelDoc {
    value: string | undefined;
}
