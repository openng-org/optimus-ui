import fs from 'fs-extra';
import { globSync } from 'glob';
import { all as knownProperties } from 'known-css-properties';
import postcss from 'postcss';

export default function preBuild() {
    // validate CSS in all index.ts files
    globSync('src/**/index.ts').forEach((file) => {
        const content = fs.readFileSync(file, 'utf8');
        const regex = /\/\*css\*\/?\s*`([\s\S]*?)`/g;
        let match;

        while ((match = regex.exec(content)) !== null) {
            const css = match[1];

            try {
                const root = postcss.parse(css);
                let hasError = false;

                root.walkDecls((decl) => {
                    const { prop, value } = decl;

                    if (!knownProperties.includes(prop)) {
                        // eslint-disable-next-line no-console
                        console.error(`❌ Invalid CSS prop: \x1b[41m ${prop} \x1b[0m (value: "${value}") [line ${decl.source.start.line}](${file})\n`);
                        hasError = true;
                    }
                });

                if (hasError) process.exit(1);
            } catch (e) {
                // eslint-disable-next-line no-console
                console.error(`❌ Invalid CSS in ${file}: ${e.message}\n`);
                process.exit(1);
            }
        }
    });
}

preBuild();
