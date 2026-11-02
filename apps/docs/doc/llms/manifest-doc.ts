import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Code } from '@/domain/code';
import { Component } from '@angular/core';

@Component({
    selector: 'manifest-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCode],
    template: `
        <app-docsectiontext>
            <p>
                <a href="/llms/manifest.json" target="_blank" class="doc-link">/llms/manifest.json</a> is the single source the files above, the Agent Skill and the MCP server are generated from. Use it for tools that need exact facts rather than
                prose, such as code generators, linters and design tool integrations.
            </p>
            <p>It joins two sources, each read from where it is defined:</p>
            <ul>
                <li>
                    <i>entryPoints</i>: the API, read from the Angular metadata in the compiled library, so selectors and inputs match what the compiler accepts. Each entry point lists its import path, NgModule, services, exported types, and per
                    component or directive its selector, inputs (type, allowed values, default, transform, two-way binding), outputs, templates, methods, forms support and pass-through keys.
                </li>
                <li><i>components</i> and <i>guides</i>: the documentation pages with their sections and example code, linked to the entry points they document, and the design tokens of each component.</li>
            </ul>
            <app-code [code]="code" [hideToggleCode]="true"></app-code>
        </app-docsectiontext>
    `
})
export class ManifestDoc {
    code: Code = {
        typescript: `{
  "schemaVersion": 1,
  "components": [{ "name": "button", "title": "Button", "entryPoints": ["button"], "sections": [...], "tokens": [{ "name": "button.primary.background", "variable": "--p-button-primary-background" }] }],
  "entryPoints": [
    {
      "name": "button",
      "import": "@openng/optimus-ui/button",
      "modules": ["ButtonModule"],
      "declarations": [
        {
          "kind": "component",
          "className": "Button",
          "selector": "p-button",
          "inputs": [
            { "name": "severity", "type": "ButtonSeverity", "values": ["success", "info", "warn", "danger", "secondary", "contrast", "help", "primary"] },
            { "name": "raised", "type": "boolean", "default": "false", "transform": "booleanAttribute" }
          ],
          "outputs": [{ "name": "onClick", "payload": "MouseEvent" }],
          "templates": [{ "name": "icon", "context": "ButtonIconTemplateContext" }]
        }
      ]
    }
  ]
}`
    };
}
