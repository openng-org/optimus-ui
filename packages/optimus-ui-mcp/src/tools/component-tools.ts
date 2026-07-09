/**
 * @primemcp/core - Component-related tool factories
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { extractCategory, findComponent, getSlotsOrTemplates, getSlotsOrTemplatesCount } from '../helpers.js';
import type { ComponentsData, PrimeMcpConfig } from '../types.js';

/**
 * Register all component-related tools on the MCP server
 */
export function registerComponentTools(server: McpServer, data: ComponentsData, config: PrimeMcpConfig): void {
    const slotLabel = config.slotKey === 'slots' ? 'slots' : 'templates';

    // list_components
    server.registerTool(
        'list_components',
        {
            description: `List all available ${config.frameworkName} components with their categories`,
            inputSchema: {
                category: z.string().optional().describe('Optional category filter')
            }
        },
        async ({ category }) => {
            const grouped = data.components.reduce(
                (acc, comp) => {
                    const cat = extractCategory(comp);

                    if (category && cat.toLowerCase() !== (category as string).toLowerCase()) {
                        return acc;
                    }

                    if (!acc[cat]) acc[cat] = [];
                    acc[cat].push(comp.name);

                    return acc;
                },
                {} as Record<string, string[]>
            );

            return {
                content: [{ type: 'text', text: JSON.stringify(grouped, null, 2) }]
            };
        }
    );

    // get_component
    server.registerTool(
        'get_component',
        {
            description: `Get detailed information about a specific ${config.frameworkName} component`,
            inputSchema: {
                name: z.string().describe("Component name (e.g., 'DataTable', 'Button')")
            }
        },
        async ({ name }) => {
            const component = findComponent(data, name as string);
            const category = extractCategory(component);

            const stats: Record<string, number> = {
                props_count: component.api.props?.length || 0,
                events_count: component.api.emits?.length || 0,
                [`${slotLabel}_count`]: getSlotsOrTemplatesCount(component, config.slotKey),
                sections_count: component.sections.length,
                pt_count: component.api.pt?.length || 0
            };

            if (config.slotKey === 'templates' && component.api.methods) {
                stats.methods_count = component.api.methods.length;
            }

            const summary = {
                name: component.name,
                title: component.title,
                description: component.description,
                category,
                url: `${config.baseUrl}/${component.name.toLowerCase()}`,
                stats,
                props_preview: (component.api.props || []).slice(0, 5).map((p) => ({
                    name: p.name,
                    type: p.type,
                    description: p.description
                })),
                sections: component.sections.map((s) => ({
                    id: s.id,
                    label: s.label,
                    has_examples: s.examples !== null
                }))
            };

            return {
                content: [{ type: 'text', text: JSON.stringify(summary, null, 2) }]
            };
        }
    );

    // search_components
    server.registerTool(
        'search_components',
        {
            description: `Search ${config.frameworkName} components by name or description`,
            inputSchema: {
                query: z.string().describe('Search query')
            }
        },
        async ({ query }) => {
            const results = data.components.filter(
                (c) => c.name.toLowerCase().includes((query as string).toLowerCase()) || c.description.toLowerCase().includes((query as string).toLowerCase()) || c.title.toLowerCase().includes((query as string).toLowerCase())
            );

            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(
                            results.map((c) => ({
                                name: c.name,
                                title: c.title,
                                description: c.description
                            })),
                            null,
                            2
                        )
                    }
                ]
            };
        }
    );

    // get_component_props
    server.registerTool(
        'get_component_props',
        {
            description: `Get all props/properties for a ${config.frameworkName} component`,
            inputSchema: {
                component: z.string().describe('Component name')
            }
        },
        async ({ component }) => {
            const comp = findComponent(data, component as string);

            return {
                content: [{ type: 'text', text: JSON.stringify(comp.api.props || [], null, 2) }]
            };
        }
    );

    // get_component_events
    server.registerTool(
        'get_component_events',
        {
            description: `Get all events for a ${config.frameworkName} component`,
            inputSchema: {
                component: z.string().describe('Component name')
            }
        },
        async ({ component }) => {
            const comp = findComponent(data, component as string);

            return {
                content: [{ type: 'text', text: JSON.stringify(comp.api.emits || [], null, 2) }]
            };
        }
    );

    // get_component_methods (primarily for Angular/PrimeNG)
    server.registerTool(
        'get_component_methods',
        {
            description: `Get all methods for a ${config.frameworkName} component`,
            inputSchema: {
                component: z.string().describe('Component name')
            }
        },
        async ({ component }) => {
            const comp = findComponent(data, component as string);

            if (comp.api.methods && comp.api.methods.length > 0) {
                return {
                    content: [{ type: 'text', text: JSON.stringify(comp.api.methods, null, 2) }]
                };
            }

            // Fall back to checking sections for methods
            const methodsSection = comp.sections.find((s) => s.id.includes('method'));

            return {
                content: [
                    {
                        type: 'text',
                        text: methodsSection ? JSON.stringify({ description: methodsSection.description, examples: methodsSection.examples }, null, 2) : `No methods documented for ${comp.name}.`
                    }
                ]
            };
        }
    );

    // get_component_slots
    server.registerTool(
        'get_component_slots',
        {
            description: `Get all ${slotLabel} for a ${config.frameworkName} component`,
            inputSchema: {
                component: z.string().describe('Component name')
            }
        },
        async ({ component }) => {
            const comp = findComponent(data, component as string);
            const slotsData = getSlotsOrTemplates(comp, config.slotKey);

            return {
                content: [{ type: 'text', text: JSON.stringify(slotsData || [], null, 2) }]
            };
        }
    );

    // get_usage_example
    server.registerTool(
        'get_usage_example',
        {
            description: `Get code examples for a ${config.frameworkName} component`,
            inputSchema: {
                component: z.string().describe('Component name')
            }
        },
        async ({ component }) => {
            const comp = findComponent(data, component as string);
            const examples: { section: string; label: string; examples: Record<string, string> }[] = [];

            comp.sections.forEach((section) => {
                if (section.examples) {
                    examples.push({ section: section.id, label: section.label, examples: section.examples });
                }
            });

            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(
                            {
                                component: comp.name,
                                total_sections_with_examples: examples.length,
                                documentation_url: `${config.baseUrl}/${comp.name.toLowerCase()}`,
                                examples
                            },
                            null,
                            2
                        )
                    }
                ]
            };
        }
    );

    // get_component_pt
    server.registerTool(
        'get_component_pt',
        {
            description: `Get Pass Through (PT) options for a ${config.frameworkName} component to customize DOM elements`,
            inputSchema: {
                component: z.string().describe('Component name')
            }
        },
        async ({ component }) => {
            const comp = findComponent(data, component as string);
            const pt = comp.api.pt || [];

            if (pt.length === 0) {
                return {
                    content: [{ type: 'text', text: `No Pass Through (PT) options documented for ${comp.name}.` }]
                };
            }

            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(
                            {
                                component: comp.name,
                                description: 'Pass Through (PT) allows customizing DOM elements',
                                pt_options: pt
                            },
                            null,
                            2
                        )
                    }
                ]
            };
        }
    );

    // get_component_tokens
    server.registerTool(
        'get_component_tokens',
        {
            description: `Get design tokens (CSS variables) for a ${config.frameworkName} component`,
            inputSchema: {
                component: z.string().describe('Component name')
            }
        },
        async ({ component }) => {
            const comp = findComponent(data, component as string);
            const tokens = comp.api.tokens || [];

            if (tokens.length === 0) {
                return {
                    content: [{ type: 'text', text: `No design tokens documented for ${comp.name}.` }]
                };
            }

            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify({ component: comp.name, total_tokens: tokens.length, tokens }, null, 2)
                    }
                ]
            };
        }
    );

    // get_component_styles
    server.registerTool(
        'get_component_styles',
        {
            description: `Get CSS class names for a ${config.frameworkName} component`,
            inputSchema: {
                component: z.string().describe('Component name')
            }
        },
        async ({ component }) => {
            const comp = findComponent(data, component as string);
            const styles = comp.api.styles || [];

            if (styles.length === 0) {
                return {
                    content: [{ type: 'text', text: `No CSS classes documented for ${comp.name}.` }]
                };
            }

            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify({ component: comp.name, total_classes: styles.length, styles }, null, 2)
                    }
                ]
            };
        }
    );

    // find_by_prop
    server.registerTool(
        'find_by_prop',
        {
            description: `Find ${config.frameworkName} components that have a specific prop`,
            inputSchema: {
                prop_name: z.string().describe('Property name to search for')
            }
        },
        async ({ prop_name }) => {
            const propNameLower = (prop_name as string).toLowerCase();
            const results = data.components.filter((c) => (c.api.props || []).some((p) => p.name.toLowerCase() === propNameLower));

            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(
                            results.map((c) => c.name),
                            null,
                            2
                        )
                    }
                ]
            };
        }
    );

    // find_by_event
    server.registerTool(
        'find_by_event',
        {
            description: `Find ${config.frameworkName} components that emit a specific event`,
            inputSchema: {
                event_name: z.string().describe('Event name to search for')
            }
        },
        async ({ event_name }) => {
            const eventNameLower = (event_name as string).toLowerCase();
            const results = data.components.filter((c) => (c.api.emits || []).some((e) => e.name.toLowerCase() === eventNameLower));

            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(
                            results.map((c) => c.name),
                            null,
                            2
                        )
                    }
                ]
            };
        }
    );

    // get_component_url
    server.registerTool(
        'get_component_url',
        {
            description: `Get the official documentation URL for a ${config.frameworkName} component`,
            inputSchema: {
                component: z.string().describe('Component name')
            }
        },
        async ({ component }) => {
            const comp = findComponent(data, component as string);

            return {
                content: [{ type: 'text', text: `${config.baseUrl}/${comp.name.toLowerCase()}` }]
            };
        }
    );

    // compare_components
    server.registerTool(
        'compare_components',
        {
            description: `Compare two ${config.frameworkName} components side by side`,
            inputSchema: {
                component1: z.string().describe('First component name'),
                component2: z.string().describe('Second component name')
            }
        },
        async ({ component1, component2 }) => {
            const comp1 = findComponent(data, component1 as string);
            const comp2 = findComponent(data, component2 as string);

            const comparison = {
                component1: {
                    name: comp1.name,
                    props_count: comp1.api.props?.length || 0,
                    events_count: comp1.api.emits?.length || 0,
                    [`${slotLabel}_count`]: getSlotsOrTemplatesCount(comp1, config.slotKey)
                },
                component2: {
                    name: comp2.name,
                    props_count: comp2.api.props?.length || 0,
                    events_count: comp2.api.emits?.length || 0,
                    [`${slotLabel}_count`]: getSlotsOrTemplatesCount(comp2, config.slotKey)
                },
                common_props: (comp1.api.props || []).filter((p1) => (comp2.api.props || []).some((p2) => p2.name === p1.name)).map((p) => p.name)
            };

            return {
                content: [{ type: 'text', text: JSON.stringify(comparison, null, 2) }]
            };
        }
    );

    // get_categories
    server.registerTool(
        'get_categories',
        {
            description: `Get all ${config.frameworkName} component categories`
        },
        async () => {
            const categories = [...new Set(data.components.map((c) => extractCategory(c)))];

            return {
                content: [{ type: 'text', text: JSON.stringify(categories, null, 2) }]
            };
        }
    );

    // get_version_info
    server.registerTool(
        'get_version_info',
        {
            description: `Get ${config.frameworkName} version and compatibility information`
        },
        async () => {
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(
                            {
                                framework: config.frameworkName.toLowerCase(),
                                version: data.version,
                                generated_at: data.generatedAt,
                                components_count: data.components.length,
                                pages_count: data.pages?.length || 0,
                                compatibility: config.compatibility
                            },
                            null,
                            2
                        )
                    }
                ]
            };
        }
    );

    // get_component_sections
    server.registerTool(
        'get_component_sections',
        {
            description: `Get all available sections/features for a ${config.frameworkName} component with examples`,
            inputSchema: {
                component: z.string().describe('Component name')
            }
        },
        async ({ component }) => {
            const comp = findComponent(data, component as string);
            const sections = comp.sections.map((s) => ({
                id: s.id,
                label: s.label,
                description: s.description.slice(0, 150) + (s.description.length > 150 ? '...' : ''),
                has_examples: s.examples !== null,
                example_variants: s.examples ? Object.keys(s.examples) : []
            }));

            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify({ component: comp.name, total_sections: sections.length, sections }, null, 2)
                    }
                ]
            };
        }
    );

    // get_component_import
    server.registerTool(
        'get_component_import',
        {
            description: `Get the correct import statement for a ${config.frameworkName} component`,
            inputSchema: {
                component: z.string().describe('Component name')
            }
        },
        async ({ component }) => {
            const comp = findComponent(data, component as string);
            const importSection = comp.sections.find((s) => s.id === 'import');

            let importCode = '';

            if (importSection?.examples?.basic) {
                importCode = importSection.examples.basic;
            } else if (importSection?.examples?.typescript) {
                importCode = importSection.examples.typescript;
            } else {
                // Generate default import based on framework
                const pascalName = comp.name.charAt(0).toUpperCase() + comp.name.slice(1);

                if (config.slotKey === 'slots') {
                    // Vue style
                    importCode = `import ${pascalName} from 'primevue/${comp.name.toLowerCase()}';`;
                } else {
                    // Angular style
                    importCode = `import { ${pascalName}Module } from 'primeng/${comp.name.toLowerCase()}';`;
                }
            }

            return {
                content: [
                    {
                        type: 'text',
                        text: `# Import ${comp.title}\n\n\`\`\`${config.codeLanguage}\n${importCode}\n\`\`\`\n\n**Documentation:** ${config.baseUrl}/${comp.name.toLowerCase()}`
                    }
                ]
            };
        }
    );

    // get_accessibility_info
    server.registerTool(
        'get_accessibility_info',
        {
            description: `Get accessibility information for a ${config.frameworkName} component`,
            inputSchema: {
                component: z.string().describe('Component name')
            }
        },
        async ({ component }) => {
            const comp = findComponent(data, component as string);
            const accessibilitySection = comp.sections.find((s) => s.id === 'accessibility');

            if (accessibilitySection) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `# Accessibility for ${comp.name}\n\n${accessibilitySection.description}\n\nFor detailed accessibility docs, visit: ${config.baseUrl}/${comp.name.toLowerCase()}#accessibility`
                        }
                    ]
                };
            }

            return {
                content: [
                    {
                        type: 'text',
                        text: `Accessibility information for ${comp.name}:\n\n${config.frameworkName} components follow WAI-ARIA guidelines.\n\nKey features:\n- Keyboard navigation support\n- Screen reader compatible\n- ARIA attributes included\n- Focus management\n\nFor detailed accessibility docs, visit: ${config.baseUrl}/${comp.name.toLowerCase()}`
                    }
                ]
            };
        }
    );

    // get_related_components
    server.registerTool(
        'get_related_components',
        {
            description: `Find ${config.frameworkName} components related to or similar to a given component`,
            inputSchema: {
                component: z.string().describe('Component name')
            }
        },
        async ({ component }) => {
            const comp = findComponent(data, component as string);
            const category = extractCategory(comp);
            const related = data.components.filter((c) => extractCategory(c) === category && c.name !== comp.name);

            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(
                            related.map((c) => ({ name: c.name, description: c.description })),
                            null,
                            2
                        )
                    }
                ]
            };
        }
    );

    // get_performance_tips
    server.registerTool(
        'get_performance_tips',
        {
            description: `Get performance optimization tips for a specific ${config.frameworkName} component`,
            inputSchema: {
                component: z.string().describe('Component name')
            }
        },
        async ({ component }) => {
            const comp = findComponent(data, component as string);
            const frameworkTips =
                config.slotKey === 'slots'
                    ? `3. Use computed properties for filtered/sorted data
4. Leverage Vue's built-in v-memo for expensive renders`
                    : `3. Use OnPush change detection strategy
4. Leverage Angular's signals for reactive state
5. Use trackBy in *ngFor for better rendering performance`;

            return {
                content: [
                    {
                        type: 'text',
                        text: `Performance tips for ${comp.name}:\n\n1. Use virtual scrolling for large datasets (if applicable)\n2. Enable lazy loading when available\n${frameworkTips}\n6. Consider pagination for data-heavy components\n7. Implement server-side operations for large data sets\n\nFor component-specific tips, visit: ${config.baseUrl}/${comp.name.toLowerCase()}`
                    }
                ]
            };
        }
    );

    // validate_props
    server.registerTool(
        'validate_props',
        {
            description: `Validate if props exist and are correctly used for a ${config.frameworkName} component`,
            inputSchema: {
                component: z.string().describe('Component name'),
                props: z.record(z.unknown()).describe('Props object to validate')
            }
        },
        async ({ component, props }) => {
            const comp = findComponent(data, component as string);
            const validProps = (comp.api.props || []).map((p) => p.name);
            const providedProps = Object.keys(props as Record<string, unknown>);

            const valid = providedProps.filter((p) => validProps.includes(p));
            const invalid = providedProps.filter((p) => !validProps.includes(p));

            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(
                            {
                                valid,
                                invalid,
                                message: invalid.length > 0 ? `Invalid props: ${invalid.join(', ')}` : 'All props are valid'
                            },
                            null,
                            2
                        )
                    }
                ]
            };
        }
    );

    // generate_component_template
    server.registerTool(
        'generate_component_template',
        {
            description: `Generate a basic template for a ${config.frameworkName} component with common props`,
            inputSchema: {
                component: z.string().describe('Component name'),
                include_events: z.boolean().optional().describe('Include event handlers')
            }
        },
        async ({ component, include_events }) => {
            const comp = findComponent(data, component as string);
            const props = comp.api.props || [];
            const emits = comp.api.emits || [];

            let template: string;
            let fullComponent: string;

            if (config.slotKey === 'slots') {
                // Vue template
                const tagName = comp.name;

                template = `<${tagName}`;
                const commonProps = props.slice(0, 3);

                commonProps.forEach((prop) => {
                    template += `\n  :${prop.name}="${prop.name}"`;
                });

                if (include_events && emits.length > 0) {
                    emits.slice(0, 2).forEach((event) => {
                        const handlerName = event.name.charAt(0).toUpperCase() + event.name.slice(1);

                        template += `\n  @${event.name}="on${handlerName}"`;
                    });
                }

                template += `\n/>`;

                fullComponent = `<script setup>
import ${comp.name} from 'primevue/${comp.name.toLowerCase()}';
${commonProps.map((p) => `const ${p.name} = ref(${p.default || 'null'});`).join('\n')}
${
    include_events && emits.length > 0
        ? emits
              .slice(0, 2)
              .map((e) => `const on${e.name.charAt(0).toUpperCase() + e.name.slice(1)} = (event) => {\n  console.log('${e.name}', event);\n};`)
              .join('\n')
        : ''
}
</script>

<template>
  ${template}
</template>`;
            } else {
                // Angular template
                const tagName = `p-${comp.name.toLowerCase()}`;

                template = `<${tagName}`;
                const commonProps = props.slice(0, 3);

                commonProps.forEach((prop) => {
                    template += `\n  [${prop.name}]="${prop.name}"`;
                });

                if (include_events && emits.length > 0) {
                    emits.slice(0, 2).forEach((event) => {
                        const handlerName = event.name.charAt(0).toUpperCase() + event.name.slice(1);

                        template += `\n  (${event.name})="on${handlerName}($event)"`;
                    });
                }

                template += `\n/>`;

                const className = comp.name.charAt(0).toUpperCase() + comp.name.slice(1);

                fullComponent = `import { Component } from '@angular/core';
import { ${className}Module } from 'primeng/${comp.name.toLowerCase()}';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [${className}Module],
  template: \`
    ${template}
  \`
})
export class ExampleComponent {
${commonProps.map((p) => `  ${p.name}: ${p.type.includes('|') ? 'any' : p.type} = ${p.default || 'undefined'};`).join('\n')}
${
    include_events && emits.length > 0
        ? emits
              .slice(0, 2)
              .map((e) => `\n  on${e.name.charAt(0).toUpperCase() + e.name.slice(1)}(event: any) {\n    console.log('${e.name}', event);\n  }`)
              .join('\n')
        : ''
}
}`;
            }

            return {
                content: [
                    {
                        type: 'text',
                        text: `## Template\n\`\`\`html\n${template}\n\`\`\`\n\n## Full Component\n\`\`\`${config.codeLanguage}\n${fullComponent}\n\`\`\``
                    }
                ]
            };
        }
    );

    // export_component_docs
    server.registerTool(
        'export_component_docs',
        {
            description: `Export complete documentation for a ${config.frameworkName} component in markdown format`,
            inputSchema: {
                component: z.string().describe('Component name')
            }
        },
        async ({ component }) => {
            const comp = findComponent(data, component as string);
            const props = comp.api.props || [];
            const emits = comp.api.emits || [];
            const slotsData = getSlotsOrTemplates(comp, config.slotKey) || [];
            const pt = comp.api.pt || [];

            let markdown = `# ${comp.title}\n\n`;

            markdown += `${comp.description}\n\n`;
            markdown += `**Documentation:** ${config.baseUrl}/${comp.name.toLowerCase()}\n\n`;

            if (props.length > 0) {
                markdown += `## Props\n\n`;
                markdown += `| Name | Type | Default | Description |\n`;
                markdown += `|------|------|---------|-------------|\n`;
                props.forEach((prop) => {
                    markdown += `| ${prop.name} | ${prop.type} | ${prop.default || '-'} | ${prop.description} |\n`;
                });
                markdown += `\n`;
            }

            if (emits.length > 0) {
                markdown += `## Events\n\n`;
                markdown += `| Name | Parameters | Description |\n`;
                markdown += `|------|------------|-------------|\n`;
                emits.forEach((event) => {
                    markdown += `| ${event.name} | ${event.parameters || '-'} | ${event.description} |\n`;
                });
                markdown += `\n`;
            }

            if (slotsData.length > 0) {
                markdown += `## ${config.slotKey === 'slots' ? 'Slots' : 'Templates'}\n\n`;
                markdown += `| Name | Parameters | Description |\n`;
                markdown += `|------|------------|-------------|\n`;
                slotsData.forEach((slot) => {
                    markdown += `| ${slot.name} | ${slot.parameters || '-'} | ${slot.description} |\n`;
                });
                markdown += `\n`;
            }

            if (pt.length > 0) {
                markdown += `## Pass Through (PT)\n\n`;
                markdown += `| Name | Description |\n`;
                markdown += `|------|-------------|\n`;
                pt.forEach((item) => {
                    markdown += `| ${item.name} | ${item.description} |\n`;
                });
                markdown += `\n`;
            }

            return {
                content: [{ type: 'text', text: markdown }]
            };
        }
    );
}
