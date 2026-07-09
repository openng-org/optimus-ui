/**
 * @primeuix/mcp - Guide/documentation-related tool factories
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { getGuideContent } from '../helpers.js';
import type { ComponentsData, PrimeMcpConfig } from '../types.js';

/**
 * Register all guide-related tools on the MCP server
 */
export function registerGuideTools(server: McpServer, data: ComponentsData, config: PrimeMcpConfig): void {
    // list_guides
    server.registerTool(
        'list_guides',
        {
            description: `List all available ${config.frameworkName} guides and documentation pages`
        },
        async () => {
            if (!data.pages || data.pages.length === 0) {
                return {
                    content: [{ type: 'text', text: 'No guides available.' }]
                };
            }

            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(
                            {
                                total: data.pages.length,
                                guides: data.pages.map((p) => ({
                                    name: p.name,
                                    title: p.title,
                                    description: p.description
                                }))
                            },
                            null,
                            2
                        )
                    }
                ]
            };
        }
    );

    // get_guide
    server.registerTool(
        'get_guide',
        {
            description: `Get a specific ${config.frameworkName} guide by name`,
            inputSchema: {
                name: z.string().describe('Guide name'),
                section: z.string().optional().describe('Optional section ID within the guide')
            }
        },
        async ({ name, section }) => {
            const content = getGuideContent(data, config, name as string, section as string | undefined);

            return {
                content: [{ type: 'text', text: content }]
            };
        }
    );

    // get_configuration
    server.registerTool(
        'get_configuration',
        {
            description: `Get ${config.frameworkName} application-wide configuration options (ripple, zIndex, locale, PT options, etc.)`,
            inputSchema: {
                section: z.string().optional().describe("Optional section: 'csp', 'dynamic', 'filtermode', 'locale', 'ripple', 'zindex', etc.")
            }
        },
        async ({ section }) => {
            try {
                const content = getGuideContent(data, config, 'configuration', section as string | undefined);

                return {
                    content: [{ type: 'text', text: content }]
                };
            } catch {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Configuration guide not available. Visit ${config.baseUrl}/configuration for more information.`
                        }
                    ]
                };
            }
        }
    );

    // get_tailwind_guide
    server.registerTool(
        'get_tailwind_guide',
        {
            description: `Get guide for integrating ${config.frameworkName} with Tailwind CSS`,
            inputSchema: {
                section: z.string().optional().describe("Optional section: 'overview', 'darkmode', 'animations', 'colorpalette', etc.")
            }
        },
        async ({ section }) => {
            try {
                const content = getGuideContent(data, config, 'tailwind', section as string | undefined);

                return {
                    content: [{ type: 'text', text: content }]
                };
            } catch {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Tailwind guide not available. Visit ${config.baseUrl}/tailwind for more information.`
                        }
                    ]
                };
            }
        }
    );

    // get_icons_guide
    server.registerTool(
        'get_icons_guide',
        {
            description: `Get guide for using icons in ${config.frameworkName} (PrimeIcons, custom icons, FontAwesome, Material)`,
            inputSchema: {
                type: z.string().optional().describe("Icon type: 'primeicons' (default) or 'custom' (FontAwesome, Material, SVG)")
            }
        },
        async ({ type }) => {
            const iconType = ((type as string) || 'primeicons').toLowerCase();
            const guideName = iconType === 'custom' ? 'customicons' : 'icons';

            try {
                const content = getGuideContent(data, config, guideName);

                return {
                    content: [{ type: 'text', text: content }]
                };
            } catch {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Icons guide not available. Visit ${config.baseUrl}/icons for more information.`
                        }
                    ]
                };
            }
        }
    );

    // get_accessibility_guide
    server.registerTool(
        'get_accessibility_guide',
        {
            description: `Get ${config.frameworkName} accessibility guide (WCAG compliance, ARIA, screen readers)`
        },
        async () => {
            try {
                const content = getGuideContent(data, config, 'accessibility');

                return {
                    content: [{ type: 'text', text: content }]
                };
            } catch {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `# ${config.frameworkName} Accessibility

${config.frameworkName} components are designed with accessibility in mind, following WAI-ARIA guidelines.

## Key Features
- Keyboard navigation support
- Screen reader compatibility
- ARIA attributes and roles
- Focus management
- High contrast support

For detailed accessibility docs, visit: ${config.baseUrl}/accessibility`
                        }
                    ]
                };
            }
        }
    );

    // get_theming_info
    server.registerTool(
        'get_theming_info',
        {
            description: `Get information about ${config.frameworkName} theming`,
            inputSchema: {
                mode: z.string().optional().describe("Theming mode: 'styled', 'unstyled', or 'passthrough'. Defaults to 'styled'")
            }
        },
        async ({ mode }) => {
            const modeStr = ((mode as string) || 'styled').toLowerCase();

            let info = `# ${config.frameworkName} Theming\n\n`;

            if (modeStr === 'unstyled') {
                info += `## Unstyled Mode\n\nUse unstyled mode for complete control over styling.\n\n`;

                if (config.slotKey === 'slots') {
                    info += `\`\`\`javascript\napp.use(PrimeVue, { unstyled: true })\n\`\`\`\n`;
                } else {
                    info += `\`\`\`typescript\nprovidePrimeNG({ unstyled: true })\n\`\`\`\n`;
                }
            } else if (modeStr === 'passthrough') {
                info += `## Pass Through (PT)\n\nPT allows fine-grained control over DOM elements.\n\n`;

                if (config.slotKey === 'slots') {
                    info += `\`\`\`vue\n<Button :pt="{ root: { class: 'my-class' } }" />\n\`\`\`\n`;
                } else {
                    info += `\`\`\`html\n<p-button [pt]="{ root: { class: 'my-class' } }" />\n\`\`\`\n`;
                }
            } else {
                info += `## Styled Mode (Default)\n\nPre-skinned components with design tokens. Available presets: Aura, Lara, Nora, Material\n\n`;

                if (config.slotKey === 'slots') {
                    info += `\`\`\`javascript\nimport Aura from '@primevue/themes/aura'\napp.use(PrimeVue, { theme: { preset: Aura } })\n\`\`\`\n`;
                } else {
                    info += `\`\`\`typescript\nimport Aura from '@primeng/themes/aura';\nprovidePrimeNG({ theme: { preset: Aura } })\n\`\`\`\n`;
                }
            }

            info += `\nFor detailed docs: ${config.baseUrl}/theming`;

            return {
                content: [{ type: 'text', text: info }]
            };
        }
    );

    // get_theming_guide (alias with mode parameter)
    server.registerTool(
        'get_theming_guide',
        {
            description: `Get detailed ${config.frameworkName} theming guide (styled mode, unstyled mode, design tokens)`,
            inputSchema: {
                mode: z.string().optional().describe("Theming mode: 'styled' (default), 'unstyled'")
            }
        },
        async ({ mode }) => {
            const guideName = (mode as string) === 'unstyled' ? 'unstyled' : 'styled';

            try {
                const content = getGuideContent(data, config, guideName);

                return {
                    content: [{ type: 'text', text: content }]
                };
            } catch {
                // Fall back to theming info
                const modeStr = guideName;
                let info = `# ${config.frameworkName} ${modeStr === 'unstyled' ? 'Unstyled' : 'Styled'} Mode\n\n`;

                info += `For detailed docs, visit: ${config.baseUrl}/${guideName}`;

                return {
                    content: [{ type: 'text', text: info }]
                };
            }
        }
    );

    // get_passthrough_guide
    server.registerTool(
        'get_passthrough_guide',
        {
            description: `Get guide for using Pass Through (PT) to customize ${config.frameworkName} component DOM elements`,
            inputSchema: {
                section: z.string().optional().describe("Optional section: 'basic', 'global', 'instance', 'lifecycle', etc.")
            }
        },
        async ({ section }) => {
            try {
                const content = getGuideContent(data, config, 'passthrough', section as string | undefined);

                return {
                    content: [{ type: 'text', text: content }]
                };
            } catch {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Pass Through (PT) guide not available. Visit ${config.baseUrl}/passthrough for more information.`
                        }
                    ]
                };
            }
        }
    );

    // get_installation
    if (config.slotKey === 'slots') {
        // Vue installation with environment option
        server.registerTool(
            'get_installation',
            {
                description: `Get ${config.frameworkName} installation instructions`,
                inputSchema: {
                    environment: z.string().optional().describe("Environment/framework: 'vite', 'nuxt', 'laravel', or 'cdn'. Defaults to 'vite'")
                }
            },
            async ({ environment }) => {
                const env = ((environment as string) || 'vite').toLowerCase();
                let guide = `# ${config.frameworkName} Installation\n\n`;

                if (env === 'nuxt') {
                    guide += `## Nuxt 3\n\n\`\`\`bash\nnpm install primevue @primevue/themes\n\`\`\`\n\nAdd to nuxt.config.ts:\n\`\`\`typescript\nexport default defineNuxtConfig({ modules: ['@primevue/nuxt-module'] })\n\`\`\`\n`;
                } else if (env === 'cdn') {
                    guide += `## CDN\n\n\`\`\`html\n<script src="https://unpkg.com/primevue/core/core.min.js"></script>\n\`\`\`\n`;
                } else {
                    guide += `## Vite\n\n\`\`\`bash\nnpm install primevue @primevue/themes\n\`\`\`\n\nSetup in main.ts:\n\`\`\`typescript\nimport { createApp } from 'vue'\nimport PrimeVue from 'primevue/config'\nimport Aura from '@primevue/themes/aura'\n\nconst app = createApp(App)\napp.use(PrimeVue, { theme: { preset: Aura } })\n\`\`\`\n`;
                }

                guide += `\nFor detailed instructions: ${config.baseUrl}/installation`;

                return { content: [{ type: 'text', text: guide }] };
            }
        );
    } else {
        // Angular installation (no environment option)
        server.registerTool(
            'get_installation',
            {
                description: `Get ${config.frameworkName} installation instructions`
            },
            async () => {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `# ${config.frameworkName} Installation

## NPM
\`\`\`bash
npm install primeng @primeng/themes
\`\`\`

## Yarn
\`\`\`bash
yarn add primeng @primeng/themes
\`\`\`

## PNPM
\`\`\`bash
pnpm add primeng @primeng/themes
\`\`\`

## Setup (Angular)

### app.config.ts
\`\`\`typescript
import { ApplicationConfig } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura
      }
    })
  ]
};
\`\`\`

### Using a Component
\`\`\`typescript
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ButtonModule],
  template: '<p-button label="Click me" />'
})
export class AppComponent {}
\`\`\`

For detailed installation, visit: ${config.baseUrl}/installation
`
                        }
                    ]
                };
            }
        );
    }
}
