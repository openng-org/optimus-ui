import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Component } from '@angular/core';

@Component({
    selector: 'mcp-authentication-doc',
    standalone: true,
    imports: [AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                The first time your AI tool calls the server, it opens a browser tab and asks you to sign in with <b>Google</b> or <b>GitHub</b>. This is expected — the server is public, and the sign-in step exists only to keep it from being abused,
                not to gate the content behind an account.
            </p>
            <ul class="leading-relaxed">
                <li><b>Google</b> — requests only the <i>openid</i> scope. It reads a stable, opaque user id and never touches your email or profile.</li>
                <li><b>GitHub</b> — requests no scopes at all. It reads your GitHub user id, used purely for rate limiting, with no access to your repositories or organizations.</li>
            </ul>
            <p>Approve once and the session is remembered by your client, so this prompt shouldn't reappear on every call.</p>
            <h3>Rate limits</h3>
            <p>Limits are generous for normal documentation lookups and apply per signed-in user:</p>
            <div class="doc-tablewrapper">
                <table class="doc-table">
                    <thead>
                        <tr>
                            <th>Tool</th>
                            <th>Per-user limit</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Search</td>
                            <td>300 requests / day</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </app-docsectiontext>
    `
})
export class McpAuthenticationDoc {}
