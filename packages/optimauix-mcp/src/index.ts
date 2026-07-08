/**
 * @@primeuix/mcp - Shared core for PrimeVue and PrimeNG MCP servers
 *
 * This package provides a factory function to create MCP servers for Prime UI libraries.
 * It handles all the common functionality: component tools, guide tools, search tools, etc.
 * Framework-specific customizations are passed via the config object.
 *
 * @example
 * ```typescript
 * import { createPrimeMcpServer } from '@primemcp/core';
 *
 * const server = await createPrimeMcpServer({
 *   name: '@primevue/mcp',
 *   version: '1.0.0',
 *   baseUrl: 'https://primevue.org',
 *   frameworkName: 'PrimeVue',
 *   slotKey: 'slots',
 *   codeLanguage: 'javascript',
 *   compatibility: 'Vue 3.x',
 *   loadComponentsData: async () => {
 *     // Load your components.json data
 *   },
 * });
 * ```
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

import { registerComponentTools, registerExampleTools, registerGuideTools, registerSearchTools } from './tools/index.js';
import type { ComponentsData, CustomToolDefinition, PrimeMcpConfig, ToolResult } from './types.js';

// Re-export types
export type { Component, ComponentAPI, ComponentsData, CustomToolDefinition, EmitInfo, KeywordMapping, MethodInfo, Page, PassThroughInfo, PrimeMcpConfig, PropInfo, Section, SlotInfo, StyleInfo, TokenInfo, ToolResult } from './types.js';

// Re-export helpers
export { DATA_COMPONENT_NAMES, DEFAULT_KEYWORD_MAPPING, extractCategory, findComponent, findGuide, FORM_COMPONENT_NAMES, getGuideContent, getSlotsOrTemplates, getSlotsOrTemplatesCount, OVERLAY_COMPONENT_NAMES } from './helpers.js';

// Re-export tool registration functions for advanced customization
export { registerComponentTools, registerExampleTools, registerGuideTools, registerSearchTools } from './tools/index.js';

/**
 * Create and configure an MCP server for a Prime UI library
 *
 * @param config - Server configuration
 * @returns Configured McpServer instance (not yet connected)
 */
export async function createPrimeMcpServer(config: PrimeMcpConfig): Promise<McpServer> {
    // Load component data
    const data = await config.loadComponentsData();

    // Create MCP server
    const server = new McpServer(
        {
            name: config.name,
            version: config.version
        },
        {
            capabilities: {
                tools: {},
                resources: {}
            }
        }
    );

    // Register all core tools
    registerComponentTools(server, data, config);
    registerGuideTools(server, data, config);
    registerSearchTools(server, data, config);
    registerExampleTools(server, data, config);

    // Register custom framework-specific tools
    if (config.customTools && config.customTools.length > 0) {
        registerCustomTools(server, data, config.customTools);
    }

    return server;
}

/**
 * Register custom/framework-specific tools
 */
function registerCustomTools(server: McpServer, data: ComponentsData, customTools: CustomToolDefinition[]): void {
    for (const tool of customTools) {
        // Convert our parameter format to MCP's expected format
        const params: Record<string, { type: string; description: string }> = {};

        for (const [key, value] of Object.entries(tool.parameters)) {
            params[key] = {
                type: value.type,
                description: value.description
            };
        }

        server.tool(tool.name, tool.description, params, async (args) => {
            const result = await tool.handler(data, args as Record<string, unknown>);

            return result as ToolResult & { [x: string]: unknown };
        });
    }
}

/**
 * Run the MCP server with stdio transport
 *
 * This is a convenience function that creates and runs the server.
 * For more control, use createPrimeMcpServer directly.
 *
 * @param config - Server configuration
 */
export async function runPrimeMcpServer(config: PrimeMcpConfig): Promise<void> {
    try {
        const server = await createPrimeMcpServer(config);
        const transport = new StdioServerTransport();

        await server.connect(transport);
        // eslint-disable-next-line no-console
        console.error(`${config.frameworkName} MCP Server running on stdio`);
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`Failed to start ${config.frameworkName} MCP Server:`, error);
        process.exit(1);
    }
}
