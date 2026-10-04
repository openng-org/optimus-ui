import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Code } from '@/domain/code';
import { Component } from '@angular/core';
import { ButtonModule } from '@openng/optimus-ui/button';

@Component({
    selector: 'agentskill-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCode, ButtonModule],
    template: `
        <app-docsectiontext>
            <p>
                The markdown files above are also bundled as an <a href="https://agentskills.io" target="_blank" rel="noopener noreferrer" class="doc-link">Agent Skill</a>, the <i>SKILL.md</i> format supported by coding agents such as Claude Code,
                Codex and OpenCode. Once installed, the agent reads the component docs, API tables and guides from disk whenever it works on Optimus UI code, instead of fetching them from this site each time.
            </p>
            <p>Install it for your user with a single command. Run the same command again to update.</p>
            <app-code [code]="code" [hideToggleCode]="true"></app-code>
            <p>
                The script installs the skill into <i>~/.agents/skills/</i>, which Codex and OpenCode read, and into <i>~/.claude/skills/</i> when Claude Code is installed. Pass <i>--project</i> to install it into the current project's
                <i>.agents/skills/</i> and <i>.claude/skills/</i> instead, so your team gets it too, or <i>--dir</i> to choose the folder yourself. You can also download the zip and extract its <i>optimus-ui</i> folder into your agent's skills
                directory.
            </p>
            <a href="/llms/optimus-ui-skill.zip" download>
                <p-button label="Download optimus-ui-skill.zip" />
            </a>
        </app-docsectiontext>
    `
})
export class AgentSkillDoc {
    code: Code = {
        command: `curl -fsSL https://optimus.openng.org/llms/install-skill.sh | bash

# or, for the current project only
curl -fsSL https://optimus.openng.org/llms/install-skill.sh | bash -s -- --project`
    };
}
