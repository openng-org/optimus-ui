import { NodeService } from '@/service/nodeservice';
import { Component, inject, signal } from '@angular/core';
import { form, FormField, required, type FieldTree } from '@angular/forms/signals';
import { MessageService, type TreeNode } from 'primeng/api';
import { TreeSelectModule } from 'primeng/treeselect';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { AppCode } from '@/components/doc/app.code';
import { AppDemoWrapper } from '@/components/doc/app.demowrapper';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'signal-forms-doc',
    standalone: true,
    imports: [FormField, TreeSelectModule, ButtonModule, ToastModule, MessageModule, AppCode, AppDemoWrapper, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>TreeSelect can also be used with signal forms. In this case, the <i>formField</i> directive is used to bind the component to a field of the form.</p>
        </app-docsectiontext>
        <p-toast />
        <app-demo-wrapper>
            <div class="flex justify-center">
                <form (submit)="onSubmit($event)" class="flex flex-col gap-4 w-full md:w-80">
                    <div class="flex flex-col gap-1">
                        <p-treeselect class="md:w-80 w-full" [formField]="exampleForm.selectedNodes" [options]="nodes" placeholder="Select Item" />

                        @if (isInvalid(exampleForm.selectedNodes)) {
                            @for (error of exampleForm.selectedNodes().errors(); track error.kind) {
                                <p-message severity="error" size="small" variant="simple">{{ error.message }}</p-message>
                            }
                        }
                    </div>
                    <button pButton severity="secondary" type="submit"><span pButtonLabel>Submit</span></button>
                </form>
            </div>
            <app-code></app-code>
        </app-demo-wrapper>
    `
})
export class SignalFormsDoc {
    messageService = inject(MessageService);

    nodeService = inject(NodeService);

    formSubmitted = signal(false);

    nodes!: any[];

    model = signal<{ selectedNodes: TreeNode | null }>({ selectedNodes: null });

    exampleForm = form(this.model, (path) => {
        required(path.selectedNodes, { message: 'Selection is required.' });
    });

    constructor() {
        this.nodeService.getFiles().then((files) => (this.nodes = files));
    }

    onSubmit(event: Event) {
        event.preventDefault();
        this.formSubmitted.set(true);

        if (this.exampleForm().valid()) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form is submitted', life: 3000 });
            this.model.set({ selectedNodes: null });
            this.formSubmitted.set(false);
        }
    }

    isInvalid(field: FieldTree<TreeNode | null>) {
        const state = field();

        return state.invalid() && (state.touched() || this.formSubmitted());
    }
}
