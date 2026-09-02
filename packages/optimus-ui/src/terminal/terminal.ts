import { afterEveryRender, ChangeDetectionStrategy, Component, effect, ElementRef, HostListener, inject, input, NgModule, signal, ViewEncapsulation, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '@openng/optimus-ui/api';
import { BaseComponent, PARENT_INSTANCE } from '@openng/optimus-ui/basecomponent';
import { Bind } from '@openng/optimus-ui/bind';
import { TerminalPassThrough } from '@openng/optimus-ui/types/terminal';
import { Subscription } from 'rxjs';
import { TerminalStyle } from './style/terminalstyle';
import { TerminalService } from './terminalservice';

/**
 * Terminal is a text based user interface.
 * @group Components
 */
@Component({
    selector: 'p-terminal',
    standalone: true,
    imports: [FormsModule, SharedModule, Bind],
    template: `
        @if (welcomeMessage()) {
            <div [class]="cx('welcomeMessage')" [pBind]="ptm('welcomeMessage')">{{ welcomeMessage() }}</div>
        }
        <div [class]="cx('commandList')" [pBind]="ptm('commandList')">
            @for (command of commands(); track command) {
                <div [class]="cx('command')" [pBind]="ptm('command')">
                    <span [class]="cx('promptLabel')" [pBind]="ptm('promptLabel')">{{ prompt() }}</span>
                    <span [class]="cx('commandValue')" [pBind]="ptm('commandValue')">{{ command.text }}</span>
                    <div [class]="cx('commandResponse')" [pBind]="ptm('commandResponse')" [attr.aria-live]="'polite'">{{ command.response }}</div>
                </div>
            }
        </div>
        <div [class]="cx('prompt')" [pBind]="ptm('prompt')">
            <span [class]="cx('promptLabel')" [pBind]="ptm('promptLabel')">{{ prompt() }}</span>
            <input #in type="text" [(ngModel)]="command" [ngModelOptions]="{ standalone: true }" [class]="cx('promptValue')" [pBind]="ptm('promptValue')" autocomplete="off" (keydown)="handleCommand($event)" autofocus />
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [TerminalStyle, { provide: PARENT_INSTANCE, useExisting: Terminal }],
    host: {
        '[class]': "cx('root')"
    },
    hostDirectives: [Bind]
})
export class Terminal extends BaseComponent<TerminalPassThrough> {
    terminalService = inject(TerminalService);

    bindDirectiveInstance = inject(Bind, { self: true });

    _componentStyle = inject(TerminalStyle);

    /**
     * Initial text to display on terminal.
     * @group Props
     */
    readonly welcomeMessage = input<string>();

    /**
     * Prompt text for each command.
     * @group Props
     */
    readonly prompt = input<string>();

    /**
     * Response to display for the latest command.
     * @group Props
     */
    readonly response = input<string>();

    readonly inputRef = viewChild.required<ElementRef<HTMLInputElement>>('in');

    componentName = 'Terminal';

    readonly commands = signal<{ text: string; response?: string }[]>([]);

    command!: string;

    commandProcessed!: boolean;

    subscription: Subscription;

    constructor() {
        super();
        this.subscription = this.terminalService.responseHandler.subscribe((response) => {
            this.respond(response);
        });

        // React to the `response` input (replaces the former setter-based @Input).
        effect(() => {
            const response = this.response();
            if (response) {
                this.respond(response);
            }
        });

        // After each render: re-apply the host/root pass-through sections and keep the terminal
        // scrolled to the latest response (replaces the former ngAfterViewChecked hook).
        afterEveryRender(() => {
            this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));

            if (this.commandProcessed) {
                this.el.nativeElement.scrollTop = this.el.nativeElement.scrollHeight;
                this.commandProcessed = false;
            }
        });
    }

    onDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    @HostListener('click')
    onHostClick() {
        this.focus(this.inputRef().nativeElement);
    }

    private respond(response: string) {
        this.commands.update((commands) => {
            if (commands.length === 0) {
                return commands;
            }
            const updated = [...commands];
            updated[updated.length - 1] = { ...updated[updated.length - 1], response };
            return updated;
        });
        this.commandProcessed = true;
    }

    handleCommand(event: KeyboardEvent) {
        if (event.keyCode == 13) {
            this.commands.update((commands) => [...commands, { text: this.command }]);
            this.terminalService.sendCommand(this.command);
            this.command = '';
        }
    }

    focus(element: HTMLElement) {
        element.focus();
    }
}

@NgModule({
    exports: [Terminal, SharedModule],
    imports: [Terminal, SharedModule]
})
export class TerminalModule {}
