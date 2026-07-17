import { globSync } from 'glob';
import { defineConfig, type UserConfig } from 'tsdown';

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
        target: false,
        deps: {
            neverBundle: [/^@openng\/optimus-ui-(.*)$/]
        },
        // oxc's mangler has no terser-style `reserved` list, so keep names intact
        minify: isProduction ? { compress: true, mangle: false, codegen: true } : false,
        sourcemap: isProduction,
        clean: isProduction
    },
    ...themes.map<UserConfig>((theme) => {
        const name = theme.charAt(0).toUpperCase() + theme.slice(1);
        const globalName = `Optimus.Themes.${name}`;

        return {
            entry: {
                [theme]: `src/presets/${theme}/index.ts`
            },
            format: ['iife'],
            outDir: 'umd',
            globalName,
            dts: false,
            target: false,
            minify: { compress: true, mangle: false, codegen: true },
            watch: false,
            clean: false,
            outputOptions: {
                // tsdown appends an `.iife` suffix by default; keep the plain `<theme>.js` name
                entryFileNames: '[name].js'
            },
            footer: {
                // https://github.com/egoist/tsup/issues/710
                js: `${globalName} = ${globalName}.default || ${globalName};`
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
        target: false,
        minify: isProduction ? { compress: true, mangle: false, codegen: true } : false,
        sourcemap: isProduction,
        clean: isProduction
    }
]);
