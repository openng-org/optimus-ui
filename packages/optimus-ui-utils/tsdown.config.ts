import { globSync } from 'glob';
import { defineConfig } from 'tsdown';

const isProduction = process.env.NODE_ENV === 'production';

const entry = globSync('src/**/index.ts').reduce((acc: Record<string, string>, file: string) => {
    const name = file.replace(/^src\//, '').replace(/\.ts$/, '');

    acc[name] = file;

    return acc;
}, {});

export default defineConfig({
    entry,
    format: ['esm'],
    outDir: 'dist',
    dts: true,
    target: false,
    deps: {
        neverBundle: [/^@openng\/optimus-ui-(.*)$/]
    },
    minify: isProduction,
    sourcemap: isProduction,
    clean: isProduction
});
