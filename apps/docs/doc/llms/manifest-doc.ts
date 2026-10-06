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
                <a href="/llms/manifest.json" target="_blank" class="doc-link">/llms/manifest.json</a> describes every component, directive, NgModule, service and exported type as structured data, for tools that need exact facts rather than prose:
                MCP servers, code generators, linters and design tool integrations. It is generated from the Angular metadata in the compiled library, so selectors and inputs match what the compiler accepts.
            </p>
            <p>
                Each entry point lists its import path, NgModule, services and exported types. Each component or directive lists its selector, inputs with type, allowed values, default, transform and two-way binding, outputs with payload type,
                templates with their context type, methods, forms support and pass-through keys.
            </p>
            <app-code [code]="code" [hideToggleCode]="true"></app-code>
        </app-docsectiontext>
    `
})
export class ManifestDoc {
    code: Code = {
        typescript: `{
  "schemaVersion": 1,
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
