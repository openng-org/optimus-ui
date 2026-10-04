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
            <p>The zip contains a single <i>optimus-ui</i> folder. Extract it into the skills directory of your agent:</p>
            <ul class="leading-relaxed">
                <li><i>~/.agents/skills/</i> for Codex and OpenCode, or <i>.agents/skills/</i> in a project to share it with your team</li>
                <li><i>~/.claude/skills/</i> for Claude Code, or <i>.claude/skills/</i> in a project</li>
            </ul>
            <app-code [code]="code" [hideToggleCode]="true"></app-code>
            <a href="/llms/optimus-ui-skill.zip" download>
                <p-button label="Download optimus-ui-skill.zip" />
            </a>
        </app-docsectiontext>
    `
})
export class AgentSkillDoc {
    code: Code = {
        command: `curl -sSL https://optimus.openng.org/llms/optimus-ui-skill.zip -o optimus-ui-skill.zip

# Codex, OpenCode and other agents that read ~/.agents/skills
unzip -o optimus-ui-skill.zip -d ~/.agents/skills/

# Claude Code
unzip -o optimus-ui-skill.zip -d ~/.claude/skills/`
    };
}
