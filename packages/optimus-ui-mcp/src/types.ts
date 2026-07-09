/**
 * @primeuix/mcp - Shared types for PrimeVue and PrimeNG MCP servers
 */

// API Types
export interface PropInfo {
    name: string;
    type: string;
    default?: string;
    description: string;
}

export interface SlotInfo {
    name: string;
    parameters?: string;
    description: string;
}

export interface EmitInfo {
    name: string;
    parameters?: string;
    description: string;
}

export interface MethodInfo {
    name: string;
    parameters?: string;
    returnType?: string;
    description: string;
}

export interface PassThroughInfo {
    name: string;
    description: string;
}

export interface TokenInfo {
    token: string;
    variable: string;
    description: string;
}

export interface StyleInfo {
    class: string;
    description: string;
}

export interface ComponentAPI {
    props: PropInfo[] | null;
    slots?: SlotInfo[] | null; // PrimeVue uses slots
    templates?: SlotInfo[] | null; // PrimeNG uses templates
    emits: EmitInfo[] | null;
    methods?: MethodInfo[] | null; // PrimeNG has methods
    pt: PassThroughInfo[] | null;
    styles: StyleInfo[] | null;
    tokens: TokenInfo[] | null;
}

export interface Section {
    id: string;
    label: string;
    description: string;
    examples: Record<string, string> | null;
}

export interface Component {
    name: string;
    title: string;
    description: string;
    sections: Section[];
    api: ComponentAPI;
}

export interface Page {
    name: string;
    path: string;
    title: string;
    description: string;
    sections: Section[];
}

export interface ComponentsData {
    version: string;
    generatedAt: string;
    components: Component[];
    pages?: Page[];
}

// MCP Server Configuration
export interface PrimeMcpConfig {
    /** Server name (e.g., '@primevue/mcp' or '@primeng/mcp') */
    name: string;
    /** Server version */
    version: string;
    /** Base URL for documentation links (e.g., 'https://primevue.org') */
    baseUrl: string;
    /** Framework name for display purposes */
    frameworkName: string;
    /** Key used for slots/templates in the API ('slots' for Vue, 'templates' for Angular) */
    slotKey: 'slots' | 'templates';
    /** Code language for examples ('javascript' for Vue, 'typescript' for Angular) */
    codeLanguage: 'javascript' | 'typescript';
    /** Vue compatibility string (e.g., 'Vue 3.x') or Angular compatibility (e.g., 'Angular 17+') */
    compatibility: string;
    /** Function to load components data */
    loadComponentsData: () => Promise<ComponentsData>;
    /** Optional: Custom tools to add to the server */
    customTools?: CustomToolDefinition[];
}

// Tool definition for custom/framework-specific tools
export interface CustomToolDefinition {
    name: string;
    description: string;
    parameters: Record<
        string,
        {
            type: string;
            description: string;
            required?: boolean;
            default?: unknown;
        }
    >;
    handler: (data: ComponentsData, args: Record<string, unknown>) => Promise<ToolResult>;
}

// Tool result type
export interface ToolResult {
    [x: string]: unknown;
    content: Array<{
        type: 'text';
        text: string;
    }>;
    _meta?: Record<string, unknown>;
    isError?: boolean;
}

// Category keywords mapping for component suggestions
export type KeywordMapping = Record<string, string[]>;
