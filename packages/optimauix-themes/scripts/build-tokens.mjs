import fs from 'fs';
import path from 'path';
import * as prettier from 'prettier';
import * as TypeDoc from 'typedoc';
import { resolvePath } from '../../../scripts/build-helper.mjs';

const { __dirname } = resolvePath(import.meta.url);

//const INPUT_PATH = path.resolve(__dirname, '../src');
const OUTPUT_PATH = path.resolve(__dirname, '../');
const OUTPUT_FILE = path.resolve(OUTPUT_PATH, 'tokens.ts');

const parseText = (text) => {
    return text.replace(/&#123;/g, '{').replace(/&#125;/g, '}');
};

const setTokens = (doc, moduleName, declaration, name) => {
    doc[moduleName]['tokens'] ||= [];

    if (declaration?.groups) {
        const event_props_group = declaration.groups.find((g) => g.title === 'Properties');
        const toUncapitalized = (str) => str.charAt(0).toLowerCase() + str.slice(1);

        event_props_group?.children?.forEach((prop) => {
            const computedName = toUncapitalized(name ? `${name}.${prop.name}` : prop.name);

            if (prop.type?.declaration) {
                setTokens(doc, moduleName, prop.type?.declaration, computedName);
            } else if (prop.comment?.getTag('@designToken')) {
                const variable = prop.comment.getTag('@designToken').content[0]?.text || '';

                doc[moduleName]['tokens'].push({
                    name: moduleName + '.' + computedName,
                    token: variable,
                    variable: '--p-' + variable.replaceAll('.', '-'),
                    description: prop.comment?.summary
                        .map((s) => {
                            if (s.text.indexOf('[here]') > -1) {
                                return `${s.text.slice(0, s.text.indexOf('[here]'))} <a target="_blank" href="${s.text.slice(s.text.indexOf('(') + 1, s.text.indexOf(')'))}">here</a> ${s.text.slice(s.text.indexOf(')') + 1)}`;
                            }

                            return s.text || '';
                        })
                        .join(' '),
                    deprecated: prop.comment.getTag('@deprecated') ? parseText(prop.comment.getTag('@deprecated').content[0]?.text) : undefined
                });
            }
        });
    }
};

const findInInterfaces = (doc, module, name) => {
    const module_interfaces_group = module.groups?.find((g) => g.title === 'Interfaces');

    module_interfaces_group?.children?.forEach((_interface) => {
        setTokens(doc, name, _interface, _interface.name);
    });
};

const findInNamespaces = (doc, module, name) => {
    const module_namespaces_group = module.groups?.find((g) => g.title === 'Namespaces');

    module_namespaces_group?.children?.forEach((_namespace) => {
        const module_interfaces_group = _namespace.groups?.find((g) => g.title === 'Interfaces');

        module_interfaces_group?.children?.forEach((_interface) => {
            setTokens(doc, name, _interface, _interface.name);
        });
    });
};

async function run() {
    const app = await TypeDoc.Application.bootstrapWithPlugins({
        name: 'PrimeUIX-Themes',
        entryPoints: ['types'],
        entryPointStrategy: 'expand',
        hideGenerator: true,
        excludeExternals: false,
        includeVersion: true,
        searchInComments: true,
        disableSources: true,
        sort: ['source-order']
    });

    const project = await app.convert();

    if (project) {
        const doc = {};

        project.children.forEach((module) => {
            const { name, comment } = module;

            if (name !== 'index') {
                const description = comment?.summary?.map((s) => s.text || '').join(' ');

                doc[name] = {
                    description
                };

                findInInterfaces(doc, module, name);
                findInNamespaces(doc, module, name);
            }
        });

        if (!fs.existsSync(OUTPUT_PATH)) fs.mkdirSync(OUTPUT_PATH);
        const metadata = `/***************** PrimeUIX Tokens (Auto-Generated) *****************/
export interface TokenMetaData {
    description: string;
    tokens: {
        name: string;
        token: string;
        variable: string;
        description: string;
    }[];
}

export interface Tokens {
${Object.keys(doc)
    .map((key) => `    ${key}: TokenMetaData;`)
    .join('\n')}
}

export default ${JSON.stringify(doc, null, 4)} as Tokens;
`;

        prettier.resolveConfig(__dirname).then(async (config) => {
            const formattedData = await prettier.format(metadata, { ...config, parser: 'typescript' });

            fs.writeFileSync(OUTPUT_FILE, formattedData);
        });
    }
}

// eslint-disable-next-line no-console
run().catch(console.error);
