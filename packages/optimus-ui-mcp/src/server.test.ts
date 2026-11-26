import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { readFileSync } from 'node:fs';
import { beforeAll, describe, expect, it } from 'vitest';
import type { Manifest } from './manifest';
import { createServer } from './server';

const manifest = JSON.parse(readFileSync(new URL('../data/manifest.json', import.meta.url), 'utf-8')) as Manifest;
let client: Client;

async function call(name: string, args: Record<string, unknown> = {}) {
    const result = await client.callTool({ name, arguments: args });
    return { text: (result.content as { type: string; text: string }[]).map((c) => c.text).join('\n'), isError: !!result.isError };
}

beforeAll(async () => {
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    await createServer(manifest).connect(serverTransport);
    client = new Client({ name: 'test', version: '1.0.0' });
    await client.connect(clientTransport);
});

describe('optimus-ui MCP server', () => {
    it('advertises read-only tools and instructions', async () => {
        const { tools } = await client.listTools();
        expect(tools.map((t) => t.name).sort()).toEqual(['get_component', 'get_example', 'get_guide', 'get_type', 'list_components', 'search']);
        expect(tools.every((t) => t.annotations?.readOnlyHint)).toBe(true);
        expect(client.getInstructions()).toContain('Optimus UI');
    });

    it('get_component returns imports, inputs with allowed values and examples', async () => {
        const { text, isError } = await call('get_component', { name: 'p-select' });
        expect(isError).toBe(false);
        expect(text).toContain("from '@openng/optimus-ui/select'");
        expect(text).toContain('works with ngModel, formControl and formControlName');
        expect(text).toMatch(/- options: /);
        expect(text).toContain('## Examples (get_example)');
    });

    it('get_component marks two-way bindings and adds CSS classes on request', async () => {
        const { text } = await call('get_component', { name: 'dialog', include: ['cssClasses'] });
        expect(text).toContain('two-way [(visible)]');
        expect(text).toContain('.p-dialog');
    });

    it('get_component suggests names for typos', async () => {
        const { text, isError } = await call('get_component', { name: 'datepiker' });
        expect(isError).toBe(true);
        expect(text).toContain('datepicker');
    });

    it('get_example lists sections and returns code', async () => {
        const list = await call('get_example', { component: 'button' });
        expect(list.text).toContain('- basic: Basic');
        const example = await call('get_example', { component: 'button', section: 'basic' });
        expect(example.text).toContain('```typescript');
        expect(example.text).toContain("from '@openng/optimus-ui/button'");
    });

    it('get_type and get_guide answer', async () => {
        expect((await call('get_type', { name: 'MenuItem' })).text).toContain("import { MenuItem } from '@openng/optimus-ui/api'");
        expect((await call('get_guide', { name: 'installation' })).text).toContain('# Installation');
    });

    it('search points at the next tool call', async () => {
        const { text } = await call('search', { query: 'tooltip position' });
        expect(text).toContain('→ get_component({ "name": "tooltip" })');
    });
});
