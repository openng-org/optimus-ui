// @ts-check

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const currentDir = path.dirname(fileURLToPath(import.meta.url));

const jsonDir = path.resolve(currentDir, '../src');
const jsDir = path.resolve(currentDir, '../dist/js');
const cjsDir = path.resolve(currentDir, '../dist/cjs');

// Files to exclude that are not locales
const specialFiles = new Set(['package.json', 'package-lock.json', 'tsconfig.json']);

// Read all files in the directory
try {
    // Remove the output directory if existing
    await fs.rm(jsDir, { force: true, recursive: true });
    await fs.rm(cjsDir, { force: true, recursive: true });

    // Create the output directory if missing
    await fs.mkdir(jsDir, { recursive: true });
    await fs.mkdir(cjsDir, { recursive: true });

    // Get the content of each JSON file, grouped by language code
    const messagesByLanguageCode = await readAllJsonFiles();

    // Find all keys from all translations
    const allKeys = findAllKeys(messagesByLanguageCode);

    // Validate we have a translation for each key.
    checkForMissingTranslations(allKeys, messagesByLanguageCode);

    // Write the locale.d.ts file with the base type
    await writeBaseTypeDeclarationFile(messagesByLanguageCode);

    // Write one en.js + en.d.ts file for each language
    for (const [languageCode, json] of messagesByLanguageCode) {
        await writeJavaScriptFile(languageCode, json);
        await writeTypeDeclarationFile(languageCode);
    }

    // Write a JavaScript and type declaration file that exports an object
    // with all messages for all locales.
    const allLocales = [...messagesByLanguageCode.keys()];
    allLocales.sort((x, y) => (x < y ? -1 : x > y ? 1 : 0));
    await writeAllJavaScriptFile(allLocales);
    await writeAllJavaScriptFileCommonJs(allLocales);
    await writeAllTypeDeclarationFile(allLocales);
} catch (err) {
    console.error('Error generating script file', err);
}

/**
 * Writes the base TypeScript declarations file with the type of all locales.
 * @param {Map<string, JSON>} messagesByLanguageCode JSON content by language code.
 * @returns {Promise<void>} A promise that resolves when the file was written.
 */
async function writeBaseTypeDeclarationFile(messagesByLanguageCode) {
    const en = messagesByLanguageCode.get('en');
    if (!en) {
        throw new Error('Missing messages for base locale <en>');
    }

    // Create the TypeScript type for the locales
    const localeType = createJsonType(en);

    // Use a d.ts file to store the common type
    const baseTypesFile = path.join(jsDir, 'locale.d.ts');
    const baseTypesFileCjs = path.join(cjsDir, 'locale.d.ts');

    // Create a single export statement for the locale type
    const baseTypesContent = ['/**', ' * Type to which all locales adhere, contains the keys present for each locale.', ' */', `export interface Locale ${localeType}`].join('\n');

    console.log(`Writing <${baseTypesFile}>`);
    await fs.writeFile(baseTypesFile, baseTypesContent, 'utf-8');

    console.log(`Writing <${baseTypesFileCjs}>`);
    await fs.writeFile(baseTypesFileCjs, baseTypesContent, 'utf-8');
}

/**
 * Writes the JavaScript file with the export statement that provides the
 * localized messages.
 * @param {string} languageCode The language code.
 * @param {JSON} json The localized messages for the language code.
 * @returns {Promise<void>} A promise that resolves when the file was written.
 */
async function writeJavaScriptFile(languageCode, json) {
    // Path to the generated JS file with the exports
    const jsFile = path.join(jsDir, `${languageCode}.js`);
    const cjsFile = path.join(cjsDir, `${languageCode}.js`);

    // Create the content of the JavaScript file that exports the messages
    const jsContent = [
        '// @ts-check',
        '',
        `/** @import { Locale } from "./locale.js"; */`,
        '',
        '/**',
        ` * Contains the localized messages for the locale ${languageCode}.`,
        ' * @type {Locale}',
        ' */',
        `export const ${languageCode} = ${JSON.stringify(json, null, 2)};`
    ].join('\n');

    // Creates a legacy CommonJS version of the file
    const cjsContent = [
        '// @ts-check',
        '',
        `/** @import { Locale } from "./locale.js"; */`,
        '',
        '/**',
        ` * Contains the localized messages for the locale ${languageCode}.`,
        ' * @type {Locale}',
        ' */',
        `module.exports.${languageCode} = ${JSON.stringify(json, null, 2)};`
    ].join('\n');

    // Write the ESM file to the disk
    console.log(`Writing <${jsFile}>`);
    await fs.writeFile(jsFile, jsContent, 'utf-8');

    // Write the CommonJS file to the disk
    console.log(`Writing <${cjsFile}>`);
    await fs.writeFile(cjsFile, cjsContent, 'utf-8');
}

