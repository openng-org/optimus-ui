import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Code } from '@/domain/code';
import { Component } from '@angular/core';

@Component({
    selector: 'mcp-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCode],
    template: `
        <app-docsectiontext>
            <p>
                <i>&#64;openng/optimus-ui-mcp</i> is a <a href="https://modelcontextprotocol.io" target="_blank" rel="noopener noreferrer" class="doc-link">Model Context Protocol</a> server that lets coding agents look up Optimus UI while they work:
                components by name or selector, their inputs, outputs and templates, the code of every docs example, types such as <i>MenuItem</i> and the guides. It runs locally over stdio and ships the manifest of its release, so it works offline
                and matches the version you install.
            </p>
            <p>Register it with your agent, for example Claude Code:</p>
            <app-code [code]="claudeCode" [hideToggleCode]="true"></app-code>
            <p>Or add it to the MCP configuration of Cursor, VS Code, Windsurf or another client:</p>
            <app-code [code]="config" [hideToggleCode]="true"></app-code>
            <p>The tools are <i>search</i>, <i>list_components</i>, <i>get_component</i>, <i>get_example</i>, <i>get_type</i> and <i>get_guide</i>. The Agent Skill above covers the same content as files; use either, or both.</p>
        </app-docsectiontext>
    `
})
export class McpDoc {
    claudeCode: Code = {
        command: `claude mcp add optimus-ui -- npx -y @openng/optimus-ui-mcp`
    };

    config: Code = {
        typescript: `{
  "mcpServers": {
    "optimus-ui": {
      "command": "npx",
      "args": ["-y", "@openng/optimus-ui-mcp"]
    }
  }
}`
    };
}
