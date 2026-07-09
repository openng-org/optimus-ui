import { PROJECT_NAME } from '@/utils/constants';
import { Component, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { TerminalService } from 'primeng/terminal';
import { TerminalModule } from 'primeng/terminal';
import { Subscription } from 'rxjs';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { AppCode } from '@/components/doc/app.code';
import { AppDemoWrapper } from '@/components/doc/app.demowrapper';

@Component({
    selector: 'basic-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCode, TerminalModule, AppDemoWrapper],
    template: `
        <app-docsectiontext>
            <p>Commands are processed using observables via the <i>TerminalService</i>. Import this service into your component and subscribe to <i>commandHandler</i> to process commands by sending replies with <i>sendResponse</i> function.</p>
        </app-docsectiontext>
        <app-demo-wrapper>
            <p>Enter "<strong>date</strong>" to display the current date, "<strong>greet &#123;0&#125;</strong>" for a message and "<strong>random</strong>" to get a random number.</p>
            <p-terminal welcomeMessage="Welcome to {{ PROJECT_NAME }}" prompt="primeng $" />
            <app-code></app-code>
        </app-demo-wrapper>
    `,
    changeDetection: ChangeDetectionStrategy.Eager,
    providers: [TerminalService]
})
export class BasicDoc implements OnDestroy {
    PROJECT_NAME = PROJECT_NAME;

    subscription: Subscription;

    constructor(private terminalService: TerminalService) {
        this.subscription = this.terminalService.commandHandler.subscribe((text) => {
            let response;
            let argsIndex = text.indexOf(' ');
            let command = argsIndex !== -1 ? text.substring(0, argsIndex) : text;

            switch (command) {
                case 'date':
                    response = 'Today is ' + new Date().toDateString();
                    break;

                case 'greet':
                    response = 'Hola ' + text.substring(argsIndex + 1);
                    break;

                case 'random':
                    response = Math.floor(Math.random() * 100);
                    break;

                default:
                    response = 'Unknown command: ' + command;
            }
            this.terminalService.sendResponse(response);
        });
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