/**
 * Writes the type declaration .d.ts file for the JavaScript file with the
 * messages for the given language code.
 * @param {string} languageCode The language code.
 * @returns {Promise<void>} A promise that resolves when the file was written.
 */
async function writeTypeDeclarationFile(languageCode) {
    // Path to the generated .d.ts file with the types
    const dTsFileEsm = path.join(jsDir, `${languageCode}.d.ts`);
    const dTsFileCjs = path.join(cjsDir, `${languageCode}.d.ts`);

    // Create the content of the type declarations file
    const dTsContent = [`import type { Locale } from "./locale.js";`, '', '/**', ` * Contains the localized messages for the locale ${languageCode}.`, ' */', `export declare const ${languageCode}: Locale;`].join('\n');

    // Write the file to the disk
    console.log(`Writing <${dTsFileEsm}>`);
    await fs.writeFile(dTsFileEsm, dTsContent, 'utf-8');

    console.log(`Writing <${dTsFileCjs}>`);
    await fs.writeFile(dTsFileCjs, dTsContent, 'utf-8');
}

/**
 * Writes a JavaScript file that exports the translations for all locales.
 * @param {string[]} allLanguages All language codes.
 * @returns {Promise<void>} A promise that resolves when the file was written.
 */
async function writeAllJavaScriptFile(allLanguages) {
    /** @type {string[]} */
    const allContent = [];

    allContent.push('// @ts-check');
    allContent.push('');

    for (const language of allLanguages) {
        allContent.push(`import { ${language} } from "./${language}.js";`);
    }

    allContent.push('');
    allContent.push('/**');
    allContent.push(' * An object with all messages for all languages.');
    allContent.push(' * The key is the language code, the value the messages.');
    allContent.push(' */');
    allContent.push('export const all = {');

    for (const locale of allLanguages) {
        const localeWithDash = locale.replace(/_/g, '-');
        allContent.push(`  ${locale},`);
        if (locale !== localeWithDash) {
            allContent.push(`  "${localeWithDash}": ${locale},`);
        }
    }

    allContent.push('};');

    const allFile = path.join(jsDir, 'all.js');

    // Write the file to the disk
    console.log(`Writing <${allFile}>`);
    await fs.writeFile(allFile, allContent.join('\n'), 'utf-8');
}

/**
 * Writes a JavaScript file (CommonJS) that exports the translations for all locales.
 * @param {string[]} allLanguages All language codes.
 * @returns {Promise<void>} A promise that resolves when the file was written.
 */
async function writeAllJavaScriptFileCommonJs(allLanguages) {
    /** @type {string[]} */
    const allContent = [];

    allContent.push('// @ts-check');
    allContent.push('');

    for (const language of allLanguages) {
        allContent.push(`const ${language} = require("./${language}.js").${language};`);
    }

    allContent.push('');
    allContent.push('/**');
    allContent.push(' * An object with all messages for all languages.');
    allContent.push(' * The key is the language code, the value the messages.');
    allContent.push(' */');
    allContent.push('module.exports.all = {');

    for (const locale of allLanguages) {
        const localeWithDash = locale.replace(/_/g, '-');
        allContent.push(`  ${locale},`);
        if (locale !== localeWithDash) {
            allContent.push(`  "${localeWithDash}": ${locale},`);
        }
    }

    allContent.push('};');

    const allFile = path.join(cjsDir, 'all.js');

    // Write the file to the disk
    console.log(`Writing <${allFile}>`);
    await fs.writeFile(allFile, allContent.join('\n'), 'utf-8');
}

/**
 * Writes a type declaration file that contains the type for the object with
 * all messages for all languages.
 * @param {string[]} allLanguages All language codes.
 * @returns {Promise<void>} A promise that resolves when the file was written.
 */
async function writeAllTypeDeclarationFile(allLanguages) {
    /** @type {string[]} */
    const allContent = [];

    allContent.push(`import type { Locale } from "./locale.js";`);

    allContent.push('');

    allContent.push('export interface AllLocales {');
    for (const language of allLanguages) {
        const languageWithDash = language.replace(/_/g, '-');
        allContent.push('  /**');
        allContent.push(`   * The localized messages for the language \`${language}\`.`);
        allContent.push('   */');
        allContent.push(`  ${language}: Locale;`);
        if (languageWithDash !== language) {
            allContent.push('  /**');
            allContent.push(`   * The localized messages for the language \`${language}\`.`);
            allContent.push('   */');
            allContent.push(`  "${languageWithDash}": Locale;`);
        }
    }
    allContent.push('}');

    allContent.push('');

    allContent.push('/**');
    allContent.push(' * An object with all messages for all languages.');
    allContent.push(' * The key is the language code, the value the messages.');
    allContent.push(' */');
    allContent.push('export declare const all: AllLocales;');

    const allFile = path.join(jsDir, 'all.d.ts');
    const allFileCjs = path.join(cjsDir, 'all.d.ts');

    // Write the file to the disk
    console.log(`Writing <${allFile}>`);
    await fs.writeFile(allFile, allContent.join('\n'), 'utf-8');

    console.log(`Writing <${allFileCjs}>`);
    await fs.writeFile(allFileCjs, allContent.join('\n'), 'utf-8');
}

