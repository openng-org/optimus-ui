import type { KnipConfig } from 'knip';

const styleImport = /@(?:use|import|forward)\s+['"]([^'"]+)['"]/g;

// Turn a Sass `@import`/`@use` specifier into the module specifiers knip should follow.
// Knip's built-in SCSS compiler treats every unscoped specifier as a relative Sass file
// and appends `.scss`, so `quill/dist/quill.snow.css` and `./flags.css` never resolve.
function toModuleSpecifiers(specifier: string): string[] {
    if (specifier.startsWith('sass:')) return [];
    const isRelative = /^\.{0,2}\//.test(specifier);
    const hasStyleExtension = /\.(?:s?css|sass)$/.test(specifier);
    // bare package specifier: @openng/icons/openng-icons.css, quill/dist/quill.snow.css
    if (!isRelative && (specifier.startsWith('@') || hasStyleExtension)) return [specifier];
    // relative import with an explicit stylesheet extension
    if (hasStyleExtension) return [specifier];
    // Sass import without extension, resolved next to the importing file first:
    // `./layout/layout` or `mixins` -> layout.scss / _layout.scss, ./mixins.scss / ./_mixins.scss
    const slash = specifier.lastIndexOf('/');
    const dir = slash === -1 ? './' : specifier.slice(0, slash + 1);
    const name = specifier.slice(slash + 1);

    return [`${dir}${name}.scss`, `${dir}_${name}.scss`];
}

const config: KnipConfig = {
    // chart.js is an optional peer on purpose (loaded with a dynamic import), so
    // "referenced optional peerDependency" is the intended state, not a finding.
    exclude: ['optionalPeerDependencies'],

    compilers: {
        // apps/docs pulls @docsearch/css, @openng/icons and quill in through global.scss.
        scss: (text) =>
            Array.from(text.matchAll(styleImport), (match) => match[1])
                .flatMap(toModuleSpecifiers)
                .map((specifier) => `import '${specifier}';`)
                .join('\n')
    },

    workspaces: {
        '.': {
            // eslint.config.js is still written in the eslintrc style (extends/overrides
            // with string plugin names), which knip's ESLint plugin cannot read, so the
            // plugins and shareable configs it names are ignored by name here.
            ignoreDependencies: [/^@angular-eslint\//, /^eslint-(config|plugin)-/, '@typescript-eslint/eslint-plugin']
        },

        'packages/optimus-ui': {
            entry: [
                // ng-packagr primary entry (src/ng-package.json) and the secondary entry
                // points, one per src/<component>/ng-package.json
                'src/**/public_api.ts',
                // schematic factories listed in schematics/collection.json
                'schematics/*/index.ts'
            ]
        },

        // The tsdown configs compute their entry map with globSync('src/**/index.ts'),
        // which knip cannot evaluate from the repository root, so the pattern is
        // repeated here.
        'packages/optimus-ui-themes': {
            entry: ['src/**/index.ts']
        },
        'packages/optimus-ui-utils': {
            entry: ['src/**/index.ts']
        },
        'packages/optimus-ui-styles': {
            entry: ['src/**/index.ts']
        },

        'apps/docs': {
            entry: [
                // Vercel serverless function wired up in vercel.json ("functions")
                'api/**/*.mjs',
                // scripts/build-demo-code.mjs globs `**/*doc.ts` under each doc/<component>
                // directory and scripts/build-llm-docs.mjs walks the same tree, both reading
                // from disk rather than through imports. Every file here is therefore an
                // entry point of the docs content pipeline, whether or not a page renders it:
                // it produces an entry in public/demos.json and a section in public/llms.
                'doc/**/*doc.ts'
            ],
            // Component stylesheets are referenced through Angular's styleUrl(s), which
            // knip does not read. assets/styles is reached from global.scss and stays in scope.
            ignoreFiles: ['components/**/*.scss', 'pages/**/*.scss'],
            // prismjs is loaded through the node_modules paths in angular.json "scripts",
            // which knip does not map back to the package.
            ignoreDependencies: ['prismjs']
        },

        'apps/tailwind-playgrounds/*': {
            // index.html links tailwind.css, which is where tailwindcss and the
            // @openng/optimus-ui-tailwindcss plugin are imported.
            entry: ['tailwind.css']
        }
    }
};

export default config;
