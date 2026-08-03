import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Code } from '@/domain/code';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'mcp-setup-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCode, RouterModule],
    template: `
        <app-docsectiontext>
            <p>
                In addition to <a [routerLink]="'/llms'" class="doc-link">llms.txt</a>, the Optimus UI documentation is available over the
                <a href="https://modelcontextprotocol.io/" target="_blank" rel="noopener noreferrer">Model Context Protocol</a> (MCP). Connecting an MCP-compatible AI tool or editor to this server lets it search the documentation directly and pull
                back up-to-date, relevant answers instead of relying on what it already knows.
            </p>
            <p>Add the server to your client's MCP configuration:</p>
            <app-code [code]="code" [hideToggleCode]="true" [hideStackBlitz]="true"></app-code>
            <p>
                This works with any MCP-compatible client, including <b>Claude Code</b>, <b>Claude</b>, <b>Cursor</b>, <b>VS Code</b> and <b>ChatGPT</b>. Exact setup steps differ slightly per client — most read <i>mcpServers</i> from a project or
                user level settings file, some offer a UI to add a server by URL instead.
            </p>
            <p>Once connected, the server exposes a search tool that returns relevant documentation chunks with their source URLs, plus a feedback tool your AI tool can use to report gaps or issues back to us.</p>
        </app-docsectiontext>
    `
})
export class McpSetupDoc {
    code: Code = {
        typescript: `{
    "mcpServers": {
        "kapa": {
            "type": "http",
            "url": "https://optimus-ui.mcp.kapa.ai"
        }
    }
}`
    };
}
