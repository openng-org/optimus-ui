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
                Codex, Cursor and OpenCode. Once installed, the agent reads the component docs, API tables and guides from disk whenever it works on Optimus UI code, instead of fetching them from this site each time.
            </p>
            <p>Install it with the <a href="https://skills.sh/docs/cli" target="_blank" rel="noopener noreferrer" class="doc-link">skills CLI</a>, which asks which agents to set it up for.</p>
            <app-code [code]="code" [hideToggleCode]="true"></app-code>
            <p>
                By default the skill is installed into the current project, so your team gets it too. Add <i>-g</i> to install it for your user instead. You can also download the zip and extract it into a folder named <i>optimus-ui</i> in your
                agent's skills directory.
            </p>
            <a href="/llms/optimus-ui-skill.zip" download>
                <p-button label="Download optimus-ui-skill.zip" />
            </a>
        </app-docsectiontext>
    `
})
export class AgentSkillDoc {
    code: Code = {
        command: `npx skills add https://optimus.openng.org

# update to the latest docs
npx skills update optimus-ui`
    };
}
