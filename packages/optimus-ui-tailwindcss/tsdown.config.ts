import { defineConfig } from 'tsdown';

const entry = {
    'v3/index': 'src/v3/index.ts'
};

const deps = {
    neverBundle: [/^tailwindcss\/(.*)$/]
};

// oxc's mangler has no terser-style `reserved` list, so keep names intact
const minify = { compress: true, mangle: false, codegen: true } as const;

// publishConfig pins the emitted names (v3/index.js, v3/index.cjs,
// v3/index.global.js), so each format gets its own build rather than one
// multi-format build: cjs needs an interop footer and iife needs a custom
// file name, and tsdown applies both options per build, not per format.
export default defineConfig([
    {
        entry,
        format: ['esm'],
        outDir: 'dist',
        dts: true,
        target: false,
        deps,
        minify,
        sourcemap: true,
        clean: true,
        // tsdown defaults esm to `.mjs`/`.d.mts`; publishConfig points at
        // `v3/index.js` and `v3/index.d.ts`
        outExtensions: () => ({ js: '.js', dts: '.d.ts' })
    },
    {
        entry,
        format: ['cjs'],
        outDir: 'dist',
        dts: false,
        target: false,
        deps,
        minify,
        sourcemap: true,
        clean: false,
        footer: {
            // https://github.com/egoist/tsup/issues/710
            js: `module.exports = module.exports.default || module.exports;`
        }
    },
    {
        entry,
        format: ['iife'],
        outDir: 'dist',
        dts: false,
        target: false,
        deps,
        minify,
        sourcemap: true,
        clean: false,
        outputOptions: {
            // tsdown appends an `.iife` suffix by default; publishConfig's unpkg
            // entry expects `v3/index.global.js`
            entryFileNames: '[name].global.js'
        }
    }
]);
