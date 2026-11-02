import { defineConfig } from 'tsdown';

export default defineConfig({
    entry: { index: 'src/index.ts' },
    format: ['esm'],
    platform: 'node',
    outDir: 'dist',
    dts: false,
    target: 'node20',
    // Dependencies install with the package; only the server code is bundled
    deps: { neverBundle: [/^@modelcontextprotocol\//, /^zod/] },
    clean: true
});