/**
 * Reads the content of all JSON files. The key os the language code, the value
 * the JSON content.
 * @returns {Promise<Map<string, JSON>>} A map with all JSON files.
 */
async function readAllJsonFiles() {
    // Read all files in the json directory
    const files = await fs.readdir(jsonDir);

    // Find all JSON files
    const jsonFiles = files.filter((file) => path.extname(file) === '.json').filter((file) => !specialFiles.has(file));

    /** @type {Map<string, JSON>} */
    const messagesByLanguageCode = new Map();

    for (const jsonFile of jsonFiles) {
        // Extract the language code
        const basename = path.basename(jsonFile, '.json');
        const languageCode = basename.replace(/-/g, '_');

        // Read the content of the JSON file
        const jsonContent = await fs.readFile(path.join(jsonDir, jsonFile), 'utf-8');

        // and parse as JSON
        /** @type {JSON} */
        const json = JSON.parse(jsonContent);

        // The JSON must be an object and must contain exactly one key equal to the
        // language code.
        if (typeof json !== 'object' || json === null) {
            throw new Error(`File ${jsonFile} must contain an object`);
        }
        const keys = Object.keys(json);
        if (keys.length !== 1 || keys[0] !== basename) {
            throw new Error(`File ${jsonFile} must contain an object with only one key '${languageCode}'`);
        }

        messagesByLanguageCode.set(languageCode, json[basename]);
    }

    return messagesByLanguageCode;
}

/**
 * Finds all keys from all languages.
 * @param {Map<string, JSON>} messagesByLanguageCode JSON content by language code.
 * @returns {Set<String>} All keys.
 */
function findAllKeys(messagesByLanguageCode) {
    // Count how often each key occurs
    // @type {Map<string, number>}
    const allKeys = new Set();
    for (const json of messagesByLanguageCode.values()) {
        for (const key of Object.keys(json)) {
            allKeys.add(key);
        }
    }
    return allKeys;
}

/**
 * Checks which languages are missing translations and exits if any are missing.
 * @param {Set<string>} allKeys All keys from all languages.
 * @param {Map<string, JSON>} messagesByLanguageCode JSON content by language code.
 */
function checkForMissingTranslations(allKeys, messagesByLanguageCode) {
    let anyMissing = false;
    for (const [languageCode, json] of messagesByLanguageCode.entries()) {
        for (const key of allKeys) {
            if (!(key in json)) {
                console.error(`Language <${languageCode}> is missing translation for key ${key}`);
                anyMissing = true;
            } else {
                const message = json[key];
                if ((typeof message === 'string' && message.length === 0) || message === null) {
                    console.error(`Language <${languageCode}> has an empty translation for key ${key}`);
                    anyMissing = true;
                }
            }
        }
    }
    if (anyMissing) {
        process.exit(1);
    }
}

/**
 * Creates the TypeScript type for a JSON value.
 * @param {JSON} json A JSON value.
 * @returns {string} The TypeScript type.
 */
function createJsonType(json, indent = 0) {
    if (typeof json === 'object' && json === null) {
        return 'null';
    }

    if (typeof json === 'boolean') {
        return 'boolean';
    }

    if (typeof json === 'number') {
        return 'number';
    }

    if (typeof json === 'string') {
        return 'string';
    }

    // For an array, create an array type with the union of all elements
    if (Array.isArray(json)) {
        const allTypes = [...new Set(json.map((t) => createJsonType(t, indent + 1)))];
        allTypes.sort((x, y) => (x < y ? -1 : x > y ? 1 : 0));
        if (allTypes.length === 0) {
            return 'never[]';
        }
        if (allTypes.length === 1) {
            return `${allTypes[0]}[]`;
        }
        return `(${allTypes.map((t) => `(${t})`).join('|')})[]`;
    }

    // For an object, create an object type with properties
    if (typeof json === 'object' && json !== null) {
        /** @type {{name: string, type: string}[]} */
        const properties = [];
        for (const [name, value] of Object.entries(json)) {
            properties.push({ name, type: createJsonType(value, indent + 1) });
        }
        properties.sort((x, y) => (x.name < y.name ? -1 : x.name > y.name ? 1 : 0));
        const indentString = '  '.repeat(indent);
        const entries = properties.flatMap((p) => [`${indentString}  /**`, `${indentString}   * The localized value for the message key \`${p.name}\`.`, `${indentString}   */`, `${indentString}  ${p.name}: ${p.type},`]).join('\n');
        return `{\n${entries}\n${indentString}}`;
    }

    return 'unknown';
}
