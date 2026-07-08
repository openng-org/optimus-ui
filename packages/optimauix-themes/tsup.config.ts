import { globSync } from 'glob';
import { defineConfig, type Options } from 'tsup';

const isProduction = process.env.NODE_ENV === 'production';
const themes: string[] = [];

const entry = globSync('src/**/index.ts').reduce((acc: Record<string, string>, file: string) => {
    const name = file.replace(/^src\//, '').replace(/\.ts$/, '');
    const themeName: string | undefined = name.startsWith('presets/') ? name.split('/')?.[1] : undefined;

    if (themeName && !themes.includes(themeName)) themes.push(themeName);

    acc[name.replace(/^presets\//, '')] = file;

    return acc;
}, {});

export default defineConfig([
    {
        entry,
        format: ['esm'],
        outDir: 'dist',
        dts: {
            entry: ['src/index.ts']
        },
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
    ...themes.map<Options>((theme) => {
        const name = theme.charAt(0).toUpperCase() + theme.slice(1);
        const globalName = `PrimeUIX.Themes.${name}`;

        return {
            entry: {
                [theme]: `src/presets/${theme}/index.ts`
            },
            format: ['iife'],
            outDir: 'umd',
            globalName,
            minify: 'terser',
            watch: false,
            clean: isProduction,
            terserOptions: {
                mangle: {
                    reserved: ['theme', 'style', 'css']
                }
            },
            outExtension: () => ({ js: `.js` }),
            esbuildOptions(options) {
                options.footer = {
                    // https://github.com/egoist/tsup/issues/710
                    js: `${globalName} = ${globalName}.default || ${globalName};`
                };
            }
        };
    }),
    {
        entry: {
            index: 'tokens.ts'
        },
        format: ['esm'],
        outDir: 'tokens',
        dts: true,
        minify: isProduction ? 'terser' : false,
        sourcemap: isProduction,
        splitting: false,
        clean: isProduction
    }
]);
