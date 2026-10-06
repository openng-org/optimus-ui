#!/usr/bin/env node
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import type { Manifest } from './manifest';
import { createServer } from './server';

const HELP = `optimus-ui-mcp: Model Context Protocol server for Optimus UI (stdio)

Usage: optimus-ui-mcp [--manifest <path>]

  --manifest <path>  Use another manifest.json, e.g. one built from a local checkout
  --help             Show this help

Register it with your agent, for example:
  claude mcp add optimus-ui -- npx -y @openng/optimus-ui-mcp`;

function main() {
    const args = process.argv.slice(2);
    if (args.includes('--help') || args.includes('-h')) {
        console.log(HELP);
        return;
    }

    const manifestFlag = args.indexOf('--manifest');
    const manifestPath = manifestFlag !== -1 ? args[manifestFlag + 1] : fileURLToPath(new URL('../data/manifest.json', import.meta.url));
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8')) as Manifest;

    if (manifest.schemaVersion !== 1) {
        throw new Error(`${manifestPath} has schema version ${manifest.schemaVersion}; this server reads version 1.`);
    }

    // stdout carries the protocol, so diagnostics go to stderr
    createServer(manifest)
        .connect(new StdioServerTransport())
        .then(() => console.error(`Optimus UI MCP server ${manifest.version} running on stdio`))
        .catch((error) => {
            console.error(error);
            process.exit(1);
        });
}

main();
