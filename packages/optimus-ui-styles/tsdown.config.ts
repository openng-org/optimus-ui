import { globSync } from 'glob';
import { defineConfig } from 'tsdown';

const isProduction = process.env.NODE_ENV === 'production';

const entry = globSync('src/**/index.ts').reduce((acc: Record<string, string>, file: string) => {
    const name = file.replace(/^src\//, '').replace(/\.ts$/, '');

    acc[name] = file;

    return acc;
}, {});

export default defineConfig([
    {
        entry,
        format: ['esm'],
        outDir: 'dist',
        dts: false,
        target: false,
        deps: {
            neverBundle: [/^@openng\/optimus-ui-(.*)$/]
        },
        // oxc's mangler has no terser-style `reserved` list, so keep names intact
        minify: isProduction ? { compress: true, mangle: false, codegen: true } : false,
        sourcemap: isProduction,
        clean: isProduction
    },
    {
        entry: {
            index: 'src/index.ts',
            types: 'src/types.ts'
        },
        format: ['esm'],
        outDir: 'dist',
        dts: true,
        target: false,
        deps: {
            neverBundle: [/^@openng\/optimus-ui-(.*)$/]
        },
        minify: isProduction,
        sourcemap: isProduction,
        clean: false
    }
]);
