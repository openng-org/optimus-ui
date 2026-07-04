import { PROJECT_NAME } from '@/utils/constants';
import { IntroductionDoc } from '@/doc/mcp/introduction-doc';
import { ClaudeCodeDoc } from '@/doc/mcp/claudecode-doc';
import { VSCodeDoc } from '@/doc/mcp/vscode-doc';
import { OpenAICodexDoc } from '@/doc/mcp/openaicodex-doc';
import { CursorDoc } from '@/doc/mcp/cursor-doc';
import { WindsurfDoc } from '@/doc/mcp/windsurf-doc';
import { ZedDoc } from '@/doc/mcp/zed-doc';
import { ToolsDoc } from '@/doc/mcp/tools-doc';
import { ExamplePromptsDoc } from '@/doc/mcp/exampleprompts-doc';
import { Component } from '@angular/core';
import { AppDoc } from '@/components/doc/app.doc';

@Component({
    selector: 'mcp-demo',
    standalone: true,
    imports: [AppDoc],
    template: `
        <app-doc
            docTitle="MCP Server - {{ PROJECT_NAME }}"
            header="MCP Server"
            description="Model Context Protocol (MCP) server for {{ PROJECT_NAME }} component library. Provides AI assistants with comprehensive access to {{ PROJECT_NAME }} component documentation."
            [docs]="docs"
            docType="page"
        ></app-doc>
    `
})
export class MCPDemo {
    PROJECT_NAME = PROJECT_NAME;

    docs = [
        {
            id: 'introduction',
            label: 'Introduction',
            component: IntroductionDoc
        },
        {
            id: 'installation',
            label: 'Installation',
            children: [
                {
                    id: 'claudecode',
                    label: 'Claude Code',
                    component: ClaudeCodeDoc
                },
                {
                    id: 'vscode',
                    label: 'VS Code',
                    component: VSCodeDoc
                },
                {
                    id: 'openaicodex',
                    label: 'OpenAI Codex',
                    component: OpenAICodexDoc
                },
                {
                    id: 'cursor',
                    label: 'Cursor',
                    component: CursorDoc
                },
                {
                    id: 'windsurf',
                    label: 'Windsurf',
                    component: WindsurfDoc
                },
                {
                    id: 'zed',
                    label: 'Zed',
                    component: ZedDoc
                }
            ]
        },
        {
            id: 'tools',
            label: 'Available Tools',
            component: ToolsDoc
        },
        {
            id: 'examples',
            label: 'Example Prompts',
            component: ExamplePromptsDoc
        }
    ];
}
