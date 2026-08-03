import { McpSetupDoc } from '@/doc/mcp/setup-doc';
import { McpAuthenticationDoc } from '@/doc/mcp/authentication-doc';
import { Component } from '@angular/core';
import { AppDoc } from '@/components/doc/app.doc';

@Component({
    selector: 'mcp-demo',
    standalone: true,
    imports: [AppDoc],
    template: ` <app-doc docTitle="MCP Server - Optimus UI" header="MCP Server" description="Connect Claude Code, Cursor, VS Code and other MCP-compatible AI tools to the Optimus UI documentation." [docs]="docs" docType="page"></app-doc> `
})
export class MCPDemo {
    docs = [
        {
            id: 'setup',
            label: 'Setup',
            component: McpSetupDoc
        },
        {
            id: 'authentication',
            label: 'Authentication',
            component: McpAuthenticationDoc
        }
    ];
}
