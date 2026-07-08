import { globSync } from 'glob';
import { defineConfig } from 'tsup';

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
        external: [/^@primeuix\/(.*)$/],
        minify: isProduction ? 'terser' : false,
        sourcemap: isProduction,
        splitting: false,
        clean: isProduction,
        terserOptions: {
            mangle: {
                reserved: ['theme', 'style', 'css']
            }
        }
    },
    {
        entry: {
            index: 'src/index.ts',
            types: 'src/types.ts'
        },
        format: ['esm'],
        outDir: 'dist',
        dts: true,
        external: [/^@primeuix\/(.*)$/],
        minify: isProduction,
        sourcemap: isProduction,
        splitting: false
    }
]);
