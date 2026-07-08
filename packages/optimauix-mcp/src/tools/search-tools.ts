/**
 * @primeuix/mcp - Search and suggestion tool factories
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { DATA_COMPONENT_NAMES, DEFAULT_KEYWORD_MAPPING, FORM_COMPONENT_NAMES, OVERLAY_COMPONENT_NAMES } from '../helpers.js';
import type { ComponentsData, PrimeMcpConfig } from '../types.js';

/**
 * Register all search and suggestion tools on the MCP server
 */
export function registerSearchTools(server: McpServer, data: ComponentsData, config: PrimeMcpConfig): void {
    // find_components_with_feature
    server.registerTool(
        'find_components_with_feature',
        {
            description: `Find ${config.frameworkName} components that support a specific feature (e.g., 'filter', 'lazy', 'virtual', 'template', 'multiple', 'disabled')`,
            inputSchema: {
                feature: z.string().describe('Feature to search for in component sections')
            }
        },
        async ({ feature }) => {
            const featureLower = (feature as string).toLowerCase();
            const matches = data.components.filter((c) => c.sections.some((s) => s.id.toLowerCase().includes(featureLower) || s.label.toLowerCase().includes(featureLower)));

            if (matches.length === 0) {
                return {
                    content: [{ type: 'text', text: `No components found with feature "${feature}".` }]
                };
            }

            const results = matches.map((c) => ({
                component: c.name,
                title: c.title,
                matching_sections: c.sections.filter((s) => s.id.toLowerCase().includes(featureLower) || s.label.toLowerCase().includes(featureLower)).map((s) => s.id)
            }));

            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify({ feature, total_matches: results.length, components: results }, null, 2)
                    }
                ]
            };
        }
    );

    // search_all
    server.registerTool(
        'search_all',
        {
            description: `Search across all ${config.frameworkName} components, guides, props, and examples`,
            inputSchema: {
                query: z.string().describe('Search query')
            }
        },
        async ({ query }) => {
            const queryLower = (query as string).toLowerCase();

            // Search components
            const componentMatches = data.components
                .filter((c) => c.name.toLowerCase().includes(queryLower) || c.title.toLowerCase().includes(queryLower) || c.description.toLowerCase().includes(queryLower))
                .slice(0, 5)
                .map((c) => ({
                    name: c.name,
                    title: c.title,
                    description: c.description.slice(0, 100)
                }));

            // Search props
            const propMatches: { component: string; prop: string; type: string }[] = [];

            data.components.forEach((c) => {
                c.api.props?.forEach((p) => {
                    if (p.name.toLowerCase().includes(queryLower)) {
                        propMatches.push({ component: c.name, prop: p.name, type: p.type });
                    }
                });
            });

            // Search guides
            const guideMatches = (data.pages || [])
                .filter((p) => p.name.toLowerCase().includes(queryLower) || p.title.toLowerCase().includes(queryLower))
                .slice(0, 5)
                .map((p) => ({ name: p.name, title: p.title }));

            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(
                            {
                                query,
                                results: {
                                    components: componentMatches,
                                    props: propMatches.slice(0, 10),
                                    guides: guideMatches
                                }
                            },
                            null,
                            2
                        )
                    }
                ]
            };
        }
    );

    // suggest_component
    server.registerTool(
        'suggest_component',
        {
            description: `Suggest ${config.frameworkName} components based on a use case description`,
            inputSchema: {
                use_case: z.string().describe("Description of what you want to build (e.g., 'data table with sorting', 'date picker', 'file upload', 'dropdown menu')")
            }
        },
        async ({ use_case }) => {
            const useCaseLower = (use_case as string).toLowerCase();
            const matchedComponents = new Set<string>();

            // Find matches based on keywords
            Object.entries(DEFAULT_KEYWORD_MAPPING).forEach(([keyword, components]) => {
                if (useCaseLower.includes(keyword)) {
                    components.forEach((c) => matchedComponents.add(c));
                }
            });

            // Also search by component name/description
            data.components.forEach((c) => {
                if (c.name.toLowerCase().includes(useCaseLower) || c.title.toLowerCase().includes(useCaseLower) || c.description.toLowerCase().includes(useCaseLower)) {
                    matchedComponents.add(c.name.toLowerCase());
                }
            });

            const suggestions = Array.from(matchedComponents)
                .map((name) => {
                    const comp = data.components.find((c) => c.name.toLowerCase() === name.toLowerCase());

                    return comp
                        ? {
                              name: comp.name,
                              title: comp.title,
                              description: comp.description,
                              url: `${config.baseUrl}/${comp.name.toLowerCase()}`
                          }
                        : null;
                })
                .filter(Boolean)
                .slice(0, 8);

            if (suggestions.length === 0) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `No specific suggestions for "${use_case}". Try browsing components by category using list_components or get_form_components/get_data_components.`
                        }
                    ]
                };
            }

            return {
                content: [{ type: 'text', text: JSON.stringify({ use_case, suggestions }, null, 2) }]
            };
        }
    );

    // get_form_components
    server.registerTool(
        'get_form_components',
        {
            description: `Get all ${config.frameworkName} form input components`
        },
        async () => {
            const formComponents = data.components
                .filter((c) => FORM_COMPONENT_NAMES.includes(c.name.toLowerCase()))
                .map((c) => ({
                    name: c.name,
                    title: c.title,
                    description: c.description,
                    props_count: c.api.props?.length || 0,
                    has_validation: c.sections.some((s) => s.id.includes('form') || s.id.includes('invalid'))
                }));

            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify({ category: 'Form Components', total: formComponents.length, components: formComponents }, null, 2)
                    }
                ]
            };
        }
    );

    // get_data_components
    server.registerTool(
        'get_data_components',
        {
            description: `Get all ${config.frameworkName} data display components (tables, lists, trees)`
        },
        async () => {
            const dataComponents = data.components
                .filter((c) => DATA_COMPONENT_NAMES.includes(c.name.toLowerCase()))
                .map((c) => ({
                    name: c.name,
                    title: c.title,
                    description: c.description,
                    features: c.sections
                        .filter((s) => !['import', 'accessibility', 'basic'].includes(s.id))
                        .map((s) => s.id)
                        .slice(0, 10)
                }));

            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify({ category: 'Data Components', total: dataComponents.length, components: dataComponents }, null, 2)
                    }
                ]
            };
        }
    );

    // get_overlay_components
    server.registerTool(
        'get_overlay_components',
        {
            description: `Get all ${config.frameworkName} overlay/popup components (dialogs, drawers, popovers, tooltips)`
        },
        async () => {
            const overlayComponents = data.components
                .filter((c) => OVERLAY_COMPONENT_NAMES.includes(c.name.toLowerCase()))
                .map((c) => ({
                    name: c.name,
                    title: c.title,
                    description: c.description
                }));

            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify({ category: 'Overlay Components', total: overlayComponents.length, components: overlayComponents }, null, 2)
                    }
                ]
            };
        }
    );
}
